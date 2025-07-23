"use client"

import { useEffect, useState } from "react";
import { db } from '../../../lib/firebase'
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";

interface Comic {
  id: string;
  title: string;
  cover: string;
  synopsis?: string;
  teaserVideo?: string;
  teaserThumbnail?: string;
  language?: string;
}

interface VideoComic {
  id: string;
  title: string;
  cover: string;
  synopsis?: string;
  teaserVideo?: string;
  teaserThumbnail?: string;
  language?: string;
}

export default function UnggulanPage() {
  const [activeTab, setActiveTab] = useState<'unggulan' | 'teaser'>('unggulan');
  const [comics, setComics] = useState<Comic[]>([]);
  const [videoComics, setVideoComics] = useState<VideoComic[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedComic, setExpandedComic] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const params = useParams();
  const locale = params?.locale as string || 'id';
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      id: {
        // Page Title
        'featured.title': 'Konten Unggulan',
        
        // Tab Navigation
        'featured.featured': 'Unggulan',
        'featured.teaser': 'Teaser',
        
        // Loading and Empty States
        'featured.loading': 'Loading...',
        'featured.noFeaturedComics': 'Belum ada komik unggulan.',
        'featured.noTeaserVideos': 'Belum ada video teaser.',
        
        // Interactive Elements
        'featured.swipeForDetail': 'Swipe untuk detail',
        'featured.readNow': 'Baca Sekarang',
        'featured.watchNow': 'Tonton Sekarang',
        'featured.close': 'Tutup',
        
        // Video States
        'featured.videoNotAvailable': 'Video tidak tersedia'
      },
      en: {
        // Page Title
        'featured.title': 'Featured Content',
        
        // Tab Navigation
        'featured.featured': 'Featured',
        'featured.teaser': 'Teaser',
        
        // Loading and Empty States
        'featured.loading': 'Loading...',
        'featured.noFeaturedComics': 'No featured comics yet.',
        'featured.noTeaserVideos': 'No teaser videos yet.',
        
        // Interactive Elements
        'featured.swipeForDetail': 'Swipe for details',
        'featured.readNow': 'Read Now',
        'featured.watchNow': 'Watch Now',
        'featured.close': 'Close',
        
        // Video States
        'featured.videoNotAvailable': 'Video not available'
      }
    };
    
    const localeTranslations = translations[locale as keyof typeof translations];
    return localeTranslations?.[key as keyof typeof localeTranslations] || translations.id[key as keyof typeof translations.id] || key;
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch unggulan comics
      const unggulanQuery = query(
        collection(db, "komik"), 
        where("isUnggulan", "==", true), 
        where("isPublished", "==", true)
      );
      const unggulanSnap = await getDocs(unggulanQuery);
      const unggulanList: Comic[] = unggulanSnap.docs
        .map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Comic))
        .filter(comic => !comic.language || comic.language === locale); // Filter by language
      setComics(unggulanList);

      // Fetch video comics with teaser
      const videoQuery = query(
        collection(db, "videoKomik"), 
        where("isPublished", "==", true)
      );
      const videoSnap = await getDocs(videoQuery);
      const videoList: VideoComic[] = videoSnap.docs
        .map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        } as VideoComic))
        .filter(comic => comic.teaserVideo && (!comic.language || comic.language === locale)); // Filter by language and teaser
      setVideoComics(videoList);
      
      setLoading(false);
    }
    fetchData();
  }, []);



  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (comicId: string) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50; // Minimum swipe distance
    
    if (isSwipeUp) {
      setExpandedComic(comicId);
    } else if (distance < -50) {
      setExpandedComic(null);
    }
  };

  const toggleExpanded = (comicId: string) => {
    setExpandedComic(expandedComic === comicId ? null : comicId);
  };

  return (
    <div className="min-h-screen bg-black text-white w-full">
      <h1 className="text-2xl font-bold mb-6 text-center pt-8">{t('featured.title')}</h1>
      
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 rounded-full p-1 flex">
          <button
            onClick={() => setActiveTab('unggulan')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'unggulan'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t('featured.featured')}
          </button>
          <button
            onClick={() => setActiveTab('teaser')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              activeTab === 'teaser'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {t('featured.teaser')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">{t('featured.loading')}</div>
      ) : (
        <>
          {/* Unggulan Tab */}
          {activeTab === 'unggulan' && (
            comics.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-400">
                {t('featured.noFeaturedComics')}
              </div>
      ) : (
              <div className="w-full overflow-x-auto pb-32 md:pb-28">
          <div className="flex gap-8 px-4 snap-x snap-mandatory">
            {comics.map((comic) => (
                    <div key={comic.id} className="min-w-full max-w-lg snap-center">
                      {/* Comic Container with Overlay */}
                      <div 
                        className="relative w-full max-w-md mx-auto aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl mb-4 cursor-pointer"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(comic.id)}
                        onClick={() => toggleExpanded(comic.id)}
                      >
                        {/* Background Image */}
                  <Image
                    src={comic.cover}
                    alt={comic.title}
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                        
                        {/* Overlay for Description */}
                        {expandedComic === comic.id && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-6">
                            <div className="space-y-4">
                              <h2 className="text-2xl font-bold text-white leading-tight">
                                {comic.title}
                              </h2>
                              
                              {comic.synopsis && (
                                <p className="text-white/90 text-sm leading-relaxed">
                                  {comic.synopsis}
                                </p>
                              )}
                              
                              <div className="flex gap-3 pt-2">
                                <Link 
                                  href={`/${locale}/${comic.id}`} 
                                  className="flex-1 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition text-center text-sm"
                                >
                                  {t('featured.readNow')}
                                </Link>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedComic(null);
                                  }}
                                  className="flex-1 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold transition text-sm"
                                >
                                  {t('featured.close')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Swipe Indicator - Only show when not expanded */}
                        {expandedComic !== comic.id && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 rounded-full px-3 py-1 flex items-center gap-2">
                            <ChevronUp className="w-4 h-4 text-white" />
                            <span className="text-xs text-white">{t('featured.swipeForDetail')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Title below image - Only show when not expanded */}
                      {expandedComic !== comic.id && (
                        <h2 className="text-xl font-bold mb-4 text-center line-clamp-2 px-4">
                          {comic.title}
                        </h2>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Teaser Tab */}
          {activeTab === 'teaser' && (
            videoComics.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-400">
                {t('featured.noTeaserVideos')}
              </div>
            ) : (
              <div className="w-full overflow-x-auto pb-32 md:pb-28">
                <div className="flex gap-8 px-4 snap-x snap-mandatory">
                  {videoComics.map((comic) => (
                    <div key={comic.id} className="min-w-full max-w-lg snap-center">
                      {/* Video Container with Overlay */}
                      <div 
                        className="relative w-full max-w-md mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl mb-4 cursor-pointer"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd(comic.id)}
                        onClick={() => toggleExpanded(comic.id)}
                      >
                        {/* Background Video/Image */}
                        {comic.teaserVideo ? (
                          <video
                            src={comic.teaserVideo}
                            poster={comic.teaserThumbnail || comic.cover}
                            className="w-full h-full object-cover"
                            controls

                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">🎬</div>
                              <div className="text-sm text-gray-400">{t('featured.videoNotAvailable')}</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay for Description */}
                        {expandedComic === comic.id && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-6">
                            <div className="space-y-4">
                              <h2 className="text-2xl font-bold text-white leading-tight">
                                {comic.title}
                              </h2>
                              
                              {comic.synopsis && (
                                <p className="text-white/90 text-sm leading-relaxed">
                                  {comic.synopsis}
                                </p>
                              )}
                              
                              <div className="flex gap-3 pt-2">
                                <Link 
                                  href={`/${locale}/videoKomik/${comic.id}`} 
                                  className="flex-1 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition text-center text-sm"
                                >
                                  {t('featured.watchNow')}
                                </Link>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedComic(null);
                                  }}
                                  className="flex-1 px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold transition text-sm"
                                >
                                  {t('featured.close')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Swipe Indicator - Only show when not expanded */}
                        {expandedComic !== comic.id && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 rounded-full px-3 py-1 flex items-center gap-2">
                            <ChevronUp className="w-4 h-4 text-white" />
                            <span className="text-xs text-white">{t('featured.swipeForDetail')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Title below video - Only show when not expanded */}
                      {expandedComic !== comic.id && (
                        <h2 className="text-xl font-bold mb-4 text-center line-clamp-2 px-4">
                          {comic.title}
                        </h2>
                      )}
              </div>
            ))}
          </div>
        </div>
            )
          )}
        </>
      )}
    </div>
  );
} 