"use client";

import { Star, Lock, CheckCircle2, Clock, Users } from "lucide-react";
import { categoryConfig, difficultyConfig } from "@/config/games";
import type { BountyChallenge } from "@/lib/types";

interface ChallengeCardProps {
  challenge: BountyChallenge;
  completedCount: number;
  mySubmission: boolean;
  isApproved: boolean;
  onClick: () => void;
}

export default function ChallengeCard({
  challenge,
  completedCount,
  mySubmission,
  isApproved,
  onClick,
}: ChallengeCardProps) {
  const category = categoryConfig[challenge.category];
  const difficulty = difficultyConfig[challenge.difficulty];

  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${
        isApproved
          ? "bg-emerald-500/5 border-emerald-500/20"
          : mySubmission
          ? "bg-amber-500/5 border-amber-500/20"
          : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      {/* Status badge */}
      {isApproved && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      )}
      {mySubmission && !isApproved && (
        <div className="absolute top-3 right-3">
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
      )}

      {/* Secret badge */}
      {challenge.is_secret && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-purple-400" />
        </div>
      )}

      {/* Category & points */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
          }}
        >
          {category.emoji} {category.label}
        </span>
        <span className="text-sm font-bold text-amber-400">
          {challenge.points}p
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-sm mb-1">
        {challenge.title}
      </h3>

      {/* Description */}
      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-3">
        {challenge.description}
      </p>

      {/* Footer: difficulty + completed count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: difficulty.stars }).map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3 text-amber-400 fill-amber-400"
            />
          ))}
          {Array.from({ length: 3 - difficulty.stars }).map((_, i) => (
            <Star key={i} className="w-3 h-3 text-zinc-700" />
          ))}
        </div>
        {completedCount > 0 && (
          <span className="text-zinc-500 text-xs flex items-center gap-1">
            <Users className="w-3 h-3" />
            {completedCount} fullfort
          </span>
        )}
      </div>
    </button>
  );
}
