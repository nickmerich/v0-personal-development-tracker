interface SetupProgressProps {
  currentStep: number
  totalSteps: number
}

export function SetupProgress({ currentStep, totalSteps }: SetupProgressProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs text-stone-600">
        <span>Base Camp</span>
        <span>{percentage}% Ready</span>
        <span>Summit Ready</span>
      </div>
      <div className="h-2 w-full rounded-full bg-stone-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-forest-500 to-forest-600 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
