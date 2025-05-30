"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mountain, Flag, Compass, ClipboardCheck, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function GettingStarted() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: "intro",
      title: "🏁 Getting Started: Set Your Basecamp",
      subtitle: "This isn't a to-do list. This is your mountain.",
      content: (
        <div className="space-y-4">
          <p className="text-forest-800 text-lg">
            Welcome to The Gryt — your 90-day ascent toward real, earned confidence. No fluff. No shortcuts. Just daily
            discipline and a clear summit to chase.
          </p>
          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentStep(1)}
              className="bg-forest-600 hover:bg-forest-700 text-white font-medium"
            >
              Begin Your Climb <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "choose-mountain",
      icon: <Mountain className="h-8 w-8 text-forest-600" />,
      title: "🧗 Step 1: Choose Your Mountain",
      subtitle: "What's your 90-day summit?",
      content: (
        <div className="space-y-4">
          <p className="text-forest-700">
            Is it running a marathon? Losing 20 pounds? Making $25K? Staying sober? Pick one mission. Name it. Own it.
          </p>
          <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
            <h4 className="font-medium text-forest-800 mb-2">Summit Examples:</h4>
            <ul className="text-sm text-forest-700 space-y-1">
              <li>• "Complete a marathon in under 4 hours"</li>
              <li>• "Reach $10K monthly revenue in my business"</li>
              <li>• "Achieve 90 days of complete sobriety"</li>
              <li>• "Lose 30 pounds and maintain for 2 weeks"</li>
            </ul>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(0)}
              variant="outline"
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              className="bg-forest-600 hover:bg-forest-700 text-white font-medium"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "trail-map",
      icon: <Compass className="h-8 w-8 text-forest-600" />,
      title: "🧭 Step 2: Build Your Trail Map",
      subtitle: "Set your commitments across 6 categories:",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 flex items-center gap-2">
              <span className="text-xl">🙏</span>
              <span className="font-medium text-forest-800">Spiritual</span>
            </div>
            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 flex items-center gap-2">
              <span className="text-xl">💪</span>
              <span className="font-medium text-forest-800">Physical</span>
            </div>
            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <span className="font-medium text-forest-800">Mental</span>
            </div>
            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <span className="font-medium text-forest-800">Nutritional</span>
            </div>
            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 flex items-center gap-2">
              <span className="text-xl">💼</span>
              <span className="font-medium text-forest-800">Professional</span>
            </div>
            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200 flex items-center gap-2">
              <span className="text-xl">👨‍👩‍👧‍👦</span>
              <span className="font-medium text-forest-800">Family</span>
            </div>
          </div>
          <p className="text-forest-700">
            These are your daily footholds. One slip doesn't break the climb—quitting does.
          </p>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              className="bg-forest-600 hover:bg-forest-700 text-white font-medium"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "milestones",
      icon: <Flag className="h-8 w-8 text-forest-600" />,
      title: "🪜 Step 3: Mark Your Milestones",
      subtitle: "Plot elevation checkpoints along the way:",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="p-3 bg-earth-50 rounded-lg border border-earth-200 flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="font-medium text-earth-800">Revenue goal</span>
            </div>
            <div className="p-3 bg-earth-50 rounded-lg border border-earth-200 flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="font-medium text-earth-800">Streak target</span>
            </div>
            <div className="p-3 bg-earth-50 rounded-lg border border-earth-200 flex items-center gap-2">
              <span className="text-xl">🏃</span>
              <span className="font-medium text-earth-800">Distance run</span>
            </div>
            <div className="p-3 bg-earth-50 rounded-lg border border-earth-200 flex items-center gap-2">
              <span className="text-xl">🧊</span>
              <span className="font-medium text-earth-800">Days sober</span>
            </div>
            <div className="p-3 bg-earth-50 rounded-lg border border-earth-200 flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <span className="font-medium text-earth-800">Weight goal</span>
            </div>
          </div>
          <p className="text-forest-700">Track them visually. Adjust when necessary—but don't stop climbing.</p>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              className="bg-forest-600 hover:bg-forest-700 text-white font-medium"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "contract",
      icon: <ClipboardCheck className="h-8 w-8 text-forest-600" />,
      title: "🔒 Step 4: Lock In Your Contract",
      subtitle: "Sign your 90-day commitment.",
      content: (
        <div className="space-y-4">
          <p className="text-forest-700">
            This is your pact—with yourself. It's not motivation that gets you to the summit. It's the decision to climb
            when it sucks.
          </p>
          <div className="p-4 bg-forest-50 rounded-lg border border-forest-200">
            <h4 className="font-medium text-forest-800 mb-2">Your Contract:</h4>
            <p className="text-sm text-forest-700 italic">
              "I commit to showing up daily for 90 days. I will complete my non-negotiables, track my progress honestly,
              and push through resistance. I understand that this journey requires consistency and discipline. I am
              responsible for my own climb."
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(3)}
              variant="outline"
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(5)}
              className="bg-forest-600 hover:bg-forest-700 text-white font-medium"
            >
              I Commit <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "start",
      icon: <Mountain className="h-8 w-8 text-forest-600" />,
      title: "📈 Step 5: Start Your Ascent",
      subtitle: "Today is Day 1.",
      content: (
        <div className="space-y-4">
          <p className="text-forest-700">
            Check in. Track your progress. Say your affirmations. Move with intent.
            <br />
            One day at a time, one step closer. Welcome to the climb.
          </p>
          <div className="p-4 bg-earth-50 rounded-lg border border-earth-200">
            <h4 className="font-medium text-earth-800 mb-2">Remember:</h4>
            <p className="text-sm text-earth-700">
              "The mountain doesn't care about your excuses. Neither should you. Every step up builds the life you
              want."
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentStep(4)}
              variant="outline"
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              Back
            </Button>
            <Button
              onClick={() => router.push("/setup/personal-info")}
              className="bg-forest-600 hover:bg-forest-700 text-white font-medium"
            >
              Begin Setup <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-forest-600" />
            <h1 className="text-3xl font-bold text-forest-800">The Gryt</h1>
          </div>
        </div>

        <Card className="border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Progress Steps */}
              {currentStep > 0 && (
                <div className="flex justify-between mb-6">
                  {steps.slice(1).map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "flex flex-col items-center",
                        index + 1 < currentStep ? "text-forest-600" : "text-stone-400",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          index + 1 < currentStep
                            ? "bg-forest-100 border-2 border-forest-500"
                            : index + 1 === currentStep
                              ? "bg-forest-500 text-white"
                              : "bg-stone-100 border border-stone-300",
                        )}
                      >
                        {index + 1}
                      </div>
                      <div className="hidden sm:block text-xs mt-1">{step.id.split("-").join(" ")}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step Content */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {currentStepData.icon}
                  <h2 className="text-2xl font-bold text-forest-800">{currentStepData.title}</h2>
                </div>
                <p className="text-forest-600 font-medium mb-6">{currentStepData.subtitle}</p>
                {currentStepData.content}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
