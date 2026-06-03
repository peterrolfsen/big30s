"use client";

import { useState } from "react";
import { Send, Loader2, X } from "lucide-react";
import PhotoUpload from "@/components/games/PhotoUpload";
import { useAuth } from "@/lib/auth-context";
import { submitBountyProof } from "@/app/actions/bounty";
import { categoryConfig } from "@/config/games";
import type { BountyChallenge } from "@/lib/types";

interface SubmissionFormProps {
  challenge: BountyChallenge;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function SubmissionForm({
  challenge,
  onClose,
  onSubmitted,
}: SubmissionFormProps) {
  const { session } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const category = categoryConfig[challenge.category];

  const handleSubmit = async () => {
    if (!session) return;

    setIsSubmitting(true);
    setError("");

    const result = await submitBountyProof(
      session.participantId,
      challenge.id,
      photoUrl,
      comment || null
    );

    if (result.success) {
      onSubmitted();
    } else {
      setError(result.error || "Noe gikk galt");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#12121a] border border-white/10 rounded-t-2xl md:rounded-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#12121a] border-b border-white/5 p-4 flex items-center justify-between z-10">
          <div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.emoji} {challenge.points}p
            </span>
            <h2 className="text-white font-bold mt-1">{challenge.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <p className="text-zinc-400 text-sm">{challenge.description}</p>

          {/* Photo upload */}
          <div>
            <label className="text-xs text-zinc-400 font-medium mb-2 block">
              Bevis (bilde)
            </label>
            <PhotoUpload
              bucket="bounty-proofs"
              path={`${challenge.id}/${session?.participantId}`}
              onUpload={setPhotoUrl}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs text-zinc-400 font-medium mb-2 block">
              Kommentar (valgfritt)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Beskriv hva du gjorde..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:border-orange-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold disabled:opacity-50 hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send inn bevis
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
