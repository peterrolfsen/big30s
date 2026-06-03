"use client";

import { Trophy } from "lucide-react";
import Leaderboard from "@/components/games/Leaderboard";

export default function PoengPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6">
      <div className="text-center mb-8 pt-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
          <Trophy className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
          Tur<span className="gradient-text">poeng</span>
        </h1>
        <p className="text-zinc-400 text-sm">
          Sammenlagt poengsum fra Bounty Board og Photo Wars
        </p>
      </div>

      <Leaderboard variant="full" />
    </div>
  );
}
