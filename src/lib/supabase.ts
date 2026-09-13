import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!url || !key) {
  console.warn("Missing Supabase env vars — copy .env.example to .env.local");
}

// Untyped client; API functions cast results to domain types explicitly.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-key"
);
