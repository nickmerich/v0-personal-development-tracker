// Design System Constants for Consistent UI
export const DESIGN_SYSTEM = {
  // Spacing Scale (based on 4px grid)
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    "4xl": "2.5rem", // 40px
    "5xl": "3rem", // 48px
    "6xl": "4rem", // 64px
  },

  // Typography Scale
  typography: {
    // Font Sizes
    text: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    // Line Heights
    leading: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
    // Font Weights
    weight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  // Component Sizes
  components: {
    // Button Sizes
    button: {
      sm: {
        height: "2rem", // 32px
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem",
      },
      md: {
        height: "2.5rem", // 40px
        padding: "0.625rem 1rem",
        fontSize: "1rem",
      },
      lg: {
        height: "3rem", // 48px
        padding: "0.75rem 1.5rem",
        fontSize: "1.125rem",
      },
    },
    // Input Sizes
    input: {
      sm: {
        height: "2rem",
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem",
      },
      md: {
        height: "2.5rem",
        padding: "0.625rem 0.75rem",
        fontSize: "1rem",
      },
      lg: {
        height: "3rem",
        padding: "0.75rem 1rem",
        fontSize: "1.125rem",
      },
    },
    // Card Sizes
    card: {
      padding: {
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
      },
      radius: "0.75rem",
    },
    // Icon Sizes
    icon: {
      xs: "0.75rem", // 12px
      sm: "1rem", // 16px
      md: "1.25rem", // 20px
      lg: "1.5rem", // 24px
      xl: "2rem", // 32px
    },
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },

  // Animation Durations
  animation: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
  },
} as const

// Responsive utilities
export const responsive = {
  // Container max-widths
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Grid columns
  grid: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
    },
  },
} as const

// Touch target sizes (minimum 44px for accessibility)
export const touchTargets = {
  minimum: "2.75rem", // 44px
  comfortable: "3rem", // 48px
  large: "3.5rem", // 56px
} as const
