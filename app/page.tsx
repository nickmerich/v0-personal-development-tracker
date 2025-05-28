"use client"

import { CardFooter } from "@/components/ui/card"
import {
  CircleDashed,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Target,
  Brain,
  Briefcase,
  Users,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [isUserSetup, setIsUserSetup] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      setIsUserSetup(true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 text-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-forest-600 to-forest-700 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, Alex</h1>
              <p className="text-forest-100">Day 15 of your 90-day transformation challenge</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="bg-white text-forest-600 border-white hover:bg-forest-50 hover:text-forest-700"
                onClick={() => router.push("/templates")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Browse Templates
              </Button>
              <Button
                variant="outline"
                className="bg-white text-forest-600 border-white hover:bg-forest-50 hover:text-forest-700"
              >
                Settings
              </Button>
              <Button className="bg-white text-forest-600 hover:bg-forest-50">Journal Today</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {isUserSetup ? (
          <>
            {/* Overall Progress */}
            <Card className="mb-8 border-forest-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>Your journey toward your goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">16% Complete</span>
                    <span className="text-sm text-stone-600">15/90 days</span>
                  </div>
                  <Progress value={16} className="h-2 bg-stone-100" indicatorClassName="bg-forest-500" />
                </div>
                <div className="mt-4 p-4 bg-forest-50 rounded-lg border border-forest-200">
                  <h3 className="font-semibold mb-2 text-forest-800">Your Main Goal</h3>
                  <p className="text-forest-700">Launch my online business and acquire first 10 paying customers</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mb-8 border-forest-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-forest-600" />
                  Quick Start with Templates
                </CardTitle>
                <CardDescription>Jump-start your progress with proven habit templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button
                    variant="outline"
                    className="h-auto p-4 border-forest-200 hover:bg-forest-50 flex flex-col items-start"
                    onClick={() => router.push("/templates")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-forest-600" />
                      <span className="font-medium">Morning Routine</span>
                    </div>
                    <span className="text-sm text-stone-600 text-left">Start your day with purpose and energy</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 border-forest-200 hover:bg-forest-50 flex flex-col items-start"
                    onClick={() => router.push("/templates")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-forest-600" />
                      <span className="font-medium">Mindfulness</span>
                    </div>
                    <span className="text-sm text-stone-600 text-left">Build mental clarity and reduce stress</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 border-forest-200 hover:bg-forest-50 flex flex-col items-start"
                    onClick={() => router.push("/templates")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-forest-600" />
                      <span className="font-medium">Productivity</span>
                    </div>
                    <span className="text-sm text-stone-600 text-left">Maximize focus and accomplish more</span>
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <Button
                    onClick={() => router.push("/templates")}
                    className="bg-forest-600 text-white hover:bg-forest-700"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Browse All Templates
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <h2 className="text-xl font-bold mb-4 text-forest-800">Life Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {categories.map((category) => (
                <Card
                  key={category.name}
                  className="border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-forest-100">
                          <category.icon className="h-5 w-5 text-forest-600" />
                        </div>
                        <CardTitle className="text-lg text-forest-800">{category.name}</CardTitle>
                      </div>
                      <span className="text-sm font-medium text-forest-600">{category.progress}%</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Progress
                      value={category.progress}
                      className="h-2 bg-stone-100"
                      indicatorClassName="bg-forest-500"
                    />
                    <ul className="mt-4 space-y-2">
                      {category.tasks.map((task, i) => (
                        <li key={i} className="flex items-center gap-2">
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-forest-500" />
                          ) : (
                            <CircleDashed className="h-5 w-5 text-stone-400" />
                          )}
                          <span className={task.completed ? "line-through text-stone-500" : "text-stone-700"}>
                            {task.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full text-forest-600 hover:bg-forest-50">
                      View All Tasks
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Milestones */}
            <h2 className="text-xl font-bold mb-4 text-forest-800">Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">{/* Milestones content here */}</div>

            {/* Daily Affirmations */}
            <h2 className="text-xl font-bold mb-4 text-forest-800">Daily Affirmations</h2>
            <Card className="border-forest-200 bg-white/80 backdrop-blur-sm mb-8">
              <CardContent className="pt-6">
                <div className="relative">
                  <div className="flex justify-center items-center p-8 bg-gradient-to-r from-forest-50 to-stone-50 rounded-lg border border-forest-100">
                    <p className="text-center text-lg font-medium italic text-forest-800">
                      "I am committed to consistent daily progress. Each small step brings me closer to my summit."
                    </p>
                  </div>
                  <div className="flex justify-center mt-4 gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full h-8 w-8 p-0 text-forest-600 border-forest-300 hover:bg-forest-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="rounded-full h-8 w-8 p-0 text-forest-600 border-forest-300 hover:bg-forest-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <h2 className="text-xl font-bold mb-4 text-forest-800">Weekly Analytics</h2>
            <Tabs defaultValue="progress" className="mb-8">
              <TabsList className="bg-forest-100">
                <TabsTrigger
                  value="progress"
                  className="data-[state=active]:bg-forest-600 data-[state=active]:text-white"
                >
                  Progress
                </TabsTrigger>
                <TabsTrigger
                  value="habits"
                  className="data-[state=active]:bg-forest-600 data-[state=active]:text-white"
                >
                  Habits
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="data-[state=active]:bg-forest-600 data-[state=active]:text-white"
                >
                  Insights
                </TabsTrigger>
              </TabsList>
              <TabsContent value="progress" className="p-4 border rounded-md mt-2 border-forest-200 bg-white/80">
                <div className="h-64 flex items-center justify-center bg-forest-50 rounded-md">
                  <p className="text-stone-600">Weekly progress chart will appear here</p>
                </div>
              </TabsContent>
              <TabsContent value="habits" className="p-4 border rounded-md mt-2 border-forest-200 bg-white/80">
                <div className="h-64 flex items-center justify-center bg-forest-50 rounded-md">
                  <p className="text-stone-600">Habit tracking data will appear here</p>
                </div>
              </TabsContent>
              <TabsContent value="insights" className="p-4 border rounded-md mt-2 border-forest-200 bg-white/80">
                <div className="h-64 flex items-center justify-center bg-forest-50 rounded-md">
                  <p className="text-stone-600">Insights and recommendations will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
                  <Target className="h-8 w-8 text-forest-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-forest-800">Personal Growth Tracker</CardTitle>
                <CardDescription className="text-stone-600">
                  Transform your life with purpose-driven daily actions
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <p className="text-center text-stone-700">
                  Connect with your deeper purpose, schedule meaningful actions, and track your transformation journey.
                </p>

                <Button
                  className="w-full bg-forest-600 text-white hover:bg-forest-700"
                  onClick={() => router.push("/setup/personal-info")}
                >
                  Start Your Transformation
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

// Sample data
const categories = [
  {
    name: "Physical Health",
    icon: Target,
    progress: 60,
    tasks: [
      { name: "Morning workout", completed: true },
      { name: "Healthy breakfast", completed: true },
      { name: "Evening walk", completed: false },
    ],
  },
  {
    name: "Mental Wellness",
    icon: Brain,
    progress: 40,
    tasks: [
      { name: "Meditation", completed: true },
      { name: "Gratitude journal", completed: false },
      { name: "Reading", completed: false },
    ],
  },
  {
    name: "Career Growth",
    icon: Briefcase,
    progress: 75,
    tasks: [
      { name: "Skill practice", completed: true },
      { name: "Network building", completed: true },
      { name: "Project work", completed: true },
    ],
  },
  {
    name: "Relationships",
    icon: Users,
    progress: 50,
    tasks: [
      { name: "Call family", completed: true },
      { name: "Quality time with friends", completed: false },
      { name: "Express appreciation", completed: true },
    ],
  },
]

const milestones = [
  {
    name: "Savings Goal",
    description: "Building emergency fund",
    current: 2500,
    target: 10000,
  },
  {
    name: "Fitness Goal",
    description: "Weight training progress",
    current: 3,
    target: 5,
  },
  {
    name: "Business Goal",
    description: "Acquiring first customers",
    current: 2,
    target: 10,
  },
  {
    name: "Learning Goal",
    description: "Complete online course",
    current: 4,
    target: 12,
  },
]
