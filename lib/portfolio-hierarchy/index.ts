import type { DisciplineId } from "@/types/portfolio-map";
import type {
  Activity,
  BreadcrumbItem,
  Discipline,
  HierarchyContent,
} from "@/types/portfolio-hierarchy";
import { PORTFOLIO_HIERARCHY } from "./data";

export { PORTFOLIO_HIERARCHY } from "./data";

export function getDisciplines(): Discipline[] {
  return PORTFOLIO_HIERARCHY.disciplines;
}

export function getDiscipline(id: DisciplineId): Discipline | undefined {
  return PORTFOLIO_HIERARCHY.disciplines.find((d) => d.id === id);
}

export function getDisciplineBySlug(slug: string): Discipline | undefined {
  return PORTFOLIO_HIERARCHY.disciplines.find((d) => d.slug === slug);
}

export function getActivity(
  disciplineId: DisciplineId,
  activitySlug: string
): Activity | undefined {
  return getDiscipline(disciplineId)?.activities.find((a) => a.slug === activitySlug);
}

export function getContent(
  disciplineId: DisciplineId,
  activitySlug: string,
  contentSlug: string
): HierarchyContent | undefined {
  return getActivity(disciplineId, activitySlug)?.contents.find((c) => c.slug === contentSlug);
}

/** Resolve hierarchy path for a developer project id (mock or DB). */
export function findDeveloperContentByProjectId(projectId: string): {
  activity: Activity;
  content: HierarchyContent;
} | undefined {
  const discipline = getDiscipline("developer");
  if (!discipline) return undefined;
  for (const activity of discipline.activities) {
    const content = activity.contents.find(
      (c) => c.id === projectId || c.projectId === projectId
    );
    if (content) return { activity, content };
  }
  return undefined;
}

export function developerProjectPermalink(projectId: string): string {
  const found = findDeveloperContentByProjectId(projectId);
  if (found) {
    return contentHref("developer", found.activity.slug, found.content.slug);
  }
  return `/portfolio/dev/${projectId}`;
}

/** Path helpers — keep hierarchy URLs consistent */
export function disciplineHref(disciplineId: DisciplineId): string {
  // Developer uses /portfolio/developer; others stay on /disciplines for now
  if (disciplineId === "developer") return "/portfolio/developer";
  return `/disciplines/${disciplineId}`;
}

export function activityHref(disciplineId: DisciplineId, activitySlug: string): string {
  // The Illustrator identity is represented by the public rt18_formula1 site.
  // Keep this as the one intentional external activity route; other hierarchy
  // nodes continue to resolve to the portfolio's internal pages.
  if (disciplineId === "illustrator" && activitySlug === "rt18-formula1") {
    return "https://rt18-formula1-official-site.vercel.app";
  }
  if (disciplineId === "developer") {
    return `/portfolio/developer/${activitySlug}`;
  }
  return `/disciplines/${disciplineId}/${activitySlug}`;
}

export function contentHref(
  disciplineId: DisciplineId,
  activitySlug: string,
  contentSlug: string
): string {
  if (disciplineId === "developer") {
    return `/portfolio/developer/${activitySlug}/${contentSlug}`;
  }
  return `/disciplines/${disciplineId}/${activitySlug}/${contentSlug}`;
}

export function buildBreadcrumbs(parts: {
  discipline?: Discipline;
  activity?: Activity;
  content?: HierarchyContent;
}): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ label: "HOME", href: "/" }];

  if (parts.discipline) {
    items.push({
      label: parts.discipline.name.toUpperCase(),
      href: disciplineHref(parts.discipline.id),
    });
  }

  if (parts.discipline && parts.activity) {
    items.push({
      label: parts.activity.name,
      href: activityHref(parts.discipline.id, parts.activity.slug),
    });
  }

  if (parts.discipline && parts.activity && parts.content) {
    items.push({
      label: parts.content.name,
      href: contentHref(parts.discipline.id, parts.activity.slug, parts.content.slug),
    });
  }

  // Last crumb is current page — not a link
  if (items.length > 0) {
    const last = items[items.length - 1];
    items[items.length - 1] = { label: last.label };
  }

  return items;
}
