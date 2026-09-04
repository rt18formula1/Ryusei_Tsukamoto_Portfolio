import PortfolioPageClient from "@/components/portfolio-page-client";
import { getPortfolioList, getAlbumsByType, getPortfolioAlbumsMapping } from "@/lib/supabase-queries";
import { MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2 } from "@/lib/dev-project/mock";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function PortfolioPage() {
  const [portfolio, albums, mapping] = await Promise.all([
    getPortfolioList(),
    getAlbumsByType("portfolio"),
    getPortfolioAlbumsMapping(),
  ]);

  return (
    <PortfolioPageClient 
      portfolio={portfolio} 
      albums={albums} 
      mapping={mapping} 
      devProjects={[MOCK_DEV_PROJECT, MOCK_DEV_PROJECT_2]}
    />
  );
}
