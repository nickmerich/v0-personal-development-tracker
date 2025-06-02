"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mountain, User } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"
import { storage } from "@/lib/storage"
import { setupManager } from "@/lib/setup-manager"

export default function PersonalInfo() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [startDate, setStartDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Set default start date to today
    setStartDate(new Date().toISOString().split("T")[0])

    // Load existing data if available
    const userData = storage.getUserData()
    if (userData?.name) setName(userData.name)
    if (userData?.email) setEmail(userData.email)
    if (userData?.startDate) setStartDate(userData.startDate)

    console.log("📝 Personal Info page loaded", { userData })
  }, [])

  const handleNext = async () => {
    if (!name.trim() || !startDate) return

    setIsLoading(true)

    try {
      // Save data
      const success = storage.updateUserData({
        name: name.trim(),
        email: email.trim(),
        startDate,
        onboardingStarted: new Date().toISOString(),
      })

      if (success) {
        // Mark step as completed
        setupManager.markStepCompleted("personal-info")

        console.log("✅ Personal info saved, navigating to my-why")

        // Navigate to next step
        router.push("/setup/my-why")
      } else {
        console.error("❌ Failed to save personal info")
      }
    } catch (error) {
      console.error("❌ Error saving personal info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-green-100 p-4">
      <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={setupManager.getCurrentStep()} totalSteps={setupManager.getTotalSteps()} />
          <div className="flex items-center justify-center gap-2 mt-4">
            <Mountain className="h-8 w-8 text-green-600" />
            <CardTitle className="text-2xl font-bold text-green-800">The Gryt</CardTitle>
          </div>
          <CardDescription className="text-center text-stone-600 mt-2">
            Let's set up your basecamp before you start your climb
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-green-800 flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-800">
                Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-200"
              />
              <p className="text-xs text-stone-500">We'll use this for notifications and progress updates</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-green-800">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-green-300 focus:border-green-500 focus:ring-green-200"
                required
              />
              <p className="text-xs text-stone-500">Day 1 of your 90-day mountain climb</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleNext}
            disabled={!name.trim() || !startDate || isLoading}
            className="w-full bg-green-600 text-white hover:bg-green-700 shadow-lg"
          >
            {isLoading ? "Saving..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
