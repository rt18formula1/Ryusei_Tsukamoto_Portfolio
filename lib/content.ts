export type LinktreeLink = {
  slug: string;
  title: string;
  url: string;
  group: "featured" | "social" | "resources";
  description?: string;
  sort_order?: number;
  is_active?: boolean;
};

/** Ordered to match the public Linktree profile at linktr.ee/rt18_formula1. */
export const linktreeLinks: LinktreeLink[] = [
  { slug: "official-web", title: "Official Web : rt18_formula1", url: "https://rt18-formula1-official-site.vercel.app", group: "featured" },
  { slug: "instagram", title: "Instagram : rt18_formula1", url: "https://www.instagram.com/rt18_formula1/", group: "social" },
  { slug: "x-main", title: "X(Twitter)：rt18_formula1_x", url: "https://x.com/rt18_formula1_x", group: "social" },
  { slug: "x-yurugakuto", title: "X(Twitter) : rt18_yurugakuto", url: "https://x.com/rt18_yurugakuto", group: "social" },
  { slug: "nasu-calendar", title: "ゆる学徒公開カレンダー", url: "https://nasu-calendar.vercel.app", group: "featured" },
  { slug: "official-line", title: "Official Line : rt18_formula1", url: "https://lin.ee/4jupn4j", group: "social" },
  { slug: "shop", title: "Official Shop", url: "https://suzuri.jp/rt18_formula1", group: "featured" },
  { slug: "threads", title: "Threads : rt18_formula1", url: "https://www.threads.com/@rt18_formula1", group: "social" },
  { slug: "youtube", title: "YouTube : rt18_formula1", url: "https://www.youtube.com/@rt18_formula1", group: "social" },
  { slug: "note", title: "note", url: "https://note.com/rt18_dpfp", group: "social" },
  { slug: "tiktok", title: "TikTok : rt18_formula1_official", url: "https://www.tiktok.com/@rt18_formula1_official", group: "social" },
  { slug: "request", title: "Google Form：Request", url: "https://forms.gle/", group: "resources" },
  { slug: "contact", title: "Google Forms : Contact", url: "https://docs.google.com/forms/", group: "resources" },
  { slug: "instagram-music", title: "Instagram : rt18_music", url: "https://www.instagram.com/rt18_music/", group: "social" },
  { slug: "instagram-mylife", title: "Instagram : rt18_mylife", url: "https://www.instagram.com/rt18_mylife/", group: "social" },
  { slug: "pinterest", title: "Pinterest : rt18_formula1", url: "https://www.pinterest.jp/rt18_formula1/", group: "social" },
  { slug: "linkedin", title: "LinkedIn : rt18_formula1", url: "https://www.linkedin.com/in/rt18-formula1/", group: "social" },
  { slug: "wishlist", title: "Gipt : Wish List", url: "https://gi-pt.com/main/wishlist/fan-view/3a1880d2-89de-491e-f214-0572e430becd", group: "resources" },
  { slug: "fine-day-plus", title: "Fine Day Plus | VIRAL", url: "https://vir.jp/", group: "featured" },
];

export const snsLinks = [
  { name: "Instagram", url: "https://www.instagram.com/rt18_formula1/", icon: "/instagram-icon.png" },
  { name: "X", url: "https://x.com/rt18_formula1_x", icon: "/x-logo.png" },
  { name: "YouTube", url: "https://www.youtube.com/@rt18_formula1", icon: "/youtube-logo.png" },
  { name: "TikTok", url: "https://www.tiktok.com/@rt18_formula1_official", icon: "/tiktok-logo.png" },
  { name: "GitHub", url: "https://github.com/rt18formula1", icon: "/github-icon.webp" },
  { name: "Threads", url: "https://www.threads.com/@rt18_formula1", icon: "/threads-icon.png" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/rt18-formula1/", icon: "/linkedin-icon.png" },
  { name: "LINE", url: "https://lin.ee/4jupn4j", icon: "/line-icon.png" },
  { name: "Tumblr", url: "https://www.tumblr.com/rt18-formula1", icon: "/tumblr.png", size: "lg" },
  { name: "Bluesky", url: "https://bsky.app/profile/rt18-formula1.bsky.social", icon: "/bluesky.png", size: "lg" },
];
