import { getDevProjectById } from "@/lib/supabase-queries";
import { DevProjectDetailClient } from "@/components/dev-project/dev-project-detail-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";
import { projectIsPublished } from "@/lib/portfolio-projects";
import { verifyAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Drafts are visible only to a signed-in admin (Admin preview).
 * Everyone else gets a 404, so unpublished work never leaks via this
 * legacy permalink. Published projects stay public.
 */
async function getViewableProject(id: string) {
  const project = await getDevProjectById(id);
  if (!project) return null;
  if (projectIsPublished(project)) return project;
  try {
    await verifyAdmin();
    return project;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getViewableProject(id);
  if (!project) return {};
  return {
    title: `${project.project_name} | Developer Project | rt18formula1 Portfolio`,
    description: project.short_description,
    openGraph: {
      title: project.project_name,
      description: project.short_description,
      images: project.main_visual_url ? [{ url: project.main_visual_url }] : [],
    },
  };
}

/** Legacy permalink — kept for compatibility; prefer /portfolio/developer/rt18.dev/[slug] */
export default async function DevProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbProject = await getViewableProject(id);
  if (!dbProject) notFound();
  const project = mapDbToDevProject(dbProject);
  return <DevProjectDetailClient project={project} />;
}
