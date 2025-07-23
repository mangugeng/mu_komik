'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getLatestNews, NewsItem } from '../../lib/newsService'
import NewsCard from '../components/NewsCard'
import FeatureCard from '../components/FeatureCard'
import StatsCard from '../components/StatsCard'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useParams } from 'next/navigation'

export default function Home() {
  const params = useParams();
  const locale = params?.locale as string || 'id';
  
  // Simple translation function
  const t = (key: string) => {
    const translations: { [locale: string]: { [key: string]: string } } = {
      id: {
        // Features
        'home.features.digitalComics': 'Komik Digital',
        'home.features.digitalComicsDesc': 'Baca komik digital berkualitas tinggi',
        'home.features.videoComics': 'Video Komik',
        'home.features.videoComicsDesc': 'Nikmati komik dalam format video',
        'home.features.multiPlatform': 'Multi Platform',
        'home.features.multiPlatformDesc': 'Akses dari berbagai perangkat',
        'home.features.localCreators': 'Kreator Lokal',
        'home.features.localCreatorsDesc': 'Dukung komikus Indonesia',
        'home.features.regularUpdates': 'Update Rutin',
        'home.features.regularUpdatesDesc': 'Konten baru setiap hari',
        'home.features.freePremium': 'Gratis Premium',
        'home.features.freePremiumDesc': 'Nikmati fitur premium tanpa biaya',
        
        // Stats
        'home.stats.digitalComics': 'Komik Digital',
        'home.stats.activeCreators': 'Kreator Aktif',
        'home.stats.loyalReaders': 'Pembaca Setia',
        'home.stats.videoComics': 'Video Komik',
        
        // News Section
        'home.newsAndUpdates': 'Berita & Update',
        'home.latestUpdates': 'Update Terbaru',
        'home.newsDescription': 'Ikuti perkembangan terbaru dari dunia komik Indonesia',
        
        // CTA Section
        'home.readyToStart': 'Siap Memulai?',
        'home.finalCTADescription': 'Bergabunglah dengan ribuan pembaca komik Indonesia',
        'home.startReadingComics': 'Mulai Baca Komik',
        'home.watchVideoComics': 'Tonton Video Komik',
        
        // Manifesto Section
        'home.manifestoTitle': 'Manifesto MU Komik',
        'home.manifestoDescription': 'Komitmen kami untuk industri komik Indonesia',
        'home.readFullManifesto': 'Baca Manifesto Lengkap',
        'home.viewFeaturedWorks': 'Lihat Karya Unggulan',
        
        // Toast & Footer
        'home.appComingSoon': 'Aplikasi mobile akan segera hadir!',
        'home.allRightsReserved': 'Semua hak dilindungi',
        
        // Hero Section
        'home.welcomeTo': 'Selamat Datang di',
        'home.heroDescription': 'Platform baca komik digital karya kreator Indonesia',
        'home.readComics': 'Baca Komik',
        'home.videoComics': 'Video Komik',
        'home.indonesianCreators': 'Kreator Indonesia',
        
        // Additional Sections
        'home.downloadApps': 'Download Aplikasi',
        'home.whyChoose': 'Mengapa Memilih',
        'home.featuresDescription': 'Nikmati pengalaman membaca komik terbaik',
        
        // Latest Comics Section
        'home.latestComics': 'Komik Terbaru',
        'home.latestComicsDesc': 'Komik terbaru dari kreator Indonesia',
        'home.viewDetails': 'Lihat Detail',
        
        // Comic Labels
        'comic.by': 'Oleh',
        'comic.episode': 'episode',
        
        // Common
        'common.close': 'Tutup'
      },
      en: {
        // Features
        'home.features.digitalComics': 'Digital Comics',
        'home.features.digitalComicsDesc': 'Read high-quality digital comics',
        'home.features.videoComics': 'Video Comics',
        'home.features.videoComicsDesc': 'Enjoy comics in video format',
        'home.features.multiPlatform': 'Multi Platform',
        'home.features.multiPlatformDesc': 'Access from various devices',
        'home.features.localCreators': 'Local Creators',
        'home.features.localCreatorsDesc': 'Support Indonesian comic artists',
        'home.features.regularUpdates': 'Regular Updates',
        'home.features.regularUpdatesDesc': 'New content every day',
        'home.features.freePremium': 'Free Premium',
        'home.features.freePremiumDesc': 'Enjoy premium features for free',
        
        // Stats
        'home.stats.digitalComics': 'Digital Comics',
        'home.stats.activeCreators': 'Active Creators',
        'home.stats.loyalReaders': 'Loyal Readers',
        'home.stats.videoComics': 'Video Comics',
        
        // News Section
        'home.newsAndUpdates': 'News & Updates',
        'home.latestUpdates': 'Latest Updates',
        'home.newsDescription': 'Follow the latest developments from the Indonesian comic world',
        
        // CTA Section
        'home.readyToStart': 'Ready to Start?',
        'home.finalCTADescription': 'Join thousands of Indonesian comic readers',
        'home.startReadingComics': 'Start Reading Comics',
        'home.watchVideoComics': 'Watch Video Comics',
        
        // Manifesto Section
        'home.manifestoTitle': 'MU Komik Manifesto',
        'home.manifestoDescription': 'Our commitment to the Indonesian comic industry',
        'home.readFullManifesto': 'Read Full Manifesto',
        'home.viewFeaturedWorks': 'View Featured Works',
        
        // Toast & Footer
        'home.appComingSoon': 'Mobile app coming soon!',
        'home.allRightsReserved': 'All rights reserved',
        
        // Hero Section
        'home.welcomeTo': 'Welcome to',
        'home.heroDescription': 'Digital comic platform by Indonesian creators',
        'home.readComics': 'Read Comics',
        'home.videoComics': 'Video Comics',
        'home.indonesianCreators': 'Indonesian Creators',
        
        // Additional Sections
        'home.downloadApps': 'Download Apps',
        'home.whyChoose': 'Why Choose',
        'home.featuresDescription': 'Enjoy the best comic reading experience',
        
        // Latest Comics Section
        'home.latestComics': 'Latest Comics',
        'home.latestComicsDesc': 'Latest comics from Indonesian creators',
        'home.viewDetails': 'View Details',
        
        // Comic Labels
        'comic.by': 'By',
        'comic.episode': 'episode',
        
        // Common
        'common.close': 'Close'
      }
    };
    
    return translations[locale as keyof typeof translations]?.[key] || translations.id[key] || key;
  };
  const [showToast, setShowToast] = useState(false)
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [latestComics, setLatestComics] = useState<{id: string, title: string, cover: string, genre?: string | string[], author?: string, synopsis?: string, chapters?: { [key: string]: unknown }[]}[]>([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('🔄 Fetching news from Firestore...')
        const latestNews = await getLatestNews(6)
        console.log('✅ News fetched successfully:', latestNews.length, 'items')
        console.log('📰 News data:', latestNews)
        setNews(latestNews)
      } catch (error) {
        console.error('❌ Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  useEffect(() => {
    async function fetchLatestComics() {
      try {
        const comicsCol = collection(db, 'komik');
        const q = query(comicsCol, where('isPublished', '==', true));
        const comicsSnapshot = await getDocs(q);
        let comicsList = comicsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            cover: data.cover,
            genre: data.genre,
            author: data.author,
            synopsis: data.synopsis,
            chapters: Array.isArray(data.chapters) ? data.chapters : [],
            publishedAt: data.publishedAt,
          };
        });
        comicsList = comicsList.filter(c => typeof c.publishedAt === 'string').sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setLatestComics(comicsList.slice(0, 3));
      } catch {
        setLatestComics([]);
      }
    }
    fetchLatestComics();
  }, []);

  const handleDownloadClick = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)
  }

  const features = [
    {
      icon: "📚",
      title: t('home.features.digitalComics'),
      description: t('home.features.digitalComicsDesc'),
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      icon: "🎬",
      title: t('home.features.videoComics'),
      description: t('home.features.videoComicsDesc'),
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      icon: "📱",
      title: t('home.features.multiPlatform'),
      description: t('home.features.multiPlatformDesc'),
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      icon: "🎨",
      title: t('home.features.localCreators'),
      description: t('home.features.localCreatorsDesc'),
      gradient: "bg-gradient-to-br from-orange-500 to-red-500"
    },
    {
      icon: "⚡",
      title: t('home.features.regularUpdates'),
      description: t('home.features.regularUpdatesDesc'),
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500"
    },
    {
      icon: "💎",
      title: t('home.features.freePremium'),
      description: t('home.features.freePremiumDesc'),
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500"
    }
  ]

  const stats = [
    { number: "10K+", label: t('home.stats.digitalComics'), icon: "📚" },
    { number: "500+", label: t('home.stats.activeCreators'), icon: "🎨" },
    { number: "1M+", label: t('home.stats.loyalReaders'), icon: "👥" },
    { number: "50K+", label: t('home.stats.videoComics'), icon: "🎬" }
  ]

  // const latestNews = news.slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-purple-900">
      {/* Header with Language Switcher */}
      <header className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute inset-0 bg-dot-pattern"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center">
          {/* Hero Logo */}
          <div className="w-full flex justify-center mb-8">
            <div className="relative group">
              <div className="w-48 h-48 relative">
                <Image
                  src="/images/logo.png"
                  alt="MU Komik Hero"
                  width={200}
                  height={200}
                  sizes="(max-width: 768px) 200px, 200px"
                  className="object-cover rounded-3xl shadow-2xl border-4 border-white/20 group-hover:border-purple-400 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>

          {/* Badge Indonesia */}
          <div className="mb-6 w-full flex justify-center">
            <div className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold rounded-full text-sm shadow-lg flex items-center gap-2 animate-bounce">
              🇮🇩 {t('home.indonesianCreators')}
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 w-full text-center drop-shadow-2xl">
            <span className="text-yellow-400">{t('home.welcomeTo')}</span>{' '}
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              MU Komik
            </span>
          </h1>
          
          <p className="text-xl text-center mb-12 w-full text-white/90 max-w-3xl leading-relaxed">
            {t('home.heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mx-auto mb-16">
            <Link
              href={`/${locale}/komik`}
              className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25"
            >
              📚 {t('home.readComics')}
            </Link>
            <Link
              href={`/${locale}/videoKomik`}
              className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
            >
              🎬 {t('home.videoComics')}
            </Link>
          </div>

          {/* Download App Button */}
          <button
            type="button"
            onClick={handleDownloadClick}
            className="py-3 px-6 bg-white/10 hover:bg-white/20 rounded-xl text-base font-semibold text-center border border-white/20 shadow-lg transition-all duration-300 hover:border-white/40"
          >
            📱 {t('home.downloadApps')}
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                number={stat.number}
                label={stat.label}
                icon={stat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('home.whyChoose')} <span className="text-purple-300">MU Komik</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {t('home.featuresDescription')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
              />
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-black/20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('home.newsAndUpdates')} <span className="text-purple-300">{t('home.latestUpdates')}</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {t('home.newsDescription')}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 animate-pulse">
                  <div className="w-full h-32 bg-white/10 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-white/10 rounded w-full"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} onClick={() => setSelectedNews(item)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Komik Terbaru Section */}
      <section className="py-12 bg-black/30">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">{t('home.latestComics')}</h2>
            <p className="text-lg text-white/70">{t('home.latestComicsDesc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {latestComics.map(comic => (
              <div key={comic.id} className="bg-white/5 rounded-xl p-4 flex flex-col items-center">
                <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden mb-3">
                  <Image
                    src={comic.cover}
                    alt={comic.title}
                    fill
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-bold text-center text-white mb-2">{comic.title}</h3>
                <div className="text-sm text-white/70 mb-1">
                  {Array.isArray(comic.genre) ? comic.genre.join(', ') : comic.genre}
                </div>
                <div className="text-xs text-purple-300 mb-2">{comic.author ? `${t('comic.by')} ${comic.author}` : ''}</div>
                <div className="text-xs text-white/60 mb-2 min-h-[2.5em]">
                  {comic.synopsis ? comic.synopsis.slice(0, 100) + (comic.synopsis.length > 100 ? '...' : '') : ''}
                </div>
                <div className="text-xs text-white/50 mb-2">
                  {comic.chapters && comic.chapters.length > 0 ? `${comic.chapters.length} ${t('comic.episode')}` : ''}
                </div>
                <a
                  href={`/${comic.id}`}
                  className="mt-2 px-4 py-2 bg-purple-600 rounded-full text-white font-semibold text-sm hover:bg-purple-700 transition"
                >
                  {t('home.viewDetails')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full relative animate-fadeInUp">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl font-bold"
              onClick={() => setSelectedNews(null)}
              aria-label={t('common.close')}
            >
              ×
            </button>
            <div className="mb-4 w-full h-48 relative rounded-lg overflow-hidden">
              <Image
                src={selectedNews.imageUrl || '/images/placeholder.png'}
                alt={selectedNews.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
              <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${(() => {
                const colors: Record<string, string> = {
                  'Prestasi': 'bg-yellow-500',
                  'Fitur': 'bg-blue-500',
                  'Trending': 'bg-red-500',
                  'Tips': 'bg-green-500',
                  'Event': 'bg-purple-500',
                  'Update': 'bg-orange-500',
                  'Wawancara': 'bg-pink-500',
                  'Analisis': 'bg-indigo-500'
                };
                return colors[selectedNews.category] || 'bg-gray-500';
              })()}`}>{selectedNews.category}</div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-black">{selectedNews.title}</h2>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{selectedNews.author}</span>
              <span>{new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(selectedNews.publishedAt)}</span>
            </div>
            <div className="text-gray-800 whitespace-pre-line mb-4" style={{maxHeight: 300, overflowY: 'auto'}}>
              {selectedNews.content}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>👁️ {selectedNews.views}</span>
              <span>❤️ {selectedNews.likes}</span>
            </div>
          </div>
        </div>
      )}

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('home.readyToStart')}
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            {t('home.finalCTADescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mx-auto">
            <Link
              href={`/${locale}/komik`}
              className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              📚 {t('home.startReadingComics')}
            </Link>
            <Link
              href={`/${locale}/videoKomik`}
              className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              🎬 {t('home.watchVideoComics')}
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              📜 {t('home.manifestoTitle')}
            </h2>
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              {t('home.manifestoDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/manifesto`}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                📖 {t('home.readFullManifesto')}
              </Link>
              <Link
                href={`/${locale}/unggulan`}
                className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 border border-white/30"
              >
                🎨 {t('home.viewFeaturedWorks')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 text-lg font-semibold animate-fade-in border border-white/20">
          📱 {t('home.appComingSoon')}
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-black/40 border-t border-white/10">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} MU Komik. {t('home.allRightsReserved')}.
          </div>
        </div>
      </footer>
    </main>
  )
} 