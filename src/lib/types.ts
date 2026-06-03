export interface Participant {
  id: string;
  name: string;
  display_name: string;
  pin_hash: string;
  is_jubilant: boolean;
  is_admin?: boolean;
}

export interface WheelSpin {
  id: string;
  spun_by: string;
  mode: "names" | "dare" | "custom";
  segments: string[];
  result: string;
  created_at: string;
}

export interface BountyChallenge {
  id: string;
  title: string;
  description: string;
  category: "social" | "adventure" | "food" | "dare";
  points: number;
  difficulty: 1 | 2 | 3;
  is_secret: boolean;
  assigned_to: string | null;
  is_active: boolean;
}

export interface BountySubmission {
  id: string;
  challenge_id: string;
  participant_id: string;
  photo_url: string | null;
  comment: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  // Joined fields
  participant?: Participant;
  challenge?: BountyChallenge;
  votes?: BountyVote[];
}

export interface BountyVote {
  id: string;
  submission_id: string;
  voter_id: string;
  vote: boolean;
  created_at: string;
}

export interface PhotoCompetition {
  id: string;
  date: string;
  theme: string;
  description: string | null;
  status: "upcoming" | "submissions_open" | "voting_open" | "completed";
}

export interface PhotoEntry {
  id: string;
  competition_id: string;
  participant_id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
  // Joined
  participant?: Participant;
}

export interface PhotoVote {
  id: string;
  competition_id: string;
  voter_id: string;
  entry_id_1st: string;
  entry_id_2nd: string;
  entry_id_3rd: string;
}

export interface LeaderboardEntry {
  participant: Participant;
  bounty_points: number;
  photo_points: number;
  total_points: number;
}

export interface AuthSession {
  participantId: string;
  name: string;
  displayName: string;
  isJubilant: boolean;
  isAdmin: boolean;
}

// =====================================================
// OL / LEKENE
// =====================================================

export type OlAccent = "cyan" | "amber" | "rose" | "violet" | "emerald";

export interface OlTeam {
  id: string;
  name: string;
  accent: OlAccent;
  sort_order: number;
  created_at?: string;
  // Joined
  members?: OlTeamMember[];
}

export interface OlTeamMember {
  id: string;
  team_id: string;
  player_name: string;
  roster_id: string | null;
  participant_id: string | null;
}

export type OlEventStatus = "upcoming" | "active" | "done";

export interface OlEvent {
  id: string;
  name: string;
  icon: string | null;
  status: OlEventStatus;
  sort_order: number;
  point_scheme: number[];
  created_by: string | null;
  created_at?: string;
}

export interface OlResult {
  id: string;
  event_id: string;
  team_id: string;
  placement: number;
  raw_note: string | null;
  points: number;
  entered_by: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Utledet rad i sammenlagt-leaderboarden (ikke en DB-tabell). */
export interface OlStanding {
  team: OlTeam;
  total: number;
  /** Antall 1.-, 2.-, 3.-plasser osv. — `placements[1]` = antall 1.-plasser. */
  placements: Record<number, number>;
  rank: number;
}
