"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  badge?: string | number
  icon?: React.ReactNode
  onClick?: () => void
  onAction?: () => void
  actionLabel?: string
  variant?: "default" | "compact" | "feature"
  className?: string
  interactive?: boolean
}

export function MobileCard({
  title,
  description,
  children,
  badge,
  icon,
  onClick,
  onAction,
  actionLabel,
  variant = "default",
  className,
  interactive = true,
}: MobileCardProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = () => {
    if (interactive && onClick) {
      setIsPressed(true)
    }
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  const cardVariants = {
    default: "p-4 sm:p-6",
    compact: "p-3 sm:p-4",
    feature: "p-6 sm:p-8",
  }

  return (
    <Card
      className={cn(
        "border-forest-200 bg-white/80 backdrop-blur-sm transition-all duration-200 touch-manipulation",
        interactive && onClick && "cursor-pointer hover:shadow-md hover:border-forest-300 active:scale-[0.98]",
        isPressed && "scale-[0.98] shadow-lg",
        className,
      )}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CardHeader className={cn("pb-3", cardVariants[variant])}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {icon && <div className="flex-shrink-0 mt-1">{icon}</div>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-forest-800 text-base sm:text-lg truncate">{title}</CardTitle>
                {badge && (
                  <Badge variant="secondary" className="bg-forest-100 text-forest-800 text-xs flex-shrink-0">
                    {badge}
                  </Badge>
                )}
              </div>
              {description && (
                <CardDescription className="text-stone-600 text-sm line-clamp-2">{description}</CardDescription>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {onAction && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onAction()
                }}
                className="h-8 w-8 text-stone-500 hover:text-forest-600 hover:bg-forest-50 touch-manipulation"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            )}
            {onClick && (
              <ChevronRight className="h-4 w-4 text-stone-400 transition-transform duration-200 group-hover:translate-x-1" />
            )}
          </div>
        </div>
      </CardHeader>

      {children && <CardContent className={cn("pt-0", cardVariants[variant])}>{children}</CardContent>}

      {actionLabel && onAction && (
        <CardContent className={cn("pt-0", cardVariants[variant])}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onAction()
            }}
            className="w-full border-forest-300 text-forest-600 hover:bg-forest-50 touch-manipulation"
          >
            {actionLabel}
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

// Mobile-optimized grid layout
interface MobileGridProps {
  children: React.ReactNode
  columns?: 1 | 2
  gap?: "sm" | "md" | "lg"
  className?: string
}

export function MobileGrid({ children, columns = 1, gap = "md", className }: MobileGridProps) {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  }

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
  }

  return <div className={cn("grid", columnClasses[columns], gapClasses[gap], className)}>{children}</div>
}

// Mobile-optimized list item
interface MobileListItemProps {
  title: string
  subtitle?: string
  description?: string
  icon?: React.ReactNode
  badge?: string | number
  action?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function MobileListItem({
  title,
  subtitle,
  description,
  icon,
  badge,
  action,
  onClick,
  className,
}: MobileListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 bg-white rounded-xl border border-forest-200 transition-all duration-200 touch-manipulation",
        onClick && "cursor-pointer hover:bg-forest-25 hover:border-forest-300 active:bg-forest-50 active:scale-[0.98]",
        className,
      )}
      onClick={onClick}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-forest-800 text-sm truncate">{title}</h3>
          {badge && (
            <Badge variant="secondary" className="bg-forest-100 text-forest-800 text-xs flex-shrink-0">
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && <p className="text-xs text-forest-600 mb-1">{subtitle}</p>}
        {description && <p className="text-xs text-stone-600 line-clamp-2">{description}</p>}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
      {onClick && !action && <ChevronRight className="h-4 w-4 text-stone-400 flex-shrink-0" />}
    </div>
  )
}
