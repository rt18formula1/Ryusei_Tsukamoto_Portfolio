import { getDevProjectById } from "@/lib/supabase-queries";
import { DevProjectDetailClient } from "@/components/dev-project/dev-project-detail-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";

export async function generateStaticParams() {
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

/** Legacy permalink — kept for compatibility; prefer /portfolio/developer/rt18-dev/[slug] */
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
