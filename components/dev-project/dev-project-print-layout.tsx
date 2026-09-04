"use client";

import { DeveloperProject, DevProjectDetailBlock } from "@/types/dev-project";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

interface DevProjectPrintLayoutProps {
  project: DeveloperProject;
}

export function DevProjectPrintLayout({ project }: DevProjectPrintLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const websiteLink = project.links.find(l => l.title.toLowerCase() === "website");
  const githubLink = project.links.find(l => l.title.toLowerCase() === "github");
  const additionalLinks = project.links.filter(
    l => l.title.toLowerCase() !== "website" && l.title.toLowerCase() !== "github"
  ).sort((a, b) => a.order - b.order);
  const priorityLinks = [websiteLink, githubLink].filter(Boolean) as typeof project.links;

  // Sort information: predefined categories first, custom categories in creation order, OTHER always last
  const predefinedCategories = ["GENERAL", "INFRASTRUCTURE", "DATA", "AUTHENTICATION", "API / INTEGRATION"];
  const sortedInformation = [...project.information].sort((a, b) => {
    const aIsOther = a.category === "OTHER";
    const bIsOther = b.category === "OTHER";
    if (aIsOther && !bIsOther) return 1;
    if (!aIsOther && bIsOther) return -1;
    
    const aPredefinedIdx = predefinedCategories.indexOf(a.category);
    const bPredefinedIdx = predefinedCategories.indexOf(b.category);
    
    if (aPredefinedIdx !== -1 && bPredefinedIdx !== -1) {
      return aPredefinedIdx - bPredefinedIdx;
    }
    if (aPredefinedIdx !== -1) return -1;
    if (bPredefinedIdx !== -1) return 1;
    
    return 0;
  });

  const renderBlock = (block: DevProjectDetailBlock) => {
    switch (block.type) {
      case "Section":
        return (
          <h3
            key={block.id}
            className="text-base font-black mt-8 mb-2 text-black uppercase tracking-widest break-inside-avoid"
            style={{ pageBreakInside: "avoid" }}
          >
            {block.content}
          </h3>
        );
      case "Text":
        return (
          <p key={block.id} className="text-[11px] leading-relaxed mb-4 text-black whitespace-pre-wrap">
            {block.content}
          </p>
        );
      case "Image":
        return (
          <figure
            key={block.id}
            className="mb-6"
            style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
          >
            <img
              src={block.imageUrl}
              alt={block.imageCaption || ""}
              className="w-full h-auto"
              style={{ maxHeight: "260px", objectFit: "contain" }}
            />
            {block.imageCaption && (
              <figcaption className="text-[10px] text-gray-500 mt-1">{block.imageCaption}</figcaption>
            )}
          </figure>
        );
      case "ImageText":
        return (
          <div
            key={block.id}
            className="flex gap-5 mb-6 items-start"
            style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
          >
            <div className="w-1/2">
              <img
                src={block.imageUrl}
                alt=""
                className="w-full h-auto"
                style={{ maxHeight: "220px", objectFit: "cover" }}
              />
            </div>
            <div className="w-1/2 text-[11px] leading-relaxed text-black">{block.text}</div>
          </div>
        );
      case "Highlight":
        return (
          <div
            key={block.id}
            className="bg-black text-white p-4 mb-6 font-bold text-[11px] leading-relaxed border-l-4 border-yellow-400"
            style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
          >
            {block.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @page {
          size: A4 portrait;
          margin: 14mm 16mm 18mm 16mm;
        }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0; padding: 0; background: white !important; }
          @page { counter-increment: page; }
          .page-number::after { content: counter(page); }
          .print-only { display: block !important; }
          .screen-only { display: none !important; }
          .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
          }
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
        @media screen {
          .print-only { display: none; }
          .print-header { display: none; }
          .print-footer { display: none; }
          body { background: #f5f5f5; }
          .print-sheet {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 18mm 18mm 22mm 18mm;
            background: white;
            box-shadow: 0 4px 32px rgba(0,0,0,0.12);
          }
        }
        `
      }} />

      {/* Screen-only print button */}
      <div className="screen-only fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => window.print()}
          className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl hover:bg-gray-800 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          Print / Save as PDF
        </button>
        <button
          onClick={() => window.close()}
          className="bg-white text-black border border-black/20 px-4 py-2 rounded-full text-sm font-bold shadow hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>

      <div className="print-sheet" data-page="1">
        {/* ===== HEADER (shared across all pages) ===== */}
        <div
          className="print-header"
          style={{
            borderBottom: "0.5px solid black",
            paddingBottom: "3mm",
            marginBottom: "6mm",
          }}
        >
          <p style={{ fontSize: "8px", fontWeight: 900, letterSpacing: "0.25em", color: "#000", margin: 0 }}>
            RYUSEI TSUKAMOTO PORTFOLIO
          </p>
        </div>

        {/* ===== PAGE 1 ===== */}
        {/* Main Visual: 16:9 / cover */}
        <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", marginBottom: "8mm", background: "#eee" }}>
          <img
            src={project.mainVisualUrl}
            alt={project.projectName}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* Title Area */}
        <div style={{ marginBottom: "8mm" }}>
          <p
            style={{
              fontSize: "7px",
              fontWeight: 900,
              letterSpacing: "0.3em",
              color: "#555",
              marginBottom: "3mm",
              textTransform: "uppercase",
            }}
          >
            DEVELOPER PROJECT
          </p>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "4mm",
              color: "#000",
            }}
          >
            {project.projectName}
          </h1>
          <p
            style={{
              fontSize: "10px",
              lineHeight: 1.7,
              color: "#333",
              fontWeight: 500,
            }}
          >
            {project.shortDescription}
          </p>
        </div>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "0.5px solid #ccc", margin: "6mm 0" }} />

        {/* ===== PROJECT INFORMATION ===== */}
        <div style={{ marginBottom: "10mm", breakInside: "avoid", pageBreakInside: "avoid" }}>
          {/* Ensure GENERAL category stays on page 1 */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .general-category { break-inside: avoid; page-break-inside: avoid; }
            `
          }} />
          <p
            style={{
              fontSize: "7px",
              fontWeight: 900,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: "4mm",
            }}
          >
            PROJECT INFORMATION
          </p>

          {sortedInformation.map((info, idx) => (
            <div
              key={idx}
              className={info.category === "GENERAL" ? "general-category" : ""}
              style={{ marginBottom: "5mm", breakInside: "avoid", pageBreakInside: "avoid" }}
            >
              {/* Category header with thin rule */}
              {idx > 0 && (
                <hr style={{ border: "none", borderTop: "0.5px solid #e0e0e0", margin: "4mm 0 4mm 0" }} />
              )}
              <p
                style={{
                  fontSize: "6.5px",
                  fontWeight: 900,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginBottom: "3mm",
                }}
              >
                {info.category}
              </p>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {info.items.map((item, itemIdx) => (
                    <tr
                      key={itemIdx}
                      style={{
                        borderBottom: info.items.length > 4 ? "0.5px solid #f0f0f0" : "none",
                      }}
                    >
                      <td
                        style={{
                          fontSize: "8.5px",
                          color: "#777",
                          padding: "1.5mm 0",
                          width: "40%",
                        }}
                      >
                        {item.label}
                      </td>
                      <td
                        style={{
                          fontSize: "8.5px",
                          fontWeight: 700,
                          color: "#000",
                          padding: "1.5mm 0",
                          textAlign: "right",
                        }}
                      >
                        {item.type === "Multiple Values" && Array.isArray(item.value)
                          ? item.value.join(" / ")
                          : item.type === "URL"
                          ? (item.displayUrl || (item.value as string))
                          : (item.value as string)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* ===== PROJECT DETAILS ===== */}
        {project.details.length > 0 && (
          <>
            <hr style={{ border: "none", borderTop: "0.5px solid #ccc", margin: "6mm 0" }} />
            <div style={{ marginBottom: "10mm" }}>
              <p
                style={{
                  fontSize: "7px",
                  fontWeight: 900,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#555",
                  marginBottom: "4mm",
                }}
              >
                PROJECT DETAILS
              </p>
              {project.details.sort((a, b) => a.order - b.order).map(renderBlock)}
            </div>
          </>
        )}

        {/* ===== GALLERY ===== */}
        {project.gallery.length > 0 && (
          <>
            <hr style={{ border: "none", borderTop: "0.5px solid #ccc", margin: "6mm 0" }} />
            <div style={{ marginBottom: "10mm" }}>
              <p
                style={{
                  fontSize: "7px",
                  fontWeight: 900,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#555",
                  marginBottom: "4mm",
                }}
              >
                GALLERY
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4mm",
                }}
              >
                {project.gallery.sort((a, b) => a.order - b.order).map(item => (
                  <figure
                    key={item.id}
                    style={{ margin: 0, breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.caption || ""}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                        display: "block",
                        border: "0.5px solid #eee",
                      }}
                    />
                    {item.caption && (
                      <figcaption
                        style={{
                          fontSize: "7.5px",
                          fontWeight: 700,
                          color: "#000",
                          marginTop: "1.5mm",
                        }}
                      >
                        {item.caption}
                      </figcaption>
                    )}
                    {item.description && (
                      <p style={{ fontSize: "7px", color: "#666", marginTop: "0.5mm" }}>
                        {item.description}
                      </p>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== LINKS ===== */}
        {project.links.length > 0 && (
          <>
            <hr style={{ border: "none", borderTop: "0.5px solid #ccc", margin: "6mm 0" }} />
            <div>
              <p
                style={{
                  fontSize: "7px",
                  fontWeight: 900,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#555",
                  marginBottom: "4mm",
                }}
              >
                LINKS
              </p>

              {/* Website + GitHub (with QR) */}
              {priorityLinks.map(link => (
                <div
                  key={link.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "5mm",
                    breakInside: "avoid",
                    pageBreakInside: "avoid",
                    borderLeft: "2.5px solid #000",
                    paddingLeft: "4mm",
                  }}
                >
                  <div style={{ flex: 1, paddingRight: "5mm" }}>
                    <p style={{ fontSize: "10px", fontWeight: 900, marginBottom: "1.5mm", color: "#000" }}>
                      {link.title}
                    </p>
                    <p style={{ fontSize: "8px", color: "#555", marginBottom: "2mm" }}>
                      {link.description}
                    </p>
                    <p style={{ fontSize: "7.5px", color: "#888", fontFamily: "monospace", wordBreak: "break-all" }}>
                      {link.url}
                    </p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <QRCode value={link.url} size={56} level="M" />
                  </div>
                </div>
              ))}

              {/* Additional links (no QR) */}
              {additionalLinks.map(link => (
                <div
                  key={link.id}
                  style={{
                    marginBottom: "4mm",
                    breakInside: "avoid",
                    pageBreakInside: "avoid",
                    borderLeft: "1px solid #ccc",
                    paddingLeft: "4mm",
                  }}
                >
                  <p style={{ fontSize: "10px", fontWeight: 900, marginBottom: "1mm", color: "#000" }}>
                    {link.title}
                  </p>
                  <p style={{ fontSize: "8px", color: "#555", marginBottom: "1.5mm" }}>
                    {link.description}
                  </p>
                  <p style={{ fontSize: "7.5px", color: "#888", fontFamily: "monospace", wordBreak: "break-all" }}>
                    {link.url}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== FOOTER ===== */}
        <div
          className="print-footer"
          style={{
            borderTop: "0.5px solid black",
            paddingTop: "3mm",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "7.5px", color: "#555" }}>Ryusei Tsukamoto</span>
          <span style={{ fontSize: "7.5px", fontWeight: 700, color: "#000" }}>{project.projectName}</span>
          <span style={{ fontSize: "7.5px", color: "#555" }} className="page-number"></span>
        </div>
      </div>
    </>
  );
}
