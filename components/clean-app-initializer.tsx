"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface CleanAppInitializerProps {
  children: React.ReactNode
}

export function CleanAppInitializer({ children }: CleanAppInitializerProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Simple initialization without complex dependencies
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)

    return () => clearTimeout(timer)
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
