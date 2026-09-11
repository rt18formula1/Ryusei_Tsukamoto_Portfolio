"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export function SiteFooter() {
  const { language } = useLanguage();

  return (
    <footer className="bg-black text-white py-16 px-4 sm:px-6 border-t border-white/10">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              RYUSEI TSUKAMOTO
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Multi-Discipline Creator & Developer
            </p>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              {language === "ja"
                ? "開発、イラスト、音楽、執筆、投資リサーチなど、多様な領域のプロジェクトと知見を一元管理・発信する個人ポートフォリオ。"
                : "Personal portfolio consolidating projects and insights across software development, illustration, music, writing, and investment research."}
            </p>
          </div>

          {/* Disciplines */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Disciplines
            </h3>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <Link href="/#developer" className="hover:text-gray-300 transition-colors flex items-center justify-between">
                  <span>💻 Developer</span>
                  <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-black">Flagship</span>
                </Link>
              </li>
              <li>
                <Link href="/#illustrator" className="hover:text-gray-300 transition-colors">
                  🎨 Illustrator
                </Link>
              </li>
              <li>
                <Link href="/#musician" className="hover:text-gray-300 transition-colors">
                  🎵 Musician
                </Link>
              </li>
              <li>
                <Link href="/#blogger" className="hover:text-gray-300 transition-colors">
                  📝 Blogger
                </Link>
              </li>
              <li>
                <Link href="/#investor" className="hover:text-gray-300 transition-colors">
                  📈 Investor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-gray-400 font-medium">
              <li><Link href="/portfolio" className="hover:text-white transition-colors">All Portfolio</Link></li>
              <li><Link href="/#profile" className="hover:text-white transition-colors">Profile & Contact</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/cookie-privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-medium gap-4">
          <p>© {new Date().getFullYear()} Ryusei Tsukamoto. All rights reserved.</p>
          <p className="font-mono text-[10px] tracking-widest text-gray-600 uppercase">
            RYUSEI TSUKAMOTO PORTFOLIO SYSTEM
          </p>
        </div>
      </div>
    </footer>
  );
}