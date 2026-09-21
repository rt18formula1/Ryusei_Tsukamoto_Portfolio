"use client";

import React, { useState } from "react";
import { Save, User, Key, Globe, Bell, Shield } from "lucide-react";

interface AdminSettingsProps {
  onSave?: (settings: Settings) => void;
}

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
  };
  user: {
    adminEmail: string;
    adminName: string;
  };
  api: {
    typesafeApiKey: string;
    supabaseUrl: string;
  };
  notifications: {
    emailAlerts: boolean;
    activityDigest: boolean;
  };
}

export function AdminSettings({ onSave }: AdminSettingsProps) {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: "RYUSEI TSUKAMOTO",
      siteDescription: "Portfolio",
      contactEmail: "contact@example.com",
    },
    user: {
      adminEmail: "admin@example.com",
      adminName: "Admin",
    },
    api: {
      typesafeApiKey: "",
      supabaseUrl: "",
    },
    notifications: {
      emailAlerts: true,
      activityDigest: true,
    },
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "user" | "api" | "notifications">("general");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // In production, save to your backend
    setTimeout(() => {
      setSaving(false);
      if (onSave) {
        onSave(settings);
      }
      alert("Settings saved successfully!");
    }, 1000);
  };

  const tabs = [
    { id: "general" as const, label: "General", icon: Globe },
    { id: "user" as const, label: "User", icon: User },
    { id: "api" as const, label: "API", icon: Key },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-gray-700 uppercase tracking-wider">
            Settings
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-black">
            Admin Settings
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black/80 disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-black/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-black text-black"
                : "border-transparent text-black/40 hover:text-black/60"
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm">
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <label htmlFor="site-name" className="mb-1.5 block text-xs font-bold text-black/60">
                Site Name
              </label>
              <input
                id="site-name"
                type="text"
                value={settings.general.siteName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
              />
            </div>
            <div>
              <label htmlFor="site-description" className="mb-1.5 block text-xs font-bold text-black/60">
                Site Description
              </label>
              <textarea
                id="site-description"
                value={settings.general.siteDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value },
                  })
                }
                rows={3}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30 resize-none"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-xs font-bold text-black/60">
                Contact Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, contactEmail: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
              />
            </div>
          </div>
        )}

        {activeTab === "user" && (
          <div className="space-y-6">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-xs font-bold text-black/60">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={settings.user.adminEmail}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    user: { ...settings.user, adminEmail: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
              />
            </div>
            <div>
              <label htmlFor="admin-name" className="mb-1.5 block text-xs font-bold text-black/60">
                Admin Name
              </label>
              <input
                id="admin-name"
                type="text"
                value={settings.user.adminName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    user: { ...settings.user, adminName: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
              />
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-6">
            <div>
              <label htmlFor="typesafe-key" className="mb-1.5 block text-xs font-bold text-black/60">
                TypeSafe API Key
              </label>
              <input
                id="typesafe-key"
                type="password"
                value={settings.api.typesafeApiKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    api: { ...settings.api, typesafeApiKey: e.target.value },
                  })
                }
                placeholder="••••••••••••••••"
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
              />
              <p className="mt-1 text-[10px] text-black/40">
                Used for Jev AI-powered features
              </p>
            </div>
            <div>
              <label htmlFor="supabase-url" className="mb-1.5 block text-xs font-bold text-black/60">
                Supabase URL
              </label>
              <input
                id="supabase-url"
                type="url"
                value={settings.api.supabaseUrl}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    api: { ...settings.api, supabaseUrl: e.target.value },
                  })
                }
                placeholder="https://your-project.supabase.co"
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-xs text-black outline-none focus:border-black/30"
              />
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/10">
              <div>
                <div className="text-xs font-bold text-black">Email Alerts</div>
                <div className="text-[10px] text-black/40 mt-0.5">
                  Receive email notifications for important events
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailAlerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      emailAlerts: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-black/20"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/10">
              <div>
                <div className="text-xs font-bold text-black">Activity Digest</div>
                <div className="text-[10px] text-black/40 mt-0.5">
                  Receive weekly digest of portfolio activity
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.activityDigest}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      activityDigest: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-black/20"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
