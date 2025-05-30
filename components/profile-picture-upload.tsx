"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, Loader2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfilePictureUploadProps {
  initialImageUrl?: string
  onImageUploaded?: (url: string) => void
  className?: string
}

export function ProfilePictureUpload({ initialImageUrl, onImageUploaded, className }: ProfilePictureUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setUploadError(null)
    setIsUploading(true)

    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit")
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "profile-pictures")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setImageUrl(data.url)

      // Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      userData.profilePicture = data.url
      localStorage.setItem("userData", JSON.stringify(userData))

      // Callback
      if (onImageUploaded) {
        onImageUploaded(data.url)
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-square overflow-hidden bg-forest-100">
            {imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Profile picture"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Camera className="h-12 w-12 text-forest-400" />
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="w-full p-4 space-y-2">
            <Button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="w-full bg-forest-600 hover:bg-forest-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              {imageUrl ? "Change Photo" : "Upload Photo"}
            </Button>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

            {uploadError && (
              <div className="text-sm text-red-500 flex items-center gap-1">
                <X className="h-4 w-4" />
                {uploadError}
              </div>
            )}

            {imageUrl && !uploadError && !isUploading && (
              <div className="text-sm text-forest-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Photo uploaded successfully
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
