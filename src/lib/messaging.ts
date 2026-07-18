/**
 * Firebase Cloud Messaging (FCM) — Client-side utilities (Stubbed temporarily)
 */

/**
 * Request notification permission and save the FCM token (Stubbed).
 */
export async function requestAndSaveFCMToken(
  uid: string
): Promise<string | null> {
  console.log("FCM token request stubbed temporarily during Supabase migration");
  return null;
}

/**
 * Listen for foreground notifications (Stubbed).
 */
export async function onForegroundMessage(
  callback: (payload: { title: string; body: string }) => void
): Promise<(() => void) | null> {
  console.log("FCM foreground message listener stubbed temporarily during Supabase migration");
  return () => { };
}