"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "@/lib/auth-service"

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
      const isAuth = authService.isAuthenticated()
      const currentUser = authService.getUser()

      setIsAuthenticated(isAuth)
      setUser(currentUser)
    } catch (error) {
      console.error("Auth initialization error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login function
  const login = (name: string, email?: string): boolean => {
    try {
      const success = authService.login({ name, email })

      if (success) {
        setIsAuthenticated(true)
        setUser({ name, email })
      }

      return success
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // Logout function
  const logout = (): boolean => {
    try {
      const success = authService.logout()

      if (success) {
        setIsAuthenticated(false)
        setUser(null)
      }

      return success
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
