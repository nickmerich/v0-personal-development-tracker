"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Brain,
  Zap,
  MessageSquare,
  Crown,
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react"
import { AINudgeCenter } from "@/components/ai-agent/ai-nudge-center"
import { SubscriptionUpgrade } from "@/components/ai-agent/subscription-upgrade"
import { AICoachingChat } from "@/components/ai-agent/ai-coaching-chat"
import { storage } from "@/lib/storage"
import type { CoachingSession, Nudge } from "@/lib/ai-agent-service"

export default function AICoachPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("nudges")
  const [currentSubscription, setCurrentSubscription] = useState<"free" | "premium" | "enterprise">("free")
  const [showChat, setShowChat] = useState(false)
  const [chatSessionType, setChatSessionType] = useState<CoachingSession["type"]>("daily_checkin")

  useEffect(() => {
    // Load user data
    const storedUserData = storage.getUserData()
    if (!storedUserData) {
      router.push("/")
      return
    }

    setUserData(storedUserData)

    // Load subscription status
    const subscription = localStorage.getItem("userSubscription") || "free"
    setCurrentSubscription(subscription as "free" | "premium" | "enterprise")

    setLoading(false)
  }, [router])

  const handleNudgeAction = (nudge: Nudge) => {
    console.log("Nudge action:", nudge)

    // Handle different nudge actions
    if (nudge.action) {
      switch (nudge.action.type) {
        case "complete_task":
          // Navigate to tasks or complete the task
          if (nudge.action.data?.category && nudge.action.data?.taskId) {
            router.push(`/tasks/${nudge.action.data.category}`)
          }
          break
        case "journal":
          // Open journal modal or navigate to journal
          router.push("/journal")
          break
        case "schedule":
          // Open calendar or scheduling interface
          router.push("/calendar")
          break
      }
    }
  }

  const handleUpgrade = async (tier: string, plan: string) => {
    console.log("Upgrading to:", tier, plan)

    // In a real app, this would integrate with payment processing
    if (tier === "premium") {
      localStorage.setItem("userSubscription", "premium")
      setCurrentSubscription("premium")
      alert("Successfully upgraded to Premium! 🎉")
    } else if (tier === "enterprise") {
      // Redirect to contact form or sales
      alert("Enterprise upgrade requires custom setup. Our team will contact you!")
    }
  }

  const handleStartCoaching = (sessionType: CoachingSession["type"]) => {
    setChatSessionType(sessionType)
    setShowChat(true)
  }

  const handleSessionComplete = (session: CoachingSession) => {
    console.log("Session completed:", session)
    setShowChat(false)

    // Save session to user data
    const updatedUserData = {
      ...userData,
      coachingSessions: [...(userData.coachingSessions || []), session],
    }
    setUserData(updatedUserData)
    storage.setUserData(updatedUserData)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading your AI coach...</p>
        </div>
      </div>
    )
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(false)}
              className="text-forest-600 hover:bg-forest-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-forest-800">AI Coaching Session</h1>
              <p className="text-stone-600">Get personalized guidance and support</p>
            </div>
          </div>

          <AICoachingChat userData={userData} sessionType={chatSessionType} onSessionComplete={handleSessionComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="text-forest-600 hover:bg-forest-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-forest-800">AI Coach</h1>
              {currentSubscription !== "free" && (
                <Badge className="bg-forest-600 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  {currentSubscription === "premium" ? "Pro" : "Enterprise"}
                </Badge>
              )}
            </div>
            <p className="text-stone-600">Your intelligent companion for personal growth</p>
          </div>
        </div>

        {/* Free Plan Upgrade Banner */}
        {currentSubscription === "free" && (
          <Card className="mb-6 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="font-semibold text-yellow-800">Unlock Full AI Coaching</h3>
                    <p className="text-sm text-yellow-700">
                      Get unlimited nudges, AI coaching sessions, and advanced insights
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab("upgrade")}
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                >
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-forest-100 mb-6">
            <TabsTrigger value="nudges" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              <Zap className="h-4 w-4 mr-2" />
              Smart Nudges
            </TabsTrigger>
            <TabsTrigger value="coaching" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Coaching
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="upgrade" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
            </TabsTrigger>
          </TabsList>

          {/* Smart Nudges Tab */}
          <TabsContent value="nudges">
            <AINudgeCenter userData={userData} onNudgeAction={handleNudgeAction} />
          </TabsContent>

          {/* AI Coaching Tab */}
          <TabsContent value="coaching" className="space-y-6">
            {currentSubscription === "free" ? (
              <Card className="border-forest-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-forest-800 flex items-center justify-center gap-2">
                    <MessageSquare className="h-6 w-6" />
                    AI Coaching Sessions
                  </CardTitle>
                  <CardDescription>Unlock personalized AI coaching to accelerate your growth</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-stone-600">
                    Upgrade to Premium to access unlimited AI coaching sessions with personalized guidance, motivational
                    support, and strategic insights.
                  </p>
                  <Button
                    onClick={() => setActiveTab("upgrade")}
                    className="bg-forest-600 text-white hover:bg-forest-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Unlock Coaching
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <Card className="border-forest-200">
                  <CardHeader>
                    <CardTitle className="text-forest-800">Choose Your Coaching Session</CardTitle>
                    <CardDescription>Select the type of guidance you need today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleStartCoaching("daily_checkin")}
                        className="h-24 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                      >
                        <Calendar className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Daily Check-in</div>
                          <div className="text-xs text-stone-500">Plan your day</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleStartCoaching("goal_review")}
                        className="h-24 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                      >
                        <Target className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Goal Review</div>
                          <div className="text-xs text-stone-500">Assess progress</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleStartCoaching("habit_analysis")}
                        className="h-24 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                      >
                        <TrendingUp className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Habit Analysis</div>
                          <div className="text-xs text-stone-500">Optimize routines</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleStartCoaching("motivation_boost")}
                        className="h-24 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                      >
                        <Sparkles className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Motivation Boost</div>
                          <div className="text-xs text-stone-500">Get inspired</div>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleStartCoaching("strategy_session")}
                        className="h-24 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                      >
                        <Brain className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-medium">Strategy Session</div>
                          <div className="text-xs text-stone-500">Plan approach</div>
                        </div>
                      </Button>

                      {currentSubscription === "enterprise" && (
                        <Button
                          variant="outline"
                          onClick={() => handleStartCoaching("daily_checkin")}
                          className="h-24 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50"
                        >
                          <Users className="h-6 w-6" />
                          <div className="text-center">
                            <div className="font-medium">Team Session</div>
                            <div className="text-xs text-stone-500">Group coaching</div>
                          </div>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Sessions */}
                {userData.coachingSessions && userData.coachingSessions.length > 0 && (
                  <Card className="border-forest-200">
                    <CardHeader>
                      <CardTitle className="text-forest-800">Recent Sessions</CardTitle>
                      <CardDescription>Your coaching session history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userData.coachingSessions.slice(-3).map((session: CoachingSession, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-forest-50 rounded-lg">
                            <div>
                              <h4 className="font-medium text-forest-800">{session.type.replace("_", " ")}</h4>
                              <p className="text-sm text-stone-600">
                                {session.completedAt
                                  ? new Date(session.completedAt).toLocaleDateString()
                                  : "In progress"}
                              </p>
                            </div>
                            <Badge variant="outline">{Math.round(session.duration / 60000)} min</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <Card className="border-forest-200">
              <CardHeader>
                <CardTitle className="text-forest-800">AI-Powered Insights</CardTitle>
                <CardDescription>Deep analysis of your behavior patterns and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-forest-800 mb-2">Advanced Insights Coming Soon</h3>
                <p className="text-stone-600 mb-4">
                  Our AI is analyzing your patterns to provide deeper insights about your growth journey.
                </p>
                {currentSubscription === "free" && (
                  <Button
                    onClick={() => setActiveTab("upgrade")}
                    className="bg-forest-600 text-white hover:bg-forest-700"
                  >
                    Upgrade for Advanced Insights
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upgrade Tab */}
          <TabsContent value="upgrade">
            <SubscriptionUpgrade currentTier={currentSubscription} onUpgrade={handleUpgrade} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
