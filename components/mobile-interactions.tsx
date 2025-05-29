"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight, className }: SwipeableCardProps) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const diffX = currentX - startX
    const threshold = 100

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (diffX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setIsDragging(false)
    setCurrentX(0)
    setStartX(0)
  }

  const translateX = isDragging ? currentX - startX : 0

  return (
    <div
      ref={cardRef}
      className={cn("touch-pan-y", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: isDragging ? "none" : "transform 0.3s ease",
      }}
    >
      {children}
    </div>
  )
}

// Pull-to-refresh component
interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const threshold = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0 || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY.current

    if (distance > 0) {
      setIsPulling(true)
      setPullDistance(Math.min(distance, threshold * 1.5))
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setIsPulling(false)
    setPullDistance(0)
  }

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className="relative">
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-forest-50 transition-all duration-300"
          style={{ height: `${pullDistance}px` }}
        >
          <div className="text-forest-600 text-sm font-medium">
            {isRefreshing ? "Refreshing..." : pullDistance > threshold ? "Release to refresh" : "Pull to refresh"}
          </div>
        </div>
      )}

      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Long press component for additional actions
interface LongPressProps {
  onLongPress: () => void
  children: React.ReactNode
  delay?: number
}

export function LongPress({ onLongPress, children, delay = 500 }: LongPressProps) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [isPressed, setIsPressed] = useState(false)

  const handleStart = () => {
    setIsPressed(true)
    timeoutRef.current = setTimeout(() => {
      onLongPress()
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
    }, delay)
  }

  const handleEnd = () => {
    setIsPressed(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <div
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      className={cn("transition-all duration-200", isPressed && "scale-95 opacity-75")}
    >
      {children}
    </div>
  )
}
