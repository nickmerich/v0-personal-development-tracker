"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Lightbulb, Target, TrendingUp, MessageSquare, Sparkles } from "lucide-react"
import { aiAgentService, type CoachingSession } from "@/lib/ai-agent-service"
import { cn } from "@/lib/utils"

interface AICoachingChatProps {
  userData: any
  sessionType: CoachingSession["type"]
  onSessionComplete: (session: CoachingSession) => void
}

export function AICoachingChat({ userData, sessionType, onSessionComplete }: AICoachingChatProps) {
  const [session, setSession] = useState<CoachingSession | null>(null)
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeSession()
  }, [sessionType, userData])

  useEffect(() => {
    scrollToBottom()
  }, [session?.messages])

  const initializeSession = async () => {
    setLoading(true)
    try {
      const newSession = await aiAgentService.startCoachingSession(sessionType, userData)
      setSession(newSession)
    } catch (error) {
      console.error("Failed to initialize coaching session:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || !session) return

    const userMessage = {
      role: "user" as const,
      content: currentMessage.trim(),
      timestamp: new Date(),
    }

    // Add user message
    setSession((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, userMessage],
          }
        : null,
    )

    setCurrentMessage("")
    setIsTyping(true)

    try {
      // Get AI response
      const response = await aiAgentService.processCoachingResponse(session.id, userMessage.content)

      // Simulate typing delay
      setTimeout(() => {
        const aiMessage = {
          role: "agent" as const,
          content: response.response,
          timestamp: new Date(),
          emotion: "supportive",
        }

        setSession((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, aiMessage],
                insights: [...prev.insights, ...response.insights],
              }
            : null,
        )

        setIsTyping(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to get AI response:", error)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const completeSession = () => {
    if (session) {
      const completedSession = {
        ...session,
        completedAt: new Date(),
        duration: Date.now() - new Date(session.messages[0]?.timestamp || Date.now()).getTime(),
      }
      onSessionComplete(completedSession)
    }
  }

  const getSessionTitle = (type: CoachingSession["type"]) => {
    switch (type) {
      case "daily_checkin":
        return "Daily Check-in"
      case "goal_review":
        return "Goal Review"
      case "habit_analysis":
        return "Habit Analysis"
      case "motivation_boost":
        return "Motivation Boost"
      case "strategy_session":
        return "Strategy Session"
      default:
        return "AI Coaching"
    }
  }

  const getSessionIcon = (type: CoachingSession["type"]) => {
    switch (type) {
      case "daily_checkin":
        return MessageSquare
      case "goal_review":
        return Target
      case "habit_analysis":
        return TrendingUp
      case "motivation_boost":
        return Sparkles
      case "strategy_session":
        return Lightbulb
      default:
        return Bot
    }
  }

  if (loading) {
    return (
      <Card className="border-forest-200">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
          <span className="ml-3 text-stone-600">Connecting to your AI coach...</span>
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card className="border-forest-200">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-stone-600">Failed to start coaching session. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  const SessionIcon = getSessionIcon(sessionType)

  return (
    <div className="space-y-4">
      {/* Session Header */}
      <Card className="border-forest-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-forest-100 rounded-lg">
              <SessionIcon className="h-5 w-5 text-forest-600" />
            </div>
            <div>
              <h3 className="text-forest-800">{getSessionTitle(sessionType)}</h3>
              <p className="text-sm text-stone-600 font-normal">Your AI coach is here to help guide your progress</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card className="border-forest-200">
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {session.messages.map((message, index) => (
              <div key={index} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                {message.role === "agent" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-forest-100 text-forest-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user" ? "bg-forest-600 text-white" : "bg-stone-100 text-stone-800",
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-forest-100 text-forest-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-stone-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-stone-200 p-4">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts, concerns, or questions..."
                disabled={isTyping}
                className="flex-1 border-forest-300 focus:border-forest-500"
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="bg-forest-600 text-white hover:bg-forest-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Insights */}
      {session.insights.length > 0 && (
        <Card className="border-forest-200">
          <CardHeader>
            <CardTitle className="text-forest-800 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Session Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {session.insights.map((insight, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-100 text-yellow-800">{insight.type}</Badge>
                  <Badge variant="outline">{Math.round(insight.confidence * 100)}% confidence</Badge>
                </div>
                <p className="text-sm text-stone-700">{insight.insight}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Session Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={completeSession}
          className="flex-1 border-forest-300 text-forest-600 hover:bg-forest-50"
        >
          Complete Session
        </Button>
        <Button onClick={() => window.location.reload()} className="bg-forest-600 text-white hover:bg-forest-700">
          New Session
        </Button>
      </div>
    </div>
  )
}
