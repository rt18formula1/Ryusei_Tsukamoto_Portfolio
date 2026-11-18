import { NextResponse } from 'next/server';
import { getNewsList, getPortfolioList, getAllAlbums, getEvents } from '@/lib/supabase-queries';

interface SitemapPage {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ryusei-tsukamoto-portfolio.rb18vcarb.workers.dev/').replace(/\/$/, '');
  
  try {
    // データベースから全コンテンツを取得
    const [news, portfolio, albums, events] = await Promise.all([
      getNewsList(),
      getPortfolioList(),
      getAllAlbums(),
      getEvents(),
    ]);

    // 静的ページ
    const staticPages: SitemapPage[] = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/news', priority: '0.8', changefreq: 'daily' },
      { url: '/portfolio', priority: '0.8', changefreq: 'weekly' },
      { url: '/calendar', priority: '0.7', changefreq: 'daily' },
    ];

    // 動的ページを生成
    const dynamicPages: SitemapPage[] = [
      // Newsページ
      ...news.map(item => ({
        url: `/news/${item.id}`,
        priority: '0.6',
        changefreq: 'weekly',
        lastmod: item.created_at || new Date().toISOString(),
      })),
      
      // Portfolioページ
      ...portfolio.map(item => ({
        url: `/portfolio/${item.id}`,
        priority: '0.6',
        changefreq: 'weekly',
        lastmod: item.created_at || new Date().toISOString(),
      })),
      
      // Albumページ
      ...albums.map(album => ({
        url: album.type === 'backnumber' ? `/backnumber/${album.id}` : `/albums/${album.id}`,
        priority: '0.6',
        changefreq: 'monthly',
        lastmod: album.created_at || new Date().toISOString(),
      })),
      
      // Eventページ（もし個別ページがある場合）
      ...events.map(event => ({
        url: `/events/${event.id}`,
        priority: '0.5',
        changefreq: 'weekly',
        lastmod: event.created_at || new Date().toISOString(),
      })),
    ];

    // 全ページを結合
    const allPages = [...staticPages, ...dynamicPages];

    // XMLサイトマップを生成
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1時間キャッシュ
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // エラー時は最小限のサイトマップを返す
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/news</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300', // エラー時は5分キャッシュ
      },
    });
  }
}
