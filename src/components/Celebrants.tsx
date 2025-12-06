"use client";

import { tripConfig } from "@/config/trip";
import { Users, Moon, Bed, Calendar } from "lucide-react";
import Image from "next/image";

export default function Celebrants() {
  const gradients = [
    "from-orange-500 to-amber-500",
    "from-cyan-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-rose-500 to-red-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-cyan-500",
  ];

  const celebrants = tripConfig.participants.filter((p) => p.type === "celebrant");
  const guests = tripConfig.participants.filter((p) => p.type === "guest");

  return (
    <section id="gjengen" className="py-12 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Header - kompakt på mobil */}
        <div className="text-center mb-8 md:mb-16">
          <p className="text-amber-500 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
            Hvem er med
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
            Gjengen
          </h2>
          <p className="text-zinc-400 text-sm md:text-lg">
            {celebrants.length} jubilanter + {guests.length} gjester
          </p>
        </div>

        {/* Jubilanter - kompakt grid */}
        <div className="mb-10 md:mb-16">
          <h3 className="text-sm md:text-base font-medium text-zinc-500 mb-4 md:mb-6 text-center">
            Jubilantene
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-6">
            {celebrants.map((participant, index) => {
              const gradient = gradients[index % gradients.length];
              const initials = participant.name.split(" ").map((n) => n[0]).join("");
              const firstName = participant.name.split(" ")[0];

              return (
                <div key={participant.name} className="text-center">
                  {/* Bilde - lite på mobil */}
                  <div className="relative w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-2 md:mb-3">
                    {/* Glow */}
                    <div className="absolute -inset-1 md:-inset-2 rounded-full bg-amber-500/20 blur-md md:blur-lg" />

                    {/* Gold ring */}
                    <div className="relative w-full h-full rounded-full p-[2px] md:p-[3px] bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-lg shadow-amber-500/20">
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {participant.image ? (
                          <Image
                            src={participant.image}
                            alt={participant.name}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <span className="text-base md:text-2xl lg:text-3xl font-semibold text-white/90">{initials}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 30 badge - liten på mobil */}
                    <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-md">
                      30
                    </div>
                  </div>

                  {/* Navn */}
                  <h3 className="text-white font-medium text-xs md:text-sm lg:text-base truncate">
                    {firstName}
                  </h3>

                  {/* Bursdag - kun på større skjermer eller kompakt på mobil */}
                  {participant.birthday && (
                    <p className="text-amber-400/70 text-[10px] md:text-xs mt-0.5 hidden sm:block">
                      {participant.birthday}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gjester - enda mer kompakt */}
        {guests.length > 0 && (
          <div className="mb-8 md:mb-16">
            <h3 className="text-sm md:text-base font-medium text-zinc-500 mb-4 md:mb-6 text-center">
              Gjestene
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-11 gap-2 md:gap-4">
              {guests.map((participant, index) => {
                const gradient = gradients[index % gradients.length];
                const initials = participant.name.split(" ").map((n) => n[0]).join("");
                const firstName = participant.name.split(" ")[0];

                return (
                  <div key={participant.name} className="text-center">
                    {/* Bilde */}
                    <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-1.5 md:mb-2">
                      <div className="w-full h-full rounded-full p-[1.5px] md:p-[2px] bg-zinc-700">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                          {participant.image ? (
                            <Image
                              src={participant.image}
                              alt={participant.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                              <span className="text-sm md:text-lg lg:text-xl font-semibold text-white/90">{initials}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navn */}
                    <h3 className="text-zinc-400 font-medium text-[10px] md:text-xs lg:text-sm truncate">
                      {firstName}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats - kompakt på mobil */}
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {[
            { value: tripConfig.totalParticipants, label: "Deltakere", icon: Users, color: "orange" },
            { value: celebrants.length, label: "Jubilanter", icon: Users, color: "amber" },
            { value: tripConfig.suites, label: "Soverom", icon: Bed, color: "zinc" },
            { value: "7", label: "Netter", icon: Moon, color: "zinc" },
          ].map((stat) => {
            const colorClasses: Record<string, string> = {
              orange: "text-orange-500",
              amber: "text-amber-500",
              zinc: "text-zinc-400",
            };

            return (
              <div key={stat.label} className="glass rounded-xl p-3 md:p-4 text-center">
                <div className="text-xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className={`text-[10px] md:text-xs ${colorClasses[stat.color]}`}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
