"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  Target,
  Zap,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type:
    | "task_reminder"
    | "goal_deadline"
    | "habit_streak"
    | "daily_checkin"
    | "milestone_celebration"
    | "template_suggestion"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionable: boolean
  category?: string
  taskId?: string
  goalId?: string
  priority: "low" | "medium" | "high"
  scheduledFor?: string
}

interface NotificationSettings {
  enabled: boolean
  dailyCheckin: {
    enabled: boolean
    time: string
  }
  taskReminders: {
    enabled: boolean
    advanceTime: number // minutes before
  }
  goalDeadlines: {
    enabled: boolean
    daysBefore: number
  }
  habitStreaks: {
    enabled: boolean
    celebrateAt: number // days
  }
  milestones: {
    enabled: boolean
    immediate: boolean
  }
  sound: {
    enabled: boolean
    volume: number
  }
  channels: {
    browser: boolean
    email: boolean
    sms: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

interface NotificationSystemProps {
  userData: any
  onUpdateSettings: (settings: NotificationSettings) => void
}

export function NotificationSystem({ userData, onUpdateSettings }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    dailyCheckin: {
      enabled: true,
      time: "09:00",
    },
    taskReminders: {
      enabled: true,
      advanceTime: 30,
    },
    goalDeadlines: {
      enabled: true,
      daysBefore: 3,
    },
    habitStreaks: {
      enabled: true,
      celebrateAt: 7,
    },
    milestones: {
      enabled: true,
      immediate: true,
    },
    sound: {
      enabled: true,
      volume: 50,
    },
    channels: {
      browser: true,
      email: false,
      sms: false,
    },
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00",
    },
  })
  const [showSettings, setShowSettings] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("notificationSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }

    // Check notification permission
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission)
    }

    // Generate initial notifications
    generateNotifications()
  }, [userData])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)
      return permission === "granted"
    }
    return false
  }

  const generateNotifications = () => {
    const newNotifications: Notification[] = []
    const now = new Date()

    // Daily check-in reminder
    if (settings.dailyCheckin.enabled) {
      const checkinTime = new Date()
      const [hours, minutes] = settings.dailyCheckin.time.split(":")
      checkinTime.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0)

      if (checkinTime <= now) {
        checkinTime.setDate(checkinTime.getDate() + 1)
      }

      newNotifications.push({
        id: `checkin-${Date.now()}`,
        type: "daily_checkin",
        title: "Daily Check-in Time",
        message: "Take a moment to review your progress and plan your day",
        timestamp: checkinTime.toISOString(),
        read: false,
        actionable: true,
        priority: "medium",
        scheduledFor: checkinTime.toISOString(),
      })
    }

    // Task reminders
    if (settings.taskReminders.enabled && userData.tasks) {
      Object.keys(userData.tasks).forEach((category) => {
        userData.tasks[category].forEach((task: any) => {
          if (!task.completed && task.scheduledDate) {
            const taskDate = new Date(task.scheduledDate)
            const reminderTime = new Date(taskDate.getTime() - settings.taskReminders.advanceTime * 60000)

            if (reminderTime > now) {
              newNotifications.push({
                id: `task-${task.id}`,
                type: "task_reminder",
                title: "Task Reminder",
                message: `Don't forget: ${task.text}`,
                timestamp: reminderTime.toISOString(),
                read: false,
                actionable: true,
                category,
                taskId: task.id,
                priority: "medium",
                scheduledFor: reminderTime.toISOString(),
              })
            }
          }
        })
      })
    }

    // Goal deadline reminders
    if (settings.goalDeadlines.enabled && userData.milestones) {
      userData.milestones.forEach((milestone: any) => {
        if (!milestone.completed && milestone.targetDate) {
          const deadlineDate = new Date(milestone.targetDate)
          const reminderDate = new Date(
            deadlineDate.getTime() - settings.goalDeadlines.daysBefore * 24 * 60 * 60 * 1000,
          )

          if (reminderDate > now && reminderDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
            newNotifications.push({
              id: `goal-${milestone.id}`,
              type: "goal_deadline",
              title: "Goal Deadline Approaching",
              message: `${milestone.title} is due in ${settings.goalDeadlines.daysBefore} days`,
              timestamp: reminderDate.toISOString(),
              read: false,
              actionable: true,
              goalId: milestone.id,
              priority: "high",
              scheduledFor: reminderDate.toISOString(),
            })
          }
        }
      })
    }

    // Habit streak celebrations
    if (settings.habitStreaks.enabled) {
      // Mock streak data - in real app, this would be calculated from task completion history
      const streaks = [
        { category: "Physical Health", days: 7 },
        { category: "Mental Wellness", days: 14 },
      ]

      streaks.forEach((streak) => {
        if (streak.days >= settings.habitStreaks.celebrateAt && streak.days % settings.habitStreaks.celebrateAt === 0) {
          newNotifications.push({
            id: `streak-${streak.category}-${streak.days}`,
            type: "habit_streak",
            title: "Streak Achievement! 🔥",
            message: `Amazing! You've maintained your ${streak.category} habits for ${streak.days} days straight!`,
            timestamp: now.toISOString(),
            read: false,
            actionable: false,
            category: streak.category,
            priority: "high",
          })
        }
      })
    }

    // Milestone celebrations
    if (settings.milestones.enabled) {
      // Check for recently completed milestones
      if (userData.milestones) {
        userData.milestones.forEach((milestone: any) => {
          if (milestone.completed && milestone.currentValue >= milestone.targetValue) {
            const completionDate = new Date(milestone.completedDate || now)
            const timeSinceCompletion = now.getTime() - completionDate.getTime()

            // Show celebration for milestones completed in the last hour
            if (timeSinceCompletion < 60 * 60 * 1000) {
              newNotifications.push({
                id: `milestone-${milestone.id}`,
                type: "milestone_celebration",
                title: "Milestone Achieved! 🎉",
                message: `Congratulations! You've completed: ${milestone.title}`,
                timestamp: now.toISOString(),
                read: false,
                actionable: false,
                goalId: milestone.id,
                priority: "high",
              })
            }
          }
        })
      }
    }

    // Template suggestions based on incomplete categories
    if (userData.tasks) {
      Object.keys(userData.tasks).forEach((category) => {
        const categoryTasks = userData.tasks[category]
        const completionRate =
          categoryTasks.length > 0 ? categoryTasks.filter((t: any) => t.completed).length / categoryTasks.length : 0

        if (completionRate < 0.3 && categoryTasks.length < 3) {
          newNotifications.push({
            id: `template-${category}`,
            type: "template_suggestion",
            title: "Boost Your Progress",
            message: `Consider adding habit templates to improve your ${category} routine`,
            timestamp: now.toISOString(),
            read: false,
            actionable: true,
            category,
            priority: "low",
          })
        }
      })
    }

    setNotifications((prev) => [...prev, ...newNotifications])
  }

  const scheduleNotification = (notification: Notification) => {
    if (!settings.enabled || permissionStatus !== "granted") return

    const scheduledTime = new Date(notification.scheduledFor || notification.timestamp)
    const now = new Date()
    const delay = scheduledTime.getTime() - now.getTime()

    if (delay > 0) {
      setTimeout(() => {
        showBrowserNotification(notification)
        playNotificationSound()
      }, delay)
    }
  }

  const showBrowserNotification = (notification: Notification) => {
    if (!settings.channels.browser || permissionStatus !== "granted") return

    // Check quiet hours
    if (settings.quietHours.enabled) {
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      if (currentTime >= settings.quietHours.start || currentTime <= settings.quietHours.end) {
        return // Don't show notification during quiet hours
      }
    }

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: notification.id,
      requireInteraction: notification.priority === "high",
      silent: !settings.sound.enabled,
    })

    browserNotification.onclick = () => {
      window.focus()
      markAsRead(notification.id)
      browserNotification.close()
    }

    // Auto-close after 5 seconds for low priority notifications
    if (notification.priority === "low") {
      setTimeout(() => browserNotification.close(), 5000)
    }
  }

  const playNotificationSound = () => {
    if (!settings.sound.enabled) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime((settings.sound.volume / 100) * 0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      console.log("Audio not available")
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    localStorage.setItem("notificationSettings", JSON.stringify(newSettings))
    onUpdateSettings(newSettings)
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
      case "task_reminder":
        return Clock
      case "goal_deadline":
        return Target
      case "habit_streak":
        return Zap
      case "daily_checkin":
        return Calendar
      case "milestone_celebration":
        return CheckCircle2
      case "template_suggestion":
        return Bell
      default:
        return Bell
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-4">
      {/* Notification Bell with Badge */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="relative border-forest-300 text-forest-600 hover:bg-forest-50"
          onClick={() => setShowSettings(true)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-white border-forest-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-forest-800 flex items-center gap-2">
              <Bell className="h-5 w-5 text-forest-600" />
              Notifications & Reminders
            </DialogTitle>
            <DialogDescription className="text-stone-600">
              Manage your notification preferences and view recent alerts
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-forest-100">
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-forest-600 data-[state=active]:text-white"
              >
                Recent Notifications
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-forest-600 data-[state=active]:text-white"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              {/* Permission Request */}
              {permissionStatus !== "granted" && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800 text-sm">Enable Browser Notifications</CardTitle>
                    <CardDescription className="text-yellow-700">
                      Allow notifications to receive timely reminders for your tasks and goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={requestNotificationPermission}
                      className="bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                      Enable Notifications
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <Card className="border-forest-200">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Bell className="h-12 w-12 text-stone-400 mb-4" />
                      <h3 className="text-lg font-semibold text-stone-600 mb-2">No notifications yet</h3>
                      <p className="text-stone-500 text-center">
                        You'll see reminders and updates here as you use the app
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  notifications
                    .slice()
                    .reverse()
                    .map((notification) => {
                      const IconComponent = getTypeIcon(notification.type)
                      return (
                        <Card
                          key={notification.id}
                          className={cn(
                            "border-forest-200 transition-all duration-200",
                            !notification.read && "bg-forest-50/50 border-forest-300",
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100">
                                  <IconComponent className="h-4 w-4 text-forest-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-forest-800">{notification.title}</h4>
                                    <Badge className={getPriorityColor(notification.priority)}>
                                      {notification.priority}
                                    </Badge>
                                    {!notification.read && <div className="w-2 h-2 bg-forest-600 rounded-full" />}
                                  </div>
                                  <p className="text-sm text-stone-600 mb-2">{notification.message}</p>
                                  <div className="flex items-center gap-4 text-xs text-stone-500">
                                    <span>{new Date(notification.timestamp).toLocaleString()}</span>
                                    {notification.category && (
                                      <span className="bg-stone-100 px-2 py-1 rounded">{notification.category}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-forest-600 hover:bg-forest-100"
                                  >
                                    Mark Read
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => dismissNotification(notification.id)}
                                  className="text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Master Toggle */}
              <Card className="border-forest-200">
                <CardHeader>
                  <CardTitle className="text-forest-800">Master Settings</CardTitle>
                  <CardDescription className="text-stone-600">Control all notifications from here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-forest-800">Enable All Notifications</Label>
                      <p className="text-sm text-stone-600">Turn all notifications on or off</p>
                    </div>
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) => updateSettings({ ...settings, enabled: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Types */}
              <Card className="border-forest-200">
                <CardHeader>
                  <CardTitle className="text-forest-800">Notification Types</CardTitle>
                  <CardDescription className="text-stone-600">
                    Choose which types of notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Daily Check-in */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-forest-800">Daily Check-in</Label>
                        <p className="text-sm text-stone-600">Remind me to review my progress daily</p>
                      </div>
                      <Switch
                        checked={settings.dailyCheckin.enabled}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            dailyCheckin: { ...settings.dailyCheckin, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {settings.dailyCheckin.enabled && (
                      <div className="ml-4">
                        <Label className="text-forest-800">Check-in Time</Label>
                        <Select
                          value={settings.dailyCheckin.time}
                          onValueChange={(value) =>
                            updateSettings({
                              ...settings,
                              dailyCheckin: { ...settings.dailyCheckin, time: value },
                            })
                          }
                        >
                          <SelectTrigger className="w-48 border-forest-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="07:00">7:00 AM</SelectItem>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                            <SelectItem value="18:00">6:00 PM</SelectItem>
                            <SelectItem value="19:00">7:00 PM</SelectItem>
                            <SelectItem value="20:00">8:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Task Reminders */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-forest-800">Task Reminders</Label>
                        <p className="text-sm text-stone-600">Get reminded about scheduled tasks</p>
                      </div>
                      <Switch
                        checked={settings.taskReminders.enabled}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            taskReminders: { ...settings.taskReminders, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {settings.taskReminders.enabled && (
                      <div className="ml-4">
                        <Label className="text-forest-800">Remind me</Label>
                        <Select
                          value={settings.taskReminders.advanceTime.toString()}
                          onValueChange={(value) =>
                            updateSettings({
                              ...settings,
                              taskReminders: { ...settings.taskReminders, advanceTime: Number.parseInt(value) },
                            })
                          }
                        >
                          <SelectTrigger className="w-48 border-forest-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes before</SelectItem>
                            <SelectItem value="30">30 minutes before</SelectItem>
                            <SelectItem value="60">1 hour before</SelectItem>
                            <SelectItem value="120">2 hours before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Goal Deadlines */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-forest-800">Goal Deadlines</Label>
                        <p className="text-sm text-stone-600">Get warned about approaching deadlines</p>
                      </div>
                      <Switch
                        checked={settings.goalDeadlines.enabled}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            goalDeadlines: { ...settings.goalDeadlines, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {settings.goalDeadlines.enabled && (
                      <div className="ml-4">
                        <Label className="text-forest-800">Warn me</Label>
                        <Select
                          value={settings.goalDeadlines.daysBefore.toString()}
                          onValueChange={(value) =>
                            updateSettings({
                              ...settings,
                              goalDeadlines: { ...settings.goalDeadlines, daysBefore: Number.parseInt(value) },
                            })
                          }
                        >
                          <SelectTrigger className="w-48 border-forest-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day before</SelectItem>
                            <SelectItem value="3">3 days before</SelectItem>
                            <SelectItem value="7">1 week before</SelectItem>
                            <SelectItem value="14">2 weeks before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Habit Streaks */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-forest-800">Habit Streak Celebrations</Label>
                        <p className="text-sm text-stone-600">Celebrate when you maintain habits</p>
                      </div>
                      <Switch
                        checked={settings.habitStreaks.enabled}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            habitStreaks: { ...settings.habitStreaks, enabled: checked },
                          })
                        }
                      />
                    </div>
                    {settings.habitStreaks.enabled && (
                      <div className="ml-4">
                        <Label className="text-forest-800">Celebrate every</Label>
                        <Select
                          value={settings.habitStreaks.celebrateAt.toString()}
                          onValueChange={(value) =>
                            updateSettings({
                              ...settings,
                              habitStreaks: { ...settings.habitStreaks, celebrateAt: Number.parseInt(value) },
                            })
                          }
                        >
                          <SelectTrigger className="w-48 border-forest-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sound Settings */}
              <Card className="border-forest-200">
                <CardHeader>
                  <CardTitle className="text-forest-800">Sound & Channels</CardTitle>
                  <CardDescription className="text-stone-600">Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.sound.enabled ? (
                        <Volume2 className="h-4 w-4 text-forest-600" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-stone-400" />
                      )}
                      <Label className="text-forest-800">Sound Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.sound.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          ...settings,
                          sound: { ...settings.sound, enabled: checked },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-forest-800">Notification Channels</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-forest-600" />
                          <span className="text-sm">Browser Notifications</span>
                        </div>
                        <Switch
                          checked={settings.channels.browser}
                          onCheckedChange={(checked) =>
                            updateSettings({
                              ...settings,
                              channels: { ...settings.channels, browser: checked },
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-stone-400" />
                          <span className="text-sm text-stone-500">Email (Coming Soon)</span>
                        </div>
                        <Switch disabled checked={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-stone-400" />
                          <span className="text-sm text-stone-500">SMS (Coming Soon)</span>
                        </div>
                        <Switch disabled checked={false} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quiet Hours */}
              <Card className="border-forest-200">
                <CardHeader>
                  <CardTitle className="text-forest-800">Quiet Hours</CardTitle>
                  <CardDescription className="text-stone-600">
                    Set times when you don't want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-forest-800">Enable Quiet Hours</Label>
                      <p className="text-sm text-stone-600">Pause notifications during specified times</p>
                    </div>
                    <Switch
                      checked={settings.quietHours.enabled}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          ...settings,
                          quietHours: { ...settings.quietHours, enabled: checked },
                        })
                      }
                    />
                  </div>
                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-forest-800">Start Time</Label>
                        <Select
                          value={settings.quietHours.start}
                          onValueChange={(value) =>
                            updateSettings({
                              ...settings,
                              quietHours: { ...settings.quietHours, start: value },
                            })
                          }
                        >
                          <SelectTrigger className="border-forest-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20:00">8:00 PM</SelectItem>
                            <SelectItem value="21:00">9:00 PM</SelectItem>
                            <SelectItem value="22:00">10:00 PM</SelectItem>
                            <SelectItem value="23:00">11:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-forest-800">End Time</Label>
                        <Select
                          value={settings.quietHours.end}
                          onValueChange={(value) =>
                            updateSettings({
                              ...settings,
                              quietHours: { ...settings.quietHours, end: value },
                            })
                          }
                        >
                          <SelectTrigger className="border-forest-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="06:00">6:00 AM</SelectItem>
                            <SelectItem value="07:00">7:00 AM</SelectItem>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={() => setShowSettings(false)} className="bg-forest-600 text-white hover:bg-forest-700">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
