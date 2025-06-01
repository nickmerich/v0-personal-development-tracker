"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useAuth } from "@/lib/auth"
import { MOUNTAIN_COPY, getDaysSinceStart } from "@/lib/mountain-copy"
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
import { EnhancedProgress } from "@/components/enhanced-progress"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { WidgetSystem } from "@/components/dashboard/widget-system"
import { setupManager } from "@/lib/setup-manager"
import { KPIService, type KPIMetrics } from "@/lib/kpi-service"
import { Mountain, Target, Flag, Compass, BarChart3, TrendingUp, Flame, Activity } from "lucide-react"
import { AdvancedDashboard } from "@/components/dashboard/advanced-dashboard"

export default function Dashboard() {
  const router = useRouter()
  const { userData, isLoading, updateUserData } = useAppStore()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate KPIs
  const metrics: KPIMetrics = useMemo(() => {
    if (!userData) {
      return {
        overallProgress: 0,
        weeklyProgress: 0,
        monthlyProgress: 0,
        streakDays: 0,
        longestStreak: 0,
        categoryProgress: {},
        categoryTrends: {},
        tasksCompleted: 0,
        tasksCompletedToday: 0,
        tasksCompletedThisWeek: 0,
        averageTasksPerDay: 0,
        milestonesCompleted: 0,
        milestonesTotal: 0,
        goalCompletionRate: 0,
        journalEntriesCount: 0,
        journalStreakDays: 0,
        lastActivityDate: new Date().toISOString(),
        progressTrend: [],
        activityHeatmap: {},
        consistencyScore: 0,
        momentumScore: 0,
        balanceScore: 0,
      }
    }
    return KPIService.calculateKPIs(userData)
  }, [userData])

  // Initialize data only once
  useEffect(() => {
    if (isLoading || isInitialized) return

    try {
      // Quick setup check without blocking
      const setupComplete = setupManager.isSetupComplete()
      if (!setupComplete) {
        const nextStep = setupManager.getNextIncompleteStep()
        router.replace(nextStep)
        return
      }

      // Initialize with defaults if needed
      if (userData && !userData.categories) {
        const defaultData = {
          categories: ["Spiritual", "Physical", "Mental", "Nutritional", "Professional", "Family"],
          tasks: {},
          gamification: {
            level: 1,
            xp: 0,
            totalXp: 0,
            streak: 0,
            achievements: [],
            badges: [],
          },
          milestones: [],
          journalEntries: {},
          affirmations: [
            "I am built for this climb",
            "Every step up makes me stronger",
            "I don't quit when it gets hard",
            "The summit is earned, not given",
            "I control my elevation",
          ],
        }

        // Initialize tasks for each category
        defaultData.categories.forEach((category) => {
          defaultData.tasks[category] = []
        })

        updateUserData({ ...userData, ...defaultData })
      }

      setIsInitialized(true)
    } catch (error) {
      console.error("Dashboard initialization error:", error)
      setIsInitialized(true)
    }
  }, [isLoading, userData, router, updateUserData, isInitialized])

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
      newUserData.gamification.xp += 10
      newUserData.gamification.totalXp += 10
      updateUserData(newUserData)
    }
  }

  // Show loading only if actually loading
  if (isLoading || !userData || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-forest-800 font-medium">🏔️ Preparing your mountain journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <WelcomeModal />
      <DashboardHeader name={userData.name} startDate={userData.startDate} />

      <MobileLayout>
        {/* Mountain Journey Header */}
        <MobileCard className="mb-6 bg-gradient-to-r from-forest-600 to-forest-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Mountain className="h-5 w-5 sm:h-6 sm:w-6" />
                The Gryt
              </h1>
              <p className="text-forest-100 text-xs sm:text-sm">
                {userData.startDate ? getDaysSinceStart(userData.startDate) : "Day 1"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold">{metrics.overallProgress}%</div>
              <div className="text-xs text-forest-200">Elevation</div>
            </div>
          </div>
          <div className="mt-4">
            <EnhancedProgress
              value={metrics.overallProgress}
              className="h-2 bg-forest-800"
              indicatorClassName="bg-gradient-to-r from-earth-400 to-earth-300"
              showAnimation={true}
              milestone={50}
            />
            <p className="text-xs text-forest-200 mt-2">
              {metrics.tasksCompleted} tasks completed • {metrics.streakDays} day streak
            </p>
          </div>
        </MobileCard>

        {/* Enhanced Tabs with Analytics */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 bg-forest-100 h-14 rounded-xl p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Activity className="h-4 w-4" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="basecamp"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Target className="h-4 w-4" />
              <span className="text-xs">Basecamp</span>
            </TabsTrigger>
            <TabsTrigger
              value="flags"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Flag className="h-4 w-4" />
              <span className="text-xs">Flags</span>
            </TabsTrigger>
            <TabsTrigger
              value="trail"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Compass className="h-4 w-4" />
              <span className="text-xs">Trail</span>
            </TabsTrigger>
            <TabsTrigger
              value="summit"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Mountain className="h-4 w-4" />
              <span className="text-xs">Summit</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-forest-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW - Analytics Dashboard */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <KPICards metrics={metrics} />
            <WidgetSystem metrics={metrics} />
          </TabsContent>

          {/* BASECAMP */}
          <TabsContent value="basecamp" className="space-y-4 mt-6">
            <MobileCard>
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.basecampCheckin.title}</h2>
                <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.basecampCheckin.subtitle}</p>
              </div>
            </MobileCard>

            <SmartReminders userData={userData} onTaskComplete={handleTaskComplete} onGoalUpdate={() => {}} />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {userData.categories?.map((category, index) => {
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
                      updateUserData(newUserData)
                    }}
                  />
                )
              })}
            </div>
          </TabsContent>

          {/* FLAGS */}
          <TabsContent value="flags" className="space-y-4 mt-6">
            <MobileCard>
              <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.flagsOnRidge.title}</h2>
              <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.flagsOnRidge.subtitle}</p>
            </MobileCard>

            <EnhancedMilestoneTracker
              milestones={userData.milestones || []}
              onUpdate={(updatedMilestones) => {
                updateUserData({ ...userData, milestones: updatedMilestones })
              }}
            />
          </TabsContent>

          {/* TRAIL */}
          <TabsContent value="trail" className="space-y-4 mt-6">
            <MobileCard>
              <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.trailMap.title}</h2>
              <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.trailMap.subtitle}</p>
            </MobileCard>

            <CalendarView
              userData={userData}
              onJournalUpdate={(date, entry) => {
                const newUserData = { ...userData }
                newUserData.journalEntries = { ...newUserData.journalEntries, [date]: entry }
                updateUserData(newUserData)
              }}
            />
          </TabsContent>

          {/* SUMMIT */}
          <TabsContent value="summit" className="space-y-4 mt-6">
            <MobileCard>
              <h2 className="text-xl font-bold text-forest-800">{MOUNTAIN_COPY.dashboard.summitMode.title}</h2>
              <p className="text-forest-600 font-medium">{MOUNTAIN_COPY.dashboard.summitMode.subtitle}</p>
            </MobileCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <MobileCard>
                <h3 className="text-lg font-semibold text-forest-800 mb-4">Weekly Elevation</h3>
                <div className="h-48 flex items-center justify-center bg-forest-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-forest-400 mx-auto mb-2" />
                    <p className="text-stone-600 text-sm">Advanced analytics in Overview tab</p>
                  </div>
                </div>
              </MobileCard>

              <MobileCard>
                <h3 className="text-lg font-semibold text-forest-800 mb-4">Climbing Streaks</h3>
                <div className="h-48 flex items-center justify-center bg-forest-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-forest-400 mx-auto mb-2" />
                    <p className="text-stone-600 text-sm">View detailed trends in Overview</p>
                  </div>
                </div>
              </MobileCard>
            </div>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-4 mt-6">
            <AdvancedDashboard userData={userData} onDataUpdate={updateUserData} />
          </TabsContent>
        </Tabs>

        {/* Affirmations */}
        <MobileCard className="mt-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-forest-600" />
              <h3 className="text-lg font-semibold text-forest-800">{MOUNTAIN_COPY.dashboard.fuelForClimb.title}</h3>
            </div>
            <AffirmationCarousel affirmations={userData.affirmations || []} />
          </div>
        </MobileCard>

        {/* My Why */}
        <MyWhyCard myWhy={userData.myWhy} bigGoal={userData.bigGoal} />

        {/* Achievements */}
        <AchievementBadges achievements={userData.gamification?.achievements || []} />
      </MobileLayout>
    </div>
  )
}
