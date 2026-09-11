import type {
  DevProjectInfoCategory,
  DevProjectInfoItem,
  DevProjectInformation,
  DevProjectLink,
} from "@/types/dev-project";

const STANDARD_CATEGORIES = [
  "GENERAL",
  "INFRASTRUCTURE",
  "DATA",
  "AUTHENTICATION",
  "API / INTEGRATION",
] as const;

/**
 * Keeps custom categories in their authoring order while pinning the shared
 * categories to the order used by both the web detail and printable sheet.
 */
export function sortProjectInformation(
  information: DevProjectInformation[],
): DevProjectInformation[] {
  return information
    .map((category, index) => ({ category, index }))
    .sort((a, b) => {
      const rank = (name: DevProjectInfoCategory) => {
        if (name === "OTHER") return 99;
        const standardIndex = STANDARD_CATEGORIES.indexOf(
          name as (typeof STANDARD_CATEGORIES)[number],
        );
        return standardIndex === -1 ? 50 : standardIndex;
      };
      return rank(a.category.category) - rank(b.category.category) || a.index - b.index;
    })
    .map(({ category }) => category);
}

export function sortProjectLinks(links: DevProjectLink[]): DevProjectLink[] {
  return [...links].sort((a, b) => {
    const rank = (link: DevProjectLink) =>
      link.title.toLowerCase() === "website" ? 0 : link.title.toLowerCase() === "github" ? 1 : 2;
    return rank(a) - rank(b) || a.order - b.order;
  });
}

export function fullUrl(item: DevProjectInfoItem): string {
  return item.url ?? (typeof item.value === "string" ? item.value : "");
}

export function displayValue(item: DevProjectInfoItem): string {
  if (item.type === "Service") return item.service?.name ?? item.serviceName ?? String(item.value);
  if (item.type === "URL") return item.displayUrl ?? fullUrl(item);
  return Array.isArray(item.value) ? item.value.join(" / ") : String(item.value);
}

export function focalPointStyle(focalPoint?: { x: number; y: number }): string {
  return focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : "50% 50%";
}
