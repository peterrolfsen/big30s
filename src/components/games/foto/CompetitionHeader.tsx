"use client";

import { Camera, Send, Vote, Trophy, ChevronRight } from "lucide-react";
import type { PhotoCompetition } from "@/lib/types";

interface CompetitionHeaderProps {
  competition: PhotoCompetition;
  entryCount: number;
  voteCount: number;
}

const statusConfig = {
  upcoming: {
    label: "Kommer snart",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    icon: Camera,
  },
  submissions_open: {
    label: "Send inn bilde!",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    icon: Send,
  },
  voting_open: {
    label: "Stem nå!",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    icon: Vote,
  },
  completed: {
    label: "Avsluttet",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: Trophy,
  },
};

export default function CompetitionHeader({
  competition,
  entryCount,
  voteCount,
}: CompetitionHeaderProps) {
  const config = statusConfig[competition.status];
  const StatusIcon = config.icon;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("nb-NO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">
            {formatDate(competition.date)}
          </p>
          <h2 className="text-xl md:text-2xl font-black text-white">
            {competition.theme}
          </h2>
        </div>
        <span
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${config.color} ${config.bg}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {config.label}
        </span>
      </div>

      {competition.description && (
        <p className="text-zinc-400 text-sm mb-4">
          {competition.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Camera className="w-3.5 h-3.5" />
          {entryCount} bilder
        </span>
        <span className="flex items-center gap-1">
          <Vote className="w-3.5 h-3.5" />
          {voteCount} stemmer
        </span>
      </div>
    </div>
  );
}
