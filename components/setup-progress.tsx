import { Progress } from "@/components/ui/progress"

interface SetupProgressProps {
  currentStep: number
  totalSteps: number
}

export function SetupProgress({ currentStep, totalSteps }: SetupProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-forest-800">
          Preparation Step {currentStep} of {totalSteps}
        </span>
        <span className="text-forest-600">{Math.round(progressPercentage)}% Ready</span>
      </div>
      <Progress
        value={progressPercentage}
        className="h-2 bg-stone-200"
        indicatorClassName="bg-gradient-to-r from-forest-500 to-forest-600"
      />
      <div className="flex justify-between text-xs text-stone-500">
        <span>Base Camp</span>
        <span>Summit Ready</span>
      </div>
    </div>
  )
}
