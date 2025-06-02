"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { performanceOptimizer } from "@/lib/performance-optimizer"
import { authService } from "@/lib/auth"
import { setupManager } from "@/lib/setup-manager"
import { useAppStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/loading-spinner"
import { GrytLogo } from "@/components/gryt-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

interface AppInitializerProps {
  children: React.ReactNode
}

export function AppInitializer({ children }: AppInitializerProps) {
  const router = useRouter()
  const { setLoading, setError } = useAppStore()

  const [initState, setInitState] = useState<{
    isLoading: boolean
    progress: number
    currentStep: string
    error: string | null
    isComplete: boolean
    networkSlow: boolean
  }>({
    isLoading: true,
    progress: 0,
    currentStep: "Starting...",
    error: null,
    isComplete: false,
    networkSlow: false,
  })

  const handleProgress = useCallback((step: string, progress: number) => {
    setInitState((prev) => ({
      ...prev,
      currentStep: step,
      progress: Math.min(progress, 100),
    }))
  }, [])

  const initializeApp = useCallback(async () => {
    try {
      setInitState((prev) => ({ ...prev, isLoading: true, error: null }))

      // Check network conditions
      const networkInfo = performanceOptimizer.getNetworkInfo()
      const isSlowNetwork = networkInfo.effectiveType === "slow-2g" || networkInfo.effectiveType === "2g"

      if (isSlowNetwork) {
        setInitState((prev) => ({ ...prev, networkSlow: true }))
      }

      // Set timeout for slow networks
      const timeoutDuration = isSlowNetwork ? 10000 : 5000
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Initialization timeout")), timeoutDuration)
      })

      // Race between initialization and timeout
      const initPromise = performanceOptimizer.optimizedInit(handleProgress)

      const success = (await Promise.race([initPromise, timeoutPromise])) as boolean

      if (!success) {
        throw new Error("Initialization failed")
      }

      // Quick auth and setup checks
      handleProgress("Checking authentication", 80)
      const isAuthenticated = authService.isAuthenticated()

      handleProgress("Finalizing", 90)

      if (isAuthenticated) {
        const setupComplete = setupManager.isSetupComplete()
        if (setupComplete) {
          handleProgress("Redirecting to dashboard", 100)
          router.push("/dashboard")
          return
        } else {
          const nextStep = setupManager.getNextIncompleteStep()
          handleProgress("Redirecting to setup", 100)
          router.push(nextStep)
          return
        }
      }

      // Complete initialization
      handleProgress("Ready!", 100)
      setInitState((prev) => ({
        ...prev,
        isLoading: false,
        isComplete: true,
        progress: 100,
      }))
      setLoading(false)
    } catch (error) {
      console.error("App initialization error:", error)
      setInitState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to initialize app",
        progress: 0,
      }))
      setError("Initialization failed")
    }
  }, [router, setLoading, setError, handleProgress])

  const handleRetry = useCallback(() => {
    setInitState((prev) => ({
      ...prev,
      error: null,
      progress: 0,
      currentStep: "Retrying...",
    }))
    initializeApp()
  }, [initializeApp])

  const handleSkipToOffline = useCallback(() => {
    setInitState((prev) => ({
      ...prev,
      isLoading: false,
      isComplete: true,
      error: null,
    }))
    setLoading(false)
  }, [setLoading])

  useEffect(() => {
    // Preload critical resources
    performanceOptimizer.preloadCriticalResources()

    // Start initialization
    initializeApp()
  }, [initializeApp])

  // Show loading state
  if (initState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
          <GrytLogo className="mx-auto" />

          <div className="space-y-4">
            <LoadingSpinner size="lg" text={initState.currentStep} showProgress={true} progress={initState.progress} />

            {initState.networkSlow && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-amber-800 text-sm">🐌 Slow network detected. This may take a moment...</p>
              </div>
            )}

            {initState.progress > 0 && (
              <div className="w-full bg-forest-200 rounded-full h-2">
                <div
                  className="bg-forest-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${initState.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (initState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-red-600">Initialization Failed</h2>
            <p className="text-gray-600">{initState.error}</p>

            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              <Button onClick={handleSkipToOffline} variant="outline" className="w-full">
                Continue Offline
              </Button>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Troubleshooting tips:</p>
              <ul className="text-left space-y-1">
                <li>• Check your internet connection</li>
                <li>• Try refreshing the page</li>
                <li>• Clear browser cache</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // App is ready, render children
  return <>{children}</>
}
