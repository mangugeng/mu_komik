"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
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
interface Comic {
  id: string;
  title: string;
  cover: string;
}
interface VideoKomik {
  id: string;
  title: string;
  cover: string;
}

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorId = params.creatorId as string;
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<number | null>(null);
  const [comics, setComics] = useState<Comic[]>([]);
  const [videoKomiks, setVideoKomiks] = useState<VideoKomik[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const docRef = doc(db, 'creatorProfiles', creatorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as CreatorProfile);
      }
      setLoading(false);
    }
    if (creatorId) fetchProfile();
  }, [creatorId]);

  useEffect(() => {
    async function fetchFollowers() {
      // Hitung jumlah followers jika subcollection followers ada
      try {
        // Jika ada subcollection followers, bisa gunakan getDocs
        // const followersCol = collection(db, 'creatorProfiles', creatorId, 'followers');
        // const followersSnap = await getDocs(followersCol);
        // setFollowers(followersSnap.size);
        setFollowers(null); // Placeholder, implementasi sesuai struktur Firestore Anda
      } catch {
        setFollowers(null);
      }
    }
    if (creatorId) fetchFollowers();
  }, [creatorId]);

  useEffect(() => {
    async function fetchComics() {
      const q = query(collection(db, 'komik'), where('authorId', '==', creatorId));
      const snap = await getDocs(q);
      setComics(snap.docs.map(doc => ({ ...(doc.data() as Comic), id: doc.id })));
    }
    async function fetchVideoKomiks() {
      const q = query(collection(db, 'videoKomik'), where('authorId', '==', creatorId));
      const snap = await getDocs(q);
      setVideoKomiks(snap.docs.map(doc => ({ ...(doc.data() as VideoKomik), id: doc.id })));
    }
    if (creatorId) {
      fetchComics();
      fetchVideoKomiks();
    }
  }, [creatorId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Creator not found</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-8 px-2">
      {/* Avatar */}
      {(profile.photoURL || profile.avatar) && (
        <div className="mb-4">
          <Image
            src={profile.photoURL || profile.avatar || '/images/placeholder.png'}
            alt={profile.displayName}
            width={120}
            height={120}
            className="rounded-full object-cover border-4 border-purple-400 shadow-lg"
          />
        </div>
      )}
      <div className="text-3xl font-bold mb-2">{profile.displayName}</div>
      {profile.alias && <div className="text-purple-300 text-lg mb-2">Alias: {profile.alias}</div>}
      {profile.bio && <div className="mb-4 text-white/80">{profile.bio}</div>}
      <button
        className="mb-6 p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-400"
        onClick={() => setShowInfoModal(true)}
        aria-label="Info Creator"
      >
        <InformationCircleIcon className="w-7 h-7" />
      </button>
      {/* Komik Buatan Creator */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-200">Komik oleh {profile.displayName}</h2>
        {comics.length === 0 ? (
          <div className="text-white/60">Belum ada komik.</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {comics.map(comic => (
              <div key={comic.id} className="bg-white/5 rounded-xl flex flex-col items-center hover:bg-white/10 transition cursor-pointer w-[140px] h-[230px] p-2">
                <div className="relative w-[120px] h-[180px] mb-2">
                  <Image
                    src={comic.cover}
                    alt={comic.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="120px"
                  />
                </div>
                <div className="text-center text-sm font-semibold text-white line-clamp-2 mb-1 w-full">{comic.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* VideoKomik Buatan Creator */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4 text-purple-200">Video Komik oleh {profile.displayName}</h2>
        {videoKomiks.length === 0 ? (
          <div className="text-white/60">Belum ada video komik.</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {videoKomiks.map(vk => (
              <div key={vk.id} className="bg-white/5 rounded-xl flex flex-col items-center hover:bg-white/10 transition cursor-pointer w-[140px] h-[230px] p-2">
                <div className="relative w-[120px] h-[180px] mb-2">
                  <Image
                    src={vk.cover}
                    alt={vk.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="120px"
                  />
                </div>
                <div className="text-center text-sm font-semibold text-white line-clamp-2 mb-1 w-full">{vk.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal Info */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full relative text-black">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl font-bold"
              onClick={() => setShowInfoModal(false)}
              aria-label="Tutup Info"
            >
              ×
            </button>
            <div className="text-2xl font-bold mb-4 text-purple-700">Info Lengkap Creator</div>
            <div className="space-y-2 text-base">
              {profile.email && <div><span className="text-gray-500">Email:</span> <span>{profile.email}</span></div>}
              {profile.education && <div><span className="text-gray-500">Pendidikan:</span> <span>{profile.education}</span></div>}
              {profile.experience && <div><span className="text-gray-500">Pengalaman:</span> <span>{profile.experience}</span></div>}
              {profile.birthDate && <div><span className="text-gray-500">Tanggal Lahir:</span> <span>{formatDate(profile.birthDate)}</span></div>}
              {profile.availability && <div><span className="text-gray-500">Status:</span> <span>{profile.availability}</span></div>}
              {profile.awards && Array.isArray(profile.awards) && profile.awards.length > 0 && (
                <div><span className="text-gray-500">Penghargaan:</span> <span>{profile.awards.join(', ')}</span></div>
              )}
              {profile.genres && Array.isArray(profile.genres) && profile.genres.length > 0 && (
                <div><span className="text-gray-500">Genre:</span> <span>{profile.genres.join(', ')}</span></div>
              )}
              <div><span className="text-gray-500">Followers:</span> <span>{followers !== null ? followers : '-'}</span></div>
              {profile.createdAt && <div><span className="text-gray-500">Bergabung:</span> <span>{formatDate(profile.createdAt)}</span></div>}
              {profile.socialLinks && (
                <div className="flex gap-4 mt-2">
                  {profile.socialLinks.instagram && (
                    <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram</a>
                  )}
                  {profile.socialLinks.twitter && (
                    <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Twitter</a>
                  )}
                  {profile.socialLinks.website && (
                    <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Website</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 