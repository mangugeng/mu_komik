import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function GET() {
  const q = query(collection(db, 'komik'), where('isPublished', '==', true));
  const snap = await getDocs(q);
  const urls = [];

  for (const doc of snap.docs) {
    const slug = doc.id;
    urls.push(`<url><loc>https://www.mu-komik.com/komik/${slug}</loc><priority>0.7</priority></url>`);

    // Fetch chapters for this comic
    const chaptersQuery = query(collection(db, `komik/${slug}/chapters`));
    const chaptersSnap = await getDocs(chaptersQuery);
    chaptersSnap.docs.forEach(chapterDoc => {
      const chapterId = chapterDoc.id;
      urls.push(`<url><loc>https://www.mu-komik.com/komik/${slug}/chapter/${chapterId}</loc><priority>0.5</priority></url>`);
    });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  });
} 