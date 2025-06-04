"use client"

import { useRef, useEffect } from "react"

interface BubbleProps {
  colorClass?: string
  zIndex?: number
  bubbleCount?: number
  minSize?: number
  maxSize?: number
  speed?: number
}

export function ThreeDEffectField({
  colorClass = "bg-emerald-500",
  zIndex = -10,
  bubbleCount = 15,
  minSize = 30,
  maxSize = 120,
  speed = 1,
}: BubbleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const bubblesRef = useRef<HTMLDivElement[]>([])
  const bubblesAnimationData = useRef<
    Array<{ x: number; y: number; size: number; xSpeed: number; ySpeed: number; zSpeed: number; z: number }>
  >([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initialize bubbles
    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    bubblesRef.current = []
    bubblesAnimationData.current = []

    // Create bubbles
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement("div")
      const size = Math.random() * (maxSize - minSize) + minSize

      // Set base styles
      bubble.style.position = "absolute"
      bubble.style.width = `${size}px`
      bubble.style.height = `${size}px`
      bubble.style.borderRadius = "50%"
      bubble.classList.add(colorClass, "opacity-10")
      bubble.style.filter = "blur(8px)"
      bubble.style.willChange = "transform"

      // Set initial position
      const x = Math.random() * containerWidth
      const y = Math.random() * containerHeight
      const z = Math.random() * 100 - 50 // z between -50 and 50

      const scale = (z + 70) / 100
      bubble.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`

      // Animation data
      bubblesAnimationData.current.push({
        x,
        y,
        size,
        xSpeed: (Math.random() - 0.5) * speed,
        ySpeed: (Math.random() - 0.5) * speed,
        zSpeed: (Math.random() - 0.5) * speed * 0.3,
        z,
      })

      container.appendChild(bubble)
      bubblesRef.current.push(bubble)
    }

    // Animation loop
    const animate = () => {
      for (let i = 0; i < bubblesRef.current.length; i++) {
        const bubble = bubblesRef.current[i]
        const data = bubblesAnimationData.current[i]

        // Update position
        data.x += data.xSpeed
        data.y += data.ySpeed
        data.z += data.zSpeed

        // Bounce off edges
        if (data.x <= 0 || data.x >= containerWidth) {
          data.xSpeed *= -1
        }

        if (data.y <= 0 || data.y >= containerHeight) {
          data.ySpeed *= -1
        }

        if (data.z <= -50 || data.z >= 50) {
          data.zSpeed *= -1
        }

        // Set new position with 3D transform and scale based on z
        const scale = (data.z + 70) / 100 // Scale between 0.2 and 1.2 based on z position
        bubble.style.transform = `translate3d(${data.x}px, ${data.y}px, 0px) scale(${scale})`

        // Adjust opacity based on z
        bubble.style.opacity = `${(scale * 0.3).toFixed(2)}`
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)

      // Clean up bubbles
      bubblesRef.current.forEach((bubble) => {
        if (bubble.parentNode === container) {
          container.removeChild(bubble)
        }
      })
    }
  }, [bubbleCount, colorClass, maxSize, minSize, speed])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex, perspective: "1000px", transformStyle: "preserve-3d" }}
    />
  )
}
