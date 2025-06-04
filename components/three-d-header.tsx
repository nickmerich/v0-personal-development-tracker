"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export function ThreeDHeader() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0])
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get window dimensions
      const width = window.innerWidth
      const height = window.innerHeight

      // Calculate mouse position as percentage of window (-0.5 to 0.5)
      const x = (e.clientX - width / 2) / width
      const y = (e.clientY - height / 2) / height

      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.header
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        opacity: headerOpacity,
        scale: headerScale,
        perspective: "1000px",
      }}
    >
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0 bg-emerald-900"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Layered background elements with different parallax speeds */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(/patterns/dots.png)",
            backgroundSize: "cover",
            transform: `translate3d(${mousePosition.x * -20}px, ${mousePosition.y * -20}px, 0px)`,
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/patterns/circuit.png)",
            backgroundSize: "contain",
            transform: `translate3d(${mousePosition.x * -40}px, ${mousePosition.y * -40}px, 0px)`,
          }}
        />
      </motion.div>

      {/* Header Content with 3D effect */}
      <div className="container relative z-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="text-white"
            style={{
              transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * -15}px, 0px)`,
            }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Transform Your Life
            </motion.h1>

            <motion.p
              className="text-xl opacity-80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Track habits, set goals, and witness your personal growth with our powerful tools
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all hover:shadow-lg">
                Get Started
              </button>
            </motion.div>
          </motion.div>

          {/* Logo/Image with stronger 3D effect */}
          <motion.div
            className="flex justify-center md:justify-end"
            style={{
              transform: `translate3d(${mousePosition.x * 30}px, ${mousePosition.y * 30}px, 0px) rotateX(${
                mousePosition.y * -5
              }deg) rotateY(${mousePosition.x * 5}deg)`,
            }}
          >
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <Image
                src="/images/the-gryt-logo-new.png"
                alt="GRYT Logo"
                fill
                style={{ objectFit: "contain" }}
                className="drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating 3D Elements */}
      <motion.div
        className="absolute w-20 h-20 bg-white/10 rounded-full blur-md"
        style={{
          left: "10%",
          top: "20%",
          transform: `translate3d(${mousePosition.x * -50}px, ${mousePosition.y * -50}px, 0px)`,
        }}
      />

      <motion.div
        className="absolute w-32 h-32 bg-white/5 rounded-full blur-md"
        style={{
          right: "15%",
          bottom: "30%",
          transform: `translate3d(${mousePosition.x * -30}px, ${mousePosition.y * -30}px, 0px)`,
        }}
      />

      <motion.div
        className="absolute w-16 h-16 bg-emerald-500/20 rounded-full blur-md"
        style={{
          right: "30%",
          top: "15%",
          transform: `translate3d(${mousePosition.x * -70}px, ${mousePosition.y * -70}px, 0px)`,
        }}
      />
    </motion.header>
  )
}
