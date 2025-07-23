'use client'

import Link from 'next/link'
import { Flame, Bookmark, ThumbsUp, BookOpen, Trash2, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../../../lib/firebase'
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'

interface BookmarkData {
  idKomik: string;
  chapterId: string;
  title: string;
  chapterTitle: string;
  page?: number;
  lastRead?: string;
  cover?: string;
  isPaid?: boolean;
}

export default function BacaankuPage() {
  const [tab, setTab] = useState<'bookmark' | 'like' | 'history'>('bookmark')
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([])
  const [likes, setLikes] = useState<BookmarkData[]>([])
  const [history, setHistory] = useState<BookmarkData[]>([])
  const [showConfirm, setShowConfirm] = useState<{type: string, idx: number} | null>(null)
  const coverCache = useRef<{[id: string]: string}>({})
  const params = useParams()
  const locale = params?.locale as string || 'id'
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      id: {
        // Page Title
        'reading.title': 'Bacaanku',
        
        // Tab Navigation
        'reading.bookmark': 'Bookmark',
        'reading.like': 'Like',
        'reading.history': 'Riwayat',
        
        // Empty States
        'reading.noData': 'Belum ada data.',
        
        // Content Labels
        'reading.page': 'Halaman',
        'reading.paid': 'Berbayar',
        'reading.free': 'Free',
        'reading.lastRead': 'Terakhir dibaca:',
        
        // Actions
        'reading.delete': 'Hapus',
        'reading.confirmDelete': 'Yakin ingin menghapus?',
        'reading.cancel': 'Batal',
        'reading.deleteConfirm': 'Hapus'
      },
      en: {
        // Page Title
        'reading.title': 'My Reads',
        
        // Tab Navigation
        'reading.bookmark': 'Bookmark',
        'reading.like': 'Like',
        'reading.history': 'History',
        
        // Empty States
        'reading.noData': 'No data yet.',
        
        // Content Labels
        'reading.page': 'Page',
        'reading.paid': 'Paid',
        'reading.free': 'Free',
        'reading.lastRead': 'Last read:',
        
        // Actions
        'reading.delete': 'Delete',
        'reading.confirmDelete': 'Are you sure you want to delete?',
        'reading.cancel': 'Cancel',
        'reading.deleteConfirm': 'Delete'
      }
    };
    
    const localeTranslations = translations[locale as keyof typeof translations];
    return localeTranslations?.[key as keyof typeof localeTranslations] || translations.id[key as keyof typeof translations.id] || key;
  };

  // Load user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [user?.uid])

  // Sync localStorage to Firestore on login
  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    const syncCollection = async (key: string, col: string) => {
      const localData = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(localData) || localData.length === 0) return;
      const fsSnap = await getDocs(collection(db, 'users', uid, col));
      const fsData = fsSnap.docs.map(d => d.data() as BookmarkData);
      for (const item of localData) {
        const exists = fsData.some((d: BookmarkData) => d.idKomik === item.idKomik && d.chapterId === item.chapterId);
        if (!exists) {
          // Use idKomik-chapterId as doc id for uniqueness
          const docId = `${item.idKomik}-${item.chapterId}`;
          await setDoc(doc(db, 'users', uid, col, docId), item);
        }
      }
      localStorage.removeItem(key);
    };
    syncCollection('bookmarks', 'bookmarks');
    syncCollection('likes', 'likes');
    syncCollection('history', 'history');
  }, [user]);

  // Load data
  useEffect(() => {
    if (user) {
      // Firestore: bookmarks, likes, history
      const fetchFS = async () => {
        const uid = user.uid
        // Bookmarks
        const bSnap = await getDocs(collection(db, 'users', uid, 'bookmarks'))
        setBookmarks(bSnap.docs.map(d => d.data() as BookmarkData))
        // Likes
        const lSnap = await getDocs(collection(db, 'users', uid, 'likes'))
        setLikes(lSnap.docs.map(d => d.data() as BookmarkData))
        // History
        const hSnap = await getDocs(collection(db, 'users', uid, 'history'))
        setHistory(hSnap.docs.map(d => d.data() as BookmarkData))
      }
      fetchFS()
    } else {
      // localStorage fallback
      setBookmarks(JSON.parse(localStorage.getItem('bookmarks') || '[]'))
      setLikes(JSON.parse(localStorage.getItem('likes') || '[]'))
      setHistory(JSON.parse(localStorage.getItem('history') || '[]'))
    }
  }, [user])

  // Ambil cover dari Firestore jika kosong
  useEffect(() => {
    async function fetchCovers() {
      const missing = history.filter(item => !item.cover && item.idKomik && !coverCache.current[item.idKomik])
      for (const item of missing) {
        const komikDoc = await getDoc(doc(db, 'komik', item.idKomik))
        if (komikDoc.exists()) {
          const data = komikDoc.data()
          coverCache.current[item.idKomik] = data.cover || ''
        } else {
          coverCache.current[item.idKomik] = ''
        }
      }
    }
    if (history.length > 0) fetchCovers()
  }, [history])

  // Delete handlers
  const handleDelete = async (type: string, idx: number) => {
    if (user) {
      const uid = user.uid
      let col = 'bookmarks'
      if (type === 'like') col = 'likes'
      if (type === 'history') col = 'history'
      const item = (type === 'bookmark' ? bookmarks : type === 'like' ? likes : history)[idx]
      const q = collection(db, 'users', uid, col)
      // Find doc by idKomik+chapterId
      const docsSnap = await getDocs(q)
      const docToDelete = docsSnap.docs.find(d => d.data().idKomik === item.idKomik && d.data().chapterId === item.chapterId)
      if (docToDelete) await deleteDoc(docToDelete.ref)
    } else {
      const arr = type === 'bookmark' ? [...bookmarks] : type === 'like' ? [...likes] : [...history]
      arr.splice(idx, 1)
      localStorage.setItem(type === 'bookmark' ? 'bookmarks' : type === 'like' ? 'likes' : 'history', JSON.stringify(arr))
      if (type === 'bookmark') setBookmarks(arr)
      if (type === 'like') setLikes(arr)
      if (type === 'history') setHistory(arr)
    }
    setShowConfirm(null)
  }

  const renderList = (data: BookmarkData[], type: string, icon: ReactNode) => {
    // Sort terbaru di atas untuk riwayat
    const sorted = type === 'history'
      ? [...data].sort((a, b) => (b.lastRead ? new Date(b.lastRead).getTime() : 0) - (a.lastRead ? new Date(a.lastRead).getTime() : 0))
      : data;
    return (
      <div className={type === 'history' ? 'divide-y divide-white/10' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'}>
        {sorted.length === 0 ? (
          <div className="text-gray-400 col-span-full">{t('reading.noData')}</div>
        ) : sorted.map((item, idx) => (
          <div key={item.idKomik + '-' + item.chapterId} className={type === 'history' ? 'flex items-center gap-3 py-3 px-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition' : 'flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition'}>
            {type === 'history' ? (
              (item.cover || coverCache.current[item.idKomik]) ? (
                <Image
                  src={item.cover || coverCache.current[item.idKomik]}
                  alt={item.title}
                  width={40}
                  height={56}
                  className="w-10 h-14 object-cover rounded shadow flex-shrink-0"
                />
              ) : (
                <BookOpen className="w-8 h-8 text-blue-400 flex-shrink-0" />
              )
            ) : icon}
            <div className="flex-1 min-w-0">
              <Link href={`/${locale}/${item.idKomik}/chapter/${item.chapterId}${item.page ? `?page=${item.page}` : ''}`} className="font-semibold text-white text-sm truncate block">
                {item.title}
              </Link>
              <div className="text-xs text-white/60 truncate flex items-center gap-2">
                {item.chapterTitle}{item.page ? ` • ${t('reading.page')} ${item.page}` : ''}
                {type === 'history' && (
                  <span className={`ml-2 px-2 py-0.5 text-[10px] rounded-full font-bold ${item.isPaid ? 'bg-yellow-400 text-yellow-900' : 'bg-green-500 text-white'}`}>{item.isPaid ? t('reading.paid') : t('reading.free')}</span>
                )}
              </div>
              {type === 'history' && item.lastRead && (
                <div className="text-[10px] text-white/40 mt-1">{t('reading.lastRead')} {new Date(item.lastRead).toLocaleString(locale === 'en' ? 'en-US' : 'id-ID')}</div>
              )}
            </div>
            <button
              className="ml-2 p-2 rounded-full hover:bg-white/20 text-red-400"
              onClick={() => setShowConfirm({type, idx})}
              title={t('reading.delete')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('reading.title')}</h1>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('bookmark')} className={`px-4 py-2 rounded-full font-semibold ${tab==='bookmark' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'}`}><Bookmark className="inline w-4 h-4 mr-1" />{t('reading.bookmark')}</button>
        <button onClick={() => setTab('like')} className={`px-4 py-2 rounded-full font-semibold ${tab==='like' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'}`}><ThumbsUp className="inline w-4 h-4 mr-1" />{t('reading.like')}</button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 rounded-full font-semibold ${tab==='history' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'}`}><BookOpen className="inline w-4 h-4 mr-1" />{t('reading.history')}</button>
      </div>
      {tab === 'bookmark' && renderList(bookmarks, 'bookmark', <Flame className="w-6 h-6 text-orange-400 flex-shrink-0" />)}
      {tab === 'like' && renderList(likes, 'like', <ThumbsUp className="w-6 h-6 text-purple-400 flex-shrink-0" />)}
      {tab === 'history' && renderList(history, 'history', <BookOpen className="w-6 h-6 text-blue-400 flex-shrink-0" />)}

      {/* Konfirmasi hapus */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setShowConfirm(null)}><X className="w-5 h-5" /></button>
            <div className="mb-4 text-black font-semibold">{t('reading.confirmDelete')}</div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowConfirm(null)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black font-semibold">{t('reading.cancel')}</button>
              <button onClick={() => handleDelete(showConfirm.type, showConfirm.idx)} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">{t('reading.deleteConfirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 