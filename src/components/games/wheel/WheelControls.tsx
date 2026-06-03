"use client";

import { useState } from "react";
import { Users, Flame, Pencil, X, Plus } from "lucide-react";
import { participants } from "@/config/games";
import { wheelDares } from "@/config/games";

export type WheelMode = "names" | "dare" | "custom";

interface WheelControlsProps {
  mode: WheelMode;
  onModeChange: (mode: WheelMode) => void;
  customSegments: string[];
  onCustomSegmentsChange: (segments: string[]) => void;
  getSegments: () => string[];
}

const modes = [
  { id: "names" as const, label: "Hvem tar?", icon: Users, description: "Tilfeldig person" },
  { id: "dare" as const, label: "Dare", icon: Flame, description: "Tilfeldig dare" },
  { id: "custom" as const, label: "Custom", icon: Pencil, description: "Egne valg" },
];

export default function WheelControls({
  mode,
  onModeChange,
  customSegments,
  onCustomSegmentsChange,
}: WheelControlsProps) {
  const [newSegment, setNewSegment] = useState("");

  const addCustomSegment = () => {
    const trimmed = newSegment.trim();
    if (trimmed && !customSegments.includes(trimmed)) {
      onCustomSegmentsChange([...customSegments, trimmed]);
      setNewSegment("");
    }
  };

  const removeCustomSegment = (index: number) => {
    onCustomSegmentsChange(customSegments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
              mode === m.id
                ? "border-orange-500/50 bg-orange-500/10 text-white"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06]"
            }`}
          >
            <m.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Mode info */}
      <div className="glass rounded-xl p-3">
        <p className="text-zinc-400 text-xs">
          {mode === "names" && `${participants.length} deltakere på hjulet`}
          {mode === "dare" && `${wheelDares.length} tilfeldige dares`}
          {mode === "custom" && `${customSegments.length} egne valg`}
        </p>
      </div>

      {/* Custom segments editor */}
      {mode === "custom" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSegment}
              onChange={(e) => setNewSegment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomSegment()}
              placeholder="Legg til valg..."
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:border-orange-500/50 focus:outline-none transition-colors"
            />
            <button
              onClick={addCustomSegment}
              disabled={!newSegment.trim()}
              className="px-3 py-2 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 disabled:opacity-30 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {customSegments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customSegments.map((seg, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-300"
                >
                  {seg}
                  <button
                    onClick={() => removeCustomSegment(i)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {customSegments.length < 2 && (
            <p className="text-amber-400/60 text-xs">
              Legg til minst 2 valg for å spinne
            </p>
          )}
        </div>
      )}
    </div>
  );
}
