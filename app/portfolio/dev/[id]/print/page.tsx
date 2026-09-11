import { getDevProjectById } from "@/lib/supabase-queries";
import { DevProjectPrintLayout } from "@/components/dev-project/dev-project-print-layout";
import { notFound } from "next/navigation";
import { mapDbToDevProject } from "@/lib/dev-project/mapper";

export const dynamic = "force-dynamic";

export default async function DevProjectPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbProject = await getDevProjectById(id);
  if (!dbProject) notFound();
  return <DevProjectPrintLayout project={mapDbToDevProject(dbProject)} />;
}
