// Mobile-optimized copy and messaging
export const MOBILE_COPY = {
  // Concise, action-oriented headlines
  dashboard: {
    welcome: "Your Mountain Journey",
    quickActions: "Quick Actions",
    todaysGoals: "Today's Climb",
    progress: "Your Progress",
    inspiration: "Today's Inspiration",
    achievements: "Recent Wins",
  },

  // Clear, encouraging task language
  tasks: {
    addTask: "Add New Task",
    addTaskPlaceholder: "What would you like to accomplish?",
    completeTask: "Mark Complete",
    viewAll: "View All Tasks",
    noTasks: "No tasks yet. Ready to start climbing?",
    taskCompleted: "Great job! 🎉",
    streakMessage: "You're on fire! Keep it up!",
  },

  // Motivational progress messages
  progress: {
    excellent: "Outstanding progress! 🚀",
    good: "You're doing great! 💪",
    needsWork: "Every step counts! 🌱",
    justStarted: "Welcome to your journey! ✨",
  },

  // Mobile-friendly error messages
  errors: {
    loadingFailed: "Oops! Let's try that again.",
    saveFailed: "Couldn't save. Check your connection.",
    taskFailed: "Task update failed. Please retry.",
    generic: "Something went wrong. We're on it!",
  },

  // Encouraging empty states
  emptyStates: {
    noTasks: "Ready to start your first task?",
    noGoals: "What mountain will you climb?",
    noProgress: "Your journey begins with one step",
    noTemplates: "Discover habits that transform lives",
  },

  // Action-oriented buttons
  buttons: {
    getStarted: "Start Your Journey",
    addTask: "Add Task",
    complete: "Complete",
    save: "Save Progress",
    continue: "Continue",
    skip: "Skip for Now",
    retry: "Try Again",
    viewMore: "See More",
    customize: "Make It Yours",
  },
} as const

// Function to get contextual copy based on progress
export function getProgressMessage(percentage: number): string {
  if (percentage >= 80) return MOBILE_COPY.progress.excellent
  if (percentage >= 60) return MOBILE_COPY.progress.good
  if (percentage >= 20) return MOBILE_COPY.progress.needsWork
  return MOBILE_COPY.progress.justStarted
}

// Function to get encouraging task completion messages
export function getCompletionMessage(completedCount: number): string {
  if (completedCount === 1) return "First task complete! 🌟"
  if (completedCount === 5) return "Five tasks down! You're building momentum! 🔥"
  if (completedCount === 10) return "Ten tasks complete! You're unstoppable! 🚀"
  if (completedCount % 5 === 0) return `${completedCount} tasks complete! Amazing progress! 🎉`
  return "Task complete! Keep climbing! 💪"
}
