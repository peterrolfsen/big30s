-- =====================================================
-- TURLEKER: Supabase Database Setup
-- Kjør dette i Supabase SQL Editor
-- =====================================================

-- 1. PARTICIPANTS
CREATE TABLE participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  pin_hash text NOT NULL,
  is_jubilant boolean NOT NULL DEFAULT false,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 2. WHEEL SPINS
CREATE TABLE wheel_spins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  spun_by uuid NOT NULL REFERENCES participants(id),
  mode text NOT NULL,
  segments jsonb NOT NULL,
  result text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 3. BOUNTY CHALLENGES
CREATE TABLE bounty_challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('social', 'adventure', 'food', 'dare')),
  points integer NOT NULL,
  difficulty integer NOT NULL CHECK (difficulty BETWEEN 1 AND 3),
  is_secret boolean NOT NULL DEFAULT false,
  assigned_to uuid REFERENCES participants(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 4. BOUNTY SUBMISSIONS
CREATE TABLE bounty_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id uuid NOT NULL REFERENCES bounty_challenges(id),
  participant_id uuid NOT NULL REFERENCES participants(id),
  photo_url text,
  comment text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, participant_id)
);

-- 5. BOUNTY VOTES
CREATE TABLE bounty_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id uuid NOT NULL REFERENCES bounty_submissions(id),
  voter_id uuid NOT NULL REFERENCES participants(id),
  vote boolean NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(submission_id, voter_id)
);

-- 6. PHOTO COMPETITIONS
CREATE TABLE photo_competitions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  theme text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'submissions_open', 'voting_open', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- 7. PHOTO ENTRIES
CREATE TABLE photo_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id uuid NOT NULL REFERENCES photo_competitions(id),
  participant_id uuid NOT NULL REFERENCES participants(id),
  photo_url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(competition_id, participant_id)
);

-- 8. PHOTO VOTES
CREATE TABLE photo_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id uuid NOT NULL REFERENCES photo_competitions(id),
  voter_id uuid NOT NULL REFERENCES participants(id),
  entry_id_1st uuid NOT NULL REFERENCES photo_entries(id),
  entry_id_2nd uuid NOT NULL REFERENCES photo_entries(id),
  entry_id_3rd uuid NOT NULL REFERENCES photo_entries(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(competition_id, voter_id),
  CHECK (entry_id_1st != entry_id_2nd AND entry_id_2nd != entry_id_3rd AND entry_id_1st != entry_id_3rd)
);

-- =====================================================
-- RLS POLICIES (enable Row Level Security)
-- =====================================================

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE wheel_spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_votes ENABLE ROW LEVEL SECURITY;

-- Allow public read on all tables (anon key)
CREATE POLICY "Public read" ON participants FOR SELECT USING (true);
CREATE POLICY "Public read" ON wheel_spins FOR SELECT USING (true);
CREATE POLICY "Public read" ON bounty_challenges FOR SELECT USING (true);
CREATE POLICY "Public read" ON bounty_submissions FOR SELECT USING (true);
CREATE POLICY "Public read" ON bounty_votes FOR SELECT USING (true);
CREATE POLICY "Public read" ON photo_competitions FOR SELECT USING (true);
CREATE POLICY "Public read" ON photo_entries FOR SELECT USING (true);
CREATE POLICY "Public read" ON photo_votes FOR SELECT USING (true);

-- Allow service role to insert/update (writes go through Server Actions)
-- Service role bypasses RLS automatically, so no additional policies needed for writes.

-- =====================================================
-- REALTIME (enable for live updates)
-- =====================================================

ALTER PUBLICATION supabase_realtime ADD TABLE bounty_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE bounty_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE photo_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE photo_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE photo_competitions;
ALTER PUBLICATION supabase_realtime ADD TABLE wheel_spins;

-- =====================================================
-- STORAGE BUCKETS
-- Opprett disse manuelt i Supabase Dashboard → Storage:
--   1. "bounty-proofs" (public bucket)
--   2. "photo-wars" (public bucket)
-- =====================================================

-- =====================================================
-- SEED DATA: Foto-temaer
-- =====================================================

INSERT INTO photo_competitions (date, theme, description) VALUES
  ('2026-06-07', 'Første inntrykk', 'Fang det første øyeblikket som sier ''vi er i Portugal!'''),
  ('2026-06-08', 'Vann-elementet', 'Beste bilde som involverer vann — basseng, hav, drink, whatever'),
  ('2026-06-09', 'Action!', 'Fang det mest actionfylte øyeblikket i dag'),
  ('2026-06-10', 'Farger i Algarve', 'Finn det mest fargerike motivet du kan'),
  ('2026-06-11', 'Skjult skatt', 'Noe vakkert eller interessant som ingen andre la merke til'),
  ('2026-06-12', 'Gutta i element', 'Fang et øyeblikk som viser gjengen på sitt beste (eller verste)'),
  ('2026-06-13', 'Party mode', 'Beste partybilde — kreativitet teller!'),
  ('2026-06-14', 'Avskjed', 'Det siste bildet som oppsummerer hele turen');

-- =====================================================
-- SEED DATA: Bounty Challenges
-- =====================================================

INSERT INTO bounty_challenges (title, description, category, points, difficulty) VALUES
  ('Portugisisk bestilling', 'Bestill mat på portugisisk uten å peke på menyen eller bruke engelsk', 'social', 50, 2),
  ('Lokal bestevenn', 'Bli kompis med en lokal og ta en selfie sammen', 'social', 40, 1),
  ('Bartender-lærling', 'Overtal en bartender til å lære deg å lage en drink bak baren', 'social', 80, 2),
  ('Karaoke-konge', 'Syng en hel sang foran fremmede på en bar eller restaurant', 'social', 100, 3),
  ('Shot med en fremmed', 'Få en tilfeldig person til å ta en shot med deg', 'social', 60, 2),
  ('Basseng-bomba', 'Hopp i bassenget med klærne på', 'adventure', 30, 1),
  ('Soloppgangs-kriger', 'Stå opp og se soloppgangen. Bevis med bilde + tidsstempel', 'adventure', 70, 2),
  ('Surfemester', 'Stå oppreist på et surfebrett i minst 5 sekunder (video som bevis)', 'adventure', 80, 3),
  ('Klippestuper', 'Hopp fra en klippe eller høy brygge ned i vannet', 'adventure', 60, 2),
  ('Gokart-kongen', 'Vinn et gokart-heat mot minst 3 andre fra gruppa', 'adventure', 50, 2),
  ('Mysterie-rett', 'Spis noe du aldri har prøvd før uten å vite hva det er på forhånd', 'food', 40, 1),
  ('Cocktail-sjef', 'Lag en cocktail for hele gruppen (oppskrift + servering)', 'food', 50, 2),
  ('Sardiner-utfordring', 'Spis en hel sardin (med hode og alt) uten å lage grimaser', 'food', 60, 2),
  ('Lokal matmarked', 'Kjøp noe på et lokalt matmarked og lag en rett til gruppen', 'food', 70, 2),
  ('Pastel de Nata-ekspert', 'Finn og smak pastel de nata fra 3 forskjellige steder og kåre den beste', 'food', 40, 1),
  ('Aksent-mester', 'Snakk med utenlandsk aksent i 1 hel time uten at noen avslører deg', 'dare', 150, 3),
  ('Solbrille-dansen', 'Bær solbriller innendørs hele dagen og nekt å innrømme det er mørkt', 'dare', 40, 1),
  ('Kompliment-bomben', 'Gi 10 fremmede et genuint kompliment på én time', 'dare', 60, 2),
  ('Taus time', 'Ikke snakk i 1 hel time. All kommunikasjon via tegn og miming', 'dare', 80, 2),
  ('Tourist deluxe', 'Gå rundt med kamera rundt halsen, hawaii-skjorte og spør om veibeskrivelse til steder du allerede er på', 'dare', 50, 1),
  ('Hemmelig tjener', 'Gjør 3 snille ting for gruppa uten at noen oppdager det. Avsløres på siste kveld', 'dare', 100, 3),
  ('Freestyle-rap', 'Lever en 30-sekunders freestyle rap om turen foran hele gruppen', 'dare', 70, 2);

-- =====================================================
-- SEED DATA: Deltakere
-- Du MÅ oppdatere PIN-hashene med ekte verdier!
-- SHA-256 av f.eks. "1234" = 03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4
-- Bruk en SHA-256 generator: https://emn178.github.io/online-tools/sha256.html
-- =====================================================

INSERT INTO participants (name, display_name, pin_hash, is_jubilant, is_admin) VALUES
  ('Peter Rolfsen', 'Peter', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', true, true),
  ('Anders Spjøtvold', 'Anders', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', true, false),
  ('Johannes Steen', 'Johannes', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', true, false),
  ('Tor Simen Berntsen', 'Tor Simen', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', true, false),
  ('Bror Dypfest', 'Bror', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', true, false),
  ('Martin Hagen', 'Martin', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', true, false),
  ('Magnus Jordfald', 'Magnus', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', true, false);

-- VIKTIG: Legg til de 13 andre deltakerne her!
-- Bytt ut PIN-hashene med unike PINer for hver person
-- Eksempel: INSERT INTO participants (name, display_name, pin_hash, is_jubilant) VALUES
--   ('Fornavn Etternavn', 'Kallenavn', '<sha256-av-pin>', false);
