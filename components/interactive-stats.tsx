"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface Stat {
  number: string
  label: string
  color: string
}

interface InteractiveStatsProps {
  stats: Stat[]
}

export function InteractiveStats({ stats }: InteractiveStatsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getColorClasses = (color: string, isHovered: boolean) => {
    const baseClasses = "rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm"

    if (isHovered) {
      switch (color) {
        case "emerald":
          return `${baseClasses} bg-emerald-500 text-white shadow-lg shadow-emerald-500/20`
        case "blue":
          return `${baseClasses} bg-blue-500 text-white shadow-lg shadow-blue-500/20`
        case "purple":
          return `${baseClasses} bg-purple-500 text-white shadow-lg shadow-purple-500/20`
        default:
          return `${baseClasses} bg-emerald-500 text-white shadow-lg shadow-emerald-500/20`
      }
    } else {
      switch (color) {
        case "emerald":
          return `${baseClasses} bg-emerald-100/80 text-emerald-800`
        case "blue":
          return `${baseClasses} bg-blue-100/80 text-blue-800`
        case "purple":
          return `${baseClasses} bg-purple-100/80 text-purple-800`
        default:
          return `${baseClasses} bg-emerald-100/80 text-emerald-800`
      }
    }
  }

  return (
    <motion.div
      className="grid grid-cols-3 gap-4 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={getColorClasses(stat.color, hoveredIndex === index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-center">
            <motion.div
              className="text-4xl md:text-5xl font-bold mb-1"
              animate={hoveredIndex === index ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {stat.number}
            </motion.div>
            <div className="text-sm md:text-base font-medium">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
