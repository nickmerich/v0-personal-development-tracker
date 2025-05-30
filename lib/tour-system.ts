export interface TourStep {
  id: string
  target: string // CSS selector for the element to highlight
  title: string
  content: string
  placement?: "top" | "bottom" | "left" | "right" | "center"
  action?: "click" | "hover" | "none"
  nextButton?: string
  prevButton?: string
  skipButton?: string
  showProgress?: boolean
  delay?: number
  spotlight?: boolean
}

export interface Tour {
  id: string
  name: string
  steps: TourStep[]
  autoStart?: boolean
  showProgress?: boolean
  allowSkip?: boolean
}

// Tour definitions for different sections
export const TOURS: Record<string, Tour> = {
  welcome: {
    id: "welcome",
    name: "Welcome Tour",
    autoStart: true,
    showProgress: true,
    allowSkip: true,
    steps: [
      {
        id: "welcome-start",
        target: "body",
        title: "Welcome to Your Personal Development Journey! 🎉",
        content: "Let's take a quick tour to help you get started with transforming your life in 90 days.",
        placement: "center",
        nextButton: "Let's Go!",
        skipButton: "Skip Tour",
        showProgress: true,
        spotlight: false,
      },
      {
        id: "setup-intro",
        target: '[data-tour="setup-progress"]',
        title: "Your Setup Progress",
        content: "This shows your onboarding progress. Complete all steps to unlock the full experience.",
        placement: "bottom",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "navigation-intro",
        target: '[data-tour="main-navigation"]',
        title: "Navigation Menu",
        content: "Use this menu to navigate between different sections of your journey.",
        placement: "right",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
    ],
  },

  dashboard: {
    id: "dashboard",
    name: "Dashboard Tour",
    showProgress: true,
    allowSkip: true,
    steps: [
      {
        id: "dashboard-overview",
        target: '[data-tour="dashboard-header"]',
        title: "Your Command Center 📊",
        content: "This is your dashboard - your daily mission control for personal growth.",
        placement: "bottom",
        nextButton: "Show me more",
        skipButton: "Skip",
        spotlight: true,
      },
      {
        id: "my-why-card",
        target: '[data-tour="my-why"]',
        title: "Your Why Statement 💭",
        content: 'Your "why" is your north star. Click to edit and keep it visible to stay motivated.',
        placement: "top",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "categories-overview",
        target: '[data-tour="categories"]',
        title: "Life Categories 🎯",
        content: "These are your focus areas. Click on any category to see and manage your tasks.",
        placement: "top",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "progress-tracking",
        target: '[data-tour="progress"]',
        title: "Progress Tracking 📈",
        content: "Watch your progress grow! This shows your daily completion rate and streaks.",
        placement: "left",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "milestones",
        target: '[data-tour="milestones"]',
        title: "Milestone Tracker 🏆",
        content: "Celebrate your wins! Major milestones are tracked here to keep you motivated.",
        placement: "top",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "affirmations",
        target: '[data-tour="affirmations"]',
        title: "Personal Affirmations ✨",
        content: "Daily positive affirmations to reinforce your mindset. Click to edit and personalize them.",
        placement: "top",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "journal-button",
        target: '[data-tour="journal"]',
        title: "Daily Journal 📝",
        content: "Reflect on your progress with daily journaling. Click here to open your journal.",
        placement: "left",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "templates",
        target: '[data-tour="templates"]',
        title: "Habit Templates 📋",
        content: "Quick-start your journey with proven habit templates from experts and successful users.",
        placement: "top",
        nextButton: "Finish Tour",
        prevButton: "Back",
        spotlight: true,
      },
    ],
  },

  tasks: {
    id: "tasks",
    name: "Task Management Tour",
    showProgress: true,
    allowSkip: true,
    steps: [
      {
        id: "task-list",
        target: '[data-tour="task-list"]',
        title: "Your Daily Tasks ✅",
        content: "Here are your tasks for this category. Check them off as you complete them!",
        placement: "top",
        nextButton: "Next",
        skipButton: "Skip",
        spotlight: true,
      },
      {
        id: "add-task",
        target: '[data-tour="add-task"]',
        title: "Add New Tasks ➕",
        content: "Click here to add new tasks to this category. Keep them specific and actionable.",
        placement: "bottom",
        nextButton: "Next",
        prevButton: "Back",
        spotlight: true,
      },
      {
        id: "task-progress",
        target: '[data-tour="task-progress"]',
        title: "Track Your Progress 📊",
        content: "See your completion rate and maintain your streak. Consistency is key!",
        placement: "left",
        nextButton: "Got it!",
        prevButton: "Back",
        spotlight: true,
      },
    ],
  },
}

export class TourManager {
  private currentTour: Tour | null = null
  private currentStepIndex = 0
  private onStepChange?: (step: TourStep, index: number) => void
  private onTourComplete?: (tourId: string) => void
  private onTourSkip?: (tourId: string) => void

  constructor() {
    this.loadTourState()
  }

  startTour(
    tourId: string,
    callbacks?: {
      onStepChange?: (step: TourStep, index: number) => void
      onTourComplete?: (tourId: string) => void
      onTourSkip?: (tourId: string) => void
    },
  ) {
    const tour = TOURS[tourId]
    if (!tour) {
      console.warn(`Tour "${tourId}" not found`)
      return false
    }

    this.currentTour = tour
    this.currentStepIndex = 0
    this.onStepChange = callbacks?.onStepChange
    this.onTourComplete = callbacks?.onTourComplete
    this.onTourSkip = callbacks?.onTourSkip

    this.saveTourState()
    this.showCurrentStep()
    return true
  }

  nextStep() {
    if (!this.currentTour) return false

    if (this.currentStepIndex < this.currentTour.steps.length - 1) {
      this.currentStepIndex++
      this.saveTourState()
      this.showCurrentStep()
      return true
    } else {
      this.completeTour()
      return false
    }
  }

  prevStep() {
    if (!this.currentTour) return false

    if (this.currentStepIndex > 0) {
      this.currentStepIndex--
      this.saveTourState()
      this.showCurrentStep()
      return true
    }
    return false
  }

  skipTour() {
    if (!this.currentTour) return

    const tourId = this.currentTour.id
    this.markTourAsCompleted(tourId)
    this.currentTour = null
    this.currentStepIndex = 0
    this.clearTourState()

    if (this.onTourSkip) {
      this.onTourSkip(tourId)
    }
  }

  completeTour() {
    if (!this.currentTour) return

    const tourId = this.currentTour.id
    this.markTourAsCompleted(tourId)
    this.currentTour = null
    this.currentStepIndex = 0
    this.clearTourState()

    if (this.onTourComplete) {
      this.onTourComplete(tourId)
    }
  }

  getCurrentStep(): TourStep | null {
    if (!this.currentTour) return null
    return this.currentTour.steps[this.currentStepIndex] || null
  }

  getCurrentTour(): Tour | null {
    return this.currentTour
  }

  getProgress(): { current: number; total: number; percentage: number } {
    if (!this.currentTour) {
      return { current: 0, total: 0, percentage: 0 }
    }

    const current = this.currentStepIndex + 1
    const total = this.currentTour.steps.length
    const percentage = Math.round((current / total) * 100)

    return { current, total, percentage }
  }

  isTourCompleted(tourId: string): boolean {
    const completedTours = this.getCompletedTours()
    return completedTours.includes(tourId)
  }

  shouldAutoStartTour(tourId: string): boolean {
    const tour = TOURS[tourId]
    return tour?.autoStart === true && !this.isTourCompleted(tourId)
  }

  private showCurrentStep() {
    const step = this.getCurrentStep()
    if (step && this.onStepChange) {
      this.onStepChange(step, this.currentStepIndex)
    }
  }

  private markTourAsCompleted(tourId: string) {
    const completedTours = this.getCompletedTours()
    if (!completedTours.includes(tourId)) {
      completedTours.push(tourId)
      localStorage.setItem("completedTours", JSON.stringify(completedTours))
    }
  }

  private getCompletedTours(): string[] {
    try {
      const stored = localStorage.getItem("completedTours")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private saveTourState() {
    if (this.currentTour) {
      localStorage.setItem(
        "currentTour",
        JSON.stringify({
          tourId: this.currentTour.id,
          stepIndex: this.currentStepIndex,
        }),
      )
    }
  }

  private loadTourState() {
    try {
      const stored = localStorage.getItem("currentTour")
      if (stored) {
        const { tourId, stepIndex } = JSON.parse(stored)
        const tour = TOURS[tourId]
        if (tour) {
          this.currentTour = tour
          this.currentStepIndex = stepIndex
        }
      }
    } catch {
      // Ignore errors
    }
  }

  private clearTourState() {
    localStorage.removeItem("currentTour")
  }
}

// Global tour manager instance
export const tourManager = new TourManager()
