// composables/useAuth.ts
import { ref, readonly } from 'vue'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'

// Configuración de Firebase (reemplaza con tus valores reales)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.FIREBASE_APP_ID || '1:123456789:web:abcdef123456'
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const useAuth = () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Escuchar cambios de estado de autenticación
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    loading.value = false
  })

  const signInWithGoogle = async () => {
    try {
      error.value = null
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      error.value = err.message
    }
  }

  const signInWithFacebook = async () => {
    try {
      error.value = null
      const provider = new FacebookAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (err: any) {
      error.value = err.message
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      error.value = null
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      error.value = err.message
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      error.value = null
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      error.value = err.message
    }
  }

  const signOut = async () => {
    try {
      error.value = null
      await firebaseSignOut(auth)
    } catch (err: any) {
      error.value = err.message
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    clearError
  }
}