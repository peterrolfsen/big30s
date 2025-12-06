"use client";

import { packingListConfig } from "@/config/trip";
import { Backpack, Shirt, Waves, Sun, Check } from "lucide-react";

export default function PackingList() {
  return (
    <section id="pakkeliste" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-10 md:mb-16">
          <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-3">
            Hva du må huske
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Pakkeliste
          </h2>
          <p className="text-zinc-500 text-base md:text-lg max-w-2xl">
            Hva bør du ta med til Portugal?
          </p>
        </div>

        {packingListConfig.status === "coming_soon" ? (
          <div className="glass rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center mx-auto mb-6 md:mb-8">
              <Backpack className="w-8 h-8 md:w-10 md:h-10 text-amber-500" />
            </div>
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">
              Pakkeliste kommer snart
            </h3>
            <p className="text-zinc-400 text-sm md:text-base mb-8 md:mb-10 max-w-md mx-auto">
              Vi lager en komplett pakkeliste slik at du ikke glemmer noe viktig.
            </p>

            {/* Preview tags */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {[
                { label: "Badetøy", icon: Waves },
                { label: "Solbriller", icon: Sun },
                { label: "Solkrem", icon: Sun },
                { label: "Turklær", icon: Shirt },
                { label: "Festklær", icon: Shirt },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/5 text-zinc-400"
                >
                  <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {packingListConfig.categories.map((category, index) => (
              <div key={index} className="glass rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
                  {category.name}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center gap-2 md:gap-3 group"
                    >
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded border border-zinc-700 flex items-center justify-center group-hover:border-orange-500 transition-colors cursor-pointer">
                        <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-transparent group-hover:text-orange-500" />
                      </div>
                      <span className="text-zinc-300 text-sm md:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
