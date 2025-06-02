"use client"

import { storage } from "@/lib/storage"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  hasCloudBackup: boolean
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: User
}

// Simple auth service class
class AuthServiceClass {
  private currentUser: User | null = null
  private loading = false
  private error: string | null = null

  // Initialize auth service
  async initialize(): Promise<void> {
    if (typeof window === "undefined") return

    try {
      this.loading = true
      const cachedUser = storage.get("cachedUser")
      if (cachedUser) {
        this.currentUser = cachedUser
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
    } finally {
      this.loading = false
    }
  }

  // Sign in
  async signIn(email: string, name?: string): Promise<AuthResult> {
    try {
      this.loading = true
      this.error = null

      // For demo purposes, create a mock user
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: email.trim(),
        name: name || email.split("@")[0],
        createdAt: new Date().toISOString(),
        hasCloudBackup: false,
      }

      this.currentUser = mockUser
      storage.set("cachedUser", mockUser)

      return { success: true, user: mockUser }
    } catch (error) {
      console.error("Sign in error:", error)
      this.error = "Sign in failed"
      return { success: false, error: "Sign in failed" }
    } finally {
      this.loading = false
    }
  }

  // Sign up
  async signUp(email: string, name: string): Promise<AuthResult> {
    try {
      this.loading = true
      this.error = null

      // For demo purposes, create a mock user
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email: email.trim(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
        hasCloudBackup: false,
      }

      this.currentUser = mockUser
      storage.set("cachedUser", mockUser)

      return { success: true, user: mockUser }
    } catch (error) {
      console.error("Sign up error:", error)
      this.error = "Sign up failed"
      return { success: false, error: "Sign up failed" }
    } finally {
      this.loading = false
    }
  }

  // Sign out
  async signOut(): Promise<boolean> {
    try {
      this.currentUser = null
      storage.remove("cachedUser")
      return true
    } catch (error) {
      console.error("Sign out error:", error)
      return false
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.currentUser
  }

  // Get loading state
  isLoading(): boolean {
    return this.loading
  }

  // Get error
  getError(): string | null {
    return this.error
  }

  // Clear error
  clearError(): void {
    this.error = null
  }
}

// Create singleton instance
export const authService = new AuthServiceClass()

// Export hook-like function for React components
export function useAuth() {
  return {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isLoading: authService.isLoading(),
    error: authService.getError(),
    signIn: authService.signIn.bind(authService),
    signUp: authService.signUp.bind(authService),
    signOut: authService.signOut.bind(authService),
    clearError: authService.clearError.bind(authService),
  }
}

// Initialize on import
if (typeof window !== "undefined") {
  authService.initialize()
}
