"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"
import { authService } from "@/lib/auth-service"

interface OptimizedAppInitializerProps {
  children: React.ReactNode
}

export function OptimizedAppInitializer({ children }: OptimizedAppInitializerProps) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize auth service
        await authService.initialize()

        // Short delay to ensure everything is loaded
        await new Promise((resolve) => setTimeout(resolve, 100))

        setIsReady(true)
      } catch (err) {
        console.error("App initialization error:", err)
        setError("Failed to initialize application")
      }
    }

    initializeApp()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-600 text-xl font-semibold">Initialization Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-green-700 font-medium">🏔️ Preparing your mountain journey...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
