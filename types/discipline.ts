export type DisciplineId = "developer" | "illustrator" | "musician" | "blogger" | "investor" | "photographer";

export interface DbDiscipline {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  display_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Discipline {
  id: DisciplineId;
  name: string;
  slug: string;
  description?: string;
  color: string;
  displayOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}
