import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";
import { DevProjectDetailClient } from "@/components/dev-project/dev-project-detail-client";
import { notFound } from "next/navigation";
import type { DeveloperProject } from "@/types/dev-project";
import type { Metadata } from "next";

const ALL_DEV_PROJECTS: DeveloperProject[] = [MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2];

export async function generateStaticParams() {
  return ALL_DEV_PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = ALL_DEV_PROJECTS.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: `${project.projectName} | Developer Project | rt18formula1 Portfolio`,
    description: project.shortDescription,
    openGraph: {
      title: project.projectName,
      description: project.shortDescription,
      images: [{ url: project.mainVisualUrl }],
    },
  };
}

export default async function DevProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = ALL_DEV_PROJECTS.find((p) => p.id === id);
  if (!project) notFound();
  return <DevProjectDetailClient project={project!} />;
}
