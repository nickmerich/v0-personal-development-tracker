"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Mountain, Edit, Save, Target, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface MyWhyCardProps {
  myWhy: string
  bigGoal: string
}

export function MyWhyCard({ myWhy, bigGoal }: MyWhyCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedWhy, setEditedWhy] = useState(myWhy)

  // Update local state when props change
  useEffect(() => {
    setEditedWhy(myWhy)
  }, [myWhy])

  const handleSave = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      const updatedUserData = {
        ...userData,
        myWhy: editedWhy,
      }
      localStorage.setItem("userData", JSON.stringify(updatedUserData))
      setIsEditing(false)
      toast({
        title: "Saved successfully",
        description: "Your why statement has been updated.",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error saving My Why:", error)
      toast({
        title: "Error saving",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
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
          <div className="flex">
            <Button
              variant={isEditing ? "default" : "ghost"}
              size="sm"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={
                isEditing ? "bg-forest-600 text-white hover:bg-forest-700" : "text-forest-600 hover:bg-forest-50"
              }
            >
              {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
              <span>{isEditing ? "Save" : "Edit"}</span>
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditedWhy(myWhy)
                  setIsEditing(false)
                }}
                className="ml-2 border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <X className="h-4 w-4 mr-1" />
                <span>Cancel</span>
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-stone-600">Your deeper purpose and motivation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <Textarea
            value={editedWhy}
            onChange={(e) => setEditedWhy(e.target.value)}
            className="min-h-[100px] border-forest-300 focus:border-forest-500"
            placeholder="What drives you to improve? What's your deeper purpose?"
          />
        ) : (
          <div className="p-4 bg-white/50 rounded-lg border border-forest-200">
            <p className="text-forest-800 italic">"{editedWhy}"</p>
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
