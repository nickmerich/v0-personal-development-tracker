"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HabitTemplates } from "@/components/habit-templates"
import { TemplateApplicationModal } from "@/components/template-application-modal"
import { ArrowLeft, Sparkles, Target } from "lucide-react"
import { PageLoader } from "@/components/loading-spinner"

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

    try {
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
        createdAt: new Date().toISOString(),
        priority: "medium" as const,
      }))

      // Add tasks to the selected category
      const updatedUserData = { ...userData }
      if (!updatedUserData.tasks) {
        updatedUserData.tasks = {}
      }
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
    } catch (error) {
      console.error("Error applying template:", error)
      alert("There was an error applying the template. Please try again.")
    }
  }

  if (loading) {
    return <PageLoader text="Loading templates..." />
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="default"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="space-y-1">
                <h1 className="text-2xl lg:text-3xl font-bold">Habit Templates</h1>
                <p className="text-forest-100 text-base lg:text-lg">
                  Jumpstart your growth with proven habit templates
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-forest-200" />
              <span className="text-base text-forest-100">
                {userData.appliedTemplates?.length || 0} templates applied
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 max-w-7xl">
        {/* Welcome Section */}
        <Card className="border-forest-200">
          <CardHeader className="pb-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-forest-100 shrink-0">
                <Target className="h-8 w-8 text-forest-600" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl text-forest-800">Ready to Build Better Habits?</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Choose from our collection of proven habit templates designed by experts and used by thousands of
                  people to achieve their goals.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-6 bg-forest-50 rounded-xl">
                <div className="text-3xl font-bold text-forest-800 mb-2">50+</div>
                <div className="text-base text-stone-600">Expert-designed templates</div>
              </div>
              <div className="text-center p-6 bg-forest-50 rounded-xl">
                <div className="text-3xl font-bold text-forest-800 mb-2">6</div>
                <div className="text-base text-stone-600">Life categories covered</div>
              </div>
              <div className="text-center p-6 bg-forest-50 rounded-xl">
                <div className="text-3xl font-bold text-forest-800 mb-2">100%</div>
                <div className="text-base text-stone-600">Customizable to your needs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <HabitTemplates onSelectTemplate={handleSelectTemplate} />

        {/* Applied Templates History */}
        {userData.appliedTemplates && userData.appliedTemplates.length > 0 && (
          <Card className="border-forest-200">
            <CardHeader>
              <CardTitle className="text-xl text-forest-800">Your Applied Templates</CardTitle>
              <CardDescription className="text-base">Templates you've already added to your routine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData.appliedTemplates.slice(-5).map((applied: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-forest-50 rounded-xl">
                    <div className="space-y-1">
                      <p className="font-medium text-forest-800 text-base">{applied.templateName}</p>
                      <p className="text-sm text-stone-600">
                        Added {applied.tasksCount} tasks to {applied.category} •{" "}
                        {new Date(applied.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => router.push("/dashboard")}
                      className="border-forest-300 text-forest-600 hover:bg-forest-50 shrink-0"
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
