import { getDevProjectById } from "@/lib/supabase-queries";
import { DevProjectDetailClient } from "@/components/dev-project/dev-project-detail-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";
import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";
import type { DeveloperProject } from "@/types/dev-project";

export async function generateStaticParams() {
  return [];
}

const MOCK_BY_ID: Record<string, DeveloperProject> = {
  [MOCK_DEV_PROJECT.id]: MOCK_DEV_PROJECT,
  [MOCK_DEV_PROJECT_2.id]: MOCK_DEV_PROJECT_2,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const mock = MOCK_BY_ID[id];
  if (mock) {
    return {
      title: `${mock.projectName} | Developer Project | rt18formula1 Portfolio`,
      description: mock.shortDescription,
    };
  }
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
  const mock = MOCK_BY_ID[id];
  if (mock) {
    return <DevProjectDetailClient project={mock} />;
  }
  const dbProject = await getDevProjectById(id);
  if (!dbProject) notFound();
  const project = mapDbToDevProject(dbProject);
  return <DevProjectDetailClient project={project} />;
}
