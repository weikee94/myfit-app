import { supabase } from "@/lib/supabase";
import type { ProfileRow } from "@/types/database";

type ProfileUpdate = Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">>;

export async function fetchProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data as ProfileRow;
}

export async function updateProfile(userId: string, update: ProfileUpdate): Promise<ProfileRow> {
  const payload = { ...update, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from("profiles")
    .update(payload as object)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data as ProfileRow;
}
