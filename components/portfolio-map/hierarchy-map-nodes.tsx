"use client";

import type { Discipline } from "@/types/portfolio-hierarchy";

interface HierarchyMapNodesProps {
  discipline: Discipline | null;
  disciplinePos: { x: number; y: number };
  centerX: number;
  centerY: number;
}

const ACTIVITY_SIZE = 3.5;
const ACTIVITY_DISTANCE = 10;
const ACTIVITY_SPREAD = 7;
const CONTENT_RADIUS = 1.3;
const CONTENT_DISTANCE = 6.5;
const CONTENT_SPREAD = 4;

function createPentagonPath(cx: number, cy: number, size: number) {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(" L ")} Z`;
}

function truncate(name: string, max: number) {
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

/**
 * Renders the hovered discipline's child hierarchy (activities → contents)
 * as additional nodes directly on the SVG map, radiating outward from the
 * discipline pentagon.
 */
export function HierarchyMapNodes({
  discipline,
  disciplinePos,
  centerX,
  centerY,
}: HierarchyMapNodesProps) {
  if (!discipline || discipline.activities.length === 0) return null;

  // Outward direction from map center → discipline
  const dx = disciplinePos.x - centerX;
  const dy = disciplinePos.y - centerY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const dirX = dx / len;
  const dirY = dy / len;
  const perpX = -dirY;
  const perpY = dirX;

  const activities = discipline.activities;

  const activityPositions = activities.map((_a, i) => {
    const t = activities.length === 1 ? 0 : (i / (activities.length - 1) - 0.5) * 2;
    return {
      x: disciplinePos.x + dirX * ACTIVITY_DISTANCE + perpX * t * ACTIVITY_SPREAD,
      y: disciplinePos.y + dirY * ACTIVITY_DISTANCE + perpY * t * ACTIVITY_SPREAD,
    };
  });

  return (
    <g style={{ opacity: 1, transition: "opacity 300ms ease" }}>
      {/* Lines: discipline → activities */}
      {activities.map((activity, i) => (
        <line
          key={`line-act-${activity.id}`}
          x1={disciplinePos.x}
          y1={disciplinePos.y}
          x2={activityPositions[i].x}
          y2={activityPositions[i].y}
          stroke={discipline.color}
          strokeWidth="0.15"
          opacity="0.55"
        />
      ))}

      {/* Activities + their contents */}
      {activities.map((activity, i) => {
        const actPos = activityPositions[i];
        const contents = activity.contents;

        // Outward direction from center → activity (for content fan-out)
        const cdx = actPos.x - centerX;
        const cdy = actPos.y - centerY;
        const cLen = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
        const cDirX = cdx / cLen;
        const cDirY = cdy / cLen;
        const cPerpX = -cDirY;
        const cPerpY = cDirX;

        const contentPositions = contents.map((_c, j) => {
          const t = contents.length === 1 ? 0 : (j / (contents.length - 1) - 0.5) * 2;
          return {
            x: actPos.x + cDirX * CONTENT_DISTANCE + cPerpX * t * CONTENT_SPREAD,
            y: actPos.y + cDirY * CONTENT_DISTANCE + cPerpY * t * CONTENT_SPREAD,
          };
        });

        return (
          <g key={`act-${activity.id}`}>
            {/* Activity pentagon */}
            <path
              d={createPentagonPath(actPos.x, actPos.y, ACTIVITY_SIZE)}
              fill={discipline.color}
              stroke={discipline.color}
              strokeWidth="0.2"
            />
            <text
              x={actPos.x}
              y={actPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold pointer-events-none"
              fill="#fff"
              style={{ fontSize: "0.9px" }}
            >
              {truncate(activity.name, 12)}
            </text>

            {/* Lines: activity → contents */}
            {contents.map((content, j) => (
              <line
                key={`line-con-${content.id}`}
                x1={actPos.x}
                y1={actPos.y}
                x2={contentPositions[j].x}
                y2={contentPositions[j].y}
                stroke={discipline.color}
                strokeWidth="0.1"
                opacity="0.4"
              />
            ))}

            {/* Content circles */}
            {contents.map((content, j) => (
              <g key={`con-${content.id}`}>
                <circle
                  cx={contentPositions[j].x}
                  cy={contentPositions[j].y}
                  r={CONTENT_RADIUS}
                  fill="#fff"
                  stroke={discipline.color}
                  strokeWidth="0.15"
                />
                <text
                  x={contentPositions[j].x}
                  y={contentPositions[j].y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-medium pointer-events-none"
                  fill="#000"
                  style={{ fontSize: "0.65px" }}
                >
                  {truncate(content.name, 10)}
                </text>
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}
