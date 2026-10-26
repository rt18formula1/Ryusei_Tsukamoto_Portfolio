import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getEnvVar(key: string): string {
  // OpenNext copies env vars to process.env in nodejs_compat mode
  return (process.env[key] || '').trim();
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Create a single supabase client for the entire app
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  if (typeof window === 'undefined') {
    console.warn('⚠️ Supabase URL or Anon Key is missing during server-side execution.');
  }
}
