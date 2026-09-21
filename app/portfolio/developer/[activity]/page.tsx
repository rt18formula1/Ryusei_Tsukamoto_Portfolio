import { notFound } from "next/navigation";
import { ActivityContentsClient } from "@/components/discipline/activity-contents-client";
import { getActivity, getDiscipline } from "@/lib/portfolio-hierarchy";
import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";
import { getDevProjects, type DbDevProject } from "@/lib/supabase-queries";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";
import { projectContent, projectIsPublished } from "@/lib/portfolio-projects";
import type { DeveloperProject } from "@/types/dev-project";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ activity: string }>;
}

export default async function DeveloperActivityPage({ params }: PageProps) {
  const { activity: activitySlug } = await params;
  const discipline = getDiscipline("developer");
  const baseActivity = getActivity("developer", activitySlug);

  if (!discipline || !baseActivity) notFound();

  let dbProjects: DbDevProject[] = [];
  try {
    dbProjects = await getDevProjects();
  } catch (error) {
    console.warn("Failed to fetch database projects:", error);
  }

  const publishedProjects = dbProjects.filter(projectIsPublished);

  const projectsById: Record<string, DeveloperProject> = {
    [MOCK_DEV_PROJECT.id]: MOCK_DEV_PROJECT,
    [MOCK_DEV_PROJECT_2.id]: MOCK_DEV_PROJECT_2,
  };

  for (const project of publishedProjects) {
    try {
      projectsById[project.id] = mapDbToDevProject(project);
    } catch (e) {
      console.warn(`Failed to map project ${project.id}:`, e);
    }
  }

  const dbContents = activitySlug === "rt18-dev" ? publishedProjects.map(projectContent) : [];
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
    />
  );
}
