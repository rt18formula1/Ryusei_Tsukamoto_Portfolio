import { LinktreePageClient } from "@/components/linktree/linktree-page-client";
import { getLinktreeLinks } from "@/lib/linktree-queries";

export const metadata = {
  title: "Links | Ryusei Tsukamoto Portfolio",
  description: "Ryusei Tsukamotoのプロフィール、活動歴、プロジェクト、外部リンク。",
};

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  return <LinktreePageClient links={await getLinktreeLinks()} />;
}
