import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function getEnvVar(key: string): string {
  // OpenNext copies env vars to process.env in nodejs_compat mode
  const value = (process.env[key] || '').trim();
  console.log(`[Cloudflare] ${key} from process.env: ${value ? value.substring(0, 10) + '...' : 'MISSING'}`);
  return value;
}

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || "https://dummy.supabase.co";
  const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || "dummy-anon-key";

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
