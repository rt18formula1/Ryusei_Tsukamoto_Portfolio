import { PORTFOLIO_HIERARCHY } from "./portfolio-hierarchy/data";
import type { DbPortfolioActivity, PortfolioHierarchy } from "@/types/portfolio-hierarchy";
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
export function buildUnifiedHierarchy(dbProjects: DbDevProject[] = [], dbActivities: DbPortfolioActivity[] = []): PortfolioHierarchy {
  const baseHierarchy = structuredClone(PORTFOLIO_HIERARCHY);

  for (const activity of dbActivities.filter((item) => item.visible)) {
    const discipline = baseHierarchy.disciplines.find((d) => d.id === activity.discipline_id);
    if (!discipline) continue;
    const mappedActivity = {
      id: activity.id,
      name: activity.name,
      slug: activity.slug,
      description: activity.description || undefined,
      disciplineId: activity.discipline_id,
      visual: activity.visual || undefined,
      links: activity.links || [],
      contentType: "project",
      contents: [],
      displayOrder: activity.display_order,
      visible: activity.visible,
    };
    const existing = discipline.activities.find((item) => item.id === activity.id || item.slug === activity.slug);
    if (existing) Object.assign(existing, mappedActivity);
    else discipline.activities.push(mappedActivity);
  }
  for (const discipline of baseHierarchy.disciplines) {
    discipline.activities.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  }

  for (const project of dbProjects) {
    const discipline = baseHierarchy.disciplines.find((d) => d.id === project.discipline_id);
    if (!discipline) continue;

    // Use the first activity, or create a default one if the discipline has none
    let activity = discipline.activities[0];
    if (!activity) {
      activity = {
        id: `${discipline.id}-projects`,
        name: `${discipline.name} Projects`,
        slug: `${discipline.slug}-projects`,
        disciplineId: discipline.id,
        contentType: "project",
        contents: [],
      };
      discipline.activities.push(activity);
    }

    const existingIds = new Set(activity.contents.map((c) => c.projectId || c.id));
    if (!existingIds.has(project.id)) {
      activity.contents.push(projectContent(project));
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
