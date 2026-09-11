import type { DbDevProject } from "@/lib/supabase-queries";
import type { DeveloperProject } from "@/types/dev-project";

/** Maps the single persisted Project record to the renderer-friendly model. */
export function mapDbToDevProject(db: DbDevProject): DeveloperProject {
  return {
    id: db.id,
    projectName: db.project_name,
    shortDescription: db.short_description,
    mainVisualUrl: db.main_visual_url || "",
    mainVisualFocalPoint: db.main_visual_focal_point_x !== null && db.main_visual_focal_point_y !== null
      ? { x: db.main_visual_focal_point_x, y: db.main_visual_focal_point_y }
      : undefined,
    information: db.information || [],
    details: db.details || [],
    gallery: db.gallery || [],
    links: db.links || [],
  };
}
