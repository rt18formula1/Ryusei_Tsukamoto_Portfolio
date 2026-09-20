"use client";

import { getDisciplines } from "@/lib/portfolio-hierarchy";

export default function DisciplinesPage() {
  const disciplines = getDisciplines();

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <h1 className="text-2xl font-black mb-1">Disciplines</h1>
      <p className="text-sm text-gray-400 mb-8">5 Disciplines — 同格として扱う</p>

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
                    defaultValue={d.name}
                    className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slug</label>
                  <input
                    type="text"
                    defaultValue={d.slug}
                    className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-mono focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                  <textarea
                    defaultValue={d.description}
                    rows={2}
                    className="w-full mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                  />
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Display Order</label>
                    <input
                      type="number"
                      defaultValue={i + 1}
                      className="w-20 mt-1 px-3 py-2 border border-black/10 rounded-lg text-sm font-bold focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <label className="text-sm font-bold">Visible</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-black/80 transition">
          Save Changes
        </button>
        <p className="mt-3 text-xs text-gray-400">
          ※ Discipline管理の永続化にはDB テーブルが必要です（今後の対応）
        </p>
      </div>
    </div>
  );
}
