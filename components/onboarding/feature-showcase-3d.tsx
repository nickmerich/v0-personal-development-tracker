"use client"

import { motion } from "framer-motion"
import { ThreeDCard } from "../three-d-card"
import { BarChart3, Target, Zap, Users, Calendar, Trophy } from "lucide-react"

export function FeatureShowcase3D() {
  const features = [
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Visual Progress Tracking",
      description: "See your growth with beautiful charts and insights",
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Smart Goal Setting",
      description: "Set and achieve meaningful, measurable goals",
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "AI-Powered Coaching",
      description: "Get personalized guidance and motivation",
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Community Support",
      description: "Connect with like-minded individuals",
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      icon: <Calendar className="w-12 h-12" />,
      title: "Habit Scheduling",
      description: "Plan and organize your daily routines",
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Achievement System",
      description: "Celebrate milestones and stay motivated",
      color: "from-gryt-green to-gryt-green-hover",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <ThreeDCard className="glass-gryt-card border-gryt-gray-muted/20 p-6 h-full">
            <div className="text-center text-gryt-white">
              <motion.div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} mx-auto mb-4 flex items-center justify-center`}
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.4 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm text-gryt-gray-text leading-relaxed">{feature.description}</p>
            </div>
          </ThreeDCard>
        </motion.div>
      ))}
    </div>
  )
}
