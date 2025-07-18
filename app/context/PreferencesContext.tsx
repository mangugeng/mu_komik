'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

interface ReadingPreferences {
  pageLayout: 'vertical' | 'horizontal'
  autoPlay: boolean
}

interface UserPreferences {
  languages: string[]
  readingPreferences: ReadingPreferences
  genres: string[]
  interests: string[]
  hobbies: string[]
  readingHistory: {
    lastRead: string
    totalRead: number
    favoriteGenres: string[]
  }
}

interface PreferencesContextType {
  preferences: UserPreferences | null
  loading: boolean
  user: User | null
}

const defaultPreferences: UserPreferences = {
  languages: ['id'],
  readingPreferences: {
    pageLayout: 'vertical',
    autoPlay: false,
  },
  genres: [],
  interests: [],
  hobbies: [],
  readingHistory: {
    lastRead: '',
    totalRead: 0,
    favoriteGenres: []
  }
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: null,
  loading: true,
  user: null
})

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const prefsDoc = await getDoc(doc(db, 'users', u.uid, 'preferences', 'reading'))
        if (prefsDoc.exists()) {
          setPreferences(prefsDoc.data() as UserPreferences)
        } else {
          setPreferences(defaultPreferences)
        }
      } else {
        setPreferences(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return (
    <PreferencesContext.Provider value={{ preferences, loading, user }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  return useContext(PreferencesContext)
} 