"use client"

import React from "react"

export interface AccessibilityProps {
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
  "aria-expanded"?: boolean
  "aria-pressed"?: boolean
  "aria-selected"?: boolean
  "aria-checked"?: boolean
  "aria-disabled"?: boolean
  "aria-hidden"?: boolean
  "aria-live"?: "polite" | "assertive" | "off"
  "aria-atomic"?: boolean
  role?: string
  tabIndex?: number
}

export const a11y = {
  // Generate accessible button props
  button: (
    options: {
      label?: string
      pressed?: boolean
      disabled?: boolean
      describedBy?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-label": options.label,
    "aria-pressed": options.pressed,
    "aria-disabled": options.disabled,
    "aria-describedby": options.describedBy,
    role: "button",
    tabIndex: options.disabled ? -1 : 0,
  }),

  // Generate accessible checkbox props
  checkbox: (
    options: {
      label?: string
      checked?: boolean
      disabled?: boolean
      describedBy?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-label": options.label,
    "aria-checked": options.checked,
    "aria-disabled": options.disabled,
    "aria-describedby": options.describedBy,
    role: "checkbox",
    tabIndex: options.disabled ? -1 : 0,
  }),

  // Generate accessible form field props
  formField: (
    options: {
      label?: string
      required?: boolean
      invalid?: boolean
      describedBy?: string
      errorId?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-label": options.label,
    "aria-required": options.required,
    "aria-invalid": options.invalid,
    "aria-describedby":
      options.invalid && options.errorId
        ? `${options.describedBy || ""} ${options.errorId}`.trim()
        : options.describedBy,
  }),

  // Generate accessible dialog props
  dialog: (
    options: {
      label?: string
      labelledBy?: string
      describedBy?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-label": options.label,
    "aria-labelledby": options.labelledBy,
    "aria-describedby": options.describedBy,
    role: "dialog",
    "aria-modal": true,
  }),

  // Generate accessible list props
  list: (
    options: {
      label?: string
      labelledBy?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-label": options.label,
    "aria-labelledby": options.labelledBy,
    role: "list",
  }),

  // Generate accessible listitem props
  listItem: (): AccessibilityProps => ({
    role: "listitem",
  }),

  // Generate accessible tab props
  tab: (
    options: {
      selected?: boolean
      controls?: string
      label?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-selected": options.selected,
    "aria-controls": options.controls,
    "aria-label": options.label,
    role: "tab",
    tabIndex: options.selected ? 0 : -1,
  }),

  // Generate accessible tabpanel props
  tabPanel: (
    options: {
      labelledBy?: string
      hidden?: boolean
    } = {},
  ): AccessibilityProps => ({
    "aria-labelledby": options.labelledBy,
    "aria-hidden": options.hidden,
    role: "tabpanel",
    tabIndex: 0,
  }),

  // Generate accessible progress props
  progress: (
    options: {
      value?: number
      max?: number
      label?: string
      describedBy?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-valuenow": options.value,
    "aria-valuemax": options.max || 100,
    "aria-valuemin": 0,
    "aria-label": options.label,
    "aria-describedby": options.describedBy,
    role: "progressbar",
  }),

  // Generate accessible status/alert props
  status: (
    options: {
      live?: "polite" | "assertive"
      atomic?: boolean
      label?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-live": options.live || "polite",
    "aria-atomic": options.atomic,
    "aria-label": options.label,
    role: "status",
  }),

  // Generate accessible navigation props
  navigation: (
    options: {
      label?: string
      labelledBy?: string
    } = {},
  ): AccessibilityProps => ({
    "aria-label": options.label,
    "aria-labelledby": options.labelledBy,
    role: "navigation",
  }),

  // Keyboard event handlers
  keyboard: {
    // Handle Enter and Space key presses for buttons
    onActivate: (callback: () => void) => (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        callback()
      }
    },

    // Handle arrow key navigation
    onArrowNavigation:
      (options: {
        onUp?: () => void
        onDown?: () => void
        onLeft?: () => void
        onRight?: () => void
      }) =>
      (event: React.KeyboardEvent) => {
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault()
            options.onUp?.()
            break
          case "ArrowDown":
            event.preventDefault()
            options.onDown?.()
            break
          case "ArrowLeft":
            event.preventDefault()
            options.onLeft?.()
            break
          case "ArrowRight":
            event.preventDefault()
            options.onRight?.()
            break
        }
      },

    // Handle Escape key
    onEscape: (callback: () => void) => (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        callback()
      }
    },
  },

  // Focus management utilities
  focus: {
    // Trap focus within an element
    trapFocus: (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }
      }

      element.addEventListener("keydown", handleTabKey)
      firstElement?.focus()

      return () => {
        element.removeEventListener("keydown", handleTabKey)
      }
    },

    // Restore focus to a previous element
    restoreFocus: (element: HTMLElement | null) => {
      if (element && typeof element.focus === "function") {
        element.focus()
      }
    },
  },
}

// Hook for managing focus
export function useFocusManagement() {
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  const saveFocus = React.useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = React.useCallback(() => {
    if (previousFocusRef.current) {
      a11y.focus.restoreFocus(previousFocusRef.current)
      previousFocusRef.current = null
    }
  }, [])

  return { saveFocus, restoreFocus }
}

// Hook for managing announcements to screen readers
export function useScreenReaderAnnouncements() {
  const [announcement, setAnnouncement] = React.useState("")

  const announce = React.useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    setAnnouncement("")
    // Small delay to ensure screen reader picks up the change
    setTimeout(() => setAnnouncement(message), 100)
  }, [])

  const AnnouncementRegion = React.useCallback(
    () => (
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    ),
    [announcement],
  )

  return { announce, AnnouncementRegion }
}
