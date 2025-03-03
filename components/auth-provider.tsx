"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react"
import { SessionProvider } from "next-auth/react"

type User = {
  id?: string
  name?: string
  email?: string
  image?: string
} | null

type AuthContextType = {
  user: User
  signIn: (provider: string) => void
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => {},
  signOut: () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

// Inner provider that uses the session
function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Update user when session changes
  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.email || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || undefined,
      })
    } else {
      setUser(null)
    }
    
    setIsLoading(status === "loading")
  }, [session, status])

  // Sign in function using NextAuth
  const signIn = (provider: string) => {
    try {
      console.log(`Attempting to sign in with ${provider}...`);
      // Use a more direct approach without the redirect parameter
      nextAuthSignIn(provider, { 
        callbackUrl: '/select-service'
      }).then(response => {
        console.log("Sign-in response:", response);
        if (response?.error) {
          console.error("Sign-in response error:", response.error);
        }
      }).catch(error => {
        console.error("Sign-in error:", error);
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }

  // Sign out function using NextAuth
  const signOut = () => {
    nextAuthSignOut({ callbackUrl: '/' })
  }

  return <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>{children}</AuthContext.Provider>
}

// Outer provider that provides the session
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  )
}

