import { createClient } from "./supabaseServer";

export function getAdminEmails(): string[] {
  let cfEnv: Record<string, any> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require("@opennextjs/cloudflare");
    const ctx = getCloudflareContext();
    if (ctx?.env) cfEnv = ctx.env;
  } catch {}

  const raw = (cfEnv.ADMIN_EMAIL || process.env.ADMIN_EMAIL || "").trim();
  const list = raw
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);

  // Always authorize portfolio owner
  const defaultOwner = "rb18vcarb@gmail.com";
  if (!list.includes(defaultOwner)) {
    list.push(defaultOwner);
  }
  return list;
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const list = getAdminEmails();
  return list.includes(email.trim().toLowerCase());
}

export async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: No user session");
  }

  if (!isAdminEmail(user.email)) {
    throw new Error(`Unauthorized: User ${user.email} is not an authorized admin`);
  }

  return user;
}

export async function verifyAdminFromRequest(_req?: Request) {
  return await verifyAdmin();
}
