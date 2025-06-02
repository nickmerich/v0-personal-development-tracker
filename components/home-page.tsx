"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mountain, ArrowRight, Target, BarChart3, Calendar, Zap } from "lucide-react"
import { GrytLogo } from "@/components/gryt-logo"

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/setup/personal-info")
  }

  const handleLearnMore = () => {
    router.push("/getting-started")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-forest-600/10 to-forest-800/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8">
              <GrytLogo className="mx-auto mb-4" />
              <h1 className="text-4xl lg:text-6xl font-bold text-forest-900 mb-4">The Gryt</h1>
              <p className="text-xl lg:text-2xl text-forest-700 font-medium">
                Transform your life with purpose-driven daily actions
              </p>
            </div>

            {/* Main CTA */}
            <div className="mb-12 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  onClick={handleLearnMore}
                  size="lg"
                  variant="outline"
                  className="border-2 border-forest-600 text-forest-600 hover:bg-forest-50 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  Learn How It Works
                </Button>
              </div>

              <p className="text-forest-600 text-sm">⚡ Quick setup • 🏔️ 90-day journey • 🎯 Proven results</p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-forest-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-forest-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-forest-900 mb-2">Goal Setting</h3>
                  <p className="text-forest-700 text-sm">Define your summit and create actionable daily tasks</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-forest-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-forest-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-forest-900 mb-2">Progress Analytics</h3>
                  <p className="text-forest-700 text-sm">Track your elevation gain with detailed insights</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-forest-200 hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-forest-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-forest-900 mb-2">Daily Accountability</h3>
                  <p className="text-forest-700 text-sm">Stay consistent with smart reminders and check-ins</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white/50 backdrop-blur-sm border-y border-forest-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-forest-800">90</div>
              <div className="text-sm text-forest-600">Day Journey</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-forest-800">6</div>
              <div className="text-sm text-forest-600">Core Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-forest-800">∞</div>
              <div className="text-sm text-forest-600">Possibilities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-forest-800">
                <Zap className="h-6 w-6 inline" />
              </div>
              <div className="text-sm text-forest-600">Fast Setup</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary CTA */}
      <div className="bg-forest-600 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Climb?</h2>
          <p className="text-forest-100 mb-6 text-lg">
            Join thousands who have transformed their lives through intentional daily action
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            variant="outline"
            className="bg-white text-forest-600 hover:bg-forest-50 border-white px-8 py-3"
          >
            Begin Setup
            <Mountain className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-forest-800 text-forest-200 py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-6 w-6" />
            <span className="text-xl font-bold">The Gryt</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} The Gryt. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
