"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Target, Zap, Calendar, CheckCircle2, Bell, TrendingUp } from "lucide-react"
import { useNotifications } from "@/components/notification-provider"
import { cn } from "@/lib/utils"

interface SmartReminder {
  id: string
  type: "task" | "goal" | "habit" | "checkin"
  title: string
  message: string
  scheduledTime: Date
  priority: "low" | "medium" | "high"
  category?: string
  taskId?: string
  goalId?: string
  recurring?: boolean
  completed?: boolean
}

interface SmartRemindersProps {
  userData: any
  onTaskComplete?: (taskId: string) => void
  onGoalUpdate?: (goalId: string) => void
}

export function SmartReminders({ userData, onTaskComplete, onGoalUpdate }: SmartRemindersProps) {
  const [reminders, setReminders] = useState<SmartReminder[]>([])
  const [upcomingReminders, setUpcomingReminders] = useState<SmartReminder[]>([])
  const { showNotification, scheduleReminder } = useNotifications()

  useEffect(() => {
    generateSmartReminders()
  }, [userData])

  const generateSmartReminders = () => {
    const newReminders: SmartReminder[] = []
    const now = new Date()

    // Task-based reminders
    if (userData.tasks) {
      Object.keys(userData.tasks).forEach((category) => {
        userData.tasks[category].forEach((task: any) => {
          if (!task.completed) {
            // Overdue task reminder
            if (task.scheduledDate) {
              const taskDate = new Date(task.scheduledDate)
              if (taskDate < now) {
                newReminders.push({
                  id: `overdue-${task.id}`,
                  type: "task",
                  title: "Overdue Task",
                  message: `"${task.text}" was scheduled for ${taskDate.toLocaleDateString()}`,
                  scheduledTime: now,
                  priority: "high",
                  category,
                  taskId: task.id,
                })
              }
            }

            // Smart timing suggestions based on category
            const suggestedTime = getSuggestedTimeForCategory(category)
            if (suggestedTime) {
              newReminders.push({
                id: `suggestion-${task.id}`,
                type: "task",
                title: "Optimal Time Suggestion",
                message: `Best time for "${task.text}" is around ${suggestedTime}`,
                scheduledTime: getNextOccurrence(suggestedTime),
                priority: "low",
                category,
                taskId: task.id,
              })
            }
          }
        })
      })
    }

    // Goal deadline reminders
    if (userData.milestones) {
      userData.milestones.forEach((milestone: any) => {
        if (!milestone.completed && milestone.targetDate) {
          const deadlineDate = new Date(milestone.targetDate)
          const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

          if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
            newReminders.push({
              id: `deadline-${milestone.id}`,
              type: "goal",
              title: "Goal Deadline Approaching",
              message: `"${milestone.title}" is due in ${daysUntilDeadline} days`,
              scheduledTime: now,
              priority: daysUntilDeadline <= 3 ? "high" : "medium",
              goalId: milestone.id,
            })
          }

          // Progress check reminders
          const progressPercentage = (milestone.currentValue / milestone.targetValue) * 100
          if (progressPercentage < 50 && daysUntilDeadline <= 14) {
            newReminders.push({
              id: `progress-${milestone.id}`,
              type: "goal",
              title: "Goal Progress Check",
              message: `"${milestone.title}" is ${progressPercentage.toFixed(0)}% complete. Consider increasing your efforts.`,
              scheduledTime: now,
              priority: "medium",
              goalId: milestone.id,
            })
          }
        }
      })
    }

    // Habit streak reminders
    const habitStreaks = calculateHabitStreaks(userData)
    habitStreaks.forEach((streak) => {
      if (streak.days > 0 && streak.days % 7 === 0) {
        newReminders.push({
          id: `streak-${streak.category}`,
          type: "habit",
          title: "Habit Streak Achievement! 🔥",
          message: `You've maintained your ${streak.category} habits for ${streak.days} days!`,
          scheduledTime: now,
          priority: "high",
          category: streak.category,
        })
      }

      // Streak at risk
      if (streak.lastCompletedDate) {
        const daysSinceLastCompletion = Math.floor(
          (now.getTime() - new Date(streak.lastCompletedDate).getTime()) / (1000 * 60 * 60 * 24),
        )
        if (daysSinceLastCompletion >= 1) {
          newReminders.push({
            id: `streak-risk-${streak.category}`,
            type: "habit",
            title: "Streak at Risk",
            message: `Your ${streak.category} streak is at risk! Complete a task today to maintain it.`,
            scheduledTime: now,
            priority: "medium",
            category: streak.category,
          })
        }
      }
    })

    // Daily check-in reminder
    const lastCheckinDate = userData.lastCheckinDate ? new Date(userData.lastCheckinDate) : null
    const shouldShowCheckin = !lastCheckinDate || lastCheckinDate.toDateString() !== now.toDateString()

    if (shouldShowCheckin) {
      const checkinTime = new Date()
      checkinTime.setHours(9, 0, 0, 0) // 9 AM default

      newReminders.push({
        id: "daily-checkin",
        type: "checkin",
        title: "Daily Check-in",
        message: "Take a moment to review your progress and plan your day",
        scheduledTime: checkinTime,
        priority: "medium",
        recurring: true,
      })
    }

    // Weekly planning reminder
    if (now.getDay() === 0) {
      // Sunday
      newReminders.push({
        id: "weekly-planning",
        type: "checkin",
        title: "Weekly Planning",
        message: "Time to plan your week and set your priorities",
        scheduledTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
        priority: "medium",
      })
    }

    setReminders(newReminders)

    // Filter upcoming reminders (next 24 hours)
    const upcoming = newReminders
      .filter((reminder) => {
        const timeDiff = reminder.scheduledTime.getTime() - now.getTime()
        return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000
      })
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())

    setUpcomingReminders(upcoming)

    // Schedule browser notifications
    newReminders.forEach((reminder) => {
      if (reminder.scheduledTime > now) {
        scheduleReminder(reminder.title, reminder.message, reminder.scheduledTime)
      }
    })
  }

  const getSuggestedTimeForCategory = (category: string): string | null => {
    const suggestions = {
      "Physical Health": "07:00",
      "Mental Wellness": "08:00",
      Productivity: "09:00",
      Learning: "19:00",
      Relationships: "18:00",
      Financial: "20:00",
    }
    return suggestions[category] || null
  }

  const getNextOccurrence = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const nextOccurrence = new Date()
    nextOccurrence.setHours(hours, minutes, 0, 0)

    if (nextOccurrence <= new Date()) {
      nextOccurrence.setDate(nextOccurrence.getDate() + 1)
    }

    return nextOccurrence
  }

  const calculateHabitStreaks = (userData: any) => {
    const streaks = []

    if (userData.tasks) {
      Object.keys(userData.tasks).forEach((category) => {
        const categoryTasks = userData.tasks[category]
        const completedTasks = categoryTasks.filter((task: any) => task.completed)

        // Simple streak calculation - in real app, this would be more sophisticated
        const streak = {
          category,
          days: Math.min(completedTasks.length, 30), // Cap at 30 for demo
          lastCompletedDate: completedTasks.length > 0 ? new Date().toISOString() : null,
        }

        streaks.push(streak)
      })
    }

    return streaks
  }

  const handleReminderAction = (reminder: SmartReminder, action: "complete" | "snooze" | "dismiss") => {
    switch (action) {
      case "complete":
        if (reminder.taskId && onTaskComplete) {
          onTaskComplete(reminder.taskId)
          showNotification("Task Completed! 🎉", "Great job staying on track!", "success")
        }
        if (reminder.goalId && onGoalUpdate) {
          onGoalUpdate(reminder.goalId)
        }
        break
      case "snooze":
        // Snooze for 1 hour
        const snoozeTime = new Date(Date.now() + 60 * 60 * 1000)
        scheduleReminder(reminder.title, reminder.message, snoozeTime)
        break
      case "dismiss":
        // Just remove from current reminders
        break
    }

    // Remove from current reminders
    setReminders((prev) => prev.filter((r) => r.id !== reminder.id))
    setUpcomingReminders((prev) => prev.filter((r) => r.id !== reminder.id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "task":
        return Clock
      case "goal":
        return Target
      case "habit":
        return Zap
      case "checkin":
        return Calendar
      default:
        return Bell
    }
  }

  const activeReminders = reminders.filter((r) => !r.completed)

  return (
    <div className="space-y-4">
      {/* Active Reminders */}
      {activeReminders.length > 0 && (
        <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-forest-800 flex items-center gap-2">
              <Bell className="h-5 w-5 text-forest-600" />
              Active Reminders
              <Badge className="bg-forest-100 text-forest-800">{activeReminders.length}</Badge>
            </CardTitle>
            <CardDescription className="text-stone-600">
              Important notifications and suggestions for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeReminders.slice(0, 5).map((reminder) => {
              const IconComponent = getTypeIcon(reminder.type)
              return (
                <div
                  key={reminder.id}
                  className={cn(
                    "flex items-start justify-between p-3 rounded-lg border transition-all duration-200",
                    "hover:shadow-sm",
                    reminder.priority === "high"
                      ? "bg-red-50 border-red-200"
                      : reminder.priority === "medium"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-blue-50 border-blue-200",
                  )}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100">
                      <IconComponent className="h-4 w-4 text-forest-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-forest-800">{reminder.title}</h4>
                        <Badge className={getPriorityColor(reminder.priority)}>{reminder.priority}</Badge>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">{reminder.message}</p>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Clock className="h-3 w-3" />
                        <span>{reminder.scheduledTime.toLocaleString()}</span>
                        {reminder.category && (
                          <Badge variant="outline" className="text-xs">
                            {reminder.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.taskId && (
                      <Button
                        size="sm"
                        onClick={() => handleReminderAction(reminder, "complete")}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReminderAction(reminder, "snooze")}
                      className="border-forest-300 text-forest-600 hover:bg-forest-50"
                    >
                      Snooze
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReminderAction(reminder, "dismiss")}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-forest-800 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-forest-600" />
              Upcoming Reminders
            </CardTitle>
            <CardDescription className="text-stone-600">Scheduled for the next 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingReminders.map((reminder) => {
                const IconComponent = getTypeIcon(reminder.type)
                const timeUntil = reminder.scheduledTime.getTime() - Date.now()
                const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60))
                const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60))

                return (
                  <div key={reminder.id} className="flex items-center justify-between p-2 bg-forest-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-forest-600" />
                      <span className="text-sm text-forest-800">{reminder.title}</span>
                    </div>
                    <div className="text-xs text-stone-600">
                      {hoursUntil > 0 ? `${hoursUntil}h ${minutesUntil}m` : `${minutesUntil}m`}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Smart Insights */}
      <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-forest-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-forest-600" />
            Smart Insights
          </CardTitle>
          <CardDescription className="text-stone-600">
            Personalized recommendations based on your patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-earth-50 rounded-lg border border-earth-200">
              <h4 className="font-medium text-earth-800 mb-1">Peak Productivity Time</h4>
              <p className="text-sm text-stone-600">
                You complete most tasks between 9-11 AM. Consider scheduling important work during this time.
              </p>
            </div>
            <div className="p-3 bg-forest-50 rounded-lg border border-forest-200">
              <h4 className="font-medium text-forest-800 mb-1">Consistency Opportunity</h4>
              <p className="text-sm text-stone-600">
                Your Physical Health category has the lowest completion rate. Try starting with smaller, easier tasks.
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-1">Streak Building</h4>
              <p className="text-sm text-stone-600">
                You're 3 days away from a 2-week Mental Wellness streak! Keep up the great work.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
