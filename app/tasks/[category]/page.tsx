"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Calendar, Filter, Search, CheckCircle2, Clock, Target, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { PageLoader } from "@/components/loading-spinner"

interface Task {
  id: string
  text: string
  completed: boolean
  scheduledDate?: string
  priority?: "low" | "medium" | "high"
  createdAt?: string
  completedAt?: string
  tags?: string[]
}

export default function CategoryTasksPage() {
  const router = useRouter()
  const params = useParams()
  const category = decodeURIComponent(params.category as string)

  const [userData, setUserData] = useState<any>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "low" | "medium" | "high">("all")
  const [sortBy, setSortBy] = useState<"created" | "priority" | "alphabetical">("created")

  useEffect(() => {
    try {
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

      setUserData(parsedUserData)

      // Get tasks for this category with validation
      const categoryTasks = parsedUserData.tasks?.[category] || []

      // Ensure all tasks have required properties
      const validatedTasks = categoryTasks.map((task) => ({
        id: task.id || Date.now().toString(),
        text: task.text || "Untitled Task",
        completed: Boolean(task.completed),
        scheduledDate: task.scheduledDate,
        priority: task.priority || "medium",
        createdAt: task.createdAt || new Date().toISOString(),
        completedAt: task.completedAt,
        tags: task.tags || [],
      }))

      setTasks(validatedTasks)
      setFilteredTasks(validatedTasks)
      setLoading(false)
    } catch (error) {
      console.error("Error loading tasks:", error)
      router.push("/dashboard")
    }
  }, [category, router])

  // Filter and sort tasks
  useEffect(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((task) => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => (filterStatus === "completed" ? task.completed : !task.completed))
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (priorityOrder[b.priority || "medium"] || 2) - (priorityOrder[a.priority || "medium"] || 2)
        case "alphabetical":
          return a.text.localeCompare(b.text)
        case "created":
        default:
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      }
    })

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy])

  const handleAddTask = () => {
    if (!newTask.trim() || !userData) return

    try {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "medium",
      }

      const updatedTasks = [...tasks, newTaskObj]
      setTasks(updatedTasks)

      // Update userData with validation
      const newUserData = { ...userData }
      if (!newUserData.tasks) {
        newUserData.tasks = {}
      }
      newUserData.tasks[category] = updatedTasks
      setUserData(newUserData)
      localStorage.setItem("userData", JSON.stringify(newUserData))

      setNewTask("")
    } catch (error) {
      console.error("Error adding task:", error)
      alert("There was an error adding the task. Please try again.")
    }
  }

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined,
          }
        : task,
    )

    setTasks(updatedTasks)

    // Update userData
    if (userData) {
      const newUserData = { ...userData }
      newUserData.tasks[category] = updatedTasks
      setUserData(newUserData)
      localStorage.setItem("userData", JSON.stringify(newUserData))
    }
  }

  const handleRemoveTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)

    // Update userData
    if (userData) {
      const newUserData = { ...userData }
      newUserData.tasks[category] = updatedTasks
      setUserData(newUserData)
      localStorage.setItem("userData", JSON.stringify(newUserData))
    }
  }

  const handleUpdateTaskPriority = (taskId: string, priority: "low" | "medium" | "high") => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, priority } : task))

    setTasks(updatedTasks)

    // Update userData
    if (userData) {
      const newUserData = { ...userData }
      newUserData.tasks[category] = updatedTasks
      setUserData(newUserData)
      localStorage.setItem("userData", JSON.stringify(newUserData))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  if (loading) {
    return <PageLoader text="Loading tasks..." />
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="default"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="space-y-1">
                <h1 className="text-2xl lg:text-3xl font-bold">{category} Tasks</h1>
                <p className="text-forest-100 text-base lg:text-lg">
                  {completedTasks} of {tasks.length} tasks completed ({progressPercentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl">
        {/* Progress Overview */}
        <Card className="border-forest-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-6 w-6" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-forest-800">{progressPercentage}% Complete</span>
                <span className="text-sm text-stone-600">
                  {completedTasks}/{tasks.length} tasks
                </span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-3 bg-stone-100"
                indicatorClassName="bg-gradient-to-r from-forest-500 to-forest-600"
              />

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-forest-600">{tasks.filter((t) => !t.completed).length}</div>
                  <div className="text-sm text-stone-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
                  <div className="text-sm text-stone-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {tasks.filter((t) => t.priority === "high").length}
                  </div>
                  <div className="text-sm text-stone-600">High Priority</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Task */}
        <Card className="border-forest-200">
          <CardHeader>
            <CardTitle className="text-xl">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-3">
              <Input
                placeholder="Enter new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTask()
                  }
                }}
                className="border-forest-300 focus:border-forest-500"
                size="lg"
              />
              <Button
                onClick={handleAddTask}
                disabled={!newTask.trim()}
                size="lg"
                className="bg-forest-600 text-white hover:bg-forest-700 shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="border-forest-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Filter className="h-6 w-6" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-forest-300 focus:border-forest-500"
                  size="lg"
                />
              </div>

              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="border-forest-300 h-12">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                <SelectTrigger className="border-forest-300 h-12">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="border-forest-300 h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card className="border-forest-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Tasks ({filteredTasks.length})
            </CardTitle>
            <CardDescription className="text-base">
              {filteredTasks.length === tasks.length
                ? "Showing all tasks"
                : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-stone-400 mb-4">
                    <CheckCircle2 className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-stone-600 text-base">
                    {tasks.length === 0
                      ? "No tasks yet. Add your first task above!"
                      : "No tasks match your current filters."}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between space-x-4 rounded-xl border p-4 transition-all duration-200",
                      "hover:bg-forest-50/50 hover:border-forest-300 min-h-[80px]",
                      task.completed ? "bg-forest-50/30 border-forest-200" : "bg-white border-forest-200",
                    )}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="border-forest-300 data-[state=checked]:bg-forest-600 data-[state=checked]:border-forest-600 h-6 w-6"
                      />

                      <div className="flex-1 min-w-0 space-y-2">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={cn(
                            "text-base cursor-pointer transition-all duration-200 block",
                            task.completed ? "line-through text-stone-500" : "text-forest-800 hover:text-forest-900",
                          )}
                        >
                          {task.text}
                        </label>

                        <div className="flex items-center space-x-3">
                          <Badge className={cn("text-xs", getPriorityColor(task.priority || "medium"))}>
                            {task.priority || "medium"}
                          </Badge>

                          {task.createdAt && (
                            <span className="text-xs text-stone-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          )}

                          {task.scheduledDate && (
                            <span className="text-xs text-forest-600 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Scheduled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Select
                        value={task.priority || "medium"}
                        onValueChange={(value: any) => handleUpdateTaskPriority(task.id, value)}
                      >
                        <SelectTrigger className="w-28 h-10 text-sm border-forest-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-forest-600 hover:bg-forest-100 hover:text-forest-700"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove {task.text}</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
