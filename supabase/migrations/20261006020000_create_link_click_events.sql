-- Track clicks from the first-party Linktree replacement.
-- Writes are performed by the server-side redirect route with service_role.
CREATE TABLE IF NOT EXISTS link_click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_slug TEXT NOT NULL,
  link_title TEXT NOT NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  referer TEXT,
  user_agent TEXT,
  source TEXT NOT NULL DEFAULT 'linktree-page'
);

CREATE INDEX IF NOT EXISTS idx_link_click_events_slug_clicked_at
  ON link_click_events(link_slug, clicked_at DESC);

ALTER TABLE link_click_events ENABLE ROW LEVEL SECURITY;
