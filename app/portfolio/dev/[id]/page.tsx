import { getDevProjectById } from "@/lib/supabase-queries";
import { DevProjectDetailClient } from "@/components/dev-project/dev-project-detail-client";
import { notFound } from "next/navigation";
import type { DbDevProject } from "@/lib/supabase-queries";
import type { Metadata } from "next";
import { DeveloperProject } from "@/types/dev-project";

function mapDbToDevProject(db: DbDevProject): DeveloperProject {
  return {
    id: db.id,
    projectName: db.project_name,
    shortDescription: db.short_description,
    mainVisualUrl: db.main_visual_url || "",
    mainVisualFocalPoint: db.main_visual_focal_point_x !== null && db.main_visual_focal_point_y !== null
      ? { x: db.main_visual_focal_point_x, y: db.main_visual_focal_point_y }
      : undefined,
    information: db.information || [],
    details: db.details || [],
    gallery: db.gallery || [],
    links: db.links || [],
  };
}

export async function generateStaticParams() {
  // For static generation, we could fetch all IDs, but for now return empty
  // to use dynamic rendering. In production, you might want to pre-generate.
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = await getDevProjectById(id);
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

export default async function DevProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbProject = await getDevProjectById(id);
  if (!dbProject) notFound();
  const project = mapDbToDevProject(dbProject);
  return <DevProjectDetailClient project={project} />;
}
