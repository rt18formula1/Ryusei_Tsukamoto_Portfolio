import { DeveloperProjectList } from "@/components/dev-project/developer-project-list";
import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";

export const dynamic = "force-dynamic";

export default function DeveloperPage() {
  const projects = [MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2];

  return (
    <div className="min-h-screen bg-white">
      <DeveloperProjectList projects={projects} />
    </div>
  );
}
