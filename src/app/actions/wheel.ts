"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function logSpin(
  participantId: string,
  mode: string,
  segments: string[],
  result: string
) {
  try {
    const { error } = await supabase.from("wheel_spins").insert({
      spun_by: participantId,
      mode,
      segments,
      result,
    });

    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false };
  }
}
