"use client"

import { storage } from "./storage"

export interface SetupStep {
  id: string
  path: string
  completed: boolean
  required: boolean
  title: string
}

export const SETUP_STEPS: SetupStep[] = [
  { id: "personal-info", path: "/setup/personal-info", required: true, completed: false, title: "Personal Info" },
  { id: "my-why", path: "/setup/my-why", required: true, completed: false, title: "Your Why" },
  { id: "big-goal", path: "/setup/big-goal", required: true, completed: false, title: "Big Goal" },
  { id: "categories", path: "/setup/categories", required: true, completed: false, title: "Life Areas" },
  {
    id: "calendar-preferences",
    path: "/setup/calendar-preferences",
    required: true,
    completed: false,
    title: "Preferences",
  },
]

export const setupManager = {
  getCompletedSteps(): string[] {
    const userData = storage.getUserData()
    return userData?.completedSteps || []
  },

  markStepCompleted(stepId: string): void {
    try {
      console.log(`🔄 Marking step completed: ${stepId}`)
      const userData = storage.getUserData() || {}
      const completedSteps = userData.completedSteps || []

      if (!completedSteps.includes(stepId)) {
        completedSteps.push(stepId)
        storage.updateUserData({ completedSteps })
        console.log(`✅ Step completed: ${stepId}`, { completedSteps })
      }

      // Set cookies for middleware
      if (typeof document !== "undefined") {
        document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        document.cookie = `lastCompletedStep=${stepId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }
    } catch (error) {
      console.error("❌ Error marking step completed:", error)
    }
  },

  isStepCompleted(stepId: string): boolean {
    try {
      const completedSteps = this.getCompletedSteps()
      return completedSteps.includes(stepId)
    } catch (error) {
      console.error("❌ Error checking step completion:", error)
      return false
    }
  },

  getNextIncompleteStep(): string {
    try {
      const completedSteps = this.getCompletedSteps()
      console.log("🔍 Finding next incomplete step. Completed steps:", completedSteps)

      for (const step of SETUP_STEPS) {
        if (step.required && !completedSteps.includes(step.id)) {
          console.log(`🎯 Next step: ${step.path}`)
          return step.path
        }
      }

      console.log("🎉 All steps complete, redirecting to setup completion")
      return "/setup/complete" // All required steps completed
    } catch (error) {
      console.error("❌ Error getting next incomplete step:", error)
      return "/setup/personal-info" // Safe default
    }
  },

  getCurrentStep(): number {
    try {
      const completedSteps = this.getCompletedSteps()
      return Math.min(completedSteps.length + 1, SETUP_STEPS.length)
    } catch (error) {
      console.error("❌ Error getting current step:", error)
      return 1
    }
  },

  getTotalSteps(): number {
    return SETUP_STEPS.filter((step) => step.required).length
  },

  getProgressPercentage(): number {
    try {
      const completed = this.getCompletedSteps().length
      const total = this.getTotalSteps()
      return Math.round((completed / total) * 100)
    } catch (error) {
      console.error("❌ Error calculating progress percentage:", error)
      return 0
    }
  },

  isSetupComplete(): boolean {
    try {
      const userData = storage.getUserData()
      if (!userData) return false

      // Check if all required steps are completed
      const completedSteps = userData.completedSteps || []
      const allRequiredStepsCompleted = SETUP_STEPS.filter((step) => step.required).every((step) =>
        completedSteps.includes(step.id),
      )

      const hasSetupFlag = userData.setupCompleted === true
      const isComplete = allRequiredStepsCompleted && hasSetupFlag

      console.log(`🔍 Setup complete check: ${isComplete}`, {
        allRequiredStepsCompleted,
        hasSetupFlag,
        completedSteps,
      })

      return isComplete
    } catch (error) {
      console.error("❌ Error checking if setup is complete:", error)
      return false
    }
  },

  completeSetup(): void {
    try {
      console.log("🔄 Completing setup...")
      const userData = storage.getUserData() || {}

      // Mark all steps as completed
      const allStepIds = SETUP_STEPS.map((step) => step.id)

      // Initialize default data structure
      const defaultData = {
        completedSteps: allStepIds,
        setupCompleted: true,
        categories: userData.categories || ["Spiritual", "Physical", "Mental", "Nutritional", "Professional", "Family"],
        tasks: userData.tasks || {},
        milestones: userData.milestones || [],
        journalEntries: userData.journalEntries || {},
        affirmations: userData.affirmations || [
          "I am built for this climb",
          "Every step up makes me stronger",
          "I don't quit when it gets hard",
          "The summit is earned, not given",
          "I control my elevation",
        ],
        gamification: userData.gamification || {
          level: 1,
          xp: 0,
          totalXp: 0,
          streak: 0,
          achievements: [],
          badges: [],
        },
        appliedTemplates: userData.appliedTemplates || [],
        notificationSettings: userData.notificationSettings || {},
      }

      // Initialize tasks for each category
      if (defaultData.categories) {
        defaultData.categories.forEach((category: string) => {
          if (!defaultData.tasks[category]) {
            defaultData.tasks[category] = []
          }
        })
      }

      // Set user data with completed setup
      storage.updateUserData(defaultData)

      // Set cookies for middleware
      if (typeof document !== "undefined") {
        document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        document.cookie = `setupComplete=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }

      console.log("✅ Setup completed successfully!", defaultData)
    } catch (error) {
      console.error("❌ Error completing setup:", error)
      throw new Error("Failed to complete setup")
    }
  },

  resetSetup(): void {
    try {
      console.log("🔄 Resetting setup...")
      const userData = storage.getUserData() || {}
      storage.updateUserData({
        completedSteps: [],
        setupCompleted: false,
      })

      // Update cookies
      if (typeof document !== "undefined") {
        document.cookie = `lastCompletedStep=; path=/; max-age=0`
        document.cookie = `setupComplete=false; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      }

      console.log("✅ Setup reset successfully")
    } catch (error) {
      console.error("❌ Error resetting setup:", error)
    }
  },

  validateSetupData(): { isValid: boolean; missingFields: string[] } {
    try {
      const userData = storage.getUserData()
      const missingFields: string[] = []

      if (!userData?.name) missingFields.push("name")
      if (!userData?.myWhy) missingFields.push("myWhy")
      if (!userData?.bigGoal) missingFields.push("bigGoal")
      if (!userData?.categories?.length) missingFields.push("categories")

      const isValid = missingFields.length === 0
      console.log(`🔍 Validation result: ${isValid}`, { missingFields })

      return {
        isValid,
        missingFields,
      }
    } catch (error) {
      console.error("❌ Error validating setup data:", error)
      return {
        isValid: false,
        missingFields: ["error"],
      }
    }
  },
}
