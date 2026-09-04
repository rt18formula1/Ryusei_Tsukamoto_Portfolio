"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const t = {
  ja: {
    back: "ショップに戻る",
    title: "ログイン",
    sub: "アカウントにサインイン",
    email: "メールアドレス",
    password: "パスワード",
    forgot: "忘れた場合",
    signIn: "サインイン",
    signingIn: "サインイン中...",
    noAccount: "アカウントがない場合は",
    createOne: "新規登録",
    resetTitle: "パスワードリセット",
    resetSub: "リセットリンクをメールで送信します",
    backToLogin: "ログインに戻る",
    resetSent: "リセットリンクを送信しました！",
    checkInbox: "に送信しました。メールボックスをご確認ください。",
    send: "送信する",
    sending: "送信中...",
    errCredentials: "メールアドレスまたはパスワードが違います。",
  },
  en: {
    back: "Back to Shop",
    title: "Login",
    sub: "Sign in to your account",
    email: "Email",
    password: "Password",
    forgot: "Forgot?",
    signIn: "Sign In",
    signingIn: "Signing in...",
    noAccount: "No account?",
    createOne: "Create one",
    resetTitle: "Reset Password",
    resetSub: "Enter your email to receive a reset link",
    backToLogin: "Back to Login",
    resetSent: "Reset link sent!",
    checkInbox: "Check your inbox.",
    send: "Send Reset Link",
    sending: "Sending...",
    errCredentials: "Incorrect email or password.",
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/shop";
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const c = t[lang];

  const handleLogin = async () => {
    if (!supabase || !email || !password) return;
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message.includes("Invalid login credentials") ? c.errCredentials : authError.message);
      setLoading(false);
    } else {
      router.push(next);
    }
  };

  const handleReset = async () => {
    if (!supabase || !resetEmail) return;
    setResetLoading(true);
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin + "/shop/auth/reset",
    });
    setResetSent(true);
    setResetLoading(false);
  };

  const LangToggle = () => (
    <button onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      className="text-[10px] font-black uppercase tracking-widest border border-black/20 rounded-full px-3 py-1 hover:bg-black hover:text-white transition-all">
      {lang === "ja" ? "English" : "日本語"}
    </button>
  );

  if (showReset) return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => { setShowReset(false); setResetSent(false); }}
            className="text-sm text-gray-400 hover:text-black transition-colors">
            ← {c.backToLogin}
          </button>
          <LangToggle />
        </div>
        <h1 className="text-3xl font-black tracking-tighter">{c.resetTitle}</h1>
        <p className="text-gray-500 text-sm mt-2">{c.resetSub}</p>
      </div>
      {resetSent ? (
        <div className="text-center p-8 bg-green-50 border border-green-100 rounded-2xl">
          <div className="text-3xl mb-3">✉️</div>
          <p className="font-bold text-green-800">{c.resetSent}</p>
          <p className="text-sm text-green-600 mt-1"><strong>{resetEmail}</strong> {c.checkInbox}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{c.email}</label>
            <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleReset()}
              className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black"
              placeholder="your@email.com" />
          </div>
          <button onClick={handleReset} disabled={resetLoading || !resetEmail}
            className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
            {resetLoading ? c.sending : c.send}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-between mb-6">
          <Link href="/shop" className="text-sm text-gray-400 hover:text-black transition-colors">
            ← {c.back}
          </Link>
          <LangToggle />
        </div>
        <h1 className="text-3xl font-black tracking-tighter">{c.title}</h1>
        <p className="text-gray-500 text-sm mt-2">{c.sub}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{c.email}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="your@email.com" autoComplete="email" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400">{c.password}</label>
            <button onClick={() => { setShowReset(true); setResetEmail(email); }}
              className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
              {c.forgot}
            </button>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
            placeholder="••••••••" autoComplete="current-password" />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-bold text-red-600">{error}</div>
        )}
        <button onClick={handleLogin} disabled={loading || !email || !password}
          className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-50 active:scale-[0.98]">
          {loading ? c.signingIn : c.signIn}
        </button>
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            {c.noAccount}{" "}
            <Link href="/shop/auth/register" className="font-bold text-black hover:underline">{c.createOne}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Suspense fallback={<div className="animate-pulse w-80 h-60 bg-gray-100 rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
