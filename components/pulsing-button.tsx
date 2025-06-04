"use client"

import type React from "react"

import { motion } from "framer-motion"
import type { ButtonHTMLAttributes } from "react"

interface PulsingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function PulsingButton({ children, className, ...props }: PulsingButtonProps) {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20 blur-md"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <button className={`relative z-10 ${className}`} {...props}>
        {children}
      </button>
    </div>
  )
}
