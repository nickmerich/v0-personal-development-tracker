"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "@/lib/auth-service"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, name?: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await authService.initialize()
        setUser(authService.getCurrentUser())
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn: async (email: string, name?: string) => {
      const result = await authService.signIn(email, name)
      if (result.success && result.user) {
        setUser(result.user)
      }
      return result
    },
    signUp: async (email: string, name: string) => {
      const result = await authService.signUp(email, name)
      if (result.success && result.user) {
        setUser(result.user)
      }
      return result
    },
    signOut: async () => {
      const success = await authService.signOut()
      if (success) {
        setUser(null)
      }
      return success
    },
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useSimpleAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useSimpleAuth must be used within SimpleAuthProvider")
  }
  return context
}
