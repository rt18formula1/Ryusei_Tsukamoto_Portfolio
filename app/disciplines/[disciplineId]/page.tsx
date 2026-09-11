import { DisciplinePageClient } from "@/components/discipline/discipline-page-client";
import { DisciplineId } from "@/types/portfolio-map";

interface DisciplinePageProps {
  params: {
    disciplineId: DisciplineId;
  };
}

export const dynamic = "force-dynamic";

export default function DisciplinePage({ params }: DisciplinePageProps) {
  return <DisciplinePageClient disciplineId={params.disciplineId} />;
}
