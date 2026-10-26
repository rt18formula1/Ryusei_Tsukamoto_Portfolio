import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getEnvVar(key: string): string {
  // OpenNext copies env vars to process.env in nodejs_compat mode
  return (process.env[key] || '').trim();
}

let _supabaseAdmin: SupabaseClient | null = null;
let _cachedUrl = '';
let _cachedKey = '';

export function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || "https://dummy.supabase.co";
  const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || "dummy-service-key";

  if (_supabaseAdmin && _cachedUrl === supabaseUrl && _cachedKey === supabaseServiceKey) {
    return _supabaseAdmin;
  }

  _cachedUrl = supabaseUrl;
  _cachedKey = supabaseServiceKey;
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _supabaseAdmin;
}

// Keep backward compat - lazy getter
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});
