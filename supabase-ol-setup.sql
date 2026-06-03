-- =====================================================
-- OL / LEKENE: Supabase Database Setup
-- Lag-mot-lag-turnering. Kjør dette i Supabase SQL Editor.
-- (Se docs/OL-LEKENE-PLAN.md for helheten.)
-- =====================================================

-- 1. LAG (committes fra lagtrekningen på /roster)
CREATE TABLE ol_teams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  accent text NOT NULL,                 -- neonfarge fra roster: cyan/amber/rose/violet/emerald
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 2. LAGMEDLEMMER (navn lagres direkte; participant-kobling er valgfri)
CREATE TABLE ol_team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id uuid NOT NULL REFERENCES ol_teams(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  roster_id text,                        -- id fra config/roster.ts (f.eks. "tor")
  participant_id uuid REFERENCES participants(id)  -- valgfri kobling (best-effort på navn)
);

-- 3. ØVELSER (minigolf, svømming, tennis…) — legges inn live, ikke seedet
CREATE TABLE ol_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon text,                             -- lucide-ikonnavn eller emoji
  status text NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'active', 'done')),
  sort_order int NOT NULL DEFAULT 0,
  point_scheme jsonb NOT NULL DEFAULT '[10,7,5,3]'::jsonb,  -- poeng 1.,2.,3.,4.; finale = [20,14,10,6]
  created_by uuid REFERENCES participants(id),
  created_at timestamptz DEFAULT now()
);

-- 4. RESULTAT (ett rad per lag per øvelse)
CREATE TABLE ol_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES ol_events(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES ol_teams(id) ON DELETE CASCADE,
  placement int NOT NULL,                -- 1,2,3,4...
  raw_note text,                         -- valgfri fritekst (f.eks. "23 slag")
  points int NOT NULL,                   -- utdelte poeng (kan overstyres manuelt)
  entered_by uuid REFERENCES participants(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, team_id)
);

-- Indekser for raske oppslag på leaderboard/score-entry
CREATE INDEX ol_results_event_idx ON ol_results(event_id);
CREATE INDEX ol_results_team_idx ON ol_results(team_id);
CREATE INDEX ol_team_members_team_idx ON ol_team_members(team_id);

-- =====================================================
-- RLS: public read (anon-nøkkel), writes via service role (server actions)
-- Samme mønster som supabase-setup.sql.
-- =====================================================
ALTER TABLE ol_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE ol_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ol_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ol_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON ol_teams FOR SELECT USING (true);
CREATE POLICY "Public read" ON ol_team_members FOR SELECT USING (true);
CREATE POLICY "Public read" ON ol_events FOR SELECT USING (true);
CREATE POLICY "Public read" ON ol_results FOR SELECT USING (true);

-- =====================================================
-- Realtime: la klienten abonnere på endringer (leaderboard + tavle)
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE ol_teams;
ALTER PUBLICATION supabase_realtime ADD TABLE ol_events;
ALTER PUBLICATION supabase_realtime ADD TABLE ol_results;
