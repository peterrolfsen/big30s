"use client";

import Link from "next/link";
import { Crown, Trophy, Users } from "lucide-react";
import {
  teams,
  accentStyles,
  powerLevel,
  teamAvgPower,
  type DraftTeam,
  type RosterPlayer,
} from "@/config/roster";
import { PlayerImage } from "./PlayerImage";

const ROUND_ACCENTS: DraftTeam["accent"][] = [
  "cyan",
  "amber",
  "rose",
  "violet",
  "emerald",
];
const roundName = (i: number) => teams[i]?.name ?? `Lag ${i + 1}`;
const roundAccent = (i: number): DraftTeam["accent"] =>
  teams[i]?.accent ?? ROUND_ACCENTS[i % ROUND_ACCENTS.length];

// Sluttskjerm: alle lag rangert etter snitt-POWER + MVP (sterkeste spiller).
export default function StandingsScreen({
  completed,
}: {
  completed: RosterPlayer[][];
}) {
  // Behold opprinnelig lag-indeks for navn/farge, sorter på snitt-power.
  const ranked = completed
    .map((players, i) => ({ players, i, avg: teamAvgPower(players) }))
    .sort((a, b) => b.avg - a.avg);

  // MVP: høyeste POWER på tvers av alle lag.
  const all = completed.flat();
  const mvp = all.reduce<RosterPlayer | null>(
    (best, p) => (!best || powerLevel(p) > powerLevel(best) ? p : best),
    null
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-slate-950/95 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.12),transparent_60%)]" />

      <h1 className="animate-draft-callout text-4xl font-black tracking-tight text-white uppercase italic md:text-6xl">
        🏆 SLUTTRESULTAT
      </h1>

      <div className="relative grid w-full max-w-5xl gap-3 md:grid-cols-2">
        {ranked.map((t, place) => {
          const a = accentStyles[roundAccent(t.i)];
          return (
            <div
              key={t.i}
              className={`flex items-center gap-3 rounded-xl border-2 bg-white/[0.03] p-3 ${a.border} ${
                place === 0 ? a.glow : ""
              }`}
            >
              <div className="flex w-8 shrink-0 items-center justify-center text-2xl font-black italic text-slate-400 md:text-3xl">
                {place === 0 ? (
                  <Trophy className="h-7 w-7 text-amber-400" />
                ) : (
                  `#${place + 1}`
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-lg font-black uppercase italic md:text-2xl ${a.text}`}>
                  {roundName(t.i)}
                </div>
                <div className="flex gap-1.5 pt-1">
                  {t.players.map((p) => (
                    <div
                      key={p.id}
                      className="relative h-9 w-9 overflow-hidden rounded border border-white/15 bg-slate-800 md:h-11 md:w-11"
                      title={p.name}
                    >
                      <PlayerImage
                        player={p}
                        fit="cover"
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-center">
                <div className={`text-3xl font-black italic md:text-4xl ${a.text}`}>
                  {t.avg}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-slate-400">
                  ⚡ POWER
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MVP */}
      {mvp && (
        <div className="relative flex items-center gap-4 rounded-2xl border-2 border-amber-400 bg-amber-400/10 p-3 pr-6 shadow-[0_0_45px_-5px_rgba(251,191,36,0.7)]">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-amber-400 bg-slate-800 md:h-24 md:w-24">
            <PlayerImage
              player={mvp}
              fit="cover"
              className="absolute inset-0 h-full w-full"
            />
            <Crown className="absolute -top-1 left-1/2 h-6 w-6 -translate-x-1/2 fill-amber-300 text-amber-300 drop-shadow" />
          </div>
          <div>
            <div className="text-xs font-bold tracking-[0.3em] text-amber-300 uppercase">
              MVP
            </div>
            <div className="text-3xl font-black tracking-tight text-white uppercase italic md:text-5xl">
              {mvp.name}
            </div>
            <div className="text-sm font-bold text-amber-200">
              POWER {powerLevel(mvp)}
            </div>
          </div>
        </div>
      )}

      {/* Lenke til den varige lag-oversikten */}
      <Link
        href="/roster/lag"
        className="relative flex items-center gap-2 rounded-xl border-2 border-cyan-400 bg-cyan-400/10 px-5 py-3 text-base font-black tracking-wide text-cyan-200 uppercase italic shadow-[0_0_30px_-8px_rgba(34,211,238,0.8)] transition-transform hover:scale-105 md:text-lg"
      >
        <Users className="h-5 w-5" /> Se lagene
      </Link>
    </div>
  );
}
