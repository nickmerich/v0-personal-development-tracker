"use client"

import type React from "react"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface TiltButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "urgent"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
}

export function TiltButton({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
}: TiltButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered || disabled) return

    const element = e.currentTarget
    const rect = element.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distX = e.clientX - centerX
    const distY = e.clientY - centerY

    const percentX = distX / rect.width
    const percentY = distY / rect.height

    // Subtle tilt for Gryt aesthetic
    setTiltX(percentY * -2) // Max 2 degrees
    setTiltY(percentX * 2) // Max 2 degrees
  }

  const resetTilt = () => {
    setIsHovered(false)
    setTiltX(0)
    setTiltY(0)
  }

  const getGlowColor = () => {
    switch (variant) {
      case "default":
        return "from-gryt-green/30 to-gryt-green/10"
      case "destructive":
      case "urgent":
        return "from-gryt-red/30 to-gryt-red/10"
      case "outline":
        return "from-gryt-white/20 to-gryt-white/5"
      default:
        return "from-gryt-green/30 to-gryt-green/10"
    }
  }

  return (
    <motion.div
      className="relative inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={resetTilt}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX: tiltX,
        rotateY: tiltY,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      <Button
        onClick={onClick}
        className={`relative transition-gryt ${className}`}
        variant={variant}
        size={size}
        disabled={disabled}
      >
        {children}
      </Button>

      {/* Gryt glow effect */}
      <motion.div
        className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${getGlowColor()} blur-sm -z-10`}
        animate={{
          opacity: isHovered && !disabled ? 0.6 : 0,
          scale: isHovered && !disabled ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
