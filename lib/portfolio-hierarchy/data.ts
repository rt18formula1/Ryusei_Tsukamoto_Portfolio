import type { PortfolioHierarchy } from "@/types/portfolio-hierarchy";

/**
 * Single source of truth for Portfolio → Discipline → Activity → Content.
 * Base hierarchy contains stable disciplines and activity entities only.
 * Projects are appended from Supabase at render time.
 */
export const PORTFOLIO_HIERARCHY: PortfolioHierarchy = {
  disciplines: [
    {
      id: "developer",
      name: "Developer",
      slug: "developer",
      description:
        "Full-stack web applications, automation pipelines, and software tools built with Next.js, TypeScript, Supabase, and Cloudflare.",
      color: "#2563eb",
      activities: [
        {
          id: "rt18-dev",
          name: "rt18_dev",
          slug: "rt18-dev",
          description: "Development work under the rt18_dev brand.",
          disciplineId: "developer",
          contentType: "project",
          contents: [],
        },
      ],
    },
    {
      id: "illustrator",
      name: "Illustrator",
      slug: "illustrator",
      description:
        "Digital illustrations, graphic art, and visual content focusing on Formula 1, motorsport moments, and creative graphics.",
      color: "#7c3aed",
      activities: [
        {
          id: "rt18-formula1",
          name: "rt18_formula1",
          slug: "rt18-formula1",
          description: "Formula 1 illustration and visual work.",
          disciplineId: "illustrator",
          contentType: "artwork",
          contents: [],
        },
      ],
    },
    {
      id: "musician",
      name: "Musician",
      slug: "musician",
      description: "Sound design, music composition, and audio content production.",
      color: "#db2777",
      activities: [
        {
          id: "rt18-music",
          name: "rt18_music",
          slug: "rt18-music",
          disciplineId: "musician",
          contents: [],
        },
        {
          id: "fine-day-plus",
          name: "Fine Day Plus",
          slug: "fine-day-plus",
          disciplineId: "musician",
          contents: [],
        },
      ],
    },
    {
      id: "blogger",
      name: "Blogger",
      slug: "blogger",
      description:
        "Technical articles, development logs, design notes, and analytical writings on note and technical blogs.",
      color: "#059669",
      activities: [],
    },
    {
      id: "investor",
      name: "Investor",
      slug: "investor",
      description:
        "Market research and investment activities in tech sectors, growth companies, and emerging markets.",
      color: "#d97706",
      activities: [],
    },
  ],
};
