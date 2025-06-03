"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mountain, ArrowRight, Sparkles } from "lucide-react"
import { storage } from "@/lib/storage"
import { setupManager } from "@/lib/setup-manager"

export default function SetupComplete() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeCompletion = async () => {
      try {
        console.log("🔄 Loading setup completion page...")
        const storedUserData = storage.getUserData()

        if (!storedUserData) {
          console.error("❌ No user data found, redirecting to setup")
          router.push("/setup/personal-info")
          return
        }

        // Validate setup data
        const validation = setupManager.validateSetupData()
        if (!validation.isValid) {
          const missingSteps = validation.missingFields.join(", ")
          console.error(`❌ Setup validation failed. Missing: ${missingSteps}`)
          router.push("/setup/personal-info")
          return
        }

        // If we reach here, data is valid
        console.log("✅ User data loaded successfully:", storedUserData)
        setUserData(storedUserData)

        // Mark setup as completed if not already
        if (!storedUserData.setupCompleted) {
          console.log("🔄 Marking setup as completed...")
          setupManager.completeSetup()
        }
      } catch (error) {
        console.error("❌ Error in setup completion:", error)
        setError("An error occurred during setup completion. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    initializeCompletion()
  }, [router])

  const handleContinueToDashboard = () => {
    try {
      console.log("🚀 Navigating to dashboard")

      // Ensure setup is marked complete before proceeding
      const userData = storage.getUserData()
      if (!userData?.setupCompleted) {
        setupManager.completeSetup()
      }

      // Force a page reload to clear any stale state
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard"
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("❌ Navigation error:", error)
      setError("Failed to navigate to dashboard. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800">Finalizing your setup...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-green-100">
        <Card className="w-full max-w-md border-red-200 bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-red-700">Setup Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-600">{error}</p>
            <div className="flex justify-center">
              <Button onClick={() => router.push("/setup/personal-info")} className="bg-red-600 hover:bg-red-700">
                Restart Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-green-100">
        <div className="text-center">
          <p className="text-green-800">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-green-100 p-4">
      <Card className="w-full max-w-2xl border-green-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-800 mb-2">🎉 Welcome to The Gryt!</CardTitle>
          <p className="text-lg text-stone-600">Your mountain climbing journey is ready to begin</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Setup Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Mountain className="h-5 w-5" />
              Your Basecamp is Ready
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Personal Info</h4>
                <p className="text-sm text-stone-600">
                  <strong>Name:</strong> {userData.name || "Climber"}
                </p>
                <p className="text-sm text-stone-600">
                  <strong>Start Date:</strong> {userData.startDate || new Date().toISOString().split("T")[0]}
                </p>
                {userData.email && (
                  <p className="text-sm text-stone-600">
                    <strong>Email:</strong> {userData.email}
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-green-700 mb-2">Your Goals</h4>
                <p className="text-sm text-stone-600">
                  <strong>Categories:</strong> {userData.categories?.length || 0} life areas
                </p>
                <p className="text-sm text-stone-600">
                  <strong>Reminders:</strong> {userData.calendarPreferences?.enableReminders ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          </div>

          {/* Your Why */}
          {userData.myWhy && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">💝 Your Why</h4>
              <p className="text-sm text-blue-700 italic">"{userData.myWhy}"</p>
            </div>
          )}

          {/* Big Goal */}
          {userData.bigGoal && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">🎯 Your Big Goal</h4>
              <p className="text-sm text-purple-700 italic">"{userData.bigGoal}"</p>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              What's Next?
            </h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>✨ Explore your personalized dashboard</li>
              <li>📝 Add your first daily tasks</li>
              <li>🎯 Set up your first milestone</li>
              <li>📅 Plan your week ahead</li>
              <li>🏆 Start building your streak</li>
            </ul>
          </div>

          {/* CTA Button */}
          <div className="text-center pt-4">
            <Button
              onClick={handleContinueToDashboard}
              size="lg"
              className="bg-green-600 text-white hover:bg-green-700 shadow-lg px-8 py-4 text-lg"
            >
              Enter Your Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-xs text-stone-500 mt-2">Your 90-day transformation journey starts now!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
