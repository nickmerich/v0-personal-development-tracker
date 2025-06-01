"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock } from "lucide-react"
import { storage } from "@/lib/storage"

interface AuthPromptProps {
  onAuthSuccess?: () => void
  onCancel?: () => void
}

export function AuthPrompt({ onAuthSuccess, onCancel }: AuthPromptProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !name.trim()) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await storage.login(email.trim(), name.trim())
      if (success) {
        onAuthSuccess?.()
      } else {
        setError("Failed to sign in. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-forest-200 bg-white shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-100">
          <Lock className="h-6 w-6 text-forest-600" />
        </div>
        <CardTitle className="text-xl font-bold text-forest-800">Save Your Progress</CardTitle>
        <CardDescription className="text-stone-600">
          Sign in to sync your data across devices and never lose your progress
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-forest-700">
              Your Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 border-forest-300 focus:border-forest-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-forest-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-forest-300 focus:border-forest-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="p-3 bg-forest-50 border border-forest-200 rounded-md">
            <p className="text-xs text-forest-700">
              <strong>Privacy:</strong> We only use your email to sync your data. No spam, no sharing.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 border-forest-300 text-forest-600 hover:bg-forest-50"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || !email.trim() || !name.trim()}
            className="flex-1 bg-forest-600 text-white hover:bg-forest-700"
          >
            {isLoading ? "Signing in..." : "Sign In & Sync"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
