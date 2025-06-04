"use client"

import { motion } from "framer-motion"
import { ThreeDCard } from "../three-d-card"

interface Goal {
  id: string
  title: string
  description: string
  icon: string
}

interface InteractiveGoalCardProps {
  goal: Goal
  isSelected: boolean
  onSelect: () => void
}

export function InteractiveGoalCard({ goal, isSelected, onSelect }: InteractiveGoalCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
      <ThreeDCard
        className={`p-6 cursor-pointer transition-gryt ${
          isSelected
            ? "glass-gryt-card border-gryt-green/50 shadow-lg"
            : "glass-gryt-card border-gryt-gray-muted/20 hover:border-gryt-gray-muted/40"
        }`}
        onClick={onSelect}
        variant={isSelected ? "success" : "default"}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">{goal.icon}</div>
          <h3 className="text-lg font-semibold mb-2 text-gryt-white">{goal.title}</h3>
          <p className="text-sm text-gryt-gray-text leading-relaxed">{goal.description}</p>

          {isSelected && (
            <motion.div
              className="mt-4 w-6 h-6 bg-gryt-green rounded-full mx-auto flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-3 h-3 bg-gryt-white rounded-full" />
            </motion.div>
          )}
        </div>
      </ThreeDCard>
    </motion.div>
  )
}
