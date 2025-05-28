"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Heart, Dumbbell, Brain, Briefcase, Users, Book, Target, Clock, CheckCircle2 } from "lucide-react"
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

const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health & Fitness Templates
  {
    id: "morning-workout",
    name: "Morning Workout Routine",
    description: "Start your day with energy and strength",
    category: "Health & Fitness",
    difficulty: "Beginner",
    duration: "30 minutes",
    frequency: "Daily",
    tasks: [
      "10 minutes of stretching or yoga",
      "15 minutes of cardio (walking, jogging, or dancing)",
      "5 minutes of strength exercises (push-ups, squats)",
      "Drink a glass of water",
      "Log workout in fitness app",
    ],
    benefits: [
      "Increased energy throughout the day",
      "Better mood and mental clarity",
      "Improved physical fitness",
      "Consistent sleep schedule",
    ],
    tips: [
      "Lay out workout clothes the night before",
      "Start with just 10 minutes if 30 feels overwhelming",
      "Find a workout buddy for accountability",
      "Track your progress weekly",
    ],
    icon: Dumbbell,
  },
  {
    id: "healthy-eating",
    name: "Balanced Nutrition Plan",
    description: "Fuel your body with nutritious foods",
    category: "Health & Fitness",
    difficulty: "Intermediate",
    duration: "All day",
    frequency: "Daily",
    tasks: [
      "Eat a protein-rich breakfast",
      "Include vegetables in lunch and dinner",
      "Drink 8 glasses of water",
      "Limit processed foods and sugar",
      "Plan tomorrow's meals",
    ],
    benefits: ["Sustained energy levels", "Better digestion", "Improved mood stability", "Weight management"],
    tips: [
      "Meal prep on Sundays",
      "Keep healthy snacks readily available",
      "Use a water tracking app",
      "Allow yourself one treat per day",
    ],
    icon: Heart,
  },
  {
    id: "sleep-optimization",
    name: "Quality Sleep Routine",
    description: "Improve your sleep quality and duration",
    category: "Health & Fitness",
    difficulty: "Beginner",
    duration: "Evening routine",
    frequency: "Daily",
    tasks: [
      "No screens 1 hour before bed",
      "Read for 15-30 minutes",
      "Practice deep breathing or meditation",
      "Keep bedroom cool and dark",
      "Go to bed at the same time each night",
    ],
    benefits: [
      "Better focus and productivity",
      "Improved immune system",
      "Enhanced mood regulation",
      "Better physical recovery",
    ],
    tips: [
      "Use blue light blocking glasses if you must use screens",
      "Try chamomile tea before bed",
      "Keep a sleep journal",
      "Invest in blackout curtains",
    ],
    icon: Clock,
  },

  // Mental Wellness Templates
  {
    id: "mindfulness-practice",
    name: "Daily Mindfulness",
    description: "Cultivate present-moment awareness and calm",
    category: "Mental Wellness",
    difficulty: "Beginner",
    duration: "10-20 minutes",
    frequency: "Daily",
    tasks: [
      "5 minutes of morning meditation",
      "Practice mindful breathing during breaks",
      "Take a mindful walk without distractions",
      "Write 3 things you're grateful for",
      "Do one activity mindfully (eating, washing dishes)",
    ],
    benefits: [
      "Reduced stress and anxiety",
      "Improved emotional regulation",
      "Better focus and concentration",
      "Increased self-awareness",
    ],
    tips: [
      "Use a meditation app for guidance",
      "Start with just 2-3 minutes",
      "Set reminders throughout the day",
      "Be patient with yourself",
    ],
    icon: Brain,
  },
  {
    id: "stress-management",
    name: "Stress Relief Toolkit",
    description: "Build resilience and manage daily stress",
    category: "Mental Wellness",
    difficulty: "Intermediate",
    duration: "Throughout day",
    frequency: "Daily",
    tasks: [
      "Practice 4-7-8 breathing technique",
      "Take regular breaks from work",
      "Listen to calming music",
      "Do progressive muscle relaxation",
      "Identify and challenge negative thoughts",
    ],
    benefits: ["Lower cortisol levels", "Better decision making", "Improved relationships", "Enhanced creativity"],
    tips: [
      "Create a stress-relief playlist",
      "Learn to say no to overwhelming commitments",
      "Practice self-compassion",
      "Consider talking to a therapist",
    ],
    icon: Heart,
  },

  // Productivity Templates
  {
    id: "morning-routine",
    name: "Productive Morning Routine",
    description: "Start each day with intention and focus",
    category: "Productivity",
    difficulty: "Beginner",
    duration: "60-90 minutes",
    frequency: "Daily",
    tasks: [
      "Wake up at the same time daily",
      "Make your bed immediately",
      "Review your daily goals",
      "Eat a healthy breakfast",
      "Tackle your most important task first",
    ],
    benefits: [
      "Increased daily productivity",
      "Better time management",
      "Reduced decision fatigue",
      "Sense of accomplishment",
    ],
    tips: [
      "Prepare everything the night before",
      "Avoid checking phone for first hour",
      "Keep your routine simple and consistent",
      "Adjust timing based on your schedule",
    ],
    icon: Target,
  },
  {
    id: "deep-work",
    name: "Deep Work Sessions",
    description: "Maximize focus and accomplish meaningful work",
    category: "Productivity",
    difficulty: "Advanced",
    duration: "2-4 hours",
    frequency: "Daily",
    tasks: [
      "Block 2-hour focused work sessions",
      "Turn off all notifications",
      "Work on one important project at a time",
      "Take 15-minute breaks between sessions",
      "Review and plan next session",
    ],
    benefits: [
      "Higher quality work output",
      "Faster skill development",
      "Reduced mental fatigue",
      "Greater job satisfaction",
    ],
    tips: [
      "Start with 45-minute sessions",
      "Use website blockers",
      "Find your peak energy hours",
      "Communicate boundaries to colleagues",
    ],
    icon: Briefcase,
  },

  // Learning Templates
  {
    id: "daily-reading",
    name: "Daily Reading Habit",
    description: "Expand your knowledge and vocabulary",
    category: "Learning",
    difficulty: "Beginner",
    duration: "20-30 minutes",
    frequency: "Daily",
    tasks: [
      "Read for 20 minutes in the morning",
      "Take notes on key insights",
      "Look up unfamiliar words",
      "Discuss what you learned with someone",
      "Track books completed",
    ],
    benefits: ["Expanded knowledge base", "Improved vocabulary", "Better critical thinking", "Reduced stress"],
    tips: [
      "Always have a book with you",
      "Join a book club for accountability",
      "Mix fiction and non-fiction",
      "Set a yearly reading goal",
    ],
    icon: Book,
  },
  {
    id: "skill-development",
    name: "New Skill Mastery",
    description: "Systematically learn and practice new skills",
    category: "Learning",
    difficulty: "Intermediate",
    duration: "45-60 minutes",
    frequency: "Daily",
    tasks: [
      "Practice skill for 30 minutes",
      "Watch educational videos or tutorials",
      "Apply skill to a real project",
      "Seek feedback from experts",
      "Reflect on progress and challenges",
    ],
    benefits: [
      "Career advancement opportunities",
      "Increased confidence",
      "Enhanced creativity",
      "Personal satisfaction",
    ],
    tips: [
      "Choose one skill to focus on at a time",
      "Break complex skills into smaller parts",
      "Find a mentor or coach",
      "Celebrate small wins",
    ],
    icon: Target,
  },

  // Relationships Templates
  {
    id: "relationship-building",
    name: "Strengthen Relationships",
    description: "Nurture and deepen your personal connections",
    category: "Relationships",
    difficulty: "Beginner",
    duration: "30 minutes",
    frequency: "Daily",
    tasks: [
      "Reach out to one friend or family member",
      "Practice active listening in conversations",
      "Express gratitude to someone",
      "Plan quality time with loved ones",
      "Resolve any conflicts promptly",
    ],
    benefits: [
      "Stronger social support network",
      "Improved communication skills",
      "Greater life satisfaction",
      "Reduced loneliness",
    ],
    tips: [
      "Schedule regular check-ins with important people",
      "Remember important dates and events",
      "Be present during conversations",
      "Show appreciation regularly",
    ],
    icon: Users,
  },

  // Financial Templates
  {
    id: "financial-wellness",
    name: "Financial Health Routine",
    description: "Build better money habits and financial security",
    category: "Financial",
    difficulty: "Intermediate",
    duration: "15-30 minutes",
    frequency: "Daily",
    tasks: [
      "Track daily expenses",
      "Review budget and spending",
      "Save a small amount daily",
      "Read financial news or education",
      "Plan one money-saving action",
    ],
    benefits: [
      "Better financial awareness",
      "Reduced money stress",
      "Increased savings",
      "Improved financial security",
    ],
    tips: [
      "Use budgeting apps for easy tracking",
      "Automate savings transfers",
      "Start with small amounts",
      "Educate yourself about investing",
    ],
    icon: Target,
  },
]

const CATEGORIES = [
  { id: "all", name: "All Templates", icon: Target },
  { id: "Health & Fitness", name: "Health & Fitness", icon: Dumbbell },
  { id: "Mental Wellness", name: "Mental Wellness", icon: Brain },
  { id: "Productivity", name: "Productivity", icon: Briefcase },
  { id: "Learning", name: "Learning", icon: Book },
  { id: "Relationships", name: "Relationships", icon: Users },
  { id: "Financial", name: "Financial", icon: Target },
]

interface HabitTemplatesProps {
  onSelectTemplate: (template: HabitTemplate) => void
}

export function HabitTemplates({ onSelectTemplate }: HabitTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null)

  const filteredTemplates = HABIT_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tasks.some((task) => task.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-forest-800 mb-2">Habit Templates</h2>
        <p className="text-stone-600">Choose from proven habit templates to jumpstart your personal development</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-forest-300 focus:border-forest-500"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-forest-100">
          {CATEGORIES.map((category) => {
            const IconComponent = category.icon
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-forest-600 data-[state=active]:text-white text-xs lg:text-sm"
              >
                <IconComponent className="h-4 w-4 mr-1 hidden lg:block" />
                {category.name}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {CATEGORIES.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const IconComponent = template.icon
                return (
                  <Card
                    key={template.id}
                    className={cn(
                      "border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200",
                      "hover:scale-[1.02] cursor-pointer",
                    )}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100">
                            <IconComponent className="h-4 w-4 text-forest-600" />
                          </div>
                          <div>
                            <CardTitle className="text-forest-800 text-sm">{template.name}</CardTitle>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                      </div>
                      <CardDescription className="text-stone-600 text-sm">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.duration}
                        </span>
                        <span>{template.frequency}</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-forest-800">Sample tasks:</p>
                        <ul className="text-xs text-stone-600 space-y-0.5">
                          {template.tasks.slice(0, 3).map((task, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 text-forest-600 mt-0.5 flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                          {template.tasks.length > 3 && (
                            <li className="text-forest-600 font-medium">+{template.tasks.length - 3} more tasks</li>
                          )}
                        </ul>
                      </div>

                      <Button
                        size="sm"
                        className="w-full bg-forest-600 text-white hover:bg-forest-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectTemplate(template)
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stone-600 mb-2">No templates found</h3>
                <p className="text-stone-500">Try adjusting your search or category filter</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="bg-white border-forest-200 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
                  <selectedTemplate.icon className="h-5 w-5 text-forest-600" />
                </div>
                <div>
                  <DialogTitle className="text-forest-800">{selectedTemplate.name}</DialogTitle>
                  <DialogDescription className="text-stone-600">{selectedTemplate.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Template Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-forest-50 rounded-lg">
                  <p className="text-xs text-stone-600">Difficulty</p>
                  <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                    {selectedTemplate.difficulty}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-forest-50 rounded-lg">
                  <p className="text-xs text-stone-600">Duration</p>
                  <p className="font-medium text-forest-800">{selectedTemplate.duration}</p>
                </div>
                <div className="text-center p-3 bg-forest-50 rounded-lg">
                  <p className="text-xs text-stone-600">Frequency</p>
                  <p className="font-medium text-forest-800">{selectedTemplate.frequency}</p>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h4 className="font-semibold text-forest-800 mb-3">Daily Tasks</h4>
                <div className="space-y-2">
                  {selectedTemplate.tasks.map((task, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-forest-50 rounded-md">
                      <CheckCircle2 className="h-4 w-4 text-forest-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-forest-800">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-semibold text-forest-800 mb-3">Benefits</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {selectedTemplate.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Heart className="h-4 w-4 text-earth-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-stone-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h4 className="font-semibold text-forest-800 mb-3">Success Tips</h4>
                <div className="space-y-2">
                  {selectedTemplate.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-earth-50 rounded-md">
                      <Target className="h-4 w-4 text-earth-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-stone-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
                className="border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  onSelectTemplate(selectedTemplate)
                  setSelectedTemplate(null)
                }}
                className="bg-forest-600 text-white hover:bg-forest-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
