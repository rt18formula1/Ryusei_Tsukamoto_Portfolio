"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Eye, EyeOff, Plus, Save, Trash2 } from "lucide-react";
import { saveLinktreeLinksAction } from "@/lib/admin-actions";
import type { LinktreeLink } from "@/lib/content";

const emptyLink = (): LinktreeLink => ({ slug: `link-${Date.now()}`, title: "New link", url: "https://", group: "social", description: "", is_active: true });

export function LinktreeEditor({ initialLinks }: { initialLinks: LinktreeLink[] }) {
  const [links, setLinks] = useState<LinktreeLink[]>(initialLinks);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const update = (index: number, patch: Partial<LinktreeLink>) => setLinks((current) => current.map((link, i) => i === index ? { ...link, ...patch } : link));
  const move = (index: number, direction: -1 | 1) => setLinks((current) => { const next = [...current]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  const remove = (index: number) => update(index, { is_active: false });
  const save = async () => { setSaving(true); setMessage(""); try { await saveLinktreeLinksAction(links); setMessage("Saved"); } catch (error) { setMessage(error instanceof Error ? error.message : "Save failed"); } finally { setSaving(false); } };
  return <div className="rounded-[2rem] bg-white p-4 shadow-sm sm:p-6">
    <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/35">rt18_formula1</p><h2 className="mt-1 text-xl font-black">Links</h2></div><button onClick={() => setLinks((current) => [...current, emptyLink()])} className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-xs font-bold hover:border-black/30"><Plus size={14} /> Add link</button></div>
    <div className="space-y-3">{links.map((link, index) => <div key={`${link.slug}-${index}`} className={`rounded-2xl border p-4 ${link.is_active === false ? "border-black/5 bg-black/[.025] opacity-60" : "border-black/10 bg-white"}`}>
      <div className="mb-3 flex items-center justify-between"><span className="rounded-full bg-black/5 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-black/45">{index + 1} · {link.group}</span><div className="flex items-center gap-1"><button aria-label="Move up" onClick={() => move(index, -1)} className="rounded-lg p-2 hover:bg-black/5"><ChevronUp size={15} /></button><button aria-label="Move down" onClick={() => move(index, 1)} className="rounded-lg p-2 hover:bg-black/5"><ChevronDown size={15} /></button><button aria-label={link.is_active === false ? "Show link" : "Hide link"} onClick={() => update(index, { is_active: link.is_active === false })} className="rounded-lg p-2 hover:bg-black/5">{link.is_active === false ? <EyeOff size={15} /> : <Eye size={15} />}</button><button aria-label="Remove link" onClick={() => remove(index)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button></div></div>
      <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-black/50">Title<input value={link.title} onChange={(e) => update(index, { title: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-semibold outline-none focus:border-black" /></label><label className="text-xs font-bold text-black/50">URL<input value={link.url} onChange={(e) => update(index, { url: e.target.value })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black" /></label><label className="text-xs font-bold text-black/50">Slug<input value={link.slug} onChange={(e) => update(index, { slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 font-mono text-xs outline-none focus:border-black" /></label><label className="text-xs font-bold text-black/50">Group<select value={link.group} onChange={(e) => update(index, { group: e.target.value as LinktreeLink["group"] })} className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-black"><option value="featured">Featured</option><option value="social">Social</option><option value="resources">More</option></select></label></div>
    </div>)}</div>
    <div className="mt-5 flex items-center justify-end gap-3"><span className="text-xs font-bold text-black/45">{message}</span><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-black text-white transition hover:bg-black/75 disabled:opacity-50">{message === "Saved" ? <Check size={14} /> : <Save size={14} />}{saving ? "Saving…" : "Save changes"}</button></div>
  </div>;
}
