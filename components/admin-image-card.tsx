"use client";

type AdminImageCardProps = { id: string; title: string; imageUrl: string | null; date: string; type: "news" | "portfolio"; onDelete: () => void; onAssign: () => void; onCopyEmbed: () => void; onEdit: () => void };

export function AdminImageCard({ title, imageUrl, date, type, onDelete, onAssign, onCopyEmbed, onEdit }: AdminImageCardProps) {
  return <article className="overflow-hidden rounded-xl border border-black/10 bg-white"><div className="aspect-square bg-black/5">{imageUrl && <img src={imageUrl} alt="" className="h-full w-full object-cover" />}</div><div className="space-y-3 p-3"><p className="truncate text-sm font-black">{title}</p><p className="text-xs text-gray-400">{date?.split("T")[0]}</p><div className="grid grid-cols-2 gap-2 text-xs font-bold"><button onClick={onEdit} className="rounded border border-black/15 py-2">Edit</button><button onClick={onAssign} className="rounded border border-black/15 py-2">Assign</button><button onClick={onCopyEmbed} className="rounded border border-black/15 py-2">Copy</button><button onClick={onDelete} className="rounded bg-red-600 py-2 text-white">Delete {type}</button></div></div></article>;
}
