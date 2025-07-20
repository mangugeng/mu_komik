'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getLatestNews, NewsItem } from '../lib/newsService'
import NewsCard from './components/NewsCard'
import FeatureCard from './components/FeatureCard'
import StatsCard from './components/StatsCard'
import Head from 'next/head'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function Home() {
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

  // Add structured data for SEO
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MU Komik",
      "description": "Platform baca komik digital karya kreator Indonesia",
      "url": "https://mu-komik.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://mu-komik.com/komik?search={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MU Komik",
        "logo": {
          "@type": "ImageObject",
          "url": "https://mu-komik.com/images/logo.png"
        }
      },
      "mainEntity": {
        "@type": "CreativeWork",
        "name": "MU Komik Platform",
        "description": "Platform komik digital terdepan khusus karya kreator Indonesia",
        "creator": {
          "@type": "Organization",
          "name": "MU Komik Team"
        },
        "genre": ["Comics", "Digital Media", "Entertainment"],
        "inLanguage": "id",
        "audience": {
          "@type": "Audience",
          "audienceType": "Comic Readers"
        }
      }
    }

    // Add structured data to head
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const features = [
    {
      icon: "📚",
      title: "Komik Digital",
      description: "Nikmati ribuan komik digital berkualitas tinggi dari kreator Indonesia terbaik.",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      icon: "🎬",
      title: "Video Komik",
      description: "Pengalaman baru dengan video komik interaktif yang menghidupkan cerita.",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      icon: "📱",
      title: "Multi Platform",
      description: "Baca di mana saja dengan aplikasi mobile dan website yang responsif.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      icon: "🎨",
      title: "Kreator Lokal",
      description: "Dukung dan temukan talenta komikus Indonesia yang luar biasa.",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500"
    },
    {
      icon: "⚡",
      title: "Update Rutin",
      description: "Konten baru setiap hari dengan update rutin dari komikus favorit.",
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500"
    },
    {
      icon: "💎",
      title: "Gratis Premium",
      description: "Akses konten premium tanpa biaya, dukung kreator melalui donasi.",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500"
    }
  ]

  const stats = [
    { number: "10K+", label: "Komik Digital", icon: "📚" },
    { number: "500+", label: "Kreator Aktif", icon: "🎨" },
    { number: "1M+", label: "Pembaca Setia", icon: "👥" },
    { number: "50K+", label: "Video Komik", icon: "🎬" }
  ]

  const latestNews = news.slice(0, 3);

  return (
    <>
      <Head>
        {latestNews.map((item, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                "headline": item.title,
                "image": [item.imageUrl || "https://mu-komik.com/images/logo.png"],
                "datePublished": item.publishedAt,
                "author": {
                  "@type": "Organization",
                  "name": "MU Komik"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "MU Komik",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://mu-komik.com/images/logo.png"
                  }
                },
                "description": item.content?.slice(0, 160) || item.title,
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `https://mu-komik.com/berita/${item.id}`
                }
              })
            }}
          />
        ))}
      </Head>
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-purple-900">
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
              🇮🇩 100% Karya Kreator Indonesia
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 w-full text-center drop-shadow-2xl">
            <span className="text-yellow-400">Selamat Datang di</span>{' '}
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              MU Komik
            </span>
          </h1>
          
          <p className="text-xl text-center mb-12 w-full text-white/90 max-w-3xl leading-relaxed">
            Platform baca komik digital terdepan khusus karya kreator Indonesia! Dukung komikus lokal, 
            nikmati cerita-cerita seru, dan temukan talenta baru dari seluruh Nusantara. 
            Baca gratis, nyaman, dan update setiap hari di website atau aplikasi kami.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mx-auto mb-16">
            <Link
              href="/komik"
              className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25"
            >
              📚 Baca Komik
            </Link>
            <Link
              href="/videoKomik"
              className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
            >
              🎬 Video Komik
            </Link>
          </div>

          {/* Download App Button */}
          <button
            type="button"
            onClick={handleDownloadClick}
            className="py-3 px-6 bg-white/10 hover:bg-white/20 rounded-xl text-base font-semibold text-center border border-white/20 shadow-lg transition-all duration-300 hover:border-white/40"
          >
            📱 Download Apps
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
              Mengapa Memilih <span className="text-purple-300">MU Komik</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Platform komik digital terbaik dengan fitur-fitur unggulan yang dirancang khusus untuk pengalaman membaca yang maksimal.
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
              Berita & <span className="text-purple-300">Update Terbaru</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Dapatkan informasi terbaru seputar dunia komik Indonesia, fitur baru, dan cerita menarik dari kreator favorit Anda.
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
              <h2 className="text-3xl font-bold text-white mb-2">Komik Terbaru</h2>
              <p className="text-lg text-white/70">3 komik terbaru di MU Komik</p>
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
                  <div className="text-xs text-purple-300 mb-2">{comic.author ? `oleh ${comic.author}` : ''}</div>
                  <div className="text-xs text-white/60 mb-2 min-h-[2.5em]">
                    {comic.synopsis ? comic.synopsis.slice(0, 100) + (comic.synopsis.length > 100 ? '...' : '') : ''}
                  </div>
                  <div className="text-xs text-white/50 mb-2">
                    {comic.chapters && comic.chapters.length > 0 ? `${comic.chapters.length} Episode` : ''}
                  </div>
                  <a
                    href={`/${comic.id}`}
                    className="mt-2 px-4 py-2 bg-purple-600 rounded-full text-white font-semibold text-sm hover:bg-purple-700 transition"
                  >
                    Lihat Detail
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
              aria-label="Tutup Berita"
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
            Siap Memulai Petualangan?
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Bergabunglah dengan jutaan pembaca yang sudah menikmati komik digital terbaik dari kreator Indonesia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg mx-auto">
            <Link
              href="/komik"
              className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              📚 Mulai Baca Komik
            </Link>
            <Link
              href="/videoKomik"
              className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-2xl text-lg font-bold text-center shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              🎬 Tonton Video Komik
            </Link>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              📜 Manifesto Etika AI & Komitmen Kreatif
            </h2>
            <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
              Kami percaya bahwa AI adalah alat bantu, bukan pengganti seniman. Platform kami memberdayakan kreator Indonesia dengan teknologi yang bertanggung jawab dan etis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/manifesto"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                📖 Baca Manifesto Lengkap
              </Link>
              <Link
                href="/unggulan"
                className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 border border-white/30"
              >
                🎨 Lihat Karya Unggulan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 text-lg font-semibold animate-fade-in border border-white/20">
          📱 Aplikasi Segera Hadir!
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 bg-black/40 border-t border-white/10">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} MU Komik. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
    </>
  )
} 