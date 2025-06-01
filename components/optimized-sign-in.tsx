"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-service"

interface OptimizedSignInFormProps {
  onSuccess?: () => void
  className?: string
  redirectTo?: string
}

interface FormErrors {
  email?: string
  name?: string
  general?: string
}

export function OptimizedSignInForm({ onSuccess, className, redirectTo = "/dashboard" }: OptimizedSignInFormProps) {
  const router = useRouter()
  const { signIn, isLoading: authLoading, error: authError, clearError } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    name: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  // Update errors when auth error changes
  useEffect(() => {
    if (authError) {
      setErrors({ general: authError })
    }
  }, [authError])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Clear general error
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }))
      clearError()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signIn(formData.email, formData.name)

      if (result.success) {
        setSuccessMessage("Welcome back! Redirecting to your dashboard...")

        // Call success callback or redirect
        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          } else {
            router.push(redirectTo)
          }
        }, 1000)
      } else {
        setErrors({
          general: result.error || "Sign in failed. Please check your credentials and try again.",
        })
      }
    } catch (error) {
      setErrors({
        general: "Sign in failed. Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-green-800">Welcome Back</CardTitle>
        <CardDescription className="text-center text-gray-600">Sign in to continue your climb</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={cn("w-full", errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500")}
              disabled={isLoading || authLoading}
              autoComplete="email"
            />
            {errors.email && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn("w-full", errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500")}
              disabled={isLoading || authLoading}
              autoComplete="name"
            />
            {errors.name && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </div>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{errors.general}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Create Account Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-green-600 hover:text-green-700 underline underline-offset-2"
              disabled={isLoading || authLoading}
              onClick={() => {
                // Handle create account flow
                router.push("/signup")
              }}
            >
              Create an account
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
