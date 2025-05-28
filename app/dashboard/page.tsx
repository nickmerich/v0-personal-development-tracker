"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { MyWhyCard } from "@/components/my-why-card"
import { EnhancedCategoryCard } from "@/components/enhanced-category-card"
import { CalendarView } from "@/components/calendar-view"
import { AffirmationCarousel } from "@/components/affirmation-carousel"
import { EnhancedMilestoneTracker } from "@/components/enhanced-milestone-tracker"
import { AchievementBadges } from "@/components/achievement-badges"
import { GamificationStats } from "@/components/gamification-stats"
import { NotificationSystem } from "@/components/notification-system"
import { SmartReminders } from "@/components/smart-reminders"
import { TemplateQuickBrowser } from "@/components/template-quick-browser"
import { Heart, TrendingUp, Sparkles } from "lucide-react"
import { EnhancedProgress } from "@/components/enhanced-progress"
import { useNotifications } from "@/components/notification-provider"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0)
  const { showNotification, requestPermission } = useNotifications()

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")

    if (!storedUserData) {
      router.push("/")
      return
    }

    const parsedUserData = JSON.parse(storedUserData)

    if (!parsedUserData.setupCompleted) {
      router.push("/setup/personal-info")
      return
    }

    // Initialize gamification data if not present
    if (!parsedUserData.gamification) {
      parsedUserData.gamification = {
        level: 1,
        xp: 0,
        totalXp: 0,
        streak: 0,
        achievements: [],
        badges: [],
      }
    }

    if (!parsedUserData.milestones) {
      parsedUserData.milestones = []
    }

    if (!parsedUserData.journalEntries) {
      parsedUserData.journalEntries = {}
    }

    if (!parsedUserData.notificationSettings) {
      parsedUserData.notificationSettings = {
        enabled: true,
        dailyCheckin: { enabled: true, time: "09:00" },
        taskReminders: { enabled: true, advanceTime: 30 },
        goalDeadlines: { enabled: true, daysBefore: 3 },
        habitStreaks: { enabled: true, celebrateAt: 7 },
        milestones: { enabled: true, immediate: true },
        sound: { enabled: true, volume: 50 },
        channels: { browser: true, email: false, sms: false },
        quietHours: { enabled: false, start: "22:00", end: "07:00" },
      }
    }

    setUserData(parsedUserData)

    // Calculate overall progress
    if (parsedUserData.tasks) {
      let totalTasks = 0
      let completedTasks = 0

      Object.keys(parsedUserData.tasks).forEach((category) => {
        const categoryTasks = parsedUserData.tasks[category]
        totalTasks += categoryTasks.length
        completedTasks += categoryTasks.filter((task) => task.completed).length
      })

      setOverallProgress(totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0)
    }

    setLoading(false)

    // Request notification permission on first load
    requestPermission()
  }, [router, requestPermission])

  const handleTaskComplete = (taskId: string) => {
    if (!userData) return

    const newUserData = { ...userData }
    let taskFound = false

    Object.keys(newUserData.tasks).forEach((category) => {
      newUserData.tasks[category] = newUserData.tasks[category].map((task: any) => {
        if (task.id === taskId) {
          taskFound = true
          return { ...task, completed: true, completedAt: new Date().toISOString() }
        }
        return task
      })
    })

    if (taskFound) {
      setUserData(newUserData)
      localStorage.setItem("userData", JSON.stringify(newUserData))

      // Update gamification
      newUserData.gamification.xp += 10
      newUserData.gamification.totalXp += 10

      // Recalculate overall progress
      let totalTasks = 0
      let completedTasks = 0

      Object.keys(newUserData.tasks).forEach((category) => {
        const categoryTasks = newUserData.tasks[category]
        totalTasks += categoryTasks.length
        completedTasks += categoryTasks.filter((task) => task.completed).length
      })

      setOverallProgress(totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0)
    }
  }

  const handleNotificationSettingsUpdate = (settings: any) => {
    if (!userData) return

    const newUserData = { ...userData, notificationSettings: settings }
    setUserData(newUserData)
    localStorage.setItem("userData", JSON.stringify(newUserData))
  }

  if (loading || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50">
        <p className="text-forest-800">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <DashboardHeader name={userData.name} startDate={userData.startDate} />

      <main className="container mx-auto p-4">
        {/* Notification System */}
        <div className="mb-6 flex justify-end">
          <NotificationSystem userData={userData} onUpdateSettings={handleNotificationSettingsUpdate} />
        </div>

        {/* Smart Reminders */}
        <SmartReminders
          userData={userData}
          onTaskComplete={handleTaskComplete}
          onGoalUpdate={(goalId) => {
            showNotification("Goal Updated!", "Your progress has been recorded", "success")
          }}
        />

        {/* Browse Templates Quick Access */}
        <Card className="mb-6 border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-forest-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Browse Templates
              </CardTitle>
              <CardDescription className="text-stone-600">
                Discover proven habits and routines to accelerate your growth
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/templates")} className="bg-forest-600 hover:bg-forest-700 text-white">
              View All Templates
            </Button>
          </CardHeader>
          <CardContent>
            <TemplateQuickBrowser
              onSelectTemplate={(templateId) => {
                router.push(`/templates?quickAdd=${templateId}`)
              }}
              onBrowseAll={() => router.push("/templates")}
            />
          </CardContent>
        </Card>

        {/* Gamification Stats */}
        <GamificationStats gamification={userData.gamification} />

        {/* Achievement Badges */}
        <AchievementBadges achievements={userData.gamification.achievements} />

        {/* My Why Section */}
        <MyWhyCard myWhy={userData.myWhy} bigGoal={userData.bigGoal} />

        {/* Overall Progress */}
        <Card className="mb-6 border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-forest-800">Overall Progress</CardTitle>
              <CardDescription className="text-stone-600">Your personal development journey</CardDescription>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
              <TrendingUp className="h-5 w-5 text-forest-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-forest-800">{overallProgress}% Complete</span>
                <span className="text-sm text-stone-600">Day {calculateDayNumber(userData.startDate)} of 90</span>
              </div>
              <EnhancedProgress
                value={overallProgress}
                className="h-2 bg-stone-100"
                indicatorClassName="bg-forest-500"
                showAnimation={true}
                milestone={50}
              />
            </div>
          </CardContent>
        </Card>

        {/* Daily Affirmation */}
        <Card className="mb-6 border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100">
                <Heart className="h-4 w-4 text-forest-600" />
              </div>
              <CardTitle className="text-forest-800">Daily Affirmation</CardTitle>
            </div>
            <CardDescription className="text-stone-600">Positive thoughts to start your day</CardDescription>
          </CardHeader>
          <CardContent>
            <AffirmationCarousel affirmations={userData.affirmations || []} />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-forest-100">
            <TabsTrigger value="today" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              Today
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              Goals
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-forest-600 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userData.categories.map((category, index) => (
                <EnhancedCategoryCard
                  key={index}
                  category={category}
                  tasks={userData.tasks[category] || []}
                  onUpdate={(updatedTasks) => {
                    const newUserData = { ...userData }
                    newUserData.tasks[category] = updatedTasks
                    setUserData(newUserData)
                    localStorage.setItem("userData", JSON.stringify(newUserData))

                    // Recalculate overall progress
                    let totalTasks = 0
                    let completedTasks = 0

                    Object.keys(newUserData.tasks).forEach((cat) => {
                      const catTasks = newUserData.tasks[cat]
                      totalTasks += catTasks.length
                      completedTasks += catTasks.filter((task) => task.completed).length
                    })

                    setOverallProgress(totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0)

                    // Show notification for task completion
                    const completedTask = updatedTasks.find(
                      (task) =>
                        task.completed &&
                        !userData.tasks[category]?.find((oldTask) => oldTask.id === task.id && oldTask.completed),
                    )

                    if (completedTask) {
                      showNotification("Task Completed! 🎉", `Great job completing "${completedTask.text}"`, "success")
                    }
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <EnhancedMilestoneTracker
              milestones={userData.milestones}
              onUpdate={(updatedMilestones) => {
                const newUserData = { ...userData }
                newUserData.milestones = updatedMilestones
                setUserData(newUserData)
                localStorage.setItem("userData", JSON.stringify(newUserData))

                // Check for newly completed milestones
                const newlyCompleted = updatedMilestones.find(
                  (milestone) =>
                    milestone.completed &&
                    !userData.milestones?.find(
                      (oldMilestone) => oldMilestone.id === milestone.id && oldMilestone.completed,
                    ),
                )

                if (newlyCompleted) {
                  showNotification(
                    "Milestone Achieved! 🎉",
                    `Congratulations on completing "${newlyCompleted.title}"!`,
                    "success",
                  )
                }
              }}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarView
              userData={userData}
              onJournalUpdate={(date, entry) => {
                const newUserData = { ...userData }
                newUserData.journalEntries[date] = entry
                setUserData(newUserData)
                localStorage.setItem("userData", JSON.stringify(newUserData))
              }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-forest-800">Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-forest-50 rounded-md">
                    <p className="text-stone-600">Progress chart coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-forest-800">Habit Streaks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-forest-50 rounded-md">
                    <p className="text-stone-600">Streak tracking coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function calculateDayNumber(startDate: string): number {
  const start = new Date(startDate)
  const today = new Date()

  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : 1
}
