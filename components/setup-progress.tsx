"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface SetupProgressProps {
  currentStep: number
  totalSteps: number
}

export function SetupProgress({ currentStep, totalSteps }: SetupProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress percentage
    const percentage = Math.round((currentStep / totalSteps) * 100)

    // Animate progress bar
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [currentStep, totalSteps])

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Setup Progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
