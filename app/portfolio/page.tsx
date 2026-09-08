import { getPortfolioList, getAlbumsByType, getPortfolioAlbumsMapping, getDevProjects } from "@/lib/supabase-queries";
import { DeveloperProject } from "@/types/dev-project";
import PortfolioPageClient from "@/components/portfolio-page-client";

export const revalidate = 3600;

export default async function PortfolioPage() {
  const [portfolio, albums, mapping, devProjects] = await Promise.all([
    getPortfolioList(),
    getAlbumsByType("portfolio"),
    getPortfolioAlbumsMapping(),
    getDevProjects(),
  ]);

  // Transform DbDevProject to DeveloperProject type
  const transformedDevProjects: DeveloperProject[] = devProjects.map((dp) => ({
    id: dp.id,
    projectName: dp.project_name,
    shortDescription: dp.short_description,
    mainVisualUrl: dp.main_visual_url || "",
    mainVisualFocalPoint: dp.main_visual_focal_point_x !== null && dp.main_visual_focal_point_y !== null
      ? { x: dp.main_visual_focal_point_x, y: dp.main_visual_focal_point_y }
      : undefined,
    information: dp.information || [],
    details: dp.details || [],
    gallery: dp.gallery || [],
    links: dp.links || [],
  }));

  return (
    <PortfolioPageClient
      portfolio={portfolio}
      albums={albums}
      mapping={mapping}
      devProjects={transformedDevProjects}
    />
  );
}
