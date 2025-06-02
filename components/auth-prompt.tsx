"use client"

import type React from "react"

import { authService } from "@/lib/auth-service"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AuthPromptProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function AuthPrompt({ children, onSuccess }: AuthPromptProps) {
  const onSignIn = async () => {
    await authService.signIn()
    onSuccess?.()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Authentication Required</AlertDialogTitle>
          <AlertDialogDescription>You need to sign in to perform this action.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSignIn}>Sign In</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
