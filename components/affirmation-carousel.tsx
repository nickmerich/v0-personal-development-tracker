"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Mountain } from "lucide-react"

interface AffirmationCarouselProps {
  affirmations: string[]
}

export function AffirmationCarousel({ affirmations }: AffirmationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (affirmations.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === affirmations.length - 1 ? 0 : prevIndex + 1))
    }, 12000) // Slower rotation for contemplation

    return () => clearInterval(interval)
  }, [affirmations.length])

  if (!affirmations.length) {
    return (
      <div className="p-6 text-center">
        <p className="text-stone-600">No mountain mantras available</p>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? affirmations.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === affirmations.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <div className="flex min-h-[120px] items-center justify-center p-6 text-center bg-gradient-to-r from-forest-50 to-stone-50 border border-forest-100">
          <div className="space-y-2">
            <Mountain className="h-6 w-6 text-forest-600 mx-auto opacity-60" />
            <p className="text-lg font-medium italic text-forest-800 leading-relaxed">"{affirmations[currentIndex]}"</p>
          </div>
        </div>
      </div>

      {affirmations.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 text-forest-600 hover:bg-white/90 shadow-sm"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous mantra</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 text-forest-600 hover:bg-white/90 shadow-sm"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next mantra</span>
          </Button>
        </div>
      )}

      {affirmations.length > 1 && (
        <div className="mt-3 flex justify-center space-x-1">
          {affirmations.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === currentIndex ? "bg-forest-600" : "bg-stone-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
