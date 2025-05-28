"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface HabitTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  frequency: string
  tasks: string[]
  benefits: string[]
  tips: string[]
  icon: any
}

interface TemplateApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  template: HabitTemplate | null
  categories: string[]
  onApplyTemplate: (selectedTasks: string[], targetCategory: string, customizations: any) => void
}

export function TemplateApplicationModal({
  isOpen,
  onClose,
  template,
  categories,
  onApplyTemplate,
}: TemplateApplicationModalProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [targetCategory, setTargetCategory] = useState("")
  const [customizations, setCustomizations] = useState({
    startDate: new Date().toISOString().split("T")[0],
    reminderTime: "09:00",
    customGoal: "",
    notes: "",
  })

  const handleTaskToggle = (task: string) => {
    setSelectedTasks((prev) => (prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]))
  }

  const handleApply = () => {
    if (selectedTasks.length === 0 || !targetCategory) return

    onApplyTemplate(selectedTasks, targetCategory, customizations)

    // Reset form
    setSelectedTasks([])
    setTargetCategory("")
    setCustomizations({
      startDate: new Date().toISOString().split("T")[0],
      reminderTime: "09:00",
      customGoal: "",
      notes: "",
    })

    onClose()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Auto-select all tasks when template changes
  useEffect(() => {
    if (template) {
      setSelectedTasks(template.tasks)
    }
  }, [template])

  if (!template) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-forest-200 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
              <template.icon className="h-5 w-5 text-forest-600" />
            </div>
            <div>
              <DialogTitle className="text-forest-800">Apply Template: {template.name}</DialogTitle>
              <DialogDescription className="text-stone-600">
                Customize this template to fit your needs and add it to your daily routine
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Overview */}
          <Card className="border-forest-200 bg-forest-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-forest-800 text-lg">{template.name}</CardTitle>
                <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
              </div>
              <CardDescription className="text-stone-600">{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-forest-600" />
                  <span className="text-stone-700">Duration: {template.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-forest-600" />
                  <span className="text-stone-700">Frequency: {template.frequency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Selection */}
          <div>
            <h4 className="font-semibold text-forest-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-forest-600" />
              Select Tasks to Include
            </h4>
            <p className="text-sm text-stone-600 mb-4">
              Choose which tasks from this template you'd like to add to your routine. You can always modify them later.
            </p>
            <div className="space-y-2">
              {template.tasks.map((task, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
                    selectedTasks.includes(task)
                      ? "bg-forest-50 border-forest-300"
                      : "bg-white border-stone-200 hover:border-forest-200",
                  )}
                >
                  <Checkbox
                    id={`task-${index}`}
                    checked={selectedTasks.includes(task)}
                    onCheckedChange={() => handleTaskToggle(task)}
                    className="border-forest-300 data-[state=checked]:bg-forest-600 data-[state=checked]:border-forest-600 mt-0.5"
                  />
                  <label htmlFor={`task-${index}`} className="text-sm text-forest-800 cursor-pointer flex-1">
                    {task}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Selected {selectedTasks.length} of {template.tasks.length} tasks
            </p>
          </div>

          {/* Category Selection */}
          <div>
            <Label htmlFor="category" className="text-forest-800 font-semibold">
              Add to Category
            </Label>
            <p className="text-sm text-stone-600 mb-2">Choose which life area these tasks should be added to</p>
            <Select value={targetCategory} onValueChange={setTargetCategory}>
              <SelectTrigger className="border-forest-300 focus:border-forest-500">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-forest-200">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customization Options */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startDate" className="text-forest-800">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={customizations.startDate}
                onChange={(e) => setCustomizations((prev) => ({ ...prev, startDate: e.target.value }))}
                className="border-forest-300 focus:border-forest-500"
              />
            </div>
            <div>
              <Label htmlFor="reminderTime" className="text-forest-800">
                Daily Reminder Time
              </Label>
              <Input
                id="reminderTime"
                type="time"
                value={customizations.reminderTime}
                onChange={(e) => setCustomizations((prev) => ({ ...prev, reminderTime: e.target.value }))}
                className="border-forest-300 focus:border-forest-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customGoal" className="text-forest-800">
              Personal Goal (Optional)
            </Label>
            <Input
              id="customGoal"
              placeholder="e.g., Lose 10 pounds, Read 12 books this year"
              value={customizations.customGoal}
              onChange={(e) => setCustomizations((prev) => ({ ...prev, customGoal: e.target.value }))}
              className="border-forest-300 focus:border-forest-500"
            />
          </div>

          {/* Success Tips Preview */}
          <Card className="border-earth-200 bg-earth-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-earth-800 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Success Tips for This Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-stone-700">
                {template.tips.slice(0, 3).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="h-3 w-3 text-earth-600 mt-1 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-forest-300 text-forest-600 hover:bg-forest-50">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={selectedTasks.length === 0 || !targetCategory}
            className={cn(
              "bg-forest-600 text-white hover:bg-forest-700",
              "transition-all duration-200 hover:scale-105",
            )}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Add {selectedTasks.length} Tasks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
