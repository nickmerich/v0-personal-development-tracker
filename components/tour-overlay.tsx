"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react"
import { tourManager, type TourStep, type Tour } from "@/lib/tour-system"

interface TourOverlayProps {
  isVisible: boolean
  onClose: () => void
}

export function TourOverlay({ isVisible, onClose }: TourOverlayProps) {
  const [currentStep, setCurrentStep] = useState<TourStep | null>(null)
  const [currentTour, setCurrentTour] = useState<Tour | null>(null)
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 })
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isVisible) return

    const updateTourState = () => {
      const step = tourManager.getCurrentStep()
      const tour = tourManager.getCurrentTour()
      const progressData = tourManager.getProgress()

      setCurrentStep(step)
      setCurrentTour(tour)
      setProgress(progressData)

      if (step) {
        updateTargetElement(step)
      }
    }

    // Set up tour callbacks
    tourManager.startTour(tourManager.getCurrentTour()?.id || "welcome", {
      onStepChange: updateTourState,
      onTourComplete: () => {
        onClose()
      },
      onTourSkip: () => {
        onClose()
      },
    })

    updateTourState()
  }, [isVisible, onClose])

  useEffect(() => {
    if (currentStep && targetElement) {
      updateOverlayPosition()
    }
  }, [currentStep, targetElement])

  const updateTargetElement = (step: TourStep) => {
    const element = document.querySelector(step.target) as HTMLElement
    setTargetElement(element)

    if (element) {
      // Scroll element into view
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })

      // Add highlight class
      element.classList.add("tour-highlight")

      // Remove highlight from previous elements
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        if (el !== element) {
          el.classList.remove("tour-highlight")
        }
      })
    }
  }

  const updateOverlayPosition = () => {
    if (!targetElement || !overlayRef.current || !currentStep) return

    const targetRect = targetElement.getBoundingClientRect()
    const overlayRect = overlayRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    let top = 0
    let left = 0

    switch (currentStep.placement) {
      case "top":
        top = targetRect.top - overlayRect.height - 16
        left = targetRect.left + (targetRect.width - overlayRect.width) / 2
        break
      case "bottom":
        top = targetRect.bottom + 16
        left = targetRect.left + (targetRect.width - overlayRect.width) / 2
        break
      case "left":
        top = targetRect.top + (targetRect.height - overlayRect.height) / 2
        left = targetRect.left - overlayRect.width - 16
        break
      case "right":
        top = targetRect.top + (targetRect.height - overlayRect.height) / 2
        left = targetRect.right + 16
        break
      case "center":
      default:
        top = (viewport.height - overlayRect.height) / 2
        left = (viewport.width - overlayRect.width) / 2
        break
    }

    // Keep overlay within viewport
    top = Math.max(16, Math.min(top, viewport.height - overlayRect.height - 16))
    left = Math.max(16, Math.min(left, viewport.width - overlayRect.width - 16))

    setOverlayPosition({ top, left })
  }

  const handleNext = () => {
    tourManager.nextStep()
  }

  const handlePrev = () => {
    tourManager.prevStep()
  }

  const handleSkip = () => {
    tourManager.skipTour()
  }

  const handleClose = () => {
    tourManager.skipTour()
  }

  if (!isVisible || !currentStep || !currentTour) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* Spotlight effect */}
      {currentStep.spotlight && targetElement && (
        <div
          className="fixed z-45 pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top - 8,
            left: targetElement.getBoundingClientRect().left - 8,
            width: targetElement.getBoundingClientRect().width + 16,
            height: targetElement.getBoundingClientRect().height + 16,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            borderRadius: "8px",
          }}
        />
      )}

      {/* Tour overlay */}
      <Card
        ref={overlayRef}
        className="fixed z-50 w-80 max-w-[90vw] shadow-2xl border-2 border-forest-200"
        style={{
          top: overlayPosition.top,
          left: overlayPosition.left,
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-forest-800">{currentStep.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
              className="text-forest-600 hover:text-forest-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {currentTour.showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-forest-600">
                <span>
                  Step {progress.current} of {progress.total}
                </span>
                <span>{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-forest-700 leading-relaxed">{currentStep.content}</p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {progress.current > 1 && (
                <Button variant="outline" size="sm" onClick={handlePrev} className="text-forest-600 border-forest-300">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {currentStep.prevButton || "Back"}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentTour.allowSkip && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-forest-500 hover:text-forest-700"
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  {currentStep.skipButton || "Skip Tour"}
                </Button>
              )}

              <Button size="sm" onClick={handleNext} className="bg-forest-600 hover:bg-forest-700 text-white">
                {currentStep.nextButton || "Next"}
                {progress.current < progress.total && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// CSS for tour highlighting
export const tourStyles = `
  .tour-highlight {
    position: relative;
    z-index: 46;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5);
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .tour-highlight::before {
    content: '';
    position: absolute;
    inset: -4px;
    border: 2px solid rgb(34, 197, 94);
    border-radius: 8px;
    animation: tour-pulse 2s infinite;
  }
  
  @keyframes tour-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`
