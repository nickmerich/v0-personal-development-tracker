"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Target, Sparkles, ArrowRight, TrendingUp, Star, Play, Mountain, Zap, Brain, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout"
import Image from "next/image"

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
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
        <div className="animate-pulse">
          <Mountain className="h-12 w-12 text-forest-600" />
        </div>
      </div>
    )
  }

  if (isUserSetup) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-stone-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-12">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-forest-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-200/40 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-forest-100/20 to-stone-100/20 rounded-full blur-3xl" />
        </div>

        <MobileLayout maxWidth="xl" className="relative z-10">
          <div className="text-center space-y-8 animate-in">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge className="bg-forest-100 text-forest-800 border-forest-200 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Transform Your Life in 90 Days
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-forest-900 leading-tight">
                Your Journey to
                <span className="block bg-gradient-to-r from-forest-600 to-forest-800 bg-clip-text text-transparent">
                  Greatness
                </span>
                Starts Today
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Build lasting habits, track meaningful progress, and unlock the greatness within you.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <MobileButton
                size="lg"
                onClick={() => router.push("/setup/personal-info")}
                className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-64 sm:w-72"
              >
                <Mountain className="w-5 h-5 mr-2" />
                Start Your Transformation
                <ArrowRight className="w-5 h-5 ml-2" />
              </MobileButton>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-forest-300 text-forest-700 hover:bg-forest-50 min-h-[56px] w-64 sm:w-72"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span>Join 10,000+ people transforming their lives</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>
        </MobileLayout>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <MobileLayout>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Powerful tools designed to make personal transformation simple, engaging, and sustainable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <MobileCard
                key={feature.title}
                interactive
                className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-forest-100 to-forest-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-forest-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-forest-900">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileLayout>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-forest-50">
        <MobileLayout>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Join thousands who have transformed their lives with our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <MobileCard className="overflow-hidden border-forest-200">
              <div className="flex flex-col md:flex-row gap-6 p-2 md:p-6">
                <div className="md:w-1/3 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-forest-100 mb-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonial-1732703063632.jpg-rlNPgokwCGh09x3yYjXqip6KzFBt1l.jpeg"
                      alt="Garrett Hughes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-forest-900">Garrett Hughes</h3>
                  <p className="text-sm text-stone-600 mt-1">
                    Co-founder @ Mint Songs (acquired Napster) / Engineering Leader @ Dune Analytics
                  </p>
                </div>

                <div className="md:w-2/3 flex items-center">
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 w-8 h-8 text-forest-200 rotate-180" />
                    <blockquote className="text-lg md:text-xl text-forest-800 italic leading-relaxed pl-6">
                      "Nick's leadership in our team was inspiring and encouraged us to achieve our best potential. He
                      was responsible for community development, where he demonstrated an innate ability to build,
                      nurture and grow communities that still thrive today."
                    </blockquote>
                    <Quote className="absolute -bottom-4 -right-4 w-8 h-8 text-forest-200" />
                  </div>
                </div>
              </div>
            </MobileCard>
          </div>
        </MobileLayout>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-forest-600 to-forest-700">
        <MobileLayout>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
                <div className="text-forest-100 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </MobileLayout>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-stone-50 to-forest-50">
        <MobileLayout>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">Your Path to Transformation</h2>
            <p className="text-lg text-stone-600">Simple steps, powerful results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-forest-300 to-transparent z-0" />
                )}

                <MobileCard className="relative z-10 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-forest-600 to-forest-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-forest-900">{step.title}</h3>
                    <p className="text-stone-600">{step.description}</p>
                  </div>
                </MobileCard>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <MobileButton
              size="lg"
              onClick={() => router.push("/setup/personal-info")}
              className="bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-800"
            >
              <Zap className="w-5 h-5 mr-2" />
              Begin Your Journey Now
            </MobileButton>
          </div>
        </MobileLayout>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-forest-900 to-forest-800 text-white">
        <MobileLayout className="text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              Ready to Transform
              <span className="block text-forest-200">Your Life?</span>
            </h2>

            <p className="text-xl text-forest-100 max-w-2xl mx-auto">
              Join thousands who've already started their journey to becoming extraordinary.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <MobileButton
                size="lg"
                onClick={() => router.push("/setup/personal-info")}
                className="bg-white text-forest-900 hover:bg-forest-50 w-64 sm:w-72"
              >
                <Mountain className="w-5 h-5 mr-2" />
                Start Free Today
              </MobileButton>

              <p className="text-sm text-forest-200">No credit card required • 90-day transformation guarantee</p>
            </div>
          </div>
        </MobileLayout>
      </section>
    </div>
  )
}

// Data
const features = [
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set meaningful goals and track your progress with visual milestones that keep you motivated.",
  },
  {
    icon: Brain,
    title: "Habit Building",
    description: "Build lasting habits with proven templates and personalized recommendations.",
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Understand your patterns with detailed insights and celebrate your growth journey.",
  },
]

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "90%", label: "Success Rate" },
  { value: "2M+", label: "Goals Achieved" },
  { value: "4.9★", label: "User Rating" },
]

const steps = [
  {
    title: "Define Your Vision",
    description: "Set your big goal and connect with your deeper purpose for lasting motivation.",
  },
  {
    title: "Build Your Plan",
    description: "Choose from proven templates or create custom habits that align with your goals.",
  },
  {
    title: "Track & Transform",
    description: "Monitor your progress, celebrate wins, and adjust your path to success.",
  },
]
