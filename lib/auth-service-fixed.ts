"use client"

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

// Simple auth functions without React context
export const authService = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false
    const user = storage.get("cachedUser")
    return !!user
  },

  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    return storage.get("cachedUser")
  },

  // Sign in function
  signIn: async (email: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
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
        storage.set("cachedUser", result.user)
        await storage.syncData()
        return { success: true }
      } else {
        return { success: false, error: result.error || "Sign in failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error during sign in" }
    }
  },

  // Sign up function
  signUp: async (email: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
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
        storage.set("cachedUser", result.user)
        await authService.migrateLocalDataToCloud()
        return { success: true }
      } else {
        return { success: false, error: result.error || "Sign up failed" }
      }
    } catch (error) {
      return { success: false, error: "Network error during sign up" }
    }
  },

  // Sign out function
  signOut: async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        storage.remove("cachedUser")
        return true
      }
      return false
    } catch (error) {
      console.error("Error during sign out:", error)
      return false
    }
  },

  // Migrate local data to cloud
  migrateLocalDataToCloud: async (): Promise<boolean> => {
    try {
      const localData = storage.getUserData()
      if (!localData || Object.keys(localData).length === 0) {
        return true
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
  },
}
