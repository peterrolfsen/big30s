"use client";

import { useState } from "react";
import { playerImageSrc, type RosterPlayer } from "@/config/roster";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Viser deltakerbilde, eller en stilig initial-avatar hvis bilde mangler/feiler.
// fit="cover" gir tett SSB-mugshot-crop; "contain" viser hele figuren.
export function PlayerImage({
  player,
  className = "",
  fit = "contain",
}: {
  player: RosterPlayer;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const src = playerImageSrc(player.img);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 ${className}`}
      >
        {/* Subtile diagonale striper — signaliserer "designet plassholder", ikke en feil */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.5)_0,rgba(255,255,255,0.5)_1px,transparent_1px,transparent_11px)]" />
        <span className="relative z-10 flex aspect-square w-[44%] max-h-20 max-w-20 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xl font-black tracking-tight text-slate-200 shadow-inner md:text-4xl">
          {initials(player.name)}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={player.name}
      onError={() => setErrored(true)}
      className={`${fit === "cover" ? "object-cover object-top" : "object-contain"} ${className}`}
      draggable={false}
    />
  );
}
