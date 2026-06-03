"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createSession, destroySession } from "./session";
import { redirect } from "next/navigation";

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPin(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const pin = formData.get("pin") as string;

  if (!pin || pin.length < 4 || pin.length > 6) {
    return { error: "Skriv inn en gyldig PIN-kode" };
  }

  const supabase = createServerSupabaseClient();
  const pinHash = await hashPin(pin);

  const { data: participant, error } = await supabase
    .from("participants")
    .select("id, name, is_jubilant")
    .eq("pin_hash", pinHash)
    .single();

  if (error || !participant) {
    return { error: "Feil PIN-kode. Prøv igjen!" };
  }

  await createSession({
    id: participant.id,
    name: participant.name,
    isCelebrant: participant.is_jubilant,
  });

  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
