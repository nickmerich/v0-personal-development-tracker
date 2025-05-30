// Mountain climbing themed copy for The Gryt platform
export const MOUNTAIN_COPY = {
  // Main dashboard sections
  dashboard: {
    basecampCheckin: {
      title: "🏕 BASECAMP CHECK-IN",
      subtitle: "Start here. Complete today's non-negotiables.",
      description:
        "Track your actions across Spiritual, Physical, Mental, Nutritional, Professional, and Family categories. Build momentum. Earn your elevation.",
    },
    mapYourClimb: {
      title: "📍 MAP YOUR CLIMB",
      subtitle: "Lock in your 90-day ascent plan.",
      description:
        "Three phases. One summit. Structure your mission with clear milestones, commitments, and non-negotiables. This is your contract.",
    },
    flagsOnRidge: {
      title: "🚩 FLAGS ON THE RIDGE",
      subtitle: "Track key milestones across your journey.",
      description:
        "Whether it's revenue, sobriety streaks, weight loss, or marathon distance—mark what matters and measure progress as you climb.",
    },
    fuelForClimb: {
      title: "🔥 FUEL FOR THE CLIMB",
      subtitle: "Stay mentally locked in with your affirmations.",
      description:
        "Scroll through the beliefs that power your ascent. Speak them daily. Print them if you have to. This is your internal oxygen tank.",
    },
    trailMap: {
      title: "🧭 YOUR TRAIL MAP",
      subtitle: "See where you are. Adjust if needed. Keep moving.",
      description:
        "Visualize your completion percentage across all categories. Stay focused on consistency, not perfection. Momentum wins.",
    },
    daysAboveFog: {
      title: "🌤 DAYS ABOVE THE FOG",
      subtitle: "Keep stacking clean days. Don't look down.",
      description:
        "Your streak matters. Show up every day and don't break the chain. Elevation is earned one clean day at a time.",
    },
    summitMode: {
      title: "🎯 SUMMIT MODE ON",
      subtitle: "You're not here to coast. You're here to climb.",
      description: "Pick your goal. Build belief. Stack the days. Nobody drags you to the top—you earn every inch.",
    },
  },

  // Categories with mountain metaphors
  categories: {
    Spiritual: {
      icon: "🙏",
      altNames: ["Faith", "Mindfulness", "Inner Compass"],
      description: "Your spiritual foundation - the bedrock of your climb",
    },
    Physical: {
      icon: "💪",
      altNames: ["Fitness", "Health", "Body Strength"],
      description: "Physical conditioning for the ascent ahead",
    },
    Mental: {
      icon: "🧠",
      altNames: ["Mindset", "Psychology", "Mental Toughness"],
      description: "Mental fortitude to push through the hard climbs",
    },
    Nutritional: {
      icon: "🥗",
      altNames: ["Nutrition", "Fuel", "Energy"],
      description: "Proper fuel for sustained energy on the mountain",
    },
    Professional: {
      icon: "💼",
      altNames: ["Career", "Work", "Business"],
      description: "Professional growth and career advancement",
    },
    Family: {
      icon: "👨‍👩‍👧‍👦",
      altNames: ["Relationships", "Loved Ones", "Support System"],
      description: "Your support team and climbing partners",
    },
  },

  // Progress and motivation messages
  progress: {
    excellent: "🚀 Summit in sight! Outstanding progress!",
    good: "⛰️ Solid climbing! You're gaining elevation!",
    needsWork: "🥾 Keep stepping. Every step counts on the mountain.",
    justStarted: "🏔️ Base camp established. Time to start climbing!",
  },

  // Task completion messages
  tasks: {
    completed: "✅ Step completed! You're gaining elevation!",
    streak: "🔥 On fire! Your climbing rhythm is strong!",
    addTask: "Add Climb Step",
    noTasks: "Ready to take your first step up the mountain?",
    completeTask: "Mark Complete",
    viewAll: "View All Steps",
  },

  // Milestone language
  milestones: {
    create: "Plant Your Flag",
    achieved: "🚩 Flag Planted! Milestone Reached!",
    inProgress: "Climbing toward your flag...",
    noMilestones: "Ready to plant your first flag on the mountain?",
  },

  // Affirmations/Fuel
  affirmations: {
    title: "Mountain Mantras",
    subtitle: "Your internal oxygen tank",
    noAffirmations: "Add your first climbing mantra",
    edit: "Update Your Mantras",
  },

  // Buttons and actions
  buttons: {
    startClimb: "Start Your Climb",
    continueClimb: "Continue Climbing",
    plantFlag: "Plant Flag",
    addStep: "Add Step",
    earnElevation: "Earn Elevation",
    checkBasecamp: "Check Basecamp",
    viewTrail: "View Trail Map",
    summitMode: "Enter Summit Mode",
  },

  // Error messages with mountain theme
  errors: {
    loadingFailed: "Trail conditions unclear. Let's try again.",
    saveFailed: "Couldn't log your progress. Check your connection to base camp.",
    taskFailed: "Step update failed. Retry your climb.",
    generic: "Unexpected weather on the mountain. We're clearing the path!",
  },
} as const

// Helper functions for dynamic copy
export function getElevationMessage(percentage: number): string {
  if (percentage >= 80) return MOUNTAIN_COPY.progress.excellent
  if (percentage >= 60) return MOUNTAIN_COPY.progress.good
  if (percentage >= 20) return MOUNTAIN_COPY.progress.needsWork
  return MOUNTAIN_COPY.progress.justStarted
}

export function getClimbingMessage(completedCount: number): string {
  if (completedCount === 1) return "🏔️ First step taken! The climb begins!"
  if (completedCount === 5) return "⛰️ Five steps up! You're finding your rhythm!"
  if (completedCount === 10) return "🚀 Ten steps climbed! Unstoppable momentum!"
  if (completedCount % 5 === 0) return `🎯 ${completedCount} steps climbed! Summit getting closer!`
  return "💪 Another step up the mountain! Keep climbing!"
}

export function getDaysSinceStart(startDate: string): string {
  const days = calculateDayNumber(startDate)
  if (days === 1) return "Day 1 - Base camp established"
  if (days <= 30) return `Day ${days} - Building climbing strength`
  if (days <= 60) return `Day ${days} - Gaining serious elevation`
  if (days <= 90) return `Day ${days} - Summit approach begins`
  return `Day ${days} - Beyond the summit, new peaks ahead`
}

function calculateDayNumber(startDate: string): number {
  try {
    const start = new Date(startDate)
    const today = new Date()

    if (isNaN(start.getTime())) return 1

    start.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    const diffTime = today.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(diffDays, 1)
  } catch (error) {
    return 1
  }
}
