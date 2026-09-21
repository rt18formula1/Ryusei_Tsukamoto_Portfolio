// Portfolio Hierarchy Data Model
// Level 0: Portfolio (RYUSEI TSUKAMOTO)
// Level 1: Discipline (DEVELOPER, ILLUSTRATOR, MUSICIAN, BLOGGER, INVESTOR)
// Level 2: Activity / Brand (rt18_dev, rt18_formula1, rt18_music, Fine Day Plus)
// Level 3: Content / Project
// Level 4: Detail

import type { DisciplineId } from "@/types/portfolio-map";

export type { DisciplineId };

export type ContentType =
  | "project"
  | "artwork"
  | "work"
  | "article"
  | "research"
  | "media"
  | "commission"
  | string;

export interface ActivityLink {
  label: string;
  url: string;
}

export interface ActivityVisual {
  image?: string;
}

/** L3: Project / Content under an Activity */
export interface HierarchyContent {
  id: string;
  name: string;
  slug: string;
  type: ContentType;
  description?: string;
  mainVisualUrl?: string;
  /** When type is "project", links to DeveloperProject.id */
  projectId?: string;
  displayOrder?: number;
  visible?: boolean;
}

/** L2: Activity / Brand — groups multiple projects/contents */
export interface Activity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  disciplineId: DisciplineId;
  visual?: ActivityVisual;
  links?: ActivityLink[];
  contentType?: ContentType;
  contents: HierarchyContent[];
  displayOrder?: number;
  visible?: boolean;
}

/** L1: Discipline */
export interface Discipline {
  id: DisciplineId;
  name: string;
  slug: string;
  description: string;
  color: string;
  activities: Activity[];
  displayOrder?: number;
  visible?: boolean;
}

/** L0: Portfolio root */
export interface PortfolioHierarchy {
  disciplines: Discipline[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
