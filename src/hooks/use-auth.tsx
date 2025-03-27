"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface User {
  id: string
  name: string
  email: string
  role: "org_admin" | "approver" | "user" | "employee" | "admin"
  organizationId?: string
  company: string
}

interface UserProfile {
  name: string
  company: string
  role: string
}

interface AuthContextType {
  user: User | null
  organizationId: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, profile: UserProfile) => Promise<void>
  signInWithLink: (email: string) => Promise<void>
  completeSignInWithLink: (email: string) => Promise<void>
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const actionCodeSettings = {
  url: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://localhost:3000/login',
  handleCodeInApp: true,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            const userProfile: User = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              role: userData.role || 'user',
              organizationId: userData.organizationId || null,
              company: userData.company || '',
            };
            
            setUser(userProfile);
            setOrganizationId(userData.organizationId || null);
          } else {
            // If no Firestore document exists yet, create a basic user object
            const userProfile: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              email: firebaseUser.email || '',
              role: 'user',
              company: '',
            };
            
            setUser(userProfile);
            setOrganizationId(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Create a basic user object on error
          const userProfile: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            email: firebaseUser.email || '',
            role: 'user',
            company: '',
          };
          
          setUser(userProfile);
          setOrganizationId(null);
        }
      } else {
        setUser(null);
        setOrganizationId(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, profile: UserProfile) => {
    setIsLoading(true)
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Here you would typically store additional user data in your database
      // For now, we'll just update the local state
      const userData: User = {
        id: firebaseUser.uid,
        name: profile.name,
        email: firebaseUser.email || '',
        role: profile.role as "org_admin" | "approver" | "user" | "employee" | "admin",
        company: profile.company,
      }
      setUser(userData)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithLink = async (email: string) => {
    setIsLoading(true)
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)
      // Save the email for later use
      localStorage.setItem('emailForSignIn', email)
    } finally {
      setIsLoading(false)
    }
  }

  const completeSignInWithLink = async (email: string) => {
    setIsLoading(true)
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        await signInWithEmailLink(auth, email, window.location.href)
        localStorage.removeItem('emailForSignIn')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setOrganizationId(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        organizationId,
        signIn, 
        signUp, 
        signInWithLink,
        completeSignInWithLink,
        signOut, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

