"use client";

import { useState } from "react";
import Link from "next/link";

export function AdminAuthGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.error ?? "ログインに失敗しました");
        return;
      }
      onAuthenticated();
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-black mb-1">Admin</h1>
        <p className="text-sm text-gray-400 mb-8">Portfolio Management</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-black/15 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && login()}
              className="w-full px-4 py-2.5 border border-black/15 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 font-bold">{error}</p>
          )}
          <button
            type="button"
            onClick={login}
            disabled={loading}
            className="w-full px-4 py-3 bg-black text-white font-bold rounded-lg hover:bg-black/80 transition disabled:opacity-40"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </div>

        <Link
          href="/"
          className="block mt-6 text-center text-sm text-gray-400 hover:text-black underline"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
