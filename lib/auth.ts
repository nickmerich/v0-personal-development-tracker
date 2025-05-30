"use client"

import React from "react"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

class AuthService {
  private static instance: AuthService
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  }
  private listeners: ((state: AuthState) => void)[] = []

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  constructor() {
    this.initializeAuth()
  }

  private async initializeAuth() {
    try {
      // Check for existing session
      const token = localStorage.getItem("authToken")
      const userData = localStorage.getItem("userData")

      if (token && userData) {
        const parsedUserData = JSON.parse(userData)
        this.authState = {
          user: {
            id: parsedUserData.id || "local-user",
            email: parsedUserData.email || "user@local.dev",
            name: parsedUserData.name || "User",
            createdAt: parsedUserData.createdAt || new Date().toISOString(),
          },
          isAuthenticated: true,
          isLoading: false,
        }
      } else {
        this.authState.isLoading = false
      }
    } catch (error) {
      console.error("Auth initialization error:", error)
      this.authState.isLoading = false
    }

    this.notifyListeners()
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.authState))
  }

  async login(email: string, password: string): Promise<User> {
    try {
      this.authState.isLoading = true
      this.notifyListeners()

      // For now, simulate API call with localStorage
      // In production, replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      const user: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split("@")[0],
        createdAt: new Date().toISOString(),
      }

      // Store auth token and user data
      const token = btoa(`${email}:${Date.now()}`)
      localStorage.setItem("authToken", token)

      this.authState = {
        user,
        isAuthenticated: true,
        isLoading: false,
      }

      this.notifyListeners()
      return user
    } catch (error) {
      this.authState.isLoading = false
      this.notifyListeners()
      throw error
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      this.authState.isLoading = true
      this.notifyListeners()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (!email || !password || !name) {
        throw new Error("All fields are required")
      }

      const user: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        createdAt: new Date().toISOString(),
      }

      const token = btoa(`${email}:${Date.now()}`)
      localStorage.setItem("authToken", token)

      this.authState = {
        user,
        isAuthenticated: true,
        isLoading: false,
      }

      this.notifyListeners()
      return user
    } catch (error) {
      this.authState.isLoading = false
      this.notifyListeners()
      throw error
    }
  }

  logout() {
    localStorage.removeItem("authToken")
    this.authState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }
    this.notifyListeners()
  }

  getCurrentUser(): User | null {
    return this.authState.user
  }

  getAuthState(): AuthState {
    return this.authState
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated
  }
}

export const authService = AuthService.getInstance()

// React hook for using auth in components
export function useAuth() {
  const [authState, setAuthState] = React.useState<AuthState>(authService.getAuthState())

  React.useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  return {
    ...authState,
    login: authService.login.bind(authService),
    register: authService.register.bind(authService),
    logout: authService.logout.bind(authService),
  }
}
