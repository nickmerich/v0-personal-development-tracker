"use client"

import { storage } from "./storage"

export interface SetupStep {
  id: string
  path: string
  completed: boolean
  required: boolean
}

export const SETUP_STEPS = [
  { id: "personal-info", path: "/setup/personal-info", required: true },
  { id: "my-why", path: "/setup/my-why", required: true },
  { id: "big-goal", path: "/setup/big-goal", required: true },
  { id: "categories", path: "/setup/categories", required: true },
  { id: "calendar-preferences", path: "/setup/calendar-preferences", required: true },
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
    }

    // Set cookies for middleware
    document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    document.cookie = `lastCompletedStep=${stepId}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  },

  isStepCompleted(stepId: string): boolean {
    const completedSteps = this.getCompletedSteps()
    return completedSteps.includes(stepId)
  },

  getNextIncompleteStep(): string {
    const completedSteps = this.getCompletedSteps()

    for (const step of SETUP_STEPS) {
      if (step.required && !completedSteps.includes(step.id)) {
        return step.path
      }
    }

    return "/dashboard" // All required steps completed
  },

  isSetupComplete(): boolean {
    const userData = storage.getUserData()
    if (!userData) return false

    // Check if all required steps are completed
    const completedSteps = userData.completedSteps || []
    const allRequiredStepsCompleted = SETUP_STEPS.filter((step) => step.required).every((step) =>
      completedSteps.includes(step.id),
    )

    return userData.setupCompleted === true && allRequiredStepsCompleted
  },

  completeSetup(): void {
    const userData = storage.getUserData() || {}

    // Mark all steps as completed
    const allStepIds = SETUP_STEPS.map((step) => step.id)
    storage.updateUserData({
      completedSteps: allStepIds,
      setupCompleted: true,
    })

    // Set cookies for middleware
    document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    document.cookie = `setupComplete=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  },

  resetSetup(): void {
    const userData = storage.getUserData() || {}
    storage.updateUserData({
      completedSteps: [],
      setupCompleted: false,
    })

    // Update cookies
    document.cookie = `lastCompletedStep=; path=/; max-age=0`
    document.cookie = `setupComplete=false; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  },
}
