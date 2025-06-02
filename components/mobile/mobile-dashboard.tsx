"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MobileCard, MobileGrid, MobileListItem } from "./mobile-card"
import { MobileNavigation } from "./mobile-navigation"
import { CheckCircle2, Circle, TrendingUp, Calendar, Target, Flame, Plus, Mountain, Clock, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileDashboardProps {
  userData?: any
}

export function MobileDashboard({ userData }: MobileDashboardProps) {
  const [todaysTasks, setTodaysTasks] = useState([
    { id: 1, title: "Morning meditation", completed: true, category: "Wellness" },
    { id: 2, title: "Read 30 minutes", completed: false, category: "Learning" },
    { id: 3, title: "Exercise workout", completed: false, category: "Fitness" },
    { id: 4, title: "Journal reflection", completed: false, category: "Mindfulness" },
  ])

  const [stats, setStats] = useState({
    streak: 7,
    completedToday: 1,
    totalToday: 4,
    weekProgress: 68,
    monthProgress: 45,
  })

  const toggleTask = (taskId: number) => {
    setTodaysTasks((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    )
  }

  const completedTasks = todaysTasks.filter((task) => task.completed).length
  const progressPercentage = (completedTasks / todaysTasks.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      <MobileNavigation userData={userData} unreadNotifications={2} />

      <main className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-forest-800">Good morning! 👋</h1>
          <p className="text-stone-600">Ready to conquer your mountain today?</p>
        </div>

        {/* Quick Stats */}
        <MobileGrid columns={2} gap="sm">
          <MobileCard
            title="Current Streak"
            variant="compact"
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            badge={`${stats.streak} days`}
            className="text-center"
          >
            <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
            <p className="text-xs text-stone-600">Keep it going!</p>
          </MobileCard>

          <MobileCard
            title="Today's Progress"
            variant="compact"
            icon={<Target className="h-5 w-5 text-forest-600" />}
            badge={`${completedTasks}/${todaysTasks.length}`}
            className="text-center"
          >
            <div className="space-y-2">
              <div className="text-2xl font-bold text-forest-600">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </MobileCard>
        </MobileGrid>

        {/* Today's Tasks */}
        <MobileCard
          title="Today's Tasks"
          description="Your daily mountain climb"
          badge={`${completedTasks}/${todaysTasks.length} complete`}
          icon={<CheckCircle2 className="h-5 w-5 text-forest-600" />}
          actionLabel="Add Task"
          onAction={() => console.log("Add task")}
        >
          <div className="space-y-3">
            {todaysTasks.map((task) => (
              <MobileListItem
                key={task.id}
                title={task.title}
                subtitle={task.category}
                icon={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-all duration-200 touch-manipulation",
                      task.completed
                        ? "bg-forest-600 border-forest-600 text-white hover:bg-forest-700"
                        : "border-forest-300 text-forest-600 hover:border-forest-500 hover:bg-forest-50",
                    )}
                  >
                    {task.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </Button>
                }
                action={
                  task.completed && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Done
                    </Badge>
                  )
                }
                className={cn(task.completed && "opacity-75")}
              />
            ))}
          </div>
        </MobileCard>

        {/* Progress Overview */}
        <MobileCard
          title="Progress Overview"
          description="Your transformation journey"
          icon={<TrendingUp className="h-5 w-5 text-forest-600" />}
          onClick={() => console.log("View analytics")}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">This Week</span>
                <span className="font-medium text-forest-800">{stats.weekProgress}%</span>
              </div>
              <Progress value={stats.weekProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">This Month</span>
                <span className="font-medium text-forest-800">{stats.monthProgress}%</span>
              </div>
              <Progress value={stats.monthProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-forest-600">23</div>
                <div className="text-xs text-stone-600">Tasks Done</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-forest-600">5</div>
                <div className="text-xs text-stone-600">Milestones</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-forest-600">12</div>
                <div className="text-xs text-stone-600">Journal Entries</div>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Quick Actions */}
        <MobileCard title="Quick Actions" icon={<Plus className="h-5 w-5 text-forest-600" />}>
          <MobileGrid columns={2} gap="sm">
            <Button
              variant="outline"
              className="h-16 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50 touch-manipulation"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm">Add Task</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50 touch-manipulation"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Schedule</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50 touch-manipulation"
            >
              <Mountain className="h-5 w-5" />
              <span className="text-sm">Journal</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col gap-2 border-forest-300 text-forest-700 hover:bg-forest-50 touch-manipulation"
            >
              <Star className="h-5 w-5" />
              <span className="text-sm">Milestone</span>
            </Button>
          </MobileGrid>
        </MobileCard>

        {/* Upcoming Events */}
        <MobileCard
          title="Upcoming"
          description="Next events and deadlines"
          icon={<Clock className="h-5 w-5 text-forest-600" />}
          onClick={() => console.log("View calendar")}
        >
          <div className="space-y-3">
            <MobileListItem
              title="Team meeting"
              subtitle="Today at 2:00 PM"
              description="Weekly sync with the development team"
              icon={<div className="w-3 h-3 bg-blue-500 rounded-full" />}
            />
            <MobileListItem
              title="Gym workout"
              subtitle="Tomorrow at 7:00 AM"
              description="Leg day - don't skip!"
              icon={<div className="w-3 h-3 bg-green-500 rounded-full" />}
            />
            <MobileListItem
              title="Book club"
              subtitle="Friday at 6:00 PM"
              description="Discussing 'Atomic Habits'"
              icon={<div className="w-3 h-3 bg-purple-500 rounded-full" />}
            />
          </div>
        </MobileCard>

        {/* Motivational Quote */}
        <MobileCard
          title="Daily Inspiration"
          icon={<Star className="h-5 w-5 text-yellow-500" />}
          className="bg-gradient-to-r from-forest-50 to-yellow-50 border-forest-200"
        >
          <blockquote className="text-center space-y-2">
            <p className="text-forest-800 font-medium italic">
              "The mountain you are carrying, you were only supposed to climb."
            </p>
            <footer className="text-sm text-stone-600">— Mel Robbins</footer>
          </blockquote>
        </MobileCard>
      </main>
    </div>
  )
}
