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
  Wifi,
  ExternalLink,
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
            <a
              href={villaConfig.website}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl md:rounded-3xl p-6 md:p-16 text-center block hover:bg-white/10 transition-colors group"
            >
              <ExternalLink className="w-10 h-10 md:w-16 md:h-16 text-zinc-600 group-hover:text-orange-500 mx-auto mb-3 md:mb-6 transition-colors" />
              <p className="text-zinc-400 text-sm md:text-lg mb-1 md:mb-2 group-hover:text-white transition-colors">Se villaen her</p>
              <p className="text-zinc-600 text-[10px] md:text-sm group-hover:text-orange-500 transition-colors">
                springvillas.net
              </p>
            </a>
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
      </div>
    </section>
  );
}
