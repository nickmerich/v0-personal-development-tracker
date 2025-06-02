"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Check, AlertCircle, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  error?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  autoComplete?: string
  className?: string
}

export function MobileInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
  disabled,
  maxLength,
  autoComplete,
  className,
}: MobileInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const inputType = type === "password" && showPassword ? "text" : type

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={label} className="text-sm font-medium text-forest-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {maxLength && (
          <span className="text-xs text-stone-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          id={label}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "h-12 text-base border-forest-300 focus:border-forest-500 focus:ring-forest-500 transition-all duration-200",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            isFocused && "shadow-md",
            type === "password" && "pr-12",
          )}
          style={{ fontSize: "16px" }} // Prevents zoom on iOS
        />

        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-stone-500 hover:text-forest-600 touch-manipulation"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}

        {value && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface MobileTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  rows?: number
  className?: string
}

export function MobileTextarea({
  label,
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  maxLength,
  rows = 4,
  className,
}: MobileTextareaProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={label} className="text-sm font-medium text-forest-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {maxLength && (
          <span className="text-xs text-stone-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <Textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "text-base border-forest-300 focus:border-forest-500 focus:ring-forest-500 transition-all duration-200 resize-none",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          isFocused && "shadow-md",
        )}
        style={{ fontSize: "16px" }} // Prevents zoom on iOS
      />

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface MobileFormProps {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit: () => void
  submitLabel?: string
  isSubmitting?: boolean
  submitDisabled?: boolean
  onCancel?: () => void
  cancelLabel?: string
  className?: string
}

export function MobileForm({
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  isSubmitting = false,
  submitDisabled = false,
  onCancel,
  cancelLabel = "Cancel",
  className,
}: MobileFormProps) {
  return (
    <Card className={cn("border-forest-200 bg-white/80 backdrop-blur-sm", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-forest-800 text-lg">{title}</CardTitle>
            {description && <CardDescription className="text-stone-600 mt-1">{description}</CardDescription>}
          </div>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8 text-stone-500 hover:text-forest-600 hover:bg-forest-50 touch-manipulation"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {children}

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 h-12 border-forest-300 text-forest-600 hover:bg-forest-50 touch-manipulation"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            onClick={onSubmit}
            disabled={submitDisabled || isSubmitting}
            className={cn(
              "h-12 bg-forest-600 text-white hover:bg-forest-700 touch-manipulation",
              onCancel ? "flex-1" : "w-full",
            )}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Mobile-optimized tag input
interface MobileTagInputProps {
  label: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
  className?: string
}

export function MobileTagInput({
  label,
  tags,
  onTagsChange,
  placeholder = "Add tag...",
  maxTags = 10,
  className,
}: MobileTagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const addTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedValue])
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-forest-800">{label}</Label>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={tags.length >= maxTags}
            className="flex-1 h-10 text-base border-forest-300 focus:border-forest-500"
            style={{ fontSize: "16px" }}
          />
          <Button
            onClick={addTag}
            disabled={!inputValue.trim() || tags.length >= maxTags}
            size="sm"
            className="px-4 bg-forest-600 text-white hover:bg-forest-700 touch-manipulation"
          >
            Add
          </Button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-forest-100 text-forest-800 border-forest-200 pl-3 pr-1 py-1 text-sm"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTag(tag)}
                  className="h-4 w-4 ml-1 text-forest-600 hover:text-forest-800 hover:bg-forest-200 touch-manipulation"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {maxTags && (
          <p className="text-xs text-stone-500">
            {tags.length}/{maxTags} tags
          </p>
        )}
      </div>
    </div>
  )
}
