"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Bubble {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
}

export function BubbleBackground() {
  const bubbles = useRef<Bubble[]>([])

  useEffect(() => {
    // Generate random bubbles
    const colors = [
      "bg-emerald-400/20",
      "bg-blue-400/20",
      "bg-purple-400/20",
      "bg-amber-400/20",
      "bg-teal-400/20",
      "bg-indigo-400/20",
    ]

    const newBubbles: Bubble[] = []

    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 200 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 5,
        duration: Math.random() * 20 + 15,
      })
    }

    bubbles.current = newBubbles
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.current.map((bubble) => (
        <motion.div
          key={bubble.id}
          className={`absolute rounded-full blur-3xl ${bubble.color}`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, Math.random() * 0.4 + 0.8, 1],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
