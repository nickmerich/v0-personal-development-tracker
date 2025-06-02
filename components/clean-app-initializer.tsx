"use client"

import { useEffect, useState, type ReactNode } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface CleanAppInitializerProps {
  children: ReactNode
}

export function CleanAppInitializer({ children }: CleanAppInitializerProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Simple initialization without complex dependencies
    const initializeApp = async () => {
      try {
        // Just a simple delay to show loading
        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsReady(true)
      } catch (error) {
        console.error("Error initializing app:", error)
        // Continue anyway to avoid blocking the app
        setIsReady(true)
      }
    }

    initializeApp()
  }, [])

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
