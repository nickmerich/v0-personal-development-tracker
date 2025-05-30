"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Camera, Plus, X, Calendar, Trash2, Maximize2 } from "lucide-react"
import { format } from "date-fns"

interface ProgressPhoto {
  id: string
  url: string
  date: string
  notes?: string
}

export function ProgressPhotoGallery() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null)
  const [isAddingPhoto, setIsAddingPhoto] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    // Load photos from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    if (userData.progressPhotos) {
      setPhotos(userData.progressPhotos)
    }
  }, [])

  const savePhotos = (updatedPhotos: ProgressPhoto[]) => {
    setPhotos(updatedPhotos)

    // Save to localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    userData.progressPhotos = updatedPhotos
    localStorage.setItem("userData", JSON.stringify(userData))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setIsUploading(true)

    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit")
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "progress-photos")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()

      // Add new photo
      const newPhoto: ProgressPhoto = {
        id: `photo-${Date.now()}`,
        url: data.url,
        date: new Date().toISOString(),
        notes: "",
      }

      savePhotos([...photos, newPhoto])
      setIsAddingPhoto(false)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const deletePhoto = (id: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      const updatedPhotos = photos.filter((photo) => photo.id !== id)
      savePhotos(updatedPhotos)

      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null)
      }
    }
  }

  const updatePhotoNotes = (id: string, notes: string) => {
    const updatedPhotos = photos.map((photo) => (photo.id === id ? { ...photo, notes } : photo))
    savePhotos(updatedPhotos)

    if (selectedPhoto?.id === id) {
      setSelectedPhoto({ ...selectedPhoto, notes })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-forest-800">Progress Photos</CardTitle>
              <CardDescription>Track your physical transformation over time</CardDescription>
            </div>
            <Button onClick={() => setIsAddingPhoto(true)} className="bg-forest-600 hover:bg-forest-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Photo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-forest-200 rounded-lg">
              <Camera className="mx-auto h-12 w-12 text-forest-300" />
              <p className="mt-2 text-forest-600">No progress photos yet</p>
              <Button
                onClick={() => setIsAddingPhoto(true)}
                variant="outline"
                className="mt-4 border-forest-300 text-forest-600 hover:bg-forest-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Photo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-md overflow-hidden border border-forest-200 group cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image
                    src={photo.url || "/placeholder.svg"}
                    alt={`Progress photo from ${format(new Date(photo.date), "MMM d, yyyy")}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                    {format(new Date(photo.date), "MMM d, yyyy")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Photo Dialog */}
      <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Progress Photo</DialogTitle>
            <DialogDescription>Upload a new photo to track your progress</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-forest-200 rounded-lg">
              {isUploading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600 mx-auto"></div>
                  <p className="mt-2 text-forest-600">Uploading...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-forest-300" />
                  <p className="mt-2 text-forest-600">Click to select a photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {uploadError && (
              <div className="text-sm text-red-500 flex items-center gap-1">
                <X className="h-4 w-4" />
                {uploadError}
              </div>
            )}

            <Button onClick={() => setIsAddingPhoto(false)} variant="outline" className="w-full" disabled={isUploading}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        {selectedPhoto && (
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(selectedPhoto.date), "MMMM d, yyyy")}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-md overflow-hidden border border-forest-200">
                <Image
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={`Progress photo from ${format(new Date(selectedPhoto.date), "MMM d, yyyy")}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-forest-800">Notes</label>
                  <textarea
                    value={selectedPhoto.notes || ""}
                    onChange={(e) => updatePhotoNotes(selectedPhoto.id, e.target.value)}
                    placeholder="Add notes about your progress..."
                    className="w-full mt-1 p-2 border border-forest-200 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[100px]"
                  />
                </div>
                <Button onClick={() => deletePhoto(selectedPhoto.id)} variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Photo
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
