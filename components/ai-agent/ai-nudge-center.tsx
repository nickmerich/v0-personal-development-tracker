"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Brain, CheckCircle, Clock, MessageSquare, TrendingUp, Zap, Star, Target, Calendar } from "lucide-react"
import { aiAgentService, type Nudge, type AIInsight } from "@/lib/ai-agent-service"
import { cn } from "@/lib/utils"

interface AINudgeCenterProps {
  userData: any
  onNudgeAction: (nudge: Nudge) => void
}

export function AINudgeCenter({ userData, onNudgeAction }: AINudgeCenterProps) {
  const [nudges, setNudges] = useState<Nudge[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("nudges")

  useEffect(() => {
    generateDailyContent()
  }, [userData])

  const generateDailyContent = async () => {
    setLoading(true)
    try {
      // Generate nudges and insights
      const dailyNudges = aiAgentService.generateDailyNudges(userData)
      const aiInsights = aiAgentService.generateInsights(userData)

      setNudges(dailyNudges)
      setInsights(aiInsights)
    } catch (error) {
      console.error("Error generating AI content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNudgeAction = async (nudge: Nudge) => {
    // Mark nudge as acknowledged
    setNudges((prev) => prev.map((n) => (n.id === nudge.id ? { ...n, acknowledged: true } : n)))

    // Trigger the action callback
    onNudgeAction(nudge)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return Clock
      case "encouragement":
        return Star
      case "insight":
        return Brain
      case "challenge":
        return Target
      case "reflection":
        return MessageSquare
      default:
        return Bell
    }
  }

  const unacknowledgedNudges = nudges.filter((n) => !n.acknowledged)
  const todaysNudges = nudges.filter((n) => {
    const today = new Date().toDateString()
    return new Date(n.timing.scheduledFor).toDateString() === today
  })

  if (loading) {
    return (
      <Card className="border-forest-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
          <span className="ml-3 text-stone-600">AI is preparing your personalized nudges...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-forest-800">Your AI Coach</h2>
          <p className="text-stone-600">Personalized guidance to keep you on track</p>
        </div>
        <Button variant="outline" size="sm" onClick={generateDailyContent}>
          <Zap className="h-4 w-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-forest-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-forest-100 rounded-lg">
                <Bell className="h-5 w-5 text-forest-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Active Nudges</p>
                <p className="text-xl font-bold text-forest-800">{unacknowledgedNudges.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-forest-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">AI Insights</p>
                <p className="text-xl font-bold text-forest-800">{insights.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-forest-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Progress Score</p>
                <p className="text-xl font-bold text-forest-800">
                  {Math.round((aiAgentService as any).calculateCompletionRate(userData) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-forest-100">
          <TabsTrigger value="nudges" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Smart Nudges
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="coaching" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Coach Chat
          </TabsTrigger>
        </TabsList>

        {/* Smart Nudges Tab */}
        <TabsContent value="nudges" className="space-y-4">
          {todaysNudges.length === 0 ? (
            <Card className="border-forest-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-forest-800 mb-2">All Caught Up!</h3>
                <p className="text-stone-600 text-center">
                  No active nudges right now. Your AI coach will send personalized reminders when you need them.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {todaysNudges.map((nudge) => {
                const IconComponent = getNudgeIcon(nudge.type)
                return (
                  <Card
                    key={nudge.id}
                    className={cn(
                      "border-forest-200 transition-all duration-200",
                      !nudge.acknowledged && "bg-forest-50/50 border-forest-300",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
                            <IconComponent className="h-5 w-5 text-forest-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-forest-800">{nudge.title}</h4>
                              <Badge className={getPriorityColor(nudge.priority)}>{nudge.priority}</Badge>
                              {!nudge.acknowledged && <div className="w-2 h-2 bg-forest-600 rounded-full" />}
                            </div>
                            <p className="text-stone-600 mb-3">{nudge.message}</p>
                            <div className="flex items-center gap-4 text-xs text-stone-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(nudge.timing.scheduledFor).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {nudge.context.category && (
                                <span className="bg-stone-100 px-2 py-1 rounded text-xs">{nudge.context.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {nudge.actionable && !nudge.acknowledged && (
                            <Button
                              onClick={() => handleNudgeAction(nudge)}
                              className="bg-forest-600 text-white hover:bg-forest-700"
                            >
                              Take Action
                            </Button>
                          )}
                          {nudge.acknowledged && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card className="border-forest-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-forest-800 mb-2">Building Insights</h3>
                <p className="text-stone-600 text-center">
                  As you use the app more, AI will generate personalized insights about your progress patterns.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="border-forest-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-forest-800 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        AI Insight
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            insight.impact === "high" && "bg-red-100 text-red-800",
                            insight.impact === "medium" && "bg-yellow-100 text-yellow-800",
                            insight.impact === "low" && "bg-blue-100 text-blue-800",
                          )}
                        >
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline">{Math.round(insight.confidence * 100)}% confidence</Badge>
                      </div>
                    </div>
                    <CardDescription>{insight.insight}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-forest-800 mb-2">Recommended Actions:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-stone-600">
                          {insight.actionItems.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-forest-800 mb-2">Based On:</h4>
                        <div className="flex flex-wrap gap-2">
                          {insight.dataPoints.map((point, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* AI Coach Chat Tab */}
        <TabsContent value="coaching" className="space-y-4">
          <Card className="border-forest-200">
            <CardHeader>
              <CardTitle className="text-forest-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-forest-600" />
                AI Coaching Sessions
              </CardTitle>
              <CardDescription>Have personalized conversations with your AI coach for deeper guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Calendar className="h-6 w-6" />
                  <span>Daily Check-in</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Target className="h-6 w-6" />
                  <span>Goal Review</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <TrendingUp className="h-6 w-6" />
                  <span>Habit Analysis</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Zap className="h-6 w-6" />
                  <span>Motivation Boost</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
