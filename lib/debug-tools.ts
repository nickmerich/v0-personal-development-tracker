"use client"

import { storage } from "./storage"
import { setupManager } from "./setup-manager"

export const debugTools = {
  logSetupState(): void {
    try {
      const userData = storage.getUserData()
      const completedSteps = setupManager.getCompletedSteps()
      const isComplete = setupManager.isSetupComplete()
      const progress = setupManager.getProgressPercentage()
      const nextStep = setupManager.getNextIncompleteStep()
      const validation = setupManager.validateSetupData()

      console.group("🔍 Setup State Diagnostic")
      console.log("User Data:", userData)
      console.log("Completed Steps:", completedSteps)
      console.log("Setup Complete:", isComplete)
      console.log("Progress:", progress + "%")
      console.log("Next Step:", nextStep)
      console.log("Validation:", validation)
      console.groupEnd()
    } catch (error) {
      console.error("Debug error:", error)
    }
  },

  fixSetupState(): void {
    try {
      const userData = storage.getUserData()
      if (!userData) return

      console.log("🔧 Attempting to fix setup state...")

      // Ensure all required fields exist
      const updatedData = {
        ...userData,
        name: userData.name || "Climber",
        startDate: userData.startDate || new Date().toISOString().split("T")[0],
        myWhy: userData.myWhy || "To become the best version of myself",
        bigGoal: userData.bigGoal || "Transform my life in 90 days",
        categories: userData.categories || ["Spiritual", "Physical", "Mental", "Nutritional", "Professional", "Family"],
        setupCompleted: true,
        completedSteps: setupManager.SETUP_STEPS.map((step) => step.id),
      }

      storage.updateUserData(updatedData)
      console.log("✅ Setup state fixed:", updatedData)
    } catch (error) {
      console.error("Fix attempt error:", error)
    }
  },

  simulateCompletedSetup(): void {
    try {
      setupManager.completeSetup()
      console.log("✅ Simulated complete setup")
      this.logSetupState()
    } catch (error) {
      console.error("Simulation error:", error)
    }
  },

  getDiagnosticInfo(): string {
    try {
      const userData = storage.getUserData()
      const isSetupComplete = setupManager.isSetupComplete()
      const completedSteps = setupManager.getCompletedSteps()

      return JSON.stringify(
        {
          userData,
          isSetupComplete,
          completedSteps,
          browser: typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      )
    } catch (error) {
      console.error("Diagnostic error:", error)
      return "Error generating diagnostic info"
    }
  },
}

// Export for use in browser console
if (typeof window !== "undefined") {
  ;(window as any).debugTools = debugTools
}

export default debugTools
