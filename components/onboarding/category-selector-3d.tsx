"use client"

import { motion } from "framer-motion"
import { ThreeDCard } from "../three-d-card"
import { Dumbbell, Book, Heart, Briefcase, Palette, Coffee, Music, Camera } from "lucide-react"

interface CategorySelector3DProps {
  selectedCategories: string[]
  onSelectionChange: (categories: string[]) => void
}

export function CategorySelector3D({ selectedCategories, onSelectionChange }: CategorySelector3DProps) {
  const categories = [
    {
      id: "fitness",
      name: "Fitness",
      icon: <Dumbbell className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      id: "learning",
      name: "Learning",
      icon: <Book className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      id: "wellness",
      name: "Wellness",
      icon: <Heart className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      id: "productivity",
      name: "Work",
      icon: <Briefcase className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      id: "creativity",
      name: "Creativity",
      icon: <Palette className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      id: "habits",
      name: "Daily Habits",
      icon: <Coffee className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      id: "hobbies",
      name: "Hobbies",
      icon: <Music className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
    {
      id: "social",
      name: "Social",
      icon: <Camera className="w-8 h-8" />,
      color: "from-gryt-green to-gryt-green-hover",
    },
  ]

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onSelectionChange(selectedCategories.filter((id) => id !== categoryId))
    } else {
      onSelectionChange([...selectedCategories, categoryId])
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category, index) => {
        const isSelected = selectedCategories.includes(category.id)

        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ThreeDCard
              className={`p-6 cursor-pointer transition-gryt ${
                isSelected
                  ? "glass-gryt-card border-gryt-green/50 shadow-lg"
                  : "glass-gryt-card border-gryt-gray-muted/20 hover:border-gryt-gray-muted/30"
              }`}
              onClick={() => toggleCategory(category.id)}
              variant={isSelected ? "success" : "default"}
            >
              <div className="text-center text-gryt-white">
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} mx-auto mb-4 flex items-center justify-center`}
                  animate={{ rotateY: isSelected ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="text-sm font-medium">{category.name}</h3>

                {isSelected && (
                  <motion.div
                    className="mt-3 w-5 h-5 bg-gryt-white rounded-full mx-auto flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-gryt-green rounded-full" />
                  </motion.div>
                )}
              </div>
            </ThreeDCard>
          </motion.div>
        )
      })}
    </div>
  )
}
