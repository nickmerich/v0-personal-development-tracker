"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "#003B1F" }}
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Logo */}
        <div className="w-40 h-40 md:w-48 md:h-48 mb-8 md:mb-12 relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e6ec986a-3e6a-4824-9dab-9d5ceb0a6ca1-NezMNkrO26cgTufTz6rJwe6s9Ybmng.png"
            alt="GRYT Logo"
            width={200}
            height={200}
            priority
            className="object-contain"
          />
        </div>

        {/* Headline */}
        <h1
          className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 tracking-tight"
          style={{ color: "#F4F1E9" }}
        >
          One Year Can Change Everything.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-2xl" style={{ color: "#F4F1E9" }}>
          Track your habits. Transform your life. Start with GRYT.
        </p>

        {/* CTA Button */}
        <Button className="px-8 py-6 text-lg font-medium rounded-full bg-[#F4F1E9] text-[#003B1F] hover:bg-[#E5E2D6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
          Get Started
        </Button>

        {/* Optional subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 5L12 19M12 19L19 12M12 19L5 12"
              stroke="#F4F1E9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
