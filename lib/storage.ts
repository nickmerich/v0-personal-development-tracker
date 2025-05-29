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

export const storage = {
  get: (key: string): any => {
    try {
      if (typeof window === "undefined") return null
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return null
    }
  },

  set: (key: string, value: any): boolean => {
    try {
      if (typeof window === "undefined") return false
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
      return false
    }
  },

  remove: (key: string): boolean => {
    try {
      if (typeof window === "undefined") return false
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
      return false
    }
  },

  clear: (): boolean => {
    try {
      if (typeof window === "undefined") return false
      localStorage.clear()
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  },

  getUserData: (): UserData | null => {
    return storage.get("userData")
  },

  setUserData: (userData: UserData): boolean => {
    return storage.set("userData", userData)
  },

  updateUserData: (updates: Partial<UserData>): boolean => {
    const currentData = storage.getUserData() || {}
    const updatedData = { ...currentData, ...updates }
    return storage.setUserData(updatedData)
  },
}

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
