"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Heart } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"
import { storage } from "@/lib/storage"
import { setupManager } from "@/lib/setup-manager"

export default function MyWhy() {
  const router = useRouter()
  const [myWhy, setMyWhy] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load existing data if available
    const userData = storage.getUserData()
    if (userData?.myWhy) {
      setMyWhy(userData.myWhy)
    }

    // Check if previous step was completed
    if (!setupManager.isStepCompleted("personal-info")) {
      router.push("/setup/personal-info")
    }

    setIsLoading(false)
  }, [router])

  // Auto-save when typing stops
  useEffect(() => {
    if (myWhy.trim() && !isSaving) {
      if (saveTimeout) clearTimeout(saveTimeout)

      const timeout = setTimeout(() => {
        handleAutoSave()
      }, 1000)

      setSaveTimeout(timeout)
    }

    return () => {
      if (saveTimeout) clearTimeout(saveTimeout)
    }
  }, [myWhy])

  const handleAutoSave = async () => {
    if (!myWhy.trim()) return

    setIsSaving(true)
    try {
      storage.updateUserData({ myWhy: myWhy.trim() })
    } catch (error) {
      console.error("Error auto-saving:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = async () => {
    if (!myWhy.trim()) return

    setIsLoading(true)

    try {
      // Save data
      storage.updateUserData({ myWhy: myWhy.trim() })

      // Mark step as completed
      setupManager.markStepCompleted("my-why")

      // Navigate to next step
      router.push("/setup/big-goal")
    } catch (error) {
      console.error("Error saving my why:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-stone-50 to-green-100 p-4">
      <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={2} totalSteps={5} />
          <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-green-800">What's Your Why?</CardTitle>
          <CardDescription className="text-center text-stone-600">
            Define your deep motivation for personal growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-stone-700">
              Your "why" is your purpose, cause or belief that inspires you. It's the foundation of your journey.
            </p>
            <Textarea
              placeholder="I want to improve because..."
              value={myWhy}
              onChange={(e) => setMyWhy(e.target.value)}
              className="min-h-[150px] border-green-300 focus:border-green-500 focus:ring-green-200"
            />
            <p className="text-xs text-stone-500 italic">
              Example: "I want to be the best version of myself so I can inspire my children and leave a positive impact
              on the world."
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/setup/personal-info")}
            className="border-green-300 text-green-600 hover:bg-green-50"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!myWhy.trim() || isLoading}
            className="bg-green-600 text-white hover:bg-green-700 shadow-lg"
          >
            {isLoading ? "Saving..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
