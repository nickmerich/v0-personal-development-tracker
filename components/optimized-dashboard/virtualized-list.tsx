"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface VirtualizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  overscan?: number
  className?: string
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  overscan = 5,
  className,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container

      // Calculate visible range
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
      const end = Math.min(items.length, Math.ceil((scrollTop + clientHeight) / itemHeight) + overscan)

      setVisibleRange({ start, end })
    }

    // Initial calculation
    handleScroll()

    // Add scroll listener
    container.addEventListener("scroll", handleScroll)

    // Add resize listener
    const resizeObserver = new ResizeObserver(handleScroll)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener("scroll", handleScroll)
      resizeObserver.disconnect()
    }
  }, [items.length, itemHeight, overscan])

  // Calculate total height
  const totalHeight = items.length * itemHeight

  // Calculate visible items
  const visibleItems = items.slice(visibleRange.start, visibleRange.end)

  // Calculate offset for visible items
  const offsetY = visibleRange.start * itemHeight

  return (
    <div ref={containerRef} className={`overflow-auto relative ${className || ""}`} style={{ height: "100%" }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={visibleRange.start + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
