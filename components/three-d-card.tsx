"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion } from "framer-motion"

interface ThreeDCardProps {
  children: ReactNode
  className?: string
  depth?: number
  variant?: "default" | "success" | "warning" | "neutral"
}

export function ThreeDCard({ children, className = "", depth = 15, variant = "default" }: ThreeDCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [scale, setScale] = useState(1)

  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    const cardCenterX = rect.left + rect.width / 2
    const cardCenterY = rect.top + rect.height / 2

    const percentX = (e.clientX - cardCenterX) / rect.width
    const percentY = (e.clientY - cardCenterY) / rect.height

    // Subtle rotation for Gryt aesthetic
    const rotX = percentY * 4 // Max 4 degrees
    const rotY = -percentX * 4 // Max 4 degrees

    setRotateX(rotX)
    setRotateY(rotY)
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "glass-gryt-card border-gryt-green/30 hover:border-gryt-green/50"
      case "warning":
        return "glass-gryt-card border-gryt-red/30 hover:border-gryt-red/50"
      case "neutral":
        return "glass-gryt-card border-gryt-gray-muted/20 hover:border-gryt-gray-muted/30"
      default:
        return "glass-gryt-card border-gryt-gray-muted/20 hover:border-gryt-gray-muted/30"
    }
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl shadow-lg ${getVariantStyles()} ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX,
        rotateY,
        scale,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.3,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setScale(1.01)}
      onMouseLeave={() => {
        setRotateX(0)
        setRotateY(0)
        setScale(1)
      }}
    >
      <div style={{ transform: `translateZ(${depth / 2}px)` }}>{children}</div>

      {/* Gryt-themed shine effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 pointer-events-none ${
          variant === "success"
            ? "from-gryt-green/10 to-transparent"
            : variant === "warning"
              ? "from-gryt-red/10 to-transparent"
              : "from-gryt-white/5 to-transparent"
        }`}
        animate={{ opacity: Math.abs(rotateX) > 1 || Math.abs(rotateY) > 1 ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Gryt shadow effect */}
      <div
        className="absolute -inset-1 rounded-2xl bg-gryt-charcoal/40 -z-10 blur-sm"
        style={{ transform: `translateZ(-${depth}px)` }}
      />
    </motion.div>
  )
}
