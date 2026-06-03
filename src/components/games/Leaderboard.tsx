"use client";

import { useState, useEffect } from "react";
import { Trophy, Target, Camera, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardProps {
  variant?: "full" | "compact";
}

export default function Leaderboard({ variant = "full" }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();

    const channel = supabase
      .channel("leaderboard-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bounty_submissions" },
        () => loadLeaderboard()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "photo_votes" },
        () => loadLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadLeaderboard() {
    try {
      // Get participants
      const { data: participants } = await supabase
        .from("participants")
        .select("*");

      if (!participants) return;

      // Get approved bounty submissions with challenge points
      const { data: approvedSubmissions } = await supabase
        .from("bounty_submissions")
        .select("participant_id, bounty_challenges(points)")
        .eq("status", "approved");

      // Get completed photo competitions with votes
      const { data: completedComps } = await supabase
        .from("photo_competitions")
        .select("id")
        .eq("status", "completed");

      const photoPoints: Record<string, number> = {};

      if (completedComps) {
        for (const comp of completedComps) {
          // Get entries for this competition
          const { data: entries } = await supabase
            .from("photo_entries")
            .select("id, participant_id")
            .eq("competition_id", comp.id);

          // Get votes for this competition
          const { data: votes } = await supabase
            .from("photo_votes")
            .select("entry_id_1st, entry_id_2nd, entry_id_3rd")
            .eq("competition_id", comp.id);

          if (!entries || !votes) continue;

          // Calculate weighted scores
          const scores: Record<string, number> = {};
          for (const vote of votes) {
            scores[vote.entry_id_1st] =
              (scores[vote.entry_id_1st] || 0) + 3;
            scores[vote.entry_id_2nd] =
              (scores[vote.entry_id_2nd] || 0) + 2;
            scores[vote.entry_id_3rd] =
              (scores[vote.entry_id_3rd] || 0) + 1;
          }

          // Rank and assign points
          const ranked = Object.entries(scores).sort(([, a], [, b]) => b - a);
          const pointMap = [100, 50, 25];

          ranked.forEach(([entryId], index) => {
            if (index < 3) {
              const entry = entries.find((e) => e.id === entryId);
              if (entry) {
                photoPoints[entry.participant_id] =
                  (photoPoints[entry.participant_id] || 0) +
                  pointMap[index];
              }
            }
          });
        }
      }

      // Calculate bounty points
      const bountyPoints: Record<string, number> = {};
      if (approvedSubmissions) {
        for (const sub of approvedSubmissions) {
          const challenge = sub.bounty_challenges as unknown as { points: number };
          if (challenge) {
            bountyPoints[sub.participant_id] =
              (bountyPoints[sub.participant_id] || 0) + challenge.points;
          }
        }
      }

      // Build leaderboard
      const leaderboard: LeaderboardEntry[] = participants
        .map((p) => ({
          participant: p,
          bounty_points: bountyPoints[p.id] || 0,
          photo_points: photoPoints[p.id] || 0,
          total_points:
            (bountyPoints[p.id] || 0) + (photoPoints[p.id] || 0),
        }))
        .sort((a, b) => b.total_points - a.total_points);

      setEntries(leaderboard);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const displayEntries =
    variant === "compact" ? entries.slice(0, 5) : entries;

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(variant === "compact" ? 5 : 10)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {variant === "full" && (
        <div className="p-4 border-b border-white/5">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 text-xs text-zinc-500 font-medium px-2">
            <span className="w-8">#</span>
            <span>Spiller</span>
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" /> Bounty
            </span>
            <span className="flex items-center gap-1">
              <Camera className="w-3 h-3" /> Foto
            </span>
            <span className="font-bold text-zinc-400">Total</span>
          </div>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {displayEntries.map((entry, index) => (
          <div
            key={entry.participant.id}
            className={`flex items-center gap-3 p-3 px-5 transition-colors hover:bg-white/[0.03] ${
              index === 0 && entry.total_points > 0
                ? "bg-amber-500/5"
                : ""
            }`}
          >
            {/* Rank */}
            <div className="w-8 shrink-0">
              {index === 0 && entry.total_points > 0 ? (
                <Crown className="w-5 h-5 text-amber-400" />
              ) : (
                <span className="text-zinc-500 text-sm font-mono">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {entry.participant.display_name.charAt(0)}
              </div>
              <span className="text-white text-sm font-medium truncate">
                {entry.participant.display_name}
              </span>
              {entry.participant.is_jubilant && (
                <span className="text-amber-400 text-[10px]">30</span>
              )}
            </div>

            {variant === "full" ? (
              <>
                <span className="text-zinc-400 text-sm w-14 text-right">
                  {entry.bounty_points}
                </span>
                <span className="text-zinc-400 text-sm w-14 text-right">
                  {entry.photo_points}
                </span>
                <span className="text-white font-bold text-sm w-14 text-right">
                  {entry.total_points}
                </span>
              </>
            ) : (
              <span className="text-white font-bold text-sm">
                {entry.total_points}p
              </span>
            )}
          </div>
        ))}
      </div>

      {displayEntries.length === 0 && (
        <div className="p-8 text-center">
          <Trophy className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-500 text-sm">
            Ingen poeng ennå — fullfør utfordringer og delta i fotokonkurranser!
          </p>
        </div>
      )}
    </div>
  );
}
