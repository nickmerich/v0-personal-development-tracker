"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Dumbbell, Brain, Briefcase, Book, Users, Target, Sparkles, ArrowRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickTemplate {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  icon: any
  taskCount: number
  popularityScore: number
}

const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: "morning-workout",
    name: "Morning Workout",
    description: "Start your day with energy",
    category: "Health & Fitness",
    difficulty: "Beginner",
    duration: "30 min",
    icon: Dumbbell,
    taskCount: 5,
    popularityScore: 95,
  },
  {
    id: "mindfulness-practice",
    name: "Daily Mindfulness",
    description: "Cultivate present-moment awareness",
    category: "Mental Wellness",
    difficulty: "Beginner",
    duration: "10-20 min",
    icon: Brain,
    taskCount: 5,
    popularityScore: 92,
  },
  {
    id: "morning-routine",
    name: "Productive Morning",
    description: "Start each day with intention",
    category: "Productivity",
    difficulty: "Beginner",
    duration: "60-90 min",
    icon: Briefcase,
    taskCount: 5,
    popularityScore: 88,
  },
  {
    id: "daily-reading",
    name: "Daily Reading",
    description: "Expand your knowledge daily",
    category: "Learning",
    difficulty: "Beginner",
    duration: "20-30 min",
    icon: Book,
    taskCount: 5,
    popularityScore: 85,
  },
  {
    id: "relationship-building",
    name: "Strengthen Relationships",
    description: "Nurture personal connections",
    category: "Relationships",
    difficulty: "Beginner",
    duration: "30 min",
    icon: Users,
    taskCount: 5,
    popularityScore: 82,
  },
  {
    id: "financial-wellness",
    name: "Financial Health",
    description: "Build better money habits",
    category: "Financial",
    difficulty: "Intermediate",
    duration: "15-30 min",
    icon: Target,
    taskCount: 5,
    popularityScore: 78,
  },
]

interface TemplateQuickBrowserProps {
  onSelectTemplate: (templateId: string) => void
  onBrowseAll: () => void
}

export function TemplateQuickBrowser({ onSelectTemplate, onBrowseAll }: TemplateQuickBrowserProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<QuickTemplate | null>(null)

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

  const getPopularityLabel = (score: number) => {
    if (score >= 90) return "Most Popular"
    if (score >= 80) return "Popular"
    return "Trending"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-forest-800">Popular Templates</h3>
          <p className="text-sm text-stone-600">Quick-start your journey with these proven habits</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onBrowseAll}
          className="border-forest-300 text-forest-600 hover:bg-forest-50"
        >
          Browse All
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      {/* Quick Templates Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {QUICK_TEMPLATES.slice(0, 6).map((template) => {
          const IconComponent = template.icon
          return (
            <Card
              key={template.id}
              className={cn(
                "border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-200",
                "hover:scale-[1.02] cursor-pointer relative overflow-hidden",
              )}
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Popularity Badge */}
              {template.popularityScore >= 90 && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                    <Sparkles className="h-2 w-2 mr-1" />
                    {getPopularityLabel(template.popularityScore)}
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-100 flex-shrink-0">
                    <IconComponent className="h-3 w-3 text-forest-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-forest-800 text-sm leading-tight">{template.name}</CardTitle>
                    <CardDescription className="text-stone-600 text-xs leading-tight">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-stone-600">
                    <Clock className="h-2 w-2" />
                    {template.duration}
                  </div>
                </div>

                <div className="text-xs text-stone-600">
                  {template.taskCount} tasks • {template.category}
                </div>

                <Button
                  size="sm"
                  className="w-full bg-forest-600 text-white hover:bg-forest-700 text-xs h-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectTemplate(template.id)
                  }}
                >
                  Quick Add
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="bg-white border-forest-200 max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100">
                  <selectedTemplate.icon className="h-4 w-4 text-forest-600" />
                </div>
                <div>
                  <DialogTitle className="text-forest-800">{selectedTemplate.name}</DialogTitle>
                  <DialogDescription className="text-stone-600">{selectedTemplate.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-forest-50 rounded-lg">
                  <div className="text-sm font-medium text-forest-800">{selectedTemplate.taskCount}</div>
                  <div className="text-xs text-stone-600">Tasks</div>
                </div>
                <div className="p-2 bg-forest-50 rounded-lg">
                  <div className="text-sm font-medium text-forest-800">{selectedTemplate.duration}</div>
                  <div className="text-xs text-stone-600">Duration</div>
                </div>
                <div className="p-2 bg-forest-50 rounded-lg">
                  <Badge className={getDifficultyColor(selectedTemplate.difficulty)} variant="outline">
                    {selectedTemplate.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-forest-300 text-forest-600 hover:bg-forest-50"
                  onClick={() => {
                    setSelectedTemplate(null)
                    onBrowseAll()
                  }}
                >
                  View Details
                </Button>
                <Button
                  className="flex-1 bg-forest-600 text-white hover:bg-forest-700"
                  onClick={() => {
                    onSelectTemplate(selectedTemplate.id)
                    setSelectedTemplate(null)
                  }}
                >
                  Quick Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
