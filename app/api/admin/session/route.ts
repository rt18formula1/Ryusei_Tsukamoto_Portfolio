import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export async function GET() {
  if (!ADMIN_EMAIL) {
    return NextResponse.json({ ok: false });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ok = !!user && user.email === ADMIN_EMAIL;
  return NextResponse.json({ ok });
}
