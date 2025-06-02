"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Enhanced Swipeable Card Component with visual feedback
interface SwipeableCardProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  className?: string
  showSwipeIndicators?: boolean
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  className,
  showSwipeIndicators = true,
}: SwipeableCardProps) {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0].clientX
    setTouchStart(touch)
    setTouchEnd(touch)
    setCurrentX(0)
    setIsDragging(true)
    setSwipeDirection(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.targetTouches[0].clientX
    setTouchEnd(touch)

    const distance = touch - touchStart
    setCurrentX(distance)

    // Determine swipe direction for visual feedback
    if (Math.abs(distance) > 20) {
      setSwipeDirection(distance > 0 ? "right" : "left")
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    }

    if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }

    // Reset values
    setTouchStart(0)
    setTouchEnd(0)
    setCurrentX(0)
    setSwipeDirection(null)
  }

  const swipeProgress = Math.min(Math.abs(currentX) / threshold, 1)
  const isLeftAction = currentX < -threshold
  const isRightAction = currentX > threshold

  return (
    <div className="relative overflow-hidden">
      {/* Swipe Action Indicators */}
      {showSwipeIndicators && isDragging && (
        <>
          {/* Left swipe indicator */}
          <div
            className={cn(
              "absolute inset-y-0 right-0 flex items-center justify-end pr-4 transition-all duration-200",
              "bg-gradient-to-l from-red-500 to-red-400 text-white",
              swipeDirection === "left" ? "opacity-100" : "opacity-0",
            )}
            style={{
              width: `${Math.max(0, Math.abs(currentX))}px`,
              transform: `translateX(${Math.min(0, currentX)}px)`,
            }}
          >
            <div className={cn("transition-all duration-200", isLeftAction ? "scale-110" : "scale-100")}>🗑️</div>
          </div>

          {/* Right swipe indicator */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 flex items-center justify-start pl-4 transition-all duration-200",
              "bg-gradient-to-r from-green-500 to-green-400 text-white",
              swipeDirection === "right" ? "opacity-100" : "opacity-0",
            )}
            style={{
              width: `${Math.max(0, currentX)}px`,
              transform: `translateX(${Math.max(0, currentX - threshold)}px)`,
            }}
          >
            <div className={cn("transition-all duration-200", isRightAction ? "scale-110" : "scale-100")}>✅</div>
          </div>
        </>
      )}

      {/* Main content */}
      <div
        className={cn(
          "touch-manipulation relative z-10 transition-transform duration-200",
          isDragging ? "transition-none" : "",
          className,
        )}
        style={{
          transform: isDragging ? `translateX(${currentX * 0.8}px)` : "translateX(0px)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

// Enhanced Long Press Component with visual feedback
interface LongPressProps {
  children: ReactNode
  onLongPress: () => void
  duration?: number
  className?: string
  showProgress?: boolean
}

export function LongPress({ children, onLongPress, duration = 500, className, showProgress = true }: LongPressProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  const startLongPress = useCallback(() => {
    setIsPressed(true)
    setProgress(0)

    // Start progress animation
    if (showProgress) {
      const startTime = Date.now()
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min((elapsed / duration) * 100, 100)
        setProgress(newProgress)

        if (newProgress < 100) {
          progressRef.current = setTimeout(updateProgress, 16) // ~60fps
        }
      }
      updateProgress()
    }

    // Set long press timer
    timerRef.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
      setProgress(0)
    }, duration)
  }, [onLongPress, duration, showProgress])

  const endLongPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (progressRef.current) {
      clearTimeout(progressRef.current)
    }
    setIsPressed(false)
    setProgress(0)
  }, [])

  return (
    <div className={cn("relative", className)}>
      {/* Progress indicator */}
      {showProgress && isPressed && (
        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
          <div
            className="h-full bg-forest-200/50 transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "touch-manipulation relative z-10 transition-all duration-150",
          isPressed && "scale-95 brightness-95",
        )}
        onTouchStart={startLongPress}
        onTouchEnd={endLongPress}
        onTouchCancel={endLongPress}
        onMouseDown={startLongPress}
        onMouseUp={endLongPress}
        onMouseLeave={endLongPress}
      >
        {children}
      </div>
    </div>
  )
}

// Enhanced Pull to Refresh Component
interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
}

export function PullToRefresh({ children, onRefresh, threshold = 80, className }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull to refresh at the top of the page
    if (typeof window !== "undefined" && window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      currentY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return

    currentY.current = e.touches[0].clientY
    const distance = currentY.current - startY.current

    // Only allow pulling down, not up
    if (distance > 0) {
      // Apply resistance to make it feel more natural
      const resistance = Math.min(distance * 0.4, threshold * 1.5)
      setPullDistance(resistance)
    } else {
      setPullDistance(0)
    }
  }

  const handleTouchEnd = async () => {
    if (!isPulling) return

    if (pullDistance > threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
    setIsPulling(false)
  }

  const pullProgress = Math.min(pullDistance / threshold, 1)

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {pullDistance > 0 && (
        <div
          className="absolute left-0 right-0 flex flex-col items-center justify-center text-sm text-forest-600 z-20"
          style={{
            top: -60 + pullDistance,
            height: 60,
            opacity: Math.min(pullDistance / threshold, 1),
          }}
        >
          <div
            className={cn(
              "w-8 h-8 border-2 border-forest-300 rounded-full transition-all duration-200",
              pullProgress >= 1 ? "border-forest-600 animate-spin" : "",
            )}
            style={{
              transform: `rotate(${pullProgress * 360}deg)`,
              borderTopColor: pullProgress >= 1 ? "transparent" : "hsl(var(--forest-600))",
            }}
          />
          <div className="mt-2 font-medium">{pullProgress >= 1 ? "Release to refresh" : "Pull down to refresh"}</div>
        </div>
      )}

      {/* Loading indicator */}
      {isRefreshing && (
        <div className="absolute left-0 right-0 top-0 flex flex-col items-center justify-center h-16 bg-forest-50/90 backdrop-blur-sm z-20">
          <div className="w-6 h-6 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
          <span className="mt-2 text-sm font-medium text-forest-600">Refreshing...</span>
        </div>
      )}

      {/* Content with transform based on pull distance */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Haptic feedback simulation (visual feedback for web)
export const hapticFeedback = {
  light: () => {
    // For web, we'll use visual feedback
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10)
    }
  },
  medium: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(20)
    }
  },
  heavy: () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([30, 10, 30])
    }
  },
}
