-- Equipment Sections Table
-- For managing equipment/gear sections across different disciplines (music, development, illustration, etc.)
CREATE TABLE IF NOT EXISTS equipment_sections (
  id TEXT PRIMARY KEY,
  discipline_id TEXT NOT NULL CHECK (discipline_id IN ('developer', 'illustrator', 'musician', 'blogger', 'investor', 'photographer')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Equipment Items Table
-- Individual equipment items within a section
CREATE TABLE IF NOT EXISTS equipment_items (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES equipment_sections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_sections_discipline_order ON equipment_sections(discipline_id, display_order);
CREATE INDEX IF NOT EXISTS idx_equipment_items_section_order ON equipment_items(section_id, display_order);

-- RLS Policies
ALTER TABLE equipment_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible equipment sections" ON equipment_sections FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON TABLE equipment_sections TO anon, authenticated;

ALTER TABLE equipment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read equipment items" ON equipment_items FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON TABLE equipment_items TO anon, authenticated;

-- Updated at triggers
DROP TRIGGER IF EXISTS update_equipment_sections_updated_at ON equipment_sections;
CREATE TRIGGER update_equipment_sections_updated_at BEFORE UPDATE ON equipment_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_items_updated_at ON equipment_items;
CREATE TRIGGER update_equipment_items_updated_at BEFORE UPDATE ON equipment_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
