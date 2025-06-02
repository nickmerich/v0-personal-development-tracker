"use client"

import { Progress } from "@/components/ui/progress"

interface SetupProgressProps {
  currentStep: number
  totalSteps: number
}

export function SetupProgress({ currentStep, totalSteps }: SetupProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-stone-600">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
        <span>{Math.round(progress)}% complete</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
