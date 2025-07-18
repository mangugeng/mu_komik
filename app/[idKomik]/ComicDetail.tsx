'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { db } from '../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ChevronLeft, Info, Coins, CheckCircle, Share2, Facebook, Instagram, Link as LinkIcon, Eye, Heart, Star } from 'lucide-react'
import { usePreferences } from '../context/PreferencesContext'
import Head from 'next/head'
import { useRouter } from 'next/navigation'

interface Chapter {
  id?: string;
  title?: string;
  pages?: { imageUrl: string; isPaid?: boolean }[];
  pricePerPage: number;
  bundlePrice: number;
  language?: string;
  synopsis?: string;
}

interface Comic {
  id: string;
  title: string;
  cover: string;
  synopsis?: string;
  authorId: string;
  contributors: string[];
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  genre?: string | string[];
  category: string;
  tags?: string | string[];
  language: string;
  audience: string;
  authorAlias?: string;
  authorBioUrl: string;
  status: string;
  year: string;
  description?: string;
  coverUrl?: string;
  author?: string;
  genres?: string[];
  views?: number;
  likes?: number;
  rating?: number;
}

interface ComicDetailProps {
  idKomik: string
}

export default function ComicDetail({ idKomik }: ComicDetailProps) {
  const [comic, setComic] = useState<Comic | null>(null)
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState<{open: boolean, chapter?: Chapter}>({open: false})
  const { preferences } = usePreferences()
  const router = useRouter()

  // Apply user preferences
  const userLanguages = useMemo(() => preferences?.languages || ['id'], [preferences?.languages]) // Default to Indonesian if no preferences

  useEffect(() => {
    async function fetchComic() {
      try {
        const comicDoc = await getDoc(doc(db, 'komik', idKomik))
        if (comicDoc.exists()) {
          const data = comicDoc.data()
          // Filter chapters based on user's language preferences
          const filteredChapters = Array.isArray(data.chapters) 
            ? data.chapters.filter(chapter => 
                !chapter.language || // Include chapters with no language specified
                userLanguages.includes(chapter.language) // Include chapters matching user's preferred languages
              )
            : []
          
          setComic({
            id: comicDoc.id,
            ...data,
            chapters: filteredChapters,
          } as Comic)
        }
      } catch (error) {
        console.error('Error fetching comic:', error)
      } finally {
        setLoading(false)
      }
    }
    if (idKomik) fetchComic()
  }, [idKomik, userLanguages])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    )
  }

  if (!comic) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Komik Tidak Ditemukan</h1>
          <p className="text-gray-400">Komik yang Anda cari tidak ditemukan</p>
        </div>
      </div>
    )
  }

  // Helper function to ensure we're working with arrays
  const getArrayFromField = (field: string | string[] | undefined): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') return [field];
    return [];
  };

  const genres = getArrayFromField(comic.genre);
  const tags = getArrayFromField(comic.tags);

  // Open Graph meta tags for WhatsApp and social sharing
  const ogImage = comic.cover.startsWith('http') ? comic.cover : `https://mu-komik.com${comic.cover}`;
  const ogUrl = `https://mu-komik.com/${comic.id}`;
  const ogTitle = comic.title;
  const ogDescription = comic.synopsis || comic.description || '';

  const handleShare = async (platform: string) => {
    if (!comic) return;
    const shareUrl = ogUrl;
    const shareText = `Baca komik ${comic.title} di Mu-Komik!\n\n${shareUrl}`;
    let shareLink = '';
    
    // Helper function to get proxy image URL
    // const getProxyImageUrl = (originalUrl: string) => {
    //   if (originalUrl.includes('firebasestorage.googleapis.com')) {
    //     return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    //   }
    //   return originalUrl;
    // };
    
    // Check if ClipboardItem is supported
    // const isClipboardItemSupported = 'clipboard' in navigator && 'write' in navigator.clipboard;
    
    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(shareLink, '_blank');
        return;
      case 'facebook':
        // Facebook will automatically fetch the metadata from the URL
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        // Twitter has a character limit, so we'll use a shorter version
        const twitterText = `📚 ${comic.title} by ${comic.authorAlias || 'Unknown Author'}\nBaca di Mu-Komik!`;
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        alert('Teks telah disalin!');
        return;
      case 'copy':
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        alert('Teks telah disalin!');
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const handleAuthorClick = () => {
    if (comic?.authorId) {
      router.push(`/creator/${comic.authorId}`)
    }
  }

  return (
    <>
      <Head>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:site_name" content="Mu-Komik" />
      </Head>
      <div className="min-h-screen bg-black pb-4 md:pb-10 text-white relative">
        {/* Schema.org structured data for SEO */}
        <script type="application/ld+json" suppressHydrationWarning>{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: comic.title,
          author: comic.authorAlias || 'Unknown',
          image: comic.cover.startsWith('http') ? comic.cover : `https://mu-komik.com${comic.cover}`,
          description: comic.synopsis,
          genre: genres,
          keywords: tags,
          url: `https://mu-komik.com/${comic.id}`,
        })}</script>

        {/* Cover Image */}
        <div className="w-full flex justify-center p-4">
          <div className="relative w-[40vw] h-[60vw] mt-12 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={comic.cover}
              alt={comic.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Title and Author */}
        <div className="px-4 pb-6 text-center">
          <h1 className="text-base font-bold mb-2">{comic.title}</h1>
          {comic.authorId ? (
            <button
              onClick={handleAuthorClick}
              className="text-purple-300 hover:text-purple-200 transition-colors mb-6 cursor-pointer"
            >
              {comic.authorAlias || comic.author || 'Unknown Author'}
            </button>
          ) : (
            <p className="text-white/60 mb-6">{comic.authorAlias || comic.author || 'Unknown Author'}</p>
          )}
          
          {/* Stats Section */}
          <div className="flex justify-center items-center gap-6 mb-6">
            {/* Views */}
            <div className="flex items-center gap-2 text-white/70">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                {comic.views ? comic.views.toLocaleString() : '0'}
              </span>
            </div>
            
            {/* Likes */}
            <div className="flex items-center gap-2 text-white/70">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">
                {comic.likes ? comic.likes.toLocaleString() : '0'}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 text-white/70">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                {comic.rating ? comic.rating.toFixed(1) : '0.0'}
              </span>
            </div>
          </div>
          
          {/* Chapter List */}
          <div className="mb-6 text-left">
            <h3 className="text-base font-semibold mb-3">Episode:</h3>
            <div className="flex flex-col gap-4">
              {comic.chapters.map((chapter, index) => {
                const isPaid = Array.isArray(chapter.pages) && chapter.pages.some(p => p.isPaid);
                return (
                  <div key={chapter.id || index} className="relative">
                    <Link
                      href={`/${comic.id}/chapter/${index}`}
                      className="block bg-white/5 hover:bg-yellow-50/10 rounded-xl transition text-white border border-white/20 group"
                      style={{overflow: 'visible'}}
                    >
                      <div className="flex flex-row items-center justify-between px-4 py-4 gap-2">
                        <span className="flex-1 min-w-0 truncate text-lg sm:text-xl font-bold text-white group-hover:text-yellow-900 transition-colors duration-200">
                          {chapter.title || `Chapter ${index + 1}`}
                        </span>
                        {isPaid ? (
                          <button
                            type="button"
                            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-full px-4 py-1 font-bold shadow border border-white/30 select-none focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                            onClick={e => {e.preventDefault(); setShowPriceModal({open: true, chapter})}}
                          >
                            Berbayar
                          </button>
                        ) : (
                          <span className="flex-shrink-0 flex items-center gap-1 bg-green-500 text-white rounded-full shadow px-4 py-1 font-medium text-base">
                            <CheckCircle className="w-5 h-5 mr-1" /> Free
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-1000">
          <div className="flex w-full max-w-xs">
            <Link
              href="/komik"
              className="flex-1 flex items-center justify-center gap-2 px-0 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold transition rounded-l-full rounded-r-none border-r border-white/20"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Link>
            <button
              onClick={() => setShowShare(true)}
              className="flex-1 flex items-center justify-center gap-2 px-0 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold transition border-x border-white/20"
            >
              <Share2 className="w-5 h-5" />
              Share
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="flex-1 flex items-center justify-center gap-2 px-0 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold transition rounded-r-full rounded-l-none"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <Info className="w-5 h-5" />
              Info
            </button>
          </div>
        </div>

        {/* Share Modal */}
        {showShare && (
          <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60">
            <div className="bg-white rounded-2xl w-full max-w-md mx-auto mb-8 p-6 relative shadow-xl border border-gray-200 animate-fadeInUp">
              <button
                onClick={() => setShowShare(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
                aria-label="Tutup Share"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold mb-4 text-black">Bagikan Komik</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center justify-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Facebook className="w-6 h-6" />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center justify-center gap-2 p-3 bg-black hover:bg-gray-900 text-white rounded-lg transition"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </button>
                <button
                  onClick={() => handleShare('instagram')}
                  className="flex items-center justify-center gap-2 p-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
                >
                  <Instagram className="w-6 h-6" />
                  Instagram
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="col-span-2 flex items-center justify-center gap-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  <LinkIcon className="w-6 h-6" />
                  Salin Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Modal */}
        {showInfo && (
          <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60">
            <div className="bg-white rounded-2xl w-full max-w-md mx-auto mb-8 p-6 relative shadow-xl border border-gray-200 animate-fadeInUp">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
                aria-label="Tutup Info"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold mb-4 text-black">Informasi Komik</h2>
              {comic.synopsis && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Sinopsis</h3>
                  <p className="text-gray-800 text-sm">{comic.synopsis}</p>
                </div>
              )}
              {genres.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Harga */}
        {showPriceModal.open && showPriceModal.chapter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl font-bold" onClick={() => setShowPriceModal({open: false})}>×</button>
              <div className="mb-2 text-black font-bold text-lg">Harga Episode</div>
              <div className="mb-4 text-gray-700 text-base">
                {showPriceModal.chapter.pricePerPage && (
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-lg text-yellow-900">{showPriceModal.chapter.pricePerPage}</span>
                    <span className="text-sm text-gray-700">coin / halaman</span>
                  </div>
                )}
                {showPriceModal.chapter.bundlePrice && (
                  <div className="flex items-center justify-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-lg text-yellow-900">{showPriceModal.chapter.bundlePrice}</span>
                    <span className="text-sm text-gray-700">coin / 10 halaman</span>
                  </div>
                )}
              </div>
              <button className="mt-2 px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold" onClick={() => setShowPriceModal({open: false})}>Tutup</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
} 