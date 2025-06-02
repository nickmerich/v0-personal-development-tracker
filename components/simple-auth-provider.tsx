"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  name: string
  email?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (name: string, email?: string) => boolean
  logout: () => boolean
  isLoading: boolean
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => false,
  isLoading: true,
})

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    try {
      // Use localStorage directly instead of authService to avoid method conflicts
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("userData")
        if (userData) {
          const parsed = JSON.parse(userData)
          if (parsed.name) {
            setIsAuthenticated(true)
            setUser({
              name: parsed.name,
              email: parsed.email || "user@example.com",
            })
          }
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login function
  const login = (name: string, email?: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        const userData = {
          name,
          email: email || "user@example.com",
          lastLogin: new Date().toISOString(),
        }

        localStorage.setItem("userData", JSON.stringify(userData))
        setIsAuthenticated(true)
        setUser({ name, email })
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Logout function
  const logout = (): boolean => {
    try {
      setIsAuthenticated(false)
      setUser(null)
      // Don't clear localStorage to preserve onboarding data
      return true
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }

  // Context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Hook for using auth context
export function useSimpleAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useSimpleAuth must be used within SimpleAuthProvider")
  }

  return context
}

// Alias for backward compatibility
export const useAuth = useSimpleAuth
