import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email ?? "";
  const password = body?.password ?? "";

  if (!ADMIN_EMAIL) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_EMAIL is not configured" },
      { status: 500 },
    );
  }

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return NextResponse.json({ ok: false, error: error?.message ?? "Login failed" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
