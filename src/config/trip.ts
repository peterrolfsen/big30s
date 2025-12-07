// =====================================================
// 30-ÅRSTUR KONFIGURASJON
// Endre verdiene her for å oppdatere nettsiden
// =====================================================

export const tripConfig = {
  // Turdatoer
  startDate: "2026-06-07",
  endDate: "2026-06-14",

  // Destinasjon
  destination: "Algarve, Portugal",

  // Jubilanter (navn)
  celebrants: [
    "Peter Rolfsen",
    "Anders Spjøtvold",
    "Johannes Steen",
    "Tor Simen Berntsen",
    "Bror Dypfest",
    "Martin Hagen",
    "Magnus Jordfald",
  ],

  // Alle deltakere med bilder, type og Pokémon-stats
  participants: [
    // Jubilanter
    {
      name: "Peter Rolfsen",
      type: "celebrant" as const,
      image: null,
      birthday: "11. juli",
      pokemonType: "fire" as const,
      hp: 420,
      stats: {
        festlighet: 95,
        drikkekapasitet: 78,
        dansetalent: 62,
        soving: 35,
        sjarm: 88,
        kaos: 91,
      },
      specialMove: "Organisert Kaos",
      weakness: "Tidlige morgener",
      rarity: "legendary" as const,
    },
    {
      name: "Anders Spjøtvold",
      type: "celebrant" as const,
      image: null,
      birthday: "21. august",
      pokemonType: "electric" as const,
      hp: 380,
      stats: {
        festlighet: 88,
        drikkekapasitet: 92,
        dansetalent: 45,
        soving: 72,
        sjarm: 79,
        kaos: 67,
      },
      specialMove: "Uventet Kommentar",
      weakness: "Langsom WiFi",
      rarity: "rare" as const,
    },
    {
      name: "Johannes Steen",
      type: "celebrant" as const,
      image: null,
      birthday: null,
      pokemonType: "water" as const,
      hp: 350,
      stats: {
        festlighet: 76,
        drikkekapasitet: 81,
        dansetalent: 58,
        soving: 88,
        sjarm: 85,
        kaos: 42,
      },
      specialMove: "Chill Vibes",
      weakness: "Drama",
      rarity: "rare" as const,
    },
    {
      name: "Tor Simen Berntsen",
      type: "celebrant" as const,
      image: "/30year/deltakere/Tor.png",
      birthday: "23. desember",
      pokemonType: "grass" as const,
      hp: 390,
      stats: {
        festlighet: 82,
        drikkekapasitet: 75,
        dansetalent: 71,
        soving: 65,
        sjarm: 91,
        kaos: 55,
      },
      specialMove: "Dad Joke Overload",
      weakness: "Silence",
      rarity: "rare" as const,
    },
    {
      name: "Bror Dypfest",
      type: "celebrant" as const,
      image: null,
      birthday: null,
      pokemonType: "fire" as const,
      hp: 450,
      stats: {
        festlighet: 99,
        drikkekapasitet: 95,
        dansetalent: 78,
        soving: 25,
        sjarm: 86,
        kaos: 98,
      },
      specialMove: "Etternavnet Sier Alt",
      weakness: "Kjedelige fester",
      rarity: "legendary" as const,
    },
    {
      name: "Martin Hagen",
      type: "celebrant" as const,
      image: "/30year/deltakere/Martin.png",
      birthday: "15. oktober",
      pokemonType: "psychic" as const,
      hp: 360,
      stats: {
        festlighet: 79,
        drikkekapasitet: 68,
        dansetalent: 82,
        soving: 78,
        sjarm: 94,
        kaos: 48,
      },
      specialMove: "Smooth Operator",
      weakness: "Uorganiserte planer",
      rarity: "rare" as const,
    },
    {
      name: "Magnus Jordfald",
      type: "celebrant" as const,
      image: null,
      birthday: null,
      pokemonType: "ground" as const,
      hp: 400,
      stats: {
        festlighet: 85,
        drikkekapasitet: 88,
        dansetalent: 55,
        soving: 82,
        sjarm: 76,
        kaos: 63,
      },
      specialMove: "Solid som Fjell",
      weakness: "Tidlig vekking",
      rarity: "rare" as const,
    },
    {
      name: "Joffe",
      type: "celebrant" as const,
      image: "/30year/deltakere/Joffe.png",
      birthday: "18. juni",
      pokemonType: "dark" as const,
      hp: 410,
      stats: {
        festlighet: 92,
        drikkekapasitet: 89,
        dansetalent: 67,
        soving: 45,
        sjarm: 83,
        kaos: 87,
      },
      specialMove: "Mystisk Energi",
      weakness: "Morgenkaffe",
      rarity: "legendary" as const,
    },
    // Gjester
    {
      name: "Holtan",
      type: "guest" as const,
      image: "/30year/deltakere/Holtan.png",
      birthday: null,
      pokemonType: "steel" as const,
      hp: 340,
      stats: {
        festlighet: 77,
        drikkekapasitet: 82,
        dansetalent: 48,
        soving: 85,
        sjarm: 72,
        kaos: 58,
      },
      specialMove: "Jernvilje",
      weakness: "Rust",
      rarity: "uncommon" as const,
    },
    {
      name: "Joachim",
      type: "guest" as const,
      image: "/30year/deltakere/Joachim.png",
      birthday: null,
      pokemonType: "flying" as const,
      hp: 320,
      stats: {
        festlighet: 74,
        drikkekapasitet: 71,
        dansetalent: 85,
        soving: 68,
        sjarm: 88,
        kaos: 52,
      },
      specialMove: "Høyt Hevet",
      weakness: "Tyngdekraft",
      rarity: "uncommon" as const,
    },
    {
      name: "Ellen",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "fairy" as const,
      hp: 310,
      stats: {
        festlighet: 86,
        drikkekapasitet: 65,
        dansetalent: 92,
        soving: 72,
        sjarm: 95,
        kaos: 44,
      },
      specialMove: "Magisk Latter",
      weakness: "Kynisme",
      rarity: "uncommon" as const,
    },
    {
      name: "Erika",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "ice" as const,
      hp: 330,
      stats: {
        festlighet: 81,
        drikkekapasitet: 73,
        dansetalent: 78,
        soving: 69,
        sjarm: 89,
        kaos: 51,
      },
      specialMove: "Cool Under Pressure",
      weakness: "Varme debatter",
      rarity: "uncommon" as const,
    },
    {
      name: "Eir",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "water" as const,
      hp: 300,
      stats: {
        festlighet: 78,
        drikkekapasitet: 62,
        dansetalent: 88,
        soving: 75,
        sjarm: 91,
        kaos: 38,
      },
      specialMove: "Flow State",
      weakness: "Tørke",
      rarity: "uncommon" as const,
    },
    {
      name: "Hedda",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "normal" as const,
      hp: 320,
      stats: {
        festlighet: 84,
        drikkekapasitet: 70,
        dansetalent: 76,
        soving: 80,
        sjarm: 87,
        kaos: 47,
      },
      specialMove: "Adaptiv Energi",
      weakness: "Kjedsomhet",
      rarity: "uncommon" as const,
    },
    {
      name: "Michelle",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "fire" as const,
      hp: 335,
      stats: {
        festlighet: 89,
        drikkekapasitet: 74,
        dansetalent: 94,
        soving: 58,
        sjarm: 92,
        kaos: 72,
      },
      specialMove: "Dansegulv Dominans",
      weakness: "Slow jams",
      rarity: "uncommon" as const,
    },
    {
      name: "Fredrik",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "fighting" as const,
      hp: 360,
      stats: {
        festlighet: 75,
        drikkekapasitet: 85,
        dansetalent: 52,
        soving: 88,
        sjarm: 71,
        kaos: 62,
      },
      specialMove: "Utholdenhet",
      weakness: "Yoga",
      rarity: "uncommon" as const,
    },
    {
      name: "Ulrik",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "ghost" as const,
      hp: 290,
      stats: {
        festlighet: 72,
        drikkekapasitet: 79,
        dansetalent: 61,
        soving: 92,
        sjarm: 75,
        kaos: 68,
      },
      specialMove: "Forsvinningsnummer",
      weakness: "Oppmerksomhet",
      rarity: "uncommon" as const,
    },
    {
      name: "Eystein",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "rock" as const,
      hp: 380,
      stats: {
        festlighet: 80,
        drikkekapasitet: 91,
        dansetalent: 45,
        soving: 86,
        sjarm: 68,
        kaos: 55,
      },
      specialMove: "Steinhard Leveranse",
      weakness: "Vann (ironi)",
      rarity: "uncommon" as const,
    },
    {
      name: "Mats",
      type: "guest" as const,
      image: null,
      birthday: null,
      pokemonType: "dragon" as const,
      hp: 370,
      stats: {
        festlighet: 83,
        drikkekapasitet: 87,
        dansetalent: 69,
        soving: 71,
        sjarm: 78,
        kaos: 75,
      },
      specialMove: "Drage-energi",
      weakness: "Fairy tales",
      rarity: "uncommon" as const,
    },
  ],

  // Deltakere
  totalParticipants: 20,
  suites: 10,

  // Priser
  prices: {
    // Totalpris villa: €17,120 for 20 personer (7-14 juni 2026)
    villaTotal: 17120, // EUR
    perPerson: 856, // EUR (€17,120 / 20)
    perPersonNOK: 9850, // NOK (ca. 11.5 kr per euro)

    // Tilleggsavgifter
    municipalityFee: 2, // EUR per natt per person (13+), maks 7 netter = €14 per person
    municipalityFeeTotal: 14, // EUR per person

    // Depositum (refunderes hvis ingen skader)
    damageDeposit: 3500, // EUR totalt

    // Valgfritt: Daglig rengjøring
    dailyCleaning: 100, // EUR per dag (3 timer)

    currency: "EUR",
  },

  // Betalingsinfo
  payment: {
    methods: ["Bank Transfer", "Wise.com", "PayPal (+5%)"],
    schedule: {
      atBooking: "50% av totalpris",
      ninetyDaysBefore: "50% av totalpris",
      oneWeekBefore: "Depositum €3,500",
    },
    deadline: "Kommer snart",
  },

  // Inkludert i prisen
  included: [
    "Oppvarmet utendørs- og innendørsbasseng",
    "Utendørs jacuzzi og sauna",
    "Tennisbane og minigolf",
    "Gym, kinorom og spillrom",
    "Sykler",
    "Vann og strøm",
    "AC (varme/kjøling)",
    "WiFi og TV",
    "Laken og håndklær (bad, ansikt, basseng)",
    "Hage- og bassengvedlikehold",
    "Rengjøring ved ankomst og avreise",
  ],

  // Partnerrabatter - Penina Hotel Golf & Resort (500m fra villaen)
  golfDiscounts: {
    teeTimes: "10-15%",
    buggiesAndTrolleys: "15%",
    golfStore: "10%",
    restaurantsAndBars: "15%",
    note: "Tee times må bookes gjennom SpringVillas for rabatt. Andre rabatter med armbånd.",
    courses: [
      { name: "Championship / Henry Cotton Golf Course", type: "main", handicapMen: 28, handicapWomen: 36 },
      { name: "Resort Golf Course", type: "resort" },
    ],
  },

  // Ekstra tjenester
  extras: {
    chefService: "Kan arrangeres etter booking - pris avhenger av meny",
    carRental: "Lei på flyplassen eller få bilen levert til villaen",
    dailyCleaning: "€100/dag (3 timer)",
    activities: ["Surfing (Alvor Kitesurf Center)", "Gokart (Algarve International Racetrack)", "Fallskjermhopping", "Yachtturer"],
  },
};

export const villaConfig = {
  name: "Villa Penina Majestic",
  address: "Tapada da Penina, n.º 26, 8500-051 Alvor, Algarve, Portugal",
  website: "https://www.springvillas.net/VillaPeninaMajestic/",

  // Kapasitet
  bedrooms: 10,
  bathrooms: 12,
  maxGuests: 25,
  plotSize: "5000 m²",
  buildingSize: "1000+ m²",

  // Avstander
  distances: {
    portimao: "4 km",
    alvor: "6 km",
    nearestBeach: "7.5 km",
    faroAirport: "71 km",
    golfCourse: "1 km",
  },

  // Fasiliteter
  amenities: {
    pool: [
      { name: "Oppvarmet utendørsbasseng", description: "14x6.5m, opptil 30°C", icon: "🏊" },
      { name: "Innendørs oppvarmet basseng", description: "", icon: "🏊‍♂️" },
      { name: "Barnebasseng", description: "", icon: "👶" },
      { name: "Oppvarmet jacuzzi", description: "Plass til 5-6 personer, opptil 38°C", icon: "🛁" },
      { name: "Sauna", description: "", icon: "🧖" },
    ],
    entertainment: [
      { name: "Kinorom", description: "", icon: "🎬" },
      { name: "Spillerom med biljard", description: "", icon: "🎱" },
      { name: "Tennisbane", description: "", icon: "🎾" },
      { name: "Minigolf", description: "", icon: "⛳" },
      { name: "Bordtennis", description: "", icon: "🏓" },
      { name: "Sykler", description: "Voksne og barn", icon: "🚴" },
    ],
    fitness: [
      { name: "Gym", description: "Tredemølle og utstyr", icon: "💪" },
    ],
    outdoor: [
      { name: "BBQ-område", description: "Med utendørs spiseplass", icon: "🍖" },
      { name: "Poolbar", description: "", icon: "🍹" },
      { name: "Hage med palmetrær", description: "", icon: "🌴" },
      { name: "Privat parkering", description: "", icon: "🚗" },
    ],
    practical: [
      { name: "Aircondition", description: "I hele villaen", icon: "❄️" },
      { name: "WiFi", description: "Overalt", icon: "📶" },
      { name: "Fullt utstyrt kjøkken", description: "", icon: "🍳" },
      { name: "Vaskerom", description: "", icon: "🧺" },
    ],
  },

  // Bilder - legg til filnavn her når du har lastet opp bilder
  images: [
    // Eksempel: "/images/villa/exterior.jpg",
    // Eksempel: "/images/villa/pool.jpg",
  ],
};

export const transportConfig = {
  flights: [
    {
      city: "Oslo",
      airport: "OSL",
      destinationAirport: "FAO (Faro)",
      details: "Kommer snart",
      // Legg til flyinfo her når det er booket:
      // outbound: { date: "7. juni", time: "08:00", flight: "SK1234" },
      // return: { date: "14. juni", time: "18:00", flight: "SK5678" },
    },
    {
      city: "Bergen",
      airport: "BGO",
      destinationAirport: "FAO (Faro)",
      details: "Kommer snart",
    },
    {
      city: "Trondheim",
      airport: "TRD",
      destinationAirport: "FAO (Faro)",
      details: "Kommer snart",
    },
  ],

  rentalCar: {
    info: "Kommer snart",
    // Legg til leiebil-info her:
    // company: "Europcar",
    // pickup: "Faro Airport",
    // cars: ["7-seter SUV x2", "5-seter x2"],
  },

  fromAirport: "Faro flyplass til villaen: ca. 71 km (1 time)",
};

interface ProgramDay {
  date: string;
  title: string;
  activities: { time: string; activity: string; icon: string }[];
}

export const programConfig: {
  status: "coming_soon" | "ready";
  days: ProgramDay[];
} = {
  status: "coming_soon",
  days: [
    // Eksempel på dag-struktur:
    // {
    //   date: "7. juni",
    //   title: "Ankomst",
    //   activities: [
    //     { time: "15:00", activity: "Innsjekk villa", icon: "🏠" },
    //     { time: "18:00", activity: "Velkomstdrink ved bassenget", icon: "🍹" },
    //     { time: "20:00", activity: "BBQ-middag", icon: "🍖" },
    //   ],
    // },
  ],
};

interface PackingCategory {
  name: string;
  items: string[];
}

export const packingListConfig: {
  status: "coming_soon" | "ready";
  categories: PackingCategory[];
} = {
  status: "coming_soon",
  categories: [
    // Eksempel:
    // {
    //   name: "Klær",
    //   items: ["Badetøy", "Shorts", "T-skjorter", "Solbriller"],
    // },
  ],
};

// =====================================================
// KART-KONFIGURASJON
// Legg til steder her for å vise dem på kartet
// =====================================================

export type MapCategory =
  | "villa"
  | "beach"
  | "restaurant"
  | "bar"
  | "activity"
  | "sightseeing"
  | "airport"
  | "supermarket"
  | "golf"
  | "waterpark";

export interface MapLocation {
  id: string;
  name: string;
  category: MapCategory;
  coordinates: [number, number]; // [latitude, longitude]
  description?: string;
  address?: string;
  website?: string;
  rating?: number; // 1-5
  tags?: string[];
  addedBy?: string; // Hvem som la til stedet
  image?: string; // URL til bilde av stedet
  price?: string; // Prisindikasjon (f.eks. "€50/person" eller "€€€")
}

export const mapConfig = {
  // Senterpunkt for kartet (villaen)
  center: [37.1606, -8.5751] as [number, number],
  defaultZoom: 12,

  // Kategorier med farger og ikoner
  categories: {
    villa: { label: "Villaen", color: "#f97316", emoji: "🏠" },
    beach: { label: "Strand", color: "#06b6d4", emoji: "🏖️" },
    restaurant: { label: "Restaurant", color: "#22c55e", emoji: "🍽️" },
    bar: { label: "Bar & Nattklubb", color: "#a855f7", emoji: "🍸" },
    activity: { label: "Aktivitet", color: "#eab308", emoji: "🎯" },
    sightseeing: { label: "Severdighet", color: "#ec4899", emoji: "📸" },
    airport: { label: "Flyplass", color: "#64748b", emoji: "✈️" },
    supermarket: { label: "Butikk", color: "#10b981", emoji: "🛒" },
    golf: { label: "Golf", color: "#84cc16", emoji: "⛳" },
    waterpark: { label: "Badeland", color: "#0ea5e9", emoji: "🎢" },
  } as Record<MapCategory, { label: string; color: string; emoji: string }>,

  // Steder på kartet
  locations: [
    // Villaen - GPS: 37°09'38.11"N 8°34'30.42"W
    {
      id: "villa",
      name: "Villa Penina Majestic",
      category: "villa",
      coordinates: [37.1606, -8.5751],
      description: "Vårt hjem i en uke! 10 soverom, basseng, jacuzzi og mye mer.",
      address: "Tapada da Penina, n.º 26, 8500-051 Alvor",
      website: "https://www.springvillas.net/VillaPeninaMajestic/",
      tags: ["basseng", "jacuzzi", "tennis", "gym"],
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    },

    // Flyplass
    {
      id: "faro-airport",
      name: "Faro Lufthavn",
      category: "airport",
      coordinates: [37.0144, -7.9659],
      description: "Her lander vi! Ca. 1 time kjøring til villaen.",
      address: "Aeroporto Internacional de Faro, 8001-701 Faro",
      tags: ["ankomst", "avreise"],
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    },

    // Strender
    {
      id: "praia-rocha",
      name: "Praia da Rocha",
      category: "beach",
      coordinates: [37.1175, -8.5362],
      description: "En av Algarves mest kjente strender med dramatiske klipper og gyllen sand.",
      address: "Praia da Rocha, Portimão",
      tags: ["populær", "strandbar", "vannsport"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?w=800&q=80",
    },
    {
      id: "praia-alvor",
      name: "Praia de Alvor",
      category: "beach",
      coordinates: [37.1231, -8.5936],
      description: "Lang, vakker strand med grunt vann. Perfekt for en rolig dag.",
      address: "Praia de Alvor, Alvor",
      tags: ["familievennlig", "rolig"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    },
    {
      id: "praia-tres-irmaos",
      name: "Praia dos Três Irmãos",
      category: "beach",
      coordinates: [37.1089, -8.5207],
      description: "Spektakulær strand med grotter og klipper. Et must-see!",
      address: "Praia dos Três Irmãos, Alvor",
      tags: ["grotter", "fotografering", "snorkling"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80",
    },

    // Restauranter
    {
      id: "restinga",
      name: "Restinga",
      category: "restaurant",
      coordinates: [37.1261, -8.5896],
      description: "Fantastisk sjømat rett ved vannet i Alvor.",
      address: "Rua Dr. António José de Almeida, Alvor",
      tags: ["sjømat", "utsikt", "romantisk"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    },
    {
      id: "nosoloagua",
      name: "NoSoloÁgua",
      category: "bar",
      coordinates: [37.1180, -8.5355],
      description: "Trendy beachclub på Praia da Rocha. Perfekt for solnedgang og drinks.",
      address: "Av. Tomás Cabreira, Praia da Rocha, Portimão",
      website: "https://nosoloagua.com/",
      tags: ["beachclub", "drinker", "solnedgang", "DJ"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    },

    // Aktiviteter
    {
      id: "benagil-cave",
      name: "Benagil-grotten",
      category: "sightseeing",
      coordinates: [37.0872, -8.4267],
      description: "Portugals mest berømte grotte! Book kajakktur eller båttur.",
      address: "Praia de Benagil, Lagoa",
      tags: ["grotte", "kajakk", "fotografering"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    },
    {
      id: "surf-school",
      name: "Algarve Surf School",
      category: "activity",
      coordinates: [37.1782, -8.5847],
      description: "Surfekurs for alle nivåer. Bølgene venter!",
      address: "Praia da Rocha, Portimão",
      tags: ["surfing", "kurs", "vannsport"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
    },

    // Byer
    {
      id: "portimao",
      name: "Portimão sentrum",
      category: "sightseeing",
      coordinates: [37.1364, -8.5377],
      description: "Fin by med shopping, restauranter og marked.",
      address: "Centro de Portimão",
      tags: ["shopping", "mat", "marked"],
      image: "https://images.unsplash.com/photo-1555990538-1e6e5e0b6b0f?w=800&q=80",
    },
    {
      id: "lagos",
      name: "Lagos gamlebyen",
      category: "sightseeing",
      coordinates: [37.1024, -8.6733],
      description: "Sjarmerende historisk by med festning, marina og brosteinsgater.",
      address: "Centro Histórico, Lagos",
      tags: ["historisk", "shopping", "restauranter"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
    },

    // Supermarkeder
    {
      id: "pingo-doce-alvor",
      name: "Pingo Doce Alvor",
      category: "supermarket",
      coordinates: [37.1305, -8.5948],
      description: "Nærmeste supermarked. Godt utvalg av dagligvarer, vin og lokale produkter.",
      address: "Rua do Rossio, Alvor",
      tags: ["dagligvarer", "vin", "ferskvarer"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    },
    {
      id: "intermarche-portimao",
      name: "Intermarché Portimão",
      category: "supermarket",
      coordinates: [37.1456, -8.5412],
      description: "Stor supermarked med bredt utvalg. Perfekt for storhandel.",
      address: "EN125, Portimão",
      tags: ["storhandel", "billig", "parkering"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80",
    },
    {
      id: "continente-portimao",
      name: "Continente Portimão",
      category: "supermarket",
      coordinates: [37.1389, -8.5298],
      description: "Portugals største supermarkedkjede. Alt du trenger under ett tak.",
      address: "Aqua Portimão Shopping, Portimão",
      website: "https://www.continente.pt/",
      tags: ["kjøpesenter", "stort utvalg", "parkering"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80",
    },

    // Golf
    {
      id: "penina-golf",
      name: "Penina Hotel & Golf Resort",
      category: "golf",
      coordinates: [37.1542, -8.6064],
      description: "Algarves eldste og mest prestisjefylte golfbane. Kun 1 km fra villaen!",
      address: "Penina, 8501-952 Portimão",
      website: "https://www.penina.com/",
      tags: ["18-hull", "championship", "restaurant"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80",
    },
    {
      id: "palmares-golf",
      name: "Palmares Ocean Living & Golf",
      category: "golf",
      coordinates: [37.1089, -8.6589],
      description: "Spektakulær bane med havutsikt. 27 hull designet av Robert Trent Jones II.",
      address: "Meia Praia, Lagos",
      website: "https://www.palmaresgolf.com/",
      tags: ["havutsikt", "27-hull", "moderne"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80",
    },
    {
      id: "alto-golf",
      name: "Alto Golf & Country Club",
      category: "golf",
      coordinates: [37.1167, -8.5667],
      description: "Utfordrende 18-hulls bane med vakre omgivelser.",
      address: "Quinta do Alto do Poço, Alvor",
      website: "https://www.altogolf.com/",
      tags: ["18-hull", "restaurant", "utsikt"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&q=80",
    },

    // Badeland
    {
      id: "slide-splash",
      name: "Slide & Splash",
      category: "waterpark",
      coordinates: [37.1393, -8.4749],
      description: "Algarves største badeland! Vannrutsjebaner, bølgebasseng og shows.",
      address: "Vale de Deus 125, 8401-901 Lagoa",
      website: "https://www.slidesplash.com/",
      tags: ["vannrutsjebaner", "familiemoro", "hele dagen"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1560110478-b2cbe23c0bca?w=800&q=80",
    },
    {
      id: "aqualand",
      name: "Aqualand Algarve",
      category: "waterpark",
      coordinates: [37.1056, -8.2478],
      description: "Stort badeland med mange attraksjoner. Congo River er legendarisk!",
      address: "EN125, Alcantarilha",
      website: "https://www.aqualand.pt/",
      tags: ["vannrutsjebaner", "bølgebasseng", "mat"],
      rating: 4,
      image: "https://images.unsplash.com/photo-1590935216109-8d7b95fb88d0?w=800&q=80",
    },

    // Aktiviteter
    {
      id: "kartodromo-algarve",
      name: "Kartódromo Internacional do Algarve",
      category: "activity",
      coordinates: [37.2275, -8.6267],
      description: "Proff gokartbane ved Autódromo. 1531 meter lang bane!",
      address: "Autódromo Internacional do Algarve, Mexilhoeira Grande",
      website: "https://autodromodoalgarve.com/karting/",
      tags: ["gokart", "racing", "adrenalin"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1621188988909-fbef0a88dc04?w=800&q=80",
    },
    {
      id: "skydive-algarve",
      name: "Skydive Algarve",
      category: "activity",
      coordinates: [37.1489, -8.5847],
      description: "Tandemhopp fra 4600m! Se Algarve-kysten fra fugleperspektiv.",
      address: "Aeródromo de Alvor, Portimão",
      website: "https://www.skydivealgarve.com/",
      tags: ["fallskjerm", "tandem", "adrenalin"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1521673461164-de300ebcfb17?w=800&q=80",
    },
    {
      id: "future-eco-surf",
      name: "Future Eco Surf School",
      category: "activity",
      coordinates: [37.1175, -8.5362],
      description: "Bærekraftig surfeskole på Praia da Rocha. Kurs for alle nivåer.",
      address: "Praia da Rocha, Portimão",
      website: "https://future-ecosurf.com/",
      tags: ["surfing", "miljøvennlig", "kurs"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?w=800&q=80",
    },
    {
      id: "dolphins-driven",
      name: "Dolphins Driven",
      category: "activity",
      coordinates: [37.1189, -8.5278],
      description: "Delfintur i Atlanterhavet. Se delfiner i deres naturlige habitat!",
      address: "Marina de Portimão",
      website: "https://www.dolphins-driven.com/",
      tags: ["delfiner", "båttur", "natur"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=800&q=80",
    },
    {
      id: "cave-kayak",
      name: "Kayak & Cave Tours",
      category: "activity",
      coordinates: [37.0872, -8.4267],
      description: "Kajakktur til Benagil-grotten og andre spektakulære grotter langs kysten.",
      address: "Praia de Benagil, Lagoa",
      tags: ["kajakk", "grotter", "eventyr"],
      rating: 5,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    },
    {
      id: "boat-party",
      name: "Bom Dia Boat Parties",
      category: "activity",
      coordinates: [37.1189, -8.5278],
      description: "Festbåtturer langs kysten med BBQ, drinker og bading.",
      address: "Marina de Portimão",
      website: "https://www.bomdiaboattrips.com/",
      tags: ["fest", "båt", "BBQ", "bading"],
      rating: 4,
      price: "€45-65/person (~520-750 kr)",
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80",
    },

    // ========== NYE AKTIVITETER ==========

    // Jet Ski
    {
      id: "jet-ski-portimao",
      name: "Jet Ski Portimão",
      category: "activity",
      coordinates: [37.1189, -8.5278],
      description: "Lei jet ski og kjør langs Algarve-kysten! 30 min eller 1 time turer tilgjengelig. Perfekt for adrenalin-kick!",
      address: "Marina de Portimão",
      website: "https://www.viator.com/Portimao-tours/Jet-Skiing/d50135-g23-c89",
      tags: ["jet ski", "vannsport", "adrenalin", "gruppe"],
      rating: 5,
      price: "€80-120/jet ski (~920-1380 kr)",
      image: "https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=800&q=80",
    },

    // Quad/ATV Tour
    {
      id: "quad-tour-algarve",
      name: "Algarve Quad Tours",
      category: "activity",
      coordinates: [37.1456, -8.5847],
      description: "Utforsk Algarves bakland på ATV! 2-3 timers turer gjennom landsbyer, fjell og langs kysten. Inkluderer guide og utstyr.",
      address: "Portimão (pickup fra villaen mulig)",
      website: "https://www.megasportadventure.com/",
      tags: ["quad", "ATV", "terreng", "eventyr", "gruppe"],
      rating: 5,
      price: "€65-95/person (~750-1100 kr)",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },

    // Sunset Cruise
    {
      id: "sunset-cruise",
      name: "Sunset Sailing Cruise",
      category: "activity",
      coordinates: [37.1189, -8.5278],
      description: "Romantisk solnedgangstur med seilbåt langs kysten. Inkluderer vin, tapas og spektakulær utsikt over klippene.",
      address: "Marina de Portimão",
      website: "https://www.dreamswave.com/",
      tags: ["solnedgang", "seilbåt", "romantisk", "vin"],
      rating: 5,
      price: "€55-75/person (~630-860 kr)",
      image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800&q=80",
    },

    // ========== SEVERIDGHETER ==========

    // Silves Castle
    {
      id: "silves-castle",
      name: "Silves Festning (Castelo de Silves)",
      category: "sightseeing",
      coordinates: [37.1892, -8.4389],
      description: "Portugals best bevarte mauriske festning! Rød sandsteinsmurer fra 700-tallet. Fantastisk utsikt over byen og elven.",
      address: "R. do Castelo, 8300-117 Silves",
      website: "https://www.visitalgarve.pt/en/menu/94/castle-of-silves.aspx",
      tags: ["historisk", "festning", "maurisk", "utsikt", "fotografering"],
      rating: 5,
      price: "€2.90/person (~33 kr)",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80",
    },

    // Sagres & Cape St. Vincent
    {
      id: "sagres-cape",
      name: "Sagres & Cabo de São Vicente",
      category: "sightseeing",
      coordinates: [37.0079, -8.9956],
      description: "Europas sørvestligste punkt! Dramatiske klipper, fyrtårn og spektakulær solnedgang. Sagres Festning i nærheten.",
      address: "Cabo de São Vicente, Sagres",
      tags: ["klipper", "fyrtårn", "solnedgang", "natur", "fotografering"],
      rating: 5,
      price: "Gratis (parkering €2 / ~23 kr)",
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
    },

    // ========== VINTUR ==========

    // Wine Tour
    {
      id: "wine-tour-algarve",
      name: "Quinta dos Vales Vineyard",
      category: "activity",
      coordinates: [37.1667, -8.5167],
      description: "Algarves mest kjente vingård! Vinsmaking, omvisning og kunstgalleri. Lag din egen vin eller nyt premium-smaking.",
      address: "Sítio dos Vales, Estômbar, Lagoa",
      website: "https://quintadosvales.pt/",
      tags: ["vin", "smaking", "vingård", "kunst", "lokal"],
      rating: 5,
      price: "€15-45/person (~170-520 kr)",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80",
    },

    // ========== RESTAURANTER (TOPP RATED) ==========

    // Vista Restaurant
    {
      id: "vista-restaurant",
      name: "Vista Restaurante",
      category: "restaurant",
      coordinates: [37.0872, -8.7302],
      description: "Michelin-stjerne restaurant med spektakulær havutsikt. Moderne portugisisk kjøkken av João Oliveira. Book i god tid!",
      address: "Beco dos Ferreiros, Burgau, Lagos",
      website: "https://www.vistarestaurante.com/",
      tags: ["michelin", "fine dining", "havutsikt", "portugisisk"],
      rating: 5,
      price: "€€€€ (smaksmeny ~€120 / ~1380 kr)",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    },

    // A Casa do João
    {
      id: "casa-do-joao",
      name: "A Casa do João",
      category: "restaurant",
      coordinates: [37.1261, -8.5896],
      description: "Autentisk portugisisk restaurant i Alvor. Kjent for fantastisk cataplana (sjømatgryte) og grillet fisk. Lokalt favoritt!",
      address: "Rua Dr. Frederico Ramos Mendes 68, Alvor",
      tags: ["portugisisk", "sjømat", "cataplana", "autentisk", "lokalt"],
      rating: 5,
      price: "€€ (hovedrett €15-25 / ~170-290 kr)",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    },

    // O Barradas
    {
      id: "o-barradas",
      name: "O Barradas - Vinho & Petisco",
      category: "restaurant",
      coordinates: [37.1356, -8.5367],
      description: "Trendy vinbar og restaurant i Portimão. Utmerket portugisisk tapas, lokale viner og avslappet atmosfære.",
      address: "Rua Santa Isabel 14, Portimão",
      website: "https://www.obarradas.com/",
      tags: ["vinbar", "tapas", "portugisisk", "trendy", "vin"],
      rating: 5,
      price: "€€ (tapas €8-15 / ~90-170 kr)",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    },

    // Rei das Praias
    {
      id: "rei-das-praias",
      name: "Rei das Praias",
      category: "restaurant",
      coordinates: [37.0914, -8.6731],
      description: "Strandrestaurant ved Praia da Luz med føttene i sanden. Fersk grillet fisk, kald øl og avslappet vibe. Perfekt for lunsj!",
      address: "Praia da Luz, Lagos",
      tags: ["strand", "sjømat", "avslappet", "utsikt", "grillet fisk"],
      rating: 4,
      price: "€€ (hovedrett €12-22 / ~140-250 kr)",
      image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80",
    },

    // A Tasca Medieval
    {
      id: "tasca-medieval",
      name: "A Tasca Medieval",
      category: "restaurant",
      coordinates: [37.1892, -8.4389],
      description: "Sjarmerende restaurant i Silves gamlebyen, rett ved festningen. Tradisjonell Algarve-mat i historiske omgivelser.",
      address: "Rua Nossa Senhora dos Mártires 4, Silves",
      tags: ["tradisjonell", "silves", "historisk", "portugisisk"],
      rating: 4,
      price: "€€ (hovedrett €10-18 / ~115-210 kr)",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    },
  ] as MapLocation[],
};
