CREATE TABLE IF NOT EXISTS public.linktree_links (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  group_name TEXT NOT NULL DEFAULT 'social' CHECK (group_name IN ('featured', 'social', 'resources')),
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep the API-facing column name `group` while avoiding a reserved-word migration issue.
ALTER TABLE public.linktree_links ADD COLUMN IF NOT EXISTS "group" TEXT;
UPDATE public.linktree_links SET "group" = group_name WHERE "group" IS NULL;
ALTER TABLE public.linktree_links ALTER COLUMN "group" SET DEFAULT 'social';
ALTER TABLE public.linktree_links ALTER COLUMN "group" SET NOT NULL;
ALTER TABLE public.linktree_links DROP COLUMN IF EXISTS group_name;

INSERT INTO public.linktree_links (slug, title, url, "group", sort_order)
VALUES
('official-web', 'Official Web : rt18_formula1', 'https://rt18-formula1-official-site.vercel.app', 'featured', 0),
('instagram', 'Instagram : rt18_formula1', 'https://www.instagram.com/rt18_formula1/', 'social', 1),
('x-main', 'X(Twitter)：rt18_formula1_x', 'https://x.com/rt18_formula1_x', 'social', 2),
('x-yurugakuto', 'X(Twitter) : rt18_yurugakuto', 'https://x.com/rt18_yurugakuto', 'social', 3),
('nasu-calendar', 'ゆる学徒公開カレンダー', 'https://nasu-calendar.vercel.app', 'featured', 4),
('official-line', 'Official Line : rt18_formula1', 'https://lin.ee/4jupn4j', 'social', 5),
('shop', 'Official Shop', 'https://suzuri.jp/rt18_formula1', 'featured', 6),
('threads', 'Threads : rt18_formula1', 'https://www.threads.com/@rt18_formula1', 'social', 7),
('youtube', 'YouTube : rt18_formula1', 'https://www.youtube.com/@rt18_formula1', 'social', 8),
('note', 'note', 'https://note.com/rt18_dpfp', 'social', 9),
('tiktok', 'TikTok : rt18_formula1_official', 'https://www.tiktok.com/@rt18_formula1_official', 'social', 10),
('request', 'Google Form：Request', 'https://forms.gle/', 'resources', 11),
('contact', 'Google Forms : Contact', 'https://docs.google.com/forms/', 'resources', 12),
('instagram-music', 'Instagram : rt18_music', 'https://www.instagram.com/rt18_music/', 'social', 13),
('instagram-mylife', 'Instagram : rt18_mylife', 'https://www.instagram.com/rt18_mylife/', 'social', 14),
('pinterest', 'Pinterest : rt18_formula1', 'https://www.pinterest.jp/rt18_formula1/', 'social', 15),
('linkedin', 'LinkedIn : rt18_formula1', 'https://www.linkedin.com/in/rt18-formula1/', 'social', 16),
('wishlist', 'Gipt : Wish List', 'https://gi-pt.com/main/wishlist/fan-view/3a1880d2-89de-491e-f214-0572e430becd', 'resources', 17),
('fine-day-plus', 'Fine Day Plus | VIRAL', 'https://vir.jp/', 'featured', 18)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.linktree_links ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.linktree_links TO anon, authenticated;
