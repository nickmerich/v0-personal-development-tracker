"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mountain, Flag, Compass, ClipboardCheck, ArrowRight, ArrowLeft, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default function GettingStarted() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const handleBeginSetup = () => {
    // Clear any existing setup data to start fresh
    localStorage.removeItem("userData")
    // Navigate to the actual setup flow
    router.push("/setup/personal-info")
  }

  const steps = [
    {
      id: "intro",
      title: "Getting Started: Set Your Basecamp",
      subtitle: "This isn't a to-do list. This is your mountain.",
      content: (
        <div className="space-y-6">
          <p className="text-gray-800 text-lg leading-relaxed">
            Welcome to The Gryt — your 90-day ascent toward real, earned confidence. No fluff. No shortcuts. Just daily
            discipline and a clear summit to chase.
          </p>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-2">What You'll Learn:</h4>
            <ul className="text-gray-700 space-y-1 text-sm list-disc list-inside">
              <li>How to choose your 90-day summit goal</li>
              <li>Setting up your daily trail map across 6 categories</li>
              <li>Marking milestones to track your elevation</li>
              <li>Signing your commitment contract</li>
              <li>Starting your ascent with confidence</li>
            </ul>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentStep(1)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
              aria-label="Begin Your Climb, go to next step"
            >
              Begin Your Climb <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "choose-mountain",
      icon: <Mountain className="h-8 w-8 text-green-600" />,
      title: "Step 1: Choose Your Mountain",
      subtitle: "What's your 90-day summit?",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">
            Is it running a marathon? Losing 20 pounds? Making $25K? Staying sober? Pick one mission. Name it. Own it.
          </p>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-gray-800 mb-3">Summit Examples:</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 p-3 bg-white rounded border border-green-100 shadow-sm">
                <span className="text-xl">🏃‍♂️</span>
                <span className="text-sm text-gray-700">"Complete a marathon in under 4 hours"</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded border border-green-100 shadow-sm">
                <span className="text-xl">💰</span>
                <span className="text-sm text-gray-700">"Reach $10K monthly revenue in my business"</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded border border-green-100 shadow-sm">
                <span className="text-xl">🧊</span>
                <span className="text-sm text-gray-700">"Achieve 90 days of complete sobriety"</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded border border-green-100 shadow-sm">
                <span className="text-xl">⚖️</span>
                <span className="text-sm text-gray-700">"Lose 30 pounds and maintain for 2 weeks"</span>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-orange-800 font-medium text-sm">
              💡 Pro Tip: Your summit should be specific, measurable, and challenging but achievable in 90 days.
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(0)}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50 px-6 py-3"
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
              aria-label="Continue to next step"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "trail-map",
      icon: <Compass className="h-8 w-8 text-green-600" />,
      title: "Step 2: Build Your Trail Map",
      subtitle: "Set your commitments across 6 categories:",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">
            These are your daily footholds. One slip doesn't break the climb—quitting does.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "🙏", name: "Spiritual", desc: "Prayer, meditation, reflection" },
              { icon: "💪", name: "Physical", desc: "Exercise, movement, activity" },
              { icon: "🧠", name: "Mental", desc: "Learning, reading, growth" },
              { icon: "🥗", name: "Nutritional", desc: "Healthy eating, hydration" },
              { icon: "💼", name: "Professional", desc: "Career, business, skills" },
              { icon: "👨‍👩‍👧‍👦", name: "Family", desc: "Relationships, connection" },
            ].map((category) => (
              <div
                key={category.name}
                className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3 shadow-sm"
              >
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <span className="font-medium text-gray-800 block">{category.name}</span>
                  <span className="text-xs text-gray-600">{category.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-orange-800 font-medium text-sm">
              💡 Each category will have daily tasks that move you closer to your summit. Consistency beats perfection.
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50 px-6 py-3"
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
              aria-label="Continue to next step"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "milestones",
      icon: <Flag className="h-8 w-8 text-green-600" />,
      title: "Step 3: Mark Your Milestones",
      subtitle: "Plot elevation checkpoints along the way:",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">Track them visually. Adjust when necessary—but don't stop climbing.</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "💰", name: "Revenue goal", desc: "Track income milestones" },
              { icon: "🔥", name: "Streak target", desc: "Days without breaking habits" },
              { icon: "🏃", name: "Distance run", desc: "Cumulative miles or kilometers" },
              { icon: "🧊", name: "Days sober", desc: "Clean days counter" },
              { icon: "⚖️", name: "Weight goal", desc: "Pounds or kilograms lost/gained" },
            ].map((milestone) => (
              <div
                key={milestone.name}
                className="p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-center gap-3 shadow-sm"
              >
                <span className="text-2xl">{milestone.icon}</span>
                <div>
                  <span className="font-medium text-orange-800 block">{milestone.name}</span>
                  <span className="text-xs text-orange-600">{milestone.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium text-sm">
              💡 Milestones are your flags on the ridge. They show progress and keep you motivated during tough climbs.
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50 px-6 py-3"
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
              aria-label="Continue to next step"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "contract",
      icon: <ClipboardCheck className="h-8 w-8 text-green-600" />,
      title: "Step 4: Lock In Your Contract",
      subtitle: "Sign your 90-day commitment.",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">
            This is your pact—with yourself. It's not motivation that gets you to the summit. It's the decision to climb
            when it sucks.
          </p>
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-300 shadow-md">
            <h4 className="font-semibold text-gray-800 mb-4 text-center text-xl">Your Mountain Contract</h4>
            <div className="space-y-4 text-sm text-gray-700">
              <p className="italic leading-relaxed">
                "I commit to showing up daily for 90 days. I will complete my non-negotiables, track my progress
                honestly, and push through resistance. I understand that this journey requires consistency and
                discipline. I am responsible for my own climb."
              </p>
              <div className="pt-4 border-t border-green-200">
                <h5 className="font-medium text-gray-800 mb-2">I Understand:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li>The mountain doesn't care about my excuses</li>
                  <li>One slip doesn't break my climb—quitting does</li>
                  <li>Motivation is temporary, discipline is reliable</li>
                  <li>Every step up builds the life I want</li>
                  <li>The summit is earned, not given</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-orange-800 font-medium text-sm">
              💡 This contract will be available for download once you complete setup. Print it and keep it visible.
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50 px-6 py-3"
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={() => setCurrentStep(5)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3"
              aria-label="Accept contract and continue"
            >
              I Accept <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "start",
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Step 5: Start Your Ascent",
      subtitle: "Today is Day 1.",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 text-lg">
            Check in. Track your progress. Say your affirmations. Move with intent.
            <br />
            One day at a time, one step closer. Welcome to the climb.
          </p>
          <div className="p-6 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
            <h4 className="font-medium text-orange-800 mb-3 text-center">Your Daily Rhythm</h4>
            <div className="space-y-2 text-sm text-orange-700">
              {[
                "Morning: Review your daily footholds",
                "Throughout: Complete your non-negotiables",
                "Evening: Check in and track progress",
                "Reflect: Read your affirmations",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <p className="text-green-800 font-semibold text-md italic">
              "The mountain doesn't care about your excuses. Neither should you. Every step up builds the life you
              want."
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(4)}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50 px-6 py-3"
              aria-label="Go back to previous step"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleBeginSetup}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-4 text-lg"
              aria-label="Begin actual setup process"
            >
              Begin Setup <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-gray-100 to-orange-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <header className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <Mountain className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
            <h1 className="text-4xl sm:text-5xl font-black text-gray-800 tracking-tight">The Gryt</h1>
          </div>
        </header>

        <Card className="border-green-200 bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Progress Steps */}
              {currentStep > 0 && (
                <nav aria-label="Progress" className="flex justify-between mb-8">
                  {steps.slice(1).map((step, index) => (
                    <div key={step.id} className={cn("flex flex-col items-center flex-1 group")}>
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-all duration-300 ease-in-out",
                          index + 1 < currentStep
                            ? "bg-green-600 border-2 border-green-700 text-white" // Completed
                            : index + 1 === currentStep
                              ? "bg-green-500 text-white scale-110 ring-4 ring-green-200" // Current
                              : "bg-gray-200 border border-gray-300 text-gray-500 group-hover:bg-gray-300", // Future
                        )}
                      >
                        {index + 1}
                      </div>
                      <div
                        className={cn(
                          "hidden sm:block text-xs text-center font-medium transition-colors duration-300",
                          index + 1 < currentStep
                            ? "text-green-700"
                            : index + 1 === currentStep
                              ? "text-green-600 font-semibold"
                              : "text-gray-500 group-hover:text-gray-700",
                        )}
                      >
                        {step.title.replace(/Step \d+: /, "")} {/* Clean step title without "Step X:" */}
                      </div>
                    </div>
                  ))}
                </nav>
              )}

              {/* Step Content */}
              <section aria-labelledby={`step-title-${currentStepData.id}`}>
                <div className="flex items-start gap-4 mb-6">
                  {currentStepData.icon && (
                    <div className="flex-shrink-0 mt-1 text-green-500">{currentStepData.icon}</div>
                  )}
                  <div>
                    <h2
                      id={`step-title-${currentStepData.id}`}
                      className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1"
                    >
                      {currentStepData.title}
                    </h2>
                    <p className="text-green-600 font-medium text-md sm:text-lg">{currentStepData.subtitle}</p>
                  </div>
                </div>
                {currentStepData.content}
              </section>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-gray-600 text-sm">Ready to transform your life in 90 days? The mountain is waiting.</p>
        </footer>
      </div>
    </div>
  )
}
