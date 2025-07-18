'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, forwardRef, useMemo } from 'react'
import { db } from '../../../../lib/firebase'
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, increment } from 'firebase/firestore'
import { useParams, useSearchParams } from 'next/navigation'
import { ThumbsUp, MessageCircle, Share2, Bookmark, BookmarkCheck, CheckCircle, Info } from 'lucide-react'
import { auth } from '../../../../lib/firebase'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { usePreferences } from '../../../../app/context/PreferencesContext'

interface PageData {
  id?: string;
  imageUrl: string;
  isPaid?: boolean;
  order?: number;
  language?: string;
}

interface Chapter {
  id?: string;
  title?: string;
  pages?: PageData[];
  likes?: number;
  isComment?: boolean;
  isWatermark?: boolean;
  isPrice?: boolean;
  pricePerPage?: number;
  bundlePrice?: number;
  synopsis?: string;
  language?: string;
}

interface Comic {
  id: string;
  title: string;
  chapters: Chapter[];
  coverUrl?: string;
}

// Bookmark type
type BookmarkData = {
  idKomik: string;
  chapterId: string;
  title: string;
  chapterTitle: string;
  page: number;
};

// Tambahkan tipe komentar
interface CommentData {
  id: string;
  user: string;
  userName?: string;
  text: string;
  createdAt: string;
}

// Get or generate deviceId
function getDeviceId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('deviceId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('deviceId', id);
  }
  return id;
}

export default function ChapterPage() {
  const params = useParams<{ idKomik: string; chapterId: string }>();
  const searchParams = useSearchParams();
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [user, setUser] = useState<User | null>(null)
  const [showCoinModal, setShowCoinModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [comments, setComments] = useState<CommentData[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [sending, setSending] = useState(false)
  const [readPages, setReadPages] = useState<string[]>([])
  const [showSynopsisModal, setShowSynopsisModal] = useState(false)
  const { preferences } = usePreferences()

  const chapterIdx = Number(params.chapterId);
  const chapter = comic?.chapters[chapterIdx];
  const totalPages = chapter?.pages?.length || 0;

  // Apply reading preferences
  const readingLayout = preferences?.readingPreferences.pageLayout || 'vertical'
  const autoPlay = preferences?.readingPreferences.autoPlay ?? false
  const userLanguages = useMemo(() => preferences?.languages || ['id'], [preferences?.languages]) // Default to Indonesian if no preferences

  useEffect(() => {
    async function fetchComic() {
      try {
        const comicDoc = await getDoc(doc(db, 'komik', params.idKomik));
        if (comicDoc.exists()) {
          const data = comicDoc.data();
          // Filter chapters based on user's language preferences
          const filteredChapters = Array.isArray(data.chapters) 
            ? data.chapters.filter(chapter => 
                !chapter.language || // Include chapters with no language specified
                userLanguages.includes(chapter.language) // Include chapters matching user's preferred languages
              )
            : [];
          
          setComic({
            id: comicDoc.id,
            ...data,
            chapters: filteredChapters,
          } as Comic);
        }
      } catch (error) {
        console.error('Error fetching comic:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.idKomik) fetchComic();
    // Fetch like state and count from subcollection
    async function fetchLikes() {
      const deviceId = getDeviceId();
      const likesCol = collection(db, 'komik', params.idKomik, 'chapters', params.chapterId, 'likes');
      const likesSnap = await getDocs(likesCol);
      setLikeCount(likesSnap.size);
      setLiked(likesSnap.docs.some(doc => doc.id === deviceId));
    }
    if (params.idKomik && params.chapterId) fetchLikes();
  }, [comic, params.idKomik, params.chapterId, userLanguages]);

  // Check if bookmarked
  useEffect(() => {
    if (!comic) return;
    const bookmarks: BookmarkData[] = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(bookmarks.some(b => b.idKomik === params.idKomik && b.chapterId === params.chapterId));
  }, [comic, params.idKomik, params.chapterId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
    })
    return () => unsub()
  }, [user?.uid])

  // Ambil daftar halaman berbayar yang sudah dibaca user
  useEffect(() => {
    async function fetchReadPages() {
      if (!user) return setReadPages([])
      const purchasesCol = collection(db, 'users', user.uid, 'purchases')
      const snap = await getDocs(purchasesCol)
      const ids = snap.docs.map(doc => doc.id)
      setReadPages(ids)
    }
    fetchReadPages()
  }, [user, user?.uid, params.idKomik, params.chapterId])

  const handleBookmark = () => {
    if (!comic) return;
    const bookmarks: BookmarkData[] = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const exists = bookmarks.some(b => b.idKomik === params.idKomik && b.chapterId === params.chapterId);
    if (exists) {
      // Remove bookmark
      const updated = bookmarks.filter(b => !(b.idKomik === params.idKomik && b.chapterId === params.chapterId));
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      setBookmarked(false);
    } else {
      // Add bookmark
      const newBookmark: BookmarkData = {
        idKomik: params.idKomik,
        chapterId: params.chapterId,
        title: comic.title,
        chapterTitle: comic.chapters[Number(params.chapterId)]?.title || `Chapter ${Number(params.chapterId) + 1}`,
        page: currentPage,
      };
      localStorage.setItem('bookmarks', JSON.stringify([newBookmark, ...bookmarks]));
      setBookmarked(true);
    }
  };

  const handleLike = async () => {
    const deviceId = getDeviceId();
    const likeDocRef = doc(db, 'komik', params.idKomik, 'chapters', params.chapterId, 'likes', deviceId);
    let likeUserDocRef;
    if (user) {
      likeUserDocRef = doc(db, 'users', user.uid, 'likes', `${params.idKomik}-${params.chapterId}`);
    }
    const chapterRef = doc(db, 'komik', params.idKomik, 'chapters', params.chapterId);
    if (liked) {
      // Unlike
      await deleteDoc(likeDocRef);
      if (user) await deleteDoc(likeUserDocRef!);
      setLiked(false);
      setLikeCount(likeCount - 1);
      // Decrement likeCount
      await setDoc(chapterRef, { likeCount: increment(-1) }, { merge: true });
    } else {
      // Like
      await setDoc(likeDocRef, { liked: true });
      if (user && comic) {
        await setDoc(likeUserDocRef!, {
          idKomik: params.idKomik,
          chapterId: params.chapterId,
          title: comic.title,
          chapterTitle: comic.chapters[Number(params.chapterId)]?.title || `Chapter ${Number(params.chapterId) + 1}`,
          cover: comic.coverUrl || '',
          page: currentPage,
        });
      }
      setLiked(true);
      setLikeCount(likeCount + 1);
      // Increment likeCount
      await setDoc(chapterRef, { likeCount: increment(1) }, { merge: true });
    }
  };

  // Scroll handler for updating current page
  useEffect(() => {
    if (!comic) return;
    const container = document.getElementById('chapter-pages-scroll');
    if (!container) return;
    const onScroll = () => {
      let found = 1;
      pagesRef.current.forEach((el, idx) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2) {
            found = idx + 1;
          }
        }
      });
      setCurrentPage(found);
    };
    container.addEventListener('scroll', onScroll);
    // Auto-scroll to bookmarked page if ?page= is present
    const pageParam = Number(searchParams.get('page'));
    if (pageParam && pagesRef.current[pageParam - 1]) {
      setTimeout(() => {
        pagesRef.current[pageParam - 1]?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, 200);
    }
    return () => container.removeEventListener('scroll', onScroll);
  }, [comic, searchParams]);

  // Auto play effect
  useEffect(() => {
    if (!autoPlay || !comic) return
    const timer = setInterval(() => {
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1)
        pagesRef.current[currentPage]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        clearInterval(timer)
      }
    }, 5000) // 5 seconds per page

    return () => clearInterval(timer)
  }, [autoPlay, currentPage, totalPages, comic])

  // Cek dan handle akses halaman berbayar
  const handlePaidPage = async (page: PageData) => {
    if (!user || !page.id) {
      setShowCoinModal(true)
      return false
    }
    const purchaseId = `${params.idKomik}_${params.chapterId}_${page.id}`
    const purchaseRef = doc(db, 'users', user.uid, 'purchases', purchaseId)
    const purchaseSnap = await getDoc(purchaseRef)
    if (purchaseSnap.exists()) {
      return true
    }
    // Cek coins
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)
    const userData = userDoc.data() || {}
    let coins = 0
    
    // Handle both old and new coin structures
    if (typeof userData.coins === 'number') {
      coins = userData.coins
    } else if (userData.coins && typeof userData.coins.reader === 'number') {
      coins = userData.coins.reader
    }
    
    if (coins < 1) {
      setShowCoinModal(true)
      return false
    }
    // Kurangi coin dan simpan pembelian
    const userCoins = userDoc.exists() ? (userData.coins || {}) : {}
    const newCoins = typeof userCoins === 'number' 
      ? coins - 1 
      : { ...userCoins, reader: coins - 1 }
    await setDoc(userRef, { coins: newCoins }, { merge: true })
    await setDoc(purchaseRef, { pageId: page.id, time: new Date().toISOString() })
    
    // Tambahkan ke tracking pembelian komik
    const comicRef = doc(db, 'komik', params.idKomik)
    const comicPurchaseRef = doc(db, 'komik', params.idKomik, 'purchases', purchaseId)
    await setDoc(comicPurchaseRef, {
      userId: user.uid,
      userName: user.displayName || user.email || 'User',
      pageId: page.id,
      chapterId: params.chapterId,
      time: new Date().toISOString(),
      price: 1
    })
    
    // Update total pembelian di komik
    await setDoc(comicRef, { 
      totalPurchases: increment(1),
      totalRevenue: increment(1)
    }, { merge: true })

    // Update chapter stats
    const chapterRef = doc(db, 'komik', params.idKomik, 'chapters', params.chapterId)
    await setDoc(chapterRef, {
      totalPurchases: increment(1),
      totalRevenue: increment(1),
      lastPurchaseTime: new Date().toISOString(),
      purchaseCount: increment(1)
    }, { merge: true })

    // Catat ke riwayat bacaanku
    const historyId = `${params.idKomik}_${params.chapterId}`
    const historyRef = doc(db, 'users', user.uid, 'history', historyId)
    await setDoc(historyRef, {
      idKomik: params.idKomik,
      chapterId: params.chapterId,
      title: comic?.title || '',
      chapterTitle: comic?.chapters[Number(params.chapterId)]?.title || `Chapter ${Number(params.chapterId) + 1}`,
      lastRead: new Date().toISOString(),
      cover: comic?.coverUrl || '',
      isPaid: !!comic?.chapters[Number(params.chapterId)]?.pages?.some(p => p.isPaid),
      page: currentPage,
    }, { merge: true })
    return true
  }

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      const col = collection(db, 'komik', params.idKomik, 'chapters', params.chapterId, 'comments')
      const snap = await getDocs(col)
      const list: CommentData[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommentData))
      // Urutkan terbaru di atas
      setComments(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    }
    if (showCommentModal) fetchComments()
  }, [showCommentModal, params.idKomik, params.chapterId])

  // Handle kirim komentar
  async function handleSendComment() {
    if (!user || !commentInput.trim()) return
    setSending(true)
    const newComment = {
      user: user.uid,
      userName: user.displayName || user.email || 'User',
      text: commentInput.trim(),
      createdAt: new Date().toISOString(),
    }
    const colRef = collection(db, 'komik', params.idKomik, 'chapters', params.chapterId, 'comments')
    await setDoc(doc(colRef), newComment)
    setCommentInput('')
    setSending(false)
    // Refresh comments
    const snap = await getDocs(colRef)
    const list: CommentData[] = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommentData))
    setComments(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    // Update chapter stats
    const chapterRef = doc(db, 'komik', params.idKomik, 'chapters', params.chapterId)
    await setDoc(chapterRef, { 
      commentCount: increment(1),
      lastCommentTime: new Date().toISOString(),
      totalComments: increment(1)
    }, { merge: true })
  }

  // Catat view setiap kali halaman dibuka
  useEffect(() => {
    const chapterRef = doc(db, 'komik', params.idKomik, 'chapters', params.chapterId)
    const viewId = `${user?.uid || getDeviceId()}_${Date.now()}`
    const viewRef = doc(db, 'komik', params.idKomik, 'chapters', params.chapterId, 'views', viewId)
    setDoc(viewRef, {
      userId: user?.uid || null,
      deviceId: getDeviceId(),
      time: new Date().toISOString(),
    })
    // Update chapter stats
    setDoc(chapterRef, { 
      viewCount: increment(1),
      lastViewTime: new Date().toISOString(),
      totalViews: increment(1)
    }, { merge: true })
  }, [params.idKomik, params.chapterId, user?.uid])

  const isCommentActive = !!chapter?.isComment;

  return (
    <div className="min-h-screen bg-black">
      {/* Main content with padding for fixed header */}
      <div className="pt-0 pb-20">
        <div 
          id="chapter-pages-scroll" 
          className={`w-full h-[calc(100vh-8rem)] overflow-y-auto ${
            readingLayout === 'vertical' 
              ? 'snap-y snap-mandatory' 
              : readingLayout === 'horizontal'
                ? 'flex overflow-x-auto snap-x snap-mandatory'
                : 'snap-y snap-mandatory'
          }`}
        >
          {loading ? (
            <div className="text-center text-white/60 py-8">Loading...</div>
          ) : chapter && chapter.pages ? (
            chapter.pages.map((page, index) => {
              const purchaseId = `${params.idKomik}_${params.chapterId}_${page.id}`
              const isRead = readPages.includes(purchaseId)
              return (
                <PaidPageWrapper
                  key={page.id || page.imageUrl || index}
                  page={page}
                  index={index}
                  handlePaidPage={handlePaidPage}
                  ref={el => { pagesRef.current[index] = el }}
                  isRead={isRead}
                  chapter={chapter}
                  layout={readingLayout}
                />
              )
            })
          ) : (
            <div className="h-full flex items-center justify-center text-white/60">
              Chapter tidak ditemukan
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20">
        <div className="w-full px-4 pb-4 pt-2 bg-black/90 backdrop-blur-md shadow-2xl">
          {/* Episode Title with Info Icon */}
          <button
            onClick={() => setShowSynopsisModal(true)}
            className="w-full flex items-center justify-center gap-1 text-xs text-white/60 text-center mb-0 mt-[-6px] py-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Chapter Synopsis"
            style={{ fontWeight: 600 }}
          >
            {chapter?.title || `Chapter ${chapterIdx + 1}`}
            <Info className="w-4 h-4 ml-1" />
          </button>
          <div className="flex gap-2 w-full items-center mt-2">
            <Link
              href={`/${params.idKomik}`}
              className="flex-1 py-3 text-center rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition"
            >
              ← Back
            </Link>
            <button
              className={`flex items-center justify-center px-4 py-3 rounded-xl transition ${liked ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              title={liked ? 'Unlike' : 'Like'}
              aria-label="Like"
              type="button"
              onClick={handleLike}
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="ml-1 text-xs">{likeCount > 0 ? likeCount : ''}</span>
            </button>
            {isCommentActive && (
              <button
                className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                title="Comment"
                aria-label="Comment"
                type="button"
                onClick={() => setShowCommentModal(true)}
              >
                <MessageCircle className="w-5 h-5" />
                {comments.length > 0 && (
                  <span className="ml-1 text-xs bg-purple-600 text-white rounded-full px-2 py-0.5">{comments.length}</span>
                )}
              </button>
            )}
            <button
              className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              title="Share"
              aria-label="Share"
              type="button"
              onClick={async () => {
                const url = `https://mu-komik.com/${params.idKomik}/chapter/${params.chapterId}`;
                const title = chapter?.title || comic?.title || 'Baca Komik';
                const comicTitle = comic?.title || 'Komik';
                if (navigator.share) {
                  try {
                    if (comic?.coverUrl) {
                      const response = await fetch(comic.coverUrl);
                      const blob = await response.blob();
                      const file = new File([blob], 'cover.jpg', { type: blob.type });
                      await navigator.share({
                        title: title,
                        text: `Baca komik: ${comicTitle}, episode: ${title} di MU Komik!`,
                        url: url,
                        files: [file]
                      });
                    } else {
                      await navigator.share({
                        title: title,
                        text: `Baca komik: ${comicTitle}, episode: ${title} di MU Komik!`,
                        url: url
                      });
                    }
                  } catch {
                    // Fallback if sharing fails
                    navigator.clipboard.writeText(url);
                    alert('Link sudah disalin ke clipboard!');
                  }
                } else {
                  navigator.clipboard.writeText(url);
                  alert('Link sudah disalin ke clipboard!');
                }
              }}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              className={`flex items-center justify-center px-4 py-3 rounded-xl ${bookmarked ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'} transition`}
              title={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
              aria-label="Bookmark"
              type="button"
              onClick={handleBookmark}
            >
              {bookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            </button>
            {/* Page Info */}
            <span className="ml-2 text-xs text-white/60 min-w-[48px] text-right">
              {currentPage} / {totalPages}
            </span>
          </div>
        </div>
      </nav>

      {/* Modal jika coin kurang */}
      {showCoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setShowCoinModal(false)}><span className="text-xl">×</span></button>
            <div className="mb-4 text-black font-semibold">Coin tidak cukup</div>
            <div className="mb-4 text-gray-700">Silakan topup coin untuk membuka halaman ini.</div>
            <Link href="/profil" className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold">Topup Coin</Link>
          </div>
        </div>
      )}

      {/* Modal Komentar */}
      {isCommentActive && showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-4 shadow-xl max-w-md w-full text-black relative flex flex-col max-h-[90vh]">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setShowCommentModal(false)}><span className="text-xl">×</span></button>
            <div className="font-bold text-lg mb-2 text-center">Komentar</div>
            <div className="flex-1 overflow-y-auto mb-2 space-y-3 pr-2">
              {comments.length === 0 ? (
                <div className="text-gray-400 text-center py-8">Belum ada komentar.</div>
              ) : comments.map(c => (
                <div key={c.id} className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="text-xs font-semibold text-purple-700 mb-1">{c.userName || c.user}</div>
                  <div className="text-sm text-gray-900">{c.text}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>
            {user ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Tulis komentar..."
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  disabled={sending}
                  maxLength={300}
                />
                <button
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold disabled:opacity-50"
                  onClick={handleSendComment}
                  disabled={sending || !commentInput.trim()}
                >Kirim</button>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm mt-2">
                <Link href="/login" className="text-purple-600 underline hover:text-purple-800">Login</Link> untuk menulis komentar.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Synopsis Modal */}
      {showSynopsisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-[90%] text-center relative max-h-[50vh] flex flex-col mx-4">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-black" 
              onClick={() => setShowSynopsisModal(false)}
            >
              <span className="text-xl">×</span>
            </button>
            <div className="mb-4 text-black font-semibold text-lg">
              {chapter?.title || `Chapter ${chapterIdx + 1}`}
            </div>
            <div className="text-gray-700 text-left whitespace-pre-line overflow-y-auto flex-1 pr-2">
              {chapter?.synopsis || 'Tidak ada sinopsis untuk chapter ini.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

// Tambahkan komponen wrapper untuk handle halaman berbayar
const PaidPageWrapper = forwardRef<HTMLDivElement, { 
  page: PageData, 
  index: number, 
  handlePaidPage: (page: PageData) => Promise<boolean>, 
  isRead?: boolean,
  chapter?: Chapter,
  layout?: 'vertical' | 'horizontal' | 'webtoon'
}>(
  function PaidPageWrapper({ page, index, handlePaidPage, isRead, chapter, layout = 'vertical' }, ref) {
    const [canShow, setCanShow] = useState(!page.isPaid)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (page.isPaid && !canShow && !loading) {
        setLoading(true)
        handlePaidPage(page).then(ok => {
          setCanShow(ok)
          setLoading(false)
        })
      } else if (!page.isPaid && !canShow) {
        setCanShow(true)
      }
    }, [page, page.id, handlePaidPage, page.isPaid, canShow, loading])

    if (loading) return <div className="w-full flex justify-center items-center min-h-[200px] bg-black"><Spinner /></div>
    if (!canShow) return (
      <div className="w-full flex justify-center items-center min-h-[200px] bg-black relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-30">
          <div className="text-white text-lg font-bold mb-2">Halaman Berbayar</div>
          {chapter?.pricePerPage && (
            <div className="text-yellow-300 text-base mb-2">Harga: {chapter.pricePerPage} coin</div>
          )}
          {chapter?.bundlePrice && (
            <div className="text-white text-sm mb-4">
              Beli bundle 10 halaman: <span className="text-yellow-300 font-bold">{chapter.bundlePrice} coin</span>
            </div>
          )}
          <button
            className="px-4 py-2 rounded bg-yellow-400 text-yellow-900 font-bold"
            onClick={() => handlePaidPage(page)}
          >
            Beli Halaman
          </button>
        </div>
      </div>
    )

    return (
      <div
        ref={ref}
        className={`$${
          layout === 'horizontal'
            ? 'w-screen h-screen flex-shrink-0 snap-center'
            : `w-full ${
                index === 0
                  ? 'snap-start'
                  : (chapter?.pages && index === (chapter.pages.length - 1))
                    ? 'snap-end'
                    : 'snap-center'
              }`
        } flex justify-center bg-black relative`}
        style={layout === 'horizontal' ? { height: 'calc(100vh - 72px)', width: '100vw' } : {}}
      >
        <Image
          src={page.imageUrl}
          alt={`Page ${index + 1}`}
          width={1200}
          height={1800}
          className={`$${
            layout === 'horizontal' 
              ? 'w-full h-full object-contain' 
              : 'w-full h-auto max-w-full object-contain'
          } bg-black`}
          style={layout === 'horizontal' ? { height: 'calc(100vh - 72px)', width: '100vw', maxHeight: 'calc(100vh - 72px)', maxWidth: '100vw' } : {}}
        />
        {isRead && (
          <span className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1 shadow-lg z-10">
            <CheckCircle className="w-5 h-5" />
          </span>
        )}
      </div>
    )
  }
)

// Spinner component
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400 mb-2"></div>
      <div className="h-3 w-24 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300 rounded-full animate-pulse mb-2"></div>
      <div className="text-yellow-300 text-sm font-semibold">Memeriksa akses...</div>
    </div>
  )
}