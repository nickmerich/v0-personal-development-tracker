"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Target,
  Brain,
  Heart,
  Briefcase,
  Users,
  BookOpen,
  Dumbbell,
  Coffee,
  Moon,
  Leaf,
  Clock,
  Star,
  Filter,
  Search,
} from "lucide-react"
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
  popularity: number
  estimatedTime: string
}

const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: "morning-routine",
    name: "Morning Routine",
    description: "Start your day with purpose and energy through a structured morning routine",
    category: "Health & Wellness",
    difficulty: "Beginner",
    duration: "30 days",
    frequency: "Daily",
    estimatedTime: "45 minutes",
    popularity: 95,
    icon: Coffee,
    tasks: [
      "Wake up at 6:00 AM consistently",
      "Drink a glass of water immediately upon waking",
      "Do 10 minutes of stretching or light exercise",
      "Practice 5 minutes of meditation or deep breathing",
      "Write down 3 priorities for the day",
      "Eat a healthy breakfast",
      "Review your goals and affirmations",
    ],
    benefits: [
      "Increased energy throughout the day",
      "Better focus and productivity",
      "Improved mood and mental clarity",
      "Consistent sleep schedule",
      "Sense of accomplishment early in the day",
    ],
    tips: [
      "Start with just 2-3 tasks and gradually add more",
      "Prepare everything the night before",
      "Keep your alarm across the room to avoid snoozing",
      "Track your consistency for motivation",
    ],
  },
  {
    id: "fitness-foundation",
    name: "Fitness Foundation",
    description: "Build a sustainable exercise habit with progressive workouts",
    category: "Health & Wellness",
    difficulty: "Beginner",
    duration: "21 days",
    frequency: "5 times per week",
    estimatedTime: "30 minutes",
    popularity: 88,
    icon: Dumbbell,
    tasks: [
      "Do 20 minutes of cardio (walking, jogging, or cycling)",
      "Complete 10 minutes of strength training",
      "Perform 5 minutes of stretching",
      "Track your workout in a fitness app or journal",
      "Stay hydrated during and after exercise",
    ],
    benefits: [
      "Improved cardiovascular health",
      "Increased strength and endurance",
      "Better sleep quality",
      "Enhanced mood and energy",
      "Weight management",
    ],
    tips: [
      "Start with bodyweight exercises if you're new to fitness",
      "Focus on form over intensity",
      "Listen to your body and rest when needed",
      "Find activities you enjoy to stay motivated",
    ],
  },
  {
    id: "mindfulness-practice",
    name: "Mindfulness Practice",
    description: "Develop daily meditation and awareness practices for mental well-being",
    category: "Mental Health",
    difficulty: "Beginner",
    duration: "14 days",
    frequency: "Daily",
    estimatedTime: "15 minutes",
    popularity: 82,
    icon: Brain,
    tasks: [
      "Practice 10 minutes of guided meditation",
      "Do a 2-minute breathing exercise",
      "Practice mindful eating during one meal",
      "Take 3 mindful breaks throughout the day",
      "Write down one thing you're grateful for",
    ],
    benefits: [
      "Reduced stress and anxiety",
      "Improved focus and concentration",
      "Better emotional regulation",
      "Enhanced self-awareness",
      "Improved sleep quality",
    ],
    tips: [
      "Use meditation apps for guided sessions",
      "Start with shorter sessions and gradually increase",
      "Find a quiet, comfortable space for practice",
      "Be patient with yourself as you learn",
    ],
  },
  {
    id: "productivity-system",
    name: "Productivity System",
    description: "Optimize your daily workflow and focus with proven productivity techniques",
    category: "Productivity",
    difficulty: "Intermediate",
    duration: "28 days",
    frequency: "Daily",
    estimatedTime: "60 minutes",
    popularity: 79,
    icon: Target,
    tasks: [
      "Plan your day using time-blocking technique",
      "Use the Pomodoro Technique for focused work sessions",
      "Complete your most important task first (eat the frog)",
      "Limit email and social media checking to specific times",
      "Review and organize your workspace",
      "Conduct a daily review of accomplishments and tomorrow's priorities",
    ],
    benefits: [
      "Increased focus and concentration",
      "Better time management",
      "Reduced procrastination",
      "Higher quality work output",
      "Less stress and overwhelm",
    ],
    tips: [
      "Use productivity apps to track your time",
      "Eliminate distractions during focused work",
      "Take regular breaks to maintain energy",
      "Batch similar tasks together",
    ],
  },
  {
    id: "reading-habit",
    name: "Daily Reading",
    description: "Build a consistent reading practice to expand knowledge and improve focus",
    category: "Learning",
    difficulty: "Beginner",
    duration: "30 days",
    frequency: "Daily",
    estimatedTime: "30 minutes",
    popularity: 75,
    icon: BookOpen,
    tasks: [
      "Read for 20 minutes before bed",
      "Take notes on key insights or quotes",
      "Set a monthly reading goal",
      "Join a book club or reading community",
      "Vary your reading material (fiction, non-fiction, articles)",
    ],
    benefits: [
      "Expanded knowledge and vocabulary",
      "Improved focus and concentration",
      "Better sleep quality",
      "Enhanced empathy and understanding",
      "Stress reduction and relaxation",
    ],
    tips: [
      "Choose books that genuinely interest you",
      "Keep a book with you for unexpected free time",
      "Use audiobooks during commutes or exercise",
      "Track your reading progress for motivation",
    ],
  },
  {
    id: "gratitude-practice",
    name: "Gratitude Practice",
    description: "Cultivate appreciation and positivity through daily gratitude exercises",
    category: "Mental Health",
    difficulty: "Beginner",
    duration: "21 days",
    frequency: "Daily",
    estimatedTime: "10 minutes",
    popularity: 71,
    icon: Heart,
    tasks: [
      "Write down 3 things you're grateful for each morning",
      "Express gratitude to one person daily",
      "Practice gratitude meditation for 5 minutes",
      "Take a photo of something beautiful you notice",
      "Reflect on positive moments before sleep",
    ],
    benefits: [
      "Improved mood and happiness",
      "Better relationships",
      "Increased life satisfaction",
      "Reduced negative thinking",
      "Enhanced resilience",
    ],
    tips: [
      "Be specific in your gratitude entries",
      "Focus on people, experiences, and small moments",
      "Use a dedicated gratitude journal",
      "Share your gratitude with others",
    ],
  },
  {
    id: "sleep-optimization",
    name: "Sleep Optimization",
    description: "Improve sleep quality and establish healthy sleep habits",
    category: "Health & Wellness",
    difficulty: "Intermediate",
    duration: "21 days",
    frequency: "Daily",
    estimatedTime: "60 minutes",
    popularity: 68,
    icon: Moon,
    tasks: [
      "Maintain consistent sleep and wake times",
      "Create a relaxing bedtime routine",
      "Avoid screens 1 hour before bed",
      "Keep bedroom cool, dark, and quiet",
      "Limit caffeine after 2 PM",
      "Practice relaxation techniques before sleep",
    ],
    benefits: [
      "Better sleep quality and duration",
      "Improved energy and alertness",
      "Enhanced immune function",
      "Better mood regulation",
      "Improved cognitive performance",
    ],
    tips: [
      "Use blackout curtains or eye masks",
      "Try white noise or earplugs if needed",
      "Avoid large meals close to bedtime",
      "Consider a sleep tracking app",
    ],
  },
  {
    id: "networking-skills",
    name: "Networking & Relationships",
    description: "Build meaningful professional and personal connections",
    category: "Career & Relationships",
    difficulty: "Intermediate",
    duration: "30 days",
    frequency: "3 times per week",
    estimatedTime: "45 minutes",
    popularity: 65,
    icon: Users,
    tasks: [
      "Reach out to one new professional contact weekly",
      "Attend one networking event or meetup",
      "Follow up with recent connections",
      "Share valuable content on professional platforms",
      "Practice active listening in conversations",
      "Offer help or value to your network",
    ],
    benefits: [
      "Expanded professional network",
      "New opportunities and collaborations",
      "Improved communication skills",
      "Increased confidence in social situations",
      "Access to industry insights",
    ],
    tips: [
      "Focus on giving value rather than asking for favors",
      "Follow up within 24-48 hours of meeting someone",
      "Use LinkedIn and other platforms strategically",
      "Be genuine and authentic in your interactions",
    ],
  },
  {
    id: "financial-wellness",
    name: "Financial Wellness",
    description: "Develop healthy money habits and improve financial literacy",
    category: "Financial",
    difficulty: "Intermediate",
    duration: "30 days",
    frequency: "Daily",
    estimatedTime: "20 minutes",
    popularity: 62,
    icon: Briefcase,
    tasks: [
      "Track daily expenses in a budgeting app",
      "Review and categorize spending weekly",
      "Read one financial article or book chapter",
      "Automate savings transfers",
      "Review and optimize recurring subscriptions",
      "Set and track financial goals",
    ],
    benefits: [
      "Better understanding of spending habits",
      "Increased savings and emergency fund",
      "Reduced financial stress",
      "Improved financial decision-making",
      "Progress toward financial goals",
    ],
    tips: [
      "Start with small, achievable savings goals",
      "Use the 50/30/20 budgeting rule as a starting point",
      "Automate as much as possible",
      "Celebrate financial milestones",
    ],
  },
  {
    id: "creative-expression",
    name: "Creative Expression",
    description: "Nurture creativity through daily artistic and creative practices",
    category: "Personal Growth",
    difficulty: "Beginner",
    duration: "21 days",
    frequency: "Daily",
    estimatedTime: "30 minutes",
    popularity: 58,
    icon: Leaf,
    tasks: [
      "Spend 15 minutes on a creative activity (drawing, writing, music)",
      "Take photos of interesting subjects",
      "Try a new creative technique or medium",
      "Share your creative work with others",
      "Visit galleries, museums, or creative spaces",
      "Keep a creative inspiration journal",
    ],
    benefits: [
      "Enhanced creativity and imagination",
      "Improved problem-solving skills",
      "Stress relief and relaxation",
      "Increased self-expression",
      "Greater appreciation for art and beauty",
    ],
    tips: [
      "Don't worry about perfection, focus on the process",
      "Experiment with different mediums and styles",
      "Join creative communities for inspiration",
      "Set aside dedicated creative time",
    ],
  },
]

interface HabitTemplatesProps {
  onSelectTemplate: (template: HabitTemplate) => void
}

export function HabitTemplates({ onSelectTemplate }: HabitTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popularity")

  const categories = ["all", ...Array.from(new Set(HABIT_TEMPLATES.map((t) => t.category)))]
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]

  const filteredTemplates = HABIT_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  }).sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity
      case "name":
        return a.name.localeCompare(b.name)
      case "difficulty":
        const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 }
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      default:
        return 0
    }
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

  const getCategoryColor = (category: string) => {
    const colors = {
      "Health & Wellness": "bg-green-100 text-green-800",
      "Mental Health": "bg-blue-100 text-blue-800",
      Productivity: "bg-purple-100 text-purple-800",
      Learning: "bg-orange-100 text-orange-800",
      "Career & Relationships": "bg-pink-100 text-pink-800",
      Financial: "bg-yellow-100 text-yellow-800",
      "Personal Growth": "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="border-forest-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Filter className="h-5 w-5 text-forest-600" />
            Find Your Perfect Template
          </CardTitle>
          <CardDescription className="text-base">
            Filter and search through our collection of proven habit templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-forest-300 focus:border-forest-500 h-12"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-forest-300 h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="border-forest-300 h-12">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Difficulties" : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-forest-300 h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-stone-600">
          Showing {filteredTemplates.length} of {HABIT_TEMPLATES.length} templates
        </p>
        {(searchQuery || selectedCategory !== "all" || selectedDifficulty !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
              setSelectedDifficulty("all")
            }}
            className="border-forest-300 text-forest-600 hover:bg-forest-50"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon
          return (
            <Card
              key={template.id}
              className={cn(
                "border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]",
                "cursor-pointer group",
              )}
              onClick={() => onSelectTemplate(template)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-100 group-hover:bg-forest-200 transition-colors">
                      <IconComponent className="h-6 w-6 text-forest-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-stone-600">{template.popularity}%</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl text-forest-800 group-hover:text-forest-900 transition-colors">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">{template.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn("text-xs", getCategoryColor(template.category))}>{template.category}</Badge>
                  <Badge className={cn("text-xs", getDifficultyColor(template.difficulty))}>
                    {template.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-forest-600" />
                    <span className="text-stone-700">{template.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-forest-600" />
                    <span className="text-stone-700">{template.frequency}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-stone-600 mb-3">
                    <strong>What you'll do:</strong>
                  </p>
                  <ul className="text-sm text-stone-600 space-y-1">
                    {template.tasks.slice(0, 3).map((task, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-forest-600 mt-1">•</span>
                        <span className="line-clamp-1">{task}</span>
                      </li>
                    ))}
                    {template.tasks.length > 3 && (
                      <li className="text-forest-600 font-medium">+{template.tasks.length - 3} more tasks</li>
                    )}
                  </ul>
                </div>

                <div className="pt-4 border-t border-forest-100">
                  <Button
                    className="w-full bg-forest-600 text-white hover:bg-forest-700 group-hover:scale-105 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectTemplate(template)
                    }}
                  >
                    Apply Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card className="border-forest-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-stone-400 mb-4" />
            <h3 className="text-xl font-semibold text-stone-600 mb-2">No templates found</h3>
            <p className="text-stone-500 text-center mb-4">
              Try adjusting your search criteria or browse all templates
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedDifficulty("all")
              }}
              className="bg-forest-600 text-white hover:bg-forest-700"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
