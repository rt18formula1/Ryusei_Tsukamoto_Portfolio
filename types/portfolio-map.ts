export type DisciplineId = "developer" | "illustrator" | "musician" | "blogger" | "investor";

export interface PortfolioNode {
  id: string;
  type: "central" | "discipline" | "activity" | "content";
  label: string;
  disciplineId?: DisciplineId;
  activityId?: string;
  position: { x: number; y: number };
  connections: string[];
}

export interface PortfolioMapState {
  selectedNode: string | null;
  viewMode: "map" | "list";
  breadcrumb: string[];
}
