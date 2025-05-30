"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mountain } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"

export default function PersonalInfo() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [startDate, setStartDate] = useState("")

  useEffect(() => {
    // Set default start date to today
    setStartDate(new Date().toISOString().split("T")[0])

    // Load existing data if available
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    if (userData.name) setName(userData.name)
    if (userData.email) setEmail(userData.email)
    if (userData.startDate) setStartDate(userData.startDate)
  }, [])

  const handleNext = () => {
    if (!name.trim() || !startDate) return

    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        name,
        email,
        startDate,
      }),
    )

    router.push("/setup/my-why")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100 p-4">
      <Card className="w-full max-w-md border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={1} totalSteps={5} />
          <div className="flex items-center justify-center gap-2 mt-4">
            <Mountain className="h-8 w-8 text-forest-600" />
            <CardTitle className="text-2xl font-bold text-forest-800">The Gryt</CardTitle>
          </div>
          <CardDescription className="text-center text-stone-600 mt-2">
            Let's set up your basecamp before you start your climb
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-forest-800">
                Your Name
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
              <p className="text-xs text-stone-500">We'll use this for notifications and progress updates</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-forest-800">
                Start Date
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
            onClick={handleNext}
            disabled={!name.trim() || !startDate}
            className="w-full bg-forest-600 text-white hover:bg-forest-700 shadow-lg"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
