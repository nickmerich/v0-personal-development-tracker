"use client"

// Simple storage utility for client-side data persistence
// This is a simplified version that works with localStorage

export const storage = {
  // Get user data from localStorage
  getUserData(): any {
    if (typeof window === "undefined") return null

    try {
      const userData = localStorage.getItem("userData")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Get user data error:", error)
      return null
    }
  },

  // Update user data in localStorage
  updateUserData(data: any): boolean {
    if (typeof window === "undefined") return false

    try {
      const userData = this.getUserData() || {}
      const updatedData = { ...userData, ...data }

      localStorage.setItem("userData", JSON.stringify(updatedData))
      return true
    } catch (error) {
      console.error("Update user data error:", error)
      return false
    }
  },

  // Get item from localStorage
  get(key: string): any {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Get ${key} error:`, error)
      return null
    }
  },

  // Set item in localStorage
  set(key: string, value: any): boolean {
    if (typeof window === "undefined") return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Set ${key} error:`, error)
      return false
    }
  },

  // Remove item from localStorage
  remove(key: string): boolean {
    if (typeof window === "undefined") return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Remove ${key} error:`, error)
      return false
    }
  },

  // Clear all data
  clear(): boolean {
    if (typeof window === "undefined") return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error("Clear storage error:", error)
      return false
    }
  },

  // Validate user data
  validateUserData(data: any): any {
    if (!data) return {}

    // Ensure we have the basic structure
    return {
      name: data.name || "",
      email: data.email || "",
      startDate: data.startDate || "",
      myWhy: data.myWhy || "",
      bigGoal: data.bigGoal || "",
      categories: data.categories || [],
      completedSteps: data.completedSteps || [],
      setupCompleted: !!data.setupCompleted,
      ...data,
    }
  },
}

// Export for compatibility
export default storage
