"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface GrytLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "full" | "icon-only" | "seamless"
  className?: string
  priority?: boolean
}

const sizeClasses = {
  xs: "h-6 w-auto",
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-14 w-auto",
  xl: "h-20 w-auto",
}

const imageSizeClasses = {
  xs: { width: 90, height: 24 },
  sm: { width: 120, height: 32 },
  md: { width: 150, height: 40 },
  lg: { width: 210, height: 56 },
  xl: { width: 300, height: 80 },
}

export function GrytLogo({ size = "sm", variant = "seamless", className, priority = false }: GrytLogoProps) {
  const imageSize = imageSizeClasses[size]

  // Seamless variant with background integration
  if (variant === "seamless") {
    return (
      <div className={cn("flex items-center", className)}>
        <div className={cn("relative", sizeClasses[size])}>
          <Image
            src="/images/the-gryt-logo-new.png"
            alt="The Gryt"
            width={imageSize.width}
            height={imageSize.height}
            className="object-contain filter brightness-110 contrast-95 opacity-90 transition-all duration-300 hover:opacity-100 hover:brightness-100"
            priority={priority}
            style={{
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
            }}
          />
        </div>
      </div>
    )
  }

  // Icon-only variant for compact spaces
  if (variant === "icon-only") {
    return (
      <div className={cn("relative overflow-hidden rounded-sm", sizeClasses[size], className)}>
        <Image
          src="/images/the-gryt-logo-new.png"
          alt="The Gryt"
          width={imageSize.width}
          height={imageSize.height}
          className="object-cover object-top filter brightness-110 contrast-95"
          priority={priority}
          style={{
            objectPosition: "50% 20%",
            filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
          }}
        />
      </div>
    )
  }

  // Full variant (default)
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <Image
          src="/images/the-gryt-logo-new.png"
          alt="The Gryt"
          width={imageSize.width}
          height={imageSize.height}
          className="object-contain"
          priority={priority}
        />
      </div>
    </div>
  )
}
