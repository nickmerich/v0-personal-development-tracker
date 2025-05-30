"use client"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mountain } from "lucide-react"

interface WelcomeModalProps {
  open: boolean
  onClose: () => void
  startTour: () => void
  skipTour: () => void
}

export function WelcomeModal({ open, onClose, startTour, skipTour }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="text-2xl font-bold text-forest-800 flex items-center gap-2">
          <Mountain className="h-8 w-8 text-forest-600" />
          Welcome to The Gryt
        </DialogTitle>
        <DialogDescription className="text-stone-600 text-lg">
          Your 90-day ascent to the summit begins now.
        </DialogDescription>

        <div className="space-y-4">
          <p className="text-stone-700">
            🏔️ <strong>You're not here to coast. You're here to climb.</strong>
          </p>
          <p className="text-stone-600">
            Track your daily non-negotiables across 6 core categories. Plant flags for major milestones. Fuel your mind
            with powerful affirmations. Every step up the mountain is earned.
          </p>
          <div className="bg-forest-50 p-4 rounded-lg border border-forest-200">
            <h4 className="font-semibold text-forest-800 mb-2">🎯 Your Mission:</h4>
            <ul className="text-sm text-forest-700 space-y-1">
              <li>• Complete daily actions in all 6 categories</li>
              <li>• Plant flags for major milestones</li>
              <li>• Build momentum through consistency</li>
              <li>• Reach your summit in 90 days</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button onClick={startTour} className="bg-forest-600 text-white hover:bg-forest-700">
            🧗 Start the Climb
          </Button>
          <Button onClick={skipTour} variant="outline" className="border-forest-300 text-forest-600">
            Skip to Basecamp
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
