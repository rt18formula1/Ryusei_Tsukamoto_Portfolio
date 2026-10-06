import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DevProjectDetailClient } from "@/components/dev-project/dev-project-detail-client";
import { getDevProjects, getPortfolioActivities } from "@/lib/supabase-queries";
import { getDevProjectById } from "@/lib/supabase-queries";
import { buildUnifiedHierarchy } from "@/lib/admin-hierarchy-service";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";
import { projectContent, projectIsPublished, projectSlug } from "@/lib/portfolio-projects";
import type { DeveloperProject } from "@/types/dev-project";
import { HierarchyBreadcrumb } from "@/components/portfolio/hierarchy-breadcrumb";
import { buildBreadcrumbs } from "@/lib/portfolio-hierarchy";
import type { DbPortfolioActivity } from "@/types/portfolio-hierarchy";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ activity: string; content: string }>;
}

async function resolveProject(projectId: string): Promise<DeveloperProject | null> {
  const db = await getDevProjectById(projectId);
  return db ? mapDbToDevProject(db) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { activity: activitySlug, content: contentSlug } = await params;
  const [dbProjects, activities] = await Promise.all([getDevProjects(), getPortfolioActivities("developer")]);
  const hierarchy = buildUnifiedHierarchy(dbProjects.filter(projectIsPublished), activities as DbPortfolioActivity[]);
  const discipline = hierarchy.disciplines.find((item) => item.id === "developer");
  const activity = discipline?.activities.find((item) => item.slug === activitySlug);
  const content = activity?.contents.find((item) => item.slug === contentSlug);
  const dbProject = dbProjects.find((project) => projectIsPublished(project) && projectSlug(project.project_name) === contentSlug) || null;
  if (!content) return {};
  return {
    title: `${content.name} | Developer | rt18formula1 Portfolio`,
    description: content.description,
  };
}

export default async function DeveloperContentPage({ params }: PageProps) {
  const { activity: activitySlug, content: contentSlug } = await params;
  const [dbProjects, activities] = await Promise.all([getDevProjects(), getPortfolioActivities("developer")]);
  const hierarchy = buildUnifiedHierarchy(dbProjects.filter(projectIsPublished), activities as DbPortfolioActivity[]);
  const discipline = hierarchy.disciplines.find((item) => item.id === "developer");
  const activity = discipline?.activities.find((item) => item.slug === activitySlug);
  const dbProject = dbProjects.find((project) => projectIsPublished(project) && projectSlug(project.project_name) === contentSlug) || null;
  const content = activity?.contents.find((item) => item.slug === contentSlug);

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
