import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import api from '../config/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchDBUser(email, name, photoURL) {
    try {
      const res = await api.post('/auth/login', { email, name, photoURL })
      localStorage.setItem('token', res.data.token)
      setDbUser(res.data.user)
      return res.data.user
    } catch (err) {
      console.error('DB user fetch failed', err)
    }
  }

  async function register({ name, email, password, role, phone }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const res = await api.post('/auth/register', { name, email, role, phone, photoURL: '' })
    localStorage.setItem('token', res.data.token)
    setDbUser(res.data.user)
    return cred
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await fetchDBUser(cred.user.email, cred.user.displayName, cred.user.photoURL)
    return cred
  }

  async function googleLogin() {
    const cred = await signInWithPopup(auth, googleProvider)
    await fetchDBUser(cred.user.email, cred.user.displayName, cred.user.photoURL)
    return cred
  }

  async function logout() {
    await signOut(auth)
    localStorage.removeItem('token')
    setDbUser(null)
  }

  async function refreshDBUser() {
    if (!user?.email) return
    try {
      const res = await api.get('/users/me')
      setDbUser(res.data)
    } catch {}
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const token = localStorage.getItem('token')
        if (!token) {
          await fetchDBUser(firebaseUser.email, firebaseUser.displayName, firebaseUser.photoURL)
        } else {
          try {
            const res = await api.get('/users/me')
            setDbUser(res.data)
          } catch {
            await fetchDBUser(firebaseUser.email, firebaseUser.displayName, firebaseUser.photoURL)
          }
        }
      } else {
        setDbUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const value = { user, dbUser, loading, register, login, googleLogin, logout, refreshDBUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
