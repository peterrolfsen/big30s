"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPin(participantId: string, pin: string) {
  try {
    // Sjekk om PIN matcher admin-koden (gir admin-tilgang uansett bruker)
    const isAdminCode = pin === process.env.ADMIN_CODE;

    if (isAdminCode) {
      const { data, error } = await supabase
        .from("participants")
        .select("id, name, display_name, is_jubilant")
        .eq("id", participantId)
        .single();

      if (error || !data) {
        return { success: false, error: "Bruker ikke funnet" };
      }

      return {
        success: true,
        session: {
          participantId: data.id,
          name: data.name,
          displayName: data.display_name,
          isJubilant: data.is_jubilant,
          isAdmin: true,
        },
      };
    }

    // Vanlig PIN-verifisering
    const pinHash = await hashPin(pin);

    const { data, error } = await supabase
      .from("participants")
      .select("id, name, display_name, is_jubilant, is_admin")
      .eq("id", participantId)
      .eq("pin_hash", pinHash)
      .single();

    if (error || !data) {
      return { success: false, error: "Feil PIN" };
    }

    return {
      success: true,
      session: {
        participantId: data.id,
        name: data.name,
        displayName: data.display_name,
        isJubilant: data.is_jubilant,
        isAdmin: data.is_admin ?? false,
      },
    };
  } catch {
    return { success: false, error: "Noe gikk galt" };
  }
}

export async function getParticipants() {
  const { data, error } = await supabase
    .from("participants")
    .select("id, name, display_name, is_jubilant")
    .order("name");

  if (error) return [];
  return data;
}
