"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  redirectToDashboard: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // 세션 새로고침 함수
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error refreshing session:", error)
        return
      }

      setSession(data.session)
      setUser(data.session?.user ?? null)
      setIsAuthenticated(!!data.session)
    } catch (error) {
      console.error("Error in refreshSession:", error)
    }
  }

  // 대시보드로 리다이렉션
  const redirectToDashboard = () => {
    console.log("Redirecting to dashboard")
    window.location.href = "/dashboard"
  }

  useEffect(() => {
    // 초기 세션 설정
    const initializeAuth = async () => {
      setIsLoading(true)
      try {
        // 세션 가져오기
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("Initial session found:", session.user.email)
          setSession(session)
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          console.log("No initial session found")
          setSession(null)
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // 인증 상태 변경 리스너 설정
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session)
      setIsLoading(false)

      // 세션 변경 시 페이지 새로고침 (필요한 경우)
      if (event === "SIGNED_IN") {
        console.log("User signed in, refreshing page")
        router.refresh()
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out, refreshing page")
        router.refresh()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { success: false, error }
      }

      if (data.session) {
        console.log("Sign in successful, session created:", data.session.user.email)
        setSession(data.session)
        setUser(data.user)
        setIsAuthenticated(true)

        // 세션 저장 확인을 위한 지연
        setTimeout(async () => {
          const { data: checkData } = await supabase.auth.getSession()
          console.log("Session check after login:", checkData.session?.user.email)
        }, 500)

        return { success: true }
      } else {
        console.error("Sign in successful but no session created")
        return { success: false, error: new Error("No session created") as unknown as AuthError }
      }
    } catch (error) {
      console.error("Error in signIn function:", error)
      return { success: false, error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      console.error("Error in signUp function:", error)
      return { success: false, error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
        throw error
      }

      setSession(null)
      setUser(null)
      setIsAuthenticated(false)

      // 강제 리다이렉션
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshSession,
    redirectToDashboard,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
