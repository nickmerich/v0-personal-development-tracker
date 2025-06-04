"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, BarChart3, Zap, Target, CalendarClock } from "lucide-react"
import { GrytLogo } from "../components/gryt-logo"
import { TiltButton } from "./tilt-button"
import { ThreeDCard } from "./three-d-card"
import { ThreeDFeature } from "./three-d-feature"
import { ThreeDStatsCounter } from "./three-d-stats-counter"
import { ThreeDEffectField } from "./three-d-bubble-field"
import { ThreeDHeader } from "./three-d-header"

export default function DynamicHomePage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <main className="relative overflow-x-hidden" ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Background 3D bubble effect layer */}
      <ThreeDEffectField colorClass="bg-emerald-500" bubbleCount={12} minSize={100} maxSize={300} speed={0.3} />

      {/* 3D Animated Header */}
      <ThreeDHeader />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transform Your Life With GRYT</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our powerful tools help you track habits, set goals, and visualize your progress - all in one place.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <ThreeDFeature
              title="Habit Tracking Made Simple"
              description="Build lasting habits with our intuitive tracking system. Set goals, track progress, and celebrate victories along the way."
              icon={<CheckCircle2 className="w-16 h-16" />}
            />

            <ThreeDFeature
              title="Visualize Your Progress"
              description="Watch your growth with beautiful, interactive charts. Identify patterns and stay motivated with visual feedback."
              icon={<BarChart3 className="w-16 h-16" />}
              alignment="right"
            />

            <ThreeDFeature
              title="AI-Powered Coaching"
              description="Get personalized guidance and motivation from our AI coach. Receive tips tailored to your goals and habits."
              icon={<Zap className="w-16 h-16" />}
            />
          </div>
        </div>
      </section>

      {/* Stats Section with 3D counters */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-emerald-100 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming Lives</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Join thousands of people who have transformed their lives using our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <ThreeDStatsCounter value={5000} label="Active Users" prefix="+" color="emerald" />

            <ThreeDStatsCounter value={92} label="Completion Rate" suffix="%" color="blue" />

            <ThreeDStatsCounter value={180} label="Days Average Usage" color="purple" />

            <ThreeDStatsCounter value={24} label="Avg. Goals Achieved" color="amber" />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-24 relative">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Build Your Future</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our powerful tools help you achieve your goals and transform your life.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ThreeDCard className="p-8 h-full" depth={30}>
              <div className="flex flex-col h-full">
                <div className="mb-6 text-emerald-600">
                  <Target className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">Set Meaningful Goals</h3>
                <p className="text-slate-600 mb-6">
                  Define what matters most to you and create actionable steps to achieve your vision.
                </p>
                <div className="mt-auto">
                  <TiltButton className="mt-4">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </TiltButton>
                </div>
              </div>
            </ThreeDCard>

            <ThreeDCard className="p-8 h-full" depth={30}>
              <div className="flex flex-col h-full">
                <div className="mb-6 text-emerald-600">
                  <CalendarClock className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">Track Daily Progress</h3>
                <p className="text-slate-600 mb-6">
                  Monitor your habits and see your consistency build over time with our powerful tracking tools.
                </p>
                <div className="mt-auto">
                  <TiltButton className="mt-4">
                    Explore Features <ArrowRight className="ml-2 w-4 h-4" />
                  </TiltButton>
                </div>
              </div>
            </ThreeDCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-800 to-teal-900 text-white relative overflow-hidden">
        <ThreeDEffectField colorClass="bg-white" bubbleCount={8} minSize={80} maxSize={200} speed={0.2} />

        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Transform Your Life?</h2>
              <p className="text-emerald-100 text-lg mb-8">
                Join thousands of others who've already started their journey to personal growth.
              </p>
              <TiltButton size="lg" className="bg-white text-emerald-900 hover:bg-emerald-100 px-8 py-6 text-lg">
                Start Your Journey Today
              </TiltButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <GrytLogo className="h-10 w-auto" />
            </div>

            <div>
              <p>© 2025 GRYT. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cursor follower (subtle) */}
      <motion.div
        className="fixed w-40 h-40 rounded-full pointer-events-none bg-emerald-500 opacity-5 blur-3xl z-0"
        animate={{
          x: cursorPosition.x - 80,
          y: cursorPosition.y - 80,
        }}
        transition={{
          type: "spring",
          damping: 20,
          mass: 0.8,
        }}
      />
    </main>
  )
}
