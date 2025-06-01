"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Cloud, Shield, Smartphone, X } from "lucide-react"
import { useAuth } from "@/lib/auth-service"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  title?: string
  description?: string
}

export function AuthModal({ isOpen, onClose, onSuccess, title, description }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [activeTab, setActiveTab] = useState("signin")
  const { signUp, signIn, isLoading, error, clearError } = useAuth()

  if (!isOpen) return null

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    const result = await signIn(email.trim())
    if (result.success) {
      onSuccess?.()
      onClose()
      setEmail("")
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !name.trim()) return

    const result = await signUp(email.trim(), name.trim())
    if (result.success) {
      onSuccess?.()
      onClose()
      setEmail("")
      setName("")
    }
  }

  const handleClose = () => {
    clearError()
    onClose()
    setEmail("")
    setName("")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={handleClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-forest-100 rounded-lg">
              <Cloud className="h-5 w-5 text-forest-600" />
            </div>
            <CardTitle className="text-xl text-forest-800">{title || "Save Your Progress"}</CardTitle>
          </div>
          <CardDescription className="text-stone-600">
            {description || "Sign in to backup your data and sync across devices"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Benefits Section */}
          <div className="mb-6 p-4 bg-forest-50 rounded-lg border border-forest-200">
            <h4 className="font-medium text-forest-800 mb-3">Why sign in?</h4>
            <div className="space-y-2 text-sm text-stone-600">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-forest-600" />
                <span>Automatic cloud backup</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-forest-600" />
                <span>Sync across all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-forest-600" />
                <span>Never lose your progress</span>
              </div>
            </div>
          </div>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-forest-300 focus:border-forest-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-forest-600 hover:bg-forest-700"
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              <p className="text-xs text-stone-500 text-center">No password needed - we'll send you a secure link</p>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-forest-300 focus:border-forest-500"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-forest-300 focus:border-forest-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-forest-600 hover:bg-forest-700"
                  disabled={isLoading || !email.trim() || !name.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              <p className="text-xs text-stone-500 text-center">Your local data will be automatically backed up</p>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter>
          <Button variant="outline" onClick={handleClose} className="w-full" disabled={isLoading}>
            Continue Without Backup
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
