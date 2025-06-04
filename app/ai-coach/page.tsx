"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Calendar, Target, TrendingUp, Zap, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { AICoachingChat } from "@/components/ai-agent/ai-coaching-chat"
import { AINudgeCenter } from "@/components/ai-agent/ai-nudge-center"
import type { AICoachingSession } from "@/lib/ai-agent-service"

const coachingTypes = [
  {
    type: "daily-checkin" as const,
    title: "Daily Check-in",
    description: "Quick review of your day and priorities",
    icon: Calendar,
    duration: 5,
    color: "bg-blue-500",
  },
  {
    type: "goal-review" as const,
    title: "Goal Review",
    description: "Analyze progress and adjust strategies",
    icon: Target,
    duration: 10,
    color: "bg-green-500",
  },
  {
    type: "habit-analysis" as const,
    title: "Habit Analysis",
    description: "Deep dive into your habit patterns",
    icon: TrendingUp,
    duration: 8,
    color: "bg-purple-500",
  },
  {
    type: "motivation-boost" as const,
    title: "Motivation Boost",
    description: "Recharge your energy and motivation",
    icon: Zap,
    duration: 6,
    color: "bg-orange-500",
  },
  {
    type: "strategy-session" as const,
    title: "Strategy Session",
    description: "Plan and optimize your approach",
    icon: Settings,
    duration: 12,
    color: "bg-red-500",
  },
]

export default function AICoachPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<AICoachingSession["type"] | null>(null)
  const [showChat, setShowChat] = useState(false)

  const handleStartSession = (type: AICoachingSession["type"]) => {
    setSelectedType(type)
    setShowChat(true)
  }

  const handleSessionComplete = (session: AICoachingSession) => {
    setShowChat(false)
    setSelectedType(null)
    // Could show completion summary here
  }

  const handleBackToSelection = () => {
    setShowChat(false)
    setSelectedType(null)
  }

  if (showChat && selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button onClick={handleBackToSelection} variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sessions
            </Button>
          </div>

          <AICoachingChat sessionType={selectedType} onSessionComplete={handleSessionComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button onClick={() => router.push("/")} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-center gap-3">
            <Bot className="h-8 w-8 text-forest-600" />
            <h1 className="text-3xl font-bold text-forest-900">AI Coach</h1>
          </div>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Your personal AI coaching companion. Get personalized guidance, insights, and support to accelerate your
            personal development journey.
          </p>
        </div>

        {/* Nudge Center */}
        <AINudgeCenter />

        {/* Coaching Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Start a Coaching Session</CardTitle>
            <CardDescription>Choose the type of guidance you need right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coachingTypes.map((coaching) => {
                const Icon = coaching.icon
                return (
                  <Card
                    key={coaching.type}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                    onClick={() => handleStartSession(coaching.type)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${coaching.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <Badge variant="outline">{coaching.duration} min</Badge>
                      </div>
                      <CardTitle className="text-lg">{coaching.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-stone-600 mb-4">{coaching.description}</p>
                      <Button className="w-full" variant="outline">
                        Start Session
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your coaching history and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-stone-500">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent sessions. Start your first coaching session above!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
