import { supabase } from "./supabase";

/**
 * Sign in with Google using Supabase OAuth.
 * Performs a redirect to the provider's login screen.
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
