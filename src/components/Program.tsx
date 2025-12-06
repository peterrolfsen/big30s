"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plane,
  Home,
  UtensilsCrossed,
  PartyPopper,
  Sun,
  Waves,
  Wine,
  Camera,
  Sailboat,
  Car,
  Music,
  Sparkles,
  Clock,
  MapPin,
  Target,
  Landmark,
  PlaneTakeoff,
  Umbrella,
  type LucideIcon,
} from "lucide-react";

interface Activity {
  time: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  location?: string;
  highlight?: boolean;
}

interface DayProgram {
  date: string;
  dayName: string;
  title: string;
  Icon: LucideIcon;
  color: string;
  activities: Activity[];
}

const programData: DayProgram[] = [
  {
    date: "7. juni",
    dayName: "Søndag",
    title: "Ankomst",
    Icon: Plane,
    color: "#3b82f6",
    activities: [
      {
        time: "Formiddag",
        title: "Fly fra Norge",
        description: "Avganger fra Oslo, Bergen og Trondheim til Faro",
        icon: <Plane className="w-4 h-4" />,
        location: "Faro lufthavn",
      },
      {
        time: "15:00-17:00",
        title: "Ankomst & innsjekk",
        description: "Hente leiebiler og kjøre til villaen (ca. 1 time)",
        icon: <Car className="w-4 h-4" />,
        location: "Villa Penina Majestic",
      },
      {
        time: "17:00-19:00",
        title: "Utforskning av villaen",
        description: "Fordele rom, pakke ut og bli kjent med fasilitetene",
        icon: <Home className="w-4 h-4" />,
      },
      {
        time: "19:00",
        title: "Velkomstdrink ved bassenget",
        description: "Cava og snacks mens vi nyter solnedgangen",
        icon: <Wine className="w-4 h-4" />,
        highlight: true,
      },
      {
        time: "20:30",
        title: "Velkomstmiddag",
        description: "Enkel tapas og grillmat på villaen",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        location: "Villaens terrasse",
      },
    ],
  },
  {
    date: "8. juni",
    dayName: "Mandag",
    title: "Stranddag",
    Icon: Umbrella,
    color: "#06b6d4",
    activities: [
      {
        time: "09:00",
        title: "Frokost på villaen",
        description: "Rolig start på dagen med kaffe og frokost",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "11:00",
        title: "Praia da Rocha",
        description: "Algarves mest kjente strand med gyllen sand og klipper",
        icon: <Waves className="w-4 h-4" />,
        location: "Praia da Rocha",
        highlight: true,
      },
      {
        time: "13:00",
        title: "Strandlunsj",
        description: "Lunsj på strandrestaurant eller medbrakt picnic",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "15:00",
        title: "Vannsport eller avslapning",
        description: "Paddleboard, jet ski eller bare nyt solen",
        icon: <Sun className="w-4 h-4" />,
      },
      {
        time: "18:00",
        title: "Solnedgang på NoSoloÁgua",
        description: "Trendy beachclub med drinks og god stemning",
        icon: <Music className="w-4 h-4" />,
        location: "NoSoloÁgua Beachclub",
      },
      {
        time: "21:00",
        title: "Middag i Portimão",
        description: "Sjømat og portugisisk vin",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        location: "O Barradas",
      },
    ],
  },
  {
    date: "9. juni",
    dayName: "Tirsdag",
    title: "Aktivitetsdag",
    Icon: Target,
    color: "#eab308",
    activities: [
      {
        time: "08:30",
        title: "Tidlig frokost",
        description: "Energirik frokost før dagens eventyr",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "10:00",
        title: "Quad/ATV-tur",
        description: "3 timers tur gjennom Algarves bakland og fjell",
        icon: <Car className="w-4 h-4" />,
        location: "Portimão",
        highlight: true,
      },
      {
        time: "14:00",
        title: "Lunsj på villaen",
        description: "Lett lunsj og hvile ved bassenget",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "16:00",
        title: "Bassengfest",
        description: "Pool party med musikk og drinker",
        icon: <Waves className="w-4 h-4" />,
        location: "Villaens basseng",
      },
      {
        time: "19:00",
        title: "BBQ-kveld",
        description: "Grillmester på jobb! Kjøtt, sjømat og tilbehør",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        location: "Villaens BBQ-område",
        highlight: true,
      },
    ],
  },
  {
    date: "10. juni",
    dayName: "Onsdag",
    title: "Utflukt",
    Icon: Camera,
    color: "#ec4899",
    activities: [
      {
        time: "09:00",
        title: "Frokost",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "10:30",
        title: "Avreise til Lagos",
        description: "Utforsk den sjarmerende historiske byen",
        icon: <Car className="w-4 h-4" />,
        location: "Lagos gamlebyen",
      },
      {
        time: "11:00",
        title: "Lagos gamlebyen",
        description: "Brosteinsgater, festning og marina",
        icon: <Camera className="w-4 h-4" />,
        highlight: true,
      },
      {
        time: "13:00",
        title: "Lunsj i Lagos",
        description: "Tradisjonell portugisisk restaurant",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        location: "A Casa do João",
      },
      {
        time: "15:00",
        title: "Sagres & Cabo de São Vicente",
        description: "Europas sørvestligste punkt! Spektakulære klipper",
        icon: <Camera className="w-4 h-4" />,
        location: "Cabo de São Vicente",
        highlight: true,
      },
      {
        time: "18:30",
        title: "Solnedgang ved fyrtårnet",
        description: "Magisk solnedgang over Atlanterhavet",
        icon: <Sun className="w-4 h-4" />,
      },
      {
        time: "20:30",
        title: "Middag i Sagres eller på villaen",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
    ],
  },
  {
    date: "11. juni",
    dayName: "Torsdag",
    title: "Båttur & Vin",
    Icon: Sailboat,
    color: "#8b5cf6",
    activities: [
      {
        time: "09:00",
        title: "Frokost",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "10:30",
        title: "Benagil-grotten med båt",
        description: "Spektakulær båttur til Portugals mest berømte grotte",
        icon: <Sailboat className="w-4 h-4" />,
        location: "Benagil",
        highlight: true,
      },
      {
        time: "13:30",
        title: "Strandlunsj",
        description: "Fersk sjømat ved stranden",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        location: "Rei das Praias",
      },
      {
        time: "16:00",
        title: "Vinsmaking",
        description: "Omvisning og smaking på Algarves beste vingård",
        icon: <Wine className="w-4 h-4" />,
        location: "Quinta dos Vales",
        highlight: true,
      },
      {
        time: "19:00",
        title: "Avslapning på villaen",
        description: "Jacuzzi og sauna",
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        time: "21:00",
        title: "Pizza-kveld",
        description: "Hjemmelaget pizza på villaen",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
    ],
  },
  {
    date: "12. juni",
    dayName: "Fredag",
    title: "Kulturdag",
    Icon: Landmark,
    color: "#f97316",
    activities: [
      {
        time: "09:30",
        title: "Frokost",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "11:00",
        title: "Silves Festning",
        description: "Portugals best bevarte mauriske festning fra 700-tallet",
        icon: <Camera className="w-4 h-4" />,
        location: "Castelo de Silves",
        highlight: true,
      },
      {
        time: "13:00",
        title: "Lunsj i Silves",
        description: "Tradisjonell mat i historiske omgivelser",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        location: "A Tasca Medieval",
      },
      {
        time: "15:00",
        title: "Tilbake til villaen",
        description: "Avslapning ved bassenget",
        icon: <Waves className="w-4 h-4" />,
      },
      {
        time: "17:00",
        title: "Sunset Cruise",
        description: "Romantisk solnedgangstur med seilbåt, vin og tapas",
        icon: <Sailboat className="w-4 h-4" />,
        location: "Marina de Portimão",
        highlight: true,
      },
      {
        time: "21:00",
        title: "Fine dining",
        description: "Michelin-opplevelse med smaksmeny",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        location: "Vista Restaurante",
        highlight: true,
      },
    ],
  },
  {
    date: "13. juni",
    dayName: "Lørdag",
    title: "Festdag!",
    Icon: PartyPopper,
    color: "#ef4444",
    activities: [
      {
        time: "10:00",
        title: "Brunch på villaen",
        description: "Lat start på feiringsdagen",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      {
        time: "12:00",
        title: "Badeland!",
        description: "Slide & Splash - Algarves største badeland",
        icon: <Waves className="w-4 h-4" />,
        location: "Slide & Splash",
        highlight: true,
      },
      {
        time: "17:00",
        title: "Tilbake til villaen",
        description: "Hvile og pynting før festen",
        icon: <Home className="w-4 h-4" />,
      },
      {
        time: "19:00",
        title: "Champagne & taler",
        description: "Feiring av jubilantene!",
        icon: <Wine className="w-4 h-4" />,
        highlight: true,
      },
      {
        time: "20:00",
        title: "30-årsfest!",
        description: "Stor festmiddag med catering, musikk og dans",
        icon: <PartyPopper className="w-4 h-4" />,
        location: "Villaen",
        highlight: true,
      },
      {
        time: "23:00",
        title: "Afterparty",
        description: "Dans og moro til de små timer",
        icon: <Music className="w-4 h-4" />,
      },
    ],
  },
  {
    date: "14. juni",
    dayName: "Søndag",
    title: "Avreise",
    Icon: PlaneTakeoff,
    color: "#64748b",
    activities: [
      {
        time: "08:00-10:00",
        title: "Frokost og pakking",
        description: "Rydd rom og pakk bagasje",
        icon: <Home className="w-4 h-4" />,
      },
      {
        time: "10:00",
        title: "Utsjekk",
        description: "Siste sjekk av villaen",
        icon: <Home className="w-4 h-4" />,
      },
      {
        time: "11:00",
        title: "Avreise til Faro",
        description: "Ca. 1 time kjøring til flyplassen",
        icon: <Car className="w-4 h-4" />,
      },
      {
        time: "Ettermiddag",
        title: "Fly hjem",
        description: "Takk for turen!",
        icon: <Plane className="w-4 h-4" />,
        location: "Faro lufthavn",
        highlight: true,
      },
    ],
  },
];

export default function Program() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  const goToDay = useCallback((index: number) => {
    if (index === selectedDay || isAnimating) return;
    setSlideDirection(index > selectedDay ? "right" : "left");
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedDay(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 150);
  }, [selectedDay, isAnimating]);

  const goToPrev = useCallback(() => {
    if (selectedDay > 0) goToDay(selectedDay - 1);
  }, [selectedDay, goToDay]);

  const goToNext = useCallback(() => {
    if (selectedDay < programData.length - 1) goToDay(selectedDay + 1);
  }, [selectedDay, goToDay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  return (
    <section id="program" className="py-12 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mb-8 md:mb-12">
          <p className="text-orange-500 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
            Uke 24, 2026
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
            Dagsprogram
          </h2>
          <p className="text-zinc-500 text-sm md:text-lg max-w-2xl">
            Tentativt program for uken. Klikk på en dag for å se detaljene!
          </p>
        </div>

        {/* Timeline */}
        <div className="mb-8 md:mb-12">
          {/* Desktop timeline */}
          <div className="hidden md:block">
            {/* Glass container */}
            <div className="glass rounded-2xl p-6 lg:p-8">
              <div className="relative">
                {/* Background track with gradient */}
                <div className="absolute top-8 left-8 right-8 h-1 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-zinc-800" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-700/50 via-zinc-600/30 to-zinc-700/50" />
                </div>

                {/* Active progress line with glow */}
                <div
                  className="absolute top-8 left-8 h-1 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `calc(${(selectedDay / (programData.length - 1)) * 100}% * (100% - 64px) / 100%)`,
                    background: `linear-gradient(90deg, ${programData[0].color}, ${programData[Math.min(selectedDay, programData.length - 1)].color})`,
                    boxShadow: `0 0 20px ${programData[selectedDay].color}60, 0 0 40px ${programData[selectedDay].color}30`,
                  }}
                />

                {/* Day nodes */}
                <div className="relative flex justify-between">
                  {programData.map((day, index) => {
                    const isActive = selectedDay === index;
                    const isPast = index < selectedDay;
                    const isNext = index === selectedDay + 1;

                    return (
                      <button
                        key={day.date}
                        onClick={() => goToDay(index)}
                        className="group flex flex-col items-center relative focus:outline-none"
                      >
                        {/* Connecting line segment */}
                        {index < programData.length - 1 && (
                          <div
                            className="absolute top-8 left-1/2 h-1 transition-all duration-500"
                            style={{
                              width: "calc(100% + 20px)",
                              background: isPast
                                ? `linear-gradient(90deg, ${day.color}, ${programData[index + 1].color})`
                                : "transparent",
                            }}
                          />
                        )}

                        {/* Main node */}
                        <div className="relative">
                          {/* Outer ring animation for active */}
                          {isActive && (
                            <>
                              <div
                                className="absolute -inset-2 rounded-2xl opacity-30 animate-ping"
                                style={{ backgroundColor: day.color }}
                              />
                              <div
                                className="absolute -inset-1.5 rounded-xl"
                                style={{
                                  background: `linear-gradient(135deg, ${day.color}40, transparent)`,
                                  boxShadow: `0 0 30px ${day.color}50`,
                                }}
                              />
                            </>
                          )}

                          {/* Icon box */}
                          <div
                            className={`relative z-10 w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              isActive
                                ? "scale-110"
                                : isPast
                                  ? "hover:scale-105"
                                  : isNext
                                    ? "hover:scale-105 ring-2 ring-zinc-600/50 hover:ring-zinc-500"
                                    : "hover:scale-105 opacity-60 hover:opacity-100"
                            }`}
                            style={{
                              backgroundColor: isActive
                                ? day.color
                                : isPast
                                  ? `${day.color}40`
                                  : "rgba(39, 39, 42, 0.9)",
                              boxShadow: isActive
                                ? `0 8px 32px ${day.color}40, inset 0 1px 0 rgba(255,255,255,0.2)`
                                : isPast
                                  ? `0 4px 16px ${day.color}20`
                                  : "0 4px 16px rgba(0,0,0,0.3)",
                            }}
                          >
                            <day.Icon
                              className={`transition-all duration-300 ${
                                isActive
                                  ? "w-7 h-7 lg:w-8 lg:h-8 text-white"
                                  : isPast
                                    ? "w-6 h-6 lg:w-7 lg:h-7 text-white/90"
                                    : "w-5 h-5 lg:w-6 lg:h-6 text-zinc-400 group-hover:text-zinc-200"
                              }`}
                            />
                          </div>

                          {/* Day number badge */}
                          <div
                            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                              isActive
                                ? "scale-110"
                                : "scale-90 opacity-70 group-hover:scale-100 group-hover:opacity-100"
                            }`}
                            style={{
                              backgroundColor: isActive || isPast ? day.color : "#3f3f46",
                              color: "white",
                              boxShadow: isActive ? `0 2px 10px ${day.color}60` : undefined,
                            }}
                          >
                            {index + 1}
                          </div>
                        </div>

                        {/* Labels */}
                        <div className="mt-4 text-center">
                          <p
                            className={`text-sm font-semibold transition-all duration-300 ${
                              isActive
                                ? "text-white"
                                : isPast
                                  ? "text-zinc-300"
                                  : "text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          >
                            {day.dayName}
                          </p>
                          <p
                            className={`text-xs mt-0.5 transition-colors duration-300 ${
                              isActive ? "text-zinc-400" : "text-zinc-600"
                            }`}
                          >
                            {day.date}
                          </p>
                          {/* Day title preview */}
                          <p
                            className={`text-[10px] mt-1 font-medium transition-all duration-300 ${
                              isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-70"
                            }`}
                            style={{ color: day.color }}
                          >
                            {day.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation hint */}
              <div className="flex justify-center mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <button
                    onClick={goToPrev}
                    disabled={selectedDay === 0}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      selectedDay === 0
                        ? "opacity-30 cursor-not-allowed text-zinc-600"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Forrige</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-zinc-500 text-xs">
                    <span>←</span>
                    <span>Piltaster</span>
                    <span>→</span>
                  </div>

                  <button
                    onClick={goToNext}
                    disabled={selectedDay === programData.length - 1}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      selectedDay === programData.length - 1
                        ? "opacity-30 cursor-not-allowed text-zinc-600"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>Neste</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile timeline - clean horizontal design */}
          <div className="md:hidden">
            <div className="glass rounded-2xl p-4">
              {/* Progress bar */}
              <div className="relative h-1 bg-zinc-800 rounded-full mb-4 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((selectedDay + 1) / programData.length) * 100}%`,
                    background: `linear-gradient(90deg, ${programData[0].color}, ${programData[selectedDay].color})`,
                    boxShadow: `0 0 10px ${programData[selectedDay].color}60`,
                  }}
                />
              </div>

              {/* Day selector row */}
              <div className="flex items-center justify-between gap-2">
                {/* Prev button */}
                <button
                  onClick={goToPrev}
                  disabled={selectedDay === 0}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedDay === 0
                      ? "opacity-30"
                      : "bg-zinc-800 active:scale-95"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5 text-zinc-400" />
                </button>

                {/* Current day display */}
                <div
                  className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: `${programData[selectedDay].color}15`,
                    borderLeft: `3px solid ${programData[selectedDay].color}`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{
                      backgroundColor: programData[selectedDay].color,
                    }}
                  >
                    {(() => {
                      const DayIcon = programData[selectedDay].Icon;
                      return <DayIcon className="w-5 h-5" />;
                    })()}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Dag {selectedDay + 1}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-xs text-zinc-500 truncate">
                        {programData[selectedDay].dayName}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">
                      {programData[selectedDay].title}
                    </p>
                  </div>
                </div>

                {/* Next button */}
                <button
                  onClick={goToNext}
                  disabled={selectedDay === programData.length - 1}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedDay === programData.length - 1
                      ? "opacity-30"
                      : "bg-zinc-800 active:scale-95"
                  }`}
                >
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Day dots for visual progress */}
              <div className="flex justify-center gap-1.5 mt-4">
                {programData.map((day, index) => {
                  const isActive = selectedDay === index;
                  const isPast = index < selectedDay;

                  return (
                    <button
                      key={day.date}
                      onClick={() => goToDay(index)}
                      className="p-1"
                      aria-label={`Dag ${index + 1}: ${day.title}`}
                    >
                      <div
                        className={`rounded-full transition-all duration-300 ${
                          isActive ? "w-6 h-2" : "w-2 h-2"
                        }`}
                        style={{
                          backgroundColor: isActive
                            ? day.color
                            : isPast
                              ? `${day.color}60`
                              : "rgba(63, 63, 70, 0.8)",
                          boxShadow: isActive
                            ? `0 0 8px ${day.color}60`
                            : undefined,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected day content */}
        <div className="relative">
          {/* Navigation arrows - desktop */}
          <button
            onClick={goToPrev}
            disabled={selectedDay === 0}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all ${
              selectedDay === 0
                ? "opacity-30 cursor-not-allowed bg-zinc-800"
                : "bg-zinc-800 hover:bg-zinc-700 hover:scale-110"
            }`}
            style={{
              boxShadow: selectedDay > 0 ? `0 0 20px ${programData[selectedDay - 1]?.color}30` : undefined,
            }}
          >
            <ChevronLeft className="w-5 h-5 text-zinc-300" />
          </button>

          <button
            onClick={goToNext}
            disabled={selectedDay === programData.length - 1}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-10 h-10 lg:w-12 lg:h-12 rounded-full items-center justify-center transition-all ${
              selectedDay === programData.length - 1
                ? "opacity-30 cursor-not-allowed bg-zinc-800"
                : "bg-zinc-800 hover:bg-zinc-700 hover:scale-110"
            }`}
            style={{
              boxShadow: selectedDay < programData.length - 1 ? `0 0 20px ${programData[selectedDay + 1]?.color}30` : undefined,
            }}
          >
            <ChevronRight className="w-5 h-5 text-zinc-300" />
          </button>

          <div
            className={`glass rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 ${
              isAnimating
                ? `opacity-0 ${slideDirection === "right" ? "translate-x-4" : "-translate-x-4"}`
                : "opacity-100 translate-x-0"
            }`}
            style={{
              borderColor: `${programData[selectedDay].color}30`,
              borderWidth: "1px",
            }}
          >
            {/* Day header - Desktop only (mobile has separate header) */}
            <div
              className="hidden md:block p-6 border-b border-white/5 transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${programData[selectedDay].color}15 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-all duration-300"
                    style={{
                      backgroundColor: programData[selectedDay].color,
                      boxShadow: `0 0 30px ${programData[selectedDay].color}30`,
                    }}
                  >
                    {(() => {
                      const DayIcon = programData[selectedDay].Icon;
                      return <DayIcon className="w-8 h-8" />;
                    })()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${programData[selectedDay].color}20`,
                          color: programData[selectedDay].color,
                        }}
                      >
                        DAG {selectedDay + 1} AV {programData.length}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {programData[selectedDay].title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-zinc-400 text-sm">
                        {programData[selectedDay].dayName} {programData[selectedDay].date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity count */}
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-white">
                    {programData[selectedDay].activities.length}
                  </span>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">aktiviteter</span>
                </div>
              </div>
            </div>

            {/* Mobile mini header - just date */}
            <div
              className="md:hidden px-4 py-3 border-b border-white/5"
              style={{
                background: `linear-gradient(135deg, ${programData[selectedDay].color}10 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-400 text-sm">
                    {programData[selectedDay].date}
                  </span>
                </div>
                <span className="text-zinc-500 text-xs">
                  {programData[selectedDay].activities.length} aktiviteter
                </span>
              </div>
            </div>

          {/* Activities */}
          <div className="p-4 md:p-6">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[19px] md:left-[23px] top-2 bottom-2 w-0.5 bg-white/10 rounded-full" />

              <div className="space-y-4 md:space-y-6">
                {programData[selectedDay].activities.map((activity, index) => (
                  <div key={index} className="relative flex gap-4 md:gap-6">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        activity.highlight
                          ? "text-white"
                          : "bg-zinc-800/80 text-zinc-400"
                      }`}
                      style={{
                        backgroundColor: activity.highlight
                          ? programData[selectedDay].color
                          : undefined,
                      }}
                    >
                      {activity.icon}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 pb-4 md:pb-6 ${
                        index === programData[selectedDay].activities.length - 1
                          ? ""
                          : "border-b border-white/5"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                        <span
                          className="text-sm font-medium"
                          style={{
                            color: activity.highlight
                              ? programData[selectedDay].color
                              : "#a1a1aa",
                          }}
                        >
                          <Clock className="w-3 h-3 inline mr-1" />
                          {activity.time}
                        </span>
                        {activity.location && (
                          <span className="text-xs text-zinc-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {activity.location}
                          </span>
                        )}
                      </div>
                      <h4
                        className={`font-semibold mb-1 ${
                          activity.highlight ? "text-white text-lg" : "text-zinc-300"
                        }`}
                      >
                        {activity.title}
                      </h4>
                      {activity.description && (
                        <p className="text-zinc-500 text-sm">{activity.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-zinc-600 text-xs mt-6">
          * Programmet er tentativt og kan endres. Aktiviteter vil bli bekreftet nærmere avreise.
        </p>
      </div>
    </section>
  );
}
