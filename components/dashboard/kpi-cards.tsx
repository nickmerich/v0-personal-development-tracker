"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Target, Flame, Calendar, Trophy } from "lucide-react"
import type { KPIMetrics } from "@/lib/kpi-service"

interface KPICardsProps {
  metrics: KPIMetrics
}

export function KPICards({ metrics }: KPICardsProps) {
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-600"
    if (current < previous) return "text-red-600"
    return "text-gray-600"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Target className="h-4 w-4 text-forest-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-forest-800">{metrics.overallProgress}%</div>
          <Progress value={metrics.overallProgress} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {metrics.tasksCompleted} of {metrics.tasksCompleted + (100 - metrics.overallProgress)} tasks completed
          </p>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">{metrics.streakDays}</div>
          <p className="text-xs text-muted-foreground">days • Longest: {metrics.longestStreak} days</p>
          <div className="flex items-center mt-2">
            {getTrendIcon(metrics.streakDays, metrics.longestStreak)}
            <span className={`text-xs ml-1 ${getTrendColor(metrics.streakDays, metrics.longestStreak)}`}>
              {metrics.streakDays === metrics.longestStreak ? "Personal best!" : "Keep going!"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{metrics.tasksCompletedThisWeek}</div>
          <p className="text-xs text-muted-foreground">tasks completed • {metrics.weeklyProgress}% progress</p>
          <Progress value={metrics.weeklyProgress} className="mt-2" />
        </CardContent>
      </Card>

      {/* Goal Achievement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Milestones</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">
            {metrics.milestonesCompleted}/{metrics.milestonesTotal}
          </div>
          <p className="text-xs text-muted-foreground">{metrics.goalCompletionRate}% completion rate</p>
          <Progress value={metrics.goalCompletionRate} className="mt-2" />
        </CardContent>
      </Card>

      {/* Performance Scores */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-forest-800">Performance Scores</CardTitle>
          <CardDescription>Key indicators of your development journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Consistency</span>
                <span className="text-sm text-muted-foreground">{metrics.consistencyScore}%</span>
              </div>
              <Progress value={metrics.consistencyScore} />
              <p className="text-xs text-muted-foreground">How regularly you complete tasks</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Momentum</span>
                <span className="text-sm text-muted-foreground">{metrics.momentumScore}%</span>
              </div>
              <Progress value={metrics.momentumScore} />
              <p className="text-xs text-muted-foreground">Your improvement trend this week</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Balance</span>
                <span className="text-sm text-muted-foreground">{metrics.balanceScore}%</span>
              </div>
              <Progress value={metrics.balanceScore} />
              <p className="text-xs text-muted-foreground">How evenly you focus across categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
