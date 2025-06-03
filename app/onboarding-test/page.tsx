"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { setupManager } from "@/lib/setup-manager"
import { storage } from "@/lib/storage"
import { debugTools } from "@/lib/debug-tools"
import { Check, X, AlertTriangle, ArrowRight, Trash2, RefreshCw } from "lucide-react"

export default function OnboardingTestPage() {
  const [testResults, setTestResults] = useState<Record<string, boolean | string>>({})
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticInfo, setDiagnosticInfo] = useState("")

  useEffect(() => {
    const runTests = async () => {
      try {
        setIsLoading(true)
        const data = storage.getUserData()
        setUserData(data)

        // Basic tests
        setTestResults({
          userDataExists: !!data,
          setupComplete: setupManager.isSetupComplete(),
          nameExists: !!data?.name,
          whyExists: !!data?.myWhy,
          goalExists: !!data?.bigGoal,
          categoriesExist: Array.isArray(data?.categories) && data?.categories.length > 0,
        })

        // Get diagnostic info
        setDiagnosticInfo(debugTools.getDiagnosticInfo())
      } catch (error) {
        console.error("Test error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    runTests()
  }, [])

  const handleResetSetup = () => {
    setupManager.resetSetup()
    window.location.reload()
  }

  const handleCompleteSetup = () => {
    setupManager.completeSetup()
    window.location.reload()
  }

  const handleFixSetup = () => {
    debugTools.fixSetupState()
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800">Running onboarding tests...</p>
        </div>
      </div>
    )
  }

  const allTestsPassed = Object.values(testResults).every((result) => result === true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Onboarding Test Results</span>
              {allTestsPassed ? (
                <Badge className="bg-green-600">All Tests Passed</Badge>
              ) : (
                <Badge className="bg-red-600">Issues Found</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(testResults).map(([test, result]) => (
                <div key={test} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    {result === true ? (
                      <Check className="text-green-600 h-5 w-5" />
                    ) : (
                      <X className="text-red-600 h-5 w-5" />
                    )}
                    <span className="capitalize">{test.replace(/([A-Z])/g, " $1")}</span>
                  </div>
                  <Badge
                    className={
                      result === true
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }
                  >
                    {result === true ? "Pass" : "Fail"}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-2">
              <h3 className="text-sm font-medium">Setup Progress</h3>
              <Progress value={setupManager.getProgressPercentage()} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Step {setupManager.getCurrentStep()} of {setupManager.getTotalSteps()}
                </span>
                <span>{setupManager.getProgressPercentage()}% Complete</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleResetSetup} variant="destructive" className="flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  Reset Setup
                </Button>

                <Button
                  onClick={handleCompleteSetup}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Force Complete
                </Button>

                <Button onClick={handleFixSetup} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Fix Issues
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => (window.location.href = "/setup/personal-info")}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ArrowRight className="h-4 w-4" />
                  Go to Setup
                </Button>

                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ArrowRight className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Data Preview</CardTitle>
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" />
              Diagnostic
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="overflow-auto max-h-96 bg-slate-100 p-4 rounded text-sm font-mono">
              <pre>{diagnosticInfo}</pre>
            </div>
            <div className="text-xs text-gray-500 mt-2">This data is used for debugging purposes only.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
