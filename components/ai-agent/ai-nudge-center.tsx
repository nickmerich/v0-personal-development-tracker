"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Clock, Target, Lightbulb, Trophy } from "lucide-react"
import { aiAgentService, type AICoachingNudge } from "@/lib/ai-agent-service"

export function AINudgeCenter() {
  const [nudges, setNudges] = useState<AICoachingNudge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNudges()
  }, [])

  const loadNudges = async () => {
    try {
      setLoading(true)

      // Get existing nudges
      const existingNudges = aiAgentService.getNudges()

      // Generate new nudges if needed
      if (existingNudges.length < 3) {
        const newNudges = aiAgentService.generatePersonalizedNudges()
        aiAgentService.addNudges(newNudges)
        setNudges([...existingNudges, ...newNudges])
      } else {
        setNudges(existingNudges)
      }
    } catch (error) {
      console.error("Error loading nudges:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledgeNudge = (nudgeId: string) => {
    aiAgentService.acknowledgeNudge(nudgeId)
    setNudges((prev) => prev.filter((nudge) => nudge.id !== nudgeId))
  }

  const handleNudgeAction = (nudge: AICoachingNudge) => {
    if (nudge.actionUrl) {
      window.location.href = nudge.actionUrl
    }
    handleAcknowledgeNudge(nudge.id)
  }

  const getPriorityColor = (priority: AICoachingNudge["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getNudgeIcon = (type: AICoachingNudge["type"]) => {
    switch (type) {
      case "reminder":
        return <Clock className="h-4 w-4" />
      case "encouragement":
        return <Trophy className="h-4 w-4" />
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />
      case "milestone":
        return <Target className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            AI Nudge Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          AI Nudge Center
        </CardTitle>
        <CardDescription>Personalized insights and reminders to keep you on track</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {nudges.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-stone-600">You're all caught up! Great work staying on track.</p>
            <Button onClick={loadNudges} variant="outline" className="mt-4">
              Check for New Nudges
            </Button>
          </div>
        ) : (
          nudges.map((nudge) => (
            <div key={nudge.id} className="border rounded-lg p-4 space-y-3 hover:bg-stone-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getNudgeIcon(nudge.type)}
                  <h3 className="font-medium">{nudge.title}</h3>
                  <Badge variant="secondary" className={`${getPriorityColor(nudge.priority)} text-white`}>
                    {nudge.priority}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleAcknowledgeNudge(nudge.id)}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-stone-600">{nudge.message}</p>

              {nudge.actionText && (
                <Button onClick={() => handleNudgeAction(nudge)} className="w-full" variant="outline">
                  {nudge.actionText}
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
