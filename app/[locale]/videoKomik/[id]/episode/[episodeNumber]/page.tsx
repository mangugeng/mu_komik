'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { db } from 'lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Bookmark, Volume2, VolumeX } from 'lucide-react'

interface VideoKomik {
  id: string;
  title: string;
  cover: string;
  chapters: Chapter[];
  genre?: string | string[];
  publishedAt?: string;
  authorId?: string;
  author?: string;
}

type Chapter = { 
  id: string; 
  title: string;
  videos?: { videoUrl: string; thumbnailUrl?: string; duration?: number }[];
  thumbnail?: string;
  duration?: string;
  views?: number;
};

export default function EpisodePage() {
  const params = useParams()
  const router = useRouter()
  const [videoKomik, setVideoKomik] = useState<VideoKomik | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>(1)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string
        const episodeNumber = parseInt(params.episodeNumber as string)
        const docRef = doc(db, 'videoKomik', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data() as VideoKomik
          setVideoKomik(data)
          if (data.chapters && data.chapters.length >= episodeNumber) {
            const episode = data.chapters[episodeNumber - 1]
            setCurrentEpisode(episode)
            setCurrentEpisodeNumber(episodeNumber)
          } else {
            setError('Episode tidak ditemukan')
          }
        } else {
          setError('Video komik tidak ditemukan')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load episode')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id, params.episodeNumber])

  const navigateToPage = useCallback((episodeNumber: number) => {
    if (videoKomik) {
      router.push(`/videoKomik/${videoKomik.id}/episode/${episodeNumber}`)
    }
  }, [videoKomik, router])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!videoKomik) return
      
      const totalEpisodes = videoKomik.chapters?.length || 0
      
      if (event.key === 'ArrowLeft' && currentEpisodeNumber > 1) {
        navigateToPage(currentEpisodeNumber - 1)
      } else if (event.key === 'ArrowRight' && currentEpisodeNumber < totalEpisodes) {
        navigateToPage(currentEpisodeNumber + 1)
              }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [currentEpisodeNumber, videoKomik, navigateToPage])

  // Intersection Observer for autoplay/pause
  useEffect(() => {
    if (!currentEpisode?.videos) return;
    const refs = [...videoRefs.current]; // snapshot
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const idx = Number(entry.target.getAttribute('data-idx'));
        if (entry.isIntersecting) {
          setActiveIdx(idx);
          refs[idx]?.play();
        } else {
          refs[idx]?.pause();
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersect, {
      threshold: 0.7,
    });
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [currentEpisode]);

  const handleBack = () => router.back();
  const handleLike = () => alert('Like!');
  const handleComment = () => alert('Comment!');
  const handleShare = () => alert('Share!');
  const handleBookmark = () => alert('Bookmark!');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading episode...</div>
      </div>
    )
  }

  if (error || !videoKomik || !currentEpisode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Error: {error || 'Episode not found'}</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-y-scroll snap-y snap-mandatory">
      {/* Judul episode sticky di atas */}
      <div className="sticky top-0 left-0 w-full z-10 bg-black/80 py-3 px-4 text-center border-b border-white/10">
        <h2 className="text-white text-lg font-bold mb-0">{currentEpisode.title}</h2>
      </div>

      {/* Video list */}
      {(currentEpisode.videos ?? []).map((vid, idx) => (
        <div key={vid.videoUrl || idx} className="h-screen w-full flex items-center justify-center snap-start relative pb-24">
          {/* Tombol Unmute hanya untuk video aktif dan masih muted */}
          {activeIdx === idx && isMuted && (
            <button
              className="absolute top-6 right-6 z-30 bg-black/60 rounded-full p-3"
              onClick={() => setIsMuted(false)}
            >
              <VolumeX className="w-7 h-7 text-white" />
            </button>
          )}
          {activeIdx === idx && !isMuted && (
            <button
              className="absolute top-6 right-6 z-30 bg-black/60 rounded-full p-3"
              onClick={() => setIsMuted(true)}
            >
              <Volume2 className="w-7 h-7 text-white" />
            </button>
          )}
          {vid.videoUrl ? (
                <video
              ref={el => { videoRefs.current[idx] = el; if (el) el.muted = isMuted; }}
              data-idx={idx}
              src={vid.videoUrl}
              poster={vid.thumbnailUrl}
                  controls
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <div className="text-xl mb-2">Video tidak tersedia</div>
              </div>
        </div>
      )}
          {/* Overlay bawah: hanya info lain, tanpa nomor video */}
          <div className="absolute bottom-20 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Info lain bisa di sini jika perlu */}
      </div>
            </div>
          ))}
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-20 bg-black/90 border-t border-white/10 py-3 px-2 flex flex-col items-center pointer-events-none">
        <div className="flex items-center justify-center gap-3 mb-1">
          <button onClick={handleBack} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 text-white font-semibold text-base pointer-events-auto"><ArrowLeft className="w-5 h-5" />Back</button>
          <button onClick={handleLike} className="bg-white/10 rounded-xl p-3 pointer-events-auto"><ThumbsUp className="w-5 h-5" /></button>
          <button onClick={handleComment} className="bg-white/10 rounded-xl p-3 pointer-events-auto"><MessageCircle className="w-5 h-5" /></button>
          <button onClick={handleShare} className="bg-white/10 rounded-xl p-3 pointer-events-auto"><Share2 className="w-5 h-5" /></button>
          <button onClick={handleBookmark} className="bg-white/10 rounded-xl p-3 pointer-events-auto"><Bookmark className="w-5 h-5" /></button>
        </div>
        <div className="text-white/80 text-sm font-semibold text-center pointer-events-auto">{activeIdx + 1} / {currentEpisode.videos?.length}</div>
      </div>
    </div>
  )
} 