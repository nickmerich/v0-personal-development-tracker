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
    const userData = storage.getUserData() || {}
    const completedSteps = userData.completedSteps || []

    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId)
      storage.updateUserData({ completedSteps })
      console.log(`✅ Step completed: ${stepId}`)
    }

    // Set cookies for middleware
    if (typeof document !== "undefined") {
      document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      document.cookie = `lastCompletedStep=${stepId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }
  },

  isStepCompleted(stepId: string): boolean {
    const completedSteps = this.getCompletedSteps()
    return completedSteps.includes(stepId)
  },

  getNextIncompleteStep(): string {
    const completedSteps = this.getCompletedSteps()

    for (const step of SETUP_STEPS) {
      if (step.required && !completedSteps.includes(step.id)) {
        console.log(`🎯 Next step: ${step.path}`)
        return step.path
      }
    }

    console.log("🎉 Setup complete! Redirecting to dashboard")
    return "/dashboard" // All required steps completed
  },

  getCurrentStep(): number {
    const completedSteps = this.getCompletedSteps()
    return completedSteps.length + 1
  },

  getTotalSteps(): number {
    return SETUP_STEPS.filter((step) => step.required).length
  },

  getProgressPercentage(): number {
    const completed = this.getCompletedSteps().length
    const total = this.getTotalSteps()
    return Math.round((completed / total) * 100)
  },

  isSetupComplete(): boolean {
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
  },

  completeSetup(): void {
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

    storage.updateUserData(defaultData)

    // Set cookies for middleware
    if (typeof document !== "undefined") {
      document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      document.cookie = `setupComplete=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    }

    console.log("🎉 Setup completed successfully!", defaultData)
  },

  resetSetup(): void {
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

    console.log("🔄 Setup reset")
  },

  validateSetupData(): { isValid: boolean; missingFields: string[] } {
    const userData = storage.getUserData()
    const missingFields: string[] = []

    if (!userData?.name) missingFields.push("name")
    if (!userData?.myWhy) missingFields.push("myWhy")
    if (!userData?.bigGoal) missingFields.push("bigGoal")
    if (!userData?.categories?.length) missingFields.push("categories")

    return {
      isValid: missingFields.length === 0,
      missingFields,
    }
  },
}
