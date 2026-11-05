import { redirect } from "next/navigation";

/** Legacy Developer list → Activity rt18.dev */
export default function LegacyDeveloperPage() {
  redirect("/portfolio/developer/rt18.dev");
}
