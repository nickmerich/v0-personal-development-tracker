"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const EnhancedProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
    showAnimation?: boolean
    milestone?: number
  }
>(({ className, value, indicatorClassName, showAnimation = true, milestone, ...props }, ref) => {
  const [animatedValue, setAnimatedValue] = React.useState(0)

  React.useEffect(() => {
    if (showAnimation && value !== undefined) {
      const timer = setTimeout(() => {
        setAnimatedValue(value)
      }, 100)
      return () => clearTimeout(timer)
    } else if (value !== undefined) {
      setAnimatedValue(value)
    }
  }, [value, showAnimation])

  const displayValue = showAnimation ? animatedValue : value || 0

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-stone-100", "shadow-inner", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-700 ease-out",
          "bg-gradient-to-r from-forest-500 to-forest-600",
          "relative overflow-hidden",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - displayValue}%)` }}
      >
        {/* Animated shine effect */}
        {showAnimation && displayValue > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        )}
      </ProgressPrimitive.Indicator>

      {/* Milestone marker */}
      {milestone && milestone > 0 && milestone < 100 && (
        <div className="absolute top-0 bottom-0 w-0.5 bg-earth-600 z-10" style={{ left: `${milestone}%` }}>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-earth-600 rounded-full" />
        </div>
      )}

      {/* Completion celebration */}
      {displayValue >= 100 && (
        <div className="absolute inset-0 bg-gradient-to-r from-forest-400/30 to-earth-400/30 animate-pulse rounded-full" />
      )}
    </ProgressPrimitive.Root>
  )
})
EnhancedProgress.displayName = ProgressPrimitive.Root.displayName

export { EnhancedProgress }
