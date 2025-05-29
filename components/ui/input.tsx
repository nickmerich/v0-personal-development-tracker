import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "default" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, size = "default", ...props }, ref) => {
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-3 text-base",
    lg: "h-12 px-4 text-lg",
  }

  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-forest-300 bg-white transition-all duration-200",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-stone-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2",
        "hover:border-forest-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[size],
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
