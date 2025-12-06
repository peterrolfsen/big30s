"use client";

import { tripConfig } from "@/config/trip";
import {
  CreditCard,
  Check,
  Sparkles,
  Home,
  Clock,
  Euro,
  Users,
  Calendar,
} from "lucide-react";

export default function Prices() {
  const { prices, payment, included, golfDiscounts } = tripConfig;

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

        {/* Main price card */}
        <div className="max-w-4xl mb-10 md:mb-16">
          <div className="relative rounded-xl md:rounded-2xl p-6 md:p-8 overflow-hidden group">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-1">Pris per person</h3>
                  <p className="text-white/70 text-sm md:text-base">{tripConfig.totalParticipants} deltakere · 7 netter</p>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl md:text-5xl font-bold text-white">
                      ~{prices.perPersonNOK.toLocaleString("nb-NO")}
                    </span>
                    <span className="text-white/70 text-lg md:text-xl">NOK</span>
                  </div>
                  <p className="text-white/60 text-sm md:text-base">€{prices.perPerson} per person</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Villa total</p>
                  <p className="text-white font-semibold">€{prices.villaTotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Kommuneavgift</p>
                  <p className="text-white font-semibold">€{prices.municipalityFeeTotal}/person</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Depositum</p>
                  <p className="text-white font-semibold">€{prices.damageDeposit.toLocaleString()} totalt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's included */}
        <div className="glass rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mb-10 md:mb-16">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Inkludert i prisen</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {included.map((item) => (
              <div key={item} className="flex items-center gap-2 md:gap-3">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                </div>
                <span className="text-zinc-300 text-sm md:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment schedule */}
        <div className="glass rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">Betalingsplan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Ved booking</span>
              </div>
              <p className="text-white font-semibold">{payment.schedule.atBooking}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">90 dager før</span>
              </div>
              <p className="text-white font-semibold">{payment.schedule.ninetyDaysBefore}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">1 uke før</span>
              </div>
              <p className="text-white font-semibold">{payment.schedule.oneWeekBefore}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-zinc-500 text-sm">
              <span className="text-zinc-400">Betalingsmetoder:</span> {payment.methods.join(", ")}
            </p>
          </div>
        </div>

        {/* Golf discounts */}
        <div className="glass rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl">
          <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Golf-rabatter</h3>
          <p className="text-zinc-500 text-sm mb-4 md:mb-6">
            Partnerskap med Penina Hotel Golf & Resort (500m fra villaen)
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-green-400 text-xl md:text-2xl font-bold">{golfDiscounts.teeTimes}</p>
              <p className="text-zinc-500 text-xs md:text-sm">Tee Times</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-green-400 text-xl md:text-2xl font-bold">{golfDiscounts.buggiesAndTrolleys}</p>
              <p className="text-zinc-500 text-xs md:text-sm">Buggies & Trolleys</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-green-400 text-xl md:text-2xl font-bold">{golfDiscounts.golfStore}</p>
              <p className="text-zinc-500 text-xs md:text-sm">Golf Store</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-green-400 text-xl md:text-2xl font-bold">{golfDiscounts.restaurantsAndBars}</p>
              <p className="text-zinc-500 text-xs md:text-sm">Restauranter & Bar</p>
            </div>
          </div>

          <p className="text-zinc-600 text-xs mt-4">
            {golfDiscounts.note}
          </p>
        </div>
      </div>
    </section>
  );
}
