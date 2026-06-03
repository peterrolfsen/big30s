# OL / Lekene — implementasjonsplan

> Lag-mot-lag-turnering for 30-årsturen. Lagene trekkes på `/roster`, konkurrerer i
> en rekke øvelser (minigolf, svømming, tennis…), får poeng etter plassering, og
> kåres på en pall til slutt.

## Beslutninger (avklart)
- **Scoring:** plassering 1–4 → faste poeng (`10/7/5/3`). Ikke rå-verdier i v1.
- **Tiebreaker:** flest 1.-plasser, så flest 2.-plasser osv. (automatisk i leaderboard-sorteringen). Valgfri **dobbel-poeng-finale** (`[20,14,10,6]`) for dramatisk avslutning.
- **Hvem scorer:** alle innloggede deltakere kan taste poeng og opprette øvelser (vennegjeng, lav friksjon). `entered_by` logges. Kan strammes til `is_admin` med én linje senere.
- **Lag:** ikke låst — kan endres / trekkes på nytt. `commitDraftTeams` **overskriver** eksisterende lag, men **beholder egendefinerte lagnavn** (matchet på slot/accent).
- **Lagnavn:** redigerbare — lagene kan døpe seg selv (inline-redigering på hub-en). `commitDraftTeams` setter draft-navnet som default; `renameTeam` overstyrer.
- **Øvelser:** ikke seedet — legges inn live på dagen via `createEvent`.
- **Betting:** droppes i første omgang (kan legges på senere — odds kan auto-regnes fra lagets snitt-POWER).
- **Leveranse:** bygges i faser, denne planen godkjennes før koding.

## Arkitektur-prinsipp
Bygg på det som **allerede finnes** — ikke noe nytt rammeverk:
- Supabase (Postgres) + RLS «public read», skriving via **server actions** med service-role-nøkkel (mønster: [src/app/actions/bounty.ts](../src/app/actions/bounty.ts))
- Klient-realtime via `supabase.channel(...).on("postgres_changes", …)` (mønster: [src/components/games/Leaderboard.tsx](../src/components/games/Leaderboard.tsx))
- PIN-auth med `is_admin`-flagg på `participants`, JWT-sesjon (`trip-session`) med `id` ([src/lib/auth/session.ts](../src/lib/auth/session.ts))
- Visuell stil + animasjoner gjenbrukes fra `roster/`-komponentene (StandingsScreen, neon-aksenter, confetti)

---

## 1. Datamodell (ny SQL — `supabase-ol-setup.sql`)

```sql
-- LAG (committes fra lagtrekningen)
CREATE TABLE ol_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  accent text NOT NULL,                 -- neonfarge fra roster (cyan/amber/rose/violet/emerald)
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- MEDLEMMER (navn lagres direkte; participant-kobling er valgfri/nice-to-have)
CREATE TABLE ol_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES ol_teams(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  roster_id text,                        -- id fra config/roster.ts (f.eks. "tor")
  participant_id uuid REFERENCES participants(id)  -- valgfri kobling
);

-- ØVELSER (minigolf, svømming, tennis…) — legges inn live, ikke seedet
CREATE TABLE ol_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text,                             -- lucide-ikonnavn eller emoji
  status text NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming','active','done')),
  sort_order int NOT NULL DEFAULT 0,
  point_scheme jsonb NOT NULL DEFAULT '[10,7,5,3]',  -- poeng for 1.,2.,3.,4. plass; finale = [20,14,10,6]
  created_by uuid REFERENCES participants(id),       -- hvem opprettet øvelsen
  created_at timestamptz DEFAULT now()
);

-- RESULTAT (ett rad per lag per øvelse)
CREATE TABLE ol_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES ol_events(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES ol_teams(id) ON DELETE CASCADE,
  placement int NOT NULL,                -- 1,2,3,4...
  raw_note text,                         -- valgfri fritekst (f.eks. "23 slag")
  points int NOT NULL,                   -- utdelte poeng (kan overstyres manuelt)
  entered_by uuid REFERENCES participants(id),  -- hvem tastet resultatet (audit)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, team_id)
);

-- RLS: public read, writes via service role (samme som resten)
ALTER TABLE ol_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE ol_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ol_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ol_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON ol_teams FOR SELECT USING (true);
CREATE POLICY "Public read" ON ol_team_members FOR SELECT USING (true);
CREATE POLICY "Public read" ON ol_events FOR SELECT USING (true);
CREATE POLICY "Public read" ON ol_results FOR SELECT USING (true);
```

**Sammenlagt** = `SUM(ol_results.points)` gruppert på `team_id`. Det er hele motoren.

### Edge-cases
- **Antall lag styrer `point_scheme`-lengden.** 5 lag → default `[10,7,5,3,1]`. `points = scheme[placement-1] ?? 0`.
- **Delt plass:** v1 krever distinkte plasseringer per øvelse. Delt 1.-plass kan håndteres senere ved å tillate lik `placement` og dele snittpoeng.
- **Poeng overstyres:** `points` lagres eksplisitt (ikke utledet), så admin kan finjustere uten å endre `point_scheme`.

---

## 2. Scoring-logikk (`src/config/olympics.ts`)

```ts
export const DEFAULT_SCHEMES: Record<number, number[]> = {
  4: [10, 7, 5, 3],
  5: [10, 7, 5, 3, 1],
  6: [12, 9, 7, 5, 3, 1],
};
// Dobbel-poeng-finale (valgfritt på siste øvelse):
export const FINALE_SCHEME = [20, 14, 10, 6];

export const pointsForPlacement = (placement: number, scheme: number[]) =>
  scheme[placement - 1] ?? 0;
```

Bruker rangerer lagene → server action regner `points` per rad og upserter `ol_results`.

### Sammenlagt-sortering + tiebreaker
Leaderboard sorterer lagene på:
1. **Total poeng** (synkende)
2. **Flest 1.-plasser**, så **flest 2.-plasser**, … (utledes fra `ol_results.placement`)

Det gjør sammenlagt-vinneren entydig uten manuell shootout. En **dobbel-poeng-finale**
(`FINALE_SCHEME`) brukes typisk på siste øvelse for å sikre en spennende avslutning.

---

## 3. Server actions (`src/app/actions/olympics.ts`)

| Funksjon | Hva den gjør |
|---|---|
| `commitDraftTeams(teams)` | **Overskriver** `ol_teams` + `ol_team_members` fra draft-resultatet (idempotent — lagene kan trekkes på nytt). Beholder egendefinerte lagnavn matchet på `accent`/`sort_order`. |
| `renameTeam(teamId, name)` | Endrer lagnavn (inline-redigering på hub-en). |
| `createEvent(name, icon, scheme?)` | Legger til en øvelse live på dagen. Lagrer `created_by`. |
| `setEventStatus(eventId, status)` | upcoming → active → done. |
| `saveResults(eventId, rankedTeamIds[])` | Tar lag i plasseringsrekkefølge, regner poeng, upserter `ol_results`. Lagrer `entered_by`. |
| `clearResults(eventId)` | Nullstill en øvelse (angre). |

**Tilgang:** alle innloggede deltakere (`getSession()` ≠ null) kan kalle disse — turen er en
vennegjeng, lav friksjon prioriteres. `entered_by`/`created_by` logges for sporbarhet.
Vil man stramme til senere: legg `participants.is_admin`-sjekk i hver action (én linje per funksjon).

---

## 4. Sider & komponenter

| Rute | Fil | Beskrivelse |
|---|---|---|
| `/leker/ol` | `src/app/leker/ol/page.tsx` | Hub: aktiv øvelse, mini-leaderboard, lenke til tavle/admin |
| `/leker/ol/admin` | `src/app/leker/ol/admin/page.tsx` | Mobilvennlig score-entry (kun `is_admin`) |
| `/leker/ol/tavle` | `src/app/leker/ol/tavle/page.tsx` | Storskjerm-leaderboard, live (realtime) |
| — | `src/components/olympics/TeamLeaderboard.tsx` | Lag rangert etter sum poeng + per-øvelse-brytning |
| — | `src/components/olympics/EventScorer.tsx` | Dra/tapp lagene i rekkefølge → lagre |
| — | `src/components/olympics/CommitTeamsButton.tsx` | Leser `localStorage["30year_draft_result"]` → `commitDraftTeams` |
| — | `src/components/olympics/PodiumReveal.tsx` | Dramatisk pall (gjenbruker StandingsScreen-stil + confetti + announcer) |

Legg også et **OL-kort i leker-hubben** ([src/app/leker/page.tsx](../src/app/leker/page.tsx), `games`-arrayet).

---

## 5. Draft → DB commit-flyt
1. Kjør lagtrekningen på `/roster` som vanlig → resultatet ligger i `localStorage["30year_draft_result"]`
   som `[{ id, name, accent, players: [{ id, name }] }]`.
2. På `/leker/ol/admin` viser en **«Bruk lagene fra trekningen»**-knapp resultatet og kaller
   `commitDraftTeams()` → fyller `ol_teams` + `ol_team_members`.
3. Rett etter commit tilbys **«Døp lagene»** — alle lagnavn-felt åpne på rad (valgfritt).
4. Etter commit er trekningen frikoblet — videre poeng henger på `ol_teams`, ikke localStorage.

**Lagnavn ved ny trekning:** `commitDraftTeams` matcher eksisterende lag på `accent`/`sort_order`
og beholder et navn som er endret fra draft-defaulten. Slik overlever «Tor sine tapre» en
ny trekning. Nullstilling (eksplisitt) gir draft-navnene tilbake.

> Merk: `players[].id` er roster-config-id (`"tor"`), ikke participant-UUID. Vi lagrer navn direkte
> og kobler `participant_id` best-effort på navnematch — poeng er uansett per **lag**, ikke per person.

## 6. Realtime
`TeamLeaderboard` og `tavle` abonnerer på `postgres_changes` for `ol_results` + `ol_events`
(samme mønster som dagens `Leaderboard`). Admin lagrer på mobil → tavla på storskjerm
oppdateres umiddelbart.

---

## 7. Faseplan

### Fase 1 — Kjernen (MVP, det vi må ha)
1. `supabase-ol-setup.sql` + kjør i Supabase
2. `src/config/olympics.ts` (schemes + helpers) + typer i `src/lib/types.ts`
3. `src/app/actions/olympics.ts` (commit/create/status/save/clear)
4. `CommitTeamsButton` + `/leker/ol/admin` med `EventScorer`
5. `TeamLeaderboard` + `/leker/ol` hub
6. OL-kort i leker-hubben
7. Verifiser: `tsc`, `eslint`, manuell flyt (commit lag → øvelse → score → leaderboard)

### Fase 2 — Stas (storskjerm + finale)
8. `/leker/ol/tavle` realtime storskjerm-leaderboard (TV-vennlig, store tall, neon)
9. `PodiumReveal` — gull/sølv/bronse, confetti i lagfarge, announcer-stemme

### Fase 3 — Gøy (senere, valgfritt)
10. Betting/odds (auto-odds fra snitt-POWER), gambler-leaderboard
11. Per-øvelse-historikk, «MVP-lag», delte plasseringer

---

## 8. Åpne spørsmål
Alle hovedbeslutninger er avklart (se «Beslutninger» øverst). Mindre ting som kan finjusteres underveis:
- Eksakt UX for score-entry (drag-to-rank vs. tapp-plassering 1-2-3-4) — avgjøres når `EventScorer` bygges.
- Om dobbel-poeng-finale skal være en avkrysning per øvelse i admin-UI (sannsynligvis ja).

## 9. Verifisering
- `npx tsc --noEmit`
- `npx eslint src/app/leker/ol src/components/olympics src/app/actions/olympics.ts src/config/olympics.ts`
- `npm run build`
- Manuell: commit lag → opprett øvelse → ranger lag → se poeng på hub + tavle (to faner = realtime-sjekk)
