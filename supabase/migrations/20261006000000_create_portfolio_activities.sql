CREATE TABLE IF NOT EXISTS portfolio_activities (
  id TEXT PRIMARY KEY,
  discipline_id TEXT NOT NULL CHECK (discipline_id IN ('developer', 'illustrator', 'musician', 'blogger', 'investor')),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  visual JSONB NOT NULL DEFAULT '{}'::jsonb,
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_activities_discipline_order ON portfolio_activities(discipline_id, display_order);
ALTER TABLE portfolio_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible portfolio activities" ON portfolio_activities FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON TABLE portfolio_activities TO anon, authenticated;
DROP TRIGGER IF EXISTS update_portfolio_activities_updated_at ON portfolio_activities;
CREATE TRIGGER update_portfolio_activities_updated_at BEFORE UPDATE ON portfolio_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
