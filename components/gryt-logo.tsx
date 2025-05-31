"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface GrytLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon-only"
  className?: string
  priority?: boolean
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
}

const containerSizeClasses = {
  sm: "h-8",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
}

export function GrytLogo({ size = "md", variant = "full", className, priority = false }: GrytLogoProps) {
  if (variant === "icon-only") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <Image src="/images/the-gryt-logo.png" alt="The Gryt" fill className="object-contain" priority={priority} />
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <Image src="/images/the-gryt-logo.png" alt="The Gryt" fill className="object-contain" priority={priority} />
      </div>
    </div>
  )
}
