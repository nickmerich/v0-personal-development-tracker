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
  completedSteps?: string[]
}

// Simple storage service for client-side data management
class StorageService {
  private prefix = "gryt_"

  // Get item from localStorage
  get(key: string): any {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(this.prefix + key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Storage get error:", error)
      return null
    }
  }

  // Set item in localStorage
  set(key: string, value: any): boolean {
    if (typeof window === "undefined") return false

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error("Storage set error:", error)
      return false
    }
  }

  // Remove item from localStorage
  remove(key: string): boolean {
    if (typeof window === "undefined") return false

    try {
      localStorage.removeItem(this.prefix + key)
      return true
    } catch (error) {
      console.error("Storage remove error:", error)
      return false
    }
  }

  // Get user data
  getUserData(): UserData | null {
    try {
      const data = this.get("userData")
      if (data === null) return null
      return this.validateUserData(data)
    } catch (error) {
      console.error("Get user data error:", error)
      return null
    }
  }

  // Update user data
  updateUserData(data: Partial<UserData>): boolean {
    try {
      console.log("🔄 Updating user data", data)
      const currentData = this.getUserData() || {}
      const updatedData = { ...currentData, ...data }
      console.log("✅ Updated data:", updatedData)
      return this.set("userData", updatedData)
    } catch (error) {
      console.error("Update user data error:", error)
      return false
    }
  }

  // Clear all data
  clear(): boolean {
    if (typeof window === "undefined") return false

    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.prefix))
      keys.forEach((key) => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error("Storage clear error:", error)
      return false
    }
  }

  // Validate and sanitize user data
  validateUserData(userData: any): UserData {
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
      completedSteps: Array.isArray(userData.completedSteps) ? userData.completedSteps : [],
    }
  }
}

// Export singleton instance
export const storage = new StorageService()

// Also export validateUserData separately as required
export function validateUserData(userData: any): UserData {
  return storage.validateUserData(userData)
}

// Default export for compatibility
export default storage
