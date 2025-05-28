"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HabitTemplates } from "@/components/habit-templates"
import { TemplateApplicationModal } from "@/components/template-application-modal"
import { ArrowLeft, Sparkles, Target } from "lucide-react"

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

export default function TemplatesPage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    setLoading(false)
  }, [router])

  const handleSelectTemplate = (template: HabitTemplate) => {
    setSelectedTemplate(template)
    setShowApplicationModal(true)
  }

  const handleApplyTemplate = (selectedTasks: string[], targetCategory: string, customizations: any) => {
    if (!userData) return

    // Create new tasks from template
    const newTasks = selectedTasks.map((taskText, index) => ({
      id: `${Date.now()}-${index}`,
      text: taskText,
      completed: false,
      scheduledDate: customizations.startDate,
      templateId: selectedTemplate?.id,
      templateName: selectedTemplate?.name,
      reminderTime: customizations.reminderTime,
      customGoal: customizations.customGoal,
    }))

    // Add tasks to the selected category
    const updatedUserData = { ...userData }
    if (!updatedUserData.tasks[targetCategory]) {
      updatedUserData.tasks[targetCategory] = []
    }
    updatedUserData.tasks[targetCategory] = [...updatedUserData.tasks[targetCategory], ...newTasks]

    // Track template usage
    if (!updatedUserData.appliedTemplates) {
      updatedUserData.appliedTemplates = []
    }
    updatedUserData.appliedTemplates.push({
      templateId: selectedTemplate?.id,
      templateName: selectedTemplate?.name,
      appliedDate: new Date().toISOString(),
      category: targetCategory,
      tasksCount: selectedTasks.length,
      customizations,
    })

    // Save to localStorage
    localStorage.setItem("userData", JSON.stringify(updatedUserData))
    setUserData(updatedUserData)

    // Show success message and redirect
    alert(
      `Successfully added ${selectedTasks.length} tasks from "${selectedTemplate?.name}" to your ${targetCategory} category!`,
    )
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50">
        <p className="text-forest-800">Loading...</p>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-stone-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Habit Templates</h1>
                <p className="text-forest-100">Jumpstart your growth with proven habit templates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-forest-200" />
              <span className="text-sm text-forest-100">
                {userData.appliedTemplates?.length || 0} templates applied
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Welcome Section */}
        <Card className="mb-8 border-forest-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
                <Target className="h-6 w-6 text-forest-600" />
              </div>
              <div>
                <CardTitle className="text-forest-800">Ready to Build Better Habits?</CardTitle>
                <CardDescription className="text-stone-600">
                  Choose from our collection of proven habit templates designed by experts and used by thousands of
                  people to achieve their goals.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-800 mb-1">50+</div>
                <div className="text-sm text-stone-600">Expert-designed templates</div>
              </div>
              <div className="text-center p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-800 mb-1">6</div>
                <div className="text-sm text-stone-600">Life categories covered</div>
              </div>
              <div className="text-center p-4 bg-forest-50 rounded-lg">
                <div className="text-2xl font-bold text-forest-800 mb-1">100%</div>
                <div className="text-sm text-stone-600">Customizable to your needs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <HabitTemplates onSelectTemplate={handleSelectTemplate} />

        {/* Applied Templates History */}
        {userData.appliedTemplates && userData.appliedTemplates.length > 0 && (
          <Card className="mt-8 border-forest-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-forest-800">Your Applied Templates</CardTitle>
              <CardDescription className="text-stone-600">
                Templates you've already added to your routine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userData.appliedTemplates.slice(-5).map((applied: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-forest-50 rounded-lg">
                    <div>
                      <p className="font-medium text-forest-800">{applied.templateName}</p>
                      <p className="text-sm text-stone-600">
                        Added {applied.tasksCount} tasks to {applied.category} •{" "}
                        {new Date(applied.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/dashboard")}
                      className="border-forest-300 text-forest-600 hover:bg-forest-50"
                    >
                      View Tasks
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Template Application Modal */}
      <TemplateApplicationModal
        isOpen={showApplicationModal}
        onClose={() => {
          setShowApplicationModal(false)
          setSelectedTemplate(null)
        }}
        template={selectedTemplate}
        categories={userData.categories || []}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  )
}
