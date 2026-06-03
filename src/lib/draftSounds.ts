// =====================================================
// DRAFT SOUND ENGINE
// Syntetiserer enkle "arcade"-lyder med Web Audio API slik at
// du har lyd UMIDDELBART — uten å måtte skaffe .mp3-filer først.
//
// Vil du bruke ekte .mp3 senere? Legg filene i /public/sounds/ og
// bytt ut implementasjonen i hver play*-funksjon med:
//
//   const a = new Audio("/sounds/select.mp3");
//   a.volume = 0.5;
//   a.play();
//
// API-et (playHoverSound / playSelectSound / playTeamCompleteSound /
// playConfirmSound) holder seg likt, så resten av appen er uberørt.
// =====================================================

type Tone = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  /** Forsinkelse før tonen spilles (for å lage akkorder/sekvenser). */
  delay?: number;
  gain?: number;
};

// Hvor mye announcer-stemmen forsterkes. 1.0 = vanlig maks, >1 = høyere.
// Skru opp/ned for å treffe riktig nivå i opptaket (kompressoren hindrer sprekk).
const ANNOUNCER_GAIN = 2.8;

export function createSoundEngine() {
  let ctx: AudioContext | null = null;
  let muted = false;

  // Lazy-init: AudioContext må opprettes etter en bruker-interaksjon
  // (tastetrykk teller), ellers blokkerer nettleseren den.
  const getCtx = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const blip = ({ freq, duration, type = "square", delay = 0, gain = 0.18 }: Tone) => {
    const audio = getCtx();
    if (!audio || muted) return;
    const start = audio.currentTime + delay;
    const osc = audio.createOscillator();
    const env = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    // Liten attack + eksponentiell decay = "arcade pop".
    env.gain.setValueAtTime(0.0001, start);
    env.gain.exponentialRampToValueAtTime(gain, start + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(env).connect(audio.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  };

  const sequence = (tones: Tone[]) => tones.forEach(blip);

  // ---- Loopet bakgrunnsmusikk (ekte Melee-soundtrack) ----
  // Filen ligger i /public/sounds/. Bytt sti her for å bruke en annen låt.
  const MUSIC_SRC = "/sounds/character-select.mp3";
  let musicEl: HTMLAudioElement | null = null;
  let musicStarted = false; // true mellom startMusic og stopMusic

  const ensureMusic = () => {
    if (typeof window === "undefined") return null;
    if (!musicEl) {
      musicEl = new Audio(MUSIC_SRC);
      musicEl.loop = true;
      musicEl.volume = 0.45;
    }
    return musicEl;
  };

  // Velg en dyp stemme til announceren (lastes asynkront av nettleseren).
  let voice: SpeechSynthesisVoice | null = null;
  const pickVoice = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const vs = window.speechSynthesis.getVoices();
    voice =
      vs.find((v) =>
        /daniel|aaron|fred|reed|rocko|arthur|gordon|oliver|albert/i.test(v.name)
      ) ||
      vs.find((v) => v.lang?.startsWith("nb")) ||
      vs.find((v) => v.lang?.startsWith("en")) ||
      null;
  };
  if (typeof window !== "undefined" && window.speechSynthesis) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }
  const speakTTS = (text: string) => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "nb-NO";
    u.rate = 0.8; // tregere = mer dramatisk
    u.pitch = 0.4; // dyp "announcer"-stemme
    u.volume = 1;
    synth.speak(u);
  };

  return {
    setMuted: (v: boolean) => {
      muted = v;
      if (musicEl) musicEl.muted = v;
      if (v && typeof window !== "undefined") window.speechSynthesis?.cancel();
    },
    isMuted: () => muted,

    // Publikumsjubel — syntetisert (filtrert støy-svell). Alltid positiv.
    playCheer: (durationSec = 1.3, gain = 0.28) => {
      const audio = getCtx();
      if (!audio || muted) return;
      const t0 = audio.currentTime;
      const size = Math.floor(audio.sampleRate * durationSec);
      const buffer = audio.createBuffer(1, size, audio.sampleRate);
      const data = buffer.getChannelData(0);
      // Hvit støy med litt "klapp"-tekstur.
      for (let i = 0; i < size; i++) {
        data[i] = (Math.random() * 2 - 1) * (0.4 + 0.6 * Math.random());
      }
      const src = audio.createBufferSource();
      src.buffer = buffer;
      const bp = audio.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1700;
      bp.Q.value = 0.6;
      const env = audio.createGain();
      env.gain.setValueAtTime(0.0001, t0);
      env.gain.exponentialRampToValueAtTime(gain, t0 + 0.22); // svell opp
      env.gain.exponentialRampToValueAtTime(gain * 0.55, t0 + durationSec * 0.6);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + durationSec);
      src.connect(bp).connect(env).connect(audio.destination);
      src.start(t0);
      src.stop(t0 + durationSec + 0.05);
    },

    // Announcer leser navnet høyt. Spiller et ekte klipp hvis clipSrc finnes
    // (episk MK/Smash-stemme), ellers faller den til dyp talesyntese.
    announce: (text: string, clipSrc?: string | null) => {
      if (typeof window === "undefined" || muted) return;
      if (clipSrc) {
        const el = new Audio(clipSrc);
        el.volume = 1;
        el.onerror = () => speakTTS(text); // mangler fila -> TTS
        // Forsterk stemmen over 1.0 via Web Audio (et <audio>-element kan ikke
        // gå høyere selv). Kompressor mellom gain og output hindrer distortion.
        const audio = getCtx();
        if (audio) {
          try {
            const srcNode = audio.createMediaElementSource(el);
            const g = audio.createGain();
            g.gain.value = ANNOUNCER_GAIN;
            const comp = audio.createDynamicsCompressor();
            comp.threshold.value = -10;
            comp.ratio.value = 12;
            comp.attack.value = 0.003;
            comp.release.value = 0.25;
            srcNode.connect(g).connect(comp).connect(audio.destination);
          } catch {
            // Routing feilet (f.eks. eldre nettleser) — spilles på vanlig volum.
          }
        }
        el.play().catch(() => speakTTS(text));
        return;
      }
      speakTTS(text);
    },

    startMusic: () => {
      const el = ensureMusic();
      if (!el) return;
      musicStarted = true;
      el.muted = muted;
      el.currentTime = 0;
      el.play().catch(() => {
        /* autoplay blokkert til bruker-gesture — startes ved PRESS START */
      });
    },
    stopMusic: () => {
      musicStarted = false;
      if (musicEl) {
        musicEl.pause();
        musicEl.currentTime = 0;
      }
    },
    // Demp/gjenoppta uten å nullstille (brukes når en video spiller over musikken).
    pauseMusic: () => {
      musicEl?.pause();
    },
    resumeMusic: () => {
      if (musicStarted && !muted) musicEl?.play().catch(() => {});
    },

    // Raskt tikk mens slot-machine-cursoren ruller.
    playCursorTick: () =>
      blip({ freq: 760, duration: 0.04, type: "square", gain: 0.12 }),

    // "Allerede tatt" — kort lav buzz når man hover/klikker en trukket spiller.
    playDeniedSound: () =>
      sequence([
        { freq: 180, duration: 0.08, type: "sawtooth", gain: 0.1 },
        { freq: 120, duration: 0.12, type: "sawtooth", gain: 0.1, delay: 0.06 },
      ]),

    // Kraftig "lock in"-smell når cursoren lander på riktig spiller.
    playLockIn: () =>
      sequence([
        { freq: 180, duration: 0.18, type: "sawtooth", gain: 0.22 },
        { freq: 880, duration: 0.1, type: "square", gain: 0.18 },
        { freq: 1320, duration: 0.16, type: "square", gain: 0.16, delay: 0.05 },
      ]),

    // Lett "tikk" når selektoren beveger seg / spiller highlightes.
    playHoverSound: () => blip({ freq: 520, duration: 0.07, type: "square", gain: 0.1 }),

    // "Lock in" — spiller faller ned i slot.
    playSelectSound: () =>
      sequence([
        { freq: 660, duration: 0.08, type: "square" },
        { freq: 990, duration: 0.12, type: "square", delay: 0.06 },
      ]),

    // Enkelt bekreftelses-blip (brukes ved undo/reset).
    playConfirmSound: () => blip({ freq: 440, duration: 0.1, type: "triangle" }),

    // Fanfare når et lag er komplett (Enter).
    playTeamCompleteSound: () =>
      sequence([
        { freq: 523.25, duration: 0.12, type: "square" }, // C5
        { freq: 659.25, duration: 0.12, type: "square", delay: 0.1 }, // E5
        { freq: 783.99, duration: 0.12, type: "square", delay: 0.2 }, // G5
        { freq: 1046.5, duration: 0.28, type: "square", delay: 0.3 }, // C6
      ]),
  };
}

export type SoundEngine = ReturnType<typeof createSoundEngine>;
