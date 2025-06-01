"use client"

export interface UserData {
  name?: string
  startDate?: string
  myWhy?: string
  bigGoal?: string
  categories?: string[]
  tasks?: Record<string, any[]>
  milestones?: any[]
  journalEntries?: Record<string, any>
  affirmations?: string[]
  gamification?: {
    level: number
    xp: number
    totalXp: number
    streak: number
    achievements: string[]
    badges: string[]
  }
  appliedTemplates?: any[]
  notificationSettings?: any
  setupCompleted?: boolean
  calendarPreferences?: any
}

class StorageManager {
  private isOnline = true
  private syncQueue: Array<{ action: string; data: any; timestamp: number }> = []
  private isAuthenticated = false
  private syncInProgress = false

  constructor() {
    if (typeof window !== "undefined") {
      // Monitor online status
      window.addEventListener("online", () => {
        this.isOnline = true
        this.processSyncQueue()
      })

      window.addEventListener("offline", () => {
        this.isOnline = false
      })

      this.isOnline = navigator.onLine

      // Check authentication status on initialization
      this.checkAuthStatus()
    }
  }

  private async checkAuthStatus(): Promise<void> {
    try {
      const response = await fetch("/api/auth/me")
      this.isAuthenticated = response.ok
    } catch (error) {
      this.isAuthenticated = false
    }
  }

  // Local storage operations
  get(key: string): any {
    try {
      if (typeof window === "undefined") return null
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return null
    }
  }

  set(key: string, value: any): boolean {
    try {
      if (typeof window === "undefined") return false
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
      return false
    }
  }

  remove(key: string): boolean {
    try {
      if (typeof window === "undefined") return false
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  }

  clear(): boolean {
    try {
      if (typeof window === "undefined") return false
      localStorage.clear()
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  }

  // User data operations with cloud sync
  getUserData(): UserData | null {
    return this.get("userData")
  }

  setUserData(userData: UserData): boolean {
    const success = this.set("userData", userData)

    if (success && this.isAuthenticated) {
      // Queue for cloud sync only if authenticated
      this.queueSync("save", userData)
    }

    return success
  }

  updateUserData(updates: Partial<UserData>): boolean {
    const currentData = this.getUserData() || {}
    const updatedData = { ...currentData, ...updates }
    return this.setUserData(updatedData)
  }

  // Cloud sync operations
  private queueSync(action: string, data: any): void {
    // Don't queue if not authenticated or already in queue
    if (!this.isAuthenticated) return

    // Check if similar item already in queue
    const existingIndex = this.syncQueue.findIndex((item) => item.action === action)
    if (existingIndex !== -1) {
      // Update existing item instead of adding new one
      this.syncQueue[existingIndex] = {
        action,
        data,
        timestamp: Date.now(),
      }
    } else {
      this.syncQueue.push({
        action,
        data,
        timestamp: Date.now(),
      })
    }

    // Process immediately if online and not already syncing
    if (this.isOnline && !this.syncInProgress) {
      this.processSyncQueue()
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0 || this.syncInProgress) return

    this.syncInProgress = true
    const itemsToProcess = [...this.syncQueue]
    this.syncQueue = []

    for (const item of itemsToProcess) {
      try {
        if (item.action === "save") {
          const success = await this.syncToCloud(item.data)
          if (!success) {
            // Re-queue failed items
            this.syncQueue.push(item)
          }
        }
      } catch (error) {
        console.error("Error processing sync queue item:", error)
        // Re-queue failed items
        this.syncQueue.push(item)
      }
    }

    this.syncInProgress = false
  }

  private async syncToCloud(userData: UserData): Promise<boolean> {
    try {
      // Check authentication first
      if (!this.isAuthenticated) {
        await this.checkAuthStatus()
        if (!this.isAuthenticated) {
          console.log("Not authenticated, skipping cloud sync")
          return false
        }
      }

      const response = await fetch("/api/data/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // Include cookies
      })

      if (response.status === 401) {
        // Authentication failed
        this.isAuthenticated = false
        console.log("Authentication expired, skipping cloud sync")
        return false
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Cloud sync failed:", errorText)
        return false
      }

      console.log("Successfully synced to cloud")
      return true
    } catch (error) {
      console.error("Error syncing to cloud:", error)
      return false
    }
  }

  // Load data from cloud
  async loadFromCloud(): Promise<UserData | null> {
    try {
      if (!this.isAuthenticated) {
        await this.checkAuthStatus()
        if (!this.isAuthenticated) {
          console.log("Not authenticated, cannot load from cloud")
          return null
        }
      }

      const response = await fetch("/api/data/load", {
        credentials: "include",
      })

      if (response.status === 401) {
        this.isAuthenticated = false
        console.log("Authentication expired")
        return null
      }

      if (!response.ok) {
        throw new Error("Failed to load from cloud")
      }

      const result = await response.json()

      if (result.data) {
        // Update local storage with cloud data
        this.set("userData", result.data)
        console.log("Successfully loaded from cloud")
        return result.data
      }

      return null
    } catch (error) {
      console.error("Error loading from cloud:", error)
      return null
    }
  }

  // Sync data between local and cloud
  async syncData(): Promise<UserData | null> {
    try {
      if (!this.isAuthenticated) {
        await this.checkAuthStatus()
        if (!this.isAuthenticated) {
          console.log("Not authenticated, cannot sync data")
          return this.getUserData()
        }
      }

      const response = await fetch("/api/data/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.status === 401) {
        this.isAuthenticated = false
        console.log("Authentication expired")
        return this.getUserData()
      }

      if (!response.ok) {
        throw new Error("Failed to sync data")
      }

      const result = await response.json()

      if (result.data) {
        // Update local storage with synced data
        this.set("userData", result.data)
        console.log("Successfully synced data")
        return result.data
      }

      return this.getUserData()
    } catch (error) {
      console.error("Error syncing data:", error)
      return this.getUserData()
    }
  }

  // Authentication helpers
  async login(email: string, name: string): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
        credentials: "include",
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Login failed:", errorText)
        return false
      }

      const result = await response.json()

      if (result.success) {
        this.isAuthenticated = true
        // Sync data after login
        await this.syncData()
        console.log("Successfully logged in")
        return true
      }

      return false
    } catch (error) {
      console.error("Error during login:", error)
      return false
    }
  }

  async logout(): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        this.isAuthenticated = false
        // Don't clear local data on logout - keep for offline access
        console.log("Successfully logged out")
        return true
      }

      return false
    } catch (error) {
      console.error("Error during logout:", error)
      return false
    }
  }

  async getCurrentUser(): Promise<any | null> {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (!response.ok) {
        this.isAuthenticated = false
        return null
      }

      const result = await response.json()
      this.isAuthenticated = !!result.user
      return result.user
    } catch (error) {
      console.error("Error getting current user:", error)
      this.isAuthenticated = false
      return null
    }
  }

  // Force sync - useful for manual sync buttons
  async forceSyncToCloud(): Promise<boolean> {
    const userData = this.getUserData()
    if (!userData) return false

    return await this.syncToCloud(userData)
  }

  // Get sync status
  getSyncStatus(): { isOnline: boolean; isAuthenticated: boolean; queueLength: number; syncInProgress: boolean } {
    return {
      isOnline: this.isOnline,
      isAuthenticated: this.isAuthenticated,
      queueLength: this.syncQueue.length,
      syncInProgress: this.syncInProgress,
    }
  }
}

export const storage = new StorageManager()

export const validateUserData = (userData: any): UserData => {
  if (!userData || typeof userData !== "object") {
    return {}
  }

  return {
    name: userData.name || "",
    startDate: userData.startDate || new Date().toISOString().split("T")[0],
    myWhy: userData.myWhy || "",
    bigGoal: userData.bigGoal || "",
    categories: Array.isArray(userData.categories) ? userData.categories : [],
    tasks: userData.tasks && typeof userData.tasks === "object" ? userData.tasks : {},
    milestones: Array.isArray(userData.milestones) ? userData.milestones : [],
    journalEntries:
      userData.journalEntries && typeof userData.journalEntries === "object" ? userData.journalEntries : {},
    affirmations: Array.isArray(userData.affirmations) ? userData.affirmations : [],
    gamification: userData.gamification || {
      level: 1,
      xp: 0,
      totalXp: 0,
      streak: 0,
      achievements: [],
      badges: [],
    },
    appliedTemplates: Array.isArray(userData.appliedTemplates) ? userData.appliedTemplates : [],
    notificationSettings: userData.notificationSettings || {},
    setupCompleted: Boolean(userData.setupCompleted),
    calendarPreferences: userData.calendarPreferences || {},
  }
}
