"use client"

import type React from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { ErrorBoundary } from "@/components/error-boundary"
import { jest } from "@jest/globals"

// Mock providers for testing
const MockProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>
}

// Custom render function that includes providers
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: MockProviders, ...options })

// Test utilities
export const testUtils = {
  // Create mock user data
  createMockUserData: (overrides = {}) => ({
    name: "Test User",
    email: "test@example.com",
    startDate: "2024-01-01",
    myWhy: "Test motivation",
    bigGoal: "Test goal",
    categories: ["Health", "Career"],
    tasks: {
      Health: [
        {
          id: "1",
          text: "Exercise",
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
      Career: [],
    },
    milestones: [],
    journalEntries: {},
    affirmations: ["I am capable"],
    gamification: {
      level: 1,
      xp: 0,
      totalXp: 0,
      streak: 0,
      achievements: [],
      badges: [],
    },
    setupCompleted: true,
    ...overrides,
  }),

  // Create mock task
  createMockTask: (overrides = {}) => ({
    id: Date.now().toString(),
    text: "Test task",
    completed: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  // Simulate user interactions
  simulateTaskCompletion: async (taskElement: HTMLElement) => {
    const checkbox = taskElement.querySelector('input[type="checkbox"]')
    if (checkbox) {
      checkbox.click()
      // Wait for any animations or async operations
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  },

  // Mock localStorage
  mockLocalStorage: () => {
    const store: Record<string, string> = {}

    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key]
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key])
      }),
    }
  },

  // Wait for async operations
  waitFor: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),

  // Generate test IDs
  generateTestId: (component: string, element?: string) => (element ? `${component}-${element}` : component),
}

// Export everything from testing library
export * from "@testing-library/react"
export { customRender as render }

// Jest setup helpers
export const setupTests = () => {
  // Mock window.matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

  // Mock navigator.vibrate
  Object.defineProperty(navigator, "vibrate", {
    writable: true,
    value: jest.fn(),
  })
}
