'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, signOut } from 'firebase/auth'
import { doc, getDoc, collection, getDocs, setDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { useRouter, useParams } from 'next/navigation'
import { EmailAuthProvider } from 'firebase/auth'
import { X, Settings, ChevronRight } from 'lucide-react'
import { storage } from '../../../lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import type { User } from 'firebase/auth'
import Image from 'next/image'
import { auth } from '../../../lib/firebase'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

interface UserData {
  displayName?: string;
  role?: string;
  photoURL?: string;
  coins?: {
    reader?: number;
  };
}

interface HistoryItem {
  idKomik: string;
  chapterId: string;
}

// Declare DuitkuPop on window for TypeScript
declare global {
  interface Window {
    DuitkuPop?: {
      process: (reference: string, options: unknown) => void;
    };
    snap?: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void;
        onPending: (result: unknown) => void;
        onError: (result: unknown) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [komikCount, setKomikCount] = useState(0)
  const [chapterCount, setChapterCount] = useState(0)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [coin, setCoin] = useState(0)
  const [showTopup, setShowTopup] = useState(false)
  const [topupAmount, setTopupAmount] = useState<number | null>(null)
  const [voucherCode, setVoucherCode] = useState('')
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string || 'id'
  
  // Translation function
  const t = (key: string) => {
    const translations = {
      id: {
        // Page Title
        'profile.title': 'Profil',
        
        // User Info
        'profile.user': 'Pengguna',
        'profile.loading': 'Loading...',
        
        // Coin Section
        'profile.coin': 'Coin',
        'profile.topup': 'Topup',
        'profile.history': 'History',
        
        // Voucher Section
        'profile.voucherCode': 'Kode Voucher',
        'profile.voucherPlaceholder': 'Masukkan kode voucher',
        'profile.redeemVoucher': 'Tukar Voucher',
        
        // Buttons
        'profile.editProfile': 'Edit Profil',
        'profile.changePassword': 'Ganti Password',
        'profile.logout': 'Logout',
        'profile.customerSupport': 'Customer Support',
        'profile.readingPreferences': 'Preferensi Membaca',
        
        // Statistics
        'profile.statistics': 'Statistik',
        'profile.comicsRead': 'Komik Dibaca',
        'profile.chaptersRead': 'Chapter Dibaca',
        
        // Edit Profile Modal
        'profile.editProfileTitle': 'Edit Profil',
        'profile.newName': 'Nama Baru',
        'profile.save': 'Simpan',
        'profile.photoFormat': 'JPG/PNG, max 1MB',
        
        // Change Password Modal
        'profile.changePasswordTitle': 'Ganti Password',
        'profile.currentPassword': 'Password Saat Ini',
        'profile.newPassword': 'Password Baru',
        
        // Topup Modal
        'profile.topupTitle': 'Topup Coin',
        'profile.coinRate': '1 Coin = Rp 100',
        'profile.topUpBalance': 'Top Up Saldo',
        
        // Success Messages
        'profile.profileUpdated': 'Profil berhasil diperbarui',
        'profile.passwordChanged': 'Password berhasil diubah',
        
        // Error Messages
        'profile.photoSizeError': 'Ukuran foto maksimal 1MB',
        'profile.voucherLengthError': 'Kode voucher harus 6 karakter',
        'profile.loginRequired': 'Anda harus login',
        'profile.voucherSuccess': 'Voucher berhasil digunakan!',
        'profile.voucherError': 'Voucher gagal digunakan',
        'profile.generalError': 'Terjadi kesalahan, coba lagi'
      },
      en: {
        // Page Title
        'profile.title': 'Profile',
        
        // User Info
        'profile.user': 'User',
        'profile.loading': 'Loading...',
        
        // Coin Section
        'profile.coin': 'Coin',
        'profile.topup': 'Top Up',
        'profile.history': 'History',
        
        // Voucher Section
        'profile.voucherCode': 'Voucher Code',
        'profile.voucherPlaceholder': 'Enter voucher code',
        'profile.redeemVoucher': 'Redeem Voucher',
        
        // Buttons
        'profile.editProfile': 'Edit Profile',
        'profile.changePassword': 'Change Password',
        'profile.logout': 'Logout',
        'profile.customerSupport': 'Customer Support',
        'profile.readingPreferences': 'Reading Preferences',
        
        // Statistics
        'profile.statistics': 'Statistics',
        'profile.comicsRead': 'Comics Read',
        'profile.chaptersRead': 'Chapters Read',
        
        // Edit Profile Modal
        'profile.editProfileTitle': 'Edit Profile',
        'profile.newName': 'New Name',
        'profile.save': 'Save',
        'profile.photoFormat': 'JPG/PNG, max 1MB',
        
        // Change Password Modal
        'profile.changePasswordTitle': 'Change Password',
        'profile.currentPassword': 'Current Password',
        'profile.newPassword': 'New Password',
        
        // Topup Modal
        'profile.topupTitle': 'Top Up Coin',
        'profile.coinRate': '1 Coin = Rp 100',
        'profile.topUpBalance': 'Top Up Balance',
        
        // Success Messages
        'profile.profileUpdated': 'Profile updated successfully',
        'profile.passwordChanged': 'Password changed successfully',
        
        // Error Messages
        'profile.photoSizeError': 'Photo size maximum 1MB',
        'profile.voucherLengthError': 'Voucher code must be 6 characters',
        'profile.loginRequired': 'You must be logged in',
        'profile.voucherSuccess': 'Voucher redeemed successfully!',
        'profile.voucherError': 'Failed to redeem voucher',
        'profile.generalError': 'An error occurred, please try again'
      }
    };
    
    return (translations[locale as keyof typeof translations] as any)?.[key] || (translations.id as any)[key] || key;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push('/login')
        return
      }
      setUser(u)
      // Get history from Firestore
      const historySnap = await getDocs(collection(db, 'users', u.uid, 'history'))
      const history = historySnap.docs.map(d => d.data() as HistoryItem)
      setChapterCount(history.length)
      setKomikCount(new Set(history.map((h: HistoryItem) => h.idKomik)).size)
      setLoading(false)
    })
    return () => unsub()
  }, [router])

  // Fallback to localStorage if not logged in
  useEffect(() => {
    if (user) return
    if (typeof window !== 'undefined') {
      const history: HistoryItem[] = JSON.parse(localStorage.getItem('history') || '[]')
      setChapterCount(history.length)
      setKomikCount(new Set(history.map((h: HistoryItem) => h.idKomik)).size)
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
        setNewDisplayName(userDoc.data().displayName || '')
        setCoin(typeof userDoc.data().coins?.reader === 'number' ? userDoc.data().coins.reader : 0)
      } else {
        setCoin(0)
      }
    }
    loadUserData()
  }, [user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleEditProfile = async () => {
    if (!user) return
    try {
      let photoURL = user.photoURL
      if (newPhoto) {
        if (newPhoto.size > 1024 * 1024) throw new Error(t('profile.photoSizeError'))
        const ext = newPhoto.name.split('.').pop()
        const storageRef = ref(storage, `users/${user.uid}/profile.${ext}`)
        await uploadBytes(storageRef, newPhoto)
        photoURL = await getDownloadURL(storageRef)
      }
      await updateProfile(user, { displayName: newDisplayName, photoURL })
      await setDoc(doc(db, 'users', user.uid), { displayName: newDisplayName, photoURL }, { merge: true })
      setSuccess(t('profile.profileUpdated'))
      setShowEditProfile(false)
      setNewPhoto(null)
      setPhotoPreview(null)
    } catch {
      // error handling
    }
  }

  const handleChangePassword = async () => {
    if (!user || !user.email) return
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      setSuccess(t('profile.passwordChanged'))
      setShowChangePassword(false)
    } catch {
      // error handling
    }
  }

  const handleMidtransPayment = async () => {
    if (!user || !topupAmount) {
      console.error('Missing required data:', { user, topupAmount });
      return;
    }
    try {
      const response = await axios.post('/api/midtrans/snap', {
        amount: topupAmount,
        userId: user.uid,
        email: user.email || 'user@email.com',
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.token) {
        if (window.snap && typeof window.snap.pay === 'function') {
          window.snap.pay(response.data.token, {
            onSuccess: (result: unknown) => console.log('Success', result),
            onPending: (result: unknown) => console.log('Pending', result),
            onError: (result: unknown) => console.error('Error', result),
            onClose: () => console.log('Popup closed'),
          });
        } else {
          console.error('Midtrans Snap JS not loaded');
        }
      } else {
        console.error('No snap token returned:', response.data);
      }
    } catch {
      // error handling
    }
  };

  const handleRedeemVoucher = async () => {
    if (!voucherCode || voucherCode.length !== 6) {
      toast.error(t('profile.voucherLengthError'))
      return
    }
    if (!user) {
      toast.error(t('profile.loginRequired'))
      return
    }
    try {
      const idToken = await user.getIdToken()
      const res = await fetch('/api/voucher/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ code: voucherCode })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message || t('profile.voucherSuccess'))
        setCoin(c => c + data.coinAmount)
        setVoucherCode('')
      } else {
        toast.error(data.message || t('profile.voucherError'))
      }
    } catch {
      toast.error(t('profile.generalError'))
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">{t('profile.loading')}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('profile.title')}</h1>
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col items-center mb-6">
            <Image
              src={user?.photoURL || '/default-avatar.png'}
              alt="Avatar"
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover bg-gray-700 mb-2"
              priority
            />
            <div className="text-xl font-bold text-center text-white">{userData?.displayName || user?.displayName || user?.email || t('profile.user')}</div>
            <div className="text-sm text-gray-400 text-center mb-2">{user?.email}</div>
          </div>
          {/* Tombol Coin, Topup, History */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-yellow-200 rounded-xl p-4 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-yellow-900">{t('profile.coin')}</span>
              <span className="text-3xl font-bold text-yellow-800">{userData?.coins?.reader || coin}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button className="w-full py-3 rounded-lg font-bold text-white bg-yellow-500 hover:bg-yellow-600 transition mb-2" onClick={() => setShowTopup(true)}>{t('profile.topup')}</button>
              <Link href={`/${locale}/history-topup`} className="w-full py-3 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 transition text-center">{t('profile.history')}</Link>
            </div>
          </div>
          {/* Kode Voucher */}
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2">{t('profile.voucherCode')}</label>
            <input value={voucherCode} onChange={e => setVoucherCode(e.target.value)} maxLength={6} className="w-full p-3 rounded-lg border border-gray-300 mb-2" placeholder={t('profile.voucherPlaceholder')} />
            <button className="w-full py-3 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition" onClick={handleRedeemVoucher}>{t('profile.redeemVoucher')}</button>
          </div>
          {/* Edit Profil & Ganti Password */}
          <div className="flex gap-4 mb-4">
            <button className="flex-1 py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition" onClick={() => setShowEditProfile(true)}>{t('profile.editProfile')}</button>
            <button className="flex-1 py-3 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition" onClick={() => setShowChangePassword(true)}>{t('profile.changePassword')}</button>
          </div>
          {/* Logout */}
          <button className="w-full py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition mb-4" onClick={() => signOut(auth)}>{t('profile.logout')}</button>
          {/* Customer Support */}
          <Link href={`/${locale}/customer-support`} className="block w-full py-3 rounded-lg font-bold text-white bg-blue-800 hover:bg-blue-900 transition mb-4 text-center">{t('profile.customerSupport')}</Link>
          {/* Preferensi Membaca */}
          <Link
            href={`/${locale}/preferences`}
            className="block w-full py-3 rounded-lg font-bold text-white bg-purple-700 hover:bg-purple-800 transition mb-8 text-center"
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <Settings className="w-5 h-5" />
              {t('profile.readingPreferences')}
              <ChevronRight className="w-5 h-5 ml-1" />
            </span>
          </Link>
          {/* Statistik */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white mb-2">{t('profile.statistics')}</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center">
                  <p className="text-sm text-white/80 mb-1">{t('profile.comicsRead')}</p>
                  <p className="text-2xl font-bold text-yellow-400">{komikCount}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 flex flex-col items-center">
                  <p className="text-sm text-white/80 mb-1">{t('profile.chaptersRead')}</p>
                  <p className="text-2xl font-bold text-yellow-400">{chapterCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setShowEditProfile(false)}><X className="w-5 h-5" /></button>
            <div className="mb-4 text-black font-semibold">{t('profile.editProfileTitle')}</div>
            <div className="flex flex-col items-center mb-4">
              <Image
                src={photoPreview || user?.photoURL || '/default-avatar.png'}
                alt="Preview"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover bg-gray-200 mb-2"
                priority
              />
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handlePhotoChange}
                className="mb-2"
              />
              <span className="text-xs text-gray-500">{t('profile.photoFormat')}</span>
            </div>
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder={t('profile.newName')}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={handleEditProfile} className="px-4 py-2 rounded bg-purple-600 text-white font-semibold">{t('profile.save')}</button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setShowChangePassword(false)}><X className="w-5 h-5" /></button>
            <div className="mb-4 text-black font-semibold">{t('profile.changePasswordTitle')}</div>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('profile.currentPassword')}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('profile.newPassword')}
              className="w-full p-2 border rounded mb-4"
            />
            <button onClick={handleChangePassword} className="px-4 py-2 rounded bg-orange-500 text-white font-semibold">{t('profile.save')}</button>
          </div>
        </div>
      )}

      {/* Modal Topup Coin */}
      {showTopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => { setShowTopup(false); setTopupAmount(null); }}><X className="w-5 h-5" /></button>
            <div className="mb-4 text-black font-semibold text-lg">{t('profile.topupTitle')}</div>
            <div className="space-y-3 mb-4">
              <button onClick={() => setTopupAmount(10000)} className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-lg flex flex-col items-center">
                100 Coin <span className="text-xs font-normal text-yellow-800">Rp 10.000</span>
              </button>
              <button onClick={() => setTopupAmount(50000)} className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-lg flex flex-col items-center">
                500 Coin <span className="text-xs font-normal text-yellow-800">Rp 50.000</span>
              </button>
              <button onClick={() => setTopupAmount(100000)} className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-lg flex flex-col items-center">
                1000 Coin <span className="text-xs font-normal text-yellow-800">Rp 100.000</span>
              </button>
              <button onClick={() => setTopupAmount(250000)} className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-lg flex flex-col items-center">
                2500 Coin <span className="text-xs font-normal text-yellow-800">Rp 250.000</span>
              </button>
            </div>
            <div className="text-xs text-gray-500 mb-4">{t('profile.coinRate')}</div>
            
            {/* Payment Methods */}
            {topupAmount && (
              <div className="space-y-3">
                <button
                  onClick={handleMidtransPayment}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors"
                >
                  {t('profile.topUpBalance')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 