"use client";

import { useState, useEffect } from "react";
import { Lock, User, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { verifyPin, getParticipants } from "@/app/actions/auth";

interface ParticipantOption {
  id: string;
  name: string;
  display_name: string;
  is_jubilant: boolean;
}

export default function LoginForm() {
  const { login } = useAuth();
  const [participants, setParticipants] = useState<ParticipantOption[]>([]);
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantOption | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"select" | "pin">("select");
  const [useAdminCode, setUseAdminCode] = useState(false);

  useEffect(() => {
    getParticipants().then(setParticipants);
  }, []);

  const handleSelectParticipant = (p: ParticipantOption) => {
    setSelectedParticipant(p);
    setStep("pin");
    setPin("");
    setError("");
  };

  const handleSubmitPin = async () => {
    if (!selectedParticipant || pin.length < 1) return;
    if (!useAdminCode && pin.length !== 4) return;

    setIsLoading(true);
    setError("");

    const result = await verifyPin(selectedParticipant.id, pin);

    if (result.success && result.session) {
      login(result.session);
    } else {
      setError(result.error || "Feil PIN");
      setPin("");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
            <span className="text-white font-black text-2xl">30</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Turleker</h1>
          <p className="text-zinc-400 text-sm">
            Logg inn for å delta i lekene
          </p>
        </div>

        {step === "select" ? (
          /* Step 1: Velg navn */
          <div className="space-y-2">
            <p className="text-zinc-300 text-sm font-medium mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Hvem er du?
            </p>
            <div className="grid gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {participants.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectParticipant(p)}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-sm font-bold text-white">
                      {p.display_name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {p.display_name}
                      </div>
                      {p.is_jubilant && (
                        <div className="text-amber-400 text-xs">Jubilant</div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Step 2: PIN-kode */
          <div>
            <button
              onClick={() => setStep("select")}
              className="text-zinc-400 hover:text-white text-sm mb-6 transition-colors"
            >
              ← Tilbake
            </button>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg font-bold text-white">
                  {selectedParticipant?.display_name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {selectedParticipant?.display_name}
                  </div>
                  <div className="text-zinc-400 text-sm">
                    {useAdminCode ? "Tast admin-kode" : "Tast din 4-sifrede PIN"}
                  </div>
                </div>
              </div>

              {useAdminCode ? (
                /* Admin-kode: fritekstfelt */
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-xs font-medium">Admin-modus</span>
                  </div>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmitPin()}
                    placeholder="Admin-kode"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/30 text-white text-center text-lg tracking-widest placeholder:text-zinc-600 placeholder:tracking-normal focus:border-purple-500/60 focus:outline-none transition-colors"
                  />
                </div>
              ) : (
                /* Vanlig PIN: numpad */
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-4 h-4 text-zinc-400" />
                    <div className="flex gap-3 flex-1 justify-center">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                            pin.length > i
                              ? "border-orange-500 bg-orange-500/10 text-white"
                              : "border-white/10 bg-white/5 text-zinc-600"
                          }`}
                        >
                          {pin.length > i ? "•" : ""}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map(
                      (key, idx) => {
                        if (key === null)
                          return <div key={idx} className="h-14" />;
                        if (key === "del") {
                          return (
                            <button
                              key={idx}
                              onClick={() => setPin((p) => p.slice(0, -1))}
                              className="h-14 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-sm font-medium"
                            >
                              Slett
                            </button>
                          );
                        }
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (pin.length < 4) setPin((p) => p + key);
                            }}
                            className="h-14 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-white text-xl font-medium transition-all"
                          >
                            {key}
                          </button>
                        );
                      }
                    )}
                  </div>
                </>
              )}

              {error && (
                <p className="text-red-400 text-sm text-center mb-4">
                  {error}
                </p>
              )}

              <button
                onClick={handleSubmitPin}
                disabled={(!useAdminCode && pin.length !== 4) || (useAdminCode && pin.length < 1) || isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Logg inn"
                )}
              </button>

              {/* Toggle admin mode */}
              <button
                onClick={() => { setUseAdminCode(!useAdminCode); setPin(""); setError(""); }}
                className="w-full mt-3 py-2 text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
              >
                {useAdminCode ? "Bruk vanlig PIN" : "Admin-innlogging"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
