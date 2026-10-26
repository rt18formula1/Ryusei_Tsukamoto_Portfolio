import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getEnvVar(key: string): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env && ctx.env[key]) {
      return String(ctx.env[key]).trim();
    }
  } catch {}
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
