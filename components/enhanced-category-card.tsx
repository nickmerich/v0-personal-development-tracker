\
Let's also update the milestone tracker to use mountain terminology:

```typescriptreact file="components/enhanced-milestone-tracker.tsx"
[v0-no-op-code-block-prefix]"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EnhancedProgress } from "@/components/enhanced-progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Target, Flag, Calendar, CheckCircle2, Sparkles, TrendingUp, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

interface Milestone {
  id: string
  title: string
  description: string
  category: string
  targetValue: number
  currentValue: number
  unit: string
  targetDate: string
  completed: boolean
  reward: string
}

interface EnhancedMilestoneTrackerProps {
  milestones: Milestone[]
  onUpdate: (milestones: Milestone[]) => void
}

export function EnhancedMilestoneTracker({ milestones, onUpdate }: EnhancedMilestoneTrackerProps) {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [updatingMilestones, setUpdatingMilestones] = useState<Set<string>>(new Set())
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    category: "",
    targetValue: 0,
    currentValue: 0,
    unit: "",
    targetDate: "",
    reward: "",
  })

  const handleAddMilestone = async () => {
    // Updated validation - only require title, allow goals without numeric targets
    if (!newMilestone.title.trim()) {
      console.error("Goal name is required")
      return
    }

    try {
      const milestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestone.title,
        description: newMilestone.description,
        category: newMilestone.category || "personal",
        targetValue: newMilestone.targetValue || 1, // Default to 1 for non-numeric goals
        currentValue: newMilestone.currentValue || 0,
        unit: newMilestone.unit || "completion",
        targetDate: newMilestone.targetDate,
        reward: newMilestone.reward,
        completed: false,
      }

      const updatedMilestones = [...milestones, milestone]
      onUpdate(updatedMilestones)

      // Reset form
      setNewMilestone({
        title: "",
        description: "",
        category: "",
        targetValue: 0,
        currentValue: 0,
        unit: "",
        targetDate: "",
        reward: "",
      })
      setIsAddingMilestone(false)

      // Success feedback
      console.log("Goal created successfully:", milestone.title)

      // Play success sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1)

        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
      } catch (e) {
        // Audio not available, continue silently
      }
    } catch (error) {
      console.error("Error creating goal:", error)
    }
  }

  const handleUpdateProgress = async (milestoneId: string, newValue: number) => {
    setUpdatingMilestones((prev) => new Set(prev).add(milestoneId))

    // Brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 200))

    const updatedMilestones = milestones.map((milestone) => {
      if (milestone.id === milestoneId) {
        const completed = newValue >= milestone.targetValue
        const wasCompleted = milestone.completed

        // Play celebration sound for new completions
        if (completed && !wasCompleted) {
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2)

            gainNode.gain.setValueAtTime(0, audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.4)
          } catch (e) {
            // Audio not available, continue silently
          }
        }

        return { ...milestone, currentValue: newValue, completed }
      }
      return milestone
    })

    onUpdate(updatedMilestones)
    setUpdatingMilestones((prev) => {
      const newSet = new Set(prev)
      newSet.delete(milestoneId)
      return newSet
    })
  }

  const completedMilestones = milestones.filter((m) => m.completed)
  const activeMilestones = milestones.filter((m) => !m.completed)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className={cn(
            "border-forest-200 bg-white/80 backdrop-blur-sm",
            "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-forest-800">Total Goals</CardTitle>
            <Flag className="h-4 w-4 text-forest-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-800">{milestones.length}</div>
            <p className="text-xs text-stone-600">Goals you've set</p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-forest-200 bg-white/80 backdrop-blur-sm",
            "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-forest-800">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-forest-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-800 flex items-center gap-2">
              {completedMilestones.length}
              {completedMilestones.length > 0 && <Sparkles className="h-4 w-4 text-earth-600 animate-pulse" />}
            </div>
            <p className="text-xs text-stone-600">Goals achieved</p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-forest-200 bg-white/80 backdrop-blur-sm",
            "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-forest-800">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-forest-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-800">
              {milestones.length > 0 ? Math.round((completedMilestones.length / milestones.length) * 100) : 0}%
            </div>
            <p className="text-xs text-stone-600">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Milestone Button */}
      <Dialog open={isAddingMilestone} onOpenChange={setIsAddingMilestone}>
        <DialogTrigger asChild>
          <Button
            className={cn(
              "bg-forest-600 text-white hover:bg-forest-700 shadow-lg",
              "transition-all duration-200 hover:scale-105 min-h-[44px]",
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Goal
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white border-forest-200 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-forest-800 flex items-center gap-2">
              <Flag className="h-5 w-5 text-forest-600" />
              Plant Your Flag
            </DialogTitle>
            <DialogDescription className="text-stone-600">
              Set a specific milestone to mark your progress up the mountain and celebrate when you reach it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-forest-800">
                Flag Name
              </Label>
              <Input
                id="title"
                placeholder="e.g., Reach $10K revenue milestone"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                className={cn(
                  "border-forest-300 focus:border-forest-500 transition-all duration-200",
                  "hover:border-forest-400 min-h-[44px]",
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-forest-800">
                Why this goal matters to you
              </Label>
              <Textarea
                id="description"
                placeholder="Describe why achieving this goal is important..."
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                className={cn(
                  "border-forest-300 focus:border-forest-500 transition-all duration-200",
                  "hover:border-forest-400 resize-none",
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-forest-800">
                  Category
                </Label>
                <Select
                  value={newMilestone.category}
                  onValueChange={(value) => setNewMilestone({ ...newMilestone, category: value })}
                >
                  <SelectTrigger
                    className={cn(
                      "border-forest-300 focus:border-forest-500 transition-all duration-200",
                      "hover:border-forest-400 min-h-[44px]",
                    )}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-forest-200">
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="career">Career & Work</SelectItem>
                    <SelectItem value="personal">Personal Growth</SelectItem>
                    <SelectItem value="relationships">Relationships</SelectItem>
                    <SelectItem value="learning">Learning & Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-forest-800">
                  Target Date
                </Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newMilestone.targetDate}
                  onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
                  className={cn(
                    "border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "hover:border-forest-400 min-h-[44px]",
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetValue" className="text-forest-800">
                  Target Amount
                </Label>
                <Input
                  id="targetValue"
                  type="number"
                  placeholder="100"
                  value={newMilestone.targetValue || ""}
                  onChange={(e) => setNewMilestone({ ...newMilestone, targetValue: Number(e.target.value) })}
                  className={cn(
                    "border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "hover:border-forest-400 min-h-[44px]",
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentValue" className="text-forest-800">
                  Current Amount
                </Label>
                <Input
                  id="currentValue"
                  type="number"
                  placeholder="0"
                  value={newMilestone.currentValue || ""}
                  onChange={(e) => setNewMilestone({ ...newMilestone, currentValue: Number(e.target.value) })}
                  className={cn(
                    "border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "hover:border-forest-400 min-h-[44px]",
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-forest-800">
                  Unit
                </Label>
                <Input
                  id="unit"
                  placeholder="dollars, lbs, days"
                  value={newMilestone.unit}
                  onChange={(e) => setNewMilestone({ ...newMilestone, unit: e.target.value })}
                  className={cn(
                    "border-forest-300 focus:border-forest-500 transition-all duration-200",
                    "hover:border-forest-400 min-h-[44px]",
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reward" className="text-forest-800">
                Reward when completed
              </Label>
              <Input
                id="reward"
                placeholder="e.g., Treat myself to a nice dinner"
                value={newMilestone.reward}
                onChange={(e) => setNewMilestone({ ...newMilestone, reward: e.target.value })}
                className={cn(
                  "border-forest-300 focus:border-forest-500 transition-all duration-200",
                  "hover:border-forest-400 min-h-[44px]",
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddMilestone}
              disabled={!newMilestone.title.trim()}
              className={cn(
                "bg-forest-600 text-white hover:bg-forest-700",
                "transition-all duration-200 hover:scale-105 min-h-[44px]",
              )}
            >
              Plant Flag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Active Goals */}
      {activeMilestones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-forest-800 mb-4 flex items-center gap-2">
            <Flag className="h-5 w-5 text-forest-600" />
            Active Goals
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {activeMilestones.map((milestone) => {
              const progress = (milestone.currentValue / milestone.targetValue) * 100
              const daysUntilTarget = milestone.targetDate
                ? Math.ceil((new Date(milestone.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null
              const isUpdating = updatingMilestones.has(milestone.id)

              return (
                <Card
                  key={milestone.id}
                  className={cn(
                    "border-forest-200 bg-white/80 backdrop-blur-sm",
                    "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                    isUpdating && "animate-pulse",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-forest-800 mb-3">{milestone.title}</CardTitle>
                        <CardDescription className="text-stone-600">{milestone.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-forest-600">{milestone.category}</div>
                        {daysUntilTarget && (
                          <div className="text-xs text-stone-600 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {daysUntilTarget > 0 ? `${daysUntilTarget} days left` : "Past target date"}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-forest-800">Progress</span>
                        <span className="text-sm font-medium text-forest-800">
                          {milestone.currentValue} / {milestone.targetValue} {milestone.unit}
                        </span>
                      </div>
                      <EnhancedProgress
                        value={progress}
                        className="h-3 bg-stone-100"
                        indicatorClassName="bg-gradient-to-r from-forest-500 to-forest-600"
                        showAnimation={true}
                        milestone={75}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Update progress"
                        className={cn(
                          "border-forest-300 focus:border-forest-500 transition-all duration-200",
                          "hover:border-forest-400 min-h-[44px]",
                        )}
                        disabled={isUpdating}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const value = Number((e.target as HTMLInputElement).value)
                            if (value >= 0) {
                              handleUpdateProgress(milestone.id, value)
                              ;(e.target as HTMLInputElement).value = ""
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className={cn(
                          "bg-forest-600 text-white hover:bg-forest-700",
                          "transition-all duration-200 hover:scale-105 min-w-[80px] min-h-[44px]",
                        )}
                        disabled={isUpdating}
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement
                          const value = Number(input.value)
                          if (value >= 0) {
                            handleUpdateProgress(milestone.id, value)
                            input.value = ""
                          }
                        }}
                      >
                        {isUpdating ? <TrendingUp className="h-4 w-4 animate-pulse" /> : "Update"}
                      </Button>
                    </div>

                    {milestone.reward && (
                      <div className="p-3 bg-earth-50 rounded-md border border-earth-200">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-earth-600" />
                          <span className="text-sm font-medium text-earth-800">Reward when completed:</span>
                        </div>
                        <p className="text-sm text-earth-700 mt-1">{milestone.reward}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedMilestones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-forest-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-forest-600" />
            Completed Goals
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedMilestones.map((milestone) => (
              <Card
                key={milestone.id}
                className={cn(
                  "border-forest-300 bg-gradient-to-r from-forest-50 to-earth-50",
                  "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-forest-800 flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-5 w-5 text-forest-600" />
                        {milestone.title}
                        <Sparkles className="h-4 w-4 text-earth-600 animate-pulse" />
                      </CardTitle>
                      <CardDescription className="text-stone-600">{milestone.description}</CardDescription>
                    </div>
                    <div className="text-sm font-medium text-forest-600">{milestone.category}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-forest-800">Goal Achieved!</span>
                    <span className="text-sm font-medium text-forest-800">
                      {milestone.targetValue} {milestone.unit}
                    </span>
                  </div>
                  <EnhancedProgress
                    value={100}
                    className="h-3 bg-stone-100"
                    indicatorClassName="bg-forest-600"
                    showAnimation={true}
                  />

                  {milestone.reward && (
                    <div className="mt-4 p-3 bg-earth-100 rounded-md border border-earth-300">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-earth-700" />
                        <span className="text-sm font-medium text-earth-800">Reward earned:</span>
                      </div>
                      <p className="text-sm text-earth-700 mt-1">{milestone.reward}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {milestones.length === 0 && (
        <Card className="border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Flag className="h-12 w-12 text-forest-600 mb-4" />
            <h3 className="text-lg font-semibold text-forest-800 mb-2">No Flags Planted</h3>
            <p className="text-stone-600 text-center mb-4">
              Plant your first flag to mark important milestones on your climb to the summit.
            </p>
            <Button
              onClick={() => setIsAddingMilestone(true)}
              className={cn(
                "bg-forest-600 text-white hover:bg-forest-700",
                "transition-all duration-200 hover:scale-105 min-h-[44px]",
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Plant Your First Flag
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
