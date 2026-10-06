import { NextRequest, NextResponse } from "next/server";
import { getPublishedLinktreeLink } from "@/lib/linktree";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const link = await getPublishedLinktreeLink(slug);
  if (!link) return NextResponse.redirect(new URL("/links", request.url));
  try {
    await supabaseAdmin.from("link_click_events").insert({
      link_slug: link.slug,
      link_title: link.title,
      referer: request.headers.get("referer"),
      user_agent: request.headers.get("user-agent"),
      source: request.nextUrl.searchParams.get("source") || "linktree-page",
    });
  } catch (error) {
    console.error("Link click tracking failed:", error);
  }
  return NextResponse.redirect(link.url, 307);
}
