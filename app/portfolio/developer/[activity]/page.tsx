import { notFound } from "next/navigation";
import { ActivityContentsClient } from "@/components/discipline/activity-contents-client";
import { getDevProjects, getPortfolioActivities, getEquipmentSectionsWithItems, type DbDevProject } from "@/lib/supabase-queries";
import { buildUnifiedHierarchy } from "@/lib/admin-hierarchy-service";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";
import { projectContent, projectIsPublished } from "@/lib/portfolio-projects";
import type { DeveloperProject } from "@/types/dev-project";
import type { DbPortfolioActivity } from "@/types/portfolio-hierarchy";
import type { EquipmentSection } from "@/types/equipment";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ activity: string }>;
}

export default async function DeveloperActivityPage({ params }: PageProps) {
  const { activity: activitySlug } = await params;
  let dbProjects: DbDevProject[] = [];
  let dbActivities: DbPortfolioActivity[] = [];
  let equipmentSections: EquipmentSection[] = [];
  try {
    [dbProjects, dbActivities, equipmentSections] = await Promise.all([
      getDevProjects(),
      getPortfolioActivities("developer"),
      getEquipmentSectionsWithItems("developer"),
    ]);
  } catch (error) {
    console.warn("Failed to fetch database projects:", error);
  }

  const publishedProjects = dbProjects.filter(projectIsPublished);
  const hierarchy = buildUnifiedHierarchy(publishedProjects, dbActivities);
  const discipline = hierarchy.disciplines.find((item) => item.id === "developer");
  const baseActivity = discipline?.activities.find((item) => item.slug === activitySlug);
  if (!discipline || !baseActivity) notFound();

  const projectsById: Record<string, DeveloperProject> = {};

  for (const project of publishedProjects) {
    try {
      projectsById[project.id] = mapDbToDevProject(project);
    } catch (e) {
      console.warn(`Failed to map project ${project.id}:`, e);
    }
  }

  const dbContents = activitySlug === baseActivity.slug ? publishedProjects.map(projectContent) : [];
  const existingIds = new Set(baseActivity.contents.map((content) => content.projectId || content.id));
  const activity = {
    ...baseActivity,
    contents: [
      ...baseActivity.contents,
      ...dbContents.filter((content) => !existingIds.has(content.projectId || content.id)),
    ],
  };

  return (
    <ActivityContentsClient
      discipline={discipline}
      activity={activity}
      projectsById={projectsById}
      equipmentSections={equipmentSections.filter((section) => section.visible)}
    />
  );
}
