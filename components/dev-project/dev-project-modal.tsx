"use client";

import { useEffect } from "react";
import type { DevProjectDetailBlock, DevProjectInfoItem, DeveloperProject } from "@/types/dev-project";
import { displayValue, focalPointStyle, fullUrl, sortProjectInformation, sortProjectLinks } from "@/lib/dev-project/presentation";

interface DevProjectModalProps { project: DeveloperProject; isOpen: boolean; onClose: () => void; }

function Value({ item }: { item: DevProjectInfoItem }) {
  if (item.type === "URL") return <a href={fullUrl(item)} target="_blank" rel="noreferrer" className="break-all text-blue-700 underline-offset-2 hover:underline">{displayValue(item)}</a>;
  if (item.type === "Service") { const icon = item.service?.iconUrl ?? item.serviceIconUrl; return <span className="inline-flex items-center gap-2">{icon && <img src={icon} alt="" className="h-4 w-4 object-contain" />}{displayValue(item)}</span>; }
  return <>{displayValue(item)}</>;
}

function DetailBlock({ block }: { block: DevProjectDetailBlock }) {
  if (block.type === "Section") return <h3 className="mt-10 border-b border-black/10 pb-3 text-xl font-black">{block.content}</h3>;
  if (block.type === "Text") return <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">{block.content}</p>;
  if (block.type === "Highlight") return <blockquote className="border-l-4 border-black bg-neutral-50 px-5 py-4 text-sm font-semibold leading-7">{block.content}</blockquote>;
  if (block.type === "Image") return block.imageUrl ? <figure><img src={block.imageUrl} alt={block.imageCaption ?? ""} className="aspect-video w-full rounded-xl object-cover" />{block.imageCaption && <figcaption className="mt-2 text-center text-xs text-gray-500">{block.imageCaption}</figcaption>}</figure> : null;
  if (block.type === "ImageText") return <div className="grid gap-4 md:grid-cols-2">{block.imageUrl && <figure><img src={block.imageUrl} alt={block.imageCaption ?? ""} className="aspect-video w-full rounded-xl object-cover" />{block.imageCaption && <figcaption className="mt-2 text-xs text-gray-500">{block.imageCaption}</figcaption>}</figure>}<p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">{block.text}</p></div>;
  return null;
}

export function DevProjectModal({ project, isOpen, onClose }: DevProjectModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape); document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const information = sortProjectInformation(project.information);
  const details = [...project.details].sort((a, b) => a.order - b.order);
  const gallery = [...project.gallery].sort((a, b) => a.order - b.order);
  return <div role="dialog" aria-modal="true" aria-label={`${project.projectName} details`} className="fixed inset-0 z-[100] flex items-end bg-black/60 p-0 backdrop-blur-sm md:items-center md:p-6" onMouseDown={onClose}>
    <article className="flex h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl md:h-[90vh] md:rounded-3xl" onMouseDown={(event) => event.stopPropagation()}>
      <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 md:px-8"><h2 className="text-lg font-black md:text-xl">{project.projectName}</h2><button onClick={onClose} aria-label="Close project details" className="rounded-full p-2 text-xl text-gray-500 transition hover:bg-black/5 hover:text-black">×</button></header>
      <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8"><div className="mx-auto max-w-4xl space-y-12">
        {project.mainVisualUrl && <img src={project.mainVisualUrl} alt={project.projectName} className="aspect-video w-full rounded-2xl object-cover" style={{ objectPosition: focalPointStyle(project.mainVisualFocalPoint) }} />}
        <section><h1 className="text-3xl font-black tracking-tight md:text-5xl">{project.projectName}</h1><p className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-gray-700 md:text-lg">{project.shortDescription}</p></section>
        <section><SectionTitle>Project Information</SectionTitle><div className="space-y-7">{information.map((category) => <div key={category.category} className="border-t border-black/10 pt-5"><h3 className="mb-4 text-[11px] font-black tracking-[0.2em] text-gray-500">{category.category}</h3><dl className="divide-y divide-black/5">{category.items.map((item, index) => <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6" key={`${item.label}-${index}`}><dt className="text-sm font-bold text-gray-500">{item.label}</dt><dd className="text-sm leading-6 text-gray-900"><Value item={item} /></dd></div>)}</dl></div>)}</div></section>
        {details.length > 0 && <section><SectionTitle>Project Details</SectionTitle><div className="space-y-6">{details.map((block) => <DetailBlock key={block.id} block={block} />)}</div></section>}
        {gallery.length > 0 && <section><SectionTitle>Gallery</SectionTitle><div className="grid gap-5 sm:grid-cols-2">{gallery.map((item) => <figure key={item.id}><img src={item.imageUrl} alt={item.caption ?? ""} className="aspect-[4/3] w-full rounded-xl object-cover" />{item.caption && <figcaption className="mt-2 text-sm font-bold">{item.caption}</figcaption>}{item.description && <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>}</figure>)}</div></section>}
        {project.links.length > 0 && <section><SectionTitle>Links</SectionTitle><div className="space-y-3">{sortProjectLinks(project.links).map((link) => <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-black/10 p-5 transition hover:border-black/30 hover:bg-neutral-50"><p className="font-black">{link.title} <span aria-hidden="true">↗</span></p><p className="mt-2 text-sm leading-6 text-gray-600">{link.description}</p><p className="mt-3 text-xs font-bold text-blue-700">{link.buttonLabel}</p></a>)}</div></section>}
      </div></div>
    </article></div>;
}
function SectionTitle({ children }: { children: React.ReactNode }) { return <h2 className="mb-6 text-xs font-black uppercase tracking-[0.22em] text-gray-400">{children}</h2>; }
export default DevProjectModal;
