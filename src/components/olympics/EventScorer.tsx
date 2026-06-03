"use client";

import { useState } from "react";
import { Undo2, Check, Loader2, RotateCcw } from "lucide-react";
import { saveResults } from "@/app/actions/olympics";
import { olAccentStyles, pointsForPlacement, placementBadge } from "@/config/olympics";
import type { OlAccent, OlEvent, OlTeam } from "@/lib/types";

interface Props {
  event: OlEvent;
  teams: OlTeam[];
  /** Lag i målrekkefølge fra tidligere registrering (for å rette). */
  initialRanked?: string[];
  enteredBy: string;
  onSaved?: () => void;
}

export default function EventScorer({
  event,
  teams,
  initialRanked = [],
  enteredBy,
  onSaved,
}: Props) {
  const [ranked, setRanked] = useState<string[]>(initialRanked);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const teamById = new Map(teams.map((t) => [t.id, t]));
  const scheme = event.point_scheme ?? [];

  function tap(teamId: string) {
    setRanked((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]));
  }
  const undo = () => setRanked((prev) => prev.slice(0, -1));
  const reset = () => setRanked([]);

  async function save() {
    setSaving(true);
    setError(null);
    const res = await saveResults(event.id, ranked, enteredBy);
    setSaving(false);
    if (res.success) onSaved?.();
    else setError(res.error ?? "Noe gikk galt");
  }

  const remaining = teams.filter((t) => !ranked.includes(t.id));
  const allRanked = remaining.length === 0;

  return (
    <div className="space-y-4">
      <p className="text-zinc-400 text-sm">
        Tapp lagene i <span className="text-white font-semibold">målrekkefølge</span> —
        første tapp = 1. plass.
      </p>

      {/* Rangerte lag */}
      {ranked.length > 0 && (
        <div className="space-y-2">
          {ranked.map((teamId, i) => {
            const team = teamById.get(teamId);
            if (!team) return null;
            const a = olAccentStyles[team.accent as OlAccent];
            return (
              <div
                key={teamId}
                className={`flex items-center gap-3 rounded-xl border bg-white/[0.04] px-3 py-2.5 border-white/10`}
              >
                <span className="w-7 text-center text-lg font-black">
                  {placementBadge(i + 1)}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
                <span className={`flex-1 font-bold ${a.text}`}>{team.name}</span>
                <span className="text-white font-black tabular-nums">
                  +{pointsForPlacement(i + 1, scheme)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Gjenstående lag å tappe */}
      {!allRanked && (
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-wide mb-2">
            Neste: {placementBadge(ranked.length + 1)} plass
          </p>
          <div className="grid grid-cols-2 gap-2">
            {remaining.map((team) => {
              const a = olAccentStyles[team.accent as OlAccent];
              return (
                <button
                  key={team.id}
                  onClick={() => tap(team.id)}
                  className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-3 py-3 text-left transition-colors ${a.ring} hover:ring-1`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${a.dot}`} />
                  <span className={`font-bold truncate ${a.text}`}>{team.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      {/* Kontroller */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={undo}
          disabled={!ranked.length}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-40 text-zinc-300 text-sm px-3 py-2 transition-colors"
        >
          <Undo2 className="w-4 h-4" /> Angre
        </button>
        <button
          onClick={reset}
          disabled={!ranked.length}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] disabled:opacity-40 text-zinc-300 text-sm px-3 py-2 transition-colors"
          aria-label="Nullstill"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={save}
          disabled={saving || !allRanked}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-emerald-950 font-bold py-2 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Lagrer…
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Lagre resultat
            </>
          )}
        </button>
      </div>
      {!allRanked && (
        <p className="text-zinc-500 text-xs text-center">
          Ranger alle lagene for å kunne lagre.
        </p>
      )}
    </div>
  );
}
