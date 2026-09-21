// Admin Hierarchy Data Model
// This model supports the Portfolio Hierarchy: Discipline → Activity → Content → Detail

export interface AdminDiscipline {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  visible: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminActivity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  disciplineId: string;
  displayOrder: number;
  visible: boolean;
  visualUrl?: string;
  links: AdminLink[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminContent {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  activityId: string;
  type: "project" | "artwork" | "work" | "article" | "research" | string;
  status: "public" | "in_development" | "private" | "archived";
  visibility: "published" | "draft" | "hidden";
  mainVisualUrl?: string;
  mainVisualFocalPoint?: { x: number; y: number };
  displayOrder: number;
  showOnMap: boolean;
  mapPosition?: { x: number; y: number };
  information: AdminInformationCategory[];
  details: AdminDetailBlock[];
  gallery: AdminGalleryItem[];
  links: AdminLink[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminInformationCategory {
  id: string;
  category: string;
  displayOrder: number;
  items: AdminInformationItem[];
}

export interface AdminInformationItem {
  id: string;
  label: string;
  value: string | string[];
  type?: "text" | "url" | "date" | "number" | "array";
  url?: string;
  displayUrl?: string;
  displayOrder: number;
}

export interface AdminDetailBlock {
  id: string;
  type: "section" | "text" | "image" | "image_text" | "highlight";
  content?: string;
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
  order: number;
}

export interface AdminGalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  description?: string;
  altText?: string;
  order: number;
}

export interface AdminLink {
  id: string;
  title: string;
  description: string;
  url: string;
  buttonLabel?: string;
  displayOrder: number;
}

export interface AdminHierarchy {
  disciplines: AdminDiscipline[];
  activities: AdminActivity[];
  contents: AdminContent[];
}

// Dashboard Statistics
export interface AdminDashboardStats {
  totalDisciplines: number;
  totalActivities: number;
  totalContents: number;
  publishedContents: number;
  inDevelopmentContents: number;
  privateContents: number;
  recentUpdates: AdminRecentUpdate[];
}

export interface AdminRecentUpdate {
  id: string;
  name: string;
  type: "discipline" | "activity" | "content";
  updatedAt: string;
}
