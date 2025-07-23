'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { db } from '../../../lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { useRouter, useParams } from 'next/navigation'

interface Chapter {
  id?: string;
  title?: string;
  // tambahkan field lain sesuai kebutuhan
}

interface Comic {
  id: string;
  title: string;
  cover: string;
  chapters: Chapter[];
  genre?: string | string[];
  publishedAt?: string;
  authorId?: string;
  author?: string;
}

function ComicSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[2/3] w-full bg-white/10 rounded-lg mb-2" />
      <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-1" />
      <div className="h-3 bg-white/10 rounded w-1/2 mx-auto" />
    </div>
  )
}

export default function KomikPage() {
  const [search, setSearch] = useState('')
  const [comics, setComics] = useState<Comic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [heroComics, setHeroComics] = useState<Comic[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'id'
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      id: {
        // Search
        'komik.searchPlaceholder': 'Cari komik...',
        
        // Navigation
        'komik.previous': 'Sebelumnya',
        'komik.next': 'Berikutnya',
        
        // Hero Section
        'komik.readButton': 'Baca',
        'komik.byAuthor': 'oleh',
        
        // Genre Filter
        'komik.allGenres': 'Semua',
        
        // Error Messages
        'komik.error': 'Error:',
        'komik.noComicsAdded': 'Belum ada komik yang ditambahkan',
        'komik.noComicsFound': 'Tidak ada komik yang ditemukan',
        
        // Episode Info
        'komik.episode': 'Episode',
        
        // Loading
        'komik.loading': 'Memuat komik...'
      },
      en: {
        // Search
        'komik.searchPlaceholder': 'Search comics...',
        
        // Navigation
        'komik.previous': 'Previous',
        'komik.next': 'Next',
        
        // Hero Section
        'komik.readButton': 'Read',
        'komik.byAuthor': 'by',
        
        // Genre Filter
        'komik.allGenres': 'All',
        
        // Error Messages
        'komik.error': 'Error:',
        'komik.noComicsAdded': 'No comics added yet',
        'komik.noComicsFound': 'No comics found',
        
        // Episode Info
        'komik.episode': 'Episode',
        
        // Loading
        'komik.loading': 'Loading comics...'
      }
    };
    
    const localeTranslations = translations[locale as keyof typeof translations];
    return localeTranslations?.[key as keyof typeof localeTranslations] || translations.id[key as keyof typeof translations.id] || key;
  };

  // Genre translation function
  const translateGenre = (genre: string) => {
    const genreTranslations = {
      id: {
        // Common genres in Indonesian
        'Action': 'Aksi',
        'Adventure': 'Petualangan',
        'Comedy': 'Komedi',
        'Drama': 'Drama',
        'Fantasy': 'Fantasi',
        'Horror': 'Horor',
        'Mystery': 'Misteri',
        'Romance': 'Romantis',
        'Sci-Fi': 'Fiksi Ilmiah',
        'Slice of Life': 'Kehidupan Sehari-hari',
        'Sports': 'Olahraga',
        'Supernatural': 'Supernatural',
        'Thriller': 'Thriller',
        'Psychological': 'Psikologis',
        'Mecha': 'Mecha',
        'Historical': 'Sejarah',
        'School Life': 'Kehidupan Sekolah',
        'Martial Arts': 'Seni Bela Diri',
        'Music': 'Musik',
        'Cooking': 'Memasak',
        'Travel': 'Perjalanan',
        'Photography': 'Fotografi',
        'Writing': 'Menulis',
        'Anime': 'Anime',
        'Manga': 'Manga',
        'Film': 'Film',
        'TV': 'Acara TV',
        'Gaming': 'Gaming',
        'Art': 'Seni',
        'Drawing': 'Menggambar'
      },
      en: {
        // Common genres in English (keep original if already in English)
        'Aksi': 'Action',
        'Petualangan': 'Adventure',
        'Komedi': 'Comedy',
        'Drama': 'Drama',
        'Fantasi': 'Fantasy',
        'Horor': 'Horor',
        'Misteri': 'Mystery',
        'Romantis': 'Romance',
        'Fiksi Ilmiah': 'Sci-Fi',
        'Kehidupan Sehari-hari': 'Slice of Life',
        'Olahraga': 'Sports',
        'Supernatural': 'Supernatural',
        'Thriller': 'Thriller',
        'Psikologis': 'Psychological',
        'Mecha': 'Mecha',
        'Sejarah': 'Historical',
        'Kehidupan Sekolah': 'School Life',
        'Seni Bela Diri': 'Martial Arts',
        'Musik': 'Music',
        'Memasak': 'Cooking',
        'Perjalanan': 'Travel',
        'Fotografi': 'Photography',
        'Menulis': 'Writing',
        'Anime': 'Anime',
        'Manga': 'Manga',
        'Film': 'Film',
        'Acara TV': 'TV',
        'Gaming': 'Gaming',
        'Seni': 'Art',
        'Menggambar': 'Drawing'
      }
    };
    
    const localeGenreTranslations = genreTranslations[locale as keyof typeof genreTranslations];
    return localeGenreTranslations?.[genre as keyof typeof localeGenreTranslations] || genre;
  };
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    slides: { 
      perView: "auto",
      spacing: 20,
      origin: "center"
    },
    drag: true,
    defaultAnimation: {
      duration: 500,
      easing: (t) => t * (2 - t)
    },
    slideChanged(slider) {
      setActiveIndex(slider.track.details.rel)
    },
    initial:0,
  })

  useEffect(() => {
    async function fetchComics() {
      try {
        const comicsCol = collection(db, 'komik');
        const q = query(comicsCol, where('isPublished', '==', true));
        const comicsSnapshot = await getDocs(q);
        let comicsList = comicsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            chapters: Array.isArray(data.chapters) ? data.chapters : [],
          } as Comic;
        });
        setComics(comicsList);
        // Hero section: 5 terbaru by publishedAt
        comicsList = comicsList.filter(c => typeof c.publishedAt === 'string').sort((a, b) => new Date(b.publishedAt as string).getTime() - new Date(a.publishedAt as string).getTime());
        setHeroComics(comicsList.slice(0, 5));
        // Ambil genre unik dari field genre (bisa string atau array)
        const genreSet = new Set<string>();
        comicsList.forEach(c => {
          if (Array.isArray(c.genre)) {
            c.genre.forEach(g => {
              if (g) genreSet.add(g.trim());
            });
          } else if (typeof c.genre === 'string' && c.genre) {
            // Jika string mengandung koma, split
            c.genre.split(',').forEach(g => {
              if (g) genreSet.add(g.trim());
            });
          }
        });
        setGenres(Array.from(genreSet));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch comics');
      } finally {
        setLoading(false);
      }
    }
    fetchComics();
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.moveToIdx(activeIndex, true)
    }
  }, [activeIndex, instanceRef])

  const filtered = comics.filter(c => {
    const matchTitle = c.title.toLowerCase().includes(search.toLowerCase());
    if (!selectedGenre) return matchTitle;
    if (Array.isArray(c.genre)) return matchTitle && c.genre.includes(selectedGenre);
    if (typeof c.genre === 'string') return matchTitle && c.genre === selectedGenre;
    return false;
  });

  // Get episode info (max 5)
  const getEpisodeInfo = (chapters: Chapter[]) => {
    if (!chapters || chapters.length === 0) return '';
    const count = Math.min(chapters.length, 7);
    return `${count} ${t('komik.episode')}`;
  };

  const handleComicClick = (comic: Comic, event: React.MouseEvent) => {
    // Check if the click was on the creator name area
    const target = event.target as HTMLElement
    if (target.closest('.creator-name')) {
      event.preventDefault()
      event.stopPropagation()
      if (comic.authorId) {
        router.push(`/creator/${comic.authorId}`)
      }
      return
    }
    
    // Default behavior - navigate to comic detail
    router.push(`/${comic.id}`)
  }

  return (
    <main className="min-h-screen bg-black text-white w-full">
      {/* Search Bar */}
      <div className="w-full max-w-3xl mx-auto px-4 pt-2">
        <input
          type="search"
          placeholder={t('komik.searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {/* Hero Section */}
      {heroComics.length > 0 && (
        <div className="w-full mb-2 relative md:flex md:justify-center" style={{ height: '400px' }}>
          {/* Panah kiri */}
          <button
            type="button"
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition disabled:opacity-30"
            onClick={() => instanceRef.current?.prev()}
            disabled={heroComics.length === 0}
            aria-label={t('komik.previous')}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          {/* Panah kanan */}
          <button
            type="button"
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition disabled:opacity-30"
            onClick={() => instanceRef.current?.next()}
            disabled={heroComics.length === 0}
            aria-label={t('komik.next')}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="w-full max-w-3xl mx-auto relative" style={{ perspective: '2000px', height: '400px' }}>
            <div
              ref={sliderRef}
              className="keen-slider w-full absolute top-1/2 -translate-y-1/2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {heroComics.map((comic, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={comic.id}
                    className={`keen-slider__slide hero-card hero-card-responsive relative flex-shrink-0 transition-all duration-1000 ease-out ${isActive ? 'shadow-2xl border-2 border-purple-400' : 'shadow-lg border-transparent'} rounded-2xl`}
                    style={{
                      willChange: 'transform, opacity',
                      height: '340px',
                      width: '45vw',
                      maxWidth: '400px',
                      minWidth: '280px',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      borderRadius: '16px',
                      transform: `
                        scale(${isActive ? 1 : 0.85})
                        translateY(${isActive ? '-10px' : '0px'})
                      `,
                      opacity: isActive ? 1 : 0.3,
                      filter: `blur(${isActive ? '0px' : '2px'})`,
                      boxShadow: isActive 
                        ? '0 25px 50px -12px rgba(128,0,255,0.4), 0 0 40px rgba(128,0,255,0.2)' 
                        : 'none',
                    }}
                  >
                    <div 
                      className={`bg-gradient-to-b from-purple-900/80 to-black/80 rounded-2xl overflow-hidden flex flex-col items-center justify-between p-4 h-full transition-all duration-1000 ${isActive ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}
                    >
                      <div 
                        className="relative w-full aspect-[2/3] max-w-xs mx-auto mb-3 rounded-2xl overflow-hidden transition-all duration-1000" 
                        style={{
                          height: isActive ? 200 : 180,
                          transform: `scale(${isActive ? 1.05 : 1})`,
                        }}
                      >
                        <Image
                          src={comic.cover}
                          alt={comic.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 200px"
                          className={`object-cover transition-all duration-1000 ${isActive ? 'scale-110' : 'scale-100'}`}
                        />
                      </div>
                      <h2 className={`text-base font-semibold mb-1 text-center line-clamp-2 transition-all duration-500 ${isActive ? 'text-yellow-300 drop-shadow-lg scale-105' : 'text-white/50 scale-95'}`}>
                        {comic.title}
                      </h2>
                      {comic.author && (
                        <button 
                          className={`creator-name text-xs text-purple-300 hover:text-purple-200 transition-all duration-500 mb-2 ${isActive ? 'scale-105' : 'scale-95'}`}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (comic.authorId) {
                              router.push(`/creator/${comic.authorId}`)
                            }
                          }}
                        >
                          {t('komik.byAuthor')} {comic.author}
                        </button>
                      )}
                      <Link 
                        href={`/${locale}/${comic.id}`} 
                        className={`px-4 py-2 rounded-full transition-all duration-500 ${
                          isActive 
                            ? 'bg-yellow-400 hover:bg-yellow-500 text-purple-900 scale-105' 
                            : 'bg-purple-600/50 hover:bg-purple-700/50 text-white/70 scale-90'
                        } text-xs font-semibold shadow-lg mt-2`}
                      >
                        {t('komik.readButton')}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl mx-auto px-4 py-1">
        {/* Genre horizontal scroll */}
        {genres.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-2 px-2">
            <button
              className={`px-4 py-2 rounded-full border text-xs whitespace-nowrap transition font-semibold ${selectedGenre === '' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
              onClick={() => setSelectedGenre('')}
            >
              {t('komik.allGenres')}
            </button>
            {genres.map(genre => (
              <button
                key={genre}
                className={`px-4 py-2 rounded-full border text-xs whitespace-nowrap transition font-semibold ${selectedGenre === genre ? 'bg-purple-600 text-white border-purple-600' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {translateGenre(genre)}
              </button>
            ))}
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {t('komik.error')} {error}
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ComicSkeleton key={i} />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-8 text-white/60">
              {comics.length === 0 
                ? t('komik.noComicsAdded')
                : t('komik.noComicsFound')}
            </div>
          ) : (
            filtered.map(comic => (
              <div key={comic.id} className="group block" onClick={(e) => handleComicClick(comic, e)}>
                <div className="aspect-[2/3] w-full relative rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform cursor-pointer">
                  <Image
                    src={comic.cover}
                    alt={comic.title}
                    fill
                    sizes="(max-width: 768px) 33vw, 200px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 text-center">
                  <h2 className="font-semibold text-xs leading-tight line-clamp-2 break-words overflow-hidden min-h-[2.2em]">{comic.title}</h2>
                  {comic.author && (
                    <button 
                      className="creator-name text-xs text-purple-300 hover:text-purple-200 transition mt-1"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (comic.authorId) {
                          router.push(`/${locale}/creator/${comic.authorId}`)
                        }
                      }}
                                          >
                        {t('komik.byAuthor')} {comic.author}
                      </button>
                  )}
                  {getEpisodeInfo(comic.chapters) && (
                    <p className="text-xs text-white/60">{getEpisodeInfo(comic.chapters)}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 