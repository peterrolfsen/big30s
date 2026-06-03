"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { voteBountySubmission } from "@/app/actions/bounty";

interface SubmissionCardProps {
  submission: {
    id: string;
    photo_url: string | null;
    comment: string | null;
    status: string;
    created_at: string;
    participant: { display_name: string } | null;
    challenge: { title: string; points: number } | null;
  };
  votes: { voter_id: string; vote: boolean }[];
  onVoted: () => void;
}

export default function SubmissionCard({
  submission,
  votes,
  onVoted,
}: SubmissionCardProps) {
  const { session } = useAuth();
  const [isVoting, setIsVoting] = useState(false);

  const approveCount = votes.filter((v) => v.vote).length;
  const rejectCount = votes.filter((v) => !v.vote).length;
  const myVote = votes.find((v) => v.voter_id === session?.participantId);

  const handleVote = async (vote: boolean) => {
    if (!session || isVoting) return;
    setIsVoting(true);

    await voteBountySubmission(session.participantId, submission.id, vote);
    onVoted();

    setIsVoting(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Photo */}
      {submission.photo_url && (
        <img
          src={submission.photo_url}
          alt="Bevis"
          className="w-full aspect-video object-cover"
        />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white text-sm font-medium">
              {submission.participant?.display_name}
            </p>
            <p className="text-zinc-500 text-xs">
              {submission.challenge?.title} ·{" "}
              {submission.challenge?.points}p
            </p>
          </div>
          <div>
            {submission.status === "approved" ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Godkjent
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <Clock className="w-4 h-4" />
                Venter
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        {submission.comment && (
          <p className="text-zinc-300 text-sm mb-3">
            &ldquo;{submission.comment}&rdquo;
          </p>
        )}

        {/* Time */}
        <p className="text-zinc-600 text-xs mb-3">
          {formatTime(submission.created_at)}
        </p>

        {/* Votes */}
        {submission.status === "pending" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote(true)}
              disabled={isVoting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                myVote?.vote === true
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-emerald-500/10 hover:text-emerald-400"
              }`}
            >
              {isVoting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ThumbsUp className="w-3.5 h-3.5" />
              )}
              {approveCount}
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={isVoting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                myVote?.vote === false
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400"
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              {rejectCount}
            </button>

            <div className="flex-1" />
            <span className="text-zinc-600 text-xs">
              {3 - approveCount > 0
                ? `${3 - approveCount} til for godkjenning`
                : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
