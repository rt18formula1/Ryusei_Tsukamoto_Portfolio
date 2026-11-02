import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getEnvVar(key: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  // 1. Direct access for client-side webpack DefinePlugin inlining
  if (key === 'NEXT_PUBLIC_SUPABASE_URL' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL.trim();
  }
  if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim();
  }

  // 2. Cloudflare Workers server-side runtime context
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env && ctx.env[key]) {
      return String(ctx.env[key]).trim();
    }
  } catch {}

  // 3. General process.env fallback
  return (process.env[key] || '').trim();
}

let _supabaseClient: SupabaseClient | null = null;
let _cachedUrl = '';
let _cachedKey = '';

export function getSupabase(): SupabaseClient | null {
  const url = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    return null;
  }

  if (_supabaseClient && _cachedUrl === url && _cachedKey === anonKey) {
    return _supabaseClient;
  }

  _cachedUrl = url;
  _cachedKey = anonKey;
  _supabaseClient = createClient(url, anonKey);
  return _supabaseClient;
}

// Transparent Proxy export for backward compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      if (prop === 'then') return undefined; // avoid Promise coercion issues
      return undefined;
    }
    const val = (client as any)[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  },
}) as SupabaseClient | null;

