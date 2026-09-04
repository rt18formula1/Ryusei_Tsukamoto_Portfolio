"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const t = {
  ja: {
    back: "ショップに戻る",
    title: "イラストコミッション",
    subtitle: "F1オリジナルイラストのオーダーメイド",
    howTitle: "流れ",
    steps: ["依頼","確認","見積もり","承認","契約","制作","確認","決済","納品"],
    loginPrompt: "コミッションの依頼にはログインが必要です。",
    loginBtn: "ログインして依頼する",
    detailLabel: "依頼内容 *",
    detailPlaceholder: "ドライバー・レース・スタイルなど、希望のイラストをご記入ください",
    budgetLabel: "予算（円）",
    budgetNote: "任意",
    budgetPlaceholder: "例: 5000",
    submit: "依頼を送信する",
    submitting: "送信中...",
    successTitle: "依頼を受け付けました！",
    successBody: "内容を確認のうえ、数日以内にご連絡いたします。",
    mypage: "マイページを見る",
    backToShop: "ショップに戻る",
    newRequest: "新しく依頼する",
  },
  en: {
    back: "Back to Shop",
    title: "Illustration Commission",
    subtitle: "Custom F1 illustrations made to order",
    howTitle: "How it works",
    steps: ["Request","Review","Quote","Approve","Agreement","Produce","Check","Payment","Delivery"],
    loginPrompt: "Please log in to submit a commission request.",
    loginBtn: "Login to Continue",
    detailLabel: "Request Details *",
    detailPlaceholder: "Describe your request: driver, race, style, etc.",
    budgetLabel: "Budget (JPY)",
    budgetNote: "optional",
    budgetPlaceholder: "e.g. 5000",
    submit: "Submit Request",
    submitting: "Submitting...",
    successTitle: "Request Submitted!",
    successBody: "Thank you for your commission request. We will review it and get back to you within a few days.",
    mypage: "View My Page",
    backToShop: "Back to Shop",
    newRequest: "Submit another request",
  },
};

export default function CommissionPage() {
  const router = useRouter();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const c = t[lang];

  const handleSubmit = async () => {
    if (!supabase) return;
    if (!user) { router.push("/shop/auth/login"); return; }
    if (!detail.trim()) { setError(lang === "ja" ? "依頼内容を入力してください" : "Please describe your request"); return; }
    setSubmitting(true);
    setError("");
    const { error: dbError } = await supabase.from("commissions").insert({
      user_id: user.id,
      detail: detail.trim(),
      budget: budget ? parseInt(budget) : null,
      status: "requested",
    });
    if (dbError) { setError(dbError.message); setSubmitting(false); }
    else setSubmitted(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-black mb-4">{c.successTitle}</h1>
        <p className="text-gray-500 text-sm mb-8">{c.successBody}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/shop/mypage" className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors">{c.mypage}</Link>
          <Link href="/shop" className="px-6 py-3 border border-black rounded-xl text-sm font-bold hover:bg-black hover:text-white transition-colors">{c.backToShop}</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-2">
        <Link href="/shop" className="text-sm text-gray-400 hover:text-black transition-colors">{c.back}</Link>
        <button onClick={() => setLang(lang === "ja" ? "en" : "ja")}
          className="text-[10px] font-black uppercase tracking-widest border border-black/20 rounded-full px-3 py-1 hover:bg-black hover:text-white transition-all">
          {lang === "ja" ? "English" : "日本語"}
        </button>
      </div>
      <div className="mb-10 mt-4">
        <h1 className="text-3xl font-black tracking-tighter mb-2">{c.title}</h1>
        <p className="text-gray-500 text-sm">{c.subtitle}</p>
      </div>
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h2 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">{c.howTitle}</h2>
        <div className="flex flex-wrap gap-2">
          {c.steps.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300 text-xs">&#8594;</span>}
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${i === 0 ? "bg-black text-white" : "bg-white border border-black/10 text-gray-500"}`}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      {!user ? (
        <div className="border border-black/10 rounded-2xl p-8 text-center">
          <p className="text-gray-600 mb-4 text-sm">{c.loginPrompt}</p>
          <Link href="/shop/auth/login" className="inline-block bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors">{c.loginBtn}</Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{c.detailLabel}</label>
            <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={6}
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black resize-none"
              placeholder={c.detailPlaceholder} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              {c.budgetLabel} <span className="normal-case font-normal text-gray-400">- {c.budgetNote}</span>
            </label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
              placeholder={c.budgetPlaceholder} />
          </div>
          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
          <button onClick={handleSubmit} disabled={submitting || !detail.trim()}
            className="w-full bg-black text-white rounded-xl py-4 font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
            {submitting ? c.submitting : c.submit}
          </button>
        </div>
      )}
    </div>
  );
}
