import type { DbDevProject } from "@/lib/supabase-queries";

type InformationItem = { label?: string; value?: string | string[] };
type InformationCategory = { category?: string; items?: InformationItem[] };

export function projectSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
}

export function projectIsPublished(project: Pick<DbDevProject, "information">) {
  const information = project.information as InformationCategory[] | undefined;
  const general = Array.isArray(information)
    ? information.find((category) => category?.category === "GENERAL")
    : null;
  const visibility = general?.items?.find((item) => item?.label === "Visibility")?.value;
  // Existing records predate Visibility and were already public. New records
  // always receive an explicit Draft/Published value from the Admin editor.
  return visibility ? visibility === "Published" : true;
}

export function projectContent(project: DbDevProject) {
  return {
    id: project.id,
    name: project.project_name,
    slug: projectSlug(project.project_name),
    type: "project" as const,
    description: project.short_description,
    mainVisualUrl: project.main_visual_url || undefined,
    projectId: project.id,
  };
}
