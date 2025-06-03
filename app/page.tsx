"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Calendar, Trophy, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { GrytLogo } from "@/components/gryt-logo"
import { AuthModal } from "@/components/auth-modal"
import { useSimpleAuth } from "@/components/simple-auth-provider"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Page() {
  const router = useRouter()
  const { isAuthenticated, user } = useSimpleAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simple loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/setup/personal-info")
    }
  }

  const handleSignIn = () => {
    setShowAuthModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-green-700 font-medium">Loading The Gryt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GrytLogo
              size="sm"
              variant="seamless"
              priority
              className="transition-transform duration-200 hover:scale-105"
            />
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:inline">Welcome back, {user?.name}!</span>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-green-600 hover:bg-green-700 shadow-sm"
                  size="sm"
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={handleSignIn}
                className="border-green-200 text-green-700 hover:bg-green-50 shadow-sm"
                size="sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Best Self in <span className="text-green-600">90 Days</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create lasting change through consistent daily actions. Track meaningful habits, achieve your goals, and
              unlock the potential you know is within you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/test-journey")}
              className="text-lg px-8 py-4 border-green-200 text-green-700 hover:bg-green-50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Take a Test Drive
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
              <CardHeader className="pb-4">
                <Target className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <CardTitle className="text-lg text-gray-800">Clear Direction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Set meaningful goals and break them into actionable daily steps that build momentum over time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
              <CardHeader className="pb-4">
                <Calendar className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <CardTitle className="text-lg text-gray-800">Daily Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Track your habits and see your consistency build day by day with visual progress indicators.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
              <CardHeader className="pb-4">
                <Trophy className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <CardTitle className="text-lg text-gray-800">Milestone Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Celebrate your wins with achievement badges and milestone tracking that keeps you motivated.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
              <CardHeader className="pb-4">
                <div className="h-10 w-10 text-green-600 mx-auto mb-3 flex items-center justify-center text-2xl">
                  🎯
                </div>
                <CardTitle className="text-lg text-gray-800">Personal Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Focus on what matters most to you across all areas of life - health, relationships, career, and more.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced CTA */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-green-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              <span className="inline-block mr-2">🌟</span> Ready to Begin Your 90-Day Journey?
            </h3>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              Transform your life through consistent action. Build the habits that create lasting change, one day at a
              time.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          router.push("/dashboard")
        }}
      />
    </div>
  )
}
