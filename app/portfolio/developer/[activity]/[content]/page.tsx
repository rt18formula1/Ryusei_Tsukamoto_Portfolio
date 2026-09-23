import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DevProjectDetailClient } from "@/components/dev-project/dev-project-detail-client";
import { getActivity, getContent, getDiscipline } from "@/lib/portfolio-hierarchy";
import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";
import { getDevProjectById } from "@/lib/supabase-queries";
import { getDevProjects } from "@/lib/supabase-queries";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";
import { projectContent, projectIsPublished, projectSlug } from "@/lib/portfolio-projects";
import type { DeveloperProject } from "@/types/dev-project";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";
import { buildBreadcrumbs } from "@/lib/portfolio-hierarchy";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ activity: string; content: string }>;
}

const MOCK_BY_ID: Record<string, DeveloperProject> = {
  [MOCK_DEV_PROJECT.id]: MOCK_DEV_PROJECT,
  [MOCK_DEV_PROJECT_2.id]: MOCK_DEV_PROJECT_2,
};

async function resolveProject(projectId: string): Promise<DeveloperProject | null> {
  if (MOCK_BY_ID[projectId]) return MOCK_BY_ID[projectId];
  const db = await getDevProjectById(projectId);
  return db ? mapDbToDevProject(db) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { activity: activitySlug, content: contentSlug } = await params;
  const dbProject = activitySlug === "rt18-dev"
    ? (await getDevProjects()).find((project) => projectIsPublished(project) && projectSlug(project.project_name) === contentSlug)
    : null;
  const content = getContent("developer", activitySlug, contentSlug) || (dbProject ? projectContent(dbProject) : null);
  if (!content) return {};
  return {
    title: `${content.name} | Developer | rt18formula1 Portfolio`,
    description: content.description,
  };
}

export default async function DeveloperContentPage({ params }: PageProps) {
  const { activity: activitySlug, content: contentSlug } = await params;
  const discipline = getDiscipline("developer");
  const activity = getActivity("developer", activitySlug);
  const dbProject = activitySlug === "rt18-dev"
    ? (await getDevProjects()).find((project) => projectIsPublished(project) && projectSlug(project.project_name) === contentSlug)
    : null;
  const content = getContent("developer", activitySlug, contentSlug) || (dbProject ? projectContent(dbProject) : null);

  if (!discipline || !activity || !content) notFound();

  const projectId = content.projectId ?? content.id;
  const project = dbProject ? mapDbToDevProject(dbProject) : await resolveProject(projectId);
  if (!project) notFound();

  const breadcrumbs = buildBreadcrumbs({ discipline, activity, content });

  return (
    <div>
      <div className="border-b border-black/10 bg-white px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <HierarchyBreadcrumb items={breadcrumbs} />
        </div>
      </div>
      <DevProjectDetailClient project={project} />
    </div>
  );
}
