"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type UserData, validateUserData } from "./storage"

interface AppState {
  userData: UserData | null
  isLoading: boolean
  error: string | null

  // Actions
  setUserData: (data: UserData) => void
  updateUserData: (updates: Partial<UserData>) => void
  clearUserData: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Task management
  addTask: (category: string, task: any) => void
  updateTask: (category: string, taskId: string, updates: any) => void
  removeTask: (category: string, taskId: string) => void
  toggleTask: (category: string, taskId: string) => void

  // Milestone management
  addMilestone: (milestone: any) => void
  updateMilestone: (milestoneId: string, updates: any) => void

  // Journal management
  updateJournalEntry: (date: string, entry: any) => void

  // Affirmations
  updateAffirmations: (affirmations: string[]) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userData: null,
      isLoading: true,
      error: null,

      setUserData: (data) => {
        const validatedData = validateUserData(data)
        set({ userData: validatedData, error: null })
      },

      updateUserData: (updates) => {
        const currentData = get().userData
        if (!currentData) return

        const updatedData = { ...currentData, ...updates }
        const validatedData = validateUserData(updatedData)
        set({ userData: validatedData })
      },

      clearUserData: () => {
        set({ userData: null, error: null })
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      addTask: (category, task) => {
        const state = get()
        if (!state.userData) return

        const newTask = {
          id: task.id || Date.now().toString(),
          text: task.text?.trim() || "",
          completed: false,
          createdAt: new Date().toISOString(),
          ...task,
        }

        if (!newTask.text) {
          set({ error: "Task text cannot be empty" })
          return
        }

        const updatedTasks = {
          ...state.userData.tasks,
          [category]: [...(state.userData.tasks?.[category] || []), newTask],
        }

        set({
          userData: { ...state.userData, tasks: updatedTasks },
          error: null,
        })
      },

      updateTask: (category, taskId, updates) => {
        const state = get()
        if (!state.userData?.tasks?.[category]) return

        const updatedTasks = {
          ...state.userData.tasks,
          [category]: state.userData.tasks[category].map((task) =>
            task.id === taskId ? { ...task, ...updates } : task,
          ),
        }

        set({
          userData: { ...state.userData, tasks: updatedTasks },
        })
      },

      removeTask: (category, taskId) => {
        const state = get()
        if (!state.userData?.tasks?.[category]) return

        const updatedTasks = {
          ...state.userData.tasks,
          [category]: state.userData.tasks[category].filter((task) => task.id !== taskId),
        }

        set({
          userData: { ...state.userData, tasks: updatedTasks },
        })
      },

      toggleTask: (category, taskId) => {
        const state = get()
        if (!state.userData?.tasks?.[category]) return

        const task = state.userData.tasks[category].find((t) => t.id === taskId)
        if (!task) return

        const updates = {
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        }

        get().updateTask(category, taskId, updates)
      },

      addMilestone: (milestone) => {
        const state = get()
        if (!state.userData) return

        const newMilestone = {
          id: milestone.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...milestone,
        }

        const updatedMilestones = [...(state.userData.milestones || []), newMilestone]

        set({
          userData: { ...state.userData, milestones: updatedMilestones },
        })
      },

      updateMilestone: (milestoneId, updates) => {
        const state = get()
        if (!state.userData?.milestones) return

        const updatedMilestones = state.userData.milestones.map((milestone) =>
          milestone.id === milestoneId ? { ...milestone, ...updates } : milestone,
        )

        set({
          userData: { ...state.userData, milestones: updatedMilestones },
        })
      },

      updateJournalEntry: (date, entry) => {
        const state = get()
        if (!state.userData) return

        const updatedJournalEntries = {
          ...state.userData.journalEntries,
          [date]: entry,
        }

        set({
          userData: { ...state.userData, journalEntries: updatedJournalEntries },
        })
      },

      updateAffirmations: (affirmations) => {
        const state = get()
        if (!state.userData) return

        set({
          userData: { ...state.userData, affirmations },
        })
      },
    }),
    {
      name: "app-storage",
      partialize: (state) => ({ userData: state.userData }),
    },
  ),
)

// Initialize store from localStorage
export const initializeStore = () => {
  const store = useAppStore.getState()

  try {
    const storedData = localStorage.getItem("userData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      const validatedData = validateUserData(parsedData)
      store.setUserData(validatedData)
    }
  } catch (error) {
    console.error("Failed to initialize store from localStorage:", error)
    store.setError("Failed to load user data")
  } finally {
    store.setLoading(false)
  }
}
