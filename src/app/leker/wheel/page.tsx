"use client";

import { useState, useCallback } from "react";
import { CircleDot, Sparkles } from "lucide-react";
import SpinningWheel from "@/components/games/wheel/SpinningWheel";
import WheelControls, {
  type WheelMode,
} from "@/components/games/wheel/WheelControls";
import SpinHistory from "@/components/games/wheel/SpinHistory";
import ConfettiEffect from "@/components/games/ConfettiEffect";
import { useAuth } from "@/lib/auth-context";
import { logSpin } from "@/app/actions/wheel";
import { participants, wheelDares } from "@/config/games";

export default function WheelPage() {
  const { session } = useAuth();
  const [mode, setMode] = useState<WheelMode>("names");
  const [customSegments, setCustomSegments] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const getSegments = useCallback(() => {
    switch (mode) {
      case "names":
        return participants.map((p) => p.displayName);
      case "dare":
        return wheelDares;
      case "custom":
        return customSegments;
    }
  }, [mode, customSegments]);

  const segments = getSegments();
  const canSpin = segments.length >= 2 && !spinning;

  const handleSpin = () => {
    if (!canSpin) return;
    setResult(null);
    setShowConfetti(false);
    setSpinning(true);
  };

  const handleResult = useCallback(
    (winner: string) => {
      setResult(winner);
      setShowConfetti(true);

      // Log to Supabase
      if (session) {
        logSpin(session.participantId, mode, segments, winner);
      }
    },
    [session, mode, segments]
  );

  const handleSpinEnd = useCallback(() => {
    setSpinning(false);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      <ConfettiEffect active={showConfetti} />

      {/* Header */}
      <div className="text-center mb-6 pt-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
          <CircleDot className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Wheel of <span className="gradient-text">Fate</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        {/* Main: Wheel + Spin button */}
        <div className="flex flex-col items-center gap-6">
          <SpinningWheel
            segments={segments}
            onResult={handleResult}
            spinning={spinning}
            onSpinEnd={handleSpinEnd}
          />

          {/* Result */}
          {result && !spinning && (
            <div className="glass rounded-2xl p-5 text-center w-full max-w-md animate-[bounce-scale_0.5s_ease-out]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-zinc-400 text-sm">Resultatet er...</span>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{result}</p>
            </div>
          )}

          {/* Spin button */}
          <button
            onClick={handleSpin}
            disabled={!canSpin}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/25 active:scale-95 transition-all"
          >
            {spinning ? "Spinner..." : "SPINN!"}
          </button>
        </div>

        {/* Sidebar: Controls + History */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">
              Modus
            </h2>
            <WheelControls
              mode={mode}
              onModeChange={setMode}
              customSegments={customSegments}
              onCustomSegmentsChange={setCustomSegments}
              getSegments={getSegments}
            />
          </div>

          <SpinHistory />
        </div>
      </div>
    </div>
  );
}
