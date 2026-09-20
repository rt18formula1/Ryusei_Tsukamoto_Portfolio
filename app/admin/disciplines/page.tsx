"use client";

import { useState } from "react";
import { getDisciplines } from "@/lib/portfolio-hierarchy";
import type { Discipline } from "@/types/portfolio-hierarchy";

export default function DisciplinesPage() {
  const initial = getDisciplines();
  const [disciplines, setDisciplines] = useState<Discipline[]>(
    initial.map((d, i) => ({ ...d, _order: i + 1, _visible: true } as any))
  );
  const [saved, setSaved] = useState(false);

  const update = (id: string, patch: Partial<Discipline>) => {
    setDisciplines((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-2xl font-black mb-1">Disciplines</h1>
      <p className="text-sm text-gray-400 mb-8">{disciplines.length} Disciplines — 同格として扱う</p>

      <div className="space-y-4">
        {disciplines.map((d, i) => (
          <div key={d.id} className="border border-black/10 rounded-xl p-5 bg-white">
            <div className="flex items-start gap-4">
              <div
                className="w-4 h-4 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => update(d.id, { name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</label>
                  <input
                    type="text"
                    value={d.slug}
                    onChange={(e) => update(d.id, { slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                  <textarea
                    value={d.description}
                    onChange={(e) => update(d.id, { description: e.target.value })}
                    rows={2}
                    className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Display Order</label>
                    <input
                      type="number"
                      value={i + 1}
                      onChange={(e) => update(d.id, { ...({ _order: parseInt(e.target.value) || 0 } as any) })}
                      className="w-20 mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      checked={(d as any)._visible !== false}
                      onChange={(e) => update(d.id, { ...({ _visible: e.target.checked } as any) })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-bold">Visible</label>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">Color</label>
                  <input
                    type="color"
                    value={d.color}
                    onChange={(e) => update(d.id, { color: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border border-black/10"
                  />
                  <span className="text-xs font-mono text-gray-400">{d.color}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {d.activities.length} activit{d.activities.length !== 1 ? "ies" : "y"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {d.id}
              </span>
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
          ※ Discipline管理の永続化にはDB テーブルが必要です（今後の対応）
        </p>
      </div>
    </div>
  );
}
