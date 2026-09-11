import { notFound } from "next/navigation";
import { ActivityContentsClient } from "@/components/discipline/activity-contents-client";
import { getActivity, getDiscipline } from "@/lib/portfolio-hierarchy";
import type { DisciplineId } from "@/types/portfolio-map";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ disciplineId: string; activity: string }>;
}

const VALID: DisciplineId[] = [
  "developer",
  "illustrator",
  "musician",
  "blogger",
  "investor",
];

export default async function DisciplineActivityPage({ params }: PageProps) {
  const { disciplineId: rawId, activity: activitySlug } = await params;
  if (!VALID.includes(rawId as DisciplineId)) notFound();

  const disciplineId = rawId as DisciplineId;

  // Developer Activity lives under /portfolio/developer/[activity]
  if (disciplineId === "developer") {
    notFound();
  }

  const discipline = getDiscipline(disciplineId);
  const activity = getActivity(disciplineId, activitySlug);
  if (!discipline || !activity) notFound();

  return <ActivityContentsClient discipline={discipline} activity={activity} />;
}
