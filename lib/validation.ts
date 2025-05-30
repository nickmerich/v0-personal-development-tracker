"use client"

import React from "react"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

export class FormValidator {
  private rules: ValidationRules
  private errors: ValidationErrors = {}

  constructor(rules: ValidationRules) {
    this.rules = rules
  }

  validate(data: Record<string, any>): { isValid: boolean; errors: ValidationErrors } {
    this.errors = {}

    for (const [field, rule] of Object.entries(this.rules)) {
      const value = data[field]
      const error = this.validateField(field, value, rule)

      if (error) {
        this.errors[field] = error
      }
    }

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: { ...this.errors },
    }
  }

  validateField(field: string, value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
      return `${this.formatFieldName(field)} is required`
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === "string" && !value.trim())) {
      return null
    }

    // String validations
    if (typeof value === "string") {
      if (rule.minLength && value.length < rule.minLength) {
        return `${this.formatFieldName(field)} must be at least ${rule.minLength} characters`
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return `${this.formatFieldName(field)} must be no more than ${rule.maxLength} characters`
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return `${this.formatFieldName(field)} format is invalid`
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value)
      if (customError) {
        return customError
      }
    }

    return null
  }

  private formatFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  getErrors(): ValidationErrors {
    return { ...this.errors }
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0
  }

  getError(field: string): string | null {
    return this.errors[field] || null
  }
}

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && value.length > 254) {
        return "Email address is too long"
      }
      return null
    },
  },

  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      }
      return null
    },
  },

  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },

  taskText: {
    required: true,
    minLength: 1,
    maxLength: 200,
    custom: (value: string) => {
      if (value && value.trim().length === 0) {
        return "Task cannot be empty or contain only spaces"
      }
      return null
    },
  },
}

// Hook for using validation in React components
export function useFormValidation(rules: ValidationRules) {
  const [errors, setErrors] = React.useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const validator = React.useMemo(() => new FormValidator(rules), [rules])

  const validate = React.useCallback(
    (data: Record<string, any>) => {
      const result = validator.validate(data)
      setErrors(result.errors)
      return result.isValid
    },
    [validator],
  )

  const validateField = React.useCallback(
    (field: string, value: any) => {
      const rule = rules[field]
      if (!rule) return null

      const error = validator.validateField(field, value, rule)
      setErrors((prev) => ({
        ...prev,
        [field]: error || "",
      }))

      return error
    },
    [validator, rules],
  )

  const clearErrors = React.useCallback(() => {
    setErrors({})
  }, [])

  const clearFieldError = React.useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  return {
    errors,
    isSubmitting,
    setIsSubmitting,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0,
    getError: (field: string) => errors[field] || null,
  }
}
