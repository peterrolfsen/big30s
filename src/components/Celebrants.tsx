"use client";

import { tripConfig } from "@/config/trip";
import { useState } from "react";
import Image from "next/image";

// Pokémon type farger
const typeColors: Record<string, { bg: string; border: string; glow: string }> = {
  fire: { bg: "from-orange-600 to-red-600", border: "border-orange-400", glow: "shadow-orange-500/50" },
  water: { bg: "from-blue-500 to-cyan-500", border: "border-blue-400", glow: "shadow-blue-500/50" },
  grass: { bg: "from-green-500 to-emerald-500", border: "border-green-400", glow: "shadow-green-500/50" },
  electric: { bg: "from-yellow-400 to-amber-500", border: "border-yellow-400", glow: "shadow-yellow-500/50" },
  psychic: { bg: "from-pink-500 to-purple-500", border: "border-pink-400", glow: "shadow-pink-500/50" },
  ice: { bg: "from-cyan-300 to-blue-400", border: "border-cyan-300", glow: "shadow-cyan-400/50" },
  dragon: { bg: "from-indigo-600 to-purple-600", border: "border-indigo-400", glow: "shadow-indigo-500/50" },
  dark: { bg: "from-zinc-700 to-zinc-900", border: "border-zinc-500", glow: "shadow-zinc-600/50" },
  fairy: { bg: "from-pink-400 to-rose-400", border: "border-pink-300", glow: "shadow-pink-400/50" },
  fighting: { bg: "from-red-700 to-orange-700", border: "border-red-500", glow: "shadow-red-500/50" },
  flying: { bg: "from-sky-400 to-indigo-400", border: "border-sky-300", glow: "shadow-sky-400/50" },
  ghost: { bg: "from-purple-700 to-indigo-800", border: "border-purple-500", glow: "shadow-purple-500/50" },
  ground: { bg: "from-amber-600 to-yellow-700", border: "border-amber-500", glow: "shadow-amber-500/50" },
  rock: { bg: "from-stone-500 to-amber-700", border: "border-stone-400", glow: "shadow-stone-500/50" },
  steel: { bg: "from-zinc-400 to-slate-500", border: "border-zinc-300", glow: "shadow-zinc-400/50" },
  normal: { bg: "from-stone-400 to-zinc-500", border: "border-stone-300", glow: "shadow-stone-400/50" },
};

const rarityStyles: Record<string, { border: string; badge: string; shimmer: boolean }> = {
  legendary: { border: "from-yellow-400 via-amber-300 to-yellow-500", badge: "bg-gradient-to-r from-yellow-400 to-amber-500", shimmer: true },
  rare: { border: "from-purple-400 via-pink-400 to-purple-500", badge: "bg-gradient-to-r from-purple-500 to-pink-500", shimmer: true },
  uncommon: { border: "from-blue-400 via-cyan-400 to-blue-500", badge: "bg-gradient-to-r from-blue-500 to-cyan-500", shimmer: false },
};

const statLabels: Record<string, string> = {
  festlighet: "Festlighet",
  drikkekapasitet: "Drikkekapasitet",
  dansetalent: "Dansetalent",
  soving: "Soving",
  sjarm: "Sjarm",
  kaos: "Kaos",
};

const statEmojis: Record<string, string> = {
  festlighet: "🎉",
  drikkekapasitet: "🍺",
  dansetalent: "💃",
  soving: "😴",
  sjarm: "✨",
  kaos: "🌀",
};

interface PokemonCardProps {
  participant: (typeof tripConfig.participants)[0];
  index: number;
}

function PokemonCard({ participant, index }: PokemonCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const typeColor = typeColors[participant.pokemonType] || typeColors.normal;
  const rarity = rarityStyles[participant.rarity] || rarityStyles.uncommon;
  const initials = participant.name.split(" ").map((n) => n[0]).join("");
  const firstName = participant.name.split(" ")[0];

  return (
    <div
      className="perspective-1000 cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full aspect-[2.5/3.5] transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden">
          <div
            className={`relative h-full rounded-xl p-[3px] bg-gradient-to-br ${rarity.border} ${
              rarity.shimmer ? "animate-shimmer" : ""
            } shadow-xl ${typeColor.glow}`}
          >
            {/* Inner card */}
            <div className={`h-full rounded-[10px] bg-gradient-to-br ${typeColor.bg} p-2 md:p-3 flex flex-col overflow-hidden`}>
              {/* Header - Name & HP */}
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-xs md:text-sm lg:text-base truncate drop-shadow-md">
                    {firstName}
                  </h3>
                  {participant.type === "celebrant" && (
                    <span className="text-[8px] md:text-[10px] text-white/80 font-medium">JUBILANT</span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-white/80 text-[10px] md:text-xs font-bold">HP</span>
                  <span className="text-white font-black text-sm md:text-lg lg:text-xl drop-shadow-md">{participant.hp}</span>
                </div>
              </div>

              {/* Image area */}
              <div className="relative flex-shrink-0 aspect-square w-full max-w-[80%] mx-auto mb-1 md:mb-2 rounded-lg overflow-hidden border-2 border-white/30 bg-black/20">
                {participant.image ? (
                  <Image
                    src={participant.image}
                    alt={participant.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/20 to-white/5">
                    <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/80 drop-shadow-lg">
                      {initials}
                    </span>
                  </div>
                )}

                {/* Type badge */}
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
                  <span className="text-[8px] md:text-[10px] text-white font-semibold uppercase">
                    {participant.pokemonType}
                  </span>
                </div>
              </div>

              {/* Special Move */}
              <div className="bg-black/30 rounded-md p-1.5 md:p-2 mb-1 md:mb-2 backdrop-blur-sm">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-yellow-400 text-xs md:text-sm">⚡</span>
                  <span className="text-white/90 font-bold text-[10px] md:text-xs">SPECIAL MOVE</span>
                </div>
                <p className="text-white text-[10px] md:text-sm font-medium truncate">{participant.specialMove}</p>
              </div>

              {/* Mini stats preview */}
              <div className="grid grid-cols-3 gap-1 mt-auto">
                {Object.entries(participant.stats).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <span className="text-xs md:text-sm">{statEmojis[key]}</span>
                    <div className="text-white font-bold text-[10px] md:text-xs">{value}</div>
                  </div>
                ))}
              </div>

              {/* Rarity badge */}
              <div className={`absolute top-1 right-1 md:top-2 md:right-2 px-1 md:px-1.5 py-0.5 rounded-full ${rarity.badge}`}>
                <span className="text-[8px] md:text-[10px] text-white font-bold uppercase">
                  {participant.rarity === "legendary" ? "★★★" : participant.rarity === "rare" ? "★★" : "★"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card - Stats */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div
            className={`relative h-full rounded-xl p-[3px] bg-gradient-to-br ${rarity.border} shadow-xl ${typeColor.glow}`}
          >
            <div className="h-full rounded-[10px] bg-zinc-900 p-2 md:p-3 flex flex-col">
              {/* Header */}
              <div className="text-center mb-2 md:mb-3">
                <h3 className="text-white font-bold text-sm md:text-base lg:text-lg">{firstName}</h3>
                <p className="text-zinc-400 text-[10px] md:text-xs">FULL STATS</p>
              </div>

              {/* All stats */}
              <div className="flex-1 space-y-1.5 md:space-y-2">
                {Object.entries(participant.stats).map(([key, value]) => (
                  <div key={key} className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-[9px] md:text-xs flex items-center gap-1">
                        <span>{statEmojis[key]}</span>
                        {statLabels[key]}
                      </span>
                      <span className="text-white font-bold text-[10px] md:text-xs">{value}</span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${typeColor.bg} transition-all duration-500`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Weakness */}
              <div className="mt-2 md:mt-3 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-1">
                  <span className="text-red-400 text-xs">⚠️</span>
                  <span className="text-zinc-500 text-[9px] md:text-[10px] font-medium">SVAKHET:</span>
                </div>
                <p className="text-zinc-300 text-[10px] md:text-xs mt-0.5">{participant.weakness}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hint text */}
      <p className="text-center text-zinc-600 text-[8px] md:text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        Klikk for å snu
      </p>
    </div>
  );
}

export default function Celebrants() {
  const celebrants = tripConfig.participants.filter((p) => p.type === "celebrant");
  const guests = tripConfig.participants.filter((p) => p.type === "guest");

  return (
    <section id="gjengen" className="py-12 md:py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-amber-500 text-xs md:text-sm font-medium tracking-widest uppercase mb-2">
            Samle alle kortene
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
            Party Cards
          </h2>
          <p className="text-zinc-400 text-sm md:text-lg">
            {celebrants.length} legendarer + {guests.length} sjeldne kort
          </p>
          <p className="text-zinc-500 text-xs md:text-sm mt-2">
            Klikk på kortene for å se stats!
          </p>
        </div>

        {/* Jubilanter - Legendary */}
        <div className="mb-10 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            <span className="text-yellow-400 text-lg md:text-xl">⭐</span>
            <h3 className="text-sm md:text-base font-bold text-yellow-400 uppercase tracking-wider">
              Jubilantene
            </h3>
            <span className="text-yellow-400 text-lg md:text-xl">⭐</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto">
            {celebrants.map((participant, index) => (
              <PokemonCard key={participant.name} participant={participant} index={index} />
            ))}
          </div>
        </div>

        {/* Gjester */}
        {guests.length > 0 && (
          <div>
            <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
              <span className="text-blue-400 text-base md:text-lg">💎</span>
              <h3 className="text-sm md:text-base font-bold text-blue-400 uppercase tracking-wider">
                Gjestene
              </h3>
              <span className="text-blue-400 text-base md:text-lg">💎</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
              {guests.map((participant, index) => (
                <PokemonCard key={participant.name} participant={participant} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for 3D card flip */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-shimmer {
          background-size: 200% 200%;
          animation: shimmer 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
