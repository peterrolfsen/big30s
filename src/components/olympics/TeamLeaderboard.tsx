"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Check, X, Medal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { buildStandings, olAccentStyles, placementBadge } from "@/config/olympics";
import { renameTeam } from "@/app/actions/olympics";
import type { OlAccent, OlResult, OlStanding, OlTeam } from "@/lib/types";

interface Props {
  /** "full" = stor visning, "compact" = mini-liste på hub-en. */
  variant?: "full" | "compact";
  /** Tillat inline-redigering av lagnavn. */
  editable?: boolean;
}

export default function TeamLeaderboard({
  variant = "full",
  editable = false,
}: Props) {
  const [standings, setStandings] = useState<OlStanding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const load = useCallback(async () => {
    const [{ data: teams }, { data: results }] = await Promise.all([
      supabase.from("ol_teams").select("*").order("sort_order"),
      supabase.from("ol_results").select("*"),
    ]);
    if (teams) {
      setStandings(
        buildStandings(teams as OlTeam[], (results ?? []) as OlResult[])
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("ol-leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "ol_results" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "ol_teams" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  async function saveName(teamId: string) {
    const name = draftName.trim();
    setEditingId(null);
    if (!name) return;
    // Optimistisk oppdatering.
    setStandings((prev) =>
      prev.map((s) => (s.team.id === teamId ? { ...s, team: { ...s.team, name } } : s))
    );
    await renameTeam(teamId, name);
    load();
  }

  if (isLoading) {
    return (
      <div className="text-center py-10 text-zinc-500 text-sm">Laster stilling…</div>
    );
  }

  if (!standings.length) {
    return (
      <div className="text-center py-10 text-zinc-500 text-sm">
        Ingen lag enda. Hent lagene fra lagtrekningen for å starte.
      </div>
    );
  }

  const max = Math.max(1, ...standings.map((s) => s.total));

  return (
    <div className="space-y-2">
      {standings.map((s) => {
        const a = olAccentStyles[s.team.accent as OlAccent];
        const isEditing = editingId === s.team.id;
        return (
          <div
            key={s.team.id}
            className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 ${
              s.rank === 1 ? a.glow : ""
            }`}
          >
            {/* Plassering */}
            <div className="w-7 text-center text-lg font-black tabular-nums shrink-0">
              {placementBadge(s.rank)}
            </div>

            {/* Fargeprikk */}
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${a.dot}`} />

            {/* Navn (+ evt. redigering) */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName(s.team.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    maxLength={28}
                    className="w-full bg-black/40 border border-white/20 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={() => saveName(s.team.id)}
                    className="p-1 text-emerald-400 hover:text-emerald-300"
                    aria-label="Lagre navn"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 text-zinc-500 hover:text-zinc-300"
                    aria-label="Avbryt"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className={`font-bold truncate ${a.text}`}>{s.team.name}</span>
                  {editable && (
                    <button
                      onClick={() => {
                        setEditingId(s.team.id);
                        setDraftName(s.team.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white"
                      aria-label="Endre lagnavn"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {variant === "full" && (s.placements[1] ?? 0) > 0 && (
                    <span className="flex items-center gap-0.5 text-amber-400/80 text-xs">
                      <Medal className="w-3 h-3" />×{s.placements[1]}
                    </span>
                  )}
                </div>
              )}

              {/* Poengbar (kun full) */}
              {variant === "full" && !isEditing && (
                <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${a.bar} transition-all duration-500`}
                    style={{ width: `${(s.total / max) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Poeng */}
            <div className="text-right shrink-0">
              <span className="text-lg font-black text-white tabular-nums">
                {s.total}
              </span>
              <span className="text-zinc-500 text-xs ml-1">p</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
