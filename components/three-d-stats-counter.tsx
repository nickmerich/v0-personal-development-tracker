"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ThreeDStatsCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  color?: "emerald" | "blue" | "purple" | "amber"
}

export function ThreeDStatsCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  color = "emerald",
}: ThreeDStatsCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const colorClasses = {
    emerald: "from-emerald-500 to-emerald-600 text-emerald-600",
    blue: "from-blue-500 to-blue-600 text-blue-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    amber: "from-amber-500 to-amber-600 text-amber-600",
  }

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <motion.div
      className="text-center p-6 bg-white rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      whileInView={{
        opacity: 1,
        y: 0,
        rotateX: 0,
        onComplete: () => setIsVisible(true),
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}
        animate={{ scale: isVisible ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </motion.div>
      <div className="text-slate-600 font-medium">{label}</div>
    </motion.div>
  )
}
