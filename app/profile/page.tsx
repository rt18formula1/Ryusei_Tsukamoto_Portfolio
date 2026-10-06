import { ProfilePageClient } from "@/components/profile/profile-page-client";
import { getLinktreeLinks } from "@/lib/linktree-queries";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  return <ProfilePageClient links={await getLinktreeLinks()} />;
}
