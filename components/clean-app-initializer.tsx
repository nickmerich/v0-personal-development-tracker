"use client"

import { useEffect, useState, type ReactNode } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface CleanAppInitializerProps {
  children: ReactNode
}

export function CleanAppInitializer({ children }: CleanAppInitializerProps) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simple initialization without complex dependencies
        await new Promise((resolve) => setTimeout(resolve, 100))
        setIsReady(true)
      } catch (err) {
        console.error("App initialization failed:", err)
        setError(err instanceof Error ? err.message : "Unknown initialization error")
      }
    }

    initializeApp()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-800 mb-4">🏗️ Building Interrupted</h1>
          <p className="text-red-600 mb-6">We encountered an issue while setting up your building environment.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Resume Building
          </button>
        </div>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-forest-700 font-medium">🏔️ Preparing your building environment...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
