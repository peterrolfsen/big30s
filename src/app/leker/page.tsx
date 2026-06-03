"use client";

import Link from "next/link";
import {
  CircleDot,
  Target,
  Camera,
  Trophy,
  ChevronRight,
  Swords,
  Medal,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const games = [
  {
    href: "/leker/wheel",
    title: "Wheel of Fate",
    description:
      "Hvem tar oppvasken? Hvem kjøper neste runde? Skjebnens hjul bestemmer!",
    icon: CircleDot,
    color: "from-orange-500 to-amber-500",
    shadowColor: "shadow-orange-500/20",
    bgGlow: "bg-orange-500/10",
  },
  {
    href: "/leker/bounty",
    title: "Bounty Board",
    description:
      "Fullfør utfordringer, last opp bevis og samle poeng. Fra enkle dares til episke oppdrag.",
    icon: Target,
    color: "from-emerald-500 to-green-500",
    shadowColor: "shadow-emerald-500/20",
    bgGlow: "bg-emerald-500/10",
  },
  {
    href: "/leker/foto",
    title: "Photo Wars",
    description:
      "Daglig fotokonkurranse med nye temaer. Stem på favorittene og kåre turens beste fotograf.",
    icon: Camera,
    color: "from-purple-500 to-violet-500",
    shadowColor: "shadow-purple-500/20",
    bgGlow: "bg-purple-500/10",
  },
  {
    href: "/roster",
    title: "Lagtrekning",
    description:
      "Fighting-game lagvelger! Trekk deltakerne inn i lag av 4 — styres med tastatur, perfekt for opptak.",
    icon: Swords,
    color: "from-cyan-500 to-sky-500",
    shadowColor: "shadow-cyan-500/20",
    bgGlow: "bg-cyan-500/10",
  },
  {
    href: "/leker/ol",
    title: "OL — Lekene",
    description:
      "Lag mot lag i øvelser som minigolf, svømming og tennis. Plassering gir poeng, sammenlagt kårer vinneren.",
    icon: Medal,
    color: "from-amber-400 to-yellow-500",
    shadowColor: "shadow-amber-500/20",
    bgGlow: "bg-amber-500/10",
  },
];

export default function LekerHub() {
  const { session } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-10 pt-4">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
          Tur
          <span className="gradient-text">leker</span>
        </h1>
        <p className="text-zinc-400">
          Hei {session?.displayName}! Velg en lek for å komme i gang.
        </p>
      </div>

      {/* Game Cards */}
      <div className="grid gap-4 md:gap-6">
        {games.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300`}
          >
            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6">
              {/* Icon */}
              <div
                className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg ${game.shadowColor} group-hover:scale-110 transition-transform`}
              >
                <game.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
                  {game.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
            </div>

            {/* Glow effect */}
            <div
              className={`absolute inset-0 ${game.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
            />
          </Link>
        ))}
      </div>

      {/* Leaderboard link */}
      <Link
        href="/leker/poeng"
        className="mt-6 flex items-center justify-center gap-2 p-4 rounded-xl border border-white/5 hover:border-amber-500/30 bg-white/[0.02] hover:bg-amber-500/5 transition-all group"
      >
        <Trophy className="w-5 h-5 text-amber-400" />
        <span className="text-zinc-300 group-hover:text-amber-300 font-medium transition-colors">
          Se Turpoeng-leaderboardet
        </span>
        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
      </Link>
    </div>
  );
}
