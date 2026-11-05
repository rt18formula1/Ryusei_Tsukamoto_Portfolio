-- Disciplines Table
-- For managing portfolio disciplines (developer, illustrator, musician, etc.)
CREATE TABLE IF NOT EXISTS disciplines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#000000',
  display_order INTEGER NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_disciplines_display_order ON disciplines(display_order);

-- RLS Policies
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible disciplines" ON disciplines FOR SELECT TO anon, authenticated USING (visible = true);
GRANT SELECT ON TABLE disciplines TO anon, authenticated;

-- Updated at trigger
DROP TRIGGER IF EXISTS update_disciplines_updated_at ON disciplines;
CREATE TRIGGER update_disciplines_updated_at BEFORE UPDATE ON disciplines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial disciplines
INSERT INTO disciplines (id, name, slug, description, color, display_order, visible) VALUES
  ('developer', 'Developer', 'developer', 'Full-stack web applications, automation pipelines, and software tools built with Next.js, TypeScript, Supabase, and Cloudflare.', '#2563eb', 0, true),
  ('illustrator', 'Illustrator', 'illustrator', 'Digital illustrations, graphic art, and visual content focusing on Formula 1, motorsport moments, and creative graphics.', '#7c3aed', 1, true),
  ('musician', 'Musician', 'musician', 'Sound design, music composition, and audio content production.', '#db2777', 2, true),
  ('blogger', 'Blogger', 'blogger', 'Technical articles, development logs, design notes, and analytical writings on note and technical blogs.', '#059669', 3, true),
  ('investor', 'Investor', 'investor', 'Market research and investment activities in tech sectors, growth companies, and emerging markets.', '#d97706', 4, true),
  ('photographer', 'Photographer', 'photographer', 'Photography, visual storytelling, and photo documentation shared through @rt18_photo on Instagram.', '#0ea5e9', 5, true)
ON CONFLICT (id) DO NOTHING;
