"use client"

import { motion } from "framer-motion"
import type React from "react"

interface FloatingElementProps {
  children?: React.ReactNode
  icon?: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function FloatingElement({ children, icon, className = "", delay = 0, duration = 4 }: FloatingElementProps) {
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: [0, 5, -5, 0],
        z: [0, 10, -10, 0],
      }}
      transition={{
        opacity: { delay, duration: 0.8 },
        y: { delay, duration: 0.8 },
        rotateX: { delay, duration: 0.8 },
        rotateY: {
          delay: delay + 1,
          duration,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
        z: {
          delay: delay + 1.5,
          duration: duration * 1.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {icon || children}
    </motion.div>
  )
}
