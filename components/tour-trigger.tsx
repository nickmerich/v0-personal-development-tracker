"use client"
import { Button } from "@/components/ui/button"
import { HelpCircle, Play } from "lucide-react"
import { useTour } from "./tour-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface TourTriggerProps {
  variant?: "button" | "icon" | "dropdown"
  tourId?: string
  className?: string
}

export function TourTrigger({ variant = "icon", tourId, className }: TourTriggerProps) {
  const { startTour } = useTour()

  const handleStartTour = (id: string) => {
    startTour(id)
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help & Tours</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => handleStartTour("welcome")}>
            <Play className="h-4 w-4 mr-2" />
            Welcome Tour
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStartTour("dashboard")}>
            <Play className="h-4 w-4 mr-2" />
            Dashboard Tour
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStartTour("tasks")}>
            <Play className="h-4 w-4 mr-2" />
            Task Management Tour
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.open("/help", "_blank")} className="text-forest-600">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help Center
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === "button") {
    return (
      <Button variant="outline" onClick={() => handleStartTour(tourId || "welcome")} className={className}>
        <Play className="h-4 w-4 mr-2" />
        Start Tour
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => handleStartTour(tourId || "welcome")}
      className={className}
      title="Take a guided tour"
    >
      <HelpCircle className="h-5 w-5" />
      <span className="sr-only">Start guided tour</span>
    </Button>
  )
}
