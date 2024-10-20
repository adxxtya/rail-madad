import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing in the Environment Variables.");
}

if (!supabaseAnonKey) {
  throw new Error("Supabase Anon Key is missing in the Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
