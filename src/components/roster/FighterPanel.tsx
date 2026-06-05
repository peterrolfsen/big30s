"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import {
  STAT_LABELS,
  statValue,
  powerLevel,
  accentStyles,
  playerVideoSrc,
  playerAudioSrc,
  playerImageSrc,
  type RosterPlayer,
  type DraftTeam,
} from "@/config/roster";
import { PlayerImage } from "./PlayerImage";

// Teller opp et tall fra 0 til target (easeOut), med valgfri forsinkelse.
function useCountUp(target: number, duration = 700, delay = 0) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    let startTs: number | null = null;
    const timer = setTimeout(() => {
      const tick = (t: number) => {
        if (startTs === null) startTs = t;
        const p = Math.min(1, (t - startTs) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setVal(Math.round(target * eased));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);
  return val;
}

// Farge på stat-baren etter verdi (rød = svak, grønn = sterk).
function barColorClass(v: number) {
  if (v >= 80) return "from-emerald-500 to-green-300";
  if (v >= 60) return "from-lime-500 to-emerald-300";
  if (v >= 40) return "from-amber-500 to-yellow-300";
  if (v >= 20) return "from-orange-500 to-amber-300";
  return "from-red-600 to-rose-400";
}

function StatRow({
  label,
  value,
  index,
  isTop,
}: {
  label: string;
  value: number;
  index: number;
  isTop: boolean;
}) {
  const shown = useCountUp(value, 700, 150 + index * 70);
  const bar = barColorClass(value);
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span
        className={`flex w-24 shrink-0 items-center justify-end gap-1 text-right text-sm font-bold tracking-wider md:w-32 md:text-lg ${
          isTop ? "text-amber-300" : "text-slate-300"
        }`}
      >
        {isTop && <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />}
        {label}
      </span>
      <div
        className={`h-5 flex-1 overflow-hidden rounded-full bg-white/5 md:h-7 ${
          isTop ? "ring-2 ring-amber-300/60" : ""
        }`}
      >
        <div
          className={`animate-draft-statfill h-full rounded-full bg-gradient-to-r ${bar} ${
            isTop ? "shadow-[0_0_16px_0_rgba(252,211,77,0.8)]" : ""
          }`}
          style={{
            // @ts-expect-error – CSS-variabel for keyframe-bredden
            "--bar-w": `${value}%`,
            animationDelay: `${0.15 + index * 0.07}s`,
          }}
        />
      </div>
      <span className="w-12 text-right text-2xl font-black text-white tabular-nums md:w-14 md:text-4xl">
        {shown}
      </span>
    </div>
  );
}

// Stor "fighter reveal" — vises når cursoren har landet på en spiller.
export default function FighterPanel({
  player,
  accent,
  teamName,
  onMediaEnd,
}: {
  player: RosterPlayer;
  accent: DraftTeam["accent"];
  teamName: string;
  onMediaEnd?: () => void; // kalles når video/lyd er ferdigspilt (én gang)
}) {
  const a = accentStyles[accent];
  const power = powerLevel(player);
  const shownPower = useCountUp(power, 800, 250);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  // Video spilles ÉN gang; når den er ferdig vises bildet i stedet.
  const videoSrc =
    videoFailed || videoEnded ? null : playerVideoSrc(player.video);
  // Lydklipp spilles SAMTIDIG som videoen (eller over bildet om ingen video).
  const audioSrc = playerAudioSrc(player.audio);

  // onMediaEnd skal kalles ÉN gang — først når både video og lyd er ferdige,
  // slik at Melee-musikken ikke gjenopptas midt i lydklippet.
  const hasVideo = !!playerVideoSrc(player.video);
  const hasAudio = !!audioSrc;
  const mediaFiredRef = useRef(false);
  const videoDoneRef = useRef(false);
  const audioDoneRef = useRef(false);
  const reportMediaEnd = () => {
    if (mediaFiredRef.current) return;
    if (hasVideo && !videoDoneRef.current) return;
    if (hasAudio && !audioDoneRef.current) return;
    mediaFiredRef.current = true;
    onMediaEnd?.();
  };

  // Beste stat (for uthevning) — første med høyest verdi.
  const maxStat = Math.max(...STAT_LABELS.map((s) => statValue(player, s.key)));
  const topKey = STAT_LABELS.find((s) => statValue(player, s.key) === maxStat)?.key;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-4">
      {/* mørk bakgrunn */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-draft-fade" />

      <div className="relative flex w-full max-w-7xl flex-col items-center gap-4 md:gap-6">
        <div className="animate-draft-revealcard flex w-full flex-col items-stretch gap-6 md:flex-row md:gap-12">
          {/* Portrett */}
          <div
            className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl border-2 bg-gradient-to-b from-slate-800 to-slate-950 md:max-h-[72vh] md:w-1/2 ${a.border} ${a.glow}`}
          >
            {videoSrc ? (
              <video
                src={videoSrc}
                poster={playerImageSrc(player.img) ?? undefined}
                autoPlay
                playsInline
                preload="auto"
                onEnded={() => {
                  setVideoEnded(true);
                  videoDoneRef.current = true;
                  reportMediaEnd();
                }}
                onError={() => {
                  setVideoFailed(true);
                  videoDoneRef.current = true;
                  reportMediaEnd(); // start musikken igjen hvis videoen feiler
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <PlayerImage
                player={player}
                className="absolute inset-0 h-full w-full"
              />
            )}
            {audioSrc && (
              <audio
                src={audioSrc}
                autoPlay
                onEnded={() => {
                  audioDoneRef.current = true;
                  reportMediaEnd();
                }}
                onError={() => {
                  audioDoneRef.current = true;
                  reportMediaEnd();
                }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
            {/* Power-badge */}
            <div
              className={`absolute top-3 right-3 rounded-lg border-2 bg-black/70 px-4 py-2 text-center ${a.border}`}
            >
              <div className="text-[11px] font-bold tracking-widest text-slate-400">
                POWER
              </div>
              <div className={`text-4xl font-black italic tabular-nums ${a.text}`}>
                {shownPower}
              </div>
            </div>
            {/* Navn */}
            <div className="absolute inset-x-0 bottom-0 p-4">
              {player.title && (
                <div
                  className={`text-xs font-bold tracking-[0.3em] uppercase md:text-sm ${a.text}`}
                >
                  {player.title}
                </div>
              )}
              <div className="text-4xl font-black tracking-tight text-white uppercase italic md:text-6xl">
                {player.name}
              </div>
            </div>
          </div>

          {/* Stats + sitat */}
          <div className="flex w-full flex-col justify-center gap-6 md:w-1/2">
            <div
              className={`text-xl font-black tracking-[0.3em] uppercase italic md:text-3xl ${a.text} animate-draft-flash`}
            >
              {teamName} · READY!
            </div>

            {/* Stat-barer */}
            <div className="space-y-4">
              {STAT_LABELS.map((s, i) => (
                <StatRow
                  key={s.key}
                  label={s.label}
                  value={statValue(player, s.key)}
                  index={i}
                  isTop={s.key === topKey}
                />
              ))}
            </div>

            {/* Catchphrase */}
            {player.catchphrase && (
              <p className="text-2xl leading-snug font-medium text-slate-200 italic md:text-4xl">
                {player.catchphrase}
              </p>
            )}

            {/* Bio */}
            {player.bio && (
              <p className="text-base leading-snug text-slate-400 md:text-xl">
                {player.bio}
              </p>
            )}

            {/* Signature move */}
            {player.signatureMove && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest text-slate-500 uppercase md:text-sm">
                  Spesial
                </span>
                <span
                  className={`rounded-md border px-4 py-1.5 text-lg font-black uppercase italic md:text-2xl ${a.border} ${a.bg} ${a.text}`}
                >
                  {player.signatureMove}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
