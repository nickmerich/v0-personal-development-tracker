"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface AnimatedGradientTextProps {
  children: React.ReactNode
}

export function AnimatedGradientText({ children }: AnimatedGradientTextProps) {
  const [rotation, setRotation] = useState(130)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="inline-block font-bold bg-clip-text text-transparent"
      style={{
        backgroundImage: `linear-gradient(${rotation}deg, #10b981, #0ea5e9, #8b5cf6)`,
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </span>
  )
}
