"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
}

export function MobileLayout({ children, className, padding = "md", maxWidth = "lg" }: MobileLayoutProps) {
  const paddingClasses = {
    none: "",
    sm: "px-3 py-2",
    md: "px-4 py-3 sm:px-6 sm:py-4",
    lg: "px-6 py-4 sm:px-8 sm:py-6",
  }

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  }

  return (
    <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth], paddingClasses[padding], className)}>
      {children}
    </div>
  )
}

// Mobile-optimized card component
interface MobileCardProps {
  children: ReactNode
  className?: string
  padding?: "sm" | "md" | "lg"
  interactive?: boolean
}

export function MobileCard({ children, className, padding = "md", interactive = false }: MobileCardProps) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-forest-200 shadow-sm",
        paddingClasses[padding],
        interactive && "transition-all duration-200 active:scale-[0.98] touch-manipulation",
        className,
      )}
    >
      {children}
    </div>
  )
}

// Mobile-optimized button component
interface MobileButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "full"
  disabled?: boolean
  className?: string
}

export function MobileButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
}: MobileButtonProps) {
  const baseClasses = "font-medium rounded-xl transition-all duration-200 touch-manipulation active:scale-95"

  const variantClasses = {
    primary: "bg-forest-600 text-white hover:bg-forest-700 shadow-sm",
    secondary: "bg-forest-100 text-forest-900 hover:bg-forest-200",
    outline: "border-2 border-forest-300 text-forest-700 hover:bg-forest-50",
    ghost: "text-forest-700 hover:bg-forest-100",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[40px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[56px]",
    full: "w-full px-6 py-3 text-base min-h-[48px]",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  )
}
