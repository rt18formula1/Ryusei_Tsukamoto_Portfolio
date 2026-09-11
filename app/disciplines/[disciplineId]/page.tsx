import { redirect } from "next/navigation";
import { DisciplinePageClient } from "@/components/discipline/discipline-page-client";
import { DisciplineId } from "@/types/portfolio-map";
import { disciplineHref } from "@/lib/portfolio-hierarchy";

interface DisciplinePageProps {
  params: Promise<{
    disciplineId: DisciplineId;
  }>;
}

export const dynamic = "force-dynamic";

export default async function DisciplinePage({ params }: DisciplinePageProps) {
  const { disciplineId } = await params;

  // Canonical Developer URL is /portfolio/developer
  if (disciplineId === "developer") {
    redirect(disciplineHref("developer"));
  }

  return <DisciplinePageClient disciplineId={disciplineId} />;
}
