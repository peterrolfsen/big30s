// =====================================================
// TURLEKER KONFIGURASJON
// =====================================================

// Deltakere med PIN-koder (hash disse i Supabase)
// PIN-kodene her er for seeding — de hashet med SHA-256 i databasen
export const participants = [
  { name: "Peter Rolfsen", displayName: "Peter", isJubilant: true, isAdmin: true },
  { name: "Anders Spjøtvold", displayName: "Anders", isJubilant: true },
  { name: "Johannes Steen", displayName: "Johannes", isJubilant: true },
  { name: "Tor Simen Berntsen", displayName: "Tor Simen", isJubilant: true },
  { name: "Bror Dypfest", displayName: "Bror", isJubilant: true },
  { name: "Martin Hagen", displayName: "Martin", isJubilant: true },
  { name: "Magnus Jordfald", displayName: "Magnus", isJubilant: true },
  // Legg til de 13 andre deltakerne her:
  // { name: "Fullt Navn", displayName: "Kallenavn", isJubilant: false },
];

// Bounty Board: Forhåndsdefinerte challenges
export const bountyChallenges = [
  // SOCIAL
  {
    title: "Portugisisk bestilling",
    description: "Bestill mat på portugisisk uten å peke på menyen eller bruke engelsk",
    category: "social" as const,
    points: 50,
    difficulty: 2 as const,
  },
  {
    title: "Lokal bestevenn",
    description: "Bli kompis med en lokal og ta en selfie sammen",
    category: "social" as const,
    points: 40,
    difficulty: 1 as const,
  },
  {
    title: "Bartender-lærling",
    description: "Overtal en bartender til å lære deg å lage en drink bak baren",
    category: "social" as const,
    points: 80,
    difficulty: 2 as const,
  },
  {
    title: "Karaoke-konge",
    description: "Syng en hel sang foran fremmede på en bar eller restaurant",
    category: "social" as const,
    points: 100,
    difficulty: 3 as const,
  },
  {
    title: "Shot med en fremmed",
    description: "Få en tilfeldig person til å ta en shot med deg",
    category: "social" as const,
    points: 60,
    difficulty: 2 as const,
  },

  // ADVENTURE
  {
    title: "Basseng-bomba",
    description: "Hopp i bassenget med klærne på",
    category: "adventure" as const,
    points: 30,
    difficulty: 1 as const,
  },
  {
    title: "Soloppgangs-kriger",
    description: "Stå opp og se soloppgangen. Bevis med bilde + tidsstempel",
    category: "adventure" as const,
    points: 70,
    difficulty: 2 as const,
  },
  {
    title: "Surfemester",
    description: "Stå oppreist på et surfebrett i minst 5 sekunder (video som bevis)",
    category: "adventure" as const,
    points: 80,
    difficulty: 3 as const,
  },
  {
    title: "Klippestuper",
    description: "Hopp fra en klippe eller høy brygge ned i vannet",
    category: "adventure" as const,
    points: 60,
    difficulty: 2 as const,
  },
  {
    title: "Gokart-kongen",
    description: "Vinn et gokart-heat mot minst 3 andre fra gruppa",
    category: "adventure" as const,
    points: 50,
    difficulty: 2 as const,
  },

  // FOOD
  {
    title: "Mysterie-rett",
    description: "Spis noe du aldri har prøvd før uten å vite hva det er på forhånd",
    category: "food" as const,
    points: 40,
    difficulty: 1 as const,
  },
  {
    title: "Cocktail-sjef",
    description: "Lag en cocktail for hele gruppen (oppskrift + servering)",
    category: "food" as const,
    points: 50,
    difficulty: 2 as const,
  },
  {
    title: "Sardiner-utfordring",
    description: "Spis en hel sardin (med hode og alt) uten å lage grimaser",
    category: "food" as const,
    points: 60,
    difficulty: 2 as const,
  },
  {
    title: "Lokal matmarked",
    description: "Kjøp noe på et lokalt matmarked og lag en rett til gruppen",
    category: "food" as const,
    points: 70,
    difficulty: 2 as const,
  },
  {
    title: "Pastel de Nata-ekspert",
    description: "Finn og smak pastel de nata fra 3 forskjellige steder og kåre den beste",
    category: "food" as const,
    points: 40,
    difficulty: 1 as const,
  },

  // DARE
  {
    title: "Aksent-mester",
    description: "Snakk med utenlandsk aksent i 1 hel time uten at noen avslører deg",
    category: "dare" as const,
    points: 150,
    difficulty: 3 as const,
  },
  {
    title: "Solbrille-dansen",
    description: "Bær solbriller innendørs hele dagen og nekt å innrømme det er mørkt",
    category: "dare" as const,
    points: 40,
    difficulty: 1 as const,
  },
  {
    title: "Kompliment-bomben",
    description: "Gi 10 fremmede et genuint kompliment på én time",
    category: "dare" as const,
    points: 60,
    difficulty: 2 as const,
  },
  {
    title: "Taus time",
    description: "Ikke snakk i 1 hel time. All kommunikasjon via tegn og miming",
    category: "dare" as const,
    points: 80,
    difficulty: 2 as const,
  },
  {
    title: "Tourist deluxe",
    description: "Gå rundt med kamera rundt halsen, hawaii-skjorte og spør om veibeskrivelse til steder du allerede er på",
    category: "dare" as const,
    points: 50,
    difficulty: 1 as const,
  },
  {
    title: "Hemmelig tjener",
    description: "Gjør 3 snille ting for gruppa uten at noen oppdager det. Avsløres på siste kveld",
    category: "dare" as const,
    points: 100,
    difficulty: 3 as const,
  },
  {
    title: "Freestyle-rap",
    description: "Lever en 30-sekunders freestyle rap om turen foran hele gruppen",
    category: "dare" as const,
    points: 70,
    difficulty: 2 as const,
  },
];

// Wheel of Fate: Forhåndsdefinerte dares
export const wheelDares = [
  "Ta 10 pushups nå",
  "Syng refrenget på siste sang du hørte på",
  "Ring en tilfeldig kontakt og si 'Jeg tenker på deg'",
  "Gå i bassenget med klærne på",
  "Imitér en annen person i gruppa i 5 min",
  "Neste drink er bartenderens valg",
  "Bær caps baklengs resten av kvelden",
  "Gi en 1-minutts tale om hvorfor du er takknemlig",
  "Gjør ditt beste «dad joke» ansikt og fortell en vits",
  "Bytt t-skjorte med personen til venstre",
  "Ikke bruk telefonen den neste timen",
  "Si «obrigado» etter hver setning i 30 min",
  "Ta en selfie med en fremmed og legg den i gruppa",
  "Bestill neste drink på portugisisk",
  "Dans i 30 sekunder uten musikk",
];

// Photo Wars: Daglige temaer (én per turdag)
export const photoThemes = [
  {
    date: "2026-06-07",
    theme: "Første inntrykk",
    description: "Fang det første øyeblikket som sier 'vi er i Portugal!'",
  },
  {
    date: "2026-06-08",
    theme: "Vann-elementet",
    description: "Beste bilde som involverer vann — basseng, hav, drink, regn, whatever",
  },
  {
    date: "2026-06-09",
    theme: "Action!",
    description: "Fang det mest actionfylte øyeblikket i dag",
  },
  {
    date: "2026-06-10",
    theme: "Farger i Algarve",
    description: "Finn det mest fargerike motivet du kan",
  },
  {
    date: "2026-06-11",
    theme: "Skjult skatt",
    description: "Noe vakkert eller interessant som ingen andre la merke til",
  },
  {
    date: "2026-06-12",
    theme: "Gutta i element",
    description: "Fang et øyeblikk som viser gjengen på sitt beste (eller verste)",
  },
  {
    date: "2026-06-13",
    theme: "Party mode",
    description: "Beste partybilde — kreativitet teller!",
  },
  {
    date: "2026-06-14",
    theme: "Avskjed",
    description: "Det siste bildet som oppsummerer hele turen",
  },
];

// Kategori-konfigurasjon
export const categoryConfig = {
  social: { label: "Sosialt", color: "#3b82f6", emoji: "🗣️" },
  adventure: { label: "Eventyr", color: "#22c55e", emoji: "🏄" },
  food: { label: "Mat & Drikke", color: "#f97316", emoji: "🍽️" },
  dare: { label: "Dare", color: "#ef4444", emoji: "🔥" },
} as const;

export const difficultyConfig = {
  1: { label: "Lett", stars: 1 },
  2: { label: "Medium", stars: 2 },
  3: { label: "Vanskelig", stars: 3 },
} as const;
