"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mountain, Target, Calendar, Trophy, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { GrytLogo } from "@/components/gryt-logo"
import { AuthModal } from "@/components/auth-modal"
import { useSimpleAuth } from "@/components/simple-auth-provider"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useSimpleAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GrytLogo className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-gray-900">The Gryt</h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome back, {user?.name}!</span>
                <Button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-700">
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={handleSignIn}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your Life in <span className="text-green-600">90 Days</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands who've conquered their mountains. Track habits, achieve goals, and become the person you've
              always wanted to be.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button onClick={handleGetStarted} size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/test-journey")}
              className="text-lg px-8 py-4"
            >
              Take a Test Drive
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mountain className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Mountain Metaphor</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every goal is a mountain to climb. Break it down into manageable steps and reach the summit.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Smart Goal Setting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set SMART goals and track your progress with our intuitive milestone system.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Daily Habits</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Build lasting habits with daily tracking and smart reminders that adapt to your schedule.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-lg">Achievement System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn badges, celebrate milestones, and stay motivated with our gamified progress system.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Community</h3>
            <p className="text-gray-600 mb-6">
              Thousands of people are already transforming their lives with The Gryt. Start your 90-day journey today.
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">50K+</div>
                <div className="text-sm text-gray-600">Goals Achieved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
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
