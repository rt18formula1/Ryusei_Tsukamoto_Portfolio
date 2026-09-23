"use client";

import { useState, useRef, useEffect } from "react";
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
          <div key={`${service.name}-${index}`} className="flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-[10px] font-bold uppercase tracking-[.14em] text-black/55 shadow-sm sm:h-12 sm:gap-3 sm:px-5 sm:text-xs sm:tracking-[.16em]">
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
  const [isMounted, setIsMounted] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const disciplines = getDisciplines();

  const centerX = 50;
  const centerY = 50;

  const disciplinePositions: Record<DisciplineId, { x: number; y: number }> = {
    developer: { x: 50, y: 18 },
    illustrator: { x: 82, y: 35 },
    musician: { x: 75, y: 78 },
    blogger: { x: 25, y: 78 },
    investor: { x: 18, y: 35 },
  };

  // Calculate pentagon vertices
  const getPentagonVertices = (cx: number, cy: number, size: number) => {
    const vertices = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * (Math.PI / 180);
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      vertices.push({ x, y });
    }
    return vertices;
  };

  // Calculate edge midpoints and outward normals
  const getEdgeData = (vertices: Array<{ x: number; y: number }>) => {
    const edges = [];
    for (let i = 0; i < 5; i++) {
      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % 5];
      
      // Midpoint
      const midX = (v1.x + v2.x) / 2;
      const midY = (v1.y + v2.y) / 2;
      
      // Edge vector
      const edgeX = v2.x - v1.x;
      const edgeY = v2.y - v1.y;
      
      // Outward normal (perpendicular to edge, pointing outward from center)
      const normalX = -edgeY;
      const normalY = edgeX;
      const length = Math.sqrt(normalX * normalX + normalY * normalY);
      const normalizedNormalX = normalX / length;
      const normalizedNormalY = normalY / length;
      
      // Edge length
      const edgeLength = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
      
      edges.push({
        index: i,
        midpoint: { x: midX, y: midY },
        normal: { x: normalizedNormalX, y: normalizedNormalY },
        length: edgeLength,
      });
    }
    return edges;
  };

  // Calculate initial position for surrounding pentagon (edge-to-edge contact)
  const getInitialPosition = (edgeIndex: number) => {
    const centralVertices = getPentagonVertices(centerX, centerY, 15);
    const edges = getEdgeData(centralVertices);
    const edge = edges[edgeIndex];
    
    // For edge-to-edge contact, the surrounding pentagon's center should be positioned
    // such that its corresponding edge aligns with the central pentagon's edge
    // The distance from center to edge midpoint (apothem) for a regular pentagon with edge length L is:
    // apothem = L / (2 * tan(π/5))
    // But we're using circumradius (size parameter), so we need to calculate the apothem from that
    
    // Apothem = size * cos(π/5) for regular pentagon
    const centralApothem = 15 * Math.cos(Math.PI / 5);
    
    // Initial position: edge midpoint + (apothem * normal)
    // This places the surrounding pentagon's center at the correct distance for edge-to-edge contact
    const initialX = edge.midpoint.x + centralApothem * edge.normal.x;
    const initialY = edge.midpoint.y + centralApothem * edge.normal.y;
    
    return { x: initialX, y: initialY };
  };

  // Map discipline IDs to edge indices (top, top-right, bottom-right, bottom-left, top-left)
  const disciplineEdgeMap: Record<DisciplineId, number> = {
    developer: 0,    // top edge
    illustrator: 1,  // top-right edge
    musician: 2,    // bottom-right edge
    blogger: 3,     // bottom-left edge
    investor: 4,    // top-left edge
  };

  // Calculate initial positions for all disciplines
  const initialPositions: Record<DisciplineId, { x: number; y: number }> = {
    developer: getInitialPosition(0),
    illustrator: getInitialPosition(1),
    musician: getInitialPosition(2),
    blogger: getInitialPosition(3),
    investor: getInitialPosition(4),
  };

  // Animation trigger on mount
  useEffect(() => {
    setIsMounted(true);
    // Text fade-in after pentagons start expanding
    const textTimer = setTimeout(() => setTextVisible(true), 800);
    return () => clearTimeout(textTimer);
  }, []);

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
      <section className="relative h-[100svh] min-h-[560px] max-h-[900px] overflow-hidden" role="region" aria-label="Portfolio Map Explorer">
      <nav className="absolute left-0 right-0 top-0 z-10 border-b border-black/10 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-8 sm:py-4 lg:px-12" aria-label="Portfolio Navigation">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <HierarchyBreadcrumb items={breadcrumbItems} />

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={toggleViewMode}
              aria-label={`Switch to ${state.viewMode === "map" ? "List" : "Map"} view`}
              className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest border border-black/15 rounded-full px-2 sm:px-4 py-1 sm:py-2 hover:border-black hover:bg-black hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-black"
            >
              {state.viewMode === "map" ? "List" : "Map"}
            </button>
            <button
              onClick={handleHomeClick}
              aria-label="Reset view to portfolio home"
              className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-2 sm:px-4 py-1 sm:py-2 hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-black"
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
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Interactive portfolio five-point discipline map"
        >
          {/* Connection lines - rendered first (bottom layer) */}
          {Object.entries(disciplinePositions).map(([disciplineId, pos]) => {
            const isSelected = state.selectedNode === disciplineId;
            const isHovered = hoveredNode === disciplineId;
            const isCentralSelected = state.selectedNode === "central";
            const isCentralHovered = hoveredNode === "central";
            const initialPos = initialPositions[disciplineId as DisciplineId];
            const edgeIndex = disciplineEdgeMap[disciplineId as DisciplineId];
            
            // Calculate vertex for line start (from central pentagon vertex)
            const centralVertices = getPentagonVertices(centerX, centerY, 15);
            const vertex = centralVertices[edgeIndex];

            return (
              <line
                key={`line-${disciplineId}`}
                x1={vertex.x}
                y1={vertex.y}
                x2={isMounted ? pos.x : vertex.x}
                y2={isMounted ? pos.y : vertex.y}
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
                className="transition-all"
                style={{
                  transitionDuration: isMounted ? "1200ms" : "0ms",
                  transitionDelay: isMounted ? "100ms" : "0ms",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            );
          })}

          {/* Surrounding pentagons - rendered before central (behind layer) */}
          {Object.entries(disciplinePositions).map(([disciplineId, pos]) => {
            const isSelected = state.selectedNode === disciplineId;
            const isHovered = hoveredNode === disciplineId;
            const meta = NODE_META[disciplineId as DisciplineId];
            const initialPos = initialPositions[disciplineId as DisciplineId];
            const edgeIndex = disciplineEdgeMap[disciplineId as DisciplineId];
            
            // Calculate rotation for animation (±5-15 degrees based on edge index)
            const rotation = isMounted ? 0 : (edgeIndex % 2 === 0 ? 10 : -10);
            
            // Initial size matches central pentagon for edge-to-edge contact
            const initialSize = 15;
            const finalSize = 7;

            return (
              <g
                key={`pentagon-${disciplineId}`}
                className="cursor-pointer focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label={`View ${meta.label} discipline projects`}
                onClick={() => {
                  handleNodeClick(disciplineId, disciplineId as DisciplineId);
                  handleDisciplineClick(disciplineId as DisciplineId);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNodeClick(disciplineId, disciplineId as DisciplineId);
                    handleDisciplineClick(disciplineId as DisciplineId);
                  }
                }}
                onMouseEnter={() => setHoveredNode(disciplineId)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <g
                  style={{
                    transform: `translate(${isMounted ? pos.x : initialPos.x}px, ${isMounted ? pos.y : initialPos.y}px) rotate(${rotation}deg)`,
                    transformOrigin: "center",
                    transition: "transform",
                    transitionDuration: isMounted ? "1200ms" : "0ms",
                    transitionDelay: isMounted ? "100ms" : "0ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <path
                    d={createPentagonPath(0, 0, isMounted ? finalSize : initialSize)}
                    fill={isSelected || isHovered ? "#000" : "#fff"}
                    stroke={isSelected || isHovered ? "#000" : meta.color}
                    strokeWidth={isSelected || isHovered ? "0.3" : "0.2"}
                    style={{
                      transition: "d",
                      transitionDuration: isMounted ? "1200ms" : "0ms",
                      transitionDelay: isMounted ? "100ms" : "0ms",
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </g>
                <text
                  x={isMounted ? pos.x : initialPos.x}
                  y={isMounted ? pos.y : initialPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-black uppercase tracking-wider pointer-events-none"
                  fill={isSelected || isHovered ? "#fff" : "#000"}
                  style={{ 
                    fontSize: isMounted ? "1.4px" : "2px",
                    opacity: textVisible ? 1 : 0,
                    transition: "font-size 1200ms, x 1200ms, y 1200ms, opacity 400ms",
                    transitionDelay: isMounted ? "100ms" : "0ms",
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {meta.label}
                </text>
              </g>
            );
          })}

          {/* Activity nodes — fade in on discipline hover */}
          {Object.entries(disciplinePositions).flatMap(([disciplineId, pos]) => {
            const discipline = disciplines.find((d) => d.id === disciplineId);
            if (!discipline || discipline.activities.length === 0) return [];
            const isHovered = hoveredNode === disciplineId;
            const meta = NODE_META[disciplineId as DisciplineId];
            const dx = pos.x - centerX;
            const dy = pos.y - centerY;
            const baseAngle = Math.atan2(dy, dx);
            const distance = 8;
            const spread = Math.PI * 0.55;
            const n = discipline.activities.length;

            return discipline.activities.map((activity, i) => {
              const angle = n === 1
                ? baseAngle
                : baseAngle - spread / 2 + (i / (n - 1)) * spread;
              const ax = pos.x + distance * Math.cos(angle);
              const ay = pos.y + distance * Math.sin(angle);

              return (
                <g key={`activity-${activity.id}`}>
                  {/* Connection line from discipline to activity */}
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={ax}
                    y2={ay}
                    stroke={meta.color}
                    strokeWidth="0.15"
                    style={{
                      opacity: isHovered ? 0.5 : 0,
                      transition: "opacity 300ms ease-out",
                      transitionDelay: `${i * 60}ms`,
                    }}
                  />
                  {/* Activity pentagon */}
                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      window.location.href = activityHref(
                        disciplineId as DisciplineId,
                        activity.slug
                      );
                    }}
                    onMouseEnter={() => setHoveredNode(disciplineId)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <path
                      d={createPentagonPath(ax, ay, 3)}
                      fill={isHovered ? meta.color : "#fff"}
                      stroke={meta.color}
                      strokeWidth="0.2"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 300ms ease-out",
                        transitionDelay: `${i * 60}ms`,
                        pointerEvents: isHovered ? "auto" : "none",
                      }}
                    />
                    <text
                      x={ax}
                      y={ay}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold pointer-events-none"
                      fill={isHovered ? "#fff" : "#000"}
                      style={{
                        fontSize: "0.9px",
                        opacity: isHovered ? 1 : 0,
                        transition: "opacity 300ms ease-out",
                        transitionDelay: `${i * 60 + 100}ms`,
                      }}
                    >
                      {activity.name.length > 12
                        ? activity.name.slice(0, 10) + "…"
                        : activity.name}
                    </text>
                  </g>
                </g>
              );
            });
          })}

          {/* Central pentagon - rendered last (top layer, in front) */}
          <g
            className="cursor-pointer focus:outline-none"
            role="button"
            tabIndex={0}
            aria-label="Ryusei Tsukamoto Profile Page"
            onClick={() => {
              handleNodeClick("central");
              handleCentralNodeClick();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleNodeClick("central");
                handleCentralNodeClick();
              }
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
              className="transition-all"
              style={{ 
                transitionDuration: "300ms",
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" 
              }}
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

      <section id="personal" className="border-t border-black/10 bg-white px-5 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 sm:gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.3em] text-black/35">Personal / About</p>
            <h2 className="mt-5 text-4xl font-black uppercase tracking-[-.06em] sm:text-5xl lg:text-6xl">Beyond the<br />five points.</h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-xl leading-9 tracking-tight text-black/75 sm:text-2xl sm:leading-10">Ryusei Tsukamoto is a multi-disciplinary creator working across software, visual expression, music, writing, and research.</p>
            <p className="mt-8 text-sm leading-7 text-black/50">この五角形は、活動領域をひとつの場所から眺めるためのホームです。Developerとしてサービスをつくり、Illustratorとして視覚化し、Musician・Blogger・Investorとして考えたことを外へ広げています。</p>
            <div className="mt-10 flex flex-wrap gap-2">{["Tokyo / Japan", "Creative Technology", "Independent Work"].map((item) => <span key={item} className="rounded-full border border-black/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-black/50">{item}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="services" className="bg-[#f7f7f5] py-12 sm:py-16">
        <div className="mb-7 px-5 text-center sm:mb-8 sm:px-10"><p className="text-[10px] font-bold uppercase tracking-[.3em] text-black/35">Tools / Services / Platforms</p><h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">Built with and around these services.</h2></div>
        <ServiceMarquee />
      </section>

      <Link href="/admin" className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-black/45 shadow-lg backdrop-blur transition hover:border-black hover:text-black sm:bottom-6 sm:right-6" aria-label="Open Admin">
        <span className="h-1.5 w-1.5 rounded-full bg-black/35" /> Admin
      </Link>
    </div>
  );
}
