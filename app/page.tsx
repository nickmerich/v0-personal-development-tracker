"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mountain, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has already completed setup
    const userData = localStorage.getItem("userData")
    if (userData) {
      const parsedData = JSON.parse(userData)
      if (parsedData.setupCompleted) {
        router.push("/dashboard")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-forest-800 to-forest-900 text-white">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Mountain className="h-10 w-10" />
              <h1 className="text-4xl md:text-5xl font-bold">The Gryt</h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Go All In for 90 Days. See What Happens!</h2>
            <p className="text-lg md:text-xl mb-8 text-forest-100">
              This isn't a to-do list. This is your mountain. Track your daily discipline. Build momentum. Reach your
              summit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push("/getting-started")}
                size="lg"
                className="bg-earth-500 hover:bg-earth-600 text-white font-medium px-8"
              >
                Learn How It Works <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => router.push("/setup/personal-info")}
                size="lg"
                variant="outline"
                className="border-2 border-white/70 text-white hover:bg-white/10 font-medium px-8"
              >
                Start Your Climb
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-forest-800 mb-12">Your 90-Day Mountain</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-forest-100">
            <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🏔️</span>
            </div>
            <h3 className="text-xl font-bold text-forest-800 mb-2">Daily Discipline</h3>
            <p className="text-stone-600">
              Track your non-negotiables across 6 core categories. Build momentum through consistency.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-forest-100">
            <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🚩</span>
            </div>
            <h3 className="text-xl font-bold text-forest-800 mb-2">Plant Your Flags</h3>
            <p className="text-stone-600">
              Set clear milestones along your journey. Track your progress visually as you climb.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-forest-100">
            <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-xl font-bold text-forest-800 mb-2">Mental Fuel</h3>
            <p className="text-stone-600">
              Power your climb with daily affirmations. Stay locked in when motivation fades.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-forest-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Climb?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            The summit is earned, not given. Lock in your 90-day commitment and start building the life you want.
          </p>
          <Button
            onClick={() => router.push("/getting-started")}
            size="lg"
            className="bg-earth-500 hover:bg-earth-600 text-white font-medium px-8"
          >
            Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-forest-900 text-forest-200 py-8">
        <div className="container mx-auto px-4 text-center">
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
