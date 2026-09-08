"use client";

import { useEffect, useState } from "react";
import { DeveloperProject } from "@/types/dev-project";
import { useLanguage } from "@/components/providers/language-provider";

interface DevProjectModalProps {
  project: DeveloperProject;
  isOpen: boolean;
  onClose: () => void;
}

export default function DevProjectModal({ project, isOpen, onClose }: DevProjectModalProps) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Main Visual
  const mainVisualStyle: React.CSSProperties = {
    aspectRatio: "16 / 9",
    width: "100%",
    objectFit: "cover",
    borderRadius: "16px",
    marginBottom: "24px",
  };

  // Category display order
  const categoryOrder = [
    "GENERAL",
    "INFRASTRUCTURE",
    "DATA",
    "AUTHENTICATION",
    "API / INTEGRATION",
    "OTHER",
  ];

  const sortedInfo = [...project.information].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.category.localeCompare(b.category);
  });

  const formatValue = (item: typeof project.information[0]["items"][0]) => {
    if (item.type === "Multiple Values" && Array.isArray(item.value)) {
      return item.value.map((v, i) => (
        <span key={i} className="block">{v}</span>
      ));
    }
    if (item.type === "URL") {
      const display = item.displayUrl || item.value;
      return (
        <a
          href={item.value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {display}
        </a>
      );
    }
    if (item.type === "Service" && item.serviceIconUrl) {
      return (
        <span className="flex items-center gap-2">
          <img src={item.serviceIconUrl} alt={item.serviceName || ""} className="w-4 h-4" />
          <span>{item.serviceName || item.value}</span>
        </span>
      );
    }
    return String(item.value);
  };

  const renderDetailBlocks = () => {
    return project.details
      .sort((a, b) => a.order - b.order)
      .map((block) => {
        switch (block.type) {
          case "Section":
            return (
              <h3 key={block.id} className="text-xl font-bold mt-8 mb-4 pb-2 border-b border-black/10">
                {block.content}
              </h3>
            );
          case "Text":
            return (
              <div key={block.id} className="prose prose-sm max-w-none text-gray-700 mb-6 whitespace-pre-wrap">
                {block.content}
              </div>
            );
          case "Image":
            return (
              <div key={block.id} className="mb-6">
                {block.imageUrl && (
                  <>
                    <img
                      src={block.imageUrl}
                      alt={block.imageCaption || ""}
                      className="w-full rounded-xl object-cover aspect-video mb-2"
                    />
                    {block.imageCaption && (
                      <p className="text-xs text-gray-500 text-center italic">{block.imageCaption}</p>
                    )}
                  </>
                )}
              </div>
            );
          case "ImageText":
            return (
              <div key={block.id} className="flex flex-col md:flex-row gap-6 mb-8">
                {block.imageUrl && (
                  <div className="md:w-1/2 flex-shrink-0">
                    <img
                      src={block.imageUrl}
                      alt={block.imageCaption || ""}
                      className="w-full rounded-xl object-cover aspect-video"
                    />
                    {block.imageCaption && (
                      <p className="text-xs text-gray-500 text-center italic mt-1">{block.imageCaption}</p>
                    )}
                  </div>
                )}
                <div className="md:w-1/2 prose prose-sm max-w-none text-gray-700">
                  {block.text}
                </div>
              </div>
            );
          case "Highlight":
            return (
              <div
                key={block.id}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-xl"
              >
                <p className="font-medium text-yellow-900">{block.content}</p>
              </div>
            );
          default:
            return null;
        }
      });
  };

  const renderLinks = () => {
    const sortedLinks = [...project.links].sort((a, b) => {
      // Website and GitHub first
      const aPriority = a.title === "Website" ? 0 : a.title === "GitHub" ? 1 : 2;
      const bPriority = b.title === "Website" ? 0 : b.title === "GitHub" ? 1 : 2;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.order - b.order;
    });

    return sortedLinks.map((link) => (
      <a
        key={link.id}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-4 p-4 border border-black/10 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm">{link.title}</span>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-2">{link.description}</p>
          <span className="text-xs font-bold text-blue-600 hover:underline">{link.buttonLabel}</span>
        </div>
      </a>
    ));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-black/10 shrink-0">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Developer Project</span>
            <h2 className="text-2xl font-black mt-1">{project.projectName}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl p-2 -mr-2 -mt-2 transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-8 custom-scrollbar">
          {/* Main Visual */}
          {project.mainVisualUrl && (
            <img src={project.mainVisualUrl} alt={project.projectName} style={mainVisualStyle} />
          )}

          {/* Short Description */}
          <p className="text-lg text-gray-600 leading-relaxed font-medium">{project.shortDescription}</p>

          {/* Project Information */}
          <section>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-4">
              Project Information <div className="h-px flex-1 bg-black/5" />
            </h3>
            <div className="space-y-6">
              {sortedInfo.map((cat) => (
                <div key={cat.category} className="border border-black/10 rounded-xl p-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{cat.category}</h4>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {cat.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                        <dt className="text-sm font-bold text-gray-500 w-full sm:w-32 shrink-0">{item.label}</dt>
                        <dd className="text-sm text-gray-800 flex-1">{formatValue(item)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          {/* Project Details */}
          {project.details.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-4">
                Project Details <div className="h-px flex-1 bg-black/5" />
              </h3>
              <div>{renderDetailBlocks()}</div>
            </section>
          )}

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-4">
                Gallery <div className="h-px flex-1 bg-black/5" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.gallery
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div key={item.id} className="group">
                      <img
                        src={item.imageUrl}
                        alt={item.caption || ""}
                        className="w-full aspect-square object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.caption && (
                        <p className="text-xs text-gray-500 mt-1 text-center">{item.caption}</p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Links */}
          {project.links.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-4">
                Links <div className="h-px flex-1 bg-black/5" />
              </h3>
              <div className="space-y-3">{renderLinks()}</div>
            </section>
          )}

          {/* Print Button */}
          <div className="pt-8 border-t border-black/10 flex justify-end">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-black text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-gray-900 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
