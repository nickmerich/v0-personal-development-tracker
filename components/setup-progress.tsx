import { Progress } from "@/components/ui/progress"

interface SetupProgressProps {
  currentStep: number
  totalSteps: number
}

export function SetupProgress({ currentStep, totalSteps }: SetupProgressProps) {
  // Validate inputs
  const validCurrentStep = Math.max(1, Math.min(currentStep, totalSteps))
  const validTotalSteps = Math.max(1, totalSteps)
  const progressPercentage = Math.round((validCurrentStep / validTotalSteps) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-forest-800">
          Preparation Step {validCurrentStep} of {validTotalSteps}
        </span>
        <span className="text-forest-600">{progressPercentage}% Ready</span>
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
