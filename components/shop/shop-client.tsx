"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "./cart-context";

type Product = {
  id: string;
  name_ja: string;
  name_en: string;
  type: "digital" | "physical" | "skill";
  price: number;
  status: "on_sale" | "sold_out" | "draft";
  image_url: string | null;
  sort_order: number;
};

const TYPE_COLORS: Record<string, string> = {
  digital: "bg-blue-100 text-blue-700",
  physical: "bg-green-100 text-green-700",
  skill: "bg-purple-100 text-purple-700",
};

const TYPE_LABELS: Record<string, string> = {
  digital: "Digital",
  physical: "Goods",
  skill: "Skill",
};

import type { User } from "@supabase/supabase-js";

export function ShopClient() {
  const { totalCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { language: lang } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => setUser(data.user || null));
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supabase) { setLoading(false); return; }
      try {
        let req = supabase.from("products").select("*").eq("status", "on_sale");
        if (filter !== "all") {
          req = req.eq("type", filter);
        }
        const { data, error } = await req.order("sort_order", { ascending: true });
        if (!error && data) setProducts(data as Product[]);
      } catch (err) {
        console.warn("Failed to fetch shop products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filter]);

  const filters = [
    { value: "all", label: "All", icon: "◎" },
    { value: "digital", label: "Digital", icon: "⚡" },
    { value: "physical", label: "Goods", icon: "📦" },
    { value: "skill", label: "Skill", icon: "🎨" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-1">Shop</h1>
          <p className="text-gray-400 text-sm">Digital contents, goods &amp; commissions</p>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/shop/mypage"
              className="flex items-center gap-1.5 px-3 py-2 border border-black/20 rounded-xl text-sm font-bold hover:border-black hover:bg-black hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Page
            </Link>
          ) : (
            <Link href="/shop/auth/login"
              className="px-3 py-2 border border-black/20 rounded-xl text-sm font-bold hover:border-black transition-all">
              Login
            </Link>
          )}
          <Link href="/shop/cart"
            className="relative flex items-center gap-1.5 px-3 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {mounted && totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Commission Banner */}
      <Link href="/shop/commission"
        className="flex items-center justify-between mb-8 bg-black text-white rounded-2xl px-6 py-4 hover:bg-gray-900 transition-colors group">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Illustration Commission</p>
          <h2 className="text-base font-black">Order Original Illustration →</h2>
        </div>
        <span className="text-2xl group-hover:translate-x-1 transition-transform">🏎️</span>
      </Link>

      {/* Filters */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
              filter === f.value
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-black border-black/15 hover:border-black/40"
            }`}>
            <span className="text-base leading-none">{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 rounded-2xl aspect-square mb-3" />
              <div className="bg-gray-100 h-4 rounded mb-2" />
              <div className="bg-gray-100 h-3 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-4xl mb-4">🏁</p>
          <p className="font-bold text-lg mb-2">Coming soon</p>
          <p className="text-sm">Products will be available soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} className="group">
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-3 border border-black/5">
                {product.image_url ? (
                  <img src={product.image_url} alt={lang === "ja" ? product.name_ja : product.name_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs font-black">
                    {(product.type || "item").toUpperCase()}
                  </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[product.type] || "bg-gray-100 text-gray-700"}`}>
                  {TYPE_LABELS[product.type] || product.type}
                </span>
                {product.status === "sold_out" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-black text-xs tracking-widest">SOLD OUT</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm leading-tight mb-1 group-hover:underline line-clamp-2">
                {lang === "ja" ? product.name_ja : product.name_en}
              </h3>
              <p className="font-black text-sm">&yen;{product.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-black/10 text-center">
        <p className="text-sm text-gray-500 mb-3">Feel free to contact us with any questions</p>
        <Link href="/shop/inquiry"
          className="inline-block px-6 py-3 border border-black rounded-full text-sm font-bold hover:bg-black hover:text-white transition-colors">
          Contact
        </Link>
      </div>
    </div>
  );
}
