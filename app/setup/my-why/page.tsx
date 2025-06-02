"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Heart, HelpCircle } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"
import { storage } from "@/lib/storage"

export default function MyWhy() {
  const router = useRouter()
  const [myWhy, setMyWhy] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    try {
      const userData = storage.getUserData()
      if (userData?.myWhy) {
        setMyWhy(userData.myWhy)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }, [])

  const handleNext = async () => {
    if (!myWhy.trim()) return

    setIsLoading(true)
    setIsSaving(true)

    try {
      // Save data
      const success = storage.updateUserData({ myWhy })

      if (success) {
        // Navigate to next step
        router.push("/setup/big-goal")
      } else {
        console.error("Failed to save data")
      }
    } catch (error) {
      console.error("Error saving my why:", error)
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
  }

  const handleSave = async () => {
    if (!myWhy.trim()) return

    setIsSaving(true)
    try {
      storage.updateUserData({ myWhy })
    } catch (error) {
      console.error("Error saving:", error)
    } finally {
      setIsSaving(false)
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
          <div className="flex items-center justify-center mt-4">
            <CardTitle className="text-2xl font-bold text-green-800">Your Why</CardTitle>
            <Button variant="ghost" size="icon" className="ml-2">
              <HelpCircle className="h-4 w-4 text-green-600" />
              <span className="sr-only">Help</span>
            </Button>
          </div>

          <CardDescription className="text-center text-stone-600">
            What motivates you to grow and improve? What's your deeper purpose?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Examples from others:</h4>
              <ul className="text-sm text-stone-600 space-y-1">
                <li>• "To be the best role model for my children"</li>
                <li>• "To honor those who believed in me by reaching my potential"</li>
                <li>• "To overcome my fears and build unshakeable confidence"</li>
                <li>• "To create the life my family deserves"</li>
              </ul>
            </div>

            <Textarea
              placeholder="Write about what drives you to improve... What motivates you? Who are you doing this for? What will achieving your goals mean to you and those you love?"
              className="min-h-[120px] border-green-300 focus:border-green-500 focus:ring-green-200"
              value={myWhy}
              onChange={(e) => setMyWhy(e.target.value)}
              onBlur={handleSave}
            />

            {isSaving && <p className="text-sm text-green-600">Saving...</p>}
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
