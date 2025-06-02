"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Settings, CheckCircle } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"
import { storage } from "@/lib/storage"
import { setupManager } from "@/lib/setup-manager"

export default function CalendarPreferences() {
  const router = useRouter()
  const [preferences, setPreferences] = useState({
    dailyReviewTime: "20:00",
    weeklyPlanningDay: "sunday",
    enableReminders: true,
    reminderTime: "09:00",
    trackHabits: true,
    scheduleWorkouts: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const userData = storage.getUserData()
    if (userData?.calendarPreferences) {
      setPreferences(userData.calendarPreferences)
    }

    // Check if previous step was completed
    if (!setupManager.isStepCompleted("categories")) {
      console.log("⚠️ Categories step not completed, redirecting")
      router.push("/setup/categories")
    }

    console.log("📅 Calendar preferences page loaded", { userData })
  }, [router])

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      console.log("🎯 Completing setup process...")

      // Get current user data
      const userData = storage.getUserData() || {}

      // Validate required data
      const validation = setupManager.validateSetupData()
      if (!validation.isValid) {
        console.error("❌ Setup validation failed:", validation.missingFields)
        alert(`Please complete the following fields: ${validation.missingFields.join(", ")}`)
        setIsLoading(false)
        return
      }

      // Initialize default affirmations
      const defaultAffirmations = [
        "I am built for this climb",
        "Every step up makes me stronger",
        "I don't quit when it gets hard",
        "The summit is earned, not given",
        "I control my elevation",
      ]

      // Ensure we have the 6 core categories with empty task arrays
      const coreCategories = ["Spiritual", "Physical", "Mental", "Nutritional", "Professional", "Family"]
      const tasks = userData.tasks || {}
      coreCategories.forEach((category) => {
        if (!tasks[category]) {
          tasks[category] = []
        }
      })

      // Update user data with all required fields
      const completeUserData = {
        ...userData,
        calendarPreferences: preferences,
        affirmations: userData.affirmations || defaultAffirmations,
        categories: userData.categories || coreCategories,
        tasks,
        milestones: userData.milestones || [],
        journalEntries: userData.journalEntries || {},
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
        onboardingCompleted: new Date().toISOString(),
      }

      // Save the complete data
      const success = storage.updateUserData(completeUserData)

      if (success) {
        // Mark step as completed and complete the setup
        setupManager.markStepCompleted("calendar-preferences")
        setupManager.completeSetup()

        console.log("🎉 Setup completed successfully!", completeUserData)

        // Navigate to dashboard
        router.push("/dashboard")
      } else {
        console.error("❌ Failed to save setup data")
        alert("Failed to save your preferences. Please try again.")
      }
    } catch (error) {
      console.error("❌ Error completing setup:", error)
      alert("An error occurred while completing setup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-green-100 p-4">
      <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={setupManager.getCurrentStep()} totalSteps={setupManager.getTotalSteps()} />
          <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Settings className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-green-800">Final Step!</CardTitle>
          <CardDescription className="text-center text-stone-600">
            Configure your preferences and complete your setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminders" className="text-green-800">
                  Daily Reminders
                </Label>
                <p className="text-sm text-stone-600">Get notified for your daily check-in</p>
              </div>
              <Switch
                id="reminders"
                checked={preferences.enableReminders}
                onCheckedChange={(checked) => setPreferences({ ...preferences, enableReminders: checked })}
              />
            </div>

            {preferences.enableReminders && (
              <div className="space-y-2">
                <Label htmlFor="reminder-time" className="text-green-800">
                  Reminder Time
                </Label>
                <Select
                  value={preferences.reminderTime}
                  onValueChange={(value) => setPreferences({ ...preferences, reminderTime: value })}
                >
                  <SelectTrigger className="border-green-300 focus:border-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-green-200">
                    <SelectItem value="07:00">7:00 AM - Early Morning</SelectItem>
                    <SelectItem value="08:00">8:00 AM - Morning</SelectItem>
                    <SelectItem value="09:00">9:00 AM - Mid Morning</SelectItem>
                    <SelectItem value="18:00">6:00 PM - Evening</SelectItem>
                    <SelectItem value="19:00">7:00 PM - Early Evening</SelectItem>
                    <SelectItem value="20:00">8:00 PM - Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="review-time" className="text-green-800">
                Daily Review Time
              </Label>
              <Select
                value={preferences.dailyReviewTime}
                onValueChange={(value) => setPreferences({ ...preferences, dailyReviewTime: value })}
              >
                <SelectTrigger className="border-green-300 focus:border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-green-200">
                  <SelectItem value="19:00">7:00 PM - Evening Reflection</SelectItem>
                  <SelectItem value="20:00">8:00 PM - Night Review</SelectItem>
                  <SelectItem value="21:00">9:00 PM - Before Bed</SelectItem>
                  <SelectItem value="22:00">10:00 PM - Late Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="track-habits" className="text-green-800">
                  Habit Tracking
                </Label>
                <p className="text-sm text-stone-600">Track consecutive days of progress</p>
              </div>
              <Switch
                id="track-habits"
                checked={preferences.trackHabits}
                onCheckedChange={(checked) => setPreferences({ ...preferences, trackHabits: checked })}
              />
            </div>
          </div>

          {/* Setup Summary */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Setup Summary
            </h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>✅ Personal information configured</p>
              <p>✅ Your "why" defined</p>
              <p>✅ Big goal established</p>
              <p>✅ Life categories selected</p>
              <p>✅ Preferences configured</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/setup/categories")}
            className="border-green-300 text-green-600 hover:bg-green-50"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleComplete}
            className="bg-green-600 text-white hover:bg-green-700 shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Completing Setup..." : "Complete Setup"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
