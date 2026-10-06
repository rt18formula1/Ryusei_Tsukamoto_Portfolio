"use client";

import Link from "next/link";
import { ExternalLink, Link2, QrCode } from "lucide-react";
import { linktreeLinks } from "@/lib/content";

const socialLinks = linktreeLinks.filter((link) => link.group === "social");
const featuredLinks = linktreeLinks.filter((link) => link.group === "featured");
const resourceLinks = linktreeLinks.filter((link) => link.group === "resources");

function TrackableLink({ slug, title }: { slug: string; title: string }) {
  return (
    <a href={`/go/${slug}`} className="group flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-black/30 hover:shadow-lg">
      <span className="min-w-0 flex-1 truncate text-sm font-bold tracking-tight">{title}</span>
      <ExternalLink size={16} className="shrink-0 text-black/25 transition group-hover:text-black" />
    </a>
  );
}

export function LinktreePageClient() {
  return (
    <main className="min-h-screen bg-[#dfe4e8] px-4 py-8 text-black sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-black/55">
          <Link href="/" className="transition hover:text-black">← Portfolio Map</Link>
          <Link href="/wallet" className="inline-flex items-center gap-1.5 transition hover:text-black"><QrCode size={14} /> QR Card</Link>
        </div>
        <section className="rounded-[2rem] bg-white/65 px-4 py-8 shadow-sm backdrop-blur sm:px-12 sm:py-12">
          <header className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-black shadow-xl"><img src="/icon.png" alt="" className="h-full w-full object-cover" /></div>
            <h1 className="mt-5 text-2xl font-black tracking-tight">rt18_formula1</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-black/65">This account is dedicated to posting F1 illustrations created by RT18. We would greatly appreciate it if you could follow, like, and share!</p>
            <div className="mt-5 flex items-center justify-center gap-3 text-black/45"><Link2 size={16} /><span className="text-[10px] font-black uppercase tracking-[0.25em]">Links</span></div>
          </header>
          <div className="mt-8 space-y-3">{featuredLinks.map((link) => <TrackableLink key={link.slug} {...link} />)}</div>
          <div className="my-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-black/35"><span className="h-px flex-1 bg-black/10" /> Social <span className="h-px flex-1 bg-black/10" /></div>
          <div className="space-y-3">{socialLinks.map((link) => <TrackableLink key={link.slug} {...link} />)}</div>
          <div className="my-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-black/35"><span className="h-px flex-1 bg-black/10" /> More <span className="h-px flex-1 bg-black/10" /></div>
          <div className="space-y-3">{resourceLinks.map((link) => <TrackableLink key={link.slug} {...link} />)}</div>
        </section>
        <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">RT18_FORMULA1 · RYUSEI TSUKAMOTO</p>
      </div>
    </main>
  );
}
