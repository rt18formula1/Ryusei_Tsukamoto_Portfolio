"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminAuthGate } from "@/components/admin/admin-auth-gate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sessionOk, setSessionOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setSessionOk(Boolean(data.ok));
        setChecking(false);
      })
      .catch(() => {
        setSessionOk(false);
        setChecking(false);
      });
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-sm font-bold text-gray-400 animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!sessionOk) {
    return <AdminAuthGate onAuthenticated={() => setSessionOk(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-white text-black">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
