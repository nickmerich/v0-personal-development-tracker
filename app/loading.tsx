import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 to-stone-50">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-forest-800">Building your experience...</h2>
          <p className="text-forest-600">Setting up your personal development foundation</p>
        </div>
      </div>
    </div>
  )
}
