"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PortfolioMapState, DisciplineId } from "@/types/portfolio-map";
import {
  getDisciplines,
  disciplineHref,
  activityHref,
  contentHref,
} from "@/lib/portfolio-hierarchy";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";
import type { BreadcrumbItem } from "@/types/portfolio-hierarchy";

const NODE_META: Record<DisciplineId, { label: string; color: string }> = {
  developer: { label: "Developer", color: "#2563eb" },
  illustrator: { label: "Illustrator", color: "#7c3aed" },
  musician: { label: "Musician", color: "#db2777" },
  blogger: { label: "Blogger", color: "#059669" },
  investor: { label: "Investor", color: "#d97706" },
};

const SERVICE_LOGOS = [
  { name: "GitHub", image: "/github-icon.webp" },
  { name: "Vercel", image: "/vercel.svg" },
  { name: "Instagram", image: "/instagram-icon.png" },
  { name: "YouTube", image: "/youtube-logo.png" },
  { name: "X", image: "/x-logo.png" },
  { name: "TypeScript" },
  { name: "Next.js" },
  { name: "Supabase" },
  { name: "Cloudflare" },
  { name: "note" },
];

function ServiceMarquee() {
  const logos = [...SERVICE_LOGOS, ...SERVICE_LOGOS];
  return (
    <div className="overflow-hidden border-y border-black/10 bg-[#fafaf8] py-5" aria-label="Services and tools">
      <div className="flex w-max animate-marquee items-center gap-3">
        {logos.map((service, index) => (
          <div key={`${service.name}-${index}`} className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-5 text-xs font-bold uppercase tracking-[.16em] text-black/55 shadow-sm">
            {service.image ? <img src={service.image} alt="" className="h-5 w-5 object-contain" /> : <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] font-black text-white">{service.name.slice(0, 1)}</span>}
            <span>{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioMap() {
  const [state, setState] = useState<PortfolioMapState>({
    selectedNode: null,
    viewMode: "map",
    breadcrumb: ["HOME"],
  });

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const disciplines = getDisciplines();

  const centerX = 50;
  const centerY = 50;

  const disciplinePositions: Record<DisciplineId, { x: number; y: number }> = {
    developer: { x: 50, y: 18 },
    illustrator: { x: 82, y: 35 },
    musician: { x: 75, y: 72 },
    blogger: { x: 25, y: 72 },
    investor: { x: 18, y: 35 },
  };

  const breadcrumbItems: BreadcrumbItem[] = state.breadcrumb.map((label, index) => {
    if (index === 0) return { label: "HOME", href: "/" };
    const discipline = disciplines.find((d) => d.name.toUpperCase() === label.toUpperCase());
    if (discipline && index === state.breadcrumb.length - 1) {
      return { label: discipline.name.toUpperCase() };
    }
    if (discipline) {
      return { label: discipline.name.toUpperCase(), href: disciplineHref(discipline.id) };
    }
    return { label };
  });

  const handleNodeClick = (nodeId: string, disciplineId?: DisciplineId) => {
    setState((prev) => ({
      ...prev,
      selectedNode: nodeId,
      breadcrumb: disciplineId ? ["HOME", NODE_META[disciplineId].label] : ["HOME"],
    }));
  };

  const handleDisciplineClick = (disciplineId: DisciplineId) => {
    window.location.href = disciplineHref(disciplineId);
  };

  const handleCentralNodeClick = () => {
    window.location.href = "/profile";
  };

  const handleHomeClick = () => {
    setState({
      selectedNode: null,
      viewMode: "map",
      breadcrumb: ["HOME"],
    });
  };

  const toggleViewMode = () => {
    setState((prev) => ({
      ...prev,
      viewMode: prev.viewMode === "map" ? "list" : "map",
    }));
  };

  const createPentagonPath = (cx: number, cy: number, size: number) => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * (Math.PI / 180);
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")} Z`;
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-white">
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden">
      <nav className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-b border-black/10 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <HierarchyBreadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={toggleViewMode}
              className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest border border-black/15 rounded-full px-2 sm:px-4 py-1 sm:py-2 hover:border-black hover:bg-black hover:text-white transition-all"
            >
              {state.viewMode === "map" ? "List" : "Map"}
            </button>
            <button
              onClick={handleHomeClick}
              className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-2 sm:px-4 py-1 sm:py-2 hover:bg-gray-800 transition-all"
            >
              Home
            </button>
          </div>
        </div>
      </nav>

      {state.viewMode === "map" && (
        <svg
          ref={svgRef}
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {Object.entries(disciplinePositions).map(([disciplineId, pos]) => {
            const isSelected = state.selectedNode === disciplineId;
            const isHovered = hoveredNode === disciplineId;
            const isCentralSelected = state.selectedNode === "central";
            const isCentralHovered = hoveredNode === "central";

            return (
              <line
                key={disciplineId}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={
                  isSelected || isHovered || isCentralHovered
                    ? "#000"
                    : isCentralSelected
                      ? "#666"
                      : "#e5e5e5"
                }
                strokeWidth={
                  isSelected || isHovered || isCentralHovered
                    ? "0.5"
                    : isCentralSelected
                      ? "0.3"
                      : "0.2"
                }
                className="transition-all duration-300"
                style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            );
          })}

          <g
            className="cursor-pointer"
            onClick={() => {
              handleNodeClick("central");
              handleCentralNodeClick();
            }}
            onMouseEnter={() => setHoveredNode("central")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <path
              d={createPentagonPath(centerX, centerY, 15)}
              fill={
                state.selectedNode === "central" || hoveredNode === "central" ? "#000" : "#fff"
              }
              stroke="#000"
              strokeWidth="0.4"
              className="transition-all duration-300"
              style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            <text
              x={centerX}
              y={centerY - 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-black uppercase tracking-wider pointer-events-none"
              fill={
                state.selectedNode === "central" || hoveredNode === "central" ? "#fff" : "#000"
              }
              style={{ fontSize: "2.5px" }}
            >
              RYUSEI
            </text>
            <text
              x={centerX}
              y={centerY + 2.5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-black uppercase tracking-wider pointer-events-none"
              fill={
                state.selectedNode === "central" || hoveredNode === "central" ? "#fff" : "#000"
              }
              style={{ fontSize: "2.5px" }}
            >
              TSUKAMOTO
            </text>
          </g>

          {Object.entries(disciplinePositions).map(([disciplineId, pos]) => {
            const isSelected = state.selectedNode === disciplineId;
            const isHovered = hoveredNode === disciplineId;
            const meta = NODE_META[disciplineId as DisciplineId];

            return (
              <g
                key={disciplineId}
                className="cursor-pointer"
                onClick={() => {
                  handleNodeClick(disciplineId, disciplineId as DisciplineId);
                  handleDisciplineClick(disciplineId as DisciplineId);
                }}
                onMouseEnter={() => setHoveredNode(disciplineId)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <path
                  d={createPentagonPath(pos.x, pos.y, 7)}
                  fill={isSelected || isHovered ? "#000" : "#fff"}
                  stroke={isSelected || isHovered ? "#000" : meta.color}
                  strokeWidth={isSelected || isHovered ? "0.3" : "0.2"}
                  className="transition-all duration-300"
                  style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-black uppercase tracking-wider pointer-events-none"
                  fill={isSelected || isHovered ? "#fff" : "#000"}
                  style={{ fontSize: "1.4px" }}
                >
                  {meta.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {state.viewMode === "list" && (
        <div className="mx-auto h-full max-w-4xl overflow-y-auto px-3 pb-12 pt-20 sm:px-6 sm:pt-24">
          <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tighter mb-6 sm:mb-10">
            Portfolio
          </h1>
          <div className="space-y-8 sm:space-y-10">
            {disciplines.map((discipline) => (
              <section key={discipline.id}>
                <Link
                  href={disciplineHref(discipline.id)}
                  className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 group"
                >
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                    style={{ backgroundColor: discipline.color }}
                  />
                  <h2 className="text-sm sm:text-xl font-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                    {discipline.name}
                  </h2>
                </Link>

                {discipline.activities.length === 0 ? (
                  <p className="text-xs text-gray-400 pl-4 sm:pl-6">Coming soon</p>
                ) : (
                  <ul className="space-y-3 pl-4 sm:pl-6 border-l border-black/10">
                    {discipline.activities.map((activity) => (
                      <li key={activity.id}>
                        <Link
                          href={activityHref(discipline.id, activity.slug)}
                          className="text-sm sm:text-base font-bold tracking-tight hover:text-blue-600 transition-colors"
                        >
                          {activity.name}
                        </Link>
                        {activity.contents.length > 0 && (
                          <ul className="mt-2 space-y-1.5 pl-4 border-l border-black/5">
                            {activity.contents.map((content) => (
                              <li key={content.id}>
                                <Link
                                  href={contentHref(
                                    discipline.id,
                                    activity.slug,
                                    content.slug
                                  )}
                                  className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors"
                                >
                                  {content.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      )}
      </section>

      <section id="personal" className="border-t border-black/10 bg-white px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.3em] text-black/35">Personal / About</p>
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-.06em] sm:text-6xl">Beyond the<br />five points.</h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl leading-9 tracking-tight text-black/75 sm:text-2xl sm:leading-10">Ryusei Tsukamoto is a multi-disciplinary creator working across software, visual expression, music, writing, and research.</p>
            <p className="mt-8 text-sm leading-7 text-black/50">この五角形は、活動領域をひとつの場所から眺めるためのホームです。Developerとしてサービスをつくり、Illustratorとして視覚化し、Musician・Blogger・Investorとして考えたことを外へ広げています。</p>
            <div className="mt-10 flex flex-wrap gap-2">{["Tokyo / Japan", "Creative Technology", "Independent Work"].map((item) => <span key={item} className="rounded-full border border-black/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-black/50">{item}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#f7f7f5] py-16">
        <div className="mb-8 px-6 text-center sm:px-10"><p className="text-[10px] font-bold uppercase tracking-[.3em] text-black/35">Tools / Services / Platforms</p><h2 className="mt-3 text-2xl font-bold tracking-tight">Built with and around these services.</h2></div>
        <ServiceMarquee />
      </section>

      <Link href="/admin" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-black/45 shadow-lg backdrop-blur transition hover:border-black hover:text-black" aria-label="Open Admin">
        <span className="h-1.5 w-1.5 rounded-full bg-black/35" /> Admin
      </Link>
    </div>
  );
}
