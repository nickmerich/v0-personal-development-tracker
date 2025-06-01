"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mountain } from "lucide-react"
import { storage } from "@/lib/storage"
import { setupManager } from "@/lib/setup-manager"

export default function DirectSetup() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!name.trim() || !startDate) {
      setError("Please fill in your name and start date")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Save data directly to localStorage
      const userData = {
        name: name.trim(),
        email: email.trim(),
        startDate,
        setupStarted: true,
        createdAt: new Date().toISOString(),
      }

      // Save to storage
      storage.updateUserData(userData)

      // Mark step as completed
      setupManager.markStepCompleted("personal-info")

      // Set cookies for middleware
      document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
      document.cookie = `lastCompletedStep=personal-info; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

      // Navigate to next step
      setTimeout(() => {
        router.push("/setup/my-why")
      }, 500)
    } catch (error) {
      console.error("Error saving data:", error)
      setError("Failed to save your information. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100 p-4">
      <Card className="w-full max-w-md border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="w-full space-y-2 mb-4">
            <div className="flex justify-between text-xs text-stone-600">
              <span>Base Camp</span>
              <span>20% Ready</span>
              <span>Summit Ready</span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-200">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-forest-500 to-forest-600 transition-all duration-500 ease-in-out"
                style={{ width: "20%" }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mountain className="h-8 w-8 text-forest-600" />
            <CardTitle className="text-2xl font-bold text-forest-800">The Gryt</CardTitle>
          </div>
          <CardDescription className="text-center text-stone-600 mt-2">
            Direct Setup - Let's get you started on your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-forest-800">
                Your Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-forest-300 focus:border-forest-500 focus:ring-forest-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-forest-800">
                Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-forest-300 focus:border-forest-500 focus:ring-forest-200"
              />
              <p className="text-xs text-stone-500">For notifications and progress updates</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-forest-800">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-forest-300 focus:border-forest-500 focus:ring-forest-200"
              />
              <p className="text-xs text-stone-500">Day 1 of your 90-day mountain climb</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || !startDate || isLoading}
            className="w-full bg-forest-600 text-white hover:bg-forest-700 shadow-lg"
          >
            {isLoading ? "Saving..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
