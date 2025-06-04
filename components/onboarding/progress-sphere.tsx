"use client"

import { motion } from "framer-motion"

interface ProgressSphereProps {
  progress: number
  currentStep: number
  totalSteps: number
}

export function ProgressSphere({ progress, currentStep, totalSteps }: ProgressSphereProps) {
  const circumference = 2 * Math.PI * 40 // radius = 40

  return (
    <div className="relative">
      <motion.div
        className="relative w-24 h-24"
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background circle */}
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="white"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-lg font-bold">{currentStep}</div>
            <div className="text-xs opacity-80">of {totalSteps}</div>
          </motion.div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white/20 blur-md -z-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  )
}
