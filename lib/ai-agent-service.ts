export interface AIAgent {
  id: string
  name: string
  personality: "supportive" | "challenging" | "analytical" | "motivational"
  specialization: string[]
  avatar: string
}

export interface Nudge {
  id: string
  type: "reminder" | "encouragement" | "insight" | "challenge" | "reflection"
  priority: "low" | "medium" | "high" | "urgent"
  title: string
  message: string
  actionable: boolean
  action?: {
    type: "complete_task" | "add_task" | "journal" | "reflect" | "schedule"
    data?: any
  }
  timing: {
    scheduledFor: Date
    optimalWindow: { start: string; end: string }
  }
  context: {
    category?: string
    goalId?: string
    taskId?: string
    streakDay?: number
    performance?: number
  }
  delivered: boolean
  acknowledged: boolean
  effectiveness?: number
}

export interface AIInsight {
  id: string
  type: "pattern" | "recommendation" | "warning" | "celebration" | "strategy"
  insight: string
  confidence: number
  impact: "low" | "medium" | "high"
  actionItems: string[]
  dataPoints: string[]
}

export interface CoachingSession {
  id: string
  type: "daily_checkin" | "goal_review" | "habit_analysis" | "motivation_boost" | "strategy_session"
  duration: number
  messages: Array<{
    role: "user" | "agent"
    content: string
    timestamp: Date
    emotion?: string
  }>
  insights: AIInsight[]
  nextSteps: string[]
  completedAt?: Date
}

class AIAgentService {
  private agents: AIAgent[] = [
    {
      id: "coach_alex",
      name: "Alex",
      personality: "supportive",
      specialization: ["habit_formation", "motivation", "daily_planning"],
      avatar: "👩‍💼",
    },
    {
      id: "strategist_sam",
      name: "Sam",
      personality: "analytical",
      specialization: ["goal_setting", "progress_analysis", "optimization"],
      avatar: "🧠",
    },
    {
      id: "motivator_max",
      name: "Max",
      personality: "challenging",
      specialization: ["accountability", "breakthrough", "performance"],
      avatar: "💪",
    },
  ]

  // Generate intelligent nudges based on user data and behavior patterns
  generateDailyNudges(userData: any): Nudge[] {
    const nudges: Nudge[] = []
    const now = new Date()
    const userPatterns = this.analyzeUserPatterns(userData)

    // Morning motivation nudge
    if (this.shouldSendMorningNudge(userPatterns)) {
      nudges.push({
        id: `morning_${Date.now()}`,
        type: "encouragement",
        priority: "medium",
        title: "Ready to Conquer Today? 🌅",
        message: this.generatePersonalizedMorningMessage(userData, userPatterns),
        actionable: true,
        action: {
          type: "complete_task",
          data: { timeOfDay: "morning" },
        },
        timing: {
          scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0),
          optimalWindow: { start: "07:00", end: "09:00" },
        },
        context: {
          category: "motivation",
          streakDay: this.calculateStreakDays(userData),
        },
        delivered: false,
        acknowledged: false,
      })
    }

    // Habit reminder nudges
    const habitNudges = this.generateHabitNudges(userData, userPatterns)
    nudges.push(...habitNudges)

    // Progress check nudges
    const progressNudges = this.generateProgressNudges(userData, userPatterns)
    nudges.push(...progressNudges)

    // Evening reflection nudge
    if (this.shouldSendEveningNudge(userPatterns)) {
      nudges.push({
        id: `evening_${Date.now()}`,
        type: "reflection",
        priority: "low",
        title: "How Did Today Go? 🌙",
        message: "Take a moment to reflect on your progress and plan tomorrow's wins.",
        actionable: true,
        action: {
          type: "journal",
        },
        timing: {
          scheduledFor: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0),
          optimalWindow: { start: "19:00", end: "21:00" },
        },
        context: {
          category: "reflection",
        },
        delivered: false,
        acknowledged: false,
      })
    }

    return nudges
  }

  // Analyze user behavior patterns for intelligent timing
  private analyzeUserPatterns(userData: any) {
    const patterns = {
      mostActiveHours: this.getMostActiveHours(userData),
      preferredTaskTypes: this.getPreferredTaskTypes(userData),
      motivationTriggers: this.getMotivationTriggers(userData),
      strugglingAreas: this.getStrugglingAreas(userData),
      streakDays: this.calculateStreakDays(userData),
      completionRate: this.calculateCompletionRate(userData),
      lastActiveTime: this.getLastActiveTime(userData),
    }

    return patterns
  }

  private getMostActiveHours(userData: any): string[] {
    // Analyze task completion times to determine when user is most active
    const hourCounts: Record<number, number> = {}

    if (userData.tasks) {
      Object.values(userData.tasks)
        .flat()
        .forEach((task: any) => {
          if (task.completed && task.completedAt) {
            const hour = new Date(task.completedAt).getHours()
            hourCounts[hour] = (hourCounts[hour] || 0) + 1
          }
        })
    }

    // Return top 3 most active hours
    return Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => `${hour}:00`)
  }

  private getPreferredTaskTypes(userData: any): string[] {
    if (!userData.tasks) return []

    const categoryCompletion: Record<string, { completed: number; total: number }> = {}

    Object.entries(userData.tasks).forEach(([category, tasks]: [string, any[]]) => {
      const completed = tasks.filter((t) => t.completed).length
      categoryCompletion[category] = { completed, total: tasks.length }
    })

    return Object.entries(categoryCompletion)
      .sort(([, a], [, b]) => b.completed / b.total - a.completed / a.total)
      .slice(0, 3)
      .map(([category]) => category)
  }

  private generateHabitNudges(userData: any, patterns: any): Nudge[] {
    const nudges: Nudge[] = []
    const now = new Date()

    // Check for habits that haven't been done today
    if (userData.tasks) {
      Object.entries(userData.tasks).forEach(([category, tasks]: [string, any[]]) => {
        const todaysTasks = tasks.filter(
          (task) =>
            !task.completed &&
            (!task.scheduledDate || new Date(task.scheduledDate).toDateString() === now.toDateString()),
        )

        if (todaysTasks.length > 0 && this.isInOptimalWindow(patterns.mostActiveHours)) {
          nudges.push({
            id: `habit_${category}_${Date.now()}`,
            type: "reminder",
            priority: "medium",
            title: `Time for ${category}! ⚡`,
            message: this.generateHabitReminderMessage(category, todaysTasks[0], patterns),
            actionable: true,
            action: {
              type: "complete_task",
              data: { taskId: todaysTasks[0].id, category },
            },
            timing: {
              scheduledFor: now,
              optimalWindow: { start: patterns.mostActiveHours[0] || "09:00", end: "11:00" },
            },
            context: {
              category,
              taskId: todaysTasks[0].id,
              performance: patterns.completionRate,
            },
            delivered: false,
            acknowledged: false,
          })
        }
      })
    }

    return nudges
  }

  private generateProgressNudges(userData: any, patterns: any): Nudge[] {
    const nudges: Nudge[] = []

    // Weekly progress check
    if (this.shouldSendWeeklyProgressNudge(patterns)) {
      nudges.push({
        id: `progress_weekly_${Date.now()}`,
        type: "insight",
        priority: "low",
        title: "Weekly Progress Insight 📊",
        message: this.generateWeeklyProgressMessage(userData, patterns),
        actionable: false,
        timing: {
          scheduledFor: this.getNextSunday(),
          optimalWindow: { start: "18:00", end: "20:00" },
        },
        context: {
          performance: patterns.completionRate,
          streakDay: patterns.streakDays,
        },
        delivered: false,
        acknowledged: false,
      })
    }

    return nudges
  }

  // AI-powered conversational coaching
  async startCoachingSession(type: CoachingSession["type"], userData: any): Promise<CoachingSession> {
    const session: CoachingSession = {
      id: `session_${Date.now()}`,
      type,
      duration: 0,
      messages: [],
      insights: [],
      nextSteps: [],
    }

    // Generate opening message based on session type
    const openingMessage = this.generateOpeningMessage(type, userData)
    session.messages.push({
      role: "agent",
      content: openingMessage,
      timestamp: new Date(),
      emotion: "supportive",
    })

    return session
  }

  private generateOpeningMessage(type: CoachingSession["type"], userData: any): string {
    const userName = userData.name || "there"

    switch (type) {
      case "daily_checkin":
        return `Good morning ${userName}! 🌟 How are you feeling about today's goals? I'm here to help you prioritize and tackle them one by one.`

      case "goal_review":
        return `Hey ${userName}! 🎯 Let's take a look at how you're progressing on your goals. I've noticed some interesting patterns in your journey.`

      case "habit_analysis":
        return `Hi ${userName}! 📈 I've been analyzing your habits and I have some insights that might help you build even stronger routines.`

      case "motivation_boost":
        return `${userName}, I can see you might need a little extra motivation today. 💪 Remember, every champion has moments of doubt - what matters is how we push through!`

      case "strategy_session":
        return `Welcome ${userName}! 🧠 Let's dive deep into optimizing your approach. I have some strategic recommendations based on your recent performance.`

      default:
        return `Hello ${userName}! 👋 I'm here to support you on your journey. What would you like to focus on today?`
    }
  }

  // Process user response in coaching session
  async processCoachingResponse(
    sessionId: string,
    userMessage: string,
  ): Promise<{
    response: string
    insights: AIInsight[]
    suggestions: string[]
  }> {
    // Simulate AI processing with intelligent responses
    const response = this.generateAIResponse(userMessage)
    const insights = this.generateInsights(userMessage)
    const suggestions = this.generateSuggestions(userMessage)

    return { response, insights, suggestions }
  }

  private generateAIResponse(userMessage: string): string {
    const message = userMessage.toLowerCase()

    if (message.includes("struggling") || message.includes("difficult") || message.includes("hard")) {
      return "I hear that this feels challenging right now. 🤗 Remember, struggle is often a sign that you're growing. What specific part feels most difficult? Let's break it down into smaller, manageable steps."
    }

    if (message.includes("motivated") || message.includes("excited") || message.includes("good")) {
      return "That's fantastic energy! 🚀 I love seeing your enthusiasm. Let's channel this motivation into concrete actions. What would you like to tackle first while you're feeling this great?"
    }

    if (message.includes("tired") || message.includes("exhausted") || message.includes("busy")) {
      return "It sounds like you're carrying a lot right now. 💙 Sometimes the most productive thing we can do is rest or simplify. What's one small thing you could accomplish today that would still move you forward?"
    }

    return "I appreciate you sharing that with me. 🌟 Every step forward, no matter how small, is progress. What feels most important to focus on right now?"
  }

  // Generate AI insights based on user data
  generateInsights(userData: any): AIInsight[] {
    const insights: AIInsight[] = []
    const patterns = this.analyzeUserPatterns(userData)

    // Completion rate insight
    if (patterns.completionRate < 0.7) {
      insights.push({
        id: `insight_completion_${Date.now()}`,
        type: "recommendation",
        insight: "Your task completion rate could be improved by focusing on fewer, more specific goals each day.",
        confidence: 0.85,
        impact: "high",
        actionItems: [
          "Limit daily tasks to 3-5 priority items",
          "Break large tasks into smaller steps",
          "Schedule specific times for each task",
        ],
        dataPoints: [`Current completion rate: ${Math.round(patterns.completionRate * 100)}%`],
      })
    }

    // Streak insight
    if (patterns.streakDays >= 7) {
      insights.push({
        id: `insight_streak_${Date.now()}`,
        type: "celebration",
        insight: `Congratulations! You've maintained a ${patterns.streakDays}-day streak. This consistency is building powerful momentum.`,
        confidence: 1.0,
        impact: "high",
        actionItems: [
          "Continue your current routine",
          "Consider adding one new small habit",
          "Share your success with someone",
        ],
        dataPoints: [`Current streak: ${patterns.streakDays} days`],
      })
    }

    return insights
  }

  // Subscription and pricing logic
  getSubscriptionFeatures(tier: "free" | "premium" | "enterprise"): {
    features: string[]
    nudgesPerDay: number
    aiCoachingSessions: number
    analytics: boolean
    integrations: boolean
    price: number
  } {
    switch (tier) {
      case "free":
        return {
          features: ["Basic daily nudges", "Simple progress tracking", "Limited analytics"],
          nudgesPerDay: 3,
          aiCoachingSessions: 0,
          analytics: false,
          integrations: false,
          price: 0,
        }

      case "premium":
        return {
          features: [
            "Unlimited personalized nudges",
            "AI coaching sessions",
            "Advanced analytics",
            "Calendar integration",
            "Custom goal optimization",
            "Priority support",
          ],
          nudgesPerDay: -1, // unlimited
          aiCoachingSessions: 4,
          analytics: true,
          integrations: true,
          price: 14.99,
        }

      case "enterprise":
        return {
          features: [
            "Everything in Premium",
            "Team analytics",
            "Admin dashboard",
            "Custom reporting",
            "API access",
            "Dedicated support",
          ],
          nudgesPerDay: -1,
          aiCoachingSessions: -1,
          analytics: true,
          integrations: true,
          price: 199, // base price for up to 25 users
        }
    }
  }

  // Helper methods
  private shouldSendMorningNudge(patterns: any): boolean {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 7 && hour <= 9 && patterns.completionRate < 0.8
  }

  private shouldSendEveningNudge(patterns: any): boolean {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 19 && hour <= 21
  }

  private shouldSendWeeklyProgressNudge(patterns: any): boolean {
    const now = new Date()
    return now.getDay() === 0 // Sunday
  }

  private isInOptimalWindow(activeHours: string[]): boolean {
    const now = new Date()
    const currentHour = `${now.getHours()}:00`
    return activeHours.includes(currentHour)
  }

  private calculateStreakDays(userData: any): number {
    // Calculate current streak based on task completion
    let streak = 0
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateString = checkDate.toISOString().split("T")[0]

      const hasActivity =
        userData.tasks &&
        Object.values(userData.tasks).some((tasks: any) =>
          tasks.some((task: any) => task.completed && task.completedAt?.startsWith(dateString)),
        )

      if (hasActivity) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  private calculateCompletionRate(userData: any): number {
    if (!userData.tasks) return 0

    let total = 0
    let completed = 0

    Object.values(userData.tasks).forEach((tasks: any) => {
      tasks.forEach((task: any) => {
        total++
        if (task.completed) completed++
      })
    })

    return total > 0 ? completed / total : 0
  }

  private getLastActiveTime(userData: any): Date | null {
    let latestTime: Date | null = null

    if (userData.tasks) {
      Object.values(userData.tasks).forEach((tasks: any) => {
        tasks.forEach((task: any) => {
          if (task.completedAt) {
            const completedTime = new Date(task.completedAt)
            if (!latestTime || completedTime > latestTime) {
              latestTime = completedTime
            }
          }
        })
      })
    }

    return latestTime
  }

  private getStrugglingAreas(userData: any): string[] {
    if (!userData.tasks) return []

    const categoryPerformance: Record<string, { completed: number; total: number }> = {}

    Object.entries(userData.tasks).forEach(([category, tasks]: [string, any[]]) => {
      const completed = tasks.filter((t) => t.completed).length
      categoryPerformance[category] = { completed, total: tasks.length }
    })

    return Object.entries(categoryPerformance)
      .filter(([, perf]) => perf.total > 0 && perf.completed / perf.total < 0.5)
      .map(([category]) => category)
  }

  private getMotivationTriggers(userData: any): string[] {
    // Analyze what types of content/times lead to higher completion rates
    return ["morning_motivation", "progress_celebration", "peer_comparison"]
  }

  private generatePersonalizedMorningMessage(userData: any, patterns: any): string {
    const userName = userData.name || "Champion"
    const streak = patterns.streakDays

    if (streak >= 7) {
      return `Good morning ${userName}! 🔥 You're on a ${streak}-day streak - that's incredible momentum! What's the first win you'll capture today?`
    } else if (streak > 0) {
      return `Morning ${userName}! 🌅 Day ${streak + 1} of building unstoppable habits. You've got this!`
    } else {
      return `Good morning ${userName}! 🌟 Today is a fresh start and a new opportunity to build the life you want. What's your priority?`
    }
  }

  private generateHabitReminderMessage(category: string, task: any, patterns: any): string {
    const completionRate = patterns.completionRate

    if (completionRate > 0.8) {
      return `You're crushing it! Time to keep that ${category} momentum going with "${task.text}". You've got this! 💪`
    } else {
      return `Hey, friendly reminder about "${task.text}" in your ${category} routine. Small steps today create big changes tomorrow! 🌱`
    }
  }

  private generateWeeklyProgressMessage(userData: any, patterns: any): string {
    const completionRate = Math.round(patterns.completionRate * 100)
    return `This week you completed ${completionRate}% of your tasks! 📊 ${completionRate >= 70 ? "Outstanding progress!" : "Room for growth - let's optimize your approach next week."}`
  }

  private getNextSunday(): Date {
    const now = new Date()
    const daysUntilSunday = 7 - now.getDay()
    return new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000)
  }

  private generateSuggestions(userMessage: string): string[] {
    return [
      "Try breaking this into smaller, 15-minute tasks",
      "Schedule it for your most productive time of day",
      "Find an accountability partner",
      "Celebrate small wins along the way",
    ]
  }

  private generateInsights(userMessage: string): AIInsight[] {
    return [
      {
        id: `insight_${Date.now()}`,
        type: "recommendation",
        insight: "Based on your response, I recommend focusing on consistency over intensity.",
        confidence: 0.8,
        impact: "medium",
        actionItems: ["Start with 10 minutes daily", "Track your progress", "Adjust as needed"],
        dataPoints: ["User expressed feeling overwhelmed"],
      },
    ]
  }
}

export const aiAgentService = new AIAgentService()
