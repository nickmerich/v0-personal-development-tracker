"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { HybridDataService } from "@/lib/hybrid-data-service"
import { PerformanceMonitor } from "@/lib/performance-monitor"
import { useAppStore } from "@/lib/store"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Database, HardDrive } from "lucide-react"

interface InitializationState {
  phase: "initializing" | "database" | "data" | "complete" | "error"
  message: string
  progress: number
  error?: string
  serviceStatus?: any
}

export function OptimizedAppInitializer({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InitializationState>({
    phase: "initializing",
    message: "Starting your journey...",
    progress: 0,
  })

  const { setUserData, setLoading, setError } = useAppStore()

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    const endTiming = PerformanceMonitor.startTiming("app-initialization")

    try {
      // Phase 1: Initialize services
      setState({
        phase: "initializing",
        message: "Initializing services...",
        progress: 10,
      })

      await new Promise((resolve) => setTimeout(resolve, 100)) // Prevent flash

      // Phase 2: Database setup
      setState({
        phase: "database",
        message: "Connecting to database...",
        progress: 30,
      })

      await HybridDataService.initialize()
      const serviceStatus = HybridDataService.getStatus()

      // Phase 3: Load user data
      setState({
        phase: "data",
        message: "Loading your data...",
        progress: 60,
      })

      const { data, mode } = await HybridDataService.loadUserData()

      if (data) {
        setUserData(data)
      }

      // Phase 4: Complete
      setState({
        phase: "complete",
        message: `Ready! Running in ${mode} mode`,
        progress: 100,
        serviceStatus,
      })

      setLoading(false)
      endTiming()

      // Auto-hide after success
      setTimeout(() => {
        setState((prev) => ({ ...prev, phase: "complete" }))
      }, 1000)
    } catch (error) {
      console.error("App initialization failed:", error)

      setState({
        phase: "error",
        message: "Initialization failed",
        progress: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      setError("Failed to initialize app")
      endTiming()
    }
  }

  const retryInitialization = () => {
    setState({
      phase: "initializing",
      message: "Retrying...",
      progress: 0,
    })
    initializeApp()
  }

  // Show loading screen during initialization
  if (state.phase !== "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            {/* Logo */}
            <div className="text-4xl font-bold text-green-700">🏔️ The Gryt</div>

            {/* Loading indicator */}
            {state.phase !== "error" ? (
              <LoadingSpinner size="lg" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            )}

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${state.progress}%` }}
              />
            </div>

            {/* Status message */}
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-800">{state.message}</p>

              {state.phase === "complete" && state.serviceStatus && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  {state.serviceStatus.databaseAvailable ? (
                    <>
                      <Database className="w-4 h-4" /> Cloud sync enabled
                    </>
                  ) : (
                    <>
                      <HardDrive className="w-4 h-4" /> Local storage mode
                    </>
                  )}
                </div>
              )}

              {state.error && <div className="text-red-600 text-sm">{state.error}</div>}
            </div>

            {/* Retry button for errors */}
            {state.phase === "error" && (
              <Button onClick={retryInitialization} className="w-full">
                Try Again
              </Button>
            )}

            {/* Performance info in development */}
            {process.env.NODE_ENV === "development" && (
              <details className="text-xs text-gray-500">
                <summary>Performance Info</summary>
                <pre className="mt-2 text-left">{PerformanceMonitor.getReport()}</pre>
              </details>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // App is ready, render children
  return <>{children}</>
}
