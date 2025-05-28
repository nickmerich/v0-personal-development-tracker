"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Plus, X, Calendar } from "lucide-react"

interface Task {
  id: string
  text: string
  completed: boolean
  scheduledDate?: string
}

interface CategoryCardProps {
  category: string
  tasks: Task[]
  onUpdate: (tasks: Task[]) => void
}

export function CategoryCard({ category, tasks, onUpdate }: CategoryCardProps) {
  const [newTask, setNewTask] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)

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
  }

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    onUpdate(updatedTasks)
  }

  const handleRemoveTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    onUpdate(updatedTasks)
  }

  return (
    <Card className="border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-forest-800">{category}</CardTitle>
        <CardDescription className="text-stone-600">
          {completedTasks} of {tasks.length} tasks completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progressPercentage} className="h-2 bg-stone-100" indicatorClassName="bg-forest-500" />

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between space-x-2 rounded-md border border-forest-200 p-2 bg-forest-50/50"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                  className="border-forest-300 data-[state=checked]:bg-forest-600 data-[state=checked]:border-forest-600"
                />
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-sm ${task.completed ? "line-through text-stone-500" : "text-forest-800"}`}
                >
                  {task.text}
                </label>
              </div>
              <div className="flex items-center space-x-1">
                {task.scheduledDate && <Calendar className="h-3 w-3 text-forest-600" />}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-forest-600 hover:bg-forest-100"
                  onClick={() => handleRemoveTask(task.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {isAddingTask ? (
          <div className="flex space-x-2">
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
            />
            <Button
              size="sm"
              onClick={handleAddTask}
              disabled={!newTask.trim()}
              className="bg-forest-600 text-white hover:bg-forest-700"
            >
              Add
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full border-forest-300 text-forest-600 hover:bg-forest-50"
            onClick={() => setIsAddingTask(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
