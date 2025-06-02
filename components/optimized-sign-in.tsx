"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, User } from "lucide-react"
import { authService } from "@/lib/auth-service"

interface OptimizedSignInProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function OptimizedSignIn({ onSuccess, onCancel }: OptimizedSignInProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || (mode === "signup" && !name.trim())) return

    setIsLoading(true)
    setError(null)

    try {
      const result =
        mode === "signin"
          ? await authService.signIn(email.trim(), name || "User")
          : await authService.signUp(email.trim(), name.trim())

      if (result.success) {
        onSuccess?.()
      } else {
        setError(result.error || `${mode === "signin" ? "Sign in" : "Sign up"} failed`)
      }
    } catch (err) {
      setError(`Network error during ${mode === "signin" ? "sign in" : "sign up"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Sign in to access your personal development journey"
            : "Start your 90-day transformation journey"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required={mode === "signup"}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || !email.trim() || (mode === "signup" && !name.trim())}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "signin" ? "Signing In..." : "Creating Account..."}
              </>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-sm text-green-600 hover:text-green-700 underline"
              disabled={isLoading}
            >
              {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="w-full" disabled={isLoading}>
              Continue Without Account
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
