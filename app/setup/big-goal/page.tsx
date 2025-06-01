"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Target } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"
import { storage } from "@/lib/storage"
import { setupManager } from "@/lib/setup-manager"

export default function BigGoal() {
  const router = useRouter()
  const [bigGoal, setBigGoal] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const userData = storage.getUserData()
    if (userData?.bigGoal) {
      setBigGoal(userData.bigGoal)
    }

    // Check if previous step was completed
    if (!setupManager.isStepCompleted("my-why")) {
      router.push("/setup/my-why")
    }
  }, [router])

  const handleNext = async () => {
    if (!bigGoal.trim()) return

    setIsLoading(true)

    try {
      // Save data
      storage.updateUserData({ bigGoal })

      // Mark step as completed
      setupManager.markStepCompleted("big-goal")

      // Navigate to next step
      router.push("/setup/categories")
    } catch (error) {
      console.error("Error saving big goal:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100 p-4">
      <Card className="w-full max-w-md border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={3} totalSteps={5} />
          <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
            <Target className="h-6 w-6 text-forest-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-forest-800">Your Main Goal</CardTitle>
          <CardDescription className="text-center text-stone-600">
            What is the main thing you want to achieve in the next 90 days?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-earth-50 rounded-lg border border-earth-200">
              <h4 className="font-medium text-earth-800 mb-2">🎯 Goal Examples:</h4>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• Launch my business and reach $10k monthly revenue</li>
                <li>• Lose 30 pounds and complete a marathon</li>
                <li>• Write and publish my first book</li>
                <li>• Build the confidence to speak publicly</li>
              </ul>
            </div>

            <Textarea
              placeholder="Describe your main goal... What do you want to achieve? Be specific about what success looks like."
              className="min-h-[120px] border-forest-300 focus:border-forest-500 focus:ring-forest-200"
              value={bigGoal}
              onChange={(e) => setBigGoal(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/setup/my-why")}
            className="border-forest-300 text-forest-600 hover:bg-forest-50"
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!bigGoal.trim() || isLoading}
            className="bg-forest-600 text-white hover:bg-forest-700 shadow-lg"
          >
            {isLoading ? "Saving..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
