"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Mountain,
  Settings,
  User,
  Calendar,
  BarChart3,
  Plus,
  Target,
  Flag,
  Compass,
  Activity,
  BookOpen,
  Sparkles,
  CheckSquare,
  TrendingUp,
  Award,
  Bell,
  LogOut,
} from "lucide-react"
import { useSimpleAuth } from "@/components/simple-auth-provider"
import { storage } from "@/lib/storage"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useSimpleAuth()
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user data from storage
    try {
      const data = storage.getUserData()
      setUserData(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading user data:", error)
      setIsLoading(false)
    }
  }, [])

  const handleNavigation = (path: string) => {
    console.log(`🧭 Navigating to: ${path}`)
    router.push(path)
  }

  const handleTabChange = (tab: string) => {
    console.log(`📑 Switching to tab: ${tab}`)
    setActiveTab(tab)
  }

  const mockTasks = [
    { id: 1, title: "Morning meditation", category: "Spiritual", completed: true },
    { id: 2, title: "30-minute workout", category: "Physical", completed: false },
    { id: 3, title: "Read for 20 minutes", category: "Mental", completed: true },
    { id: 4, title: "Drink 8 glasses of water", category: "Nutritional", completed: false },
  ]

  const mockMilestones = [
    { id: 1, title: "Complete Week 1", progress: 100, target: 100 },
    { id: 2, title: "Establish Morning Routine", progress: 75, target: 100 },
    { id: 3, title: "Read 3 Books", progress: 33, target: 100 },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">🏔️ Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mountain className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">The Gryt Dashboard</h1>
                <p className="text-sm text-gray-600">Day 15 of 90 • 17% Complete</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                🔥 5 Day Streak
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/notifications")}>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/profile")}>
                <User className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleNavigation("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/")}>
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || userData?.name || "Climber"}! 🏔️
          </h2>
          <p className="text-gray-600">Ready to continue your transformation journey? Let's make today count.</p>
        </div>

        {/* Enhanced Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm h-14 rounded-xl p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="basecamp"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Target className="h-4 w-4" />
              <span>Basecamp</span>
            </TabsTrigger>
            <TabsTrigger
              value="flags"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Flag className="h-4 w-4" />
              <span>Flags</span>
            </TabsTrigger>
            <TabsTrigger
              value="trail"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Compass className="h-4 w-4" />
              <span>Trail</span>
            </TabsTrigger>
            <TabsTrigger
              value="summit"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <Mountain className="h-4 w-4" />
              <span>Summit</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-12 text-xs font-medium rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Quick Stats Cards */}
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Tasks Today</p>
                      <p className="text-3xl font-bold">8/12</p>
                    </div>
                    <CheckSquare className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Streak Days</p>
                      <p className="text-3xl font-bold">5</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Level</p>
                      <p className="text-3xl font-bold">3</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Progress</p>
                      <p className="text-3xl font-bold">17%</p>
                    </div>
                    <Mountain className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <Button className="h-16 flex-col gap-2" onClick={() => handleNavigation("/tasks/add")}>
                    <Plus className="h-5 w-5" />
                    Add Task
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => handleNavigation("/journal")}
                  >
                    <BookOpen className="h-5 w-5" />
                    Journal Entry
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => handleNavigation("/templates")}
                  >
                    <Sparkles className="h-5 w-5" />
                    Browse Templates
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex-col gap-2"
                    onClick={() => handleNavigation("/calendar")}
                  >
                    <Calendar className="h-5 w-5" />
                    View Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BASECAMP TAB */}
          <TabsContent value="basecamp" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🏕️ Basecamp - Today's Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="h-5 w-5 text-green-600"
                          onChange={() => console.log(`✅ Task ${task.id} toggled`)}
                        />
                        <div>
                          <p className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                            {task.title}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleNavigation(`/tasks/${task.id}`)}>
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FLAGS TAB */}
          <TabsContent value="flags" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🚩 Milestone Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockMilestones.map((milestone) => (
                    <div key={milestone.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{milestone.title}</h3>
                        <span className="text-sm text-gray-600">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRAIL TAB */}
          <TabsContent value="trail" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🗺️ Trail Map - Your Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p className="text-gray-600 mb-4">Track your daily progress and plan ahead</p>
                  <Button onClick={() => handleNavigation("/calendar")}>Open Full Calendar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUMMIT TAB */}
          <TabsContent value="summit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>⛰️ Summit View - Your Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Your Big Goal</h3>
                    <p className="text-lg text-gray-600 mb-4">{userData?.bigGoal || "Transform my life in 90 days"}</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div className="bg-green-600 h-4 rounded-full" style={{ width: "17%" }}></div>
                    </div>
                    <p className="text-sm text-gray-600">17% Complete • 75 days remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                  <p className="text-gray-600 mb-4">Detailed insights into your progress and performance</p>
                  <Button onClick={() => handleNavigation("/analytics")}>View Full Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation Test Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🧭 Navigation Test Center</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
              <Button variant="outline" onClick={() => handleNavigation("/")}>
                🏠 Home
              </Button>
              <Button variant="outline" onClick={() => handleNavigation("/setup/personal-info")}>
                👤 Profile Setup
              </Button>
              <Button variant="outline" onClick={() => handleNavigation("/templates")}>
                ✨ Templates
              </Button>
              <Button variant="outline" onClick={() => handleNavigation("/database-test")}>
                🗄️ Database Test
              </Button>
              <Button variant="outline" onClick={() => handleNavigation("/routing-test")}>
                🧪 Routing Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
