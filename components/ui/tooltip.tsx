"use client"

import type * as React from "react"

export interface TooltipProps {
  children: React.ReactNode
}

export interface TooltipContentProps {
  children: React.ReactNode
  className?: string
}

export interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: TooltipProps) {
  return <div className="relative inline-block">{children}</div>
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  return <>{children}</>
}

export function TooltipContent({ children, className = "" }: TooltipContentProps) {
  return (
    <div className={`absolute z-50 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md shadow-lg ${className}`}>
      {children}
    </div>
  )
}
