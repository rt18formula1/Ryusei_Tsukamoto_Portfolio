import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { verifyAdmin } from "@/lib/admin-auth";
import { getLinktreeLinks } from "@/lib/linktree-queries";
import { LinktreeEditor } from "@/components/admin/linktree-editor";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  try {
    await verifyAdmin();
    const links = await getLinktreeLinks({ includeInactive: true });
    return (
      <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 text-black sm:px-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div><Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-black/45 hover:text-black"><ArrowLeft size={14} /> Admin</Link><h1 className="mt-4 text-3xl font-black tracking-tight">Links</h1><p className="mt-1 text-sm text-black/50">Linktree風の編集画面。ドラッグせずに上下ボタンで順番を変更できます。</p></div>
            <Link href="/links" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold hover:border-black/30"><ExternalLink size={14} /> Preview</Link>
          </div>
          <LinktreeEditor initialLinks={links} />
        </div>
      </main>
    );
  } catch (error) {
    return <main className="min-h-screen bg-[#f7f7f5] p-8"><div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">{error instanceof Error ? error.message : "Unauthorized"}<br /><Link href="/admin" className="mt-3 inline-block font-bold underline">Adminへ戻る</Link></div></main>;
  }
}
