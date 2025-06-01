import type { UserData } from "./storage"

export interface KPIMetrics {
  // Core Performance Indicators
  overallProgress: number
  weeklyProgress: number
  monthlyProgress: number
  streakDays: number
  longestStreak: number

  // Category Performance
  categoryProgress: Record<string, number>
  categoryTrends: Record<string, number[]>

  // Productivity Metrics
  tasksCompleted: number
  tasksCompletedToday: number
  tasksCompletedThisWeek: number
  averageTasksPerDay: number

  // Goal Achievement
  milestonesCompleted: number
  milestonesTotal: number
  goalCompletionRate: number

  // Engagement Metrics
  journalEntriesCount: number
  journalStreakDays: number
  lastActivityDate: string

  // Trend Analysis
  progressTrend: number[] // Last 30 days
  activityHeatmap: Record<string, number>

  // Performance Scores
  consistencyScore: number
  momentumScore: number
  balanceScore: number
}

export class KPIService {
  static calculateKPIs(userData: UserData): KPIMetrics {
    const now = new Date()
    const startDate = new Date(userData.startDate)
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate overall progress
    const { totalTasks, completedTasks } = this.getTaskStats(userData.tasks)
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Calculate category progress
    const categoryProgress = this.getCategoryProgress(userData.tasks)
    const categoryTrends = this.getCategoryTrends(userData.tasks)

    // Calculate streaks
    const streakDays = this.calculateStreak(userData.tasks)
    const longestStreak = userData.gamification?.longestStreak || streakDays

    // Calculate time-based metrics
    const weeklyProgress = this.getWeeklyProgress(userData.tasks)
    const monthlyProgress = this.getMonthlyProgress(userData.tasks)

    // Calculate productivity metrics
    const tasksCompletedToday = this.getTasksCompletedToday(userData.tasks)
    const tasksCompletedThisWeek = this.getTasksCompletedThisWeek(userData.tasks)
    const averageTasksPerDay = daysSinceStart > 0 ? completedTasks / daysSinceStart : 0

    // Calculate milestone metrics
    const milestonesCompleted = userData.milestones?.filter((m) => m.completed).length || 0
    const milestonesTotal = userData.milestones?.length || 0
    const goalCompletionRate = milestonesTotal > 0 ? (milestonesCompleted / milestonesTotal) * 100 : 0

    // Calculate journal metrics
    const journalEntriesCount = Object.keys(userData.journalEntries || {}).length
    const journalStreakDays = this.calculateJournalStreak(userData.journalEntries || {})

    // Calculate trends
    const progressTrend = this.getProgressTrend(userData.tasks, 30)
    const activityHeatmap = this.getActivityHeatmap(userData.tasks)

    // Calculate performance scores
    const consistencyScore = this.calculateConsistencyScore(userData.tasks)
    const momentumScore = this.calculateMomentumScore(userData.tasks)
    const balanceScore = this.calculateBalanceScore(categoryProgress)

    // Get last activity
    const lastActivityDate = this.getLastActivityDate(userData.tasks)

    return {
      overallProgress,
      weeklyProgress,
      monthlyProgress,
      streakDays,
      longestStreak,
      categoryProgress,
      categoryTrends,
      tasksCompleted: completedTasks,
      tasksCompletedToday,
      tasksCompletedThisWeek,
      averageTasksPerDay: Math.round(averageTasksPerDay * 10) / 10,
      milestonesCompleted,
      milestonesTotal,
      goalCompletionRate: Math.round(goalCompletionRate),
      journalEntriesCount,
      journalStreakDays,
      lastActivityDate,
      progressTrend,
      activityHeatmap,
      consistencyScore: Math.round(consistencyScore),
      momentumScore: Math.round(momentumScore),
      balanceScore: Math.round(balanceScore),
    }
  }

  private static getTaskStats(tasks: Record<string, any[]>) {
    let totalTasks = 0
    let completedTasks = 0

    Object.values(tasks || {}).forEach((categoryTasks) => {
      totalTasks += categoryTasks.length
      completedTasks += categoryTasks.filter((task) => task.completed).length
    })

    return { totalTasks, completedTasks }
  }

  private static getCategoryProgress(tasks: Record<string, any[]>): Record<string, number> {
    const progress: Record<string, number> = {}

    Object.entries(tasks || {}).forEach(([category, categoryTasks]) => {
      const total = categoryTasks.length
      const completed = categoryTasks.filter((task) => task.completed).length
      progress[category] = total > 0 ? Math.round((completed / total) * 100) : 0
    })

    return progress
  }

  private static getCategoryTrends(tasks: Record<string, any[]>): Record<string, number[]> {
    const trends: Record<string, number[]> = {}
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    Object.entries(tasks || {}).forEach(([category, categoryTasks]) => {
      trends[category] = last7Days.map((date) => {
        return categoryTasks.filter((task) => task.completed && task.completedAt?.startsWith(date)).length
      })
    })

    return trends
  }

  private static calculateStreak(tasks: Record<string, any[]>): number {
    const today = new Date()
    let streak = 0
    const currentDate = new Date(today)

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0]
      const hasActivity = Object.values(tasks || {}).some((categoryTasks) =>
        categoryTasks.some((task) => task.completed && task.completedAt?.startsWith(dateStr)),
      )

      if (hasActivity) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  private static getWeeklyProgress(tasks: Record<string, any[]>): number {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    let weeklyCompleted = 0
    let weeklyTotal = 0

    Object.values(tasks || {}).forEach((categoryTasks) => {
      categoryTasks.forEach((task) => {
        const taskDate = new Date(task.createdAt || task.completedAt)
        if (taskDate >= weekAgo) {
          weeklyTotal++
          if (task.completed) weeklyCompleted++
        }
      })
    })

    return weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0
  }

  private static getMonthlyProgress(tasks: Record<string, any[]>): number {
    const monthAgo = new Date()
    monthAgo.setDate(monthAgo.getDate() - 30)

    let monthlyCompleted = 0
    let monthlyTotal = 0

    Object.values(tasks || {}).forEach((categoryTasks) => {
      categoryTasks.forEach((task) => {
        const taskDate = new Date(task.createdAt || task.completedAt)
        if (taskDate >= monthAgo) {
          monthlyTotal++
          if (task.completed) monthlyCompleted++
        }
      })
    })

    return monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0
  }

  private static getTasksCompletedToday(tasks: Record<string, any[]>): number {
    const today = new Date().toISOString().split("T")[0]

    return Object.values(tasks || {}).reduce((count, categoryTasks) => {
      return count + categoryTasks.filter((task) => task.completed && task.completedAt?.startsWith(today)).length
    }, 0)
  }

  private static getTasksCompletedThisWeek(tasks: Record<string, any[]>): number {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    return Object.values(tasks || {}).reduce((count, categoryTasks) => {
      return (
        count +
        categoryTasks.filter((task) => {
          if (!task.completed || !task.completedAt) return false
          const completedDate = new Date(task.completedAt)
          return completedDate >= weekAgo
        }).length
      )
    }, 0)
  }

  private static calculateJournalStreak(journalEntries: Record<string, any>): number {
    const today = new Date()
    let streak = 0
    const currentDate = new Date(today)

    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0]
      if (journalEntries[dateStr]) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  private static getProgressTrend(tasks: Record<string, any[]>, days: number): number[] {
    const trend: number[] = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const completedTasks = Object.values(tasks || {}).reduce((count, categoryTasks) => {
        return count + categoryTasks.filter((task) => task.completed && task.completedAt?.startsWith(dateStr)).length
      }, 0)

      trend.push(completedTasks)
    }

    return trend
  }

  private static getActivityHeatmap(tasks: Record<string, any[]>): Record<string, number> {
    const heatmap: Record<string, number> = {}
    const last90Days = Array.from({ length: 90 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    })

    last90Days.forEach((date) => {
      const activity = Object.values(tasks || {}).reduce((count, categoryTasks) => {
        return count + categoryTasks.filter((task) => task.completed && task.completedAt?.startsWith(date)).length
      }, 0)

      heatmap[date] = activity
    })

    return heatmap
  }

  private static calculateConsistencyScore(tasks: Record<string, any[]>): number {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    })

    const activeDays = last30Days.filter((date) => {
      return Object.values(tasks || {}).some((categoryTasks) =>
        categoryTasks.some((task) => task.completed && task.completedAt?.startsWith(date)),
      )
    }).length

    return (activeDays / 30) * 100
  }

  private static calculateMomentumScore(tasks: Record<string, any[]>): number {
    const last7Days = this.getProgressTrend(tasks, 7)
    const previous7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (i + 7))
      const dateStr = date.toISOString().split("T")[0]

      return Object.values(tasks || {}).reduce((count, categoryTasks) => {
        return count + categoryTasks.filter((task) => task.completed && task.completedAt?.startsWith(dateStr)).length
      }, 0)
    })

    const currentWeekTotal = last7Days.reduce((a, b) => a + b, 0)
    const previousWeekTotal = previous7Days.reduce((a, b) => a + b, 0)

    if (previousWeekTotal === 0) return currentWeekTotal > 0 ? 100 : 0

    const improvement = ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
    return Math.max(0, Math.min(100, 50 + improvement))
  }

  private static calculateBalanceScore(categoryProgress: Record<string, number>): number {
    const progressValues = Object.values(categoryProgress)
    if (progressValues.length === 0) return 0

    const average = progressValues.reduce((a, b) => a + b, 0) / progressValues.length
    const variance =
      progressValues.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / progressValues.length
    const standardDeviation = Math.sqrt(variance)

    // Lower standard deviation = better balance
    const maxStdDev = 50 // Assume max std dev of 50%
    const balanceScore = Math.max(0, 100 - (standardDeviation / maxStdDev) * 100)

    return balanceScore
  }

  private static getLastActivityDate(tasks: Record<string, any[]>): string {
    let lastDate = ""

    Object.values(tasks || {}).forEach((categoryTasks) => {
      categoryTasks.forEach((task) => {
        if (task.completed && task.completedAt) {
          if (task.completedAt > lastDate) {
            lastDate = task.completedAt
          }
        }
      })
    })

    return lastDate || new Date().toISOString()
  }
}
