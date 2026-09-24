"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-2xl font-black mb-1">Settings</h1>
      <p className="text-sm text-gray-400 mb-8">Admin settings & configuration</p>

      {/* Profile */}
      <div className="border border-black/10 rounded-xl p-5 bg-white mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Admin Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              defaultValue="Ryusei Tsukamoto"
              className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              defaultValue="admin@rt18.dev"
              className="w-full px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Portfolio Settings */}
      <div className="border border-black/10 rounded-xl p-5 bg-white mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Portfolio Display</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Show Empty Disciplines</p>
              <p className="text-xs text-gray-400">Display disciplines with no activities on the portfolio map</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Default View Mode</p>
              <p className="text-xs text-gray-400">Initial view when visiting the portfolio</p>
            </div>
            <select className="px-3 py-1.5 border border-black/10 rounded-lg text-sm font-bold">
              <option>Map</option>
              <option>List</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integrations Status */}
      <div className="border border-black/10 rounded-xl p-5 bg-white mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Integrations</h3>
        <div className="space-y-3">
          {[
            { name: "Supabase", env: "NEXT_PUBLIC_SUPABASE_URL" },
            { name: "Stripe", env: "STRIPE_SECRET_KEY" },
            { name: "Cloudflare R2", env: "R2_ACCOUNT_ID" },
            { name: "Resend", env: "RESEND_API_KEY" },
            { name: "OpenRouter", env: "OPENROUTER_API_KEY" },
          ].map((svc) => (
            <div key={svc.env} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
              <div>
                <p className="text-sm font-bold">{svc.name}</p>
                <p className="text-[10px] text-gray-400 font-mono">{svc.env}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                Not configured
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400">
          ※ シークレットは Base44 ダッシュボードの Secrets ページから設定してください
        </p>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-black/80 transition"
        >
          Save Changes
        </button>
        {saved && <span className="text-sm text-green-600 font-bold">✓ Saved</span>}
      </div>
    </div>
  );
}
