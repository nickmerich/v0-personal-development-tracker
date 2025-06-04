"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Lightbulb, Clock } from "lucide-react"
import { aiAgentService, type AICoachingSession } from "@/lib/ai-agent-service"

interface AICoachingChatProps {
  sessionType: AICoachingSession["type"]
  onSessionComplete?: (session: AICoachingSession) => void
}

export function AICoachingChat({ sessionType, onSessionComplete }: AICoachingChatProps) {
  const [session, setSession] = useState<AICoachingSession | null>(null)
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Start new session
    const newSession = aiAgentService.startCoachingSession(sessionType)
    setSession(newSession)
  }, [sessionType])

  useEffect(() => {
    scrollToBottom()
  }, [session?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !session) return

    const userMessage = message.trim()
    setMessage("")
    setIsTyping(true)

    try {
      // Add user message
      aiAgentService.addUserMessage(session.id, userMessage)

      // Simulate AI thinking time
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      // Generate AI response
      const aiResponse = aiAgentService.generateAIResponse(session.id, userMessage)

      // Update session
      const updatedSession = aiAgentService.getSession(session.id)
      if (updatedSession) {
        setSession(updatedSession)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleCompleteSession = () => {
    if (!session) return

    aiAgentService.completeSession(session.id)
    const completedSession = aiAgentService.getSession(session.id)

    if (completedSession && onSessionComplete) {
      onSessionComplete(completedSession)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {session.title}
            </CardTitle>
            <CardDescription>{session.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {session.duration} min
            </Badge>
            <Button onClick={handleCompleteSession} variant="outline" size="sm">
              Complete Session
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {session.messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-forest-600" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === "user" ? "bg-forest-600 text-white" : "bg-stone-100 text-stone-900"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-forest-600" />
              </div>
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

        {/* Insights */}
        {session.insights.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              Session Insights
            </h4>
            <div className="space-y-2">
              {session.insights.map((insight, index) => (
                <div key={index} className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 border-t pt-4">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            disabled={isTyping}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim() || isTyping} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
