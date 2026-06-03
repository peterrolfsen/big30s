"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Volume2, VolumeX, Maximize, Eye, RotateCcw, Gamepad2, Crown } from "lucide-react";
import {
  teams,
  accentStyles,
  PACING,
  teamAvgPower,
  playerVoiceSrc,
  playerVideoSrc,
  type RosterPlayer,
  type DraftTeam,
} from "@/config/roster";
import { createSoundEngine, type SoundEngine } from "@/lib/draftSounds";
import { PlayerImage } from "./PlayerImage";
import FighterPanel from "./FighterPanel";
import StartScreen from "./StartScreen";
import VsScreen from "./VsScreen";
import StandingsScreen from "./StandingsScreen";
import ConfettiEffect from "@/components/games/ConfettiEffect";

// Alle spillere flatet ut (brukt til slot-machine-utvalget).
const ALL_PLAYERS = teams.flatMap((t) => t.players);

// Alle video-URL-er — brukes til å forhåndslaste klippene i bakgrunnen,
// slik at reveal-videoen starter umiddelbart (ikke ~1 s nedlasting per klikk).
const ALL_VIDEO_SRCS = Array.from(
  new Set(
    ALL_PLAYERS.map((p) => playerVideoSrc(p.video)).filter(
      (s): s is string => !!s
    )
  )
);

// Antall kolonner i rosteret: alltid 2 rader, uansett antall spillere,
// slik at alle fighterne er synlige samtidig uten scrolling.
const ROSTER_COLS = Math.ceil(ALL_PLAYERS.length / 2);

// Klassiske SSB-spillerfarger for de 4 slotene (P1 rød, P2 blå, P3 gul, P4 grønn).
const SLOT_COLORS = [
  {
    border: "border-red-500",
    panel: "from-red-600/30 to-red-950/60",
    banner: "bg-red-600 text-white",
    tag: "bg-red-500 text-white",
    num: "text-red-500/25",
    glow: "shadow-[0_0_30px_-4px_rgba(239,68,68,0.8)]",
  },
  {
    border: "border-blue-500",
    panel: "from-blue-600/30 to-blue-950/60",
    banner: "bg-blue-600 text-white",
    tag: "bg-blue-500 text-white",
    num: "text-blue-500/25",
    glow: "shadow-[0_0_30px_-4px_rgba(59,130,246,0.8)]",
  },
  {
    border: "border-yellow-400",
    panel: "from-yellow-500/30 to-yellow-900/60",
    banner: "bg-yellow-400 text-yellow-950",
    tag: "bg-yellow-400 text-yellow-950",
    num: "text-yellow-400/25",
    glow: "shadow-[0_0_30px_-4px_rgba(250,204,21,0.8)]",
  },
  {
    border: "border-green-500",
    panel: "from-green-600/30 to-green-950/60",
    banner: "bg-green-600 text-white",
    tag: "bg-green-500 text-white",
    num: "text-green-500/25",
    glow: "shadow-[0_0_30px_-4px_rgba(34,197,94,0.8)]",
  },
  {
    border: "border-fuchsia-500",
    panel: "from-fuchsia-600/30 to-fuchsia-950/60",
    banner: "bg-fuchsia-600 text-white",
    tag: "bg-fuchsia-500 text-white",
    num: "text-fuchsia-500/25",
    glow: "shadow-[0_0_30px_-4px_rgba(217,70,239,0.8)]",
  },
];

// RGB per aksent — brukt til levende bakgrunnsglød og accent-rammer som
// må settes via inline-style (Tailwind-klasser kan ikke interpoleres dynamisk).
const ACCENT_RGB: Record<DraftTeam["accent"], string> = {
  cyan: "34,211,238",
  amber: "251,191,36",
  rose: "251,113,133",
  violet: "167,139,250",
  emerald: "52,211,153",
};

// Nøkkel for lagrede lag (leses av andre sider for "bruk lagene til noe").
const RESULT_KEY = "30year_draft_result";

// Hype-callouts ved fullført lag, valgt ut fra lagets snitt-POWER.
const CALLOUTS_HIGH = ["STACKED!", "PERFECT TEAM!", "ABSOLUTE UNITS!", "S-TIER!"];
const CALLOUTS_MID = ["SOLID SQUAD!", "LOOKING GOOD!", "BALANSERT!", "NOT BAD!"];
const CALLOUTS_LOW = ["UNDERDOGS!", "CHAOS CREW!", "WILDCARDS!", "GLASS CANNONS!"];
const pickCallout = (avg: number, seed: number) => {
  const arr = avg >= 78 ? CALLOUTS_HIGH : avg >= 64 ? CALLOUTS_MID : CALLOUTS_LOW;
  return arr[seed % arr.length];
};

// Live-trekning: lagstørrelser bygges fritt av brukeren (random eller selvvalgt).
// Summen MÅ være lik antall spillere (ALL_PLAYERS.length). 4+4+4+4+5 = 21.
const TEAM_SIZES = [4, 4, 4, 4, 5];
const NUM_TEAMS = TEAM_SIZES.length;
// Antall slots for et gitt lag (runde). Faller tilbake til siste verdi.
const sizeForRound = (i: number) =>
  TEAM_SIZES[i] ?? TEAM_SIZES[TEAM_SIZES.length - 1];
const ROUND_ACCENTS: DraftTeam["accent"][] = [
  "cyan",
  "amber",
  "rose",
  "violet",
  "emerald",
];
const roundName = (i: number) => teams[i]?.name ?? `Lag ${i + 1}`;
const roundAccent = (i: number): DraftTeam["accent"] =>
  teams[i]?.accent ?? ROUND_ACCENTS[i % ROUND_ACCENTS.length];

const draftedSetOf = (
  completed: RosterPlayer[][],
  slots: (RosterPlayer | null)[]
) => {
  const ids = new Set<string>();
  completed.forEach((t) => t.forEach((p) => ids.add(p.id)));
  slots.forEach((p) => p && ids.add(p.id));
  return ids;
};

const findPlayer = (id: string | null) =>
  id ? ALL_PLAYERS.find((p) => p.id === id) : undefined;

const vsTeam = (completed: RosterPlayer[][], i: number): DraftTeam => ({
  id: `round-${i + 1}`,
  name: roundName(i),
  accent: roundAccent(i),
  players: completed[i] ?? [],
});

// ---------- State-maskin ----------
type Stage = "start" | "idle" | "rolling" | "reveal" | "teamflash" | "vs";

type DraftState = {
  stage: Stage;
  completed: RosterPlayer[][]; // ferdig bekreftede lag (bygget live)
  slots: (RosterPlayer | null)[]; // laget som bygges nå
  highlightId: string | null; // spiller som ruller/avsløres
  vsPair: [number, number] | null; // hvilke to lag VS-skjermen viser
};

type Action =
  | { type: "BEGIN" }
  | { type: "ROLL_START" }
  | { type: "ROLL_TICK"; id: string }
  | { type: "LAND"; id: string }
  | { type: "COMMIT" }
  | { type: "CANCEL" }
  | { type: "CONFIRM_START" }
  | { type: "NEXT_TEAM" }
  | { type: "SHOW_VS"; pair: [number, number] }
  | { type: "HIDE_VS" }
  | { type: "UNDO" }
  | { type: "RESET" };

const emptySlots = (n: number) => Array<RosterPlayer | null>(n).fill(null);

const freshDraft = (): DraftState => ({
  stage: "idle",
  completed: [],
  slots: emptySlots(sizeForRound(0)),
  highlightId: null,
  vsPair: null,
});

const initialState = (): DraftState => ({ ...freshDraft(), stage: "start" });

function reducer(state: DraftState, action: Action): DraftState {
  switch (action.type) {
    case "BEGIN":
      return { ...state, stage: "idle" };

    case "ROLL_START":
      return { ...state, stage: "rolling" };

    case "ROLL_TICK":
      return { ...state, highlightId: action.id };

    case "LAND":
      return { ...state, stage: "reveal", highlightId: action.id };

    case "COMMIT": {
      const player = findPlayer(state.highlightId);
      const idx = state.slots.findIndex((s) => s === null);
      if (!player || idx === -1)
        return { ...state, stage: "idle", highlightId: null };
      const slots = [...state.slots];
      slots[idx] = player;
      return { ...state, slots, stage: "idle", highlightId: null };
    }

    case "CANCEL":
      return { ...state, stage: "idle", highlightId: null };

    case "CONFIRM_START":
      return { ...state, stage: "teamflash" };

    case "NEXT_TEAM": {
      const team = state.slots.filter(Boolean) as RosterPlayer[];
      return {
        ...state,
        completed: [...state.completed, team],
        slots: emptySlots(sizeForRound(state.completed.length + 1)),
        highlightId: null,
        stage: "idle",
      };
    }

    case "SHOW_VS":
      return { ...state, stage: "vs", vsPair: action.pair };

    case "HIDE_VS":
      return { ...state, stage: "idle", vsPair: null };

    case "UNDO": {
      // 1) Avbryt en pågående reveal/roll.
      if (state.highlightId)
        return { ...state, stage: "idle", highlightId: null };
      // 2) Fjern siste fylte slot.
      const lastFilled = [...state.slots].map(Boolean).lastIndexOf(true);
      if (lastFilled !== -1) {
        const slots = [...state.slots];
        slots[lastFilled] = null;
        return { ...state, slots, stage: "idle" };
      }
      // 3) Tomt lag? Av-bekreft forrige lag og legg det tilbake i slotene.
      if (state.completed.length > 0) {
        const prevRound = state.completed.length - 1;
        const prev = state.completed[prevRound];
        const size = sizeForRound(prevRound);
        const slots = emptySlots(size);
        prev.forEach((p, i) => {
          if (i < size) slots[i] = p;
        });
        return {
          ...state,
          completed: state.completed.slice(0, -1),
          slots,
          stage: "idle",
          vsPair: null,
        };
      }
      return state;
    }

    case "RESET":
      return freshDraft();

    default:
      return state;
  }
}

// Lager en sekvens av kandidat-id-er som cursoren "ruller" gjennom, med
// akselererende-så-bremsende intervaller. Ender alltid på target.
function buildRoll(targetId: string, draftedIds: Set<string>) {
  const pool = ALL_PLAYERS.filter(
    (p) => !draftedIds.has(p.id) && p.id !== targetId
  );
  // bland poolen (Fisher-Yates)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const N = 14;
  const ticks: { id: string; at: number }[] = [];
  let t = 0;
  for (let i = 0; i < N; i++) {
    // ease-out: raskt i starten, tregere mot slutten
    const interval = 42 + Math.round((i / N) * (i / N) * 150);
    t += interval;
    const id = pool.length ? pool[i % pool.length].id : targetId;
    ticks.push({ id, at: t });
  }
  return { ticks, landAt: t + 160 };
}

// ---------- Hovedkomponent ----------
export default function DraftScreen() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [muted, setMuted] = useState(false);
  const [chromeHidden, setChromeHidden] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [callout, setCallout] = useState<string | null>(null);

  const stateRef = useRef(state);
  const soundRef = useRef<SoundEngine | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Lagre bekreftede lag til localStorage så de kan brukes videre senere.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const result = state.completed.map((team, i) => ({
      id: `round-${i + 1}`,
      name: roundName(i),
      accent: roundAccent(i),
      players: team.map((p) => ({ id: p.id, name: p.name })),
    }));
    try {
      window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    } catch {
      /* localStorage utilgjengelig — ignorer */
    }
  }, [state.completed]);

  useEffect(() => {
    soundRef.current = createSoundEngine();
    return () => soundRef.current?.stopMusic();
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const currentRound = state.completed.length;
  const allDone = currentRound >= NUM_TEAMS;
  const filledCount = state.slots.filter(Boolean).length;
  const teamFull = filledCount >= state.slots.length;
  const activeAccent = roundAccent(allDone ? NUM_TEAMS - 1 : currentRound);
  const accent = accentStyles[activeAccent];

  const draftedIds = useMemo(
    () => draftedSetOf(state.completed, state.slots),
    [state.completed, state.slots]
  );
  const undraftedCount = ALL_PLAYERS.length - draftedIds.size;
  // Kan bekrefte når laget er fullt, eller poolen er tom (siste lag kan være delvis).
  const canConfirm = filledCount > 0 && (teamFull || undraftedCount === 0);
  const canPick = !allDone && !teamFull && undraftedCount > 0;

  // Hover på grid: glød-border + lyd, og forhåndsvisning i neste slot.
  const hoveredPlayer =
    hoverId && state.stage === "idle"
      ? ALL_PLAYERS.find((p) => p.id === hoverId)
      : undefined;
  const handleHover = (player: RosterPlayer) => {
    if (state.stage !== "idle" || !canPick) return;
    if (draftedIds.has(player.id)) {
      soundRef.current?.playDeniedSound(); // allerede tatt
      return;
    }
    if (hoverId !== player.id) {
      soundRef.current?.playHoverSound();
      setHoverId(player.id);
    }
  };

  // ---- Handlinger ----
  const begin = useCallback(() => {
    if (stateRef.current.stage !== "start") return;
    soundRef.current?.startMusic();
    soundRef.current?.playConfirmSound();
    dispatch({ type: "BEGIN" });
  }, []);

  // Space: tilfeldig spiller -> slot-machine -> reveal (holder til keypress).
  const randomPick = useCallback(() => {
    const s = stateRef.current;
    if (s.stage !== "idle") return;
    if (s.completed.length >= NUM_TEAMS) return;
    if (s.slots.filter(Boolean).length >= s.slots.length) return; // fullt -> krever Enter
    const drafted = draftedSetOf(s.completed, s.slots);
    const pool = ALL_PLAYERS.filter((p) => !drafted.has(p.id));
    if (!pool.length) return;
    const target = pool[Math.floor(Math.random() * pool.length)];

    dispatch({ type: "ROLL_START" });
    const { ticks, landAt } = buildRoll(target.id, drafted);
    ticks.forEach(({ id, at }) =>
      after(at, () => {
        soundRef.current?.playCursorTick();
        dispatch({ type: "ROLL_TICK", id });
      })
    );
    after(landAt, () => {
      soundRef.current?.playLockIn();
      soundRef.current?.playCheer();
      soundRef.current?.announce(target.name, playerVoiceSrc(target.voice));
      dispatch({ type: "LAND", id: target.id });
    });
    // Ingen auto-commit — skjermen holder til man trykker den bort.
  }, [after]);

  // Klikk: velg en bestemt spiller direkte -> reveal (holder til keypress).
  const pickPlayer = useCallback((player: RosterPlayer) => {
    const s = stateRef.current;
    if (s.stage !== "idle") return;
    if (s.completed.length >= NUM_TEAMS) return;
    if (s.slots.filter(Boolean).length >= s.slots.length) return;
    const drafted = draftedSetOf(s.completed, s.slots);
    if (drafted.has(player.id)) {
      soundRef.current?.playDeniedSound();
      return;
    }
    soundRef.current?.playLockIn();
    soundRef.current?.playCheer();
    soundRef.current?.announce(player.name, playerVoiceSrc(player.voice));
    dispatch({ type: "LAND", id: player.id });
  }, []);

  // Plasser den avslørte spilleren i neste ledige slot.
  const commitReveal = useCallback(() => {
    if (stateRef.current.stage !== "reveal") return;
    soundRef.current?.playSelectSound();
    dispatch({ type: "COMMIT" });
  }, []);

  const confirm = useCallback(() => {
    const s = stateRef.current;
    if (s.stage !== "idle") return;
    const filled = s.slots.filter(Boolean).length;
    const drafted = draftedSetOf(s.completed, s.slots);
    const poolEmpty = ALL_PLAYERS.length - drafted.size === 0;
    if (filled === 0 || (filled < s.slots.length && !poolEmpty)) return; // ikke klart

    const justIdx = s.completed.length;
    const avg = teamAvgPower(s.slots.filter(Boolean) as RosterPlayer[]);
    soundRef.current?.playTeamCompleteSound();
    soundRef.current?.playCheer(1.9, 0.34);
    setConfetti(true);
    setShaking(true);
    setCallout(pickCallout(avg, justIdx));
    after(450, () => setShaking(false));
    dispatch({ type: "CONFIRM_START" });

    after(PACING.teamCompleteFlash, () => {
      setConfetti(false);
      setCallout(null);
      dispatch({ type: "NEXT_TEAM" });
      // Hvert oddetalls-lag fullfører et 4v4-par -> vis VS-skjerm.
      if (justIdx % 2 === 1) {
        dispatch({ type: "SHOW_VS", pair: [justIdx - 1, justIdx] });
        soundRef.current?.playLockIn();
        after(PACING.vsHold, () => dispatch({ type: "HIDE_VS" }));
      }
    });
  }, [after]);

  const undo = useCallback(() => {
    clearTimers();
    setConfetti(false);
    soundRef.current?.playConfirmSound();
    dispatch({ type: "UNDO" });
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setConfetti(false);
    soundRef.current?.playConfirmSound();
    dispatch({ type: "RESET" });
  }, [clearTimers]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      soundRef.current?.setMuted(!m);
      return !m;
    });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  // ---- Tastatur ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.repeat) return;

      const stage = stateRef.current.stage;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (stage === "start") begin();
          else if (stage === "reveal") commitReveal();
          else if (stage === "idle") randomPick();
          break;
        case "Enter":
        case "NumpadEnter":
          e.preventDefault();
          if (stage === "start") begin();
          else if (stage === "reveal") commitReveal();
          else if (stage === "idle") confirm();
          break;
        case "Backspace":
          e.preventDefault();
          undo();
          break;
        case "KeyR":
          reset();
          break;
        case "KeyH":
          setChromeHidden((h) => !h);
          break;
        case "KeyM":
          toggleMute();
          break;
        case "KeyF":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    begin,
    randomPick,
    pickPlayer,
    commitReveal,
    confirm,
    undo,
    reset,
    toggleMute,
    toggleFullscreen,
  ]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const revealPlayer = findPlayer(
    state.stage === "reveal" ? state.highlightId : null
  );

  // Demp Melee-musikken mens en video ELLER et lydklipp spiller i reveal.
  const revealHasMedia = !!(
    state.stage === "reveal" &&
    (revealPlayer?.video || revealPlayer?.audio)
  );
  useEffect(() => {
    if (revealHasMedia) soundRef.current?.pauseMusic();
    else soundRef.current?.resumeMusic();
  }, [revealHasMedia]);

  return (
    <div
      className={`relative flex h-[100dvh] flex-col overflow-hidden bg-slate-950 text-white select-none ${
        shaking ? "animate-draft-shake" : ""
      }`}
    >
      {/* Bakgrunn — lagfarget ambient glød som puster og skifter per runde */}
      <div
        className="animate-draft-ambient pointer-events-none absolute inset-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(circle at 50% -10%, rgba(${ACCENT_RGB[activeAccent]},0.20), transparent 62%)`,
        }}
      />
      {/* Diagonale speed-lines i bevegelse */}
      <div
        className="animate-draft-speedlines pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 2px, transparent 2px, transparent 24px)",
        }}
      />
      {/* Rutenett */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:44px_44px]" />
      {/* Vignett — trekker blikket inn mot midten */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_52%,rgba(0,0,0,0.65)_100%)]" />

      <ConfettiEffect active={confetti} />

      {/* Forhåndslaster reveal-videoene i bakgrunnen så snart man er forbi
          startskjermen — da starter klippet umiddelbart ved reveal. */}
      {state.stage !== "start" && (
        <div aria-hidden className="hidden">
          {ALL_VIDEO_SRCS.map((src) => (
            <video key={src} src={src} preload="auto" muted playsInline />
          ))}
        </div>
      )}

      {/* Hype-callout ved fullført lag */}
      {callout && state.stage === "teamflash" && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
          <span
            key={callout}
            className="animate-draft-callout text-5xl font-black tracking-tight text-white uppercase italic drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] md:text-8xl"
          >
            {callout}
          </span>
        </div>
      )}

      {/* Sluttskjerm / standings */}
      {allDone && state.stage === "idle" && (
        <StandingsScreen completed={state.completed} />
      )}

      {/* PRESS START */}
      {state.stage === "start" && <StartScreen />}

      {/* VS-skjerm */}
      {state.stage === "vs" && state.vsPair && (
        <VsScreen
          left={vsTeam(state.completed, state.vsPair[0])}
          right={vsTeam(state.completed, state.vsPair[1])}
        />
      )}

      {/* Fighter reveal — holder til man trykker den bort (klikk eller Space) */}
      {revealPlayer && (
        <div
          className="absolute inset-0 z-40 cursor-pointer"
          onClick={commitReveal}
        >
          <FighterPanel
            player={revealPlayer}
            accent={roundAccent(currentRound)}
            teamName={roundName(currentRound)}
            onMediaEnd={() => soundRef.current?.resumeMusic()}
          />
        </div>
      )}

      {/* ===== Topbar (mørk, smelter inn i flata, accent-farget underkant) ===== */}
      <header
        className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-b-2 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black px-3 py-2 shadow-lg transition-colors duration-700 md:px-6"
        style={{ borderColor: `rgba(${ACCENT_RGB[activeAccent]},0.55)` }}
      >
        <div className="flex items-center gap-3">
          <div className="-skew-x-6 rounded-md border border-red-900/40 bg-gradient-to-b from-red-500 to-red-700 px-3 py-1 shadow-[0_0_18px_-4px_rgba(239,68,68,0.9)]">
            <span className="block skew-x-6 text-base font-black tracking-tight text-white italic md:text-xl">
              30 SQUAD
            </span>
          </div>
          <span
            className={`hidden text-sm font-black tracking-wide uppercase italic transition-colors duration-700 sm:block md:text-base ${accent.text}`}
          >
            {allDone ? "Lagene er klare" : "Select your fighter"}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {!chromeHidden && (
            <div className="hidden items-center gap-1 md:flex">
              {Array.from({ length: NUM_TEAMS }).map((_, i) => {
                const a = accentStyles[roundAccent(i)];
                const done = i < currentRound;
                const active = i === currentRound && !allDone;
                return (
                  <div
                    key={i}
                    title={roundName(i)}
                    className={`h-2.5 -skew-x-12 rounded-sm transition-all duration-300 ${
                      active ? "w-9" : "w-6"
                    } ${
                      done
                        ? a.chip
                        : active
                          ? `${a.chip} animate-pulse ring-2 ring-white/80`
                          : "bg-white/15"
                    }`}
                  />
                );
              })}
            </div>
          )}
          <ControlButton onClick={toggleMute} label="Lyd (M)">
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </ControlButton>
          <ControlButton onClick={() => setChromeHidden((h) => !h)} label="Skjul UI (H)">
            <Eye className="h-4 w-4" />
          </ControlButton>
          <ControlButton onClick={reset} label="Nullstill (R)">
            <RotateCcw className="h-4 w-4" />
          </ControlButton>
          <ControlButton onClick={toggleFullscreen} label="Fullskjerm (F)">
            <Maximize className="h-4 w-4" />
          </ControlButton>
        </div>
      </header>

      {/* ===== Roster (tett SSB-ikon-grid) ===== */}
      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 py-2 md:px-6 md:py-3">
        <div
          className="grid h-full w-full content-center gap-1.5 md:gap-2"
          style={{
            gridTemplateColumns: `repeat(${ROSTER_COLS}, minmax(0, 1fr))`,
          }}
        >
          {ALL_PLAYERS.map((player, gi) => {
            const team = teams.find((t) => t.players.includes(player))!;
            const a = accentStyles[team.accent];
            const isDrafted = draftedIds.has(player.id);
            const isHighlight = state.highlightId === player.id;
            const isHover = hoverId === player.id && state.stage === "idle";
            const active = isHighlight || isHover;
            return (
              <div
                key={player.id}
                onClick={() => pickPlayer(player)}
                onMouseEnter={() => handleHover(player)}
                onMouseLeave={() => setHoverId(null)}
                style={{ animationDelay: `${gi * 0.025}s` }}
                className={`group animate-draft-cardin flex flex-col gap-1 transition-all duration-200 ${
                  isDrafted
                    ? ""
                    : canPick
                      ? "cursor-pointer active:scale-95"
                      : ""
                }`}
              >
                <div
                  className={`relative aspect-[3/4] overflow-hidden rounded-md border-2 bg-gradient-to-b from-zinc-600 to-zinc-800 transition-all duration-150 ${
                    active
                      ? `${a.border} ${a.glow} z-20 scale-110`
                      : isDrafted
                        ? "border-zinc-700/60"
                        : "border-zinc-500/50"
                  }`}
                >
                  {active && (
                    <div
                      className={`pointer-events-none absolute inset-0 z-30 rounded-md border-2 ${a.border} animate-draft-glint`}
                    />
                  )}
                  <PlayerImage
                    player={player}
                    fit="cover"
                    className={`absolute inset-0 h-full w-full transition-transform duration-300 ${
                      isDrafted
                        ? "scale-100 opacity-30 grayscale"
                        : active
                          ? "scale-110"
                          : "group-hover:scale-105"
                    }`}
                  />
                  {/* "TATT"-stempel på allerede valgte spillere — skarpt over det dimmede bildet */}
                  {isDrafted && (
                    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/35">
                      <span className="-rotate-12 -skew-x-6 rounded border-2 border-red-500/80 bg-red-600/25 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-red-100 uppercase italic shadow-[0_0_12px_-2px_rgba(239,68,68,0.8)] md:text-xs">
                        Tatt
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={`-skew-x-6 rounded-sm px-1 py-px text-center shadow-sm transition-all ${
                    active
                      ? `${a.chip} scale-105 ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.6)]`
                      : isDrafted
                        ? `${a.chip} opacity-40`
                        : a.chip
                  }`}
                >
                  <span className="block skew-x-6 truncate text-[10px] font-black tracking-tight uppercase italic md:text-[13px]">
                    {player.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ===== P1–P4 spillerpaneler ===== */}
      <footer
        className="relative z-10 shrink-0 border-t-2 bg-slate-950/90 px-2 pt-1.5 pb-2 transition-colors duration-700 md:px-6"
        style={{
          borderColor: `rgba(${ACCENT_RGB[activeAccent]},0.5)`,
          boxShadow: `0 -20px 44px -22px rgba(${ACCENT_RGB[activeAccent]},0.55)`,
        }}
      >
        <div className="mb-1.5 flex items-center justify-between px-1">
          {allDone ? (
            <h2 className="text-base font-black tracking-tight text-emerald-400 italic md:text-2xl">
              ALLE LAG KLARE — LET&apos;S GO! 🏆
            </h2>
          ) : (
            <h2
              className={`text-base font-black tracking-tight italic md:text-2xl ${accent.text} ${
                state.stage === "teamflash" ? "animate-draft-flash" : ""
              }`}
            >
              {roundName(currentRound).toUpperCase()}
              {state.stage === "teamflash" &&
                ` — KOMPLETT! · ⚡ ${teamAvgPower(
                  state.slots.filter(Boolean) as RosterPlayer[]
                )}`}
            </h2>
          )}
          {!chromeHidden && !allDone && (
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase md:text-xs">
              Lag {currentRound + 1} / {NUM_TEAMS}
            </span>
          )}
        </div>

        <div className="flex h-[26vh] max-h-[300px] min-h-[160px] items-stretch gap-3 md:gap-4">
          {!allDone && currentRound > 0 && (
            <CompletedRail completed={state.completed} />
          )}
          <div className="flex min-w-0 flex-1 items-stretch justify-center gap-2 md:gap-3">
          {(allDone
            ? state.completed[NUM_TEAMS - 1] ?? []
            : state.slots
          ).map((slot, i) => {
            const c = SLOT_COLORS[i % SLOT_COLORS.length];
            const isNextTarget =
              !allDone && state.stage === "idle" && i === filledCount;
            const filledPlayer = slot;
            return (
              <div
                key={i}
                className={`relative flex aspect-[3/4] h-full min-w-0 flex-col overflow-hidden rounded-xl border-[3px] bg-gradient-to-b transition-all duration-300 ${c.border} ${
                  filledPlayer
                    ? `${c.panel} ${state.stage === "teamflash" ? c.glow : ""}`
                    : isNextTarget
                      ? `${c.panel} ${c.glow} animate-pulse ring-4 ring-white/40`
                      : "from-slate-800/40 to-slate-950/60"
                }`}
              >
                {/* Player-tag */}
                <div
                  className={`absolute top-1.5 left-1.5 z-20 -skew-x-6 rounded px-1.5 py-0.5 shadow ${c.tag}`}
                >
                  <span className="flex skew-x-6 items-center gap-1 text-[10px] font-black italic md:text-xs">
                    <Gamepad2 className="h-3 w-3" /> P{i + 1}
                  </span>
                </div>

                {/* "Neste"-merke på den ledige slotten som fylles nå */}
                {isNextTarget && (
                  <div className="absolute top-1.5 right-1.5 z-20 -skew-x-6 rounded bg-white/90 px-1.5 py-0.5 shadow animate-pulse">
                    <span className="block skew-x-6 text-[10px] font-black italic text-zinc-900 md:text-xs">
                      ▶ NESTE
                    </span>
                  </div>
                )}

                {/* Portrett */}
                <div className="relative min-h-0 flex-1">
                  {filledPlayer ? (
                    <PlayerImage
                      player={filledPlayer}
                      fit="contain"
                      className="animate-draft-popin absolute inset-0 h-full w-full"
                    />
                  ) : isNextTarget && hoveredPlayer ? (
                    <PlayerImage
                      player={hoveredPlayer}
                      fit="contain"
                      className="absolute inset-0 h-full w-full opacity-45"
                    />
                  ) : (
                    <div className="absolute inset-0 overflow-hidden">
                      {/* sveipende scanline */}
                      <div className="animate-draft-scan pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
                      {/* mystery "?" */}
                      <span
                        className={`animate-draft-mystery absolute inset-0 flex items-center justify-center text-7xl font-black italic md:text-9xl ${c.num}`}
                      >
                        ?
                      </span>
                    </div>
                  )}
                </div>

                {/* Navnebanner */}
                <div
                  className={`-skew-x-6 px-2 py-1 text-center md:py-1.5 ${
                    filledPlayer
                      ? c.banner
                      : isNextTarget && hoveredPlayer
                        ? "bg-black/60 text-white/70"
                        : "bg-black/40 text-white/40"
                  }`}
                >
                  <span className="block skew-x-6 truncate text-sm font-black tracking-wide uppercase italic md:text-xl">
                    {filledPlayer
                      ? filledPlayer.name
                      : isNextTarget && hoveredPlayer
                        ? hoveredPlayer.name
                        : `Player ${i + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {!chromeHidden && (
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[10px] text-slate-500 md:text-xs">
            {state.stage === "start" ? (
              <Hint k="Space" highlight>
                Start
              </Hint>
            ) : state.stage === "reveal" ? (
              <>
                <Hint k="Space" highlight>
                  Plasser i lag
                </Hint>
                <Hint k="Backspace">Avbryt</Hint>
              </>
            ) : (
              <>
                {canPick && <Hint k="Space">Tilfeldig</Hint>}
                {canPick && <Hint k="Klikk">Velg spiller</Hint>}
                <Hint k="Enter" highlight={canConfirm}>
                  Bekreft lag
                </Hint>
                <Hint k="Backspace">Angre</Hint>
              </>
            )}
            <Hint k="R">Nullstill</Hint>
            <Hint k="H">Skjul UI</Hint>
            <Hint k="F">Fullskjerm</Hint>
          </div>
        )}
      </footer>
    </div>
  );
}

// Live power-leaderboard: ferdige lag sortert etter snitt-power, med power-bar,
// runde ensartede ansikter og krone på lederen. Til venstre i bunnfeltet.
function CompletedRail({ completed }: { completed: RosterPlayer[][] }) {
  const ranked = completed
    .map((players, i) => ({ players, i, power: teamAvgPower(players) }))
    .sort((a, b) => b.power - a.power);
  const topPower = ranked[0]?.power ?? 0;

  return (
    <aside className="flex h-full w-[27%] max-w-[330px] min-w-[160px] shrink-0 flex-col gap-1.5 overflow-hidden">
      <span className="shrink-0 px-0.5 text-[9px] font-black tracking-[0.25em] text-slate-500 uppercase">
        Ferdige lag
      </span>
      <div className="flex min-h-0 flex-1 flex-col justify-evenly gap-1 overflow-hidden">
        {ranked.map(({ players, i, power }) => {
          const a = accentStyles[roundAccent(i)];
          const rgb = ACCENT_RGB[roundAccent(i)];
          const isLeader = power === topPower && power > 0;
          return (
            <div
              key={i}
              className="animate-draft-popin flex flex-col gap-1 border-l-[3px] pl-2"
              style={{
                borderColor: `rgb(${rgb})`,
                filter: isLeader ? `drop-shadow(0 0 5px rgba(${rgb},0.6))` : undefined,
              }}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`flex min-w-0 items-center gap-1 text-[11px] font-black tracking-tight uppercase italic md:text-xs ${
                    isLeader ? "text-amber-300" : a.text
                  }`}
                >
                  {isLeader && (
                    <Crown className="h-3 w-3 shrink-0 fill-amber-300 text-amber-300 md:h-3.5 md:w-3.5" />
                  )}
                  <span className="truncate">{roundName(i)}</span>
                </span>
                <span
                  className={`shrink-0 text-[11px] font-black italic md:text-sm ${
                    isLeader ? "text-amber-300" : a.text
                  }`}
                >
                  ⚡{power}
                </span>
              </div>
              {/* power-bar */}
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${a.barFrom} ${a.barTo}`}
                  style={{ width: `${power}%` }}
                />
              </div>
              {/* runde, ensartede ansikter */}
              <div className="flex gap-1">
                {players.map((p) => (
                  <div
                    key={p.id}
                    title={p.name}
                    className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border bg-slate-800 md:h-8 md:w-8"
                    style={{ borderColor: `rgba(${rgb},0.6)` }}
                  >
                    <PlayerImage
                      player={p}
                      fit="cover"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function ControlButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded-md border border-zinc-600/60 bg-zinc-800/90 p-1.5 text-zinc-200 shadow-sm transition-colors hover:bg-zinc-900 hover:text-white"
    >
      {children}
    </button>
  );
}

function Hint({
  k,
  children,
  highlight,
}: {
  k: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd
        className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${
          highlight
            ? "animate-pulse border-cyan-400 bg-cyan-400/15 text-cyan-300"
            : "border-white/15 bg-white/5 text-slate-300"
        }`}
      >
        {k}
      </kbd>
      {children}
    </span>
  );
}
