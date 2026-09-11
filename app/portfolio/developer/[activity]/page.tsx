import { notFound } from "next/navigation";
import { ActivityContentsClient } from "@/components/discipline/activity-contents-client";
import { getActivity, getDiscipline } from "@/lib/portfolio-hierarchy";
import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";
import type { DeveloperProject } from "@/types/dev-project";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ activity: string }>;
}

export default async function DeveloperActivityPage({ params }: PageProps) {
  const { activity: activitySlug } = await params;
  const discipline = getDiscipline("developer");
  const activity = getActivity("developer", activitySlug);

  if (!discipline || !activity) notFound();

  const projectsById: Record<string, DeveloperProject> = {
    [MOCK_DEV_PROJECT.id]: MOCK_DEV_PROJECT,
    [MOCK_DEV_PROJECT_2.id]: MOCK_DEV_PROJECT_2,
  };

  return (
    <ActivityContentsClient
      discipline={discipline}
      activity={activity}
      projectsById={projectsById}
    />
  );
}
