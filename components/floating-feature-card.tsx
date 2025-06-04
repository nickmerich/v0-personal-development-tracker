"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FloatingFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradientColor: string
  delay?: number
}

export function FloatingFeatureCard({ icon, title, description, gradientColor, delay = 0 }: FloatingFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
    >
      <Card
        className="border border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6 relative">
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
          />

          {/* Top border gradient */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientColor} transform origin-left transition-transform duration-500 ${isHovered ? "scale-x-100" : "scale-x-0"}`}
          />

          <div className="text-center relative z-10">
            <motion.div
              className="mx-auto mb-4 p-3 rounded-full w-fit"
              animate={isHovered ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 1, repeat: isHovered ? Number.POSITIVE_INFINITY : 0, repeatType: "loop" }}
            >
              {icon}
            </motion.div>

            <h3 className="text-xl font-semibold mb-3 text-slate-900">{title}</h3>

            <p className="text-slate-600">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
