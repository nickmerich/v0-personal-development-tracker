"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Homepage() {
  const router = useRouter()
  const [isUserSetup, setIsUserSetup] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if user is already set up
    try {
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedData = JSON.parse(userData)
        if (parsedData.setupCompleted) {
          setIsUserSetup(true)
          // Redirect to dashboard if already set up
          router.push("/dashboard")
          return
        }
      }
    } catch (error) {
      console.error("Error checking user setup:", error)
    }

    setIsLoaded(true)
  }, [router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 rounded-full bg-white/30"></div>
        </div>
      </div>
    )
  }

  if (isUserSetup) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Orange Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"></div>

      {/* Green Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/80 via-emerald-600/70 to-teal-600/80"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 py-12">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center space-y-6">
            {/* Main Header */}
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-none tracking-tight font-display">
              LIVE YOUR
              <span className="block text-yellow-300 drop-shadow-lg">DREAM</span>
            </h1>

            {/* Subheader */}
            <h2 className="text-lg sm:text-xl text-white/95 font-medium leading-relaxed max-w-sm mx-auto">
              30-60-90 Day Transformation platform to lock in on life and achieve your goals.
            </h2>

            {/* CTA Buttons */}
            <div className="pt-6 space-y-4">
              {/* Primary CTA */}
              <Button
                onClick={() => router.push("/setup/personal-info")}
                className="bg-white text-emerald-700 hover:bg-white/90 shadow-lg w-full sm:w-auto px-8 py-3 h-auto font-bold rounded-xl text-lg"
              >
                Start Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Secondary Sign In Option */}
              <div className="flex items-center justify-center">
                <span className="text-white/80 text-sm mr-2">Already have an account?</span>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-yellow-300 hover:text-yellow-200 font-semibold text-sm underline underline-offset-2 transition-colors duration-200"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-10">
              <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-full py-3 px-4">
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D", "E"].map((letter, i) => (
                    <div
                      key={letter}
                      className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-white text-sm font-bold"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span className="text-sm sm:text-base font-medium text-white ml-2">
                  Join 15,000+ dreamers already transforming their lives
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
