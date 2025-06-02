"use client"

// Simple auth service for client-side authentication
// This is a simplified version that works with localStorage

interface User {
  id?: string
  name: string
  email?: string
}

class AuthService {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false

    try {
      const userData = localStorage.getItem("userData")
      return !!userData && !!JSON.parse(userData).name
    } catch (error) {
      console.error("Auth check error:", error)
      return false
    }
  }

  // Get current user
  getUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userData = localStorage.getItem("userData")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }

  // Login user
  login(user: User): boolean {
    if (typeof window === "undefined") return false

    try {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...user,
          lastLogin: new Date().toISOString(),
        }),
      )
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Logout user
  logout(): boolean {
    if (typeof window === "undefined") return false

    try {
      // We don't remove userData to preserve onboarding progress
      // Just mark as logged out
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsed = JSON.parse(userData)
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...parsed,
            isLoggedOut: true,
          }),
        )
      }
      return true
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }
}

// Create and export the singleton instance
export const authService = new AuthService()

// Default export for compatibility
export default authService
