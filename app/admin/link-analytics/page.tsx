import Link from "next/link";
import { ArrowLeft, BarChart3, ExternalLink } from "lucide-react";
import { verifyAdmin } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getLinktreeLinks } from "@/lib/linktree-queries";

export const dynamic = "force-dynamic";

type ClickRow = { link_slug: string; link_title: string; clicked_at: string };

export default async function LinkAnalyticsPage() {
  let rows: ClickRow[] = [];
  let errorMessage = "";
  const currentLinks = await getLinktreeLinks({ includeInactive: true });
  try {
    await verifyAdmin();
    const result = await supabaseAdmin.from("link_click_events").select("link_slug, link_title, clicked_at").order("clicked_at", { ascending: false });
    if (result.error) throw result.error;
    rows = (result.data ?? []) as ClickRow[];
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Analytics could not be loaded";
  }

  const counts = new Map<string, { title: string; count: number; lastClicked: string | null }>();
  for (const link of currentLinks) counts.set(link.slug, { title: link.title, count: 0, lastClicked: null });
  for (const row of rows) {
    const current = counts.get(row.link_slug) ?? { title: row.link_title, count: 0, lastClicked: null };
    counts.set(row.link_slug, { title: current.title, count: current.count + 1, lastClicked: current.lastClicked ?? row.clicked_at });
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1].count - a[1].count || a[1].title.localeCompare(b[1].title));

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-black sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div><Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-black/45 hover:text-black"><ArrowLeft size={14} /> Admin</Link><h1 className="mt-4 text-3xl font-black tracking-tight">Link Analytics</h1><p className="mt-1 text-sm text-black/50">Linktree replacementのクリック集計</p></div>
          <Link href="/links" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-black/30"><ExternalLink size={14} /> View Links</Link>
        </div>
        {errorMessage ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">{errorMessage}<br /><Link href="/admin" className="mt-2 inline-block font-bold underline">Adminへ戻る</Link></div> : <>
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-black/8 bg-white p-5"><BarChart3 size={20} className="text-blue-600" /><div><p className="text-xs font-bold uppercase tracking-widest text-black/40">Total tracked clicks</p><p className="mt-1 text-2xl font-black">{rows.length}</p></div></div>
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm"><table className="w-full text-left"><thead className="bg-black/[.03] text-[10px] font-black uppercase tracking-widest text-black/45"><tr><th className="px-5 py-4">Link</th><th className="px-5 py-4">Clicks</th><th className="px-5 py-4">Last clicked</th></tr></thead><tbody>{sorted.map(([slug, item]) => <tr key={slug} className="border-t border-black/5"><td className="px-5 py-4 text-sm font-bold">{item.title}<span className="mt-1 block text-[10px] font-mono text-black/35">{slug}</span></td><td className="px-5 py-4 text-lg font-black">{item.count}</td><td className="px-5 py-4 text-xs text-black/50">{item.lastClicked ? new Date(item.lastClicked).toLocaleString("ja-JP") : "—"}</td></tr>)}</tbody></table></div>
        </>}
      </div>
    </main>
  );
}
