"use client";

import { useState, useEffect } from "react";
import { Crown, Award, Medal } from "lucide-react";
import ConfettiEffect from "@/components/games/ConfettiEffect";

interface Winner {
  rank: number;
  entryId: string;
  photoUrl: string;
  displayName: string;
  score: number;
  points: number;
}

interface WinnerRevealProps {
  winners: Winner[];
}

const podiumConfig = [
  {
    icon: Crown,
    color: "text-amber-400",
    border: "border-amber-500/50",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/20",
    points: 100,
    label: "1. plass",
    height: "h-32",
  },
  {
    icon: Award,
    color: "text-zinc-300",
    border: "border-zinc-400/30",
    bg: "bg-zinc-500/10",
    glow: "shadow-zinc-400/10",
    points: 50,
    label: "2. plass",
    height: "h-24",
  },
  {
    icon: Medal,
    color: "text-orange-400",
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
    glow: "shadow-orange-400/10",
    points: 25,
    label: "3. plass",
    height: "h-20",
  },
];

export default function WinnerReveal({ winners }: WinnerRevealProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (winners.length === 0) return;

    // Reveal 3rd, 2nd, 1st with delays
    const timers = [
      setTimeout(() => setRevealedCount(1), 500), // 3rd
      setTimeout(() => setRevealedCount(2), 2000), // 2nd
      setTimeout(() => {
        setRevealedCount(3); // 1st
        setShowConfetti(true);
      }, 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [winners]);

  if (winners.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-zinc-500">Ingen vinnere ennå</p>
      </div>
    );
  }

  // Display order: 2nd, 1st, 3rd (podium layout)
  const podiumOrder = [
    winners.find((w) => w.rank === 2),
    winners.find((w) => w.rank === 1),
    winners.find((w) => w.rank === 3),
  ].filter(Boolean) as Winner[];

  return (
    <div>
      <ConfettiEffect active={showConfetti} />

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 md:gap-4 mt-6">
        {podiumOrder.map((winner) => {
          const config = podiumConfig[winner.rank - 1];
          const isRevealed =
            (winner.rank === 3 && revealedCount >= 1) ||
            (winner.rank === 2 && revealedCount >= 2) ||
            (winner.rank === 1 && revealedCount >= 3);

          return (
            <div
              key={winner.entryId}
              className={`flex flex-col items-center transition-all duration-700 ${
                isRevealed
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ flex: winner.rank === 1 ? 1.2 : 1 }}
            >
              {/* Photo */}
              <div
                className={`relative rounded-xl overflow-hidden border-2 ${config.border} mb-3 shadow-lg ${config.glow} ${
                  winner.rank === 1 ? "w-28 h-28 md:w-36 md:h-36" : "w-24 h-24 md:w-28 md:h-28"
                }`}
              >
                <img
                  src={winner.photoUrl}
                  alt={winner.displayName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1">
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                </div>
              </div>

              {/* Name */}
              <p className="text-white text-sm font-bold text-center">
                {winner.displayName}
              </p>

              {/* Points */}
              <span
                className={`text-xs font-bold mt-1 ${config.color}`}
              >
                +{config.points}p
              </span>

              {/* Podium bar */}
              <div
                className={`w-full ${config.height} ${config.bg} rounded-t-lg mt-2 border-t ${config.border}`}
              >
                <div className="flex items-center justify-center h-full">
                  <span className={`text-2xl font-black ${config.color}`}>
                    {winner.rank}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
