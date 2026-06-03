"use client";

import { categoryConfig, difficultyConfig } from "@/config/games";
import { Star } from "lucide-react";

interface CategoryFilterProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  activeDifficulty: number | null;
  onDifficultyChange: (difficulty: number | null) => void;
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
  activeDifficulty,
  onDifficultyChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeCategory === null
              ? "bg-white/10 text-white border border-white/20"
              : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:bg-white/[0.06]"
          }`}
        >
          Alle
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() =>
              onCategoryChange(activeCategory === key ? null : key)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === key
                ? "text-white border"
                : "bg-white/[0.03] text-zinc-400 border border-white/5 hover:bg-white/[0.06]"
            }`}
            style={
              activeCategory === key
                ? {
                    backgroundColor: `${config.color}20`,
                    borderColor: `${config.color}40`,
                    color: config.color,
                  }
                : undefined
            }
          >
            <span>{config.emoji}</span>
            {config.label}
          </button>
        ))}
      </div>

      {/* Difficulty */}
      <div className="flex gap-2">
        {Object.entries(difficultyConfig).map(([level, config]) => (
          <button
            key={level}
            onClick={() =>
              onDifficultyChange(
                activeDifficulty === Number(level) ? null : Number(level)
              )
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeDifficulty === Number(level)
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "bg-white/[0.03] text-zinc-500 border border-white/5 hover:bg-white/[0.06]"
            }`}
          >
            {Array.from({ length: config.stars }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
            <span className="ml-1">{config.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
