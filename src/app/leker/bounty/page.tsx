"use client";

import { useState, useEffect, useCallback } from "react";
import { Target, ClipboardList, CheckSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import CategoryFilter from "@/components/games/bounty/CategoryFilter";
import ChallengeCard from "@/components/games/bounty/ChallengeCard";
import SubmissionForm from "@/components/games/bounty/SubmissionForm";
import SubmissionCard from "@/components/games/bounty/SubmissionCard";
import Leaderboard from "@/components/games/Leaderboard";
import type { BountyChallenge } from "@/lib/types";

type Tab = "challenges" | "approvals";

export default function BountyPage() {
  const { session } = useAuth();
  const [tab, setTab] = useState<Tab>("challenges");
  const [challenges, setChallenges] = useState<BountyChallenge[]>([]);
  const [submissions, setSubmissions] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any[]>
  >({});
  const [pendingSubmissions, setPendingSubmissions] = useState<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[]
  >([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<number | null>(null);
  const [selectedChallenge, setSelectedChallenge] =
    useState<BountyChallenge | null>(null);

  const loadData = useCallback(async () => {
    // Load challenges
    let query = supabase
      .from("bounty_challenges")
      .select("*")
      .eq("is_active", true);

    // Filter secret challenges (only show if assigned to current user)
    const { data: allChallenges } = await query.order("points", {
      ascending: false,
    });

    if (allChallenges) {
      const visible = allChallenges.filter(
        (c: BountyChallenge) =>
          !c.is_secret || c.assigned_to === session?.participantId
      );
      setChallenges(visible);
    }

    // Load all submissions grouped by challenge
    const { data: allSubmissions } = await supabase
      .from("bounty_submissions")
      .select(
        "*, participants:participant_id(display_name), bounty_challenges:challenge_id(title, points)"
      );

    if (allSubmissions) {
      const grouped: Record<string, typeof allSubmissions> = {};
      allSubmissions.forEach((s) => {
        if (!grouped[s.challenge_id]) grouped[s.challenge_id] = [];
        grouped[s.challenge_id].push(s);
      });
      setSubmissions(grouped);

      // Pending submissions for approval tab
      const pending = allSubmissions.filter(
        (s) =>
          s.status === "pending" &&
          s.participant_id !== session?.participantId
      );
      setPendingSubmissions(pending);
    }
  }, [session]);

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("bounty-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bounty_submissions" },
        () => loadData()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bounty_votes" },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  // Filter challenges
  const filteredChallenges = challenges.filter((c) => {
    if (activeCategory && c.category !== activeCategory) return false;
    if (activeDifficulty && c.difficulty !== activeDifficulty) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {selectedChallenge && (
        <SubmissionForm
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onSubmitted={() => {
            setSelectedChallenge(null);
            loadData();
          }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-6 pt-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Bounty <span className="gradient-text">Board</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Fullfør utfordringer og samle turpoeng
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        {/* Main content */}
        <div>
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab("challenges")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "challenges"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Utfordringer
              <span className="text-xs text-zinc-500">
                {filteredChallenges.length}
              </span>
            </button>
            <button
              onClick={() => setTab("approvals")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === "approvals"
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Godkjenning
              {pendingSubmissions.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
          </div>

          {tab === "challenges" && (
            <>
              {/* Filters */}
              <div className="mb-4">
                <CategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  activeDifficulty={activeDifficulty}
                  onDifficultyChange={setActiveDifficulty}
                />
              </div>

              {/* Challenge grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredChallenges.map((challenge) => {
                  const subs = submissions[challenge.id] || [];
                  const approvedCount = subs.filter(
                    (s) => s.status === "approved"
                  ).length;
                  const mySubmission = subs.some(
                    (s) => s.participant_id === session?.participantId
                  );
                  const isApproved = subs.some(
                    (s) =>
                      s.participant_id === session?.participantId &&
                      s.status === "approved"
                  );

                  return (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      completedCount={approvedCount}
                      mySubmission={mySubmission}
                      isApproved={isApproved}
                      onClick={() => {
                        if (!mySubmission) setSelectedChallenge(challenge);
                      }}
                    />
                  );
                })}
              </div>

              {filteredChallenges.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-500">
                    Ingen utfordringer matcher filteret
                  </p>
                </div>
              )}
            </>
          )}

          {tab === "approvals" && (
            <div className="space-y-4">
              {pendingSubmissions.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center">
                  <CheckSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500 text-sm">
                    Ingen submissions å godkjenne
                  </p>
                </div>
              ) : (
                pendingSubmissions.map((sub) => (
                  <SubmissionCardWrapper
                    key={sub.id}
                    submission={sub}
                    onVoted={loadData}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Leaderboard */}
        <div className="hidden md:block">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Turpoeng</h3>
          <Leaderboard variant="compact" />
        </div>
      </div>
    </div>
  );
}

// Wrapper to load votes for each submission
function SubmissionCardWrapper({
  submission,
  onVoted,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submission: any;
  onVoted: () => void;
}) {
  const [votes, setVotes] = useState<{ voter_id: string; vote: boolean }[]>([]);

  useEffect(() => {
    async function loadVotes() {
      const { data } = await supabase
        .from("bounty_votes")
        .select("voter_id, vote")
        .eq("submission_id", submission.id);
      if (data) setVotes(data);
    }
    loadVotes();
  }, [submission.id]);

  return (
    <SubmissionCard
      submission={{
        ...submission,
        participant: submission.participants,
        challenge: submission.bounty_challenges,
      }}
      votes={votes}
      onVoted={onVoted}
    />
  );
}
