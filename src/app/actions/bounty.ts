"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function submitBountyProof(
  participantId: string,
  challengeId: string,
  photoUrl: string | null,
  comment: string | null
) {
  try {
    // Check if already submitted
    const { data: existing } = await supabase
      .from("bounty_submissions")
      .select("id")
      .eq("challenge_id", challengeId)
      .eq("participant_id", participantId)
      .single();

    if (existing) {
      return { success: false, error: "Du har allerede sendt inn for denne utfordringen" };
    }

    const { error } = await supabase.from("bounty_submissions").insert({
      challenge_id: challengeId,
      participant_id: participantId,
      photo_url: photoUrl,
      comment,
      status: "pending",
    });

    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt" };
  }
}

export async function voteBountySubmission(
  voterId: string,
  submissionId: string,
  vote: boolean
) {
  try {
    // Check if the voter is voting on their own submission
    const { data: submission } = await supabase
      .from("bounty_submissions")
      .select("participant_id")
      .eq("id", submissionId)
      .single();

    if (submission?.participant_id === voterId) {
      return { success: false, error: "Du kan ikke stemme på din egen" };
    }

    // Upsert vote
    const { error } = await supabase.from("bounty_votes").upsert(
      {
        submission_id: submissionId,
        voter_id: voterId,
        vote,
      },
      { onConflict: "submission_id,voter_id" }
    );

    if (error) throw error;

    // Check if submission should be approved (3+ positive votes)
    const { count } = await supabase
      .from("bounty_votes")
      .select("*", { count: "exact", head: true })
      .eq("submission_id", submissionId)
      .eq("vote", true);

    if (count && count >= 3) {
      await supabase
        .from("bounty_submissions")
        .update({ status: "approved" })
        .eq("id", submissionId);
    }

    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt" };
  }
}
