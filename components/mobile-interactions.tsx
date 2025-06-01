"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Swipeable Card Component
interface SwipeableCardProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  className?: string
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight, threshold = 100, className }: SwipeableCardProps) {
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
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
  }

  return (
    <div
      className={cn("touch-manipulation", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

// Long Press Component
interface LongPressProps {
  children: ReactNode
  onLongPress: () => void
  duration?: number
  className?: string
}

export function LongPress({ children, onLongPress, duration = 500, className }: LongPressProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startLongPress = () => {
    timerRef.current = setTimeout(() => {
      onLongPress()
    }, duration)
  }

  const endLongPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  return (
    <div
      className={cn("touch-manipulation", className)}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
      onTouchCancel={endLongPress}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
    >
      {children}
    </div>
  )
}

// Pull to Refresh Component
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

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull to refresh at the top of the page
    if (typeof window !== "undefined" && window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    // Only allow pulling down, not up
    if (distance > 0) {
      // Apply resistance to make it feel more natural
      setPullDistance(Math.min(distance * 0.4, threshold * 1.5))
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
          className="absolute left-0 right-0 flex justify-center items-center text-sm text-gray-500"
          style={{
            top: -40 + pullDistance,
            height: 40,
            opacity: Math.min(pullDistance / threshold, 1),
          }}
        >
          {pullDistance > threshold ? "Release to refresh" : "Pull down to refresh"}
        </div>
      )}

      {/* Loading indicator */}
      {isRefreshing && (
        <div className="absolute left-0 right-0 top-0 flex justify-center items-center h-10 bg-blue-50">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span className="ml-2 text-sm text-blue-600">Refreshing...</span>
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
