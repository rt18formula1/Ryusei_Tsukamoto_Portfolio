import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { isAdminEmail } from "@/lib/admin-auth";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ ok: false });
    }

    const ok = isAdminEmail(user.email);
    return NextResponse.json({ ok, email: ok ? user.email : undefined });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

