"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Camera,
  Loader2,
  Send,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { submitPhoto, updateCompetitionStatus } from "@/app/actions/photo";
import PhotoUpload from "@/components/games/PhotoUpload";
import CompetitionHeader from "@/components/games/foto/CompetitionHeader";
import VotingInterface from "@/components/games/foto/VotingInterface";
import WinnerReveal from "@/components/games/foto/WinnerReveal";
import Leaderboard from "@/components/games/Leaderboard";
import type { PhotoCompetition } from "@/lib/types";

interface EntryData {
  id: string;
  photo_url: string;
  caption: string | null;
  participant_id: string;
  participants: { display_name: string } | null;
}

export default function FotoPage() {
  const { session } = useAuth();
  const [competitions, setCompetitions] = useState<PhotoCompetition[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Photo submission state
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const competition = competitions[selectedIndex];

  const loadData = useCallback(async () => {
    // Load all competitions
    const { data: comps } = await supabase
      .from("photo_competitions")
      .select("*")
      .order("date", { ascending: true });

    if (comps) {
      setCompetitions(comps);

      // Find today's or most relevant competition
      const today = new Date().toISOString().split("T")[0];
      const todayIndex = comps.findIndex((c) => c.date === today);
      const activeIndex = comps.findIndex(
        (c) => c.status === "submissions_open" || c.status === "voting_open"
      );
      setSelectedIndex(
        activeIndex >= 0 ? activeIndex : todayIndex >= 0 ? todayIndex : 0
      );
    }

    setIsLoading(false);
  }, []);

  // Load entries for selected competition
  const loadEntries = useCallback(async () => {
    if (!competition) return;

    const { data } = await supabase
      .from("photo_entries")
      .select("id, photo_url, caption, participant_id, participants(display_name)")
      .eq("competition_id", competition.id);

    if (data) {
      setEntries(data as unknown as EntryData[]);
      setHasSubmitted(
        data.some((e) => e.participant_id === session?.participantId)
      );
    }

    // Check if user has voted
    const { data: votes, count } = await supabase
      .from("photo_votes")
      .select("*", { count: "exact" })
      .eq("competition_id", competition.id);

    setVoteCount(count || 0);

    if (votes) {
      setHasVoted(
        votes.some((v) => v.voter_id === session?.participantId)
      );
    }
  }, [competition, session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Realtime
  useEffect(() => {
    if (!competition) return;

    const channel = supabase
      .channel("photo-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "photo_entries" },
        () => loadEntries()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "photo_votes" },
        () => loadEntries()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "photo_competitions" },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [competition, loadEntries, loadData]);

  const handleSubmitPhoto = async () => {
    if (!session || !competition || !photoUrl) return;
    setIsSubmitting(true);

    const result = await submitPhoto(
      session.participantId,
      competition.id,
      photoUrl,
      caption || null
    );

    if (result.success) {
      setHasSubmitted(true);
      setPhotoUrl(null);
      setCaption("");
      loadEntries();
    }

    setIsSubmitting(false);
  };

  const handleStatusChange = async (status: string) => {
    if (!session || !competition) return;
    await updateCompetitionStatus(session.participantId, competition.id, status);
    loadData();
  };

  // Calculate winners for completed competitions
  const getWinners = () => {
    if (!competition || competition.status !== "completed") return [];

    // Fetch and calculate would normally come from server
    // For now, return empty (will be populated when votes exist)
    return [];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-6 pt-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/20">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Photo <span className="gradient-text">Wars</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          {/* Day navigation */}
          {competitions.length > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  setSelectedIndex((i) => Math.max(0, i - 1))
                }
                disabled={selectedIndex === 0}
                className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1.5">
                {competitions.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === selectedIndex
                        ? "bg-purple-400 scale-125"
                        : c.status === "completed"
                        ? "bg-zinc-600"
                        : "bg-zinc-700 hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setSelectedIndex((i) =>
                    Math.min(competitions.length - 1, i + 1)
                  )
                }
                disabled={selectedIndex === competitions.length - 1}
                className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Competition header */}
          {competition && (
            <CompetitionHeader
              competition={competition}
              entryCount={entries.length}
              voteCount={voteCount}
            />
          )}

          {/* Admin controls */}
          {session?.isAdmin && competition && (
            <div className="glass rounded-xl p-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-xs text-zinc-400 mr-2">
                <Shield className="w-3.5 h-3.5" />
                Admin:
              </span>
              {competition.status !== "submissions_open" && (
                <button
                  onClick={() => handleStatusChange("submissions_open")}
                  className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 transition-colors"
                >
                  Åpne innsending
                </button>
              )}
              {competition.status === "submissions_open" && (
                <button
                  onClick={() => handleStatusChange("voting_open")}
                  className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs hover:bg-purple-500/20 transition-colors"
                >
                  Åpne stemming
                </button>
              )}
              {competition.status === "voting_open" && (
                <button
                  onClick={() => handleStatusChange("completed")}
                  className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs hover:bg-amber-500/20 transition-colors"
                >
                  Vis vinnere
                </button>
              )}
            </div>
          )}

          {/* Submission form */}
          {competition?.status === "submissions_open" && !hasSubmitted && (
            <div className="glass rounded-2xl p-4 space-y-4">
              <h3 className="text-white font-semibold text-sm">
                Send inn ditt bilde
              </h3>
              <PhotoUpload
                bucket="photo-wars"
                path={`${competition.id}/${session?.participantId}`}
                onUpload={setPhotoUrl}
              />
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Bildetekst (valgfritt)"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:border-purple-500/50 focus:outline-none transition-colors"
              />
              <button
                onClick={handleSubmitPhoto}
                disabled={!photoUrl || isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold disabled:opacity-30 hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send inn
                  </>
                )}
              </button>
            </div>
          )}

          {/* Already submitted */}
          {competition?.status === "submissions_open" && hasSubmitted && (
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-emerald-400 text-sm font-medium">
                Bildet ditt er sendt inn! Vent på stemmefasen.
              </p>
            </div>
          )}

          {/* Voting */}
          {competition?.status === "voting_open" && (
            <VotingInterface
              entries={entries}
              competitionId={competition.id}
              hasVoted={hasVoted}
              onVoted={() => {
                setHasVoted(true);
                loadEntries();
              }}
            />
          )}

          {/* Winners */}
          {competition?.status === "completed" && (
            <WinnerReveal winners={getWinners()} />
          )}

          {/* Gallery for completed competitions */}
          {competition?.status === "completed" && entries.length > 0 && (
            <div>
              <h3 className="text-zinc-300 text-sm font-medium mb-3">
                Alle bidrag
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl overflow-hidden border border-white/10"
                  >
                    <img
                      src={entry.photo_url}
                      alt={entry.caption || "Bidrag"}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-2 bg-white/[0.03]">
                      <p className="text-white text-xs font-medium">
                        {entry.participants?.display_name}
                      </p>
                      {entry.caption && (
                        <p className="text-zinc-500 text-xs truncate">
                          {entry.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No competition */}
          {!competition && (
            <div className="glass rounded-xl p-8 text-center">
              <Camera className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-500">
                Ingen fotokonkurranser ennå
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden md:block space-y-4">
          <h3 className="text-sm font-medium text-zinc-400">Turpoeng</h3>
          <Leaderboard variant="compact" />
        </div>
      </div>
    </div>
  );
}
