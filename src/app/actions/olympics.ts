"use server";

import { createClient } from "@supabase/supabase-js";
import { pointsForPlacement } from "@/config/olympics";
import type { OlEventStatus } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Form på draft-resultatet i localStorage["30year_draft_result"].
type DraftTeamInput = {
  id: string;
  name: string;
  accent: string;
  players: { id: string; name: string }[];
};

// =====================================================
// LAG
// =====================================================

/**
 * Overskriver ol_teams + ol_team_members fra lagtrekningen.
 * Beholder egendefinerte lagnavn (matchet på sort_order) — så et omdøpt lag
 * overlever en ny trekning. NB: nye lag får nye id-er, så eksisterende
 * resultater nullstilles (cascade) — re-commit = fersk turnering.
 */
export async function commitDraftTeams(teams: DraftTeamInput[]) {
  try {
    // Hent eksisterende navn for å bevare egendefinerte ved re-commit.
    const { data: existing } = await supabase
      .from("ol_teams")
      .select("name, accent, sort_order");
    const customNameByOrder = new Map<number, string>();
    if (existing) {
      for (const t of existing) customNameByOrder.set(t.sort_order, t.name);
    }

    // Slett gamle lag (cascade fjerner medlemmer + resultater).
    await supabase.from("ol_teams").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    for (let i = 0; i < teams.length; i++) {
      const t = teams[i];
      const prevName = customNameByOrder.get(i);
      // Bevar navnet hvis det var endret fra draft-defaulten.
      const name = prevName && prevName !== t.name ? prevName : t.name;

      const { data: inserted, error: teamErr } = await supabase
        .from("ol_teams")
        .insert({ name, accent: t.accent, sort_order: i })
        .select("id")
        .single();
      if (teamErr || !inserted) throw teamErr;

      if (t.players.length) {
        const members = t.players.map((p) => ({
          team_id: inserted.id,
          player_name: p.name,
          roster_id: p.id,
        }));
        const { error: memErr } = await supabase
          .from("ol_team_members")
          .insert(members);
        if (memErr) throw memErr;
      }
    }
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke lagre lagene" };
  }
}

export async function renameTeam(teamId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Lagnavn kan ikke være tomt" };
  try {
    const { error } = await supabase
      .from("ol_teams")
      .update({ name: trimmed })
      .eq("id", teamId);
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke endre lagnavn" };
  }
}

// =====================================================
// ØVELSER
// =====================================================

export async function createEvent(
  createdBy: string,
  name: string,
  icon: string | null,
  pointScheme?: number[]
) {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Øvelsen må ha et navn" };
  try {
    // Legg nye øvelser sist.
    const { data: last } = await supabase
      .from("ol_events")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const sortOrder = (last?.sort_order ?? -1) + 1;

    const insert: Record<string, unknown> = {
      name: trimmed,
      icon,
      created_by: createdBy,
      sort_order: sortOrder,
    };
    if (pointScheme) insert.point_scheme = pointScheme;

    const { data, error } = await supabase
      .from("ol_events")
      .insert(insert)
      .select("id")
      .single();
    if (error) throw error;
    return { success: true, eventId: data.id };
  } catch {
    return { success: false, error: "Kunne ikke opprette øvelsen" };
  }
}

export async function setEventStatus(eventId: string, status: OlEventStatus) {
  try {
    const { error } = await supabase
      .from("ol_events")
      .update({ status })
      .eq("id", eventId);
    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke endre status" };
  }
}

// =====================================================
// RESULTAT
// =====================================================

/**
 * Lagrer plasseringer for en øvelse. `rankedTeamIds` er lagene i målrekkefølge
 * (første = 1. plass). Poeng regnes fra øvelsens point_scheme. Erstatter
 * eventuelle tidligere resultater for øvelsen.
 */
export async function saveResults(
  eventId: string,
  rankedTeamIds: string[],
  enteredBy: string,
  notes?: Record<string, string>
) {
  if (!rankedTeamIds.length)
    return { success: false, error: "Ingen lag å registrere" };
  try {
    const { data: event, error: evErr } = await supabase
      .from("ol_events")
      .select("point_scheme")
      .eq("id", eventId)
      .single();
    if (evErr || !event) throw evErr;
    const scheme: number[] = event.point_scheme ?? [];

    // Fjern gamle resultater for øvelsen, sett inn ferske.
    await supabase.from("ol_results").delete().eq("event_id", eventId);

    const rows = rankedTeamIds.map((teamId, i) => ({
      event_id: eventId,
      team_id: teamId,
      placement: i + 1,
      points: pointsForPlacement(i + 1, scheme),
      raw_note: notes?.[teamId] ?? null,
      entered_by: enteredBy,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabase.from("ol_results").insert(rows);
    if (error) throw error;

    // Marker øvelsen som ferdig.
    await supabase.from("ol_events").update({ status: "done" }).eq("id", eventId);
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke lagre resultatet" };
  }
}

export async function clearResults(eventId: string) {
  try {
    await supabase.from("ol_results").delete().eq("event_id", eventId);
    await supabase
      .from("ol_events")
      .update({ status: "upcoming" })
      .eq("id", eventId);
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke nullstille øvelsen" };
  }
}
