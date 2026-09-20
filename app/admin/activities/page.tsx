"use client";

import { useState } from "react";
import { getDisciplines } from "@/lib/portfolio-hierarchy";
import type { Activity } from "@/types/portfolio-hierarchy";

export default function ActivitiesPage() {
  const disciplines = getDisciplines();
  const [activities, setActivities] = useState<Record<string, Activity[]>>(
    Object.fromEntries(disciplines.map((d) => [d.id, d.activities.map((a, i) => ({ ...a, _order: i + 1, _visible: true } as any))]))
  );
  const [saved, setSaved] = useState(false);

  const update = (disciplineId: string, activityId: string, patch: Partial<Activity>) => {
    setActivities((prev) => ({
      ...prev,
      [disciplineId]: prev[disciplineId].map((a) => (a.id === activityId ? { ...a, ...patch } : a)),
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-2xl font-black mb-1">Activities</h1>
      <p className="text-sm text-gray-400 mb-8">Activity / Brand管理 — Projectとは別の管理単位</p>

      <div className="space-y-8">
        {disciplines.map((d) => (
          <div key={d.id}>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
                {d.name}
              </h2>
            </div>

            {activities[d.id].length === 0 && (
              <p className="pl-5 text-xs text-gray-300">No activities</p>
            )}

            <div className="space-y-4">
              {activities[d.id].map((a, i) => (
                <div key={a.id} className="border border-black/10 rounded-xl p-5 bg-white ml-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
                      <input
                        type="text"
                        value={a.name}
                        onChange={(e) => update(d.id, a.id, { name: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</label>
                      <input
                        type="text"
                        value={a.slug}
                        onChange={(e) => update(d.id, a.id, { slug: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Discipline</label>
                      <input
                        type="text"
                        value={d.name}
                        disabled
                        className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Display Order</label>
                      <input
                        type="number"
                        value={i + 1}
                        onChange={(e) => update(d.id, a.id, { ...({ _order: parseInt(e.target.value) || 0 } as any) })}
                        className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                      <textarea
                        value={a.description || ""}
                        onChange={(e) => update(d.id, a.id, { description: e.target.value })}
                        rows={2}
                        className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(a as any)._visible !== false}
                        onChange={(e) => update(d.id, a.id, { ...({ _visible: e.target.checked } as any) })}
                        className="w-4 h-4"
                      />
                      <label className="text-sm font-bold">Visible</label>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {a.contents.length} content{a.contents.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {a.contentType || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-black/80 transition"
        >
          Save Changes
        </button>
        {saved && <span className="text-sm text-green-600 font-bold">✓ Saved</span>}
        <p className="text-xs text-gray-400 ml-auto">
          ※ Activity管理の永続化にはDB テーブルが必要です（今後の対応）
        </p>
      </div>
    </div>
  );
}
