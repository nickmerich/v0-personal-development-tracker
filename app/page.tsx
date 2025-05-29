"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Target, ArrowRight, TrendingUp, Star, Mountain, Brain, Quote, Users, Flame } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse">
          <Mountain className="h-12 w-12 text-emerald-600" />
        </div>
      </div>
    )
  }

  if (isUserSetup) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background.png"
            alt="Forest path representing the journey to transformation"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content Overlay */}
        <MobileLayout maxWidth="4xl" className="relative z-10 px-4 py-12">
          <div className="text-center space-y-8 animate-in">
            {/* Main Heading - Following brand typography */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl font-display">
                Transform Your Life
                <span className="block text-white/90">in 90 Days</span>
              </h1>

              <h2 className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-medium leading-relaxed drop-shadow-lg">
                Your Journey to Greatness Starts Today
              </h2>
            </div>

            {/* CTA Button - Following brand button style */}
            <div className="pt-8">
              <MobileButton
                size="lg"
                onClick={() => router.push("/setup/personal-info")}
                className="bg-white text-gray-900 hover:bg-white/90 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4 h-auto font-semibold rounded-2xl"
              >
                <Mountain className="w-6 h-6 mr-3" />
                Start Your Transformation
                <ArrowRight className="w-6 h-6 ml-3" />
              </MobileButton>
            </div>

            {/* Social Proof - Enhanced with brand colors */}
            <div className="pt-12">
              <div className="flex flex-col items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-500/40 border-2 border-white/50 flex items-center justify-center text-white text-sm font-bold backdrop-blur-sm"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-lg font-medium drop-shadow-lg">
                    Join 10,000+ people on their transformation journey
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                  ))}
                  <span className="ml-2 text-lg font-medium drop-shadow-lg">4.9/5 from 2,000+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </MobileLayout>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section - Updated with brand colors */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <MobileLayout>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed to make personal transformation simple, engaging, and sustainable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <MobileCard
                key={feature.title}
                interactive
                className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-emerald-100"
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 font-display">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileLayout>
      </section>

      {/* Testimonial Section - Updated with brand styling */}
      <section className="py-20 bg-emerald-50">
        <MobileLayout>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands who have transformed their lives with our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <MobileCard className="overflow-hidden border-emerald-200 bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-6 p-2 md:p-6">
                <div className="md:w-1/3 flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-emerald-100 mb-4">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonial-1732703063632.jpg-rlNPgokwCGh09x3yYjXqip6KzFBt1l.jpeg"
                      alt="Garrett Hughes"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 font-display">Garrett Hughes</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Co-founder @ Mint Songs (acquired Napster) / Engineering Leader @ Dune Analytics
                  </p>
                </div>

                <div className="md:w-2/3 flex items-center">
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 w-8 h-8 text-emerald-200 rotate-180" />
                    <blockquote className="text-lg md:text-xl text-gray-800 italic leading-relaxed pl-6">
                      "Nick's leadership in our team was inspiring and encouraged us to achieve our best potential. He
                      was responsible for community development, where he demonstrated an innate ability to build,
                      nurture and grow communities that still thrive today."
                    </blockquote>
                    <Quote className="absolute -bottom-4 -right-4 w-8 h-8 text-emerald-200" />
                  </div>
                </div>
              </div>
            </MobileCard>
          </div>
        </MobileLayout>
      </section>

      {/* Stats Section - Matching brand guidelines exactly */}
      <section className="py-20 relative overflow-hidden">
        {/* Brand-consistent gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600"></div>

        <MobileLayout className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center font-display">
              ⚡ Impact in Numbers
            </h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsNew.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/20 border border-white/20"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full ${stat.iconBg} flex items-center justify-center`}>
                    <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="text-4xl font-extrabold text-white mb-2 font-display">{stat.value}</div>
                <div className="text-lg text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </MobileLayout>
      </section>

      {/* How It Works - Updated with brand styling */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <MobileLayout>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 font-display">
              Your Path to Transformation
            </h2>
            <p className="text-lg text-gray-600">Simple steps, powerful results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-300 to-transparent z-0" />
                )}

                <MobileCard className="relative z-10 text-center bg-white/80 backdrop-blur-sm border border-emerald-100">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 font-display">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </MobileCard>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <MobileButton
              size="lg"
              onClick={() => router.push("/setup/personal-info")}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl"
            >
              ⚡ Begin Your Journey Now
            </MobileButton>
          </div>
        </MobileLayout>
      </section>

      {/* Final CTA - Matching brand guidelines exactly */}
      <section className="py-20 bg-emerald-600 text-white">
        <MobileLayout className="text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight font-display">
              Ready to Transform
              <span className="block text-emerald-200">Your Life?</span>
            </h2>

            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Join thousands who've already started their journey to becoming extraordinary.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <MobileButton
                size="lg"
                onClick={() => router.push("/setup/personal-info")}
                className="bg-white text-gray-900 hover:bg-gray-50 rounded-2xl font-semibold"
              >
                <Mountain className="w-5 h-5 mr-2" />
                Start Free Today
              </MobileButton>

              <p className="text-sm text-emerald-200">No credit card required • 90-day transformation guarantee</p>
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

// Updated stats with brand-consistent styling
const statsNew = [
  {
    value: "10,000+",
    label: "Active Users",
    icon: Users,
    iconColor: "text-blue-300",
    iconBg: "bg-blue-300/20",
  },
  {
    value: "90%",
    label: "Success Rate",
    icon: Flame,
    iconColor: "text-orange-300",
    iconBg: "bg-orange-300/20",
  },
  {
    value: "2 Million+",
    label: "Goals Achieved",
    icon: Target,
    iconColor: "text-green-300",
    iconBg: "bg-green-300/20",
  },
  {
    value: "4.9 / 5",
    label: "User Rating",
    icon: Star,
    iconColor: "text-yellow-300",
    iconBg: "bg-yellow-300/20",
  },
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
