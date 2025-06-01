"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { storage } from "@/lib/storage"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  hasCloudBackup: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Create a context for authentication
const AuthContext = createContext<{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: (email: string, name: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<boolean>
  clearError: () => void
}>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signIn: async () => ({ success: false, error: "Not implemented" }),
  signUp: async () => ({ success: false, error: "Not implemented" }),
  signOut: async () => false,
  clearError: () => {},
})

// Auth Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for faster initial load
        const cachedUser = storage.get("cachedUser")
        if (cachedUser) {
          setAuthState({
            user: cachedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        }

        // Then verify with server
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (response.ok) {
          const result = await response.json()
          if (result.user) {
            // Update with server data
            setAuthState({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            // Cache user data
            storage.set("cachedUser", result.user)
          } else {
            // No user found on server
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
            storage.remove("cachedUser")
          }
        } else {
          // Error response
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
          storage.remove("cachedUser")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to check authentication status",
        })
      }
    }

    checkAuth()

    // Set up refresh interval for session
    const intervalId = setInterval(checkAuth, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(intervalId)
  }, [])

  // Sign in function
  const signIn = async (email: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState({ ...authState, isLoading: true, error: null })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
        credentials: "include",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        // Cache user data
        storage.set("cachedUser", result.user)

        // Sync data after sign in
        await storage.syncData()

        return { success: true }
      } else {
        setAuthState({
          ...authState,
          isLoading: false,
          error: result.error || "Sign in failed",
        })
        return { success: false, error: result.error || "Sign in failed" }
      }
    } catch (error) {
      const errorMessage = "Network error during sign in"
      setAuthState({
        ...authState,
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  // Sign up function
  const signUp = async (email: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState({ ...authState, isLoading: true, error: null })

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
        credentials: "include",
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        // Cache user data
        storage.set("cachedUser", result.user)

        // Migrate local data to cloud
        await migrateLocalDataToCloud()

        return { success: true }
      } else {
        setAuthState({
          ...authState,
          isLoading: false,
          error: result.error || "Sign up failed",
        })
        return { success: false, error: result.error || "Sign up failed" }
      }
    } catch (error) {
      const errorMessage = "Network error during sign up"
      setAuthState({
        ...authState,
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  // Sign out function
  const signOut = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })

        // Remove cached user
        storage.remove("cachedUser")

        return true
      }

      return false
    } catch (error) {
      console.error("Error during sign out:", error)
      return false
    }
  }

  // Migrate local data to cloud
  const migrateLocalDataToCloud = async (): Promise<boolean> => {
    try {
      const localData = storage.getUserData()
      if (!localData || Object.keys(localData).length === 0) {
        return true // No data to migrate
      }

      const response = await fetch("/api/data/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData: localData }),
        credentials: "include",
      })

      if (response.ok) {
        console.log("Successfully migrated local data to cloud")
        return true
      } else {
        console.error("Failed to migrate local data to cloud")
        return false
      }
    } catch (error) {
      console.error("Error migrating local data:", error)
      return false
    }
  }

  // Clear error
  const clearError = () => {
    setAuthState({ ...authState, error: null })
  }

  const contextValue = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    clearError,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Hook for using auth in components
export function useAuth() {
  return useContext(AuthContext)
}
