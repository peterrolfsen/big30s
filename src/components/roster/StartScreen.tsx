"use client";

import { teams } from "@/config/roster";

// "PRESS START"-introskjerm. Vises før trekningen starter.
export default function StartScreen() {
  const playerCount = teams.reduce((n, t) => n + t.players.length, 0);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative">
        <p className="mb-3 text-xs font-bold tracking-[0.5em] text-cyan-400 uppercase md:text-sm">
          30-årsturen · Algarve 2026
        </p>
        <h1 className="text-5xl leading-[0.9] font-black tracking-tighter text-white italic md:text-8xl">
          SQUAD
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-500 bg-clip-text text-transparent">
            SELECTION
          </span>
        </h1>
        <p className="mt-4 text-sm font-semibold tracking-widest text-slate-400 uppercase md:text-base">
          {playerCount} fightere · {teams.length} lag · 1 vinner
        </p>

        <div className="mt-12 animate-draft-pressstart">
          <span className="text-2xl font-black tracking-[0.3em] text-white uppercase italic md:text-3xl">
            ▶ PRESS START
          </span>
        </div>
        <p className="mt-4 text-xs tracking-widest text-slate-500 uppercase">
          Trykk Space eller Enter
        </p>
      </div>
    </div>
  );
}
