"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Plus, X, Calendar, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  scheduledDate?: string
}

interface EnhancedCategoryCardProps {
  category: string
  tasks: Task[]
  onUpdate: (tasks: Task[]) => void
}

export function EnhancedCategoryCard({ category, tasks, onUpdate }: EnhancedCategoryCardProps) {
  const [newTask, setNewTask] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set())

  const completedTasks = tasks.filter((task) => task.completed).length
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  const handleAddTask = () => {
    if (!newTask.trim()) return

    const updatedTasks = [
      ...tasks,
      {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
      },
    ]

    onUpdate(updatedTasks)
    setNewTask("")
    setIsAddingTask(false)

    // Subtle success feedback
    const button = document.querySelector(`[data-category="${category}"] .add-task-button`)
    if (button) {
      button.classList.add("animate-pulse")
      setTimeout(() => button.classList.remove("animate-pulse"), 600)
    }
  }

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Add visual feedback for completion
    setCompletingTasks((prev) => new Set(prev).add(taskId))

    // Simulate brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 150))

    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))

    onUpdate(updatedTasks)
    setCompletingTasks((prev) => {
      const newSet = new Set(prev)
      newSet.delete(taskId)
      return newSet
    })

    // Show celebration for completion
    if (!task.completed) {
      setRecentlyCompleted((prev) => new Set(prev).add(taskId))
      setTimeout(() => {
        setRecentlyCompleted((prev) => {
          const newSet = new Set(prev)
          newSet.delete(taskId)
          return newSet
        })
      }, 2000)

      // Play subtle success sound (if audio context is available)
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
        // Audio not available, continue silently
      }
    }
  }

  const handleRemoveTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    onUpdate(updatedTasks)
  }

  return (
    <Card
      className={cn(
        "border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
        "touch-manipulation", // Optimize for touch devices
      )}
      data-category={category}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-forest-800 flex items-center gap-2">
            {category}
            {progressPercentage === 100 && <Sparkles className="h-4 w-4 text-earth-600 animate-pulse" />}
          </CardTitle>
          <div className="text-right">
            <div className="text-sm font-medium text-forest-600">{progressPercentage}%</div>
          </div>
        </div>
        <CardDescription className="text-stone-600">
          {completedTasks} of {tasks.length} tasks completed
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
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

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center justify-between space-x-3 rounded-lg border p-3 transition-all duration-200",
                "hover:bg-forest-50/50 hover:border-forest-300",
                "min-h-[48px]", // Ensure minimum touch target size
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
                      "h-5 w-5 transition-all duration-200", // Larger touch target
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
                    "select-none truncate", // Prevent text selection, handle overflow
                  )}
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
                    "h-8 w-8 text-forest-600 hover:bg-forest-100 hover:text-forest-700",
                    "transition-all duration-200 hover:scale-110",
                    "touch-manipulation", // Optimize for touch
                  )}
                  onClick={() => handleRemoveTask(task.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {task.text}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isAddingTask ? (
          <div className="flex space-x-2 animate-in slide-in-from-top-2 duration-200">
            <Input
              placeholder="Enter new task..."
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
                "transition-all duration-200",
              )}
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className={cn(
                "bg-forest-600 text-white hover:bg-forest-700",
                "transition-all duration-200 hover:scale-105",
                "min-w-[60px]", // Ensure minimum touch target
              )}
            >
              Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAddingTask(false)
                setNewTask("")
              }}
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className={cn(
              "w-full border-forest-300 text-forest-600 hover:bg-forest-50",
              "transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
              "min-h-[44px] add-task-button", // Ensure minimum touch target
              "touch-manipulation",
            )}
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
