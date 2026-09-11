"use client";

import { useEffect, useCallback } from "react";
import { DeveloperProject, DevProjectDetailBlock } from "@/types/dev-project";
import Link from "next/link";
import { X, ExternalLink, Printer } from "lucide-react";

interface DevProjectModalProps {
  project: DeveloperProject;
  isOpen: boolean;
  onClose: () => void;
}

export function DevProjectModal({ project, isOpen, onClose }: DevProjectModalProps) {
  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    // Lock scroll
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    // Keyboard
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Restore scroll position
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const renderBlock = (block: DevProjectDetailBlock) => {
    switch (block.type) {
      case "Section":
        return (
          <h3
            key={block.id}
            className="text-base sm:text-lg md:text-xl font-black mt-8 sm:mt-10 md:mt-12 mb-3 sm:mb-4 text-black tracking-tight uppercase"
          >
            {block.content}
          </h3>
        );
      case "Text":
        return (
          <p
            key={block.id}
            className="text-xs sm:text-sm md:text-[15px] text-gray-700 leading-relaxed mb-4 sm:mb-6 whitespace-pre-wrap"
          >
            {block.content}
          </p>
        );
      case "Image":
        return (
          <figure key={block.id} className="mb-6 sm:mb-8">
            <div className="rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 border border-black/5">
              <img
                src={block.imageUrl}
                alt={block.imageCaption || ""}
                className="w-full h-auto"
              />
            </div>
            {block.imageCaption && (
              <figcaption className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 text-center font-medium">
                {block.imageCaption}
              </figcaption>
            )}
          </figure>
        );
      case "ImageText":
        return (
          <div
            key={block.id}
            className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8 items-start"
          >
            <div className="md:w-1/2 w-full rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
              <img
                src={block.imageUrl}
                alt=""
                className="w-full h-full object-cover"
                style={{ maxHeight: "240px" }}
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-xs sm:text-sm md:text-[15px] text-gray-700 leading-relaxed">{block.text}</p>
            </div>
          </div>
        );
      case "Highlight":
        return (
          <div
            key={block.id}
            className="bg-black text-white px-4 sm:px-5 md:px-7 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl my-6 sm:my-8 font-semibold text-xs sm:text-sm md:text-base leading-relaxed border-l-4 border-yellow-400"
          >
            {block.content}
          </div>
        );
      default:
        return null;
    }
  };

  const websiteLink = project.links.find((l) => l.title.toLowerCase() === "website");
  const githubLink = project.links.find((l) => l.title.toLowerCase() === "github");
  const otherLinks = project.links.filter(
    (l) => l.title.toLowerCase() !== "website" && l.title.toLowerCase() !== "github"
  );
  const orderedLinks = [
    ...(websiteLink ? [websiteLink] : []),
    ...(githubLink ? [githubLink] : []),
    ...otherLinks,
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center md:p-6 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.projectName}
    >
      <div
        className="bg-white w-full h-full md:h-auto md:max-h-[92vh] md:rounded-3xl overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "1100px" }}
      >
        {/* Top action bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white/95 backdrop-blur-sm border-b border-black/5">
          <div className="flex items-center gap-3">
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/portfolio/dev/${project.id}/print`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black border border-black/10 hover:border-black/30 rounded-full px-4 py-2 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Printer size={13} />
              Print / PDF
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black hover:text-white rounded-full transition-colors text-gray-500"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Visual */}
        <div className="w-full bg-gray-100" style={{ aspectRatio: "16/9" }}>
          <img
            src={project.mainVisualUrl}
            alt={project.projectName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 px-4 md:px-6 lg:px-12 lg:px-14 py-6 md:py-10 lg:py-12">
            {/* Title */}
            <header className="mb-8 md:mb-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-3 md:mb-4 leading-tight">
                {project.projectName}
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-gray-600 font-medium leading-relaxed">
                {project.shortDescription}
              </p>
            </header>

            {/* Project Information */}
            {project.information.length > 0 && (
              <section className="mb-10 md:mb-14">
                <h3 className="text-lg md:text-xl font-black mb-4 md:mb-6 tracking-tight">Project Information</h3>
                <div className="space-y-6">
                  {project.information.map((infoCategory) => (
                    <div key={infoCategory.category}>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                        {infoCategory.category}
                      </h4>
                      <div className="space-y-3">
                        {infoCategory.items.map((item) => (
                          <div
                            key={item.label}
                            className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-2 border-b border-black/5 last:border-0"
                          >
                            <span className="text-xs font-bold text-gray-500 sm:w-32 shrink-0 uppercase tracking-wide">
                              {item.label}
                            </span>
                            <div className="flex-1 min-w-0">
                              {Array.isArray(item.value) ? (
                                <div className="flex flex-wrap gap-2">
                                  {item.value.map((v, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs font-medium bg-black/5 px-2 py-1 rounded-md"
                                    >
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              ) : item.type === "URL" || item.url ? (
                                <a
                                  href={item.url || (typeof item.value === "string" ? item.value : "")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium text-blue-600 hover:text-blue-800 break-all"
                                >
                                  {item.displayUrl || item.value}
                                </a>
                              ) : (
                                <span className="text-xs font-medium text-gray-700">
                                  {item.value}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Details */}
            <section className="mb-10 md:mb-14">
              {project.details
                .sort((a, b) => a.order - b.order)
                .map(renderBlock)}
            </section>

            {/* Gallery */}
            {project.gallery.length > 0 && (
              <section className="mb-10 md:mb-14">
                <h3 className="text-lg md:text-xl font-black mb-4 md:mb-6 tracking-tight">Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {project.gallery
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <figure key={item.id} className="group">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-black/5">
                          <img
                            src={item.imageUrl}
                            alt={item.caption || ""}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        {item.caption && (
                          <figcaption className="font-bold text-sm mt-2">
                            {item.caption}
                          </figcaption>
                        )}
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </figure>
                    ))}
                </div>
              </section>
            )}

            {/* Links */}
            {orderedLinks.length > 0 && (
              <section>
                <h3 className="text-lg md:text-xl font-black mb-4 md:mb-6 tracking-tight">Links</h3>
                <div className="space-y-3">
                  {orderedLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 p-4 md:p-5 rounded-2xl border border-black/8 hover:border-black/20 bg-gray-50/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm md:text-base mb-1">{link.title}</h4>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-black text-white text-xs md:text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        {link.buttonLabel}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Project Information sidebar */}
          <div className="lg:w-[300px] xl:w-[340px] shrink-0 px-4 md:px-6 lg:px-8 pb-8 md:pb-12 pt-0 lg:pt-12 lg:border-l border-black/8">
            <div className="lg:sticky lg:top-20">
              <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 md:mb-8">
                Project Information
              </h3>
              <div className="space-y-6 md:space-y-8">
                {project.information.map((info, idx) => (
                  <div key={idx}>
                    <h4 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.22em] text-black mb-3 md:mb-4 pb-2 border-b border-black/8">
                      {info.category}
                    </h4>
                    <dl className="space-y-2 md:space-y-3">
                      {info.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start gap-2 md:gap-3">
                          <dt className="text-[11px] md:text-[12px] text-gray-500 font-medium shrink-0">
                            {item.label}
                          </dt>
                          <dd className="text-[11px] md:text-[12px] font-bold text-black text-right">
                            {item.type === "Multiple Values" && Array.isArray(item.value) ? (
                              <span>{item.value.join(" / ")}</span>
                            ) : item.type === "URL" ? (
                              <a
                                href={item.value as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {item.displayUrl || (item.value as string)}
                              </a>
                            ) : item.type === "Service" ? (
                              <div className="flex items-center justify-end gap-2">
                                {item.serviceIconUrl && (
                                  <img src={item.serviceIconUrl} alt="" className="w-4 h-4" />
                                )}
                                <span>{item.serviceName || (item.value as string)}</span>
                              </div>
                            ) : (
                              <span>{item.value as string}</span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>

              <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-black/8">
                <Link
                  href={`/portfolio/dev/${project.id}`}
                  className="block text-center text-[10px] md:text-xs font-bold text-gray-400 hover:text-black transition-colors underline underline-offset-4 mb-2 md:mb-3"
                  onClick={onClose}
                >
                  Permalink →
                </Link>
                <Link
                  href={`/portfolio/dev/${project.id}/print`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full text-[10px] md:text-xs font-bold text-gray-500 hover:text-black border border-black/10 hover:border-black/40 rounded-xl py-2.5 md:py-3 transition-colors"
                >
                  <Printer size={13} />
                  Print / Save as PDF
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
