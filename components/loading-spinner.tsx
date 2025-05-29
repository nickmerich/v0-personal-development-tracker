"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div
        className={cn("animate-spin rounded-full border-2 border-forest-200 border-t-forest-600", sizeClasses[size])}
      />
      {text && <p className="text-forest-800 font-medium">{text}</p>}
    </div>
  )
}

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}
