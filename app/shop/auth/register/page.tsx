"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Step = "account" | "profile" | "address" | "agree" | "done";

const t = {
  ja: {
    alreadyHave: "アカウントはこちらからログイン",
    title: "アカウント作成",
    steps: {
      account: "アカウント情報",
      profile: "プロフィール",
      address: "住所",
      agree: "利用規約",
    },
    email: "メールアドレス",
    password: "パスワード",
    passwordNote: "8文字以上",
    passwordConfirm: "パスワード（確認）",
    passwordConfirmNote: "確認入力",
    next: "次へ",
    back: "戻る",
    lastName: "姓",
    firstName: "名",
    userId: "ユーザヾID",
    userIdNote: "任意。未入力の場合は自動発行。後から変更可能。",
    postalCode: "郵便番号",
    prefecture: "都道府県",
    city: "市区町村",
    address1: "住所（1）",
    address2: "住所（2）",
    address2Note: "任意",
    country: "国",
    search: "検索",
    skip: "スキップ（デジタルonly）",
    privacyTitle: "プライバシーポリシー / 利用規約",
    privacyBody: [
      "当サイトは注文処理・商品配送の目的で、お名前・メールアドレス・住所などの個人情報を取扱います。",
      "個人情報は注文履行に必要な範囲を除き、第三者に提供しません。",
      "データは安全に保管され、お問い合わせにより削除を請求できます。",
      "アカウント作成で、注文確認・発送通知メールの受信に同意したことになります。",
      "返品・返金は商品の缕疵・説明郸異の場合に限り対応します。",
      "デジタル商品はコンテンツ配信後の返金はできません。",
      "物理商品は到着後7日以内に問題があればご連絡ください。",
    ],
    agreeCheck: "プライバシーポリシー・利用規約を読み、同意します。",
    createAccount: "アカウント作成",
    creating: "作成中...",
    doneTitle: "メールをご確認ください",
    doneBody1: "に確認リンクを送信しました。リンクをクリックしてアカウントを有効化してください。",
    backToShop: "ショップに戻る",
    errMismatch: "パスワードが一致しません",
    errShort: "パスワードは8文字以上です",
    errDuplicate: "このメールアドレスは登録済みです。ログインしてください。",
    prefixAt: "@",
  },
  en: {
    alreadyHave: "Already have an account? Sign in",
    title: "Create Account",
    steps: {
      account: "Account Info",
      profile: "Profile",
      address: "Address",
      agree: "Privacy Policy",
    },
    email: "Email",
    password: "Password",
    passwordNote: "8+ characters",
    passwordConfirm: "Confirm Password",
    passwordConfirmNote: "confirm password",
    next: "Next",
    back: "Back",
    lastName: "Last Name",
    firstName: "First Name",
    userId: "User ID",
    userIdNote: "Optional. An anonymous ID will be assigned if left blank. Can be changed later.",
    postalCode: "Postal Code",
    prefecture: "Prefecture",
    city: "City / Town",
    address1: "Address Line 1",
    address2: "Address Line 2",
    address2Note: "optional",
    country: "Country",
    search: "Search",
    skip: "Skip (Digital only)",
    privacyTitle: "Privacy Policy / Terms of Service",
    privacyBody: [
      "This shop collects your personal information (name, email, address) for the purpose of processing orders and delivering products.",
      "Your information will not be shared with third parties except as necessary to fulfill your order.",
      "Your data is stored securely and you may request deletion at any time by contacting us.",
      "By creating an account, you agree to receive order confirmation and shipping notification emails.",
      "All purchases are final unless the product is defective or not as described.",
      "For digital products, refunds are not available after the content has been delivered.",
      "For physical products, please contact us within 7 days of receipt if there is an issue.",
    ],
    agreeCheck: "I have read and agree to the Privacy Policy and Terms of Service.",
    createAccount: "Create Account",
    creating: "Creating account...",
    doneTitle: "Check your email",
    doneBody1: "We sent a confirmation link to",
    backToShop: "Back to Shop",
    errMismatch: "Passwords do not match",
    errShort: "Password must be at least 8 characters",
    errDuplicate: "This email is already registered. Please sign in instead.",
    prefixAt: "@",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [step, setStep] = useState<Step>("account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [displayId, setDisplayId] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalLoading, setPostalLoading] = useState(false);
  const [country, setCountry] = useState("Japan");
  const [agreed, setAgreed] = useState(false);

  const c = t[lang];

  const fetchAddress = async () => {
    if (postalCode.length < 7) return;
    setPostalLoading(true);
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`);
      const data = await res.json();
      if (data.results?.[0]) {
        setPrefecture(data.results[0].address1);
        setCity(data.results[0].address2 + data.results[0].address3);
      }
    } catch {}
    setPostalLoading(false);
  };

  const handleRegister = async () => {
    if (!supabase || !agreed) return;
    setLoading(true);
    setError("");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/shop/auth/callback` },
    });
    if (signUpError) {
      const msg = signUpError.message;
      setError(msg.includes("already registered") || msg.includes("already been registered") || msg.includes("User already registered")
        ? c.errDuplicate : msg);
      setLoading(false); return;
    }
    if (data.user) {
      const finalDisplayId = displayId || `anon_${Math.random().toString(36).slice(2, 8)}`;
      await supabase.from("user_profiles").insert({
        id: data.user.id, display_id: finalDisplayId,
        last_name: lastName, first_name: firstName,
        postal_code: postalCode, prefecture, city,
        address_line1: addressLine1, address_line2: addressLine2, country,
        agreed_at: new Date().toISOString(),
      });
    }
    setStep("done");
    setLoading(false);
  };

  const LangToggle = () => (
    <button onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      className="text-[10px] font-black uppercase tracking-widest border border-black/20 rounded-full px-3 py-1 hover:bg-black hover:text-white transition-all">
      {lang === "ja" ? "English" : "日本語"}
    </button>
  );

  if (step === "done") return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">&#10003;</div>
        <h1 className="text-2xl font-black mb-4">{c.doneTitle}</h1>
        <p className="text-gray-500 text-sm mb-8">
          {lang === "ja" ? <><strong>{email}</strong> {c.doneBody1}</> : <>{c.doneBody1} <strong>{email}</strong>. Please click the link to verify your account.</>}
        </p>
        <Link href="/shop" className="inline-block px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors">{c.backToShop}</Link>
      </div>
    </div>
  );

  const stepList: Step[] = ["account", "profile", "address", "agree"];
  const countries = ["Japan","United States","United Kingdom","Australia","Canada","France","Germany","Italy","Spain","Netherlands","Belgium","Singapore","China","South Korea","Taiwan","Hong Kong","Other"];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-between mb-6">
            <Link href="/shop/auth/login" className="text-sm text-gray-400 hover:text-black transition-colors">{c.alreadyHave}</Link>
            <LangToggle />
          </div>
          <h1 className="text-3xl font-black tracking-tighter">{c.title}</h1>
          <div className="flex items-center justify-center gap-2 mt-6">
            {stepList.map((s, i) => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${step === s ? "w-8 bg-black" : stepList.indexOf(step) > i ? "w-4 bg-black/30" : "w-4 bg-black/10"}`} />
            ))}
          </div>
        </div>

        {step === "account" && (
          <div className="space-y-4">
            <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500">{c.steps.account}</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.email} *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.password} *</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder={c.passwordNote} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.passwordConfirm} *</label>
              <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder={c.passwordConfirmNote} />
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
            <button onClick={() => {
              if (password !== passwordConfirm) { setError(c.errMismatch); return; }
              if (password.length < 8) { setError(c.errShort); return; }
              setError(""); setStep("profile");
            }} disabled={!email || !password || !passwordConfirm}
              className="w-full bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">{c.next}</button>
          </div>
        )}

        {step === "profile" && (
          <div className="space-y-4">
            <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500">{c.steps.profile}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.lastName} *</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder={lang === "ja" ? "山田" : "Yamada"} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.firstName} *</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder={lang === "ja" ? "太郎" : "Taro"} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.userId} <span className="normal-case font-normal text-gray-400">({lang === "ja" ? "任意" : "optional"})</span></label>
              <div className="flex items-center border border-black/20 rounded-xl overflow-hidden focus-within:border-black">
                <span className="px-3 text-gray-400 text-sm">{c.prefixAt}</span>
                <input type="text" value={displayId} onChange={(e) => setDisplayId(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                  className="flex-1 px-2 py-3 text-sm focus:outline-none" placeholder="rt18fan" />
              </div>
              <p className="text-xs text-gray-400 mt-1">{c.userIdNote}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep("account")} className="flex-1 border border-black/20 rounded-xl py-3 text-sm font-bold hover:border-black transition-colors">{c.back}</button>
              <button onClick={() => setStep("address")} disabled={!lastName || !firstName}
                className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">{c.next}</button>
            </div>
          </div>
        )}

        {step === "address" && (
          <div className="space-y-4">
            <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500">{c.steps.address}</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.postalCode} *</label>
              <div className="flex gap-2">
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 7))}
                  className="flex-1 border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="1234567" maxLength={7} />
                <button onClick={fetchAddress} disabled={postalCode.length < 7 || postalLoading}
                  className="px-4 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
                  {postalLoading ? "..." : c.search}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.prefecture} *</label>
              <input type="text" value={prefecture} onChange={(e) => setPrefecture(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="Tokyo" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.city} *</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="Shibuya-ku" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.address1} *</label>
              <input type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="1-2-3 Shinjuku" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.address2} <span className="normal-case font-normal text-gray-400">({c.address2Note})</span></label>
              <input type="text" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" placeholder="Room 101" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{c.country} *</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white">
                {countries.map((co) => <option key={co} value={co}>{co}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep("profile")} className="flex-1 border border-black/20 rounded-xl py-3 text-sm font-bold hover:border-black transition-colors">{c.back}</button>
              <button onClick={() => setStep("agree")}
                className="flex-1 border border-black/20 rounded-xl py-3 text-sm font-bold text-gray-400 hover:border-black hover:text-black transition-colors">
                {c.skip}
              </button>
              <button onClick={() => setStep("agree")} disabled={!postalCode || !prefecture || !city || !addressLine1}
                className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">{c.next}</button>
            </div>
          </div>
        )}

        {step === "agree" && (
          <div className="space-y-6">
            <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500">{c.steps.agree}</h2>
            <div className="border border-black/10 rounded-2xl p-5 h-48 overflow-y-auto text-xs text-gray-600 leading-relaxed space-y-3">
              <p className="font-bold text-black">{c.privacyTitle}</p>
              {c.privacyBody.map((line, i) => <p key={i}>{line}</p>)}
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 accent-black" />
              <span className="text-sm text-gray-700">{c.agreeCheck}</span>
            </label>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setStep("address")} className="flex-1 border border-black/20 rounded-xl py-3 text-sm font-bold hover:border-black transition-colors">{c.back}</button>
              <button onClick={handleRegister} disabled={!agreed || loading}
                className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
                {loading ? c.creating : c.createAccount}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
