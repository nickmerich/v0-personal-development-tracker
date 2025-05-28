"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Plus, X, Target } from "lucide-react"
import { SetupProgress } from "@/components/setup-progress"

const DEFAULT_CATEGORIES = [
  "Physical Health",
  "Mental Wellness",
  "Spiritual Growth",
  "Nutrition",
  "Career & Work",
  "Relationships",
]

export default function LifeCategories() {
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    if (userData.categories && userData.categories.length) {
      setCategories(userData.categories)
    } else {
      setCategories(DEFAULT_CATEGORIES)
    }
  }, [])

  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    setCategories([...categories, newCategory.trim()])
    setNewCategory("")
  }

  const handleRemoveCategory = (index: number) => {
    const newCategories = [...categories]
    newCategories.splice(index, 1)
    setCategories(newCategories)
  }

  const handleNext = () => {
    if (categories.length === 0) return

    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    const tasks = {}
    categories.forEach((category) => {
      tasks[category] = []
    })

    localStorage.setItem(
      "userData",
      JSON.stringify({
        ...userData,
        categories,
        tasks,
      }),
    )

    router.push("/setup/calendar-preferences")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-forest-50 via-stone-50 to-forest-100 p-4">
      <Card className="w-full max-w-md border-forest-200 bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <SetupProgress currentStep={4} totalSteps={5} />
          <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
            <Target className="h-6 w-6 text-forest-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-forest-800">Life Areas</CardTitle>
          <CardDescription className="text-center text-stone-600">
            Organize your goals across different areas of your life
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <p className="text-xs text-stone-600">
              📋 These categories help you organize your daily tasks and goals. Each area needs regular attention to
              achieve balanced growth.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center bg-forest-100 rounded-full px-3 py-1 border border-forest-200"
              >
                <span className="text-forest-800 text-sm">{category}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 text-forest-600 hover:bg-forest-200"
                  onClick={() => handleRemoveCategory(index)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {category}</span>
                </Button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="new-category" className="sr-only">
                Add Life Area
              </Label>
              <Input
                id="new-category"
                placeholder="Add life area..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
                className="border-forest-300 focus:border-forest-500 focus:ring-forest-200"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
              className="border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Category</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/setup/big-goal")}
            className="border-forest-300 text-forest-600 hover:bg-forest-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={categories.length === 0}
            className="bg-forest-600 text-white hover:bg-forest-700 shadow-lg"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
