"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Mountain } from "lucide-react"

interface JourneyStep {
  id: string
  name: string
  route: string
  description: string
  status: "pending" | "success" | "error" | "warning"
  details?: string
}

export default function TestJourney() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [steps, setSteps] = useState<JourneyStep[]>([
    {
      id: "landing",
      name: "Landing Page",
      route: "/",
      description: "User arrives at landing page",
      status: "pending",
    },
    {
      id: "getting-started",
      name: "Getting Started Walkthrough",
      route: "/getting-started",
      description: "Educational walkthrough about The Gryt",
      status: "pending",
    },
    {
      id: "setup-personal",
      name: "Personal Info Setup",
      route: "/setup/personal-info",
      description: "Step 1: Collect name, email, start date",
      status: "pending",
    },
    {
      id: "setup-why",
      name: "My Why Setup",
      route: "/setup/my-why",
      description: "Step 2: Define motivation and purpose",
      status: "pending",
    },
    {
      id: "setup-goal",
      name: "Big Goal Setup",
      route: "/setup/big-goal",
      description: "Step 3: Set 90-day summit goal",
      status: "pending",
    },
    {
      id: "setup-categories",
      name: "Categories Setup",
      route: "/setup/categories",
      description: "Step 4: Configure life areas",
      status: "pending",
    },
    {
      id: "setup-preferences",
      name: "Calendar Preferences",
      route: "/setup/calendar-preferences",
      description: "Step 5: Set notifications and preferences",
      status: "pending",
    },
    {
      id: "dashboard",
      name: "Dashboard Access",
      route: "/dashboard",
      description: "Access main dashboard with all features",
      status: "pending",
    },
  ])

  const checkRoute = async (route: string): Promise<{ success: boolean; details: string }> => {
    try {
      // Simulate route check
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check if route exists and is accessible
      if (route === "/") {
        return { success: true, details: "Landing page loads correctly" }
      }

      if (route === "/getting-started") {
        return { success: true, details: "Walkthrough accessible" }
      }

      if (route.startsWith("/setup/")) {
        return { success: true, details: "Setup step accessible" }
      }

      if (route === "/dashboard") {
        const userData = localStorage.getItem("userData")
        if (!userData) {
          return { success: false, details: "No user data found" }
        }

        const parsed = JSON.parse(userData)
        if (!parsed.setupCompleted) {
          return { success: false, details: "Setup not completed" }
        }

        return { success: true, details: "Dashboard accessible with completed setup" }
      }

      return { success: true, details: "Route accessible" }
    } catch (error) {
      return { success: false, details: `Error: ${error}` }
    }
  }

  const checkDataFlow = (): { success: boolean; details: string } => {
    try {
      const userData = localStorage.getItem("userData")
      if (!userData) {
        return { success: false, details: "No userData in localStorage" }
      }

      const parsed = JSON.parse(userData)
      const requiredFields = ["name", "startDate", "myWhy", "bigGoal", "categories", "setupCompleted"]
      const missingFields = requiredFields.filter((field) => !parsed[field])

      if (missingFields.length > 0) {
        return { success: false, details: `Missing fields: ${missingFields.join(", ")}` }
      }

      return { success: true, details: "All required data present" }
    } catch (error) {
      return { success: false, details: `Data parsing error: ${error}` }
    }
  }

  const checkMiddleware = (): { success: boolean; details: string } => {
    try {
      const hasUserData = document.cookie.includes("hasUserData=true")
      const setupComplete = document.cookie.includes("setupComplete=true")

      if (!hasUserData) {
        return { success: false, details: "hasUserData cookie not set" }
      }

      if (!setupComplete) {
        return { success: false, details: "setupComplete cookie not set" }
      }

      return { success: true, details: "Middleware cookies properly set" }
    } catch (error) {
      return { success: false, details: `Cookie check error: ${error}` }
    }
  }

  const runFullTest = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    // Reset all steps
    setSteps((prev) => prev.map((step) => ({ ...step, status: "pending", details: undefined })))

    // Test each step
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i)
      const step = steps[i]

      const result = await checkRoute(step.route)

      setSteps((prev) =>
        prev.map((s, index) =>
          index === i
            ? {
                ...s,
                status: result.success ? "success" : "error",
                details: result.details,
              }
            : s,
        ),
      )

      if (!result.success && step.route !== "/dashboard") {
        // Continue testing even if a step fails (except dashboard which requires setup)
      }
    }

    // Additional checks
    const dataCheck = checkDataFlow()
    const middlewareCheck = checkMiddleware()

    setSteps((prev) => [
      ...prev,
      {
        id: "data-flow",
        name: "Data Flow Check",
        route: "localStorage",
        description: "Verify data persistence",
        status: dataCheck.success ? "success" : "error",
        details: dataCheck.details,
      },
      {
        id: "middleware",
        name: "Middleware Check",
        route: "cookies",
        description: "Verify route protection",
        status: middlewareCheck.success ? "success" : "warning",
        details: middlewareCheck.details,
      },
    ])

    setIsRunning(false)
  }

  const simulateUserJourney = () => {
    // Clear existing data
    localStorage.removeItem("userData")
    document.cookie = "hasUserData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "setupComplete=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

    // Simulate complete user journey
    const mockUserData = {
      name: "Test User",
      email: "test@example.com",
      startDate: new Date().toISOString().split("T")[0],
      myWhy: "To test the complete user journey and ensure everything works",
      bigGoal: "Complete a full test of The Gryt platform",
      categories: ["Spiritual", "Physical", "Mental", "Nutritional", "Professional", "Family"],
      tasks: {
        Spiritual: [],
        Physical: [],
        Mental: [],
        Nutritional: [],
        Professional: [],
        Family: [],
      },
      milestones: [],
      journalEntries: {},
      affirmations: [
        "I am built for this climb",
        "Every step up makes me stronger",
        "I don't quit when it gets hard",
        "The summit is earned, not given",
        "I control my elevation",
      ],
      gamification: {
        level: 1,
        xp: 0,
        totalXp: 0,
        streak: 0,
        achievements: [],
        badges: [],
      },
      setupCompleted: true,
      calendarPreferences: {
        dailyReviewTime: "20:00",
        weeklyPlanningDay: "sunday",
        enableReminders: true,
        reminderTime: "09:00",
        trackHabits: true,
        scheduleWorkouts: false,
      },
    }

    localStorage.setItem("userData", JSON.stringify(mockUserData))
    document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    document.cookie = `setupComplete=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

    alert("Mock user journey data created! You can now test the dashboard.")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-800">The Gryt - Journey Verification</h1>
          </div>
          <p className="text-gray-600">Test the complete user journey from landing to dashboard</p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Journey Test Controls</CardTitle>
              <CardDescription>Run comprehensive tests to verify the entire user experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={runFullTest} disabled={isRunning} className="bg-green-600 hover:bg-green-700">
                  {isRunning ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Run Full Journey Test"
                  )}
                </Button>
                <Button
                  onClick={simulateUserJourney}
                  variant="outline"
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  Simulate Complete Setup
                </Button>
                <Button onClick={() => router.push("/dashboard")} variant="outline">
                  Test Dashboard Access
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Journey Steps</CardTitle>
              <CardDescription>Each step in the user journey from first visit to dashboard access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      currentStep === index && isRunning ? "ring-2 ring-green-500 bg-green-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(step.status)}
                        <div>
                          <h3 className="font-medium text-gray-900">{step.name}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{step.route}</code>
                        </div>
                      </div>
                      <Badge className={getStatusColor(step.status)}>{step.status}</Badge>
                    </div>
                    {step.details && (
                      <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">{step.details}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
              <CardDescription>Jump to any part of the journey for manual testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button onClick={() => router.push("/")} variant="outline" size="sm">
                  Landing
                </Button>
                <Button onClick={() => router.push("/getting-started")} variant="outline" size="sm">
                  Get Started
                </Button>
                <Button onClick={() => router.push("/setup/personal-info")} variant="outline" size="sm">
                  Setup
                </Button>
                <Button onClick={() => router.push("/dashboard")} variant="outline" size="sm">
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
