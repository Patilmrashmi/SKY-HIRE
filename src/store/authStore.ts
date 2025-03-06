import { create } from 'zustand';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type UserCredential
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { AuthState } from '../types';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      set({
        user: {
          id: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
        },
        error: null,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      set({
        user: {
          id: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
        },
        error: null,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  signUpWithEmail: async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      set({
        user: {
          id: result.user.uid,
          email: result.user.email || '',
          displayName: email.split('@')[0],
          photoURL: '',
        },
        error: null,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({
    user: user ? {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || '',
      photoURL: user.photoURL || '',
    } : null,
    loading: false,
  });
});