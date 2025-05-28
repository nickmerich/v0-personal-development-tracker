"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, ArrowLeft, Settings } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    if (userData.calendarPreferences) {
      setPreferences(userData.calendarPreferences)
    }
  }, [])

  const handleComplete = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    // Initialize default affirmations
    const defaultAffirmations = [
      "I am committed to consistent daily progress toward my goals.",
      "Every step I take brings me closer to the person I want to become.",
      "I have the strength and determination to overcome any obstacle.",
      "My goals are achievable, and I am worthy of success.",
      "I am patient, persistent, and purposeful in my growth.",
    ]

    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        calendarPreferences: preferences,
        affirmations: defaultAffirmations,
        milestones: [],
        setupCompleted: true,
      }),
    )

    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100 p-4">
      <Card className="w-full max-w-md border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={5} totalSteps={5} />
          <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
            <Settings className="h-6 w-6 text-forest-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-forest-800">Preferences</CardTitle>
          <CardDescription className="text-center text-stone-600">
            Configure your schedule and reminder preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reminders" className="text-forest-800">
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
                <Label htmlFor="reminder-time" className="text-forest-800">
                  Reminder Time
                </Label>
                <Select
                  value={preferences.reminderTime}
                  onValueChange={(value) => setPreferences({ ...preferences, reminderTime: value })}
                >
                  <SelectTrigger className="border-forest-300 focus:border-forest-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-forest-200">
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
              <Label htmlFor="review-time" className="text-forest-800">
                Daily Review Time
              </Label>
              <Select
                value={preferences.dailyReviewTime}
                onValueChange={(value) => setPreferences({ ...preferences, dailyReviewTime: value })}
              >
                <SelectTrigger className="border-forest-300 focus:border-forest-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-forest-200">
                  <SelectItem value="19:00">7:00 PM - Evening Reflection</SelectItem>
                  <SelectItem value="20:00">8:00 PM - Night Review</SelectItem>
                  <SelectItem value="21:00">9:00 PM - Before Bed</SelectItem>
                  <SelectItem value="22:00">10:00 PM - Late Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="planning-day" className="text-forest-800">
                Weekly Planning Day
              </Label>
              <Select
                value={preferences.weeklyPlanningDay}
                onValueChange={(value) => setPreferences({ ...preferences, weeklyPlanningDay: value })}
              >
                <SelectTrigger className="border-forest-300 focus:border-forest-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-forest-200">
                  <SelectItem value="sunday">Sunday - Week Preparation</SelectItem>
                  <SelectItem value="monday">Monday - Fresh Start</SelectItem>
                  <SelectItem value="saturday">Saturday - Weekend Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="track-habits" className="text-forest-800">
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/setup/categories")}
            className="border-forest-300 text-forest-600 hover:bg-forest-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleComplete} className="bg-forest-600 text-white hover:bg-forest-700 shadow-lg">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
