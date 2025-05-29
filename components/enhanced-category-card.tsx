"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Plus, X, Calendar, CheckCircle2, Sparkles, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

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

interface EnhancedCategoryCardProps {
  category: string
  tasks: Task[]
  onUpdate: (tasks: Task[]) => void
}

export function EnhancedCategoryCard({ category, tasks, onUpdate }: EnhancedCategoryCardProps) {
  const router = useRouter()
  const [newTask, setNewTask] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set())

  // Validate and sanitize tasks
  const validatedTasks = tasks
    .filter((task) => task && typeof task === "object" && task.id && task.text)
    .map((task) => ({
      ...task,
      id: task.id || Date.now().toString(),
      text: task.text || "Untitled Task",
      completed: Boolean(task.completed),
      priority: task.priority || "medium",
      createdAt: task.createdAt || new Date().toISOString(),
    }))

  const completedTasks = validatedTasks.filter((task) => task.completed).length
  const progressPercentage = validatedTasks.length > 0 ? Math.round((completedTasks / validatedTasks.length) * 100) : 0

  // Mobile-first display logic
  const displayTasks = isExpanded ? validatedTasks : validatedTasks.slice(0, 2)
  const hasMoreTasks = validatedTasks.length > 2

  const handleAddTask = () => {
    if (!newTask.trim()) return

    const updatedTasks = [
      ...validatedTasks,
      {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "medium" as const,
      },
    ]

    onUpdate(updatedTasks)
    setNewTask("")
    setIsAddingTask(false)

    // Haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  const handleToggleTask = async (taskId: string) => {
    const task = validatedTasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      setCompletingTasks((prev) => new Set(prev).add(taskId))

      // Optimistic UI update with animation
      await new Promise((resolve) => setTimeout(resolve, 200))

      const updatedTasks = validatedTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task,
      )

      onUpdate(updatedTasks)
      setCompletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })

      // Celebration animation for completion
      if (!task.completed) {
        setRecentlyCompleted((prev) => new Set(prev).add(taskId))
        setTimeout(() => {
          setRecentlyCompleted((prev) => {
            const newSet = new Set(prev)
            newSet.delete(taskId)
            return newSet
          })
        }, 2000)

        // Haptic feedback for completion
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }

        // Audio feedback
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)

          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.2)
        } catch (e) {
          // Audio not available
        }
      }
    } catch (error) {
      console.error("Error toggling task:", error)
      setCompletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })
    }
  }

  const handleRemoveTask = (taskId: string) => {
    const updatedTasks = validatedTasks.filter((task) => task.id !== taskId)
    onUpdate(updatedTasks)
  }

  const handleViewAllTasks = () => {
    router.push(`/tasks/${encodeURIComponent(category)}`)
  }

  return (
    <Card
      className={cn(
        "border-forest-200 bg-white/90 backdrop-blur-sm transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        "touch-manipulation",
      )}
      data-category={category}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-forest-800 flex items-center gap-2 text-base sm:text-lg">
            {category}
            {progressPercentage === 100 && <Sparkles className="h-4 w-4 text-earth-600 animate-pulse" />}
          </CardTitle>
          <div className="text-right">
            <div className="text-lg font-bold text-forest-600">{progressPercentage}%</div>
            <div className="text-xs text-stone-500">complete</div>
          </div>
        </div>
        <CardDescription className="text-stone-600 text-sm">
          {completedTasks} of {validatedTasks.length} tasks completed
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar with enhanced mobile visibility */}
        <div className="relative">
          <Progress
            value={progressPercentage}
            className="h-3 bg-stone-100 transition-all duration-500"
            indicatorClassName="bg-gradient-to-r from-forest-500 to-forest-600 transition-all duration-500"
          />
          {progressPercentage === 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-forest-500/20 to-earth-500/20 rounded-full animate-pulse" />
          )}
        </div>

        {/* Mobile-optimized task list */}
        <div className="space-y-2">
          {displayTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between space-x-3 rounded-lg border p-3 transition-all duration-200",
                "hover:bg-forest-50/50 hover:border-forest-300 active:bg-forest-100/50",
                "min-h-[52px]", // Larger touch target for mobile
                task.completed ? "bg-forest-50/30 border-forest-200" : "bg-white border-forest-200",
                completingTasks.has(task.id) && "scale-95 opacity-75",
                recentlyCompleted.has(task.id) && "animate-bounce bg-gradient-to-r from-forest-100 to-earth-100",
              )}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    className={cn(
                      "border-forest-300 data-[state=checked]:bg-forest-600 data-[state=checked]:border-forest-600",
                      "h-6 w-6 transition-all duration-200", // Larger for mobile
                      "hover:scale-110 hover:border-forest-400",
                      completingTasks.has(task.id) && "animate-pulse",
                    )}
                    disabled={completingTasks.has(task.id)}
                  />
                  {recentlyCompleted.has(task.id) && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-3 w-3 text-forest-600 animate-ping" />
                  )}
                </div>
                <label
                  htmlFor={`task-${task.id}`}
                  className={cn(
                    "text-sm cursor-pointer transition-all duration-200 flex-1 min-w-0",
                    task.completed ? "line-through text-stone-500" : "text-forest-800 hover:text-forest-900",
                    "select-none leading-relaxed", // Better line height for mobile
                  )}
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {task.text}
                </label>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {task.scheduledDate && <Calendar className="h-3 w-3 text-forest-600" />}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 text-forest-600 hover:bg-forest-100 hover:text-forest-700",
                    "transition-all duration-200 hover:scale-110 active:scale-95",
                    "touch-manipulation",
                  )}
                  onClick={() => handleRemoveTask(task.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {task.text}</span>
                </Button>
              </div>
            </div>
          ))}

          {/* Expand/Collapse button for mobile */}
          {hasMoreTasks && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-forest-600 hover:bg-forest-50 hover:text-forest-700 transition-all duration-200"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Show {validatedTasks.length - 2} More Tasks
                </>
              )}
            </Button>
          )}

          {/* View all tasks button */}
          {validatedTasks.length > 3 && (
            <div className="pt-2 border-t border-forest-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewAllTasks}
                className="w-full text-forest-600 hover:bg-forest-50 hover:text-forest-700 transition-all duration-200"
              >
                <Eye className="mr-2 h-4 w-4" />
                Manage All Tasks ({validatedTasks.length})
              </Button>
            </div>
          )}
        </div>

        {/* Mobile-optimized add task interface */}
        {isAddingTask ? (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Input
              placeholder="What would you like to accomplish?"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTask()
                } else if (e.key === "Escape") {
                  setIsAddingTask(false)
                  setNewTask("")
                }
              }}
              className={cn(
                "border-forest-300 focus:border-forest-500 focus:ring-forest-200",
                "transition-all duration-200 text-base", // Larger text for mobile
                "min-h-[48px]", // Larger touch target
              )}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleAddTask}
                disabled={!newTask.trim()}
                className={cn(
                  "bg-forest-600 text-white hover:bg-forest-700 flex-1",
                  "transition-all duration-200 hover:scale-105 active:scale-95",
                  "min-h-[48px]",
                )}
              >
                Add Task
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingTask(false)
                  setNewTask("")
                }}
                className="border-forest-300 text-forest-600 hover:bg-forest-50 min-h-[48px] px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className={cn(
              "w-full border-forest-300 text-forest-600 hover:bg-forest-50",
              "transition-all duration-200 hover:scale-[1.02] hover:shadow-sm active:scale-[0.98]",
              "min-h-[48px] add-task-button text-base",
              "touch-manipulation",
            )}
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
