-- Developer Projects Table
CREATE TABLE IF NOT EXISTS dev_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  main_visual_url TEXT,
  main_visual_focal_point_x NUMERIC(3,2),
  main_visual_focal_point_y NUMERIC(3,2),
  information JSONB NOT NULL DEFAULT '[]'::jsonb,
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_dev_projects_sort_order ON dev_projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_dev_projects_created_at ON dev_projects(created_at DESC);

-- RLS Policies
ALTER TABLE dev_projects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON dev_projects
  FOR SELECT USING (true);

-- Admin write access (using service role)
CREATE POLICY "Admin write access" ON dev_projects
  FOR ALL USING (auth.role() = 'service_role');

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dev_projects_updated_at
  BEFORE UPDATE ON dev_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
