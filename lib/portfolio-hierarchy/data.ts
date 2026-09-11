import type { PortfolioHierarchy } from "@/types/portfolio-hierarchy";
import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";

/**
 * Single source of truth for Portfolio → Discipline → Activity → Content.
 * Developer projects reuse existing mock / project ids (no invented placeholders).
 * Other disciplines declare Activity shells for future extension.
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
          contents: [
            {
              id: MOCK_DEV_PROJECT.id,
              name: MOCK_DEV_PROJECT.projectName,
              slug: "f1-sns-post-automator",
              type: "project",
              description: MOCK_DEV_PROJECT.shortDescription,
              mainVisualUrl: MOCK_DEV_PROJECT.mainVisualUrl,
              projectId: MOCK_DEV_PROJECT.id,
            },
            {
              id: MOCK_DEV_PROJECT_2.id,
              name: MOCK_DEV_PROJECT_2.projectName,
              slug: "portfolio-generator",
              type: "project",
              description: MOCK_DEV_PROJECT_2.shortDescription,
              mainVisualUrl: MOCK_DEV_PROJECT_2.mainVisualUrl,
              projectId: MOCK_DEV_PROJECT_2.id,
            },
          ],
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
