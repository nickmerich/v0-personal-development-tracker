"use client"

import type React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface ParallaxSectionProps {
  children: React.ReactNode
}

export function ParallaxSection({ children }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <motion.div ref={ref} className="relative overflow-hidden" style={{ opacity }}>
      <motion.div className="absolute inset-0 bg-[url('/patterns/dots.png')] bg-repeat opacity-5" style={{ y }} />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
