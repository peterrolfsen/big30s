"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, Loader2, CircleDot, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { createEvent } from "@/app/actions/olympics";
import { defaultSchemeFor, FINALE_SCHEME } from "@/config/olympics";
import type { OlEvent, OlResult, OlTeam } from "@/lib/types";
import CommitTeamsButton from "@/components/olympics/CommitTeamsButton";
import EventScorer from "@/components/olympics/EventScorer";
import TeamLeaderboard from "@/components/olympics/TeamLeaderboard";

export default function OlAdminPage() {
  const { session } = useAuth();
  const [teams, setTeams] = useState<OlTeam[]>([]);
  const [events, setEvents] = useState<OlEvent[]>([]);
  const [results, setResults] = useState<OlResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Ny øvelse
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🏅");
  const [finale, setFinale] = useState(false);
  const [creating, setCreating] = useState(false);

  // Hvilken øvelse som scores nå
  const [openEventId, setOpenEventId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data: t }, { data: e }, { data: r }] = await Promise.all([
      supabase.from("ol_teams").select("*").order("sort_order"),
      supabase.from("ol_events").select("*").order("sort_order"),
      supabase.from("ol_results").select("*"),
    ]);
    setTeams((t ?? []) as OlTeam[]);
    setEvents((e ?? []) as OlEvent[]);
    setResults((r ?? []) as OlResult[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addEvent() {
    if (!name.trim() || !session) return;
    setCreating(true);
    const scheme = finale ? FINALE_SCHEME : defaultSchemeFor(teams.length);
    const res = await createEvent(session.participantId, name.trim(), icon, scheme);
    setCreating(false);
    if (res.success) {
      setName("");
      setFinale(false);
      await load();
      if (res.eventId) setOpenEventId(res.eventId);
    }
  }

  const rankedFor = (eventId: string) =>
    results
      .filter((r) => r.event_id === eventId)
      .sort((a, b) => a.placement - b.placement)
      .map((r) => r.team_id);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const hasTeams = teams.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6">
      <div className="flex items-center gap-2 pt-4 mb-6">
        <Link href="/leker/ol" className="text-zinc-400 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl md:text-2xl font-black text-white">
          OL — <span className="gradient-text">administrer</span>
        </h1>
      </div>

      {/* 1. Lag */}
      {!hasTeams ? (
        <div className="mb-8">
          <CommitTeamsButton onDone={load} />
        </div>
      ) : (
        <details className="mb-8 rounded-xl border border-white/10 bg-white/[0.02]">
          <summary className="cursor-pointer px-4 py-3 text-sm text-zinc-300">
            Lag ({teams.length}) — trekk på nytt / oppdater
          </summary>
          <div className="p-4 pt-0">
            <CommitTeamsButton onDone={load} />
          </div>
        </details>
      )}

      {hasTeams && (
        <>
          {/* 2. Ny øvelse */}
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Ny øvelse
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={2}
                className="w-14 text-center bg-black/40 border border-white/20 rounded-lg px-2 py-2 text-lg focus:outline-none focus:border-white/40"
                aria-label="Emoji/ikon"
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addEvent()}
                placeholder="F.eks. Minigolf"
                className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-300 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={finale}
                onChange={(e) => setFinale(e.target.checked)}
                className="accent-amber-400"
              />
              Dobbel-poeng-finale (20/14/10/6)
            </label>
            <button
              onClick={addEvent}
              disabled={creating || !name.trim()}
              className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-emerald-950 font-bold py-2 transition-colors"
            >
              {creating ? "Oppretter…" : "Opprett øvelse"}
            </button>
          </div>

          {/* 3. Øvelser */}
          <div className="space-y-3 mb-8">
            {events.length === 0 && (
              <p className="text-zinc-500 text-sm text-center py-4">
                Ingen øvelser enda. Legg til den første over.
              </p>
            )}
            {events.map((ev) => {
              const done = ev.status === "done";
              const isOpen = openEventId === ev.id;
              return (
                <div
                  key={ev.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenEventId(isOpen ? null : ev.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03]"
                  >
                    <span className="text-xl">{ev.icon ?? "🏅"}</span>
                    <span className="flex-1 font-bold text-white">{ev.name}</span>
                    {done ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs">
                        <CheckCircle2 className="w-4 h-4" /> Ferdig
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-zinc-500 text-xs">
                        <CircleDot className="w-4 h-4" /> Ikke spilt
                      </span>
                    )}
                  </button>
                  {isOpen && session && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5">
                      <EventScorer
                        event={ev}
                        teams={teams}
                        initialRanked={rankedFor(ev.id)}
                        enteredBy={session.participantId}
                        onSaved={() => {
                          setOpenEventId(null);
                          load();
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4. Stilling */}
          <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-3">
            Sammenlagt
          </h2>
          <TeamLeaderboard variant="full" editable />
        </>
      )}
    </div>
  );
}
