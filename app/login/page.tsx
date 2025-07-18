'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../lib/firebase'
import type { User } from 'firebase/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Set role in Firestore if new user
  const ensureUserRole = async (user: User) => {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        role: 'reader',
        createdAt: new Date().toISOString(),
        coins: {
          reader: 500,
          creator: 0,
          admin: 0
        }
      })
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)
      await ensureUserRole(res.user)
      router.push('/profil')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === 'auth/user-not-found') {
        // Auto register
        try {
          const res = await createUserWithEmailAndPassword(auth, email, password)
          await ensureUserRole(res.user)
          router.push('/profil')
          return
        } catch (err2: unknown) {
          if (err2 && typeof err2 === 'object' && 'message' in err2) {
            setError((err2 as { message?: string }).message || 'Terjadi kesalahan')
          } else {
            setError('Terjadi kesalahan')
          }
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'Terjadi kesalahan')
      } else {
        setError('Terjadi kesalahan')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const res = await signInWithPopup(auth, provider)
      await ensureUserRole(res.user)
      router.push('/profil')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'Terjadi kesalahan')
      } else {
        setError('Terjadi kesalahan')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-sm bg-white/5 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 font-semibold transition"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login / Register'}
          </button>
        </form>
        <div className="my-4 text-center text-white/60">atau</div>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 font-semibold flex items-center justify-center gap-2 border border-white/20"
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block"><g><path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303C33.962 32.833 29.419 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.69 0 5.164.957 7.104 2.527l6.062-6.062C33.527 5.797 28.977 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.045 0 20-8.955 20-20 0-1.341-.138-2.651-.389-3.917z"/><path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.54 16.207 18.961 13 24 13c2.69 0 5.164.957 7.104 2.527l6.062-6.062C33.527 5.797 28.977 4 24 4c-7.732 0-14.39 4.41-17.694 10.691z"/><path fill="#FBBC05" d="M24 44c5.363 0 10.29-1.843 14.137-4.994l-6.518-5.357C29.419 39.167 25.509 41 24 41c-5.386 0-9.926-3.443-11.965-8.233l-6.523 5.025C9.545 41.509 16.227 44 24 44z"/><path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-1.225 3.271-4.075 5.61-7.303 5.61-2.13 0-4.07-.7-5.601-1.899l-6.523 5.025C16.227 41 20.614 44 24 44c4.419 0 8.962-3.167 11.303-8.167l-6.518-5.357C29.419 39.167 25.509 41 24 41c-5.386 0-9.926-3.443-11.965-8.233l-6.523 5.025C9.545 41.509 16.227 44 24 44z"/></g></svg>
          Login dengan Google
        </button>
        {error && <div className="mt-4 text-red-400 text-center text-sm">{error}</div>}
      </div>
    </div>
  )
} 