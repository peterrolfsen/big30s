// =====================================================
// OL / LEKENE — konfigurasjon og scoring-logikk
// Se docs/OL-LEKENE-PLAN.md for helheten.
// =====================================================

import type { OlResult, OlStanding, OlTeam } from "@/lib/types";

// Poeng for 1., 2., 3., 4. … plass, etter antall lag.
// Admin kan overstyre per øvelse via point_scheme på ol_events.
export const DEFAULT_SCHEMES: Record<number, number[]> = {
  2: [10, 5],
  3: [10, 6, 3],
  4: [10, 7, 5, 3],
  5: [10, 7, 5, 3, 1],
  6: [12, 9, 7, 5, 3, 1],
};

// Dobbel-poeng-finale (valgfritt på siste øvelse) for en spennende avslutning.
export const FINALE_SCHEME = [20, 14, 10, 6];

// Standard-skjema for et gitt antall lag (faller tilbake til 4-lags hvis ukjent).
export const defaultSchemeFor = (teamCount: number): number[] =>
  DEFAULT_SCHEMES[teamCount] ?? DEFAULT_SCHEMES[4];

// Poeng for en plassering gitt skjemaet. Plasseringer utenfor skjemaet gir 0.
export const pointsForPlacement = (placement: number, scheme: number[]): number =>
  scheme[placement - 1] ?? 0;

// =====================================================
// Sammenlagt-leaderboard med tiebreaker
// =====================================================

const MAX_PLACEMENT = 12; // nok til tiebreaker-sammenligning

/**
 * Bygger sammenlagt-stillingen fra lag + alle resultater.
 * Sortering:
 *   1) total poeng (synkende)
 *   2) flest 1.-plasser, så flest 2.-plasser, … (tiebreaker)
 *   3) sort_order (stabilt fallback)
 */
export function buildStandings(
  teams: OlTeam[],
  results: OlResult[]
): OlStanding[] {
  const byTeam = new Map<string, { total: number; placements: Record<number, number> }>();
  for (const team of teams) {
    byTeam.set(team.id, { total: 0, placements: {} });
  }
  for (const r of results) {
    const agg = byTeam.get(r.team_id);
    if (!agg) continue;
    agg.total += r.points;
    agg.placements[r.placement] = (agg.placements[r.placement] ?? 0) + 1;
  }

  const rows = teams.map((team) => {
    const agg = byTeam.get(team.id)!;
    return { team, total: agg.total, placements: agg.placements };
  });

  rows.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    // Tiebreaker: flest 1.-plasser, så 2., …
    for (let p = 1; p <= MAX_PLACEMENT; p++) {
      const diff = (b.placements[p] ?? 0) - (a.placements[p] ?? 0);
      if (diff !== 0) return diff;
    }
    return a.team.sort_order - b.team.sort_order;
  });

  return rows.map((row, i) => ({ ...row, rank: i + 1 }));
}

// =====================================================
// Neon-aksenter (delt med roster) — for leaderboard/tavle/pall
// =====================================================
export const olAccentStyles: Record<
  OlTeam["accent"],
  { text: string; bar: string; dot: string; ring: string; glow: string }
> = {
  cyan: {
    text: "text-cyan-400",
    bar: "from-cyan-500 to-sky-300",
    dot: "bg-cyan-400",
    ring: "ring-cyan-400",
    glow: "shadow-[0_0_30px_-8px_rgba(34,211,238,0.7)]",
  },
  amber: {
    text: "text-amber-400",
    bar: "from-amber-500 to-yellow-300",
    dot: "bg-amber-400",
    ring: "ring-amber-400",
    glow: "shadow-[0_0_30px_-8px_rgba(251,191,36,0.7)]",
  },
  rose: {
    text: "text-rose-400",
    bar: "from-rose-500 to-pink-300",
    dot: "bg-rose-400",
    ring: "ring-rose-400",
    glow: "shadow-[0_0_30px_-8px_rgba(251,113,133,0.7)]",
  },
  violet: {
    text: "text-violet-400",
    bar: "from-violet-500 to-purple-300",
    dot: "bg-violet-400",
    ring: "ring-violet-400",
    glow: "shadow-[0_0_30px_-8px_rgba(167,139,250,0.7)]",
  },
  emerald: {
    text: "text-emerald-400",
    bar: "from-emerald-500 to-green-300",
    dot: "bg-emerald-400",
    ring: "ring-emerald-400",
    glow: "shadow-[0_0_30px_-8px_rgba(52,211,153,0.7)]",
  },
};

// Medalje-emoji for de tre øverste plassene (ellers tallet).
export const placementBadge = (rank: number): string =>
  rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}.`;
