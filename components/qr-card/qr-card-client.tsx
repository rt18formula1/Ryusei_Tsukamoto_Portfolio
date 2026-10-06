"use client";

import Link from "next/link";
import QRCode from "react-qr-code";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

const cardUrl = "https://ryusei-tsukamoto-portfolio.vercel.app/links";

export function QrCardClient() {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="min-h-screen bg-[#f4f4f1] px-4 py-8 text-black sm:px-8 sm:py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/50 hover:text-black"><ArrowLeft size={14} /> Back to Map</Link>
        <section className="overflow-hidden rounded-[2rem] bg-black p-7 text-white shadow-2xl sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/45">Portfolio QR Card</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight">Ryusei Tsukamoto</h1>
              <p className="mt-2 text-sm text-white/60">Creator / Developer</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-black">RT</div>
          </div>
          <div className="mt-8 rounded-3xl bg-white p-5">
            <QRCode value={cardUrl} size={260} style={{ height: "auto", maxWidth: "100%", width: "100%" }} bgColor="#ffffff" fgColor="#000000" />
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-white/60">Scan to open profile, projects, activity history, and links.</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={copyUrl} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-white/80"><Copy size={14} /> {copied ? "Copied" : "Copy URL"}</button>
            <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-3 text-xs font-black uppercase tracking-widest transition hover:bg-white/10"><ExternalLink size={14} /> Open</a>
          </div>
        </section>
        <p className="mt-6 text-center text-xs leading-5 text-black/50">Apple Walletの正式なパス（.pkpass）はApple Developer証明書で署名する必要があります。証明書設定後、このQRカードをWalletパスへ拡張できます。</p>
      </div>
    </main>
  );
}
