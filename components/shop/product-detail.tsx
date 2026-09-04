"use client";
import { useState, useEffect } from "react";
import { useCart } from "./cart-context";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

type Product = {
  id: string;
  name_ja: string;
  name_en: string;
  description_ja: string;
  description_en: string;
  type: "digital" | "physical" | "skill";
  price: number;
  stock: number | null;
  status: "on_sale" | "sold_out" | "draft";
  image_url: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  digital: "Digital Content",
  physical: "Physical Good",
  skill: "Skill / Commission",
};

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const { language: lang, setLanguage } = useLanguage();

  useEffect(() => {
  }, []);

  const inCart = items.some(i => i.id === product.id);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const name = lang === "ja" ? product.name_ja : product.name_en;
  const description = lang === "ja" ? product.description_ja : product.description_en;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-black font-medium truncate max-w-[200px]">{name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Image */}
        <div className="flex-1">
          <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-black/5 shadow-sm">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-4xl">
                {(product.type || "item").toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-[400px] flex flex-col">
          {/* Type badge + lang toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block px-3 py-1 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500">
              {TYPE_LABELS[product.type || "digital"]}
            </span>
            <button
              onClick={() => {
                const next = lang === "ja" ? "en" : "ja";
                setLanguage(next);
              }}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black border border-black/10 rounded-full px-3 py-1 transition-colors"
            >
              {lang === "ja" ? "EN" : "JA"}
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tighter leading-tight mb-3">
              {name}
            </h1>
            <p className="text-2xl font-black">
              &yen;{product.price.toLocaleString()}
            </p>
            {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs font-bold text-orange-500 mt-2">
                残り{product.stock}点
              </p>
            )}
          </div>

          <div className="prose prose-sm mb-10 text-gray-600 leading-relaxed">
            {description ? (
              <p className="whitespace-pre-wrap">{description}</p>
            ) : (
              <p className="italic text-gray-400">No description available.</p>
            )}
          </div>

          <div className="mt-auto space-y-3">
            {product.status === "on_sale" ? (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  {added ? "✓ Added to Cart" : inCart ? "Add More to Cart" : "Add to Cart"}
                </button>
                {inCart && (
                  <Link
                    href="/shop/cart"
                    className="w-full flex items-center justify-center gap-2 py-4 border border-black rounded-2xl font-black text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Go to Cart
                  </Link>
                )}
              </>
            ) : (
              <button
                disabled
                className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-sm cursor-not-allowed"
              >
                {product.status === "sold_out" ? "Sold Out" : "Coming Soon"}
              </button>
            )}
            <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
              Secure Checkout with Stripe
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-black/5">
        <div className="p-6 bg-gray-50 rounded-2xl">
          <div className="text-2xl mb-3">🚚</div>
          <h3 className="font-bold text-sm mb-2 uppercase tracking-tight">Worldwide Shipping</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Fast and tracked shipping available for all physical goods.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl">
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="font-bold text-sm mb-2 uppercase tracking-tight">Instant Digital Access</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Digital content is delivered immediately after checkout.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-2xl">
          <div className="text-2xl mb-3">🛡️</div>
          <h3 className="font-bold text-sm mb-2 uppercase tracking-tight">Secure Payment</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            All transactions are handled securely by Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
