"use client"

import { useEffect } from "react"

import { useState } from "react"

import { Suspense, lazy } from "react"
import { AppInitializer } from "@/components/app-initializer"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { authService } from "@/lib/auth"
import { setupManager } from "@/lib/setup-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GrytLogo } from "@/components/gryt-logo"

// Lazy load heavy components
const HomePageComponent = lazy(() => import("@/components/home-page"))

function HomePageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading homepage..." />
    </div>
  )
}

export default function Page() {
  const router = useRouter()
  const { userData, isLoading: storeLoading, setLoading } = useAppStore()
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initializeApp = async () => {
    try {
      setIsInitializing(true)
      setError(null)

      // Quick initialization without blocking
      await new Promise((resolve) => setTimeout(resolve, 100)) // Minimal delay

      // Check if user is authenticated
      const isAuthenticated = authService.isAuthenticated()
      const currentUser = authService.getCurrentUser()

      if (isAuthenticated && currentUser) {
        // Check if setup is complete
        const setupComplete = setupManager.isSetupComplete()

        if (setupComplete) {
          // Redirect to dashboard
          router.push("/dashboard")
          return
        } else {
          // Redirect to next setup step
          const nextStep = setupManager.getNextIncompleteStep()
          router.push(nextStep)
          return
        }
      }

      // User not authenticated, stay on homepage
      setIsInitializing(false)
      setLoading(false)
    } catch (error) {
      console.error("App initialization error:", error)
      setError("Failed to initialize application")
      setIsInitializing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    initializeApp()
  }, [router, setLoading])

  const handleGetStarted = () => {
    try {
      router.push("/setup/personal-info")
    } catch (error) {
      console.error("Navigation error:", error)
      setError("Failed to start setup")
    }
  }

  return (
    <AppInitializer>
      <Suspense fallback={<HomePageFallback />}>
        {isInitializing || storeLoading ? (
          <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <GrytLogo className="mx-auto" />
              <LoadingSpinner size="lg" text="Preparing your journey..." />
            </div>
          </div>
        ) : error ? (
          <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <HomePageComponent />
        )}
      </Suspense>
    </AppInitializer>
  )
}
