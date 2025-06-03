// Journey-focused copy for The Gryt platform
export const JOURNEY_COPY = {
  // Main dashboard sections
  dashboard: {
    dailyCheckin: {
      title: "🎯 DAILY CHECK-IN",
      subtitle: "Start here. Complete today's essential actions.",
      description:
        "Track your progress across Spiritual, Physical, Mental, Nutritional, Professional, and Family areas. Build consistency. Create momentum.",
    },
    planYourPath: {
      title: "🗺️ PLAN YOUR PATH",
      subtitle: "Design your 90-day transformation journey.",
      description:
        "Three phases. Clear direction. Structure your growth with specific milestones, commitments, and daily actions. This is your roadmap.",
    },
    milestoneMarkers: {
      title: "🚩 MILESTONE MARKERS",
      subtitle: "Track key achievements along your journey.",
      description:
        "Whether it's revenue goals, health targets, or personal growth metrics—mark what matters and measure your progress.",
    },
    dailyFuel: {
      title: "💪 DAILY FUEL",
      subtitle: "Stay motivated with your personal affirmations.",
      description:
        "Review the beliefs that power your transformation. Speak them daily. Live them consistently. This is your inner strength.",
    },
    progressMap: {
      title: "📊 YOUR PROGRESS MAP",
      subtitle: "See where you are. Adjust as needed. Keep moving forward.",
      description:
        "Visualize your completion percentage across all life areas. Focus on consistency over perfection. Progress wins.",
    },
    streakCounter: {
      title: "🔥 CONSISTENCY STREAK",
      subtitle: "Keep building momentum. Don't break the chain.",
      description:
        "Your daily consistency matters. Show up every day and maintain your streak. Growth happens one day at a time.",
    },
    focusMode: {
      title: "🎯 FOCUS MODE ON",
      subtitle: "You're here to grow. You're here to transform.",
      description:
        "Choose your goal. Build the habit. Stack the days. Your transformation is earned through daily action.",
    },
  },

  // Categories with journey metaphors
  categories: {
    Spiritual: {
      icon: "🙏",
      altNames: ["Faith", "Mindfulness", "Inner Growth"],
      description: "Your spiritual foundation - the core of your journey",
    },
    Physical: {
      icon: "💪",
      altNames: ["Fitness", "Health", "Physical Wellness"],
      description: "Physical vitality for sustained energy and strength",
    },
    Mental: {
      icon: "🧠",
      altNames: ["Mindset", "Psychology", "Mental Clarity"],
      description: "Mental resilience to overcome challenges and grow",
    },
    Nutritional: {
      icon: "🥗",
      altNames: ["Nutrition", "Fuel", "Healthy Eating"],
      description: "Proper nutrition for optimal energy and wellbeing",
    },
    Professional: {
      icon: "💼",
      altNames: ["Career", "Work", "Professional Growth"],
      description: "Career development and professional excellence",
    },
    Family: {
      icon: "👨‍👩‍👧‍👦",
      altNames: ["Relationships", "Loved Ones", "Connections"],
      description: "Meaningful relationships and strong connections",
    },
  },

  // Progress and motivation messages
  progress: {
    excellent: "🚀 Outstanding progress! You're on fire!",
    good: "⭐ Great momentum! You're building strong habits!",
    needsWork: "💪 Keep going. Every step forward counts.",
    justStarted: "🌱 Journey begun. Time to build momentum!",
  },

  // Task completion messages
  tasks: {
    completed: "✅ Action completed! You're building momentum!",
    streak: "🔥 On fire! Your consistency is paying off!",
    addTask: "Add Action Step",
    noTasks: "Ready to take your first step forward?",
    completeTask: "Mark Complete",
    viewAll: "View All Actions",
  },

  // Milestone language
  milestones: {
    create: "Set Your Milestone",
    achieved: "🎉 Milestone Achieved! Great progress!",
    inProgress: "Working toward your milestone...",
    noMilestones: "Ready to set your first milestone?",
  },

  // Affirmations/Fuel
  affirmations: {
    title: "Daily Affirmations",
    subtitle: "Your inner strength and motivation",
    noAffirmations: "Add your first daily affirmation",
    edit: "Update Your Affirmations",
  },

  // Buttons and actions
  buttons: {
    startJourney: "Start Your Journey",
    continueJourney: "Continue Journey",
    setMilestone: "Set Milestone",
    addStep: "Add Step",
    buildMomentum: "Build Momentum",
    dailyCheckin: "Daily Check-in",
    viewProgress: "View Progress",
    focusMode: "Enter Focus Mode",
  },

  // Error messages with journey theme
  errors: {
    loadingFailed: "Path unclear. Let's try again.",
    saveFailed: "Couldn't save your progress. Check your connection.",
    taskFailed: "Action update failed. Please retry.",
    generic: "Unexpected detour. We're getting back on track!",
  },
} as const

// Helper functions for dynamic copy
export function getProgressMessage(percentage: number): string {
  if (percentage >= 80) return JOURNEY_COPY.progress.excellent
  if (percentage >= 60) return JOURNEY_COPY.progress.good
  if (percentage >= 20) return JOURNEY_COPY.progress.needsWork
  return JOURNEY_COPY.progress.justStarted
}

export function getMotivationMessage(completedCount: number): string {
  if (completedCount === 1) return "🌱 First step taken! Your journey begins!"
  if (completedCount === 5) return "⭐ Five actions completed! You're building momentum!"
  if (completedCount === 10) return "🚀 Ten actions done! Unstoppable progress!"
  if (completedCount % 5 === 0) return `🎯 ${completedCount} actions completed! Keep going!`
  return "💪 Another step forward! You're building something great!"
}

export function getDaysSinceStart(startDate: string): string {
  const days = calculateDayNumber(startDate)
  if (days === 1) return "Day 1 - Your journey begins"
  if (days <= 30) return `Day ${days} - Building strong foundations`
  if (days <= 60) return `Day ${days} - Creating lasting change`
  if (days <= 90) return `Day ${days} - Transformation in progress`
  return `Day ${days} - Beyond goals, new horizons ahead`
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
