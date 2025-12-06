"use client";

import { tripConfig } from "@/config/trip";
import {
  CreditCard,
  Check,
  Sparkles,
  Home,
  Waves,
  Dumbbell,
  Tv,
  Wifi,
  Clock,
} from "lucide-react";

export default function Prices() {
  return (
    <section id="praktisk" className="py-20 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="mb-10 md:mb-16">
          <p className="text-orange-500 text-sm font-medium tracking-widest uppercase mb-3">
            Kostnader og betaling
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Praktisk Info
          </h2>
          <p className="text-zinc-500 text-base md:text-lg max-w-2xl">
            Alt du trenger å vite om priser og betaling
          </p>
        </div>

        {/* Price cards */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mb-10 md:mb-16">
          {/* Villa only */}
          <div className="glass rounded-xl md:rounded-2xl p-6 md:p-8 hover-lift">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center mb-4 md:mb-6">
              <Home className="w-5 h-5 md:w-6 md:h-6 text-zinc-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Villa</h3>
            <p className="text-zinc-500 text-sm md:text-base mb-4 md:mb-6">Overnatting i villaen</p>
            <div className="flex items-baseline gap-1 mb-1 md:mb-2">
              <span className="text-3xl md:text-4xl font-bold text-white">
                {tripConfig.prices.villa.toLocaleString("nb-NO")}
              </span>
              <span className="text-zinc-500 text-sm md:text-base">{tripConfig.prices.currency}</span>
            </div>
            <p className="text-zinc-600 text-xs md:text-sm">per person</p>
          </div>

          {/* Villa + cleaning */}
          <div className="relative rounded-xl md:rounded-2xl p-6 md:p-8 hover-lift overflow-hidden group">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Badge */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 px-2.5 md:px-3 py-1 rounded-full bg-white/20 text-white text-xs md:text-sm font-medium">
              Anbefalt
            </div>

            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center mb-4 md:mb-6">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Villa + Vask</h3>
              <p className="text-white/70 text-sm md:text-base mb-4 md:mb-6">Inkludert sluttvask</p>
              <div className="flex items-baseline gap-1 mb-1 md:mb-2">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {tripConfig.prices.villaWithCleaning.toLocaleString("nb-NO")}
                </span>
                <span className="text-white/70 text-sm md:text-base">{tripConfig.prices.currency}</span>
              </div>
              <p className="text-white/50 text-xs md:text-sm">per person</p>
            </div>
          </div>
        </div>

        {/* What's included */}
        <div className="glass rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mb-10 md:mb-16">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Inkludert i prisen</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {[
              "7 netters overnatting",
              "Privat villa med basseng",
              "10 en-suite soverom",
              "Jacuzzi, sauna og gym",
              "Kinorom og spillerom",
              "Tennisbane og minigolf",
              "BBQ og poolbar",
              "WiFi og aircondition",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 md:gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                </div>
                <span className="text-zinc-300 text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment info */}
        <div className="glass rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">Betaling</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <div>
              <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">
                Kontonummer
              </p>
              {tripConfig.payment.accountNumber === "Kommer snart" ? (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-sm md:text-base">Kommer snart</span>
                </div>
              ) : (
                <p className="text-white font-mono text-sm md:text-base">{tripConfig.payment.accountNumber}</p>
              )}
            </div>
            <div>
              <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">
                Vipps
              </p>
              {tripConfig.payment.vipps === "Kommer snart" ? (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-sm md:text-base">Kommer snart</span>
                </div>
              ) : (
                <p className="text-white font-mono text-sm md:text-base">{tripConfig.payment.vipps}</p>
              )}
            </div>
            <div>
              <p className="text-zinc-500 text-xs md:text-sm uppercase tracking-wider mb-1 md:mb-2">
                Betalingsfrist
              </p>
              {tripConfig.payment.deadline === "Kommer snart" ? (
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-sm md:text-base">Kommer snart</span>
                </div>
              ) : (
                <p className="text-white text-sm md:text-base">{tripConfig.payment.deadline}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
