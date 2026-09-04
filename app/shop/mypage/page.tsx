"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  awaiting_payment: "bg-orange-100 text-orange-700",
  paid: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
  requested: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  quoted: "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  agreement_sent: "bg-orange-100 text-orange-700",
  agreed: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  checking: "bg-yellow-100 text-yellow-700",
  completed: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, { ja: string; en: string }> = {
  pending: { ja: "未処理", en: "Pending" },
  awaiting_payment: { ja: "決済待ち", en: "Awaiting Payment" },
  paid: { ja: "決済済", en: "Paid" },
  processing: { ja: "処理中", en: "Processing" },
  shipped: { ja: "発送済", en: "Shipped" },
  delivered: { ja: "配送完了", en: "Delivered" },
  cancelled: { ja: "キャンセル", en: "Cancelled" },
  requested: { ja: "依頼済", en: "Requested" },
  reviewing: { ja: "審査中", en: "Reviewing" },
  quoted: { ja: "見積もり済", en: "Quoted" },
  approved: { ja: "承認済", en: "Approved" },
  agreement_sent: { ja: "契約送付済", en: "Agreement Sent" },
  agreed: { ja: "契約完了", en: "Agreed" },
  in_progress: { ja: "制作中", en: "In Progress" },
  checking: { ja: "確認中", en: "Checking" },
  completed: { ja: "完了", en: "Completed" },
};

const t = {
  ja: {
    title: "マイページ",
    backToShop: "ショップに戻る",
    loading: "読み込み中...",
    tabs: {
      orders: "注文履歴",
      commissions: "コミッション",
      profile: "プロフィール",
    },
    orders: {
      empty: "注文履歴がありません",
      goShop: "ショップで呆品を見る",
      items: "商品",
      total: "合計",
      digital: "デジタル商品",
      code: "コード",
      copy: "コピー",
      copied: "コピーしました",
      url: "URLを開く",
    },
    commissions: {
      empty: "コミッションの依頼がありません",
      request: "イラストを依頼する",
      detail: "依頼内容",
      budget: "予算",
      yen: "円",
      noBudget: "未指定",
      requestedAt: "依頼日",
    },
    profile: {
      email: "メールアドレス",
      displayId: "ユーザーID",
      displayName: "表示名",
      lastName: "姓",
      firstName: "名",
      postalCode: "郵便番号",
      prefecture: "都道府県",
      city: "市区町村",
      address1: "住所（1）",
      address2: "住所（2）",
      country: "国",
      edit: "編集",
      save: "保存",
      saving: "保存中...",
      cancel: "キャンセル",
      search: "検索",
      optional: "任意",
      logout: "ログアウト",
      loggingOut: "ログアウト中...",
      address2Note: "任意",
      userIdNote: "尊称・ハンドル名（@なし）",
    },
  },
  en: {
    title: "My Page",
    backToShop: "Back to Shop",
    loading: "Loading...",
    tabs: {
      orders: "Order History",
      commissions: "Commissions",
      profile: "Profile",
    },
    orders: {
      empty: "No order history",
      goShop: "Browse the Shop",
      items: "Items",
      total: "Total",
      digital: "Digital Product",
      code: "Code",
      copy: "Copy",
      copied: "Copied!",
      url: "Open URL",
    },
    commissions: {
      empty: "No commission requests",
      request: "Request an Illustration",
      detail: "Request Details",
      budget: "Budget",
      yen: "JPY",
      noBudget: "Not specified",
      requestedAt: "Requested",
    },
    profile: {
      email: "Email",
      displayId: "User ID",
      displayName: "Display Name",
      lastName: "Last Name",
      firstName: "First Name",
      postalCode: "Postal Code",
      prefecture: "Prefecture",
      city: "City / Town",
      address1: "Address Line 1",
      address2: "Address Line 2",
      country: "Country",
      edit: "Edit",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      search: "Search",
      optional: "optional",
      logout: "Log Out",
      loggingOut: "Logging out...",
      address2Note: "optional",
      userIdNote: "Handle / username (without @)",
    },
  },
};

const countries = ["Japan","United States","United Kingdom","Australia","Canada","France","Germany","Italy","Spain","Netherlands","Belgium","Singapore","China","South Korea","Taiwan","Hong Kong","Other"];

export default function MyPage() {
  const router = useRouter();
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [activateCodes, setActivateCodes] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "commissions" | "profile">("orders");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [editForm, setEditForm] = useState({
    display_id: "", display_name: "",
    last_name: "", first_name: "",
    postal_code: "", prefecture: "", city: "",
    address_line1: "", address_line2: "", country: "Japan",
  });
  const [postalLoading, setPostalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!supabase) { router.push("/shop/auth/login"); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/shop/auth/login"); return; }
      setUser(user);
      const [{ data: prof }, { data: ords }, { data: comms }, { data: codes }] = await Promise.all([
        supabase.from("user_profiles").select("*").eq("id", user.id).single(),
        supabase.from("orders").select("*, order_items(*, products(name_ja, name_en, type, image_url, digital_contents(delivery_type, content)))").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("commissions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("activate_codes").select("product_id, code").eq("used_by", user.id).order("used_at", { ascending: false }),
      ]);
      if (prof) {
        setProfile(prof);
        setEditForm({
          display_id: prof.display_id || "",
          display_name: prof.display_name || "",
          last_name: prof.last_name || "",
          first_name: prof.first_name || "",
          postal_code: prof.postal_code || "",
          prefecture: prof.prefecture || "",
          city: prof.city || "",
          address_line1: prof.address_line1 || "",
          address_line2: prof.address_line2 || "",
          country: prof.country || "Japan",
        });
      }
      if (ords) setOrders(ords);
      if (comms) setCommissions(comms);
      if (codes) {
        setActivateCodes(codes.reduce((acc: Record<string, string[]>, code: any) => {
          acc[code.product_id] = [...(acc[code.product_id] || []), code.code];
          return acc;
        }, {}));
      }
      setLoading(false);
    };
    load();
  }, []);

  const c = t[lang];

  const fetchAddress = async () => {
    if (editForm.postal_code.length < 7) return;
    setPostalLoading(true);
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${editForm.postal_code}`);
      const data = await res.json();
      if (data.results?.[0]) {
        setEditForm(f => ({ ...f, prefecture: data.results[0].address1, city: data.results[0].address2 + data.results[0].address3 }));
      }
    } catch {}
    setPostalLoading(false);
  };

  const handleSave = async () => {
    if (!supabase || !user) return;
    setSaving(true);
    setEditError("");
    const { error } = await supabase.from("user_profiles").update(editForm).eq("id", user.id);
    if (error) { setEditError(error.message); setSaving(false); }
    else { setProfile({ ...profile, ...editForm }); setEditing(false); setSaving(false); }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/shop");
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const LangToggle = () => (
    <button onClick={() => setLang(lang === "ja" ? "en" : "ja")}
      className="text-[10px] font-black uppercase tracking-widest border border-black/20 rounded-full px-3 py-1 hover:bg-black hover:text-white transition-all">
      {lang === "ja" ? "English" : "日本語"}
    </button>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/shop" className="text-sm text-gray-400 hover:text-black transition-colors block mb-2">{c.backToShop}</Link>
          <h1 className="text-3xl font-black tracking-tighter">{c.title}</h1>
        </div>
        <LangToggle />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1">
        {(["orders", "commissions", "profile"] as const).map((tabKey) => (
          <button key={tabKey} onClick={() => setTab(tabKey)}
            className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${tab === tabKey ? "bg-white shadow-sm text-black" : "text-gray-400 hover:text-gray-600"}`}>
            {c.tabs[tabKey]}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm mb-4">{c.orders.empty}</p>
              <Link href="/shop" className="inline-block bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors">{c.orders.goShop}</Link>
            </div>
          ) : orders.map((order) => (
            <div key={order.id} className="border border-black/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold">{new Date(order.created_at).toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US")}</p>
                  <p className="text-xs text-gray-300 font-mono mt-0.5">{order.id.slice(0, 8)}...</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[order.status]?.[lang] || order.status}
                </span>
              </div>
              <div className="space-y-3 mb-4">
                {order.order_items?.map((item: any) => {
                  const name = lang === "ja" ? (item.products?.name_ja || item.products?.name_en) : (item.products?.name_en || item.products?.name_ja);
                  const isDigital = item.products?.type === "digital";
                  const codes = activateCodes[item.product_id] || [];
                  const dlContent = item.products?.digital_contents?.[0];
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      {item.products?.image_url && (
                        <img src={item.products.image_url} alt={name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{name}</p>
                        <p className="text-xs text-gray-400">x{item.quantity} &nbsp; &yen;{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                        {isDigital && order.status === "paid" && (
                          <div className="mt-2 space-y-1">
                            {codes.length > 0 && codes.map((code, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{c.orders.code}</span>
                                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{code}</code>
                                <button onClick={() => copyToClipboard(code, `${item.id}-${i}`)}
                                  className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors">
                                  {copiedId === `${item.id}-${i}` ? c.orders.copied : c.orders.copy}
                                </button>
                              </div>
                            ))}
                            {dlContent?.delivery_type === "url" && dlContent.content && (
                              <a href={dlContent.content} target="_blank" rel="noopener noreferrer"
                                className="inline-block text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
                                {c.orders.url} &rarr;
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-3 border-t border-black/5 flex justify-end">
                <p className="text-sm font-black">{c.orders.total}: &yen;{order.total_amount?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Commissions Tab */}
      {tab === "commissions" && (
        <div className="space-y-6">
          <Link href="/shop/commission" className="inline-flex items-center gap-2 text-sm font-bold hover:underline">
            {c.commissions.request} &rarr;
          </Link>
          {commissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">{c.commissions.empty}</p>
            </div>
          ) : commissions.map((comm) => (
            <div key={comm.id} className="border border-black/10 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-400 font-bold">{new Date(comm.created_at).toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US")}</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[comm.status] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[comm.status]?.[lang] || comm.status}
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{c.commissions.detail}</p>
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{comm.detail}</p>
              {comm.budget && (
                <p className="text-xs text-gray-400">
                  {c.commissions.budget}: &yen;{comm.budget.toLocaleString()} {c.commissions.yen}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="space-y-6">
          {/* Email */}
          <div className="border border-black/10 rounded-2xl p-6">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{c.profile.email}</p>
            <p className="text-sm font-bold">{user?.email}</p>
          </div>

          {/* Profile info */}
          <div className="border border-black/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
                {c.tabs.profile}
              </h2>
              {!editing && (
                <button onClick={() => setEditing(true)}
                  className="text-xs font-black uppercase tracking-widest border border-black/20 rounded-full px-3 py-1 hover:bg-black hover:text-white transition-all">
                  {c.profile.edit}
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.lastName}</label>
                    <input value={editForm.last_name} onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))}
                      className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.firstName}</label>
                    <input value={editForm.first_name} onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))}
                      className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.displayId}</label>
                  <div className="flex items-center border border-black/20 rounded-xl overflow-hidden focus-within:border-black">
                    <span className="px-3 text-gray-400 text-sm">@</span>
                    <input value={editForm.display_id} onChange={e => setEditForm(f => ({ ...f, display_id: e.target.value.replace(/[^a-zA-Z0-9_]/g, "") }))}
                      className="flex-1 px-2 py-3 text-sm focus:outline-none" placeholder="rt18fan" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.profile.userIdNote}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.displayName} <span className="normal-case font-normal">({c.profile.optional})</span></label>
                  <input value={editForm.display_name} onChange={e => setEditForm(f => ({ ...f, display_name: e.target.value }))}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.postalCode}</label>
                  <div className="flex gap-2">
                    <input value={editForm.postal_code} onChange={e => setEditForm(f => ({ ...f, postal_code: e.target.value.replace(/[^0-9]/g, "").slice(0, 7) }))}
                      className="flex-1 border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" maxLength={7} placeholder="1234567" />
                    <button onClick={fetchAddress} disabled={editForm.postal_code.length < 7 || postalLoading}
                      className="px-4 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
                      {postalLoading ? "..." : c.profile.search}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.prefecture}</label>
                    <input value={editForm.prefecture} onChange={e => setEditForm(f => ({ ...f, prefecture: e.target.value }))}
                      className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.city}</label>
                    <input value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.address1}</label>
                  <input value={editForm.address_line1} onChange={e => setEditForm(f => ({ ...f, address_line1: e.target.value }))}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.address2} <span className="normal-case font-normal">({c.profile.address2Note})</span></label>
                  <input value={editForm.address_line2} onChange={e => setEditForm(f => ({ ...f, address_line2: e.target.value }))}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{c.profile.country}</label>
                  <select value={editForm.country} onChange={e => setEditForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full border border-black/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black bg-white">
                    {countries.map(co => <option key={co} value={co}>{co}</option>)}
                  </select>
                </div>
                {editError && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{editError}</div>}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setEditing(false); setEditError(""); }}
                    className="flex-1 border border-black/20 rounded-xl py-3 text-sm font-bold hover:border-black transition-colors">
                    {c.profile.cancel}
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 bg-black text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-50">
                    {saving ? c.profile.saving : c.profile.save}
                  </button>
                </div>
              </div>
            ) : (
              <dl className="space-y-4">
                {[
                  [c.profile.displayId, profile?.display_id ? `@${profile.display_id}` : "—"],
                  [c.profile.displayName, profile?.display_name || "—"],
                  [c.profile.lastName, profile?.last_name || "—"],
                  [c.profile.firstName, profile?.first_name || "—"],
                  [c.profile.postalCode, profile?.postal_code || "—"],
                  [c.profile.prefecture, profile?.prefecture || "—"],
                  [c.profile.city, profile?.city || "—"],
                  [c.profile.address1, profile?.address_line1 || "—"],
                  [c.profile.address2, profile?.address_line2 || "—"],
                  [c.profile.country, profile?.country || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <dt className="text-xs font-bold uppercase tracking-widest text-gray-400 w-28 shrink-0 pt-0.5">{label}</dt>
                    <dd className="text-sm font-medium text-gray-700 break-all">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Logout */}
          <div className="pt-2">
            <button onClick={handleLogout} disabled={loggingOut}
              className="w-full border border-red-200 text-red-500 rounded-xl py-3 text-sm font-bold hover:bs-red-50 transition-colors disabled:opacity-50">
              {loggingOut ? c.profile.loggingOut : c.profile.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
