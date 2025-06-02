"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Play,
  RotateCcw,
  User,
  Heart,
  Target,
  Grid3X3,
  Settings,
  Mountain,
} from "lucide-react"
import { storage } from "@/lib/storage"
import { setupManager, SETUP_STEPS } from "@/lib/setup-manager"

export default function OnboardingTest() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [testResults, setTestResults] = useState<any>({})
  const [isRunningTest, setIsRunningTest] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = () => {
    const data = storage.getUserData()
    setUserData(data)
    console.log("📊 Current user data:", data)
  }

  const runOnboardingTest = async () => {
    setIsRunningTest(true)
    const results: any = {}

    try {
      // Test 1: Check if setup manager is working
      results.setupManager = {
        status: "success",
        message: "Setup manager loaded successfully",
        data: {
          currentStep: setupManager.getCurrentStep(),
          totalSteps: setupManager.getTotalSteps(),
          isComplete: setupManager.isSetupComplete(),
          completedSteps: setupManager.getCompletedSteps(),
          nextStep: setupManager.getNextIncompleteStep(),
          progress: setupManager.getProgressPercentage(),
        },
      }

      // Test 2: Check data validation
      const validation = setupManager.validateSetupData()
      results.dataValidation = {
        status: validation.isValid ? "success" : "warning",
        message: validation.isValid ? "All required data present" : `Missing: ${validation.missingFields.join(", ")}`,
        data: validation,
      }

      // Test 3: Check storage functionality
      const testData = { test: "onboarding-test", timestamp: Date.now() }
      const saveSuccess = storage.updateUserData(testData)
      const loadedData = storage.getUserData()

      results.storage = {
        status: saveSuccess && loadedData?.test === "onboarding-test" ? "success" : "error",
        message: saveSuccess ? "Storage working correctly" : "Storage test failed",
        data: { saveSuccess, testDataPresent: loadedData?.test === "onboarding-test" },
      }

      // Test 4: Check each setup step
      results.setupSteps = {}
      SETUP_STEPS.forEach((step) => {
        const isCompleted = setupManager.isStepCompleted(step.id)
        results.setupSteps[step.id] = {
          status: isCompleted ? "success" : "pending",
          message: isCompleted ? "Completed" : "Not completed",
          title: step.title,
          path: step.path,
        }
      })

      // Test 5: Check dashboard readiness
      const dashboardReady = userData?.name && userData?.myWhy && userData?.bigGoal && userData?.categories?.length > 0
      results.dashboardReadiness = {
        status: dashboardReady ? "success" : "warning",
        message: dashboardReady ? "Dashboard ready" : "Missing required data for dashboard",
        data: {
          hasName: !!userData?.name,
          hasWhy: !!userData?.myWhy,
          hasGoal: !!userData?.bigGoal,
          hasCategories: userData?.categories?.length > 0,
        },
      }
    } catch (error) {
      results.error = {
        status: "error",
        message: `Test failed: ${error}`,
        data: error,
      }
    }

    setTestResults(results)
    setIsRunningTest(false)
    loadUserData() // Refresh user data
  }

  const resetOnboarding = () => {
    setupManager.resetSetup()
    storage.clear()
    setUserData(null)
    setTestResults({})
    console.log("🔄 Onboarding reset")
  }

  const startOnboarding = () => {
    router.push("/setup/personal-info")
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "error":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const stepIcons = {
    "personal-info": User,
    "my-why": Heart,
    "big-goal": Target,
    categories: Grid3X3,
    "calendar-preferences": Settings,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-green-600" />
              Onboarding Test Suite
            </CardTitle>
            <p className="text-gray-600">Test the complete onboarding flow and verify data integrity</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={runOnboardingTest} disabled={isRunningTest}>
                {isRunningTest ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Run Tests
              </Button>
              <Button variant="outline" onClick={startOnboarding}>
                Start Onboarding
              </Button>
              <Button variant="outline" onClick={goToDashboard}>
                Go to Dashboard
              </Button>
              <Button variant="destructive" onClick={resetOnboarding}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Onboarding
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Setup Complete:</span>
                  <Badge variant={setupManager.isSetupComplete() ? "default" : "secondary"}>
                    {setupManager.isSetupComplete() ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Progress:</span>
                  <span className="font-medium">{setupManager.getProgressPercentage()}%</span>
                </div>
                <Progress value={setupManager.getProgressPercentage()} className="h-2" />
                <div className="flex justify-between items-center">
                  <span>Steps Completed:</span>
                  <span className="font-medium">
                    {setupManager.getCompletedSteps().length} / {setupManager.getTotalSteps()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{userData?.name || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{userData?.email || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">{userData?.startDate || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-medium">{userData?.categories?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Setup Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {SETUP_STEPS.map((step, index) => {
                const Icon = stepIcons[step.id as keyof typeof stepIcons] || AlertCircle
                const isCompleted = setupManager.isStepCompleted(step.id)
                const testResult = testResults.setupSteps?.[step.id]

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border ${isCompleted ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className={`h-5 w-5 ${isCompleted ? "text-green-600" : "text-gray-400"}`} />
                      <span className="font-medium">{step.title}</span>
                      {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{step.path}</p>
                    <Button size="sm" variant="outline" onClick={() => router.push(step.path)} className="w-full">
                      {isCompleted ? "Review" : "Complete"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(testResults).map(([key, result]: [string, any]) => (
                  <div key={key} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                    {result.data && (
                      <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
