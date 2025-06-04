"use client"

import { ArrowRight } from "lucide-react"

export default function ReferenceLandingPage() {
  return (
    <div className="min-h-screen bg-cream-bg relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="decorative-circle decorative-circle-yellow w-32 h-32 top-20 left-10 animate-float" />
      <div className="decorative-circle decorative-circle-green w-24 h-24 top-40 right-20" />
      <div className="decorative-circle w-16 h-16 bottom-32 left-1/4" />
      <div className="decorative-circle decorative-circle-yellow w-20 h-20 bottom-20 right-1/3" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Top Badge */}
        <div className="mb-12 animate-fade-in">
          <div className="pill-button inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Transform Your Life Through Daily Habits!
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-navy-text leading-tight mb-4">
            Build Habits That
          </h1>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black gradient-text leading-tight">Change Everything</h1>
        </div>

        {/* Description */}
        <div className="mb-8 max-w-4xl animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="text-lg md:text-xl text-gray-text leading-relaxed">
            🚀 Track habits from all your apps in one place. 📊 Get AI-powered insights. 💪 See real results in 90 days.
          </p>
        </div>

        {/* Transformation Message */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <p className="text-lg md:text-xl text-green-primary font-medium">
            ✨ Your transformation starts with one habit!
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <button className="pill-button inline-flex items-center gap-2 text-base px-8 py-4">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Start Building Habits
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Statistics */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-4xl animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-green-primary mb-2">50+</div>
            <div className="text-gray-text font-medium">App Integrations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-blue-primary mb-2">90</div>
            <div className="text-gray-text font-medium">Days to Results</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-purple-primary mb-2">1</div>
            <div className="text-gray-text font-medium">Unified Platform</div>
          </div>
        </div>
      </div>
    </div>
  )
}
