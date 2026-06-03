"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitPhoto(
  participantId: string,
  competitionId: string,
  photoUrl: string,
  caption: string | null
) {
  try {
    const { error } = await supabase.from("photo_entries").insert({
      competition_id: competitionId,
      participant_id: participantId,
      photo_url: photoUrl,
      caption,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Du har allerede sendt inn bilde i dag" };
      }
      throw error;
    }
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt" };
  }
}

export async function submitPhotoVote(
  voterId: string,
  competitionId: string,
  first: string,
  second: string,
  third: string
) {
  try {
    // Verify voter didn't vote for own entries
    const { data: ownEntries } = await supabase
      .from("photo_entries")
      .select("id")
      .eq("competition_id", competitionId)
      .eq("participant_id", voterId);

    const ownIds = new Set(ownEntries?.map((e) => e.id) || []);
    if (ownIds.has(first) || ownIds.has(second) || ownIds.has(third)) {
      return { success: false, error: "Du kan ikke stemme på ditt eget bilde" };
    }

    const { error } = await supabase.from("photo_votes").upsert(
      {
        competition_id: competitionId,
        voter_id: voterId,
        entry_id_1st: first,
        entry_id_2nd: second,
        entry_id_3rd: third,
      },
      { onConflict: "competition_id,voter_id" }
    );

    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt" };
  }
}

export async function updateCompetitionStatus(
  participantId: string,
  competitionId: string,
  status: string
) {
  try {
    // Verify admin
    const { data: participant } = await supabase
      .from("participants")
      .select("is_admin")
      .eq("id", participantId)
      .single();

    if (!participant?.is_admin) {
      return { success: false, error: "Kun admin kan endre status" };
    }

    const { error } = await supabase
      .from("photo_competitions")
      .update({ status })
      .eq("id", competitionId);

    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt" };
  }
}
