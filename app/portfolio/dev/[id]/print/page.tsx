import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";
import { DevProjectPrintLayout } from "@/components/dev-project/dev-project-print-layout";
import { notFound } from "next/navigation";
import type { DeveloperProject } from "@/types/dev-project";

// TODO: Replace with DB fetch when Supabase table is ready.
// For now, maintain a registry of static projects.
const ALL_DEV_PROJECTS: DeveloperProject[] = [MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2];

export async function generateStaticParams() {
  return ALL_DEV_PROJECTS.map((p) => ({ id: p.id }));
}

export default async function DevProjectPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = ALL_DEV_PROJECTS.find((p) => p.id === id);
  if (!project) notFound();
  return <DevProjectPrintLayout project={project!} />;
}
