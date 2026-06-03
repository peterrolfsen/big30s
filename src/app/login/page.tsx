"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { verifyPin } from "@/lib/auth/actions";
import { MapPin, Lock } from "lucide-react";

const PIN_LENGTH = 4;

export default function LoginPage() {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(verifyPin, {});

  // Fokuser første input ved oppstart
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Reset ved feil
  useEffect(() => {
    if (state.error) {
      setDigits(Array(PIN_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [state.error]);

  function handleChange(index: number, value: string) {
    // Håndter paste av hel PIN
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, "").slice(0, PIN_LENGTH).split("");
      const newDigits = [...digits];
      pastedDigits.forEach((d, i) => {
        if (index + i < PIN_LENGTH) newDigits[index + i] = d;
      });
      setDigits(newDigits);
      const nextIndex = Math.min(index + pastedDigits.length, PIN_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();

      // Auto-submit hvis alle er fylt
      if (newDigits.every((d) => d !== "")) {
        setTimeout(() => formRef.current?.requestSubmit(), 50);
      }
      return;
    }

    const digit = value.replace(/\D/g, "");
    if (!digit && value !== "") return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Gå til neste felt
    if (digit && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit når alle er fylt
    if (digit && newDigits.every((d) => d !== "")) {
      setTimeout(() => formRef.current?.requestSubmit(), 50);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#0a0a0b] flex items-center justify-center relative overflow-hidden">
      {/* Grain overlay */}
      <div className="grain" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/15 rounded-full blur-[100px] md:blur-[128px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-cyan-500/10 rounded-full blur-[100px] md:blur-[128px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
            <span className="text-white font-black text-2xl">30</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Big Thirties
          </h1>
          <div className="flex items-center gap-1.5 mt-2 text-zinc-500">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">Algarve, Portugal</span>
          </div>
        </div>

        {/* Login card */}
        <div className="glass rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white text-center">
              Skriv inn PIN
            </h2>
          </div>
          <p className="text-sm text-zinc-500 text-center mb-8">
            Du har fått en personlig PIN-kode
          </p>

          <form ref={formRef} action={formAction}>
            {/* Hidden input med samlet PIN for server action */}
            <input type="hidden" name="pin" value={digits.join("")} />

            {/* PIN-ruter */}
            <div className="flex justify-center gap-3 mb-6">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={PIN_LENGTH}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={(e) => e.target.select()}
                  disabled={isPending}
                  className={`w-14 h-16 text-center text-2xl font-mono font-bold rounded-xl border transition-all duration-200 bg-white/5 text-white outline-none ${
                    state.error
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-amber-500/50 focus:bg-white/10"
                  } disabled:opacity-50`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Feilmelding */}
            {state.error && (
              <p className="text-sm text-red-400 text-center mb-4 animate-pulse">
                {state.error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || digits.some((d) => !d)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-orange-500/20"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logger inn...
                </span>
              ) : (
                "Logg inn"
              )}
            </button>
          </form>
        </div>

        {/* Trip info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            7. &ndash; 14. juni 2026 &middot; Algarve, Portugal
          </p>
        </div>
      </div>
    </div>
  );
}
