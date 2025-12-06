"use client";

import { transportConfig } from "@/config/trip";
import { Plane, Car, Clock, ArrowRight } from "lucide-react";

export default function Transport() {
  return (
    <section id="reise" className="py-20 md:py-32 relative">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="mb-10 md:mb-16">
          <p className="text-cyan-500 text-sm font-medium tracking-widest uppercase mb-3">
            Hvordan komme seg dit
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Reise & Transport
          </h2>
          <p className="text-zinc-500 text-base md:text-lg max-w-2xl">
            Fly til Faro (FAO) og kjør til villaen. Vi koordinerer transport fra flyplassen.
          </p>
        </div>

        {/* Flights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {transportConfig.flights.map((flight, index) => (
            <div
              key={flight.city}
              className="glass rounded-2xl overflow-hidden hover-lift group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                    <Plane className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-zinc-600 text-sm font-mono">{flight.airport}</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{flight.city}</h3>

                <div className="flex items-center gap-3 text-zinc-500 mb-6">
                  <span>{flight.airport}</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>{flight.destinationAirport}</span>
                </div>

                {flight.details === "Kommer snart" ? (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Flyinfo kommer</span>
                  </div>
                ) : (
                  <p className="text-zinc-400 text-sm">{flight.details}</p>
                )}
              </div>

              {/* Bottom accent line */}
              <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
          ))}
        </div>

        {/* From airport + Rental car */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* From airport */}
          <div className="glass rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Fra flyplassen
                </h3>
                <p className="text-zinc-400">{transportConfig.fromAirport}</p>
              </div>
            </div>
          </div>

          {/* Rental car */}
          <div className="glass rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Leiebil</h3>
                {transportConfig.rentalCar.info === "Kommer snart" ? (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-4 h-4" />
                    <span>Info kommer snart</span>
                  </div>
                ) : (
                  <p className="text-zinc-400">{transportConfig.rentalCar.info}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
