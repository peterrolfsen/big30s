"use client";

import { useState } from "react";
import { Award, Loader2, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { submitPhotoVote } from "@/app/actions/photo";

interface PhotoEntryData {
  id: string;
  photo_url: string;
  caption: string | null;
  participant_id: string;
}

interface VotingInterfaceProps {
  entries: PhotoEntryData[];
  competitionId: string;
  hasVoted: boolean;
  onVoted: () => void;
}

const rankLabels = ["1. plass", "2. plass", "3. plass"];
const rankColors = ["text-amber-400", "text-zinc-300", "text-orange-400"];
const rankBg = [
  "border-amber-500/50 bg-amber-500/10",
  "border-zinc-400/30 bg-zinc-400/5",
  "border-orange-500/40 bg-orange-500/10",
];

export default function VotingInterface({
  entries,
  competitionId,
  hasVoted,
  onVoted,
}: VotingInterfaceProps) {
  const { session } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Filter out own entries
  const votableEntries = entries.filter(
    (e) => e.participant_id !== session?.participantId
  );

  const toggleSelect = (entryId: string) => {
    if (hasVoted) return;

    setSelected((prev) => {
      if (prev.includes(entryId)) {
        return prev.filter((id) => id !== entryId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, entryId];
    });
  };

  const handleSubmitVote = async () => {
    if (!session || selected.length !== 3) return;

    setIsSubmitting(true);
    setError("");

    const result = await submitPhotoVote(
      session.participantId,
      competitionId,
      selected[0],
      selected[1],
      selected[2]
    );

    if (result.success) {
      onVoted();
    } else {
      setError(result.error || "Noe gikk galt");
    }

    setIsSubmitting(false);
  };

  if (hasVoted) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-white font-medium">Stemmen din er registrert!</p>
        <p className="text-zinc-500 text-sm mt-1">
          Vinneren avsløres snart
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-zinc-300 text-sm">
          Velg dine topp 3 (trykk i rekkefølge: 1., 2., 3. plass)
        </p>
        {selected.length > 0 && selected.length < 3 && (
          <span className="text-amber-400 text-xs">
            {3 - selected.length} igjen
          </span>
        )}
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <div className="flex gap-2 mb-4">
          {selected.map((id, index) => (
            <span
              key={id}
              className={`px-3 py-1 rounded-lg text-xs font-medium border ${rankBg[index]} ${rankColors[index]}`}
            >
              <Award className="w-3 h-3 inline mr-1" />
              {rankLabels[index]}
            </span>
          ))}
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {votableEntries.map((entry) => {
          const rankIndex = selected.indexOf(entry.id);
          const isSelected = rankIndex !== -1;

          return (
            <button
              key={entry.id}
              onClick={() => toggleSelect(entry.id)}
              className={`relative rounded-xl overflow-hidden aspect-square group transition-all ${
                isSelected
                  ? `ring-2 ${
                      rankIndex === 0
                        ? "ring-amber-400"
                        : rankIndex === 1
                        ? "ring-zinc-300"
                        : "ring-orange-400"
                    }`
                  : "ring-1 ring-white/10 hover:ring-white/30"
              }`}
            >
              <img
                src={entry.photo_url}
                alt={entry.caption || "Bidrag"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />

              {isSelected && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span
                    className={`text-2xl font-black ${rankColors[rankIndex]}`}
                  >
                    {rankIndex + 1}
                  </span>
                </div>
              )}

              {entry.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs truncate">{entry.caption}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      <button
        onClick={handleSubmitVote}
        disabled={selected.length !== 3 || isSubmitting}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold disabled:opacity-30 hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Award className="w-4 h-4" />
            Send stemme
          </>
        )}
      </button>
    </div>
  );
}
