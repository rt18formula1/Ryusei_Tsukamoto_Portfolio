"use client";

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-white px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-black tracking-tight">Ryusei Tsukamoto</p>
            <p className="mt-3 max-w-xs text-xs leading-6 text-black/50">F1、音楽、イラスト、Web開発を横断するPortfolio。</p>
          </div>
          <FooterColumn title="Explore" links={[
            ["Portfolio Map", "/"], ["Profile", "/profile"], ["Links", "/links"], ["Portfolio", "/portfolio"],
          ]} />
          <FooterColumn title="Activities" links={[
            ["Developer", "/portfolio/developer"], ["Illustrator", "/disciplines/illustrator"], ["Musician", "/disciplines/musician"], ["Blogger", "/disciplines/blogger"],
          ]} />
          <FooterColumn title="More" links={[
            ["News", "/news"], ["Calendar", "/calendar"], ["F1 Database", "/f1-database"], ["Shop", "/shop"], ["QR Card", "/wallet"],
          ]} />
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-black/10 pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-black/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ryusei Tsukamoto. All rights reserved.</p>
          <div className="flex gap-5"><Link href="/cookie-privacy-policy" className="hover:text-black transition-colors">Privacy</Link><Link href="/admin" className="hover:text-black transition-colors">Admin</Link></div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return <div><p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/35">{title}</p><nav className="mt-4 flex flex-col items-start gap-2.5" aria-label={title}>{links.map(([label, href]) => <Link key={href} href={href} className="text-xs font-medium text-black/65 transition hover:text-blue-600">{label}</Link>)}</nav></div>;
}
