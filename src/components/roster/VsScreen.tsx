"use client";

import {
  accentStyles,
  teamAvgPower,
  teamAvgStat,
  STAT_LABELS,
  type DraftTeam,
} from "@/config/roster";
import { PlayerImage } from "./PlayerImage";

function TeamColumn({
  team,
  side,
}: {
  team: DraftTeam;
  side: "left" | "right";
}) {
  const a = accentStyles[team.accent];
  return (
    <div
      className={`flex flex-1 flex-col gap-2 ${
        side === "left"
          ? "animate-draft-slide-left items-start"
          : "animate-draft-slide-right items-end"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${side === "right" ? "flex-row-reverse" : ""}`}
      >
        <h3
          className={`text-2xl font-black tracking-tight uppercase italic md:text-4xl ${a.text}`}
        >
          {team.name}
        </h3>
        <span
          className={`rounded-md border-2 px-2 py-0.5 text-sm font-black italic md:text-lg ${a.border} ${a.bg} ${a.text}`}
        >
          ⚡ {teamAvgPower(team.players)}
        </span>
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {team.players.map((p) => (
          <div
            key={p.id}
            className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-slate-900 ${a.border}`}
          >
            <PlayerImage player={p} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1.5 py-0.5 text-center">
              <span className="text-[10px] font-black tracking-wide text-white uppercase italic md:text-xs">
                {p.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4-mot-4 VS-skjerm med stat-sammenligning når to lag er ferdig trukket.
export default function VsScreen({
  left,
  right,
}: {
  left: DraftTeam;
  right: DraftTeam;
}) {
  const aLeft = accentStyles[left.accent];
  const aRight = accentStyles[right.accent];
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/95 px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative flex w-full max-w-6xl items-center gap-3 md:gap-6">
        <TeamColumn team={left} side="left" />

        {/* VS + stat-sammenligning */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span className="animate-draft-vsslam text-5xl font-black tracking-tighter text-white italic drop-shadow-[0_0_25px_rgba(255,255,255,0.6)] md:text-8xl">
            VS
          </span>
          <div className="flex flex-col gap-1.5">
            {STAT_LABELS.map((s) => {
              const l = teamAvgStat(left.players, s.key);
              const r = teamAvgStat(right.players, s.key);
              return (
                <div
                  key={s.key}
                  className="flex items-center gap-2 text-base font-black tabular-nums md:text-xl"
                >
                  <span
                    className={`w-9 text-right ${l >= r ? aLeft.text : "text-slate-600"}`}
                  >
                    {l}
                  </span>
                  <span className="w-16 text-center text-[9px] font-bold tracking-widest text-slate-400 md:w-20 md:text-[11px]">
                    {s.label}
                  </span>
                  <span
                    className={`w-9 text-left ${r >= l ? aRight.text : "text-slate-600"}`}
                  >
                    {r}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <TeamColumn team={right} side="right" />
      </div>
    </div>
  );
}
