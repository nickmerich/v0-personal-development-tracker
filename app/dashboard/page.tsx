"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { MobileLayout, MobileCard } from "@/components/mobile-layout"
import { Heart, TrendingUp, Sparkles, Plus, Target, CalendarIcon, BarChart3 } from "lucide-react"
import { EnhancedProgress } from "@/components/enhanced-progress"
import { useNotifications } from "@/components/notification-provider"
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/loading-spinner"

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [overallProgress, setOverallProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("today")
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

    // Initialize missing data with mobile-friendly defaults
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
    return <PageLoader text="Loading your mountain journey..." />
  }

  if (!userData.categories || !Array.isArray(userData.categories)) {
    const defaultCategories = ["Physical Health", "Mental Wellness", "Career Growth", "Relationships"]
    userData.categories = defaultCategories
    userData.tasks = userData.tasks || {}
    defaultCategories.forEach((category) => {
      if (!userData.tasks[category]) {
        userData.tasks[category] = []
      }
    })
    localStorage.setItem("userData", JSON.stringify(userData))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <DashboardHeader name={userData.name} startDate={userData.startDate} />

      <MobileLayout>
        {/* Mobile-optimized notification system */}
        <div className="flex justify-end mb-4">
          <NotificationSystem userData={userData} onUpdateSettings={handleNotificationSettingsUpdate} />
        </div>

        {/* Quick Actions Bar - Mobile First */}
        <MobileCard className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-forest-800">Quick Actions</h2>
              <p className="text-sm text-stone-600">Jump to what matters most</p>
            </div>
            <Button
              onClick={() => router.push("/templates")}
              size="sm"
              className="bg-forest-600 text-white hover:bg-forest-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Habits
            </Button>
          </div>
        </MobileCard>

        {/* Smart Reminders - Condensed for Mobile */}
        <SmartReminders
          userData={userData}
          onTaskComplete={handleTaskComplete}
          onGoalUpdate={(goalId) => {
            showNotification("Goal Updated! 🎉", "Your progress has been recorded", "success")
          }}
        />

        {/* Progress Overview - Mobile Optimized */}
        <MobileCard className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-forest-800">Your Journey</h3>
                <p className="text-sm text-stone-600">
                  Day {calculateDayNumber(userData.startDate)} of your transformation
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-forest-600">{overallProgress}%</div>
                <div className="text-xs text-stone-500">Complete</div>
              </div>
            </div>
            <EnhancedProgress
              value={overallProgress}
              className="h-3 bg-stone-100"
              indicatorClassName="bg-gradient-to-r from-forest-500 to-forest-600"
              showAnimation={true}
              milestone={50}
            />
          </div>
        </MobileCard>

        {/* Gamification Stats - Mobile Compact */}
        <GamificationStats gamification={userData.gamification} />

        {/* Daily Affirmation - Mobile Optimized */}
        <MobileCard className="mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-forest-600" />
              <h3 className="text-lg font-semibold text-forest-800">Today's Inspiration</h3>
            </div>
            <AffirmationCarousel affirmations={userData.affirmations || []} />
          </div>
        </MobileCard>

        {/* Mobile-Optimized Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-forest-100 h-12 rounded-xl p-1">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Target className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Today</span>
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <TrendingUp className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <CalendarIcon className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <BarChart3 className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-6">
            {/* Mobile-first category grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Mobile Template Browser */}
            <MobileCard className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-forest-600" />
                      Discover New Habits
                    </h3>
                    <p className="text-sm text-stone-600">Proven templates to accelerate your growth</p>
                  </div>
                  <Button
                    onClick={() => router.push("/templates")}
                    size="sm"
                    variant="outline"
                    className="border-forest-300 text-forest-600 hover:bg-forest-50"
                  >
                    Browse All
                  </Button>
                </div>
                <TemplateQuickBrowser
                  onSelectTemplate={(templateId) => {
                    router.push(`/templates?quickAdd=${templateId}`)
                  }}
                  onBrowseAll={() => router.push("/templates")}
                />
              </div>
            </MobileCard>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4 mt-6">
            <EnhancedMilestoneTracker
              milestones={userData.milestones}
              onUpdate={(updatedMilestones) => {
                const newUserData = { ...userData }
                newUserData.milestones = updatedMilestones
                setUserData(newUserData)
                localStorage.setItem("userData", JSON.stringify(newUserData))

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

          <TabsContent value="calendar" className="space-y-4 mt-6">
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

          <TabsContent value="analytics" className="space-y-4 mt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <MobileCard>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-forest-800">Weekly Progress</h3>
                  <div className="h-48 flex items-center justify-center bg-forest-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-forest-400 mx-auto mb-2" />
                      <p className="text-stone-600 text-sm">Progress charts coming soon</p>
                    </div>
                  </div>
                </div>
              </MobileCard>

              <MobileCard>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-forest-800">Habit Streaks</h3>
                  <div className="h-48 flex items-center justify-center bg-forest-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-forest-400 mx-auto mb-2" />
                      <p className="text-stone-600 text-sm">Streak tracking coming soon</p>
                    </div>
                  </div>
                </div>
              </MobileCard>
            </div>
          </TabsContent>
        </Tabs>

        {/* My Why Section - Mobile Optimized */}
        <div className="mt-6">
          <MyWhyCard myWhy={userData.myWhy} bigGoal={userData.bigGoal} />
        </div>

        {/* Achievement Badges - Mobile Compact */}
        <div className="mt-6">
          <AchievementBadges achievements={userData.gamification.achievements} />
        </div>
      </MobileLayout>
    </div>
  )
}

function calculateDayNumber(startDate: string): number {
  try {
    const start = new Date(startDate)
    const today = new Date()

    if (isNaN(start.getTime())) {
      return 1
    }

    start.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const diffTime = today.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(diffDays, 1)
  } catch (error) {
    console.error("Error calculating day number:", error)
    return 1
  }
}
