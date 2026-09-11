export type DevProjectInfoCategory = 
  | "GENERAL"
  | "INFRASTRUCTURE"
  | "DATA"
  | "AUTHENTICATION"
  | "API / INTEGRATION"
  | "OTHER"
  | string;

export type DevProjectInfoValueType = "Text" | "Multiple Values" | "URL" | "Service";

export interface DevProjectInfoItem {
  label: string;
  value: string | string[];
  type: DevProjectInfoValueType;
  /** Full destination used for click, copy, QR and print. `value` remains supported for stored data. */
  url?: string;
  serviceIconUrl?: string;
  serviceName?: string;
  /** Allows a registered service later without making current JSON data incompatible. */
  service?: { id?: string; name: string; iconUrl?: string; kind: "registered" | "custom" };
  displayUrl?: string;
}

export interface DevProjectInformation {
  category: DevProjectInfoCategory;
  items: DevProjectInfoItem[];
}

export type DevProjectDetailBlockType = "Section" | "Text" | "Image" | "ImageText" | "Highlight";

export interface DevProjectDetailBlock {
  id: string;
  type: DevProjectDetailBlockType;
  content?: string; 
  imageUrl?: string; 
  imageCaption?: string;
  text?: string; 
  order: number;
}

export interface DevProjectGalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  description?: string;
  order: number;
}

export interface DevProjectLink {
  id: string;
  title: "Website" | "GitHub" | string;
  description: string;
  url: string;
  displayUrl?: string; // For UI display (shortened URL)
  buttonLabel: string;
  order: number;
}

export interface DeveloperProject {
  id: string;
  projectName: string;
  shortDescription: string;
  mainVisualUrl: string;
  mainVisualFocalPoint?: { x: number; y: number }; // 0-1 range for future focal point support
  information: DevProjectInformation[];
  details: DevProjectDetailBlock[];
  gallery: DevProjectGalleryItem[];
  links: DevProjectLink[];
}
