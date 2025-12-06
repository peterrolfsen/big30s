"use client";

import { villaConfig } from "@/config/trip";
import {
  Bed,
  Bath,
  Users,
  Trees,
  Waves,
  Dumbbell,
  Tv,
  UtensilsCrossed,
  Wifi,
  AirVent,
  Car,
  MapPin,
  ExternalLink,
  ImageIcon,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  pool: Waves,
  entertainment: Tv,
  fitness: Dumbbell,
  outdoor: Trees,
  practical: Wifi,
};

export default function Villa() {
  return (
    <section id="villa" className="py-12 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mb-6 md:mb-12">
          <p className="text-orange-500 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
            Her skal vi bo
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
            Villaen
          </h2>
          <p className="text-zinc-500 text-sm md:text-lg max-w-2xl">
            {villaConfig.name} - en spektakulær villa med alt du trenger for den ultimate ferieuken.
          </p>
        </div>

        {/* Image grid / placeholder */}
        <div className="mb-6 md:mb-12">
          {villaConfig.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-3">
              {villaConfig.images.slice(0, 5).map((src, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-lg md:rounded-2xl aspect-square ${
                    index === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <img
                    src={src}
                    alt={`Villa bilde ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl md:rounded-3xl p-6 md:p-16 text-center">
              <ImageIcon className="w-10 h-10 md:w-16 md:h-16 text-zinc-600 mx-auto mb-3 md:mb-6" />
              <p className="text-zinc-400 text-sm md:text-lg mb-1 md:mb-2">Bilder kommer snart</p>
              <p className="text-zinc-600 text-[10px] md:text-sm">
                Legg til bilder i /public/images/villa/
              </p>
            </div>
          )}
        </div>

        {/* Stats grid - Bento style */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-12">
          {[
            { value: villaConfig.bedrooms, label: "Soverom", icon: Bed },
            { value: villaConfig.bathrooms, label: "Bad", icon: Bath },
            { value: villaConfig.maxGuests, label: "Gjester", icon: Users },
            { value: villaConfig.plotSize, label: "Tomt", icon: Trees },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl md:rounded-2xl p-3 md:p-6 hover-lift group text-center"
            >
              <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-zinc-500 group-hover:text-orange-500 transition-colors mb-1.5 md:mb-4 mx-auto" />
              <div className="text-xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-zinc-500 text-[10px] md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-12">
          {Object.entries(villaConfig.amenities).map(([category, items]) => {
            const categoryNames: Record<string, string> = {
              pool: "Basseng & Spa",
              entertainment: "Underholdning",
              fitness: "Trening",
              outdoor: "Utendørs",
              practical: "Praktisk",
            };
            const Icon = iconMap[category] || Wifi;

            return (
              <div key={category} className="glass rounded-xl md:rounded-2xl p-3 md:p-5">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500" />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-white truncate">
                    {categoryNames[category]}
                  </h3>
                </div>
                <ul className="space-y-1 md:space-y-1.5">
                  {items.map((item) => (
                    <li key={item.name} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-zinc-600 mt-1.5 flex-shrink-0" />
                      <span className="text-zinc-400 text-xs md:text-sm leading-tight">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Location card */}
        <div className="glass rounded-xl md:rounded-3xl p-4 md:p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-8">
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                  <MapPin className="w-4 h-4 md:w-6 md:h-6 text-cyan-500" />
                </div>
                <h3 className="text-lg md:text-2xl font-semibold text-white">Beliggenhet</h3>
              </div>
              <p className="text-zinc-400 text-xs md:text-base mb-3 md:mb-6 max-w-md">{villaConfig.address}</p>
              <a
                href={villaConfig.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-400 transition-colors text-xs md:text-base"
              >
                <span>Se villaens nettside</span>
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </a>
            </div>

            <div className="grid grid-cols-5 md:grid-cols-3 lg:grid-cols-2 gap-1.5 md:gap-3">
              {Object.entries(villaConfig.distances).map(([key, value]) => {
                const labels: Record<string, string> = {
                  portimao: "Portimão",
                  alvor: "Alvor",
                  nearestBeach: "Strand",
                  faroAirport: "Fly",
                  golfCourse: "Golf",
                };
                return (
                  <div key={key} className="text-center p-2 md:p-4 rounded-lg md:rounded-xl bg-white/5">
                    <div className="text-sm md:text-xl font-bold text-white">{value}</div>
                    <div className="text-zinc-500 text-[10px] md:text-sm">{labels[key]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
