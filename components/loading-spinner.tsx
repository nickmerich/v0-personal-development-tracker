"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
  showProgress?: boolean
  progress?: number
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
  showProgress = false,
  progress = 0,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        <div
          className={cn("animate-spin rounded-full border-2 border-forest-200 border-t-forest-600", sizeClasses[size])}
        />
        {showProgress && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-forest-600">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
      {text && (
        <div className="text-center">
          <p className="text-forest-800 font-medium">{text}</p>
          {showProgress && (
            <div className="w-32 bg-forest-200 rounded-full h-2 mt-2">
              <div
                className="bg-forest-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function PageLoader({ text = "Loading...", progress }: { text?: string; progress?: number }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50">
      <LoadingSpinner size="lg" text={text} showProgress={progress !== undefined} progress={progress} />
    </div>
  )
}
