import { notFound } from "next/navigation";
import { DisciplineActivitiesClient } from "@/components/discipline/discipline-activities-client";
import { getDiscipline } from "@/lib/portfolio-hierarchy";

export const dynamic = "force-dynamic";

export default function DeveloperDisciplinePage() {
  const discipline = getDiscipline("developer");
  if (!discipline) notFound();
  return <DisciplineActivitiesClient discipline={discipline} />;
}
