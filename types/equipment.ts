import type { DisciplineId } from "@/types/portfolio-map";

export interface EquipmentItem {
  id: string;
  sectionId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentSection {
  id: string;
  disciplineId: DisciplineId;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  items?: EquipmentItem[];
}

export interface DbEquipmentSection {
  id: string;
  discipline_id: DisciplineId;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbEquipmentItem {
  id: string;
  section_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}
