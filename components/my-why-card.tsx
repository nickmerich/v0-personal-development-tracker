"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Mountain, Edit, Save, Target } from "lucide-react"

interface MyWhyCardProps {
  myWhy: string
  bigGoal: string
}

export function MyWhyCard({ myWhy, bigGoal }: MyWhyCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedWhy, setEditedWhy] = useState(myWhy)

  const handleSave = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    const updatedUserData = {
      ...userData,
      myWhy: editedWhy,
    }
    localStorage.setItem("userData", JSON.stringify(updatedUserData))
    setIsEditing(false)
  }

  return (
    <Card className="mb-6 border-forest-200 bg-gradient-to-r from-forest-50 to-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-100">
              <Mountain className="h-4 w-4 text-forest-600" />
            </div>
            <CardTitle className="text-forest-800">My Why</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="text-forest-600 hover:bg-forest-50"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            <span className="sr-only">{isEditing ? "Save" : "Edit"}</span>
          </Button>
        </div>
        <CardDescription className="text-stone-600">Your deeper purpose and motivation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editedWhy}
            onChange={(e) => setEditedWhy(e.target.value)}
            className="min-h-[100px] border-forest-300 focus:border-forest-500"
          />
        ) : (
          <div className="p-4 bg-white/50 rounded-lg border border-forest-200">
            <p className="text-forest-800 italic">"{myWhy}"</p>
          </div>
        )}

        <div className="flex items-start gap-2 p-4 bg-forest-50 rounded-lg border border-forest-200">
          <Target className="h-5 w-5 text-forest-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-forest-800 mb-1">Your Summit Goal</h4>
            <p className="text-forest-700">{bigGoal}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
