"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { mapConfig, MapCategory, MapLocation } from "@/config/trip";
import {
  Map as MapIcon,
  Star,
  Filter,
  Navigation,
  ChevronDown,
  Layers,
  Moon,
  Sun,
  Satellite,
  Copy,
  Check,
  MapPin,
  Car,
  Bike,
  Footprints,
  Route,
  Home,
  Loader2,
  Globe,
  ChevronUp,
  List,
} from "lucide-react";

// Villaens koordinater og adresse
const villaLocation = mapConfig.locations.find((loc) => loc.category === "villa");
const villaCoords = villaLocation?.coordinates || mapConfig.center;
const villaAddress = villaLocation?.address || "Tapada da Penina, n.º 26, 8500-051 Alvor";

// Route data type
interface RouteData {
  coordinates: [number, number][];
  distance: number; // km
  duration: number; // minutter
  profile: "driving" | "cycling" | "walking";
}

// Cache for ruter
const routeCache = new Map<string, RouteData>();

// Hent rute fra OSRM API
async function fetchRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
  profile: "driving" | "cycling" | "foot" = "driving"
): Promise<RouteData | null> {
  const cacheKey = `${fromLat},${fromLon}-${toLat},${toLon}-${profile}`;
  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey)!;
  }

  try {
    // OSRM bruker lon,lat rekkefølge
    const url = `https://router.project-osrm.org/route/v1/${profile}/${fromLon},${fromLat};${toLon},${toLat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok" && data.routes?.[0]) {
      const route = data.routes[0];
      const routeData: RouteData = {
        // GeoJSON bruker [lon, lat], vi trenger [lat, lon] for Leaflet
        coordinates: route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
        ),
        distance: route.distance / 1000, // meter til km
        duration: route.duration / 60, // sekunder til minutter
        profile: profile === "foot" ? "walking" : profile,
      };
      routeCache.set(cacheKey, routeData);
      return routeData;
    }
  } catch (error) {
    console.error("Kunne ikke hente rute:", error);
  }
  return null;
}

// Formater reisetid
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}t ${m}m` : `${h}t`;
}

// Formater avstand
function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Beregn avstand mellom to koordinater (Haversine formula) - for lokasjonslisten
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Jordens radius i km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generer Google Maps directions URL
function getDirectionsUrl(
  destLat: number,
  destLon: number,
  mode: "walking" | "bicycling" | "driving"
) {
  return `https://www.google.com/maps/dir/?api=1&origin=${villaCoords[0]},${villaCoords[1]}&destination=${destLat},${destLon}&travelmode=${mode}`;
}

// Kartvisninger
type MapStyle = "dark" | "light" | "satellite";

const mapStyles: Record<MapStyle, { label: string; icon: typeof Moon; url: string; attribution: string }> = {
  dark: {
    label: "Mørk",
    icon: Moon,
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  light: {
    label: "Lys",
    icon: Sun,
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  },
  satellite: {
    label: "Satelitt",
    icon: Satellite,
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
};

// Dynamisk import av kart-komponenter (krever window)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

// SVG ikoner for markører (minimalistiske)
const markerSvgIcons: Record<MapCategory, string> = {
  villa: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  beach: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  restaurant: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>`,
  bar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  sightseeing: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  airport: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
  supermarket: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  golf: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="18" r="3"/><path d="M12 15V4"/><path d="M12 4l6 3-6 3"/></svg>`,
  waterpark: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l3 10h10l3-10"/><path d="M12 14v6"/><path d="M8 20h8"/><circle cx="12" cy="7" r="2"/></svg>`,
};

// Custom hook for å lage ikoner
function useMarkerIcon(category: MapCategory) {
  const config = mapConfig.categories[category];

  if (typeof window === "undefined") return null;

  const L = require("leaflet");
  const svgIcon = markerSvgIcons[category];

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${config.color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px ${config.color}50, 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid rgba(255,255,255,0.9);
      ">
        <div style="
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">${svgIcon}</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
}

// Enkel marker-komponent uten popup (info vises i sidebar)
function LocationMarker({
  location,
  onSelect,
}: {
  location: MapLocation;
  onSelect: (location: MapLocation) => void;
}) {
  const icon = useMarkerIcon(location.category);

  if (!icon) return null;

  return (
    <Marker
      position={location.coordinates}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(location),
      }}
    />
  );
}

export default function InteractiveMap() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );
  const [activeCategories, setActiveCategories] = useState<Set<MapCategory>>(
    new Set(Object.keys(mapConfig.categories) as MapCategory[])
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>("dark");
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [mobileListExpanded, setMobileListExpanded] = useState(false);

  // Antall steder som vises på mobil når listen er lukket
  const MOBILE_COLLAPSED_COUNT = 4;

  // Hent rute når en lokasjon velges
  const loadRouteForLocation = useCallback(async (location: MapLocation) => {
    if (location.category === "villa") {
      setRouteData(null);
      return;
    }

    setIsLoadingRoute(true);
    const route = await fetchRoute(
      villaCoords[0],
      villaCoords[1],
      location.coordinates[0],
      location.coordinates[1],
      "driving"
    );
    setRouteData(route);
    setIsLoadingRoute(false);
  }, []);

  // Last rute når valgt lokasjon endres
  useEffect(() => {
    if (selectedLocation) {
      loadRouteForLocation(selectedLocation);
    } else {
      setRouteData(null);
    }
  }, [selectedLocation, loadRouteForLocation]);

  // Kopier adresse til utklippstavlen
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error("Kunne ikke kopiere:", err);
    }
  };

  // Filtrer lokalisasjoner basert på aktive kategorier
  const filteredLocations = useMemo(() => {
    return mapConfig.locations.filter((loc) =>
      activeCategories.has(loc.category)
    );
  }, [activeCategories]);

  // Toggle kategori
  const toggleCategory = (category: MapCategory) => {
    const newCategories = new Set(activeCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setActiveCategories(newCategories);
  };

  // Alle kategorier på/av
  const toggleAllCategories = () => {
    if (activeCategories.size === Object.keys(mapConfig.categories).length) {
      setActiveCategories(new Set());
    } else {
      setActiveCategories(
        new Set(Object.keys(mapConfig.categories) as MapCategory[])
      );
    }
  };

  return (
    <section id="kart" className="py-12 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mb-6 md:mb-12">
          <p className="text-purple-500 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
            Utforsk området
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
            Interaktivt Kart
          </h2>
          <p className="text-zinc-500 text-sm md:text-lg max-w-2xl mb-4 md:mb-6">
            Se alle steder vi kan besøke. Klikk på markørene for mer info!
          </p>

          {/* Villa address card */}
          <div className="glass rounded-xl p-3 md:p-5 inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                <Home className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-wider mb-0.5">
                  Villaens adresse
                </p>
                <p className="text-white text-xs md:text-base font-medium">
                  {villaAddress}
                </p>
              </div>
            </div>
            <button
              onClick={() => copyAddress(villaAddress)}
              className={`flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm transition-all ${
                copiedAddress === villaAddress
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {copiedAddress === villaAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Kopier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main layout - sidebar + map */}
        <div className="glass rounded-xl md:rounded-3xl overflow-hidden">
          {/* Filter bar */}
          <div className="p-3 md:p-5 border-b border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                  <span className="text-xs md:text-sm text-zinc-300">Filter</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-500 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Map style picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowStylePicker(!showStylePicker)}
                    className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                    <span className="text-xs md:text-sm text-zinc-300 hidden sm:inline">
                      {mapStyles[mapStyle].label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-500 transition-transform ${
                        showStylePicker ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Style dropdown */}
                  {showStylePicker && (
                    <div className="absolute top-full left-0 mt-2 p-2 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-[1000] min-w-[140px]">
                      {(Object.entries(mapStyles) as [MapStyle, typeof mapStyles.dark][]).map(
                        ([key, style]) => {
                          const Icon = style.icon;
                          const isActive = mapStyle === key;
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                setMapStyle(key);
                                setShowStylePicker(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{style.label}</span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs md:text-sm text-zinc-500">
                {filteredLocations.length} steder
              </div>
            </div>

            {/* Filter options */}
            {showFilters && (
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  <button
                    onClick={toggleAllCategories}
                    className="px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium bg-white/10 text-zinc-300 hover:bg-white/20 transition-colors"
                  >
                    {activeCategories.size ===
                    Object.keys(mapConfig.categories).length
                      ? "Fjern alle"
                      : "Velg alle"}
                  </button>
                  {(
                    Object.entries(mapConfig.categories) as [
                      MapCategory,
                      { label: string; color: string; emoji: string }
                    ][]
                  ).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className={`flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-all ${
                        activeCategories.has(key)
                          ? "text-white"
                          : "bg-white/5 text-zinc-500"
                      }`}
                      style={{
                        backgroundColor: activeCategories.has(key)
                          ? config.color
                          : undefined,
                      }}
                    >
                      <span>{config.emoji}</span>
                      <span className="hidden sm:inline">{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side-by-side layout: Sidebar + Map */}
          <div className="flex flex-col lg:flex-row">
            {/* Left sidebar - Location list & details */}
            <div className="lg:w-[380px] xl:w-[420px] lg:border-r border-white/5 lg:h-[90vh] lg:max-h-[900px] lg:overflow-y-auto custom-scrollbar order-2 lg:order-1">
              {/* Selected location detail panel */}
              {selectedLocation ? (
                <div className="p-3 md:p-5">
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    <span>Tilbake til liste</span>
                  </button>

                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${mapConfig.categories[selectedLocation.category].color}20`,
                        border: `1px solid ${mapConfig.categories[selectedLocation.category].color}30`,
                      }}
                    >
                      <span className="text-xl">
                        {mapConfig.categories[selectedLocation.category].emoji}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {selectedLocation.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{
                            backgroundColor: mapConfig.categories[selectedLocation.category].color,
                          }}
                        >
                          {mapConfig.categories[selectedLocation.category].label}
                        </span>
                        {selectedLocation.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm text-yellow-500 font-medium">
                              {selectedLocation.rating}.0
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedLocation.description && (
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                      {selectedLocation.description}
                    </p>
                  )}

                  {/* Price indicator */}
                  {selectedLocation.price && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                      <span className="text-emerald-400 text-lg">💰</span>
                      <span className="text-emerald-400 font-medium text-sm">
                        {selectedLocation.price}
                      </span>
                    </div>
                  )}

                  {/* Address with copy button */}
                  {selectedLocation.address && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                      <span className="text-zinc-300 text-sm flex-1">
                        {selectedLocation.address}
                      </span>
                      <button
                        onClick={() => copyAddress(selectedLocation.address!)}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedAddress === selectedLocation.address
                            ? "bg-green-500/20 text-green-400"
                            : "hover:bg-white/10 text-zinc-500 hover:text-white"
                        }`}
                        title="Kopier adresse"
                      >
                        {copiedAddress === selectedLocation.address ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Distance and travel times from villa */}
                  {selectedLocation.category !== "villa" && (
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Route className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-white">
                          {isLoadingRoute ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Beregner rute...
                            </span>
                          ) : routeData ? (
                            `${formatDistance(routeData.distance)} fra villaen`
                          ) : (
                            "Fra villaen"
                          )}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <a
                          href={getDirectionsUrl(
                            selectedLocation.coordinates[0],
                            selectedLocation.coordinates[1],
                            "driving"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-black/30 hover:bg-black/50 transition-colors group border border-white/5"
                        >
                          <Car className="w-5 h-5 text-zinc-400 group-hover:text-orange-400" />
                          <span className="text-sm font-semibold text-white">
                            {isLoadingRoute ? "..." : routeData ? formatDuration(routeData.duration) : "-"}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Bil</span>
                        </a>
                        <a
                          href={getDirectionsUrl(
                            selectedLocation.coordinates[0],
                            selectedLocation.coordinates[1],
                            "bicycling"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-black/30 hover:bg-black/50 transition-colors group border border-white/5"
                        >
                          <Bike className="w-5 h-5 text-zinc-400 group-hover:text-blue-400" />
                          <span className="text-sm font-semibold text-white">
                            {isLoadingRoute ? "..." : routeData ? formatDuration(routeData.duration * 2.5) : "-"}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Sykkel</span>
                        </a>
                        <a
                          href={getDirectionsUrl(
                            selectedLocation.coordinates[0],
                            selectedLocation.coordinates[1],
                            "walking"
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-black/30 hover:bg-black/50 transition-colors group border border-white/5"
                        >
                          <Footprints className="w-5 h-5 text-zinc-400 group-hover:text-green-400" />
                          <span className="text-sm font-semibold text-white">
                            {isLoadingRoute ? "..." : routeData ? formatDuration(routeData.duration * 8) : "-"}
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Gå</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedLocation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-zinc-400 text-xs border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {selectedLocation.website && (
                      <a
                        href={selectedLocation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/5"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Nettside</span>
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.coordinates[0]},${selectedLocation.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium transition-colors"
                      style={{ backgroundColor: mapConfig.categories[selectedLocation.category].color }}
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Veibeskrivelse</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Location list */
                <div className="p-3 md:p-5">
                  {/* Mobile header med expand/collapse */}
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                      Alle steder ({filteredLocations.length})
                    </h3>
                    <button
                      onClick={() => setMobileListExpanded(!mobileListExpanded)}
                      className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs text-zinc-400"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>{mobileListExpanded ? "Vis færre" : "Se alle"}</span>
                      <ChevronUp className={`w-3.5 h-3.5 transition-transform ${mobileListExpanded ? "" : "rotate-180"}`} />
                    </button>
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    {filteredLocations.map((location, index) => {
                      // På mobil, skjul elementer over grensen når lukket
                      const hideOnMobile = !mobileListExpanded && index >= MOBILE_COLLAPSED_COUNT;
                      const distance =
                        location.category !== "villa"
                          ? calculateDistance(
                              villaCoords[0],
                              villaCoords[1],
                              location.coordinates[0],
                              location.coordinates[1]
                            )
                          : null;

                      return (
                        <button
                          key={location.id}
                          onClick={() => setSelectedLocation(location)}
                          className={`w-full glass rounded-lg md:rounded-xl p-2 md:p-3 text-left hover:bg-white/10 transition-all group ${hideOnMobile ? "hidden lg:block" : ""}`}
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <div
                              className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: `${mapConfig.categories[location.category].color}20`,
                              }}
                            >
                              <span className="text-sm md:text-lg">
                                {mapConfig.categories[location.category].emoji}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 md:gap-2 mb-0.5">
                                <h4 className="font-medium text-white truncate group-hover:text-purple-400 transition-colors text-xs md:text-sm">
                                  {location.name}
                                </h4>
                                {location.rating && (
                                  <div className="flex items-center gap-0.5 flex-shrink-0">
                                    <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-500 fill-yellow-500" />
                                    <span className="text-[10px] md:text-xs text-zinc-500">
                                      {location.rating}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2">
                                <span
                                  className="text-[10px] md:text-xs"
                                  style={{
                                    color: mapConfig.categories[location.category].color,
                                  }}
                                >
                                  {mapConfig.categories[location.category].label}
                                </span>
                                {distance && (
                                  <span className="text-[10px] md:text-xs text-zinc-600 flex items-center gap-0.5">
                                    <Car className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                    {distance.toFixed(1)} km
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-600 -rotate-90 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mobil: Vis flere-knapp nederst */}
                  {!mobileListExpanded && filteredLocations.length > MOBILE_COLLAPSED_COUNT && (
                    <button
                      onClick={() => setMobileListExpanded(true)}
                      className="lg:hidden w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Vis {filteredLocations.length - MOBILE_COLLAPSED_COUNT} flere steder</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Map */}
            <div className="relative h-[350px] md:h-[500px] lg:h-[90vh] lg:max-h-[900px] lg:flex-1 order-1 lg:order-2">
              {typeof window !== "undefined" && (
                <>
                  <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                  />
                  <MapContainer
                    center={mapConfig.center}
                    zoom={mapConfig.defaultZoom}
                    className="h-full w-full"
                    style={{ background: mapStyle === "light" ? "#f5f5f5" : "#1a1a1b" }}
                    whenReady={() => setIsMapLoaded(true)}
                  >
                    <TileLayer
                      key={mapStyle}
                      attribution={mapStyles[mapStyle].attribution}
                      url={mapStyles[mapStyle].url}
                    />
                    {filteredLocations.map((location) => (
                      <LocationMarker
                        key={location.id}
                        location={location}
                        onSelect={setSelectedLocation}
                      />
                    ))}
                    {/* Faktisk veivisning langs veier */}
                    {selectedLocation && selectedLocation.category !== "villa" && routeData && (
                      <Polyline
                        positions={routeData.coordinates}
                        pathOptions={{
                          color: mapConfig.categories[selectedLocation.category].color,
                          weight: 5,
                          opacity: 0.9,
                          lineCap: "round",
                          lineJoin: "round",
                        }}
                      />
                    )}
                    {/* Fallback til rett linje mens vi laster */}
                    {selectedLocation && selectedLocation.category !== "villa" && !routeData && isLoadingRoute && (
                      <Polyline
                        positions={[
                          villaCoords as [number, number],
                          selectedLocation.coordinates,
                        ]}
                        pathOptions={{
                          color: mapConfig.categories[selectedLocation.category].color,
                          weight: 3,
                          opacity: 0.4,
                          dashArray: "8, 12",
                        }}
                      />
                    )}
                  </MapContainer>
                </>
              )}

              {/* Loading state */}
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="flex flex-col items-center gap-3">
                    <MapIcon className="w-8 h-8 text-zinc-600 animate-pulse" />
                    <span className="text-zinc-500 text-sm">Laster kart...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
