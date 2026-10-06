"use client";

import type { ReactNode } from "react";
import type { Discipline, Activity } from "@/types/portfolio-hierarchy";
import type { DisciplineId } from "@/types/portfolio-map";
import { activityHref, contentHref } from "@/lib/portfolio-hierarchy";

interface HierarchyMapNodesProps {
  discipline: Discipline | null;
  disciplinePos: { x: number; y: number };
  centerX: number;
  centerY: number;
}

/** Pentagon vertex angles in radians (matches createPentagonPath: i*72-90) */
const VERTEX_ANGLES = [-90, -18, 54, 126, 198].map((a) => (a * Math.PI) / 180);

// Child activities/projects should read as a slightly smaller layer than the
// five top-level discipline pentagons, while remaining large enough to scan.
const SIZE_RATIO = 0.84; // child pentagon / parent pentagon
const GAP = 1.5; // space between parent edge and child edge
const DISCIPLINE_SIZE = 7; // matches the discipline pentagon in the main map

interface TreeNode {
  id: string;
  name: string;
  href: string;
  children: TreeNode[];
}

function toTree(activity: Activity, disciplineId: DisciplineId): TreeNode {
  return {
    id: activity.id,
    name: activity.name,
    href: activityHref(disciplineId, activity.slug),
    children: activity.contents.map((c) => ({
      id: c.id,
      name: c.name,
      href: contentHref(disciplineId, activity.slug, c.slug),
      children: [],
    })),
  };
}

function pentagonPath(cx: number, cy: number, size: number): string {
  const pts = VERTEX_ANGLES.map(
    (a) => `${cx + size * Math.cos(a)},${cy + size * Math.sin(a)}`
  );
  return `M ${pts.join(" L ")} Z`;
}

/** Find the pentagon vertex closest to the outward direction from map center. */
function outwardVertex(
  center: { x: number; y: number },
  size: number,
  angle: number
): { x: number; y: number } {
  let best = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < 5; i++) {
    let d = VERTEX_ANGLES[i] - angle;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    d = Math.abs(d);
    if (d < bestDiff) {
      bestDiff = d;
      best = i;
    }
  }
  return {
    x: center.x + size * Math.cos(VERTEX_ANGLES[best]),
    y: center.y + size * Math.sin(VERTEX_ANGLES[best]),
  };
}

/** Calculate a font size that fits the text inside the pentagon (no truncation). */
function fitFont(text: string, size: number): number {
  const maxFont = size * 0.2;
  const availableWidth = size * 1.52; // safe width inside the pentagon
  const charWidthRatio = 0.6;
  const calculated = availableWidth / (text.length * charWidthRatio);
  return Math.min(maxFont, Math.max(0.25, calculated));
}

/** Position children radiating outward from the parent's outward vertex. */
function childPositions(
  vertex: { x: number; y: number },
  parentCenter: { x: number; y: number },
  childSize: number,
  count: number,
  cx: number,
  cy: number
): { x: number; y: number }[] {
  const dx = parentCenter.x - cx;
  const dy = parentCenter.y - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const dirX = dx / len;
  const dirY = dy / len;
  const perpX = -dirY;
  const perpY = dirX;

  const dist = childSize + GAP;
  const spread = Math.max(childSize * 2.5, count * childSize * 0.9);

  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : (i / (count - 1) - 0.5) * 2;
    return {
      x: vertex.x + dirX * dist + perpX * t * spread,
      y: vertex.y + dirY * dist + perpY * t * spread,
    };
  });
}

/** Recursively render a node as a pentagon with lines to its children. */
function renderNode(
  node: TreeNode,
  pos: { x: number; y: number },
  size: number,
  color: string,
  cx: number,
  cy: number
): ReactNode {
  const childSize = size * SIZE_RATIO;
  const kids = node.children;

  const angle = Math.atan2(pos.y - cy, pos.x - cx);
  const v = outwardVertex(pos, size, angle);
  const cps =
    kids.length > 0
      ? childPositions(v, pos, childSize, kids.length, cx, cy)
      : [];
  const fs = fitFont(node.name, size);
  // Longer names use SVG text compression so they never overflow the node.
  // Short labels keep their natural width and therefore do not look stretched.
  const textLength = node.name.length > 10 ? size * 1.48 : undefined;

  return (
    <g
      key={node.id}
      className="cursor-pointer"
      role="link"
      aria-label={node.name}
      onClick={() => {
        window.location.href = node.href;
      }}
    >
      <path
        d={pentagonPath(pos.x, pos.y, size)}
        fill={color}
        stroke={color}
        strokeWidth="0.2"
      />
      <text
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-bold pointer-events-none"
        fill="#fff"
        style={{ fontSize: `${fs}px` }}
        textLength={textLength}
        lengthAdjust={textLength ? "spacingAndGlyphs" : undefined}
      >
        {node.name}
      </text>

      {/* Lines from this node's outward vertex to each child */}
      {kids.map((kid, i) => (
        <line
          key={`l-${kid.id}`}
          x1={v.x}
          y1={v.y}
          x2={cps[i].x}
          y2={cps[i].y}
          stroke={color}
          strokeWidth="0.15"
          opacity="0.55"
        />
      ))}

      {/* Render children recursively */}
      {kids.map((kid, i) =>
        renderNode(kid, cps[i], childSize, color, cx, cy)
      )}
    </g>
  );
}

/**
 * Renders the hovered discipline's child hierarchy (activities → contents → …)
 * as pentagon nodes on the SVG map, with lines growing from pentagon vertices.
 */
export function HierarchyMapNodes({
  discipline,
  disciplinePos,
  centerX,
  centerY,
}: HierarchyMapNodesProps) {
  if (!discipline || discipline.activities.length === 0) return null;

  const actSize = DISCIPLINE_SIZE * SIZE_RATIO;
  const angle = Math.atan2(disciplinePos.y - centerY, disciplinePos.x - centerX);
  const dVertex = outwardVertex(disciplinePos, DISCIPLINE_SIZE, angle);
  const acts = discipline.activities;
  const actPos = childPositions(
    dVertex,
    disciplinePos,
    actSize,
    acts.length,
    centerX,
    centerY
  );

  return (
    <g style={{ opacity: 1, transition: "opacity 300ms ease" }}>
      {/* Lines from discipline pentagon's outward vertex to each activity */}
      {acts.map((a, i) => (
        <line
          key={`l-${a.id}`}
          x1={dVertex.x}
          y1={dVertex.y}
          x2={actPos[i].x}
          y2={actPos[i].y}
          stroke={discipline.color}
          strokeWidth="0.15"
          opacity="0.55"
        />
      ))}

      {/* Render each activity (and its children) recursively as pentagons */}
      {acts.map((a, i) =>
        renderNode(toTree(a, discipline.id), actPos[i], actSize, discipline.color, centerX, centerY)
      )}
    </g>
  );
}
