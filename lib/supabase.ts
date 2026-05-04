import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ldaxygnabcfvnjsmopwy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYXh5Z25hYmNmdm5qc21vcHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MDM4MTAsImV4cCI6MjA5MzE3OTgxMH0.17enQSvLQqBDo4XKQI7Agvr0gJkobdUELdmPY-H9w3Y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("souls-3000-media")
    .createSignedUrl(path, 60 * 60); // 1 hour expiry
  if (error || !data) throw error;
  return data.signedUrl;
}