"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  ArrowLeft,
  Target,
  User,
  Calendar,
  Trophy,
  Sparkles,
  CheckCircle2,
  Mountain,
  Zap,
  BarChart3,
  Users,
} from "lucide-react"
import { ThreeDCard } from "../three-d-card"
import { TiltButton } from "../tilt-button"
import { ThreeDEffectField } from "../three-d-bubble-field"
import { FloatingElement } from "./floating-element"
import { ProgressSphere } from "./progress-sphere"
import { InteractiveGoalCard } from "./interactive-goal-card"
import { CategorySelector3D } from "./category-selector-3d"
import { FeatureShowcase3D } from "./feature-showcase-3d"
import { CelebrationEffect } from "./celebration-effect"

interface OnboardingStep {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  component: React.ReactNode
  backgroundColor: string
  bubbleColor: string
}

export function ThreeDOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    goal: "",
    categories: [] as string[],
    preferences: {} as Record<string, any>,
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to GRYT",
      subtitle: "Your journey to transformation starts here",
      icon: <Sparkles className="w-8 h-8" />,
      backgroundColor: "from-gryt-charcoal via-gryt-charcoal-lighter to-gryt-charcoal-light",
      bubbleColor: "bg-gryt-green/20",
      component: <WelcomeStep onNext={() => handleNext()} />,
    },
    {
      id: "personal-info",
      title: "Tell Us About Yourself",
      subtitle: "Let's personalize your experience",
      icon: <User className="w-8 h-8" />,
      backgroundColor: "from-gryt-charcoal-light via-gryt-charcoal to-gryt-charcoal-lighter",
      bubbleColor: "bg-gryt-white/10",
      component: (
        <PersonalInfoStep
          userData={userData}
          onUpdate={setUserData}
          onNext={() => handleNext()}
          onBack={() => handleBack()}
        />
      ),
    },
    {
      id: "goal-setting",
      title: "What's Your Big Goal?",
      subtitle: "Define what success looks like for you",
      icon: <Target className="w-8 h-8" />,
      backgroundColor: "from-gryt-charcoal via-gryt-charcoal-light to-gryt-charcoal-lighter",
      bubbleColor: "bg-gryt-green/15",
      component: (
        <GoalSettingStep
          userData={userData}
          onUpdate={setUserData}
          onNext={() => handleNext()}
          onBack={() => handleBack()}
        />
      ),
    },
    {
      id: "categories",
      title: "Choose Your Focus Areas",
      subtitle: "Select the habits you want to build",
      icon: <Calendar className="w-8 h-8" />,
      backgroundColor: "from-gryt-charcoal-lighter via-gryt-charcoal to-gryt-charcoal-light",
      bubbleColor: "bg-gryt-white/8",
      component: (
        <CategoriesStep
          userData={userData}
          onUpdate={setUserData}
          onNext={() => handleNext()}
          onBack={() => handleBack()}
        />
      ),
    },
    {
      id: "features",
      title: "Discover Your Tools",
      subtitle: "See how GRYT will help you succeed",
      icon: <Zap className="w-8 h-8" />,
      backgroundColor: "from-gryt-charcoal-light via-gryt-charcoal-lighter to-gryt-charcoal",
      bubbleColor: "bg-gryt-green/12",
      component: <FeaturesStep onNext={() => handleNext()} onBack={() => handleBack()} />,
    },
    {
      id: "complete",
      title: "You're All Set!",
      subtitle: "Welcome to your transformation journey",
      icon: <Trophy className="w-8 h-8" />,
      backgroundColor: "from-gryt-charcoal via-gryt-green/20 to-gryt-charcoal-light",
      bubbleColor: "bg-gryt-green/25",
      component: <CompletionStep userData={userData} onComplete={() => handleComplete()} />,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsTransitioning(false)
      }, 200)
    }
  }

  const handleComplete = () => {
    localStorage.setItem("gryt-onboarding-complete", "true")
    localStorage.setItem("gryt-user-data", JSON.stringify(userData))
    router.push("/dashboard")
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-gryt-charcoal">
      {/* Gryt Background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentStepData.backgroundColor}`}
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Subtle 3D Background Effects */}
      <ThreeDEffectField
        colorClass={currentStepData.bubbleColor}
        bubbleCount={6}
        minSize={80}
        maxSize={160}
        speed={0.3}
      />

      {/* Gryt Floating Elements */}
      <FloatingElement
        className="absolute top-20 left-10 opacity-20"
        delay={0}
        icon={<Mountain className="w-6 h-6 text-gryt-green" />}
      />
      <FloatingElement
        className="absolute top-40 right-20 opacity-15"
        delay={0.8}
        icon={<BarChart3 className="w-7 h-7 text-gryt-white" />}
      />
      <FloatingElement
        className="absolute bottom-40 left-20 opacity-10"
        delay={1.2}
        icon={<Users className="w-6 h-6 text-gryt-gray-text" />}
      />

      {/* Progress Indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <ProgressSphere progress={progress} currentStep={currentStep + 1} totalSteps={steps.length} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="w-full max-w-4xl mx-auto"
          >
            {/* Step Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  className="glass-gryt rounded-full p-4 border border-gryt-green/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-gryt-green">{currentStepData.icon}</div>
                </motion.div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gryt-white mb-3 text-shadow-soft">
                {currentStepData.title}
              </h1>
              <p className="text-xl text-gryt-gray-text font-light">{currentStepData.subtitle}</p>
            </motion.div>

            {/* Step Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {currentStepData.component}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {steps.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-gryt ${
                index === currentStep
                  ? "bg-gryt-green scale-125"
                  : index < currentStep
                    ? "bg-gryt-green/70"
                    : "bg-gryt-gray-muted/30"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (index <= currentStep) {
                  setCurrentStep(index)
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Individual Step Components with Gryt styling
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <ThreeDCard className="glass-gryt-card border-gryt-gray-muted/20 p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gryt-white">Transform Your Life in 90 Days</h2>
        <p className="text-lg mb-6 text-gryt-gray-text leading-relaxed">
          Join thousands of people who have built lasting habits and achieved their goals with GRYT.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-gryt rounded-xl p-4 border border-gryt-gray-muted/20">
            <Target className="w-8 h-8 mx-auto mb-2 text-gryt-green" />
            <p className="text-sm font-medium text-gryt-white">Set Clear Goals</p>
          </div>
          <div className="glass-gryt rounded-xl p-4 border border-gryt-gray-muted/20">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gryt-green" />
            <p className="text-sm font-medium text-gryt-white">Track Progress</p>
          </div>
          <div className="glass-gryt rounded-xl p-4 border border-gryt-gray-muted/20">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-gryt-green" />
            <p className="text-sm font-medium text-gryt-white">Achieve Success</p>
          </div>
        </div>
        <TiltButton
          onClick={onNext}
          className="bg-gryt-green text-gryt-white hover:bg-gryt-green-hover px-8 py-3 text-lg"
        >
          Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
        </TiltButton>
      </motion.div>
    </ThreeDCard>
  )
}

function PersonalInfoStep({
  userData,
  onUpdate,
  onNext,
  onBack,
}: {
  userData: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}) {
  const [name, setName] = useState(userData.name || "")
  const [email, setEmail] = useState(userData.email || "")

  const handleNext = () => {
    onUpdate({ ...userData, name, email })
    onNext()
  }

  return (
    <ThreeDCard className="glass-gryt-card border-gryt-gray-muted/20 p-8 max-w-md mx-auto">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gryt-white">What should we call you?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gryt-charcoal-light border border-gryt-gray-muted/30 text-gryt-white placeholder-gryt-gray-muted focus-ring-gryt transition-gryt"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gryt-white">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gryt-charcoal-light border border-gryt-gray-muted/30 text-gryt-white placeholder-gryt-gray-muted focus-ring-gryt transition-gryt"
            placeholder="your@email.com"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <TiltButton
            onClick={onBack}
            variant="outline"
            className="flex-1 border-gryt-gray-muted/50 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </TiltButton>
          <TiltButton
            onClick={handleNext}
            disabled={!name.trim() || !email.trim()}
            className="flex-1 bg-gryt-green text-gryt-white hover:bg-gryt-green-hover"
          >
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </TiltButton>
        </div>
      </div>
    </ThreeDCard>
  )
}

function GoalSettingStep({
  userData,
  onUpdate,
  onNext,
  onBack,
}: {
  userData: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}) {
  const [selectedGoal, setSelectedGoal] = useState(userData.goal || "")

  const goals = [
    { id: "health", title: "Improve Health", description: "Build healthy habits for body and mind", icon: "💪" },
    {
      id: "productivity",
      title: "Boost Productivity",
      description: "Get more done and achieve your goals",
      icon: "🚀",
    },
    {
      id: "learning",
      title: "Learn New Skills",
      description: "Develop yourself through continuous learning",
      icon: "📚",
    },
    {
      id: "relationships",
      title: "Better Relationships",
      description: "Strengthen connections with others",
      icon: "❤️",
    },
    {
      id: "mindfulness",
      title: "Practice Mindfulness",
      description: "Find peace and clarity in daily life",
      icon: "🧘",
    },
    { id: "creativity", title: "Express Creativity", description: "Unlock your creative potential", icon: "🎨" },
  ]

  const handleNext = () => {
    onUpdate({ ...userData, goal: selectedGoal })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {goals.map((goal) => (
          <InteractiveGoalCard
            key={goal.id}
            goal={goal}
            isSelected={selectedGoal === goal.id}
            onSelect={() => setSelectedGoal(goal.id)}
          />
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <TiltButton
          onClick={onBack}
          variant="outline"
          className="border-gryt-gray-muted/50 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </TiltButton>
        <TiltButton
          onClick={handleNext}
          disabled={!selectedGoal}
          className="bg-gryt-green text-gryt-white hover:bg-gryt-green-hover"
        >
          Continue <ArrowRight className="ml-2 w-4 h-4" />
        </TiltButton>
      </div>
    </div>
  )
}

function CategoriesStep({
  userData,
  onUpdate,
  onNext,
  onBack,
}: {
  userData: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(userData.categories || [])

  const handleNext = () => {
    onUpdate({ ...userData, categories: selectedCategories })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CategorySelector3D selectedCategories={selectedCategories} onSelectionChange={setSelectedCategories} />

      <div className="flex gap-4 justify-center mt-8">
        <TiltButton
          onClick={onBack}
          variant="outline"
          className="border-gryt-gray-muted/50 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </TiltButton>
        <TiltButton
          onClick={handleNext}
          disabled={selectedCategories.length === 0}
          className="bg-gryt-green text-gryt-white hover:bg-gryt-green-hover"
        >
          Continue <ArrowRight className="ml-2 w-4 h-4" />
        </TiltButton>
      </div>
    </div>
  )
}

function FeaturesStep({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <FeatureShowcase3D />

      <div className="flex gap-4 justify-center mt-8">
        <TiltButton
          onClick={onBack}
          variant="outline"
          className="border-gryt-gray-muted/50 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </TiltButton>
        <TiltButton onClick={onNext} className="bg-gryt-green text-gryt-white hover:bg-gryt-green-hover">
          Almost Done <ArrowRight className="ml-2 w-4 h-4" />
        </TiltButton>
      </div>
    </div>
  )
}

function CompletionStep({
  userData,
  onComplete,
}: {
  userData: any
  onComplete: () => void
}) {
  return (
    <ThreeDCard className="glass-gryt-card border-gryt-green/30 p-8 text-center max-w-md mx-auto" variant="success">
      <CelebrationEffect />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="mb-6">
          <CheckCircle2 className="w-16 h-16 mx-auto text-gryt-green mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-gryt-white">Welcome to GRYT, {userData.name}!</h2>
          <p className="text-gryt-gray-text leading-relaxed">
            You're all set to start building lasting habits and achieving your goals.
          </p>
        </div>

        <div className="glass-gryt rounded-xl p-4 mb-6 border border-gryt-gray-muted/20">
          <p className="text-sm text-gryt-gray-text mb-2">Your journey summary:</p>
          <div className="text-left space-y-1">
            <p className="text-sm text-gryt-white">🎯 Goal: {userData.goal}</p>
            <p className="text-sm text-gryt-white">📋 Categories: {userData.categories?.length || 0} selected</p>
            <p className="text-sm text-gryt-white">🚀 Ready to transform your life!</p>
          </div>
        </div>

        <TiltButton
          onClick={onComplete}
          className="w-full bg-gryt-green text-gryt-white hover:bg-gryt-green-hover py-3 text-lg"
        >
          Enter Your Dashboard <ArrowRight className="ml-2 w-5 h-5" />
        </TiltButton>
      </motion.div>
    </ThreeDCard>
  )
}
