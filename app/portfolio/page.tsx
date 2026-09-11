import PortfolioPageClient from "@/components/portfolio-page-client";
import { getAlbumsByType, getPortfolioAlbumsMapping, getPortfolioList } from "@/lib/supabase-queries";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function PortfolioPage() {
  const [portfolio, albums, mapping] = await Promise.all([getPortfolioList(), getAlbumsByType("portfolio"), getPortfolioAlbumsMapping()]);
  return <PortfolioPageClient portfolio={portfolio} albums={albums} mapping={mapping} />;
}
