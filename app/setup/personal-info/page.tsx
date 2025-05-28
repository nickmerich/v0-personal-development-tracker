"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Target } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"

export default function PersonalInfo() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")

  const handleNext = () => {
    if (!name || !startDate) return

    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        name,
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
          <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
            <Target className="h-6 w-6 text-forest-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-forest-800">Getting Started</CardTitle>
          <CardDescription className="text-center text-stone-600">
            Let's set up your personal development tracker
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <p className="text-xs text-stone-500">When will you begin your 90-day journey?</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-forest-600 text-white hover:bg-forest-700 shadow-lg"
            onClick={handleNext}
            disabled={!name || !startDate}
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
