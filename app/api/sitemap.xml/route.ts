import { NextResponse } from 'next/server';

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.mu-komik.com/sitemap.xml</loc>
    <lastmod>2024-12-19</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.mu-komik.com/api/sitemap-komik.xml</loc>
    <lastmod>2024-12-19</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.mu-komik.com/api/sitemap-videokomik.xml</loc>
    <lastmod>2024-12-19</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
} 