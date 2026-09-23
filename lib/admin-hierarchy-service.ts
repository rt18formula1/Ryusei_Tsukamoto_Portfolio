import { PORTFOLIO_HIERARCHY } from "./portfolio-hierarchy/data";
import type {
  PortfolioHierarchy,
  Discipline,
  Activity,
  HierarchyContent,
  DisciplineId,
} from "@/types/portfolio-hierarchy";
import type { DbDevProject } from "./supabase-queries";
import { projectContent, projectIsPublished } from "./portfolio-projects";

export interface HierarchyStats {
  disciplinesCount: number;
  activitiesCount: number;
  projectsCount: number;
  publishedCount: number;
  inDevCount: number;
  privateCount: number;
}

/**
 * Builds the full live unified hierarchy tree combining base definitions and Supabase projects.
 */
export function buildUnifiedHierarchy(dbProjects: DbDevProject[] = []): PortfolioHierarchy {
  const baseHierarchy = structuredClone(PORTFOLIO_HIERARCHY);

  const developerDiscipline = baseHierarchy.disciplines.find((d) => d.id === "developer");
  if (developerDiscipline) {
    let rt18Dev = developerDiscipline.activities.find((a) => a.id === "rt18-dev");
    if (!rt18Dev) {
      rt18Dev = {
        id: "rt18-dev",
        name: "rt18_dev",
        slug: "rt18-dev",
        disciplineId: "developer",
        contentType: "project",
        contents: [],
      };
      developerDiscipline.activities.unshift(rt18Dev);
    }

    const existingIds = new Set(rt18Dev.contents.map((c) => c.projectId || c.id));
    for (const project of dbProjects) {
      if (!existingIds.has(project.id)) {
        rt18Dev.contents.push(projectContent(project));
      }
    }
  }

  return baseHierarchy;
}

/**
 * Computes dashboard statistics from the unified hierarchy and db projects.
 */
export function computeHierarchyStats(
  hierarchy: PortfolioHierarchy,
  dbProjects: DbDevProject[]
): HierarchyStats {
  const disciplinesCount = hierarchy.disciplines.length;
  let activitiesCount = 0;
  let projectsCount = dbProjects.length;

  for (const d of hierarchy.disciplines) {
    activitiesCount += d.activities.length;
  }

  let publishedCount = 0;
  let inDevCount = 0;
  let privateCount = 0;

  for (const p of dbProjects) {
    const isPub = projectIsPublished(p);
    if (isPub) {
      publishedCount++;
    }

    // Extract status from general items
    const info = Array.isArray(p.information) ? p.information : [];
    const general = info.find((item: any) => item?.category === "GENERAL");
    const status = general?.items?.find((item: any) => item?.label === "Status")?.value;

    if (status === "In Development") {
      inDevCount++;
    } else if (status === "Private" || status === "Archived") {
      privateCount++;
    }
  }

  return {
    disciplinesCount,
    activitiesCount,
    projectsCount,
    publishedCount,
    inDevCount,
    privateCount,
  };
}
