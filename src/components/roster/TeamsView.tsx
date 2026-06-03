"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { RotateCcw, Trophy } from "lucide-react";
import {
  teams as ALL_TEAMS,
  accentStyles,
  powerLevel,
  teamAvgPower,
  type RosterPlayer,
  type DraftTeam,
} from "@/config/roster";
import { PlayerImage } from "./PlayerImage";

const RESULT_KEY = "30year_draft_result";

// RGB per aksent — for glød/ramme satt via inline-style.
const ACCENT_RGB: Record<DraftTeam["accent"], string> = {
  cyan: "34,211,238",
  amber: "251,191,36",
  rose: "251,113,133",
  violet: "167,139,250",
  emerald: "52,211,153",
};

// Lagret format fra DraftScreen (kun id + navn per spiller).
type SavedTeam = {
  id: string;
  name: string;
  accent: DraftTeam["accent"];
  players: { id: string; name: string }[];
};

// Slå opp full spillerdata (bilde, stats) fra id.
const PLAYER_BY_ID = new Map<string, RosterPlayer>(
  ALL_TEAMS.flatMap((t) => t.players).map((p) => [p.id, p])
);

const resolve = (saved: SavedTeam): RosterPlayer[] =>
  saved.players
    .map((p) => PLAYER_BY_ID.get(p.id) ?? { id: p.id, name: p.name })
    .filter(Boolean);

// Abonner på localStorage som en ekstern kilde (React-anbefalt mønster).
// getServerSnapshot returnerer undefined = "ikke lest enda" (unngår empty-flash).
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getRawSnapshot = () => window.localStorage.getItem(RESULT_KEY);
const getServerSnapshot = (): string | null | undefined => undefined;

export default function TeamsView() {
  const raw = useSyncExternalStore(subscribe, getRawSnapshot, getServerSnapshot);

  // null = lest, men ingenting lagret; undefined = ikke lest enda (server/hydrering).
  const saved = useMemo<SavedTeam[] | null>(() => {
    if (raw === undefined) return null;
    if (!raw) return [];
    try {
      return JSON.parse(raw) as SavedTeam[];
    } catch {
      return [];
    }
  }, [raw]);

  // Lag med faktiske spillere (hopp over tomme runder).
  const filled = (saved ?? []).filter((t) => t.players.length > 0);

  // Beste lag (høyest snitt-POWER) for en liten "leader"-markering.
  const ranked = filled
    .map((t) => ({ team: t, power: teamAvgPower(resolve(t)) }))
    .sort((a, b) => b.power - a.power);
  const topPower = ranked[0]?.power ?? 0;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-slate-950 text-white">
      {/* Bakgrunn */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(56,189,248,0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_55%,rgba(0,0,0,0.6)_100%)]" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 md:px-8 md:py-7">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase italic md:text-4xl">
            Lagene
          </h1>
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase md:text-sm">
            30 Squad · Algarve
          </p>
        </div>
        <Link
          href="/roster"
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-black tracking-wide uppercase italic text-slate-200 transition-colors hover:bg-white/10 md:text-sm"
        >
          <RotateCcw className="h-4 w-4" /> Trekk på nytt
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 md:px-8">
        {saved === null ? null : filled.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {filled.map((team) => {
              const players = resolve(team);
              const power = teamAvgPower(players);
              const a = accentStyles[team.accent];
              const rgb = ACCENT_RGB[team.accent];
              const isLeader = power === topPower && power > 0;
              return (
                <section
                  key={team.id}
                  className="relative overflow-hidden rounded-2xl border-2 bg-slate-900/50 p-4 md:p-5"
                  style={{
                    borderColor: `rgba(${rgb},0.55)`,
                    boxShadow: `0 0 40px -16px rgba(${rgb},0.6)`,
                  }}
                >
                  {/* Lag-header */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <h2
                      className={`flex items-center gap-2 text-lg font-black tracking-tight uppercase italic md:text-2xl ${a.text}`}
                    >
                      {isLeader && (
                        <Trophy className="h-5 w-5 text-amber-400 md:h-6 md:w-6" />
                      )}
                      {team.name}
                    </h2>
                    <div
                      className="-skew-x-6 rounded-md px-2.5 py-1 text-right"
                      style={{ background: `rgba(${rgb},0.18)` }}
                    >
                      <span className="block skew-x-6 text-[9px] font-bold tracking-widest text-slate-300 uppercase">
                        Snitt-power
                      </span>
                      <span
                        className={`block skew-x-6 text-xl font-black italic md:text-2xl ${a.text}`}
                      >
                        ⚡ {power}
                      </span>
                    </div>
                  </div>

                  {/* Spillere */}
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3">
                    {players.map((p) => (
                      <div key={p.id} className="flex flex-col gap-1.5">
                        <div
                          className="relative aspect-[3/4] overflow-hidden rounded-lg border-2 bg-gradient-to-b from-zinc-700 to-zinc-900"
                          style={{ borderColor: `rgba(${rgb},0.45)` }}
                        >
                          <PlayerImage
                            player={p}
                            fit="cover"
                            className="absolute inset-0 h-full w-full"
                          />
                          {/* POWER-badge */}
                          <span
                            className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-black italic text-white"
                          >
                            ⚡{powerLevel(p)}
                          </span>
                        </div>
                        <div className={`-skew-x-6 rounded-sm px-1 py-px text-center ${a.chip}`}>
                          <span className="block skew-x-6 truncate text-[10px] font-black tracking-tight uppercase italic md:text-xs">
                            {p.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-14 text-center">
      <p className="text-lg font-black tracking-tight uppercase italic text-slate-300">
        Ingen lag trukket enda
      </p>
      <p className="text-sm text-slate-500">
        Kjør lagtrekningen først — lagene lagres automatisk og dukker opp her.
      </p>
      <Link
        href="/roster"
        className="mt-2 rounded-lg bg-gradient-to-b from-cyan-500 to-cyan-700 px-5 py-2.5 text-sm font-black tracking-wide uppercase italic text-white shadow-lg transition-transform hover:scale-105"
      >
        Til lagtrekningen
      </Link>
    </div>
  );
}
