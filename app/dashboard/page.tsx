"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { useErrorHandler } from "@/components/error-boundary"
import { MOUNTAIN_COPY, getElevationMessage, getClimbingMessage, getDaysSinceStart } from "@/lib/mountain-copy"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { MyWhyCard } from "@/components/my-why-card"
import { EnhancedCategoryCard } from "@/components/enhanced-category-card"
import { CalendarView } from "@/components/calendar-view"
import { AffirmationCarousel } from "@/components/affirmation-carousel"
import { EnhancedMilestoneTracker } from "@/components/enhanced-milestone-tracker"
import { AchievementBadges } from "@/components/achievement-badges"
import { SmartReminders } from "@/components/smart-reminders"
import { MobileLayout, MobileCard } from "@/components/mobile-layout"
import { WelcomeModal } from "@/components/welcome-modal"
import { Mountain, TrendingUp, Target, BarChart3, Flag, Compass, Flame } from "lucide-react"
import { EnhancedProgress } from "@/components/enhanced-progress"
import { useNotifications } from "@/components/notification-provider"
import { PageLoader } from "@/components/loading-spinner"

export default function Dashboard() {
  const router = useRouter()
  const { userData, isLoading, error, updateUserData } = useAppStore()
  const { isAuthenticated } = useAuth()
  const { handleError } = useErrorHandler()
  const [overallProgress, setOverallProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("basecamp")
  const [streakDays, setStreakDays] = useState(0)
  const { showNotification, requestPermission } = useNotifications()

  useEffect(() => {
    try {
      if (!isLoading) {
        if (!userData) {
          router.push("/")
          return
        }

        if (!userData.setupCompleted) {
          router.push("/setup/personal-info")
          return
        }

        // Set cookies for middleware
        document.cookie = `hasUserData=true; path=/; max-age=${60 * 60 * 24 * 7}`
        document.cookie = `setupComplete=${userData.setupCompleted}; path=/; max-age=${60 * 60 * 24 * 7}`

        // Initialize missing data with mountain-themed defaults
        const updates: any = {}

        if (!userData.gamification) {
          updates.gamification = {
            level: 1,
            xp: 0,
            totalXp: 0,
            streak: 0,
            achievements: [],
            badges: [],
          }
        }

        if (!userData.milestones) {
          updates.milestones = []
        }

        if (!userData.journalEntries) {
          updates.journalEntries = {}
        }

        if (!userData.affirmations) {
          updates.affirmations = [
            "I am built for this climb",
            "Every step up makes me stronger",
            "I don't quit when it gets hard",
            "The summit is earned, not given",
            "I control my elevation",
          ]
        }

        // Ensure we have the 6 core categories
        if (!userData.categories || !Array.isArray(userData.categories)) {
          updates.categories = ["Spiritual", "Physical", "Mental", "Nutritional", "Professional", "Family"]
          updates.tasks = {}
          updates.categories.forEach((category) => {
            updates.tasks[category] = []
          })
        }

        if (Object.keys(updates).length > 0) {
          updateUserData(updates)
        }

        // Calculate overall progress and streak
        if (userData.tasks) {
          let totalTasks = 0
          let completedTasks = 0

          Object.keys(userData.tasks).forEach((category) => {
            const categoryTasks = userData.tasks[category] || []
            totalTasks += categoryTasks.length
            completedTasks += categoryTasks.filter((task) => task.completed).length
          })

          setOverallProgress(totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0)
        }

        // Calculate streak days
        if (userData.gamification?.streak) {
          setStreakDays(userData.gamification.streak)
        }

        requestPermission()
      }
    } catch (err) {
      console.error("Dashboard initialization error:", err)
      handleError(err instanceof Error ? err : new Error("Failed to initialize dashboard"))
    }
  }, [userData, isLoading, router, updateUserData, requestPermission, handleError])

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
      // Update gamification with mountain theme
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

      const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      setOverallProgress(newProgress)

      updateUserData(newUserData)

      // Show mountain-themed notification
      showNotification("🏔️ Step Completed!", getClimbingMessage(completedTasks), "success")
    }
  }

  if (isLoading || !userData) {
    return <PageLoader text="🏔️ Preparing your mountain journey..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <WelcomeModal />
      <DashboardHeader name={userData.name} startDate={userData.startDate} />

      <MobileLayout>
        {/* Mountain Journey Header */}
        <MobileCard className="mb-6 bg-gradient-to-r from-forest-600 to-forest-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Mountain className="h-6 w-6" />
                The Gryt
              </h1>
              <p className="text-forest-100 text-sm">{getDaysSinceStart(userData.startDate)}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="text-xs text-forest-200">Elevation Gained</div>
            </div>
          </div>
          <div className="mt-4">
            <EnhancedProgress
              value={overallProgress}
              className="h-2 bg-forest-800"
              indicatorClassName="bg-gradient-to-r from-earth-400 to-earth-300"
              showAnimation={true}
              milestone={50}
            />
            <p className="text-xs text-forest-200 mt-2">{getElevationMessage(overallProgress)}</p>
          </div>
        </MobileCard>

        {/* Streak Counter - Only show if enabled */}
        {streakDays > 0 && (
          <MobileCard className="mb-6 border-earth-200 bg-gradient-to-r from-earth-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-earth-800 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-earth-600" />
                  {MOUNTAIN_COPY.dashboard.daysAboveFog.title}
                </h3>
                <p className="text-sm text-earth-600">{MOUNTAIN_COPY.dashboard.daysAboveFog.subtitle}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-earth-700">{streakDays}</div>
                <div className="text-xs text-earth-600">Clean Days</div>
              </div>
            </div>
            <p className="text-xs text-earth-700 mt-2">{MOUNTAIN_COPY.dashboard.daysAboveFog.description}</p>
          </MobileCard>
        )}

        {/* Smart Reminders */}
        <SmartReminders
          userData={userData}
          onTaskComplete={handleTaskComplete}
          onGoalUpdate={(goalId) => {
            showNotification("🚩 Flag Updated!", "Your progress has been recorded", "success")
          }}
        />

        {/* Mountain-Themed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-forest-100 h-12 rounded-xl p-1">
            <TabsTrigger
              value="basecamp"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Target className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Basecamp</span>
            </TabsTrigger>
            <TabsTrigger
              value="flags"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Flag className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Flags</span>
            </TabsTrigger>
            <TabsTrigger
              value="trail"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Compass className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Trail</span>
            </TabsTrigger>
            <TabsTrigger
              value="summit"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-10 text-xs font-medium rounded-lg"
            >
              <Mountain className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Summit</span>
            </TabsTrigger>
          </TabsList>

          {/* BASECAMP CHECK-IN */}
          <TabsContent value="basecamp" className="space-y-4 mt-6">
            <MobileCard>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.basecampCheckin.title}</h2>
                  <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.basecampCheckin.subtitle}</p>
                  <p className="text-sm text-stone-600 mt-2">{MOUNTAIN_COPY.dashboard.basecampCheckin.description}</p>
                </div>
              </div>
            </MobileCard>

            {/* Category Cards with Mountain Icons */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userData.categories.map((category, index) => {
                const categoryInfo = MOUNTAIN_COPY.categories[category] || {
                  icon: "🎯",
                  description: "Track your progress",
                }
                return (
                  <EnhancedCategoryCard
                    key={index}
                    category={category}
                    tasks={userData.tasks[category] || []}
                    icon={categoryInfo.icon}
                    description={categoryInfo.description}
                    onUpdate={(updatedTasks) => {
                      const newUserData = { ...userData }
                      newUserData.tasks[category] = updatedTasks

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
                        showNotification("🏔️ Step Completed!", `Great job completing "${completedTask.text}"`, "success")
                      }

                      updateUserData(newUserData)
                    }}
                  />
                )
              })}
            </div>
          </TabsContent>

          {/* FLAGS ON THE RIDGE */}
          <TabsContent value="flags" className="space-y-4 mt-6">
            <MobileCard>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.flagsOnRidge.title}</h2>
                  <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.flagsOnRidge.subtitle}</p>
                  <p className="text-sm text-stone-600 mt-2">{MOUNTAIN_COPY.dashboard.flagsOnRidge.description}</p>
                </div>
              </div>
            </MobileCard>

            <EnhancedMilestoneTracker
              milestones={userData.milestones}
              onUpdate={(updatedMilestones) => {
                const newUserData = { ...userData }
                newUserData.milestones = updatedMilestones

                const newlyCompleted = updatedMilestones.find(
                  (milestone) =>
                    milestone.completed &&
                    !userData.milestones?.find(
                      (oldMilestone) => oldMilestone.id === milestone.id && oldMilestone.completed,
                    ),
                )

                if (newlyCompleted) {
                  showNotification(
                    "🚩 Flag Planted!",
                    `Congratulations on reaching "${newlyCompleted.title}"!`,
                    "success",
                  )
                }

                updateUserData(newUserData)
              }}
            />
          </TabsContent>

          {/* YOUR TRAIL MAP */}
          <TabsContent value="trail" className="space-y-4 mt-6">
            <MobileCard>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.trailMap.title}</h2>
                  <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.trailMap.subtitle}</p>
                  <p className="text-sm text-stone-600 mt-2">{MOUNTAIN_COPY.dashboard.trailMap.description}</p>
                </div>
              </div>
            </MobileCard>

            <CalendarView
              userData={userData}
              onJournalUpdate={(date, entry) => {
                const newUserData = { ...userData }
                newUserData.journalEntries[date] = entry
                updateUserData(newUserData)
              }}
            />
          </TabsContent>

          {/* SUMMIT MODE */}
          <TabsContent value="summit" className="space-y-4 mt-6">
            <MobileCard>
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.summitMode.title}</h2>
                  <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.summitMode.subtitle}</p>
                  <p className="text-sm text-stone-600 mt-2">{MOUNTAIN_COPY.dashboard.summitMode.description}</p>
                </div>
              </div>
            </MobileCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <MobileCard>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-forest-800">Weekly Elevation</h3>
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
                  <h3 className="text-lg font-semibold text-forest-800">Climbing Streaks</h3>
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

        {/* FUEL FOR THE CLIMB */}
        <MobileCard className="mt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-forest-600" />
              <h3 className="text-lg font-semibold text-forest-800">{MOUNTAIN_COPY.dashboard.fuelForClimb.title}</h3>
            </div>
            <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.fuelForClimb.subtitle}</p>
            <p className="text-sm text-stone-600">{MOUNTAIN_COPY.dashboard.fuelForClimb.description}</p>
            <AffirmationCarousel affirmations={userData.affirmations || []} />
          </div>
        </MobileCard>

        {/* My Why Section - Mountain Contract */}
        <div className="mt-6">
          <MyWhyCard myWhy={userData.myWhy} bigGoal={userData.bigGoal} />
        </div>

        {/* Achievement Badges - Summit Badges */}
        <div className="mt-6">
          <AchievementBadges achievements={userData.gamification.achievements} />
        </div>
      </MobileLayout>
    </div>
  )
}
