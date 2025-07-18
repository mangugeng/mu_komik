import { db } from './firebase';
import { collection, query, orderBy, limit, getDocs, where, doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: Date;
  views: number;
  likes: number;
  tags: string[];
}

// Mock data for fallback
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'MU Komik Hadirkan Fitur Video Komik Terbaru',
    content: 'Platform komik digital terdepan Indonesia menghadirkan inovasi terbaru dengan fitur video komik interaktif yang akan mengubah cara pembaca menikmati cerita.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'Fitur Baru',
    author: 'Tim MU Komik',
    publishedAt: new Date('2024-01-15'),
    views: 15420,
    likes: 892,
    tags: ['video komik', 'fitur baru', 'inovasi']
  },
  {
    id: '2',
    title: 'Kreator Lokal Raih Penghargaan Komik Digital 2024',
    content: 'Tiga komikus Indonesia berhasil meraih penghargaan dalam ajang Komik Digital Awards 2024, membuktikan kualitas karya lokal yang tidak kalah dengan internasional.',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    category: 'Penghargaan',
    author: 'Redaksi MU Komik',
    publishedAt: new Date('2024-01-12'),
    views: 12850,
    likes: 756,
    tags: ['penghargaan', 'kreator lokal', 'komik digital']
  },
  {
    id: '3',
    title: 'Update Rutin: 50 Komik Baru Setiap Minggu',
    content: 'MU Komik berkomitmen menghadirkan konten segar dengan update rutin 50 komik baru setiap minggu dari kreator-kreator terbaik Indonesia.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    category: 'Update',
    author: 'Tim Konten',
    publishedAt: new Date('2024-01-10'),
    views: 9870,
    likes: 634,
    tags: ['update rutin', 'komik baru', 'konten segar']
  },
  {
    id: '4',
    title: 'Kolaborasi dengan Universitas Seni Indonesia',
    content: 'MU Komik menjalin kerjasama strategis dengan Universitas Seni Indonesia untuk mengembangkan talenta komikus muda dan meningkatkan kualitas komik digital Indonesia.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=400&h=300&fit=crop',
    category: 'Kerjasama',
    author: 'Tim Partnership',
    publishedAt: new Date('2024-01-08'),
    views: 11230,
    likes: 445,
    tags: ['kerjasama', 'pendidikan', 'talenta muda']
  },
  {
    id: '5',
    title: 'Fitur Donasi untuk Dukung Kreator Lokal',
    content: 'Platform MU Komik menghadirkan fitur donasi yang memungkinkan pembaca memberikan dukungan langsung kepada kreator favorit mereka.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    category: 'Fitur',
    author: 'Tim Pengembangan',
    publishedAt: new Date('2024-01-05'),
    views: 15670,
    likes: 1023,
    tags: ['donasi', 'dukungan kreator', 'fitur baru']
  },
  {
    id: '6',
    title: 'Komik Indonesia Go International',
    content: 'Beberapa komik karya kreator Indonesia yang dipublikasikan di MU Komik berhasil menarik perhatian pasar internasional dan akan diterjemahkan ke berbagai bahasa.',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    category: 'Internasional',
    author: 'Tim Global',
    publishedAt: new Date('2024-01-03'),
    views: 18940,
    likes: 1289,
    tags: ['internasional', 'terjemahan', 'pasar global']
  }
];

export async function getLatestNews(limitCount: number = 6): Promise<NewsItem[]> {
  try {
    const newsRef = collection(db, 'news');
    const q = query(newsRef, orderBy('publishedAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('📰 No news found in Firestore, using mock data');
      return mockNews.slice(0, limitCount);
    }

    const news: NewsItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let publishedAt: Date;
      
      // Handle different timestamp formats
      if (data.publishedAt && typeof data.publishedAt.toDate === 'function') {
        // Firestore Timestamp
        publishedAt = data.publishedAt.toDate();
      } else if (data.publishedAt && data.publishedAt.seconds) {
        // Firestore Timestamp object
        publishedAt = new Date(data.publishedAt.seconds * 1000);
      } else if (data.publishedAt) {
        // String or Date object
        publishedAt = new Date(data.publishedAt);
      } else {
        // Fallback to current date
        publishedAt = new Date();
      }

      news.push({
        id: doc.id,
        title: data.title || '',
        content: data.content || '',
        imageUrl: data.imageUrl || '',
        category: data.category || '',
        author: data.author || '',
        publishedAt,
        views: data.views || 0,
        likes: data.likes || 0,
        tags: data.tags || []
      });
    });

    console.log(`📰 Fetched ${news.length} news items from Firestore`);
    return news;
  } catch (error) {
    console.error('❌ Error fetching news from Firestore:', error);
    console.log('📰 Falling back to mock data');
    return mockNews.slice(0, limitCount);
  }
}

export async function getNewsByCategory(category: string, limitCount: number = 6): Promise<NewsItem[]> {
  try {
    const newsRef = collection(db, 'news');
    const q = query(
      newsRef,
      where('status', '==', 'published'),
      where('category', '==', category),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const news: NewsItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      news.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category,
        author: data.author,
        publishedAt: data.publishedAt,
        views: data.views || 0,
        likes: data.likes || 0,
        tags: data.tags || []
      });
    });
    
    return news;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return [];
  }
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  try {
    const newsRef = doc(db, 'news', id);
    const newsDoc = await getDoc(newsRef);
    
    if (newsDoc.exists()) {
      const data = newsDoc.data();
      return {
        id: newsDoc.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category,
        author: data.author,
        publishedAt: data.publishedAt,
        views: data.views || 0,
        likes: data.likes || 0,
        tags: data.tags || []
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return null;
  }
}

export async function incrementNewsViews(id: string): Promise<void> {
  try {
    const newsRef = doc(db, 'news', id);
    await updateDoc(newsRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing news views:', error);
  }
}

export async function incrementNewsLikes(id: string): Promise<void> {
  try {
    const newsRef = doc(db, 'news', id);
    await updateDoc(newsRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing news likes:', error);
  }
} 