"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SwipeableCard, LongPress, PullToRefresh } from "@/components/mobile-interactions"
import { CheckCircle2, Heart, Star, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MobileTestPage() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [feedbackLog, setFeedbackLog] = useState<string[]>([])
  const [refreshCount, setRefreshCount] = useState(0)

  const logFeedback = (message: string) => {
    setFeedbackLog((prev) => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)])
  }

  const markTestPassed = (testName: string) => {
    setTestResults((prev) => ({ ...prev, [testName]: true }))
    logFeedback(`✅ ${testName} test passed`)
  }

  const handleRefresh = async () => {
    setRefreshCount((prev) => prev + 1)
    logFeedback(`🔄 Pull to refresh triggered (${refreshCount + 1})`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" className="touch-manipulation" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-green-800">Mobile Interaction Test</h1>
            <p className="text-sm text-stone-600">Test swipe gestures and touch feedback</p>
          </div>
        </div>
      </header>

      <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <main className="p-4 space-y-6">
          {/* Test Status Overview */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Test Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {["Swipe Left", "Swipe Right", "Long Press", "Touch Feedback", "Pull to Refresh", "Card Press"].map(
                  (test) => (
                    <Badge
                      key={test}
                      variant={testResults[test] ? "default" : "secondary"}
                      className={cn(
                        "justify-center py-2",
                        testResults[test]
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {testResults[test] ? "✅" : "⏳"} {test}
                    </Badge>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Swipe Gesture Tests */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Swipe Gesture Tests</CardTitle>
              <p className="text-sm text-stone-600">Swipe left or right on the cards below</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <SwipeableCard
                onSwipeLeft={() => {
                  markTestPassed("Swipe Left")
                  logFeedback("👈 Swiped left - Archive action")
                }}
                onSwipeRight={() => {
                  markTestPassed("Swipe Right")
                  logFeedback("👉 Swiped right - Like action")
                }}
                className="p-4 bg-white border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Swipe Test Card</h3>
                    <p className="text-sm text-stone-600">Swipe ← to archive, → to like</p>
                  </div>
                </div>
              </SwipeableCard>

              <SwipeableCard
                onSwipeLeft={() => logFeedback("🗑️ Task deleted")}
                onSwipeRight={() => logFeedback("✅ Task completed")}
                className="p-4 bg-white border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">Task: Morning Meditation</h3>
                    <p className="text-sm text-stone-600">Swipe ← to delete, → to complete</p>
                  </div>
                </div>
              </SwipeableCard>
            </CardContent>
          </Card>

          {/* Long Press Test */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Long Press Test</CardTitle>
              <p className="text-sm text-stone-600">Press and hold the button below for 1 second</p>
            </CardHeader>
            <CardContent>
              <LongPress
                onLongPress={() => {
                  markTestPassed("Long Press")
                  logFeedback("⏰ Long press detected - Context menu opened")
                }}
                duration={1000}
              >
                <Button
                  variant="outline"
                  className="w-full h-16 border-green-300 text-green-700 hover:bg-green-50 touch-manipulation"
                >
                  <div className="text-center">
                    <div className="font-medium">Long Press Me</div>
                    <div className="text-sm opacity-75">Hold for 1 second</div>
                  </div>
                </Button>
              </LongPress>
            </CardContent>
          </Card>

          {/* Touch Feedback Test */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Touch Feedback Test</CardTitle>
              <p className="text-sm text-stone-600">Tap the buttons to test visual feedback</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full touch-manipulation active:scale-95 transition-transform duration-150"
                onClick={() => {
                  markTestPassed("Touch Feedback")
                  logFeedback("👆 Button pressed with scale feedback")
                }}
              >
                Press Me (Scale Effect)
              </Button>

              <Button
                variant="outline"
                className="w-full touch-manipulation active:bg-green-100 transition-colors duration-150"
                onClick={() => logFeedback("👆 Button pressed with color feedback")}
              >
                Press Me (Color Effect)
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-16 w-full touch-manipulation active:scale-98 transition-transform duration-100"
                  onClick={() => logFeedback("❤️ Heart button pressed")}
                >
                  <Heart className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-16 w-full touch-manipulation active:scale-98 transition-transform duration-100"
                  onClick={() => logFeedback("⭐ Star button pressed")}
                >
                  <Star className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pull to Refresh Instructions */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Pull to Refresh Test</CardTitle>
              <p className="text-sm text-stone-600">Pull down from the top of the page to test refresh functionality</p>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{refreshCount}</div>
                <div className="text-sm text-stone-600">Refresh Count</div>
                {refreshCount > 0 && (
                  <Badge className="mt-2 bg-green-100 text-green-800">✅ Pull to Refresh Working!</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Log */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Interaction Log</CardTitle>
              <p className="text-sm text-stone-600">Real-time feedback from your interactions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {feedbackLog.length === 0 ? (
                  <p className="text-sm text-stone-500 italic">No interactions yet. Start testing!</p>
                ) : (
                  feedbackLog.map((log, index) => (
                    <div key={index} className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device Info */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Touch Support:</span>
                  <span className="text-green-800">
                    {typeof window !== "undefined" && "ontouchstart" in window ? "✅ Yes" : "❌ No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Screen Size:</span>
                  <span className="text-green-800">
                    {typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </PullToRefresh>
    </div>
  )
}
