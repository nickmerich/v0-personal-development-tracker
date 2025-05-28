"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, Zap } from "lucide-react"

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  taskCount: number
  popularity: number
  tags: string[]
}

const popularTemplates: Template[] = [
  {
    id: "morning-routine",
    title: "Morning Routine",
    description: "Start your day with purpose and energy",
    category: "Health & Wellness",
    difficulty: "Beginner",
    duration: "30 days",
    taskCount: 5,
    popularity: 95,
    tags: ["morning", "routine", "energy"],
  },
  {
    id: "fitness-foundation",
    title: "Fitness Foundation",
    description: "Build a sustainable exercise habit",
    category: "Health & Wellness",
    difficulty: "Beginner",
    duration: "21 days",
    taskCount: 4,
    popularity: 88,
    tags: ["fitness", "exercise", "health"],
  },
  {
    id: "mindfulness-practice",
    title: "Mindfulness Practice",
    description: "Develop daily meditation and awareness",
    category: "Mental Health",
    difficulty: "Beginner",
    duration: "14 days",
    taskCount: 3,
    popularity: 82,
    tags: ["meditation", "mindfulness", "peace"],
  },
  {
    id: "productivity-system",
    title: "Productivity System",
    description: "Optimize your daily workflow and focus",
    category: "Productivity",
    difficulty: "Intermediate",
    duration: "28 days",
    taskCount: 6,
    popularity: 79,
    tags: ["productivity", "focus", "workflow"],
  },
  {
    id: "reading-habit",
    title: "Daily Reading",
    description: "Build a consistent reading practice",
    category: "Learning",
    difficulty: "Beginner",
    duration: "30 days",
    taskCount: 2,
    popularity: 75,
    tags: ["reading", "learning", "knowledge"],
  },
  {
    id: "gratitude-practice",
    title: "Gratitude Practice",
    description: "Cultivate appreciation and positivity",
    category: "Mental Health",
    difficulty: "Beginner",
    duration: "21 days",
    taskCount: 2,
    popularity: 71,
    tags: ["gratitude", "positivity", "mindset"],
  },
]

interface TemplateQuickBrowserProps {
  onSelectTemplate: (templateId: string) => void
  onBrowseAll: () => void
}

export function TemplateQuickBrowser({ onSelectTemplate, onBrowseAll }: TemplateQuickBrowserProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPopularityIcon = (popularity: number) => {
    if (popularity >= 90) return <Star className="h-3 w-3 text-yellow-500" />
    if (popularity >= 80) return <Zap className="h-3 w-3 text-orange-500" />
    return <Users className="h-3 w-3 text-blue-500" />
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {popularTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-forest-200 ${
              hoveredTemplate === template.id ? "scale-105 shadow-lg" : ""
            }`}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold text-forest-800 line-clamp-1">{template.title}</CardTitle>
                  <CardDescription className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {template.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {getPopularityIcon(template.popularity)}
                  <span className="text-xs text-stone-500">{template.popularity}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.duration}
                  </div>
                  <span>{template.taskCount} tasks</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs border-forest-300 text-forest-700 hover:bg-forest-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectTemplate(template.id)
                    }}
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={onBrowseAll}
          className="border-forest-300 text-forest-700 hover:bg-forest-50"
        >
          Browse All Templates
        </Button>
      </div>
    </div>
  )
}
