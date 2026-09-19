import { createClient } from "@supabase/supabase-js";

// Supabase is migrating projects from the legacy "anon" key to a new
// "publishable" key (sb_publishable_...). Depending on when your project was
// created, your dashboard may show you either name — so we accept both env
// var names here and use whichever is set, preferring the current one.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // This is the #1 cause of "login just bounces back to the login page":
  // signInWithOAuth can still kick off the Google redirect even with a
  // missing/undefined key, but the session exchange on the way back fails
  // silently, so you land back on LoginScreen with no visible error.
  console.error(
    "[FinMind] Missing Supabase env vars. Check that .env has VITE_SUPABASE_URL and " +
    "VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) set, and restart `npm run dev` " +
    "after creating/editing .env — Vite only reads it at startup."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
