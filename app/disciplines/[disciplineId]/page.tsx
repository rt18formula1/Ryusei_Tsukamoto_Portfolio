import { DisciplinePageClient } from "@/components/discipline/discipline-page-client";
import { DisciplineId } from "@/types/portfolio-map";

interface DisciplinePageProps {
  params: Promise<{
    disciplineId: DisciplineId;
  }>;
}

export const dynamic = "force-dynamic";

export default async function DisciplinePage({ params }: DisciplinePageProps) {
  const { disciplineId } = await params;
  return <DisciplinePageClient disciplineId={disciplineId} />;
}
