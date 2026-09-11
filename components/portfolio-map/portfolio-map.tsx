"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PortfolioMapState, DisciplineId } from "@/types/portfolio-map";

const DISCIPLINES: Record<DisciplineId, { label: string; color: string }> = {
  developer: { label: "Developer", color: "#2563eb" },
  illustrator: { label: "Illustrator", color: "#7c3aed" },
  musician: { label: "Musician", color: "#db2777" },
  blogger: { label: "Blogger", color: "#059669" },
  investor: { label: "Investor", color: "#d97706" },
};

export function PortfolioMap() {
  const [state, setState] = useState<PortfolioMapState>({
    selectedNode: null,
    viewMode: "map",
    breadcrumb: ["HOME"],
  });

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Central node position (center of viewport)
  const centerX = 50;
  const centerY = 50;

  // Discipline node positions (radial layout)
  const disciplinePositions: Record<DisciplineId, { x: number; y: number }> = {
    developer: { x: 50, y: 18 },    // Top
    illustrator: { x: 82, y: 35 },  // Top-right
    musician: { x: 75, y: 72 },    // Bottom-right
    blogger: { x: 25, y: 72 },    // Bottom-left
    investor: { x: 18, y: 35 },   // Top-left
  };

  const handleNodeClick = (nodeId: string, disciplineId?: DisciplineId) => {
    setState((prev) => ({
      ...prev,
      selectedNode: nodeId,
      breadcrumb: disciplineId ? ["HOME", DISCIPLINES[disciplineId].label] : ["HOME"],
    }));
  };

  const handleDisciplineClick = (disciplineId: DisciplineId) => {
    // Navigate to discipline page
    window.location.href = `/disciplines/${disciplineId}`;
  };

  const handleCentralNodeClick = () => {
    // Navigate to profile page
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

  // Pentagon SVG path generator
  const createPentagonPath = (cx: number, cy: number, size: number) => {
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * (Math.PI / 180); // Start from top
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")} Z`;
  };

  return (
    <div className="w-full h-screen bg-white overflow-hidden relative">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-md border-b border-black/10 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-600">
            {state.breadcrumb.map((item, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2 text-gray-300">/</span>}
                <span className={index === state.breadcrumb.length - 1 ? "text-black" : ""}>
                  {item}
                </span>
              </span>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleViewMode}
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border border-black/15 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:border-black hover:bg-black hover:text-white transition-all"
            >
              {state.viewMode === "map" ? "List View" : "Map View"}
            </button>
            <button
              onClick={handleHomeClick}
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest bg-black text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-gray-800 transition-all"
            >
              Home
            </button>
            <Link
              href="/portfolio"
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors hidden sm:block"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </nav>

      {/* Map View */}
      {state.viewMode === "map" && (
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Connection Lines */}
          {Object.entries(disciplinePositions).map(([disciplineId, pos]) => {
            const isSelected = state.selectedNode === disciplineId;
            const isHovered = hoveredNode === disciplineId;
            const isCentralSelected = state.selectedNode === "central";
            
            return (
              <line
                key={disciplineId}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke={isSelected || isHovered ? "#000" : isCentralSelected ? "#666" : "#e5e5e5"}
                strokeWidth={isSelected || isHovered ? "0.4" : isCentralSelected ? "0.25" : "0.15"}
                className="transition-all duration-300"
                style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
              />
            );
          })}

          {/* Central Node - RYUSEI TSUKAMOTO */}
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
              d={createPentagonPath(centerX, centerY, 13)}
              fill={state.selectedNode === "central" || hoveredNode === "central" ? "#000" : "#fff"}
              stroke="#000"
              strokeWidth="0.35"
              className="transition-all duration-300"
              style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            <text
              x={centerX}
              y={centerY - 1.5}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[2px] font-black uppercase tracking-wider pointer-events-none"
              fill={state.selectedNode === "central" || hoveredNode === "central" ? "#fff" : "#000"}
              style={{ fontSize: "2px" }}
            >
              RYUSEI
            </text>
            <text
              x={centerX}
              y={centerY + 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[2px] font-black uppercase tracking-wider pointer-events-none"
              fill={state.selectedNode === "central" || hoveredNode === "central" ? "#fff" : "#000"}
              style={{ fontSize: "2px" }}
            >
              TSUKAMOTO
            </text>
          </g>

          {/* Discipline Nodes */}
          {Object.entries(disciplinePositions).map(([disciplineId, pos]) => {
            const isSelected = state.selectedNode === disciplineId;
            const isHovered = hoveredNode === disciplineId;
            const discipline = DISCIPLINES[disciplineId as DisciplineId];
            
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
                  d={createPentagonPath(pos.x, pos.y, 6.5)}
                  fill={isSelected || isHovered ? "#000" : "#fff"}
                  stroke="#000"
                  strokeWidth="0.25"
                  className="transition-all duration-300"
                  style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[1.3px] font-black uppercase tracking-wider pointer-events-none"
                  fill={isSelected || isHovered ? "#fff" : "#000"}
                  style={{ fontSize: "1.3px" }}
                >
                  {discipline.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* List View */}
      {state.viewMode === "list" && (
        <div className="pt-24 px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-8 sm:mb-12">
            All Disciplines
          </h1>
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(DISCIPLINES).map(([disciplineId, { label, color }]) => (
              <Link
                key={disciplineId}
                href={`/disciplines/${disciplineId}`}
                className="block"
              >
                <div
                  className="group border border-black/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-black/30 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => handleNodeClick(disciplineId, disciplineId as DisciplineId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div 
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <h2 className="text-base sm:text-xl font-black uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                        {label}
                      </h2>
                    </div>
                    <span className="text-gray-300 text-lg sm:text-xl group-hover:text-black transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
