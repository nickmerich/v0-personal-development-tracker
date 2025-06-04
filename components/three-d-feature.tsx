"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ThreeDFeatureProps {
  title: string
  description: string
  icon: ReactNode
  alignment?: "left" | "right"
}

export function ThreeDFeature({ title, description, icon, alignment = "left" }: ThreeDFeatureProps) {
  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${
        alignment === "right" ? "md:flex-row-reverse" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="flex-1 text-center md:text-left"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">{title}</h3>
        <p className="text-slate-600 text-lg leading-relaxed">{description}</p>
      </motion.div>

      <motion.div
        className="flex-shrink-0 p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl shadow-lg"
        whileHover={{
          scale: 1.05,
          rotateY: 5,
          rotateX: 5,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="text-emerald-600">{icon}</div>
      </motion.div>
    </motion.div>
  )
}
