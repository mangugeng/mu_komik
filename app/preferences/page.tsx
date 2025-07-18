'use client'

import { useState, useEffect } from 'react'
import { auth, db } from '../../lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface UserPreferences {
  readingPreferences: {
    pageLayout: 'vertical' | 'horizontal' | 'webtoon'
    autoPlay: boolean
    showWatermark: boolean
    darkMode: boolean
  }
  languages: string[]
  genres: string[]
  interests: string[]
  hobbies: string[]
  readingHistory: {
    lastRead: string
    totalRead: number
    favoriteGenres: string[]
  }
}

const GENRES = [
  'Aksi', 'Petualangan', 'Komedi', 'Drama', 'Fantasi', 'Horor',
  'Misteri', 'Romantis', 'Fiksi Ilmiah', 'Kehidupan Sehari-hari', 'Olahraga',
  'Supernatural', 'Thriller', 'Psikologis', 'Mecha', 'Sejarah'
]

const INTERESTS = [
  'Aksi & Petualangan', 'Romantis & Drama', 'Komedi & Kehidupan Sehari-hari',
  'Fantasi & Sihir', 'Fiksi Ilmiah & Teknologi', 'Horor & Thriller',
  'Olahraga & Kompetisi', 'Kehidupan Sekolah', 'Supernatural',
  'Sejarah', 'Misteri', 'Psikologis'
]

const HOBBIES = [
  'Membaca', 'Gaming', 'Olahraga', 'Seni & Menggambar', 'Musik',
  'Teknologi', 'Memasak', 'Travel', 'Fotografi', 'Menulis',
  'Anime & Manga', 'Film & Acara TV'
]

const languages = [
  // Bahasa Asing
  { id: 'id', name: 'Indonesia' },
  { id: 'en', name: 'English' },
  { id: 'ja', name: 'Jepang' },
  { id: 'ko', name: 'Korea' },
  { id: 'zh', name: 'Mandarin' },
  { id: 'th', name: 'Thailand' },
  { id: 'vi', name: 'Vietnam' },
  { id: 'es', name: 'Spanyol' },
  { id: 'pt', name: 'Portugis' },
  { id: 'fr', name: 'Prancis' },
  { id: 'de', name: 'Jerman' },
  { id: 'ru', name: 'Rusia' },
  // Bahasa Daerah
  { id: 'jv', name: 'Jawa' },
  { id: 'su', name: 'Sunda' },
  { id: 'min', name: 'Minang' },
  { id: 'ban', name: 'Bali' },
  { id: 'bug', name: 'Bugis' },
  { id: 'mad', name: 'Madura' },
  { id: 'ace', name: 'Aceh' },
  { id: 'btk', name: 'Batak' }
]

const layouts = [
  { id: 'vertical', name: 'Vertikal' },
  { id: 'horizontal', name: 'Horisontal' }
]

export default function PreferencesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences>({
    readingPreferences: {
      pageLayout: 'vertical',
      autoPlay: false,
      showWatermark: true,
      darkMode: false
    },
    languages: [],
    genres: [],
    interests: [],
    hobbies: [],
    readingHistory: {
      lastRead: '',
      totalRead: 0,
      favoriteGenres: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const prefsDoc = await getDoc(doc(db, 'users', u.uid, 'preferences', 'reading'))
        if (prefsDoc.exists()) {
          setPreferences(prefsDoc.data() as UserPreferences)
        }
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const savePreferences = async () => {
    if (!user) return
    try {
      await setDoc(doc(db, 'users', user.uid, 'preferences', 'reading'), preferences)
      toast.success('Preferensi berhasil disimpan!', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#4F46E5',
          color: '#fff',
          borderRadius: '8px',
        },
      })
    } catch {
      toast.error('Gagal menyimpan preferensi', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          borderRadius: '8px',
        },
      })
    }
  }

  const toggleGenre = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const toggleInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const toggleHobby = (hobby: string) => {
    setPreferences(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby]
    }))
  }

  const toggleLanguage = (language: string) => {
    setPreferences(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }))
  }

  const updatePreferences = (updatedPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updatedPreferences
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Login Diperlukan</h1>
          <p className="text-gray-400">Silakan login untuk mengakses preferensi Anda</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Preferensi Membaca</h1>

        {/* Reading Preferences */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pengaturan Membaca</h2>
          <div className="space-y-4">
            <h3 className="text-base font-semibold mb-3">Layout Membaca:</h3>
            <div className="grid grid-cols-2 gap-4">
              {layouts.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => updatePreferences({
                    readingPreferences: {
                      ...preferences.readingPreferences,
                      pageLayout: layout.id as 'vertical' | 'horizontal'
                    }
                  })}
                  className={`p-4 rounded-xl text-center transition ${
                    preferences.readingPreferences.pageLayout === layout.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {layout.name}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h3 className="font-medium">Putar Otomatis</h3>
                <p className="text-sm text-gray-400">Otomatis lanjut ke halaman berikutnya setiap 5 detik</p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({
                  ...prev,
                  readingPreferences: {
                    ...prev.readingPreferences,
                    autoPlay: !prev.readingPreferences.autoPlay
                  }
                }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.readingPreferences.autoPlay ? 'bg-purple-600' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  preferences.readingPreferences.autoPlay ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h3 className="font-medium">Tampilkan Watermark</h3>
                <p className="text-sm text-gray-400">Tampilkan watermark pada halaman komik</p>
              </div>
              <button
                onClick={() => setPreferences(prev => ({
                  ...prev,
                  readingPreferences: {
                    ...prev.readingPreferences,
                    showWatermark: !prev.readingPreferences.showWatermark
                  }
                }))}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.readingPreferences.showWatermark ? 'bg-purple-600' : 'bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                  preferences.readingPreferences.showWatermark ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* Language Preferences */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Preferensi Bahasa</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Bahasa Asing</h3>
              <div className="grid grid-cols-2 gap-3">
                {languages.slice(0, 12).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => toggleLanguage(lang.id)}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      preferences?.languages.includes(lang.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Bahasa Daerah</h3>
              <div className="grid grid-cols-2 gap-3">
                {languages.slice(12).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => toggleLanguage(lang.id)}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      preferences?.languages.includes(lang.id)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Genres */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Genre Favorit</h2>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  preferences.genres.includes(genre)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {genre}
                {preferences.genres.includes(genre) && (
                  <Check className="w-4 h-4 inline-block ml-1" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Minat Membaca</h2>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  preferences.interests.includes(interest)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {interest}
                {preferences.interests.includes(interest) && (
                  <Check className="w-4 h-4 inline-block ml-1" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Hobbies */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Hobi & Aktivitas</h2>
          <div className="flex flex-wrap gap-2">
            {HOBBIES.map(hobby => (
              <button
                key={hobby}
                onClick={() => toggleHobby(hobby)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  preferences.hobbies.includes(hobby)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {hobby}
                {preferences.hobbies.includes(hobby) && (
                  <Check className="w-4 h-4 inline-block ml-1" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Save Button */}
        <button
          onClick={savePreferences}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Simpan Preferensi
        </button>
      </div>
      {/* Floating Back Button */}
      <Link href="/profil" className="fixed bottom-6 left-6 z-50 bg-purple-700 hover:bg-purple-800 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all">
        <ChevronLeft className="w-6 h-6" />
      </Link>
    </div>
  )
} 