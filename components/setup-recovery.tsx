"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { setupManager } from "@/lib/setup-manager"
import { AlertTriangle, RefreshCw } from "lucide-react"

export function SetupRecovery() {
  const router = useRouter()
  const [isResetting, setIsResetting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleResetSetup = async () => {
    setIsResetting(true)

    try {
      // Reset the setup process
      setupManager.resetSetup()

      setShowSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/setup/personal-info")
      }, 2000)
    } catch (error) {
      console.error("Error resetting setup:", error)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-red-200 bg-white/90 backdrop-blur-sm shadow-xl">
      <CardHeader className="bg-red-50 border-b border-red-100">
        <CardTitle className="text-xl font-bold text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Setup Recovery
        </CardTitle>
        <CardDescription className="text-red-600">
          If you're stuck in the setup process, you can reset it here.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {showSuccess ? (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <AlertTitle>Setup Reset Successfully</AlertTitle>
              <AlertDescription>
                You'll be redirected to the beginning of the setup process in a moment.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p className="text-gray-700">
                This will reset your setup progress and allow you to start fresh. Your existing data will be preserved,
                but you'll need to complete the setup process again.
              </p>
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTitle className="text-amber-800">Warning</AlertTitle>
                <AlertDescription className="text-amber-700">
                  This action will reset your setup progress, but won't delete any of your tasks or milestones.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleResetSetup}
          disabled={isResetting || showSuccess}
          className="w-full bg-red-600 text-white hover:bg-red-700 shadow-lg"
        >
          {isResetting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Resetting...
            </>
          ) : (
            "Reset Setup Process"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
