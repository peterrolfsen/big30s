"use client";

import { useState, useEffect } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { commitDraftTeams } from "@/app/actions/olympics";
import { olAccentStyles } from "@/config/olympics";
import type { OlAccent } from "@/lib/types";

const RESULT_KEY = "30year_draft_result";

type DraftTeam = {
  id: string;
  name: string;
  accent: string;
  players: { id: string; name: string }[];
};

export default function CommitTeamsButton({ onDone }: { onDone?: () => void }) {
  const [draft, setDraft] = useState<DraftTeam[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESULT_KEY);
      if (raw) setDraft(JSON.parse(raw));
    } catch {
      /* ignorer */
    }
  }, []);

  if (!draft || !draft.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center">
        <p className="text-zinc-400 text-sm">
          Fant ingen lagtrekning. Kjør{" "}
          <a href="/roster" className="text-cyan-400 underline">
            lagtrekningen
          </a>{" "}
          først, så dukker lagene opp her.
        </p>
      </div>
    );
  }

  const totalPlayers = draft.reduce((n, t) => n + t.players.length, 0);

  async function commit() {
    if (!draft) return;
    setSaving(true);
    setError(null);
    const res = await commitDraftTeams(draft);
    setSaving(false);
    if (res.success) {
      setDone(true);
      onDone?.();
    } else {
      setError(res.error ?? "Noe gikk galt");
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Download className="w-4 h-4 text-cyan-400" />
        <h3 className="font-bold text-white">Bruk lagene fra trekningen</h3>
      </div>
      <p className="text-zinc-400 text-sm mb-4">
        Fant {draft.length} lag ({totalPlayers} spillere):
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {draft.map((t) => {
          const a = olAccentStyles[t.accent as OlAccent] ?? olAccentStyles.cyan;
          return (
            <span
              key={t.id}
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm ${a.text}`}
            >
              <span className={`w-2 h-2 rounded-full ${a.dot}`} />
              {t.name}
            </span>
          );
        })}
      </div>

      {error && <p className="text-rose-400 text-sm mb-3">{error}</p>}

      <button
        onClick={commit}
        disabled={saving || done}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-cyan-950 font-bold py-2.5 transition-colors"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Lagrer…
          </>
        ) : done ? (
          <>
            <Check className="w-4 h-4" /> Lagene er klare!
          </>
        ) : (
          "Bekreft og lagre lagene"
        )}
      </button>
      {done && (
        <p className="text-zinc-500 text-xs text-center mt-2">
          Egendefinerte lagnavn beholdes hvis du trekker på nytt.
        </p>
      )}
    </div>
  );
}
