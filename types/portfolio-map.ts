export type DisciplineId = "developer" | "illustrator" | "musician" | "blogger" | "investor";

export interface PortfolioNode {
  id: string;
  type: "central" | "discipline" | "content";
  label: string;
  disciplineId?: DisciplineId;
  position: { x: number; y: number };
  connections: string[];
}

export interface PortfolioMapState {
  selectedNode: string | null;
  viewMode: "map" | "list";
  breadcrumb: string[];
}
