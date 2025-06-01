import type { UserData } from "./storage"
import { KPIService, type KPIMetrics } from "./kpi-service"

export interface Insight {
  id: string
  type: "success" | "warning" | "info" | "recommendation"
  title: string
  description: string
  actionable: boolean
  priority: "high" | "medium" | "low"
  category?: string
  metric?: string
  value?: number
  trend?: "up" | "down" | "stable"
}

export interface Recommendation {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effort: "low" | "medium" | "high"
  category: string
  actionSteps: string[]
  expectedOutcome: string
}

export interface AnalyticsData {
  metrics: KPIMetrics
  insights: Insight[]
  recommendations: Recommendation[]
  alerts: Alert[]
  trends: TrendAnalysis
}

export interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: string
  category?: string
  dismissed?: boolean
}

export interface TrendAnalysis {
  overall: "improving" | "declining" | "stable"
  categories: Record<string, "improving" | "declining" | "stable">
  predictions: {
    nextWeekProgress: number
    nextMonthGoals: number
    streakPrediction: number
  }
}

export class AnalyticsService {
  static generateAnalytics(userData: UserData): AnalyticsData {
    const metrics = KPIService.calculateKPIs(userData)
    const insights = this.generateInsights(metrics, userData)
    const recommendations = this.generateRecommendations(metrics, userData)
    const alerts = this.generateAlerts(metrics, userData)
    const trends = this.analyzeTrends(metrics, userData)

    return {
      metrics,
      insights,
      recommendations,
      alerts,
      trends,
    }
  }

  private static generateInsights(metrics: KPIMetrics, userData: UserData): Insight[] {
    const insights: Insight[] = []

    // Progress insights
    if (metrics.overallProgress >= 80) {
      insights.push({
        id: "high-progress",
        type: "success",
        title: "Excellent Progress!",
        description: `You've completed ${metrics.overallProgress}% of your tasks. You're crushing your goals!`,
        actionable: false,
        priority: "high",
        metric: "overallProgress",
        value: metrics.overallProgress,
        trend: "up",
      })
    } else if (metrics.overallProgress < 30) {
      insights.push({
        id: "low-progress",
        type: "warning",
        title: "Progress Opportunity",
        description: `Your overall progress is ${metrics.overallProgress}%. Consider focusing on smaller, achievable tasks.`,
        actionable: true,
        priority: "high",
        metric: "overallProgress",
        value: metrics.overallProgress,
        trend: "down",
      })
    }

    // Streak insights
    if (metrics.streakDays >= 7) {
      insights.push({
        id: "strong-streak",
        type: "success",
        title: "Consistency Champion!",
        description: `${metrics.streakDays} days of consistent progress. Keep the momentum going!`,
        actionable: false,
        priority: "medium",
        metric: "streakDays",
        value: metrics.streakDays,
        trend: "up",
      })
    } else if (metrics.streakDays === 0) {
      insights.push({
        id: "broken-streak",
        type: "warning",
        title: "Time to Restart",
        description: "Your streak has been broken. Start fresh today with one small task.",
        actionable: true,
        priority: "high",
        metric: "streakDays",
        value: metrics.streakDays,
        trend: "down",
      })
    }

    // Balance insights
    if (metrics.balanceScore < 40) {
      const imbalancedCategories = Object.entries(metrics.categoryProgress)
        .filter(([_, progress]) => progress < 20)
        .map(([category]) => category)

      if (imbalancedCategories.length > 0) {
        insights.push({
          id: "category-imbalance",
          type: "info",
          title: "Focus Area Needed",
          description: `Consider giving more attention to: ${imbalancedCategories.join(", ")}`,
          actionable: true,
          priority: "medium",
          metric: "balanceScore",
          value: metrics.balanceScore,
        })
      }
    }

    // Momentum insights
    if (metrics.momentumScore >= 70) {
      insights.push({
        id: "high-momentum",
        type: "success",
        title: "Building Momentum!",
        description: "You're improving week over week. This is the power of consistency!",
        actionable: false,
        priority: "medium",
        metric: "momentumScore",
        value: metrics.momentumScore,
        trend: "up",
      })
    }

    // Journal insights
    if (metrics.journalStreakDays >= 5) {
      insights.push({
        id: "journal-consistency",
        type: "success",
        title: "Reflection Master",
        description: `${metrics.journalStreakDays} days of journaling. Self-reflection is key to growth!`,
        actionable: false,
        priority: "low",
        metric: "journalStreakDays",
        value: metrics.journalStreakDays,
      })
    }

    return insights
  }

  private static generateRecommendations(metrics: KPIMetrics, userData: UserData): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Low progress recommendations
    if (metrics.overallProgress < 50) {
      recommendations.push({
        id: "break-down-tasks",
        title: "Break Down Large Tasks",
        description: "Large tasks can feel overwhelming. Break them into smaller, manageable steps.",
        impact: "high",
        effort: "low",
        category: "Productivity",
        actionSteps: [
          "Identify your largest incomplete tasks",
          "Break each into 3-5 smaller subtasks",
          "Focus on completing one subtask at a time",
          "Celebrate small wins along the way",
        ],
        expectedOutcome: "Increased completion rate and reduced overwhelm",
      })
    }

    // Consistency recommendations
    if (metrics.consistencyScore < 60) {
      recommendations.push({
        id: "daily-minimums",
        title: "Establish Daily Minimums",
        description: "Set a minimum daily commitment that's so small you can't say no.",
        impact: "high",
        effort: "low",
        category: "Habits",
        actionSteps: [
          "Choose one task you can do in 5 minutes or less",
          "Commit to doing it every day",
          "Track your daily completion",
          "Gradually increase once the habit is solid",
        ],
        expectedOutcome: "Improved consistency and habit formation",
      })
    }

    // Balance recommendations
    if (metrics.balanceScore < 50) {
      const neglectedCategories = Object.entries(metrics.categoryProgress)
        .filter(([_, progress]) => progress < 30)
        .map(([category]) => category)

      if (neglectedCategories.length > 0) {
        recommendations.push({
          id: "focus-neglected-areas",
          title: "Address Neglected Life Areas",
          description: `Focus on improving ${neglectedCategories.join(" and ")} for better life balance.`,
          impact: "medium",
          effort: "medium",
          category: "Balance",
          actionSteps: [
            `Add 1-2 simple tasks in ${neglectedCategories[0]}`,
            "Schedule specific times for these activities",
            "Start with just 15 minutes per day",
            "Track progress weekly",
          ],
          expectedOutcome: "More balanced personal development",
        })
      }
    }

    // Momentum recommendations
    if (metrics.momentumScore < 40) {
      recommendations.push({
        id: "momentum-building",
        title: "Build Weekly Momentum",
        description: "Create a weekly rhythm that builds momentum throughout the week.",
        impact: "medium",
        effort: "medium",
        category: "Momentum",
        actionSteps: [
          "Plan your week every Sunday",
          "Start Monday with your easiest task",
          "Build complexity as the week progresses",
          "Review and celebrate Friday achievements",
        ],
        expectedOutcome: "Stronger weekly momentum and motivation",
      })
    }

    // Advanced recommendations for high performers
    if (metrics.overallProgress >= 70 && metrics.consistencyScore >= 70) {
      recommendations.push({
        id: "level-up-goals",
        title: "Level Up Your Goals",
        description: "You're doing great! Consider adding more challenging or impactful goals.",
        impact: "high",
        effort: "high",
        category: "Growth",
        actionSteps: [
          "Review your current goals and achievements",
          "Identify areas where you can increase difficulty",
          "Add one stretch goal that excites you",
          "Consider mentoring others in your strong areas",
        ],
        expectedOutcome: "Continued growth and increased impact",
      })
    }

    return recommendations
  }

  private static generateAlerts(metrics: KPIMetrics, userData: UserData): Alert[] {
    const alerts: Alert[] = []
    const now = new Date()

    // Streak alerts
    if (metrics.streakDays === 0) {
      alerts.push({
        id: "streak-broken",
        type: "warning",
        title: "Streak Broken",
        message: "Your daily streak has been broken. Start fresh today!",
        timestamp: now.toISOString(),
        category: "Consistency",
      })
    }

    // Low activity alerts
    if (metrics.tasksCompletedToday === 0 && now.getHours() >= 18) {
      alerts.push({
        id: "no-activity-today",
        type: "warning",
        title: "No Activity Today",
        message: "You haven't completed any tasks today. Even a small step counts!",
        timestamp: now.toISOString(),
        category: "Activity",
      })
    }

    // Milestone alerts
    const upcomingMilestones = userData.milestones?.filter((m) => {
      if (m.completed || !m.targetDate) return false
      const targetDate = new Date(m.targetDate)
      const daysUntil = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntil <= 7 && daysUntil > 0
    })

    if (upcomingMilestones && upcomingMilestones.length > 0) {
      alerts.push({
        id: "upcoming-milestone",
        type: "info",
        title: "Milestone Approaching",
        message: `You have ${upcomingMilestones.length} milestone(s) due within a week.`,
        timestamp: now.toISOString(),
        category: "Milestones",
      })
    }

    // Achievement alerts
    if (metrics.overallProgress >= 50 && metrics.overallProgress < 55) {
      alerts.push({
        id: "halfway-achievement",
        type: "info",
        title: "Halfway There!",
        message: "You've reached 50% overall progress. Great job!",
        timestamp: now.toISOString(),
        category: "Achievement",
      })
    }

    return alerts
  }

  private static analyzeTrends(metrics: KPIMetrics, userData: UserData): TrendAnalysis {
    // Analyze overall trend
    const recentProgress = metrics.progressTrend.slice(-7)
    const earlierProgress = metrics.progressTrend.slice(-14, -7)

    const recentAvg = recentProgress.reduce((a, b) => a + b, 0) / recentProgress.length
    const earlierAvg = earlierProgress.reduce((a, b) => a + b, 0) / earlierProgress.length

    let overall: "improving" | "declining" | "stable" = "stable"
    if (recentAvg > earlierAvg * 1.1) overall = "improving"
    else if (recentAvg < earlierAvg * 0.9) overall = "declining"

    // Analyze category trends
    const categories: Record<string, "improving" | "declining" | "stable"> = {}
    Object.entries(metrics.categoryTrends).forEach(([category, trend]) => {
      const recent = trend.slice(-3).reduce((a, b) => a + b, 0)
      const earlier = trend.slice(-6, -3).reduce((a, b) => a + b, 0)

      if (recent > earlier * 1.2) categories[category] = "improving"
      else if (recent < earlier * 0.8) categories[category] = "declining"
      else categories[category] = "stable"
    })

    // Generate predictions
    const predictions = {
      nextWeekProgress: Math.min(100, metrics.overallProgress + recentAvg * 7),
      nextMonthGoals: Math.round(metrics.milestonesCompleted + (recentAvg * 30) / 10),
      streakPrediction: metrics.streakDays + (recentAvg > 0 ? 7 : 0),
    }

    return {
      overall,
      categories,
      predictions,
    }
  }

  static exportData(analytics: AnalyticsData, format: "csv" | "json" | "pdf"): string {
    switch (format) {
      case "csv":
        return this.exportToCSV(analytics)
      case "json":
        return JSON.stringify(analytics, null, 2)
      case "pdf":
        return this.exportToPDF(analytics)
      default:
        return JSON.stringify(analytics, null, 2)
    }
  }

  private static exportToCSV(analytics: AnalyticsData): string {
    const { metrics } = analytics
    const headers = ["Metric", "Value", "Category", "Date"]

    const rows = [
      ["Overall Progress", `${metrics.overallProgress}%`, "Progress", new Date().toISOString()],
      ["Current Streak", `${metrics.streakDays} days`, "Consistency", new Date().toISOString()],
      ["Tasks Completed", metrics.tasksCompleted.toString(), "Productivity", new Date().toISOString()],
      ["Weekly Progress", `${metrics.weeklyProgress}%`, "Progress", new Date().toISOString()],
      ["Consistency Score", `${metrics.consistencyScore}%`, "Consistency", new Date().toISOString()],
      ["Momentum Score", `${metrics.momentumScore}%`, "Momentum", new Date().toISOString()],
      ["Balance Score", `${metrics.balanceScore}%`, "Balance", new Date().toISOString()],
    ]

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  private static exportToPDF(analytics: AnalyticsData): string {
    // This would typically use a PDF library like jsPDF
    // For now, return a formatted text representation
    const { metrics, insights, recommendations } = analytics

    return `
PERSONAL DEVELOPMENT ANALYTICS REPORT
Generated: ${new Date().toLocaleDateString()}

=== KEY METRICS ===
Overall Progress: ${metrics.overallProgress}%
Current Streak: ${metrics.streakDays} days
Tasks Completed: ${metrics.tasksCompleted}
Consistency Score: ${metrics.consistencyScore}%
Momentum Score: ${metrics.momentumScore}%
Balance Score: ${metrics.balanceScore}%

=== KEY INSIGHTS ===
${insights.map((insight) => `• ${insight.title}: ${insight.description}`).join("\n")}

=== RECOMMENDATIONS ===
${recommendations.map((rec) => `• ${rec.title}: ${rec.description}`).join("\n")}
    `.trim()
  }
}
