// =====================================================
// ROSTER / LAGTREKNING KONFIGURASJON
// Rediger spillere og lag her — siden oppdateres automatisk.
//
// Hvert spillerobjekt kan ha disse feltene (alle utenom id/name er valgfrie):
//   id            — intern nøkkel, IKKE endre.
//   name          — navnet som vises overalt.
//   title         — "fighter class", liten tittel over navnet (f.eks. "The Carry").
//   img           — bildefil i /public/30year/deltakere/ (eller null = initial-avatar).
//   video         — videofil i samme mappe, spilles i reveal-kortet (eller fjern linja).
//   audio         — lydfil i samme mappe, spilles over bildet i reveal-kortet (eller fjern linja).
//   stats         — { styrke, fart, fest, humor, taktikk }, hver 0–100. Mangler en
//                   verdi, brukes 50. POWER-tallet regnes ut automatisk som snittet.
//   catchphrase   — sitat som vises i reveal-kortet.
//   signatureMove — "spesialangrep"-merket i reveal-kortet.
//   bio           — én kort setning om spilleren, vises i reveal-kortet.
// =====================================================

export type FighterStats = {
  styrke: number;
  fart: number;
  fest: number;
  humor: number;
  taktikk: number;
};

export type RosterPlayer = {
  id: string;
  name: string; // Vises i banneret (store bokstaver)
  title?: string; // "Fighter class", f.eks. "The Carry"
  img?: string | null; // Filnavn i /public/30year/deltakere/
  video?: string | null; // Valgfri videoklipp i /public/30year/deltakere/ — spilles ved reveal
  audio?: string | null; // Valgfritt lydklipp i /public/30year/deltakere/ — spilles over bildet ved reveal
  voice?: string | null; // Valgfritt announcer-klipp (mp3) i /public/30year/deltakere/ — leser navnet (MK/Smash-stemme)
  catchphrase?: string; // Vises ved reveal
  signatureMove?: string; // "Spesialangrep"
  bio?: string; // Kort setning om spilleren, vises i reveal-kortet
  stats?: Partial<FighterStats>; // Manglende verdier defaulter til 50
};

export type DraftTeam = {
  id: string;
  name: string;
  /** Tailwind-fargenavn brukt for neon-aksenten. */
  accent: "cyan" | "amber" | "rose" | "violet" | "emerald";
  players: RosterPlayer[];
};

// Hvor mange spillere per lag (slots i bunnlinjen).
export const TEAM_SIZE = 4;

// Stat-rekkefølge + visningsnavn for reveal-panelet.
export const STAT_LABELS: { key: keyof FighterStats; label: string }[] = [
  { key: "styrke", label: "STYRKE" },
  { key: "fart", label: "FART" },
  { key: "fest", label: "FEST" },
  { key: "humor", label: "HUMOR" },
  { key: "taktikk", label: "TAKTIKK" },
];

// Pacing for opptak (millisekunder). Juster for å treffe rytmen i videoen.
export const PACING = {
  // Slot-machine: hvor lenge cursoren "ruller" mellom kandidater før den lander.
  rollDuration: 1200,
  // Hvor lenge reveal-panelet (fighter-kortet) vises før spilleren faller i slot.
  revealHold: 1400,
  // "LAG KOMPLETT"-flash etter Enter.
  teamCompleteFlash: 1100,
  // VS-skjerm hold (vises automatisk når to lag er ferdige).
  vsHold: 2600,
};

// Hjelpere
export const playerImageSrc = (img?: string | null) =>
  img ? `/30year/deltakere/${img}` : null;

export const playerVideoSrc = (video?: string | null) =>
  video ? `/30year/deltakere/${video}` : null;

export const playerAudioSrc = (audio?: string | null) =>
  audio ? `/30year/deltakere/${audio}` : null;

export const playerVoiceSrc = (voice?: string | null) =>
  voice ? `/30year/deltakere/${voice}` : null;

export const statValue = (player: RosterPlayer, key: keyof FighterStats) =>
  player.stats?.[key] ?? 50;

export const powerLevel = (player: RosterPlayer) => {
  const sum = STAT_LABELS.reduce((acc, s) => acc + statValue(player, s.key), 0);
  return Math.round(sum / STAT_LABELS.length);
};

// Rank-bokstav (S/A/B/C/D) ut fra POWER, med fargeklasse for badgen.
export const powerRank = (power: number) => {
  if (power >= 88)
    return {
      label: "S",
      className:
        "bg-gradient-to-br from-amber-300 to-yellow-500 text-amber-950",
    };
  if (power >= 78)
    return {
      label: "A",
      className: "bg-gradient-to-br from-rose-400 to-red-600 text-white",
    };
  if (power >= 68)
    return {
      label: "B",
      className: "bg-gradient-to-br from-violet-400 to-indigo-600 text-white",
    };
  if (power >= 58)
    return {
      label: "C",
      className: "bg-gradient-to-br from-sky-400 to-blue-600 text-white",
    };
  return {
    label: "D",
    className: "bg-gradient-to-br from-slate-400 to-slate-600 text-white",
  };
};

export const teamAvgPower = (players: RosterPlayer[]) =>
  players.length
    ? Math.round(
        players.reduce((s, p) => s + powerLevel(p), 0) / players.length
      )
    : 0;

export const teamAvgStat = (players: RosterPlayer[], key: keyof FighterStats) =>
  players.length
    ? Math.round(
        players.reduce((s, p) => s + statValue(p, key), 0) / players.length
      )
    : 0;

// 4 lag à 4 spillere. Bilder finnes for Tor, Martin, Joffe, Holtan, Joachim —
// resten faller tilbake til initial-avatar til du legger inn flere PNG-er.
// Stats/catchphrase er tøysete plassholdere — bytt fritt!
export const teams: DraftTeam[] = [
  {
    id: "team-1",
    name: "Team Alfa",
    accent: "cyan",
    players: [
      {
        id: "tor",
        name: "Tor Simen",
        voice: "lydklipp/announcer/Tor-Simen.mp3",
        title: "Seig Nordlænding",
        img: "Tor.png",
        video: "video/Tor.mp4", // /public/30year/deltakere/video/Tor.mp4
        catchphrase: "«Kossn går det på jobben?»",
        signatureMove: "One-man-army",
        stats: { styrke: 60, fart: 72, fest: 80, humor: 30, taktikk: 100 },
      },
      {
        id: "peter",
        name: "Peter",
        voice: "lydklipp/announcer/Peter.mp3",
        title: "Gamemaster",
        img: "Peter.png",
        video: "video/peter.mp4",
        catchphrase: "«Jeg har en plan. Hør her.»",
        signatureMove: "Neck it powerup",
        stats: { styrke: 80, fart: 75, fest: 95, humor: 80, taktikk: 65 },
      },
      {
        id: "joachim",
        name: "Joachim",
        voice: "lydklipp/announcer/Joachim.mp3",
        title: "Wildcard",
        img: "Joachim.png",
        catchphrase: "«Hold mitt øl.»",
        signatureMove: "Looksmaxxing og tennis",
        stats: { styrke: 80, fart: 85, fest: 85, humor: 60, taktikk: 60 },
      },
      {
        id: "adrian",
        name: "Adrian",
        voice: "lydklipp/announcer/Adrian.mp3",
        img: "Adrian.png",
        video: "video/Adrian.mp4",
        title: "The ladies man",
        catchphrase: "«Hvor er damerne?»",
        signatureMove: "Spamringing",
        stats: { styrke: 60, fart: 75, fest: 100, humor: 40, taktikk: 0 },
      },

    ],
  },
  {
    id: "team-2",
    name: "Team Bravo",
    accent: "amber",
    players: [
      {
        id: "martin",
        name: "Martin",
        voice: "lydklipp/announcer/Martin.mp3",
        title: "The Indian",
        img: "Martin.png",
        catchphrase: "«»",
        signatureMove: "Kritisk tenking",
        stats: { styrke: 78, fart: 80, fest: 72, humor: 75, taktikk: 85 },
      },
      {
        id: "anders",
        name: "Anders",
        voice: "lydklipp/announcer/Anders.mp3",
        title: "Tøffel",
        img: "Anders.png",
        video: "video/Anders.mp4",
        catchphrase: "«Må bare hør med Heddda først»",
        signatureMove: "Kaste opp på fieden",
        stats: { styrke: 92, fart: 75, fest: 85, humor: 70, taktikk: 50 },
      },
      {
        id: "joffe",
        name: "Joffe",
        voice: "lydklipp/announcer/Magnus.mp3",
        title: "The Trickster",
        img: "Joffe.png",
        video: "video/joffe.mp4",
        catchphrase: "«Skukke hatt oss en liten en da?»",
        signatureMove: "Svømming og slapp ass!",
        stats: { styrke: 65, fart: 20, fest: 90, humor: 100, taktikk: 10 },
      },
      {
        id: "michelle",
        name: "Michelle",
        voice: "lydklipp/announcer/Michelle.mp3",
        img: "Michelle.png",
        title: "The Brain",
        catchphrase: "«Jeg er bare en glasskanne.»",
        signatureMove: "",
        stats: { styrke: 100, fart: 100, fest: 82, humor: 74, taktikk: 60 },
      },
      {
        id: "erika",
        name: "Erika",
        voice: "lydklipp/announcer/Erika.mp3",
        img: "Erika.png",
        title: "Flyvende morsmelk",
        catchphrase: "«Johanneeeeees»",
        signatureMove: "Scorpion-kick",
        stats: { styrke: 100, fart: 100, fest: 82, humor: 74, taktikk: 60 },
      },
    ],
  },
  {
    id: "team-3",
    name: "Team Charlie",
    accent: "rose",
    players: [
      {
        id: "holtan",
        name: "Holtan",
        voice: "lydklipp/announcer/Jonas.mp3",
        title: "The Bruiser",
        img: "Holtan.png",
        video: "video/Holtan.mp4",
        catchphrase: "«Vi tar dem fysisk.»",
        signatureMove: "Bryting",
        stats: { styrke: 100, fart: 20, fest: 82, humor: 70, taktikk: 20 },
      },
      {
        id: "johannes",
        name: "Johannes",
        voice: "lydklipp/announcer/Johannes.mp3",
        title: "The Fixer",
        img: "Johannes.png",
        video: "video/Johannes.mp4",
        catchphrase: "«La oss bare gjør det»",
        signatureMove: "Allrounder",
        stats: { styrke: 90, fart: 88, fest: 90, humor: 90, taktikk: 92 },
      },
      {
        id: "torkil",
        name: "Torkil",
        voice: "lydklipp/announcer/Torkil.mp3",
        title: "Med hår: ",
        img: "Torkil.png",
        catchphrase: "«Jeg er bare en glasskanne.»",
        signatureMove: "Spille domen på piano",
        stats: { styrke: 50, fart: 60, fest: 82, humor: 74, taktikk: 80 },
        audio: "lydklipp/Torkil.mp3", // /public/30year/deltakere/lydklipp/Torkil.mp3
      },
      {
        id: "hanna",
        name: "Hanna",
        voice: "lydklipp/announcer/Hanna.mp3",
        title: "The Captain",
        img: "Hanna.png",
        video: "video/Hanna.mp4",
        catchphrase: "«Jeg vil helst ikke være kaptein»",
        signatureMove: "Paralyze",
        stats: { styrke: 50, fart: 60, fest: 82, humor: 74, taktikk: 70 },
        audio: "lydklipp/Hanna.mp3", // /public/30year/deltakere/lydklipp/Hanna.mp3
      },
      {
        id: "ulrik",
        name: "Ulrik",
        voice: "lydklipp/announcer/Ulrik.mp3",
        title: "The Broker",
        img: "Ulrik.jpg",
        video: "video/Ulrik.MOV",
        catchphrase: "«Jeg er bare en glasskanne.»",
        signatureMove: "Dirigere laget",
        stats: { styrke: 50, fart: 60, fest: 82, humor: 74, taktikk: 90 },
        audio: "lydklipp/Ulrik.mp3", // /public/30year/deltakere/lydklipp/Ulrik.mp3
      },      {
        id: "filip",
        name: "Filip",
        voice: "lydklipp/announcer/Filip.mp3",
        title: "The Joker",
        img: "Filip.png",
        video: "video/Filip.mp4",
        catchphrase: "«Alle har en plan til de blir slått i trynet»",
        signatureMove: "Petrify",
        stats: { styrke: 80, fart: 75, fest: 75, humor: 50, taktikk: 85 },
      },
    ],
  },
  {
    id: "team-4",
    name: "Team Delta",
    accent: "violet",
    players: [
      {
        id: "sarah",
        name: "Sarah",
        voice: "lydklipp/announcer/Sarah.mp3",
        img: null,
      },
      {
        id: "ellen",
        name: "Ellen",
        voice: "lydklipp/announcer/Ellen.mp3",
        img: "Ellen.png",
      },
      {
        id: "eir",
        name: "Eir",
        voice: "lydklipp/announcer/Eir.mp3",
        img: "Eir.png",
      },
      {
        id: "hedda",
        name: "Hedda",
        voice: "lydklipp/announcer/Hedda.mp3",
        img: "Hedda.png",
        video: "video/Hedda.mp4",
        catchphrase: "«Du kan gjøre hva du vil, Anders»",
        signatureMove: "Mekke GT",
        stats: { styrke: 50, fart: 60, fest: 95, humor: 50, taktikk: 90 },
        audio: "lydklipp/Hedda.mp3", // /public/30year/deltakere/lydklipp/Hedda.mp3
      },
      {
        id: "amanda",
        name: "Amanda",
        voice: "lydklipp/announcer/Amanda.mp3",
        img: null,
      },
      {
        id: "fredrik",
        name: "Fredrik",
        title: "The accountant",
        voice: "lydklipp/announcer/Fredrik.mp3",
        img: "Fredrik.png",
        video: "video/Fredrik.mp4",
        catchphrase: "«Jeg er bare en glasskanne.»",
        signatureMove: "Go bald",
        stats: { styrke: 75, fart: 75, fest: 82, humor: 90, taktikk: 90 },
        audio: "lydklipp/Fredrik.mp3", // /public/30year/deltakere/lydklipp/Fredrik.mp3
      },
    ],
  },
];

// Neon-paletten per aksent (brukt for glow/border/tekst).
export const accentStyles: Record<
  DraftTeam["accent"],
  {
    text: string;
    border: string;
    glow: string;
    bg: string;
    ring: string;
    from: string;
    barFrom: string;
    barTo: string;
    chip: string; // solid fargelapp under hvert ikon (SSB-stil)
  }
> = {
  cyan: {
    text: "text-cyan-400",
    border: "border-cyan-400",
    glow: "shadow-[0_0_45px_-5px_rgba(34,211,238,0.7)]",
    bg: "bg-cyan-500/10",
    ring: "ring-cyan-400",
    from: "from-cyan-500",
    barFrom: "from-cyan-500",
    barTo: "to-sky-300",
    chip: "bg-cyan-500 text-cyan-950",
  },
  amber: {
    text: "text-amber-400",
    border: "border-amber-400",
    glow: "shadow-[0_0_45px_-5px_rgba(251,191,36,0.7)]",
    bg: "bg-amber-500/10",
    ring: "ring-amber-400",
    from: "from-amber-500",
    barFrom: "from-amber-500",
    barTo: "to-yellow-300",
    chip: "bg-amber-400 text-amber-950",
  },
  rose: {
    text: "text-rose-400",
    border: "border-rose-400",
    glow: "shadow-[0_0_45px_-5px_rgba(251,113,133,0.7)]",
    bg: "bg-rose-500/10",
    ring: "ring-rose-400",
    from: "from-rose-500",
    barFrom: "from-rose-500",
    barTo: "to-pink-300",
    chip: "bg-rose-500 text-white",
  },
  violet: {
    text: "text-violet-400",
    border: "border-violet-400",
    glow: "shadow-[0_0_45px_-5px_rgba(167,139,250,0.7)]",
    bg: "bg-violet-500/10",
    ring: "ring-violet-400",
    from: "from-violet-500",
    barFrom: "from-violet-500",
    barTo: "to-purple-300",
    chip: "bg-violet-500 text-white",
  },
  emerald: {
    text: "text-emerald-400",
    border: "border-emerald-400",
    glow: "shadow-[0_0_45px_-5px_rgba(52,211,153,0.7)]",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-400",
    from: "from-emerald-500",
    barFrom: "from-emerald-500",
    barTo: "to-green-300",
    chip: "bg-emerald-500 text-emerald-950",
  },
};
