"use client"

import { cn } from "@/lib/utils"

import { useRef } from "react"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { debounce } from "lodash"

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(elementRef: React.RefObject<Element>, options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}

// Debounced input hook for search
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Virtual scrolling for large lists
interface VirtualScrollProps {
  items: any[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
}

export function VirtualScroll({ items, itemHeight, containerHeight, renderItem }: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(visibleStart + Math.ceil(containerHeight / itemHeight) + 1, items.length)

  const visibleItems = items.slice(visibleStart, visibleEnd)

  const handleScroll = useCallback(
    debounce((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }, 16),
    [],
  )

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={handleScroll}
      className="scrollbar-thin scrollbar-thumb-forest-300 scrollbar-track-forest-100"
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${visibleStart * itemHeight}px)` }}>
          {visibleItems.map((item, index) => renderItem(item, visibleStart + index))}
        </div>
      </div>
    </div>
  )
}

// Image lazy loading component
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export function LazyImage({ src, alt, className, placeholder = "/placeholder.svg" }: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const isInView = useIntersectionObserver(imgRef, { threshold: 0.1 })

  useEffect(() => {
    if (isInView && !isLoaded) {
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.src = src
    }
  }, [isInView, src, isLoaded])

  return (
    <img
      ref={imgRef}
      src={imageSrc || "/placeholder.svg"}
      alt={alt}
      className={cn("transition-opacity duration-300", !isLoaded && "opacity-50", className)}
    />
  )
}
