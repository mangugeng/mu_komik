"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { Eye, Heart, Star, CheckCircle } from 'lucide-react';

interface VideoKomik {
  id: string;
  title: string;
  cover: string;
  chapters: Chapter[];
  genre?: string | string[];
  publishedAt?: string;
  authorId?: string;
  author?: string;
  authorAlias?: string;
}

interface CreatorProfile {
  displayName: string;
  alias?: string;
  bio?: string;
  email?: string;
  education?: string;
  experience?: string;
  birthDate?: string;
  availability?: string;
  awards?: string[];
  genres?: string[];
  photoURL?: string;
  avatar?: string;
  createdAt?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

type Chapter = { id: string; title: string };

export default function VideoKomikDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<VideoKomik | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorProfile, setAuthorProfile] = useState<CreatorProfile | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, 'videoKomik', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data() as VideoKomik);
        } else {
          setError('Video komik tidak ditemukan');
        }
      } catch {
        setError('Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    async function fetchAuthorProfile() {
      if (data?.authorId) {
        const docRef = doc(db, 'creatorProfiles', data.authorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAuthorProfile(docSnap.data() as CreatorProfile);
        }
      }
    }
    fetchAuthorProfile();
  }, [data?.authorId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-400">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-8 px-2">
      {/* Cover */}
      <div className="flex flex-col items-center">
        <Image
          src={data.cover}
          alt={data.title}
          width={260}
          height={360}
          className="rounded-2xl mb-4"
          priority
        />
        {/* Judul */}
        <div className="text-2xl font-bold text-center mb-1">{data.title}</div>
        {/* Author */}
        <div className="text-purple-400 text-lg mb-2">
          {data.authorId && (authorProfile?.displayName || data.authorAlias || data.author) ? (
            <button
              className="hover:underline hover:text-purple-300 transition-colors"
              onClick={() => router.push(`/creator/${data.authorId}`)}
            >
              {authorProfile?.displayName || data.authorAlias || data.author}
            </button>
          ) : (
            <span>{authorProfile?.displayName || data.authorAlias || data.author || 'Unknown Author'}</span>
          )}
        </div>
        {/* Statistik */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <span className="flex items-center gap-1 text-white/80"><Eye className="w-5 h-5" /> 0</span>
          <span className="flex items-center gap-1 text-white/80"><Heart className="w-5 h-5" /> 0</span>
          <span className="flex items-center gap-1 text-yellow-400"><Star className="w-5 h-5" /> 0.0</span>
        </div>
      </div>
      {/* Daftar Episode */}
      <div className="w-full max-w-md mt-4">
        <div className="text-lg font-semibold mb-2">Episode:</div>
        {Array.isArray(data.chapters) && data.chapters.length > 0 ? (
          data.chapters.map((ep: Chapter, idx: number) => (
            <button
              key={ep.id || idx}
              className="w-full flex items-center justify-between bg-black border border-white/20 rounded-2xl px-4 py-4 mb-4 text-left hover:bg-white/5 transition"
              onClick={() => router.push(`/videoKomik/${id}/episode/${idx + 1}`)}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🎬</span>
                <span className="font-semibold text-base truncate">
                  Eps {idx + 1} – {ep.title || `Episode ${idx + 1}`}
                </span>
              </span>
              <span className="flex items-center gap-1 text-green-400 font-semibold text-base">
                <CheckCircle className="w-5 h-5" /> Free
              </span>
            </button>
          ))
        ) : (
          <div className="text-white/60">Belum ada episode.</div>
        )}
      </div>
      {/* Bottom nav bar tetap di luar komponen ini */}
    </div>
  );
} 