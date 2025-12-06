"use client";

import { tripConfig } from "@/config/trip";
import { MapPin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 md:py-16 border-t border-white/5 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-6 md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <span className="text-base md:text-lg font-semibold">
                <span className="gradient-text">ALGARVE</span>
                <span className="text-zinc-500 font-normal ml-2">2026</span>
              </span>
            </div>
          </div>

          {/* Celebrants */}
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 max-w-md">
            {tripConfig.celebrants.map((name) => (
              <span
                key={name}
                className="px-2.5 md:px-3 py-1 rounded-full bg-white/5 text-zinc-500 text-xs md:text-sm"
              >
                {name.split(" ")[0]}
              </span>
            ))}
          </div>

          {/* Date */}
          <div className="text-zinc-600 text-xs md:text-sm">
            7. - 14. juni 2026
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 text-center">
          <p className="text-zinc-700 text-xs md:text-sm flex items-center justify-center gap-1">
            Laget med <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-500" /> for gutta
          </p>
        </div>
      </div>
    </footer>
  );
}
