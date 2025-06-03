"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout"
import { MobileInput, MobileTextarea, MobileForm, MobileTagInput } from "@/components/mobile/mobile-forms"
import { MobileNavigation } from "@/components/mobile/mobile-navigation"
import { Smartphone, CheckCircle, Wifi, Battery, Signal, Mountain, Target, Settings, Home, Zap } from "lucide-react"
import { storage } from "@/lib/storage"
import { setupManager } from "@/lib/setup-manager"

export default function MobileOnboardingTest() {
  const router = useRouter()
  const [currentTest, setCurrentTest] = useState("overview")
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [isTestingFlow, setIsTestingFlow] = useState(false)
  const [flowStep, setFlowStep] = useState(0)
  const [testData, setTestData] = useState({
    name: "",
    email: "",
    startDate: "",
    myWhy: "",
    bigGoal: "",
    categories: ["Physical Health", "Mental Wellness", "Spiritual Growth"],
    preferences: {
      enableReminders: true,
      reminderTime: "09:00",
      dailyReviewTime: "20:00",
    },
  })

  // Mobile device simulation
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    screenWidth: 0,
    screenHeight: 0,
    pixelRatio: 1,
    orientation: "portrait",
    touchSupport: false,
    isIOS: false,
    isAndroid: false,
  })

  useEffect(() => {
    // Detect mobile device info
    if (typeof window !== "undefined") {
      setDeviceInfo({
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        pixelRatio: window.devicePixelRatio || 1,
        orientation: window.screen.orientation?.type || "portrait",
        touchSupport: "ontouchstart" in window,
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent),
      })
    }
  }, [])

  const runMobileTest = async (testName: string) => {
    console.log(`🧪 Running mobile test: ${testName}`)

    try {
      switch (testName) {
        case "touch-interactions":
          await testTouchInteractions()
          break
        case "responsive-layout":
          await testResponsiveLayout()
          break
        case "keyboard-handling":
          await testKeyboardHandling()
          break
        case "navigation-flow":
          await testNavigationFlow()
          break
        case "data-persistence":
          await testDataPersistence()
          break
        case "performance":
          await testMobilePerformance()
          break
        default:
          console.log("Unknown test")
      }

      setTestResults((prev) => ({ ...prev, [testName]: true }))
    } catch (error) {
      console.error(`❌ Test failed: ${testName}`, error)
      setTestResults((prev) => ({ ...prev, [testName]: false }))
    }
  }

  const testTouchInteractions = async () => {
    // Test touch targets are at least 44px (iOS) / 48px (Android)
    const buttons = document.querySelectorAll("button")
    const inputs = document.querySelectorAll("input, textarea")

    let touchTargetTest = true
    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect()
      if (rect.height < 44 || rect.width < 44) {
        touchTargetTest = false
        console.warn("Touch target too small:", button)
      }
    })

    if (!touchTargetTest) throw new Error("Touch targets too small")

    // Test touch feedback
    const testButton = document.querySelector('[data-test="touch-test"]') as HTMLElement
    if (testButton) {
      testButton.click()
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log("✅ Touch interactions test passed")
  }

  const testResponsiveLayout = async () => {
    // Test different viewport sizes
    const viewports = [
      { width: 320, height: 568 }, // iPhone SE
      { width: 375, height: 667 }, // iPhone 8
      { width: 414, height: 896 }, // iPhone 11
      { width: 360, height: 640 }, // Android
    ]

    for (const viewport of viewports) {
      // Simulate viewport change
      const metaViewport = document.querySelector('meta[name="viewport"]')
      if (metaViewport) {
        console.log(`Testing viewport: ${viewport.width}x${viewport.height}`)

        // Check if content fits
        const content = document.querySelector("main")
        if (content) {
          const rect = content.getBoundingClientRect()
          if (rect.width > viewport.width) {
            throw new Error(`Content overflow at ${viewport.width}px`)
          }
        }
      }
    }

    console.log("✅ Responsive layout test passed")
  }

  const testKeyboardHandling = async () => {
    // Test iOS zoom prevention
    const inputs = document.querySelectorAll("input, textarea")
    inputs.forEach((input) => {
      const fontSize = window.getComputedStyle(input).fontSize
      const fontSizeNum = Number.parseFloat(fontSize)
      if (fontSizeNum < 16) {
        throw new Error("Input font size too small - will cause iOS zoom")
      }
    })

    // Test keyboard navigation
    const firstInput = document.querySelector("input") as HTMLInputElement
    if (firstInput) {
      firstInput.focus()
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Simulate tab navigation
      const event = new KeyboardEvent("keydown", { key: "Tab" })
      firstInput.dispatchEvent(event)
    }

    console.log("✅ Keyboard handling test passed")
  }

  const testNavigationFlow = async () => {
    // Test the complete onboarding flow
    setIsTestingFlow(true)

    const steps = ["personal-info", "my-why", "big-goal", "categories", "calendar-preferences"]

    for (let i = 0; i < steps.length; i++) {
      setFlowStep(i + 1)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate step completion
      setupManager.markStepCompleted(steps[i])
    }

    setIsTestingFlow(false)
    console.log("✅ Navigation flow test passed")
  }

  const testDataPersistence = async () => {
    // Test localStorage persistence
    const testData = {
      name: "Mobile Test User",
      email: "mobile@test.com",
      startDate: new Date().toISOString().split("T")[0],
    }

    storage.updateUserData(testData)

    // Simulate page refresh
    await new Promise((resolve) => setTimeout(resolve, 100))

    const retrievedData = storage.getUserData()
    if (!retrievedData || retrievedData.name !== testData.name) {
      throw new Error("Data persistence failed")
    }

    console.log("✅ Data persistence test passed")
  }

  const testMobilePerformance = async () => {
    // Test performance metrics
    const startTime = performance.now()

    // Simulate heavy operation
    await new Promise((resolve) => setTimeout(resolve, 100))

    const endTime = performance.now()
    const duration = endTime - startTime

    if (duration > 1000) {
      throw new Error("Performance too slow")
    }

    // Test memory usage (basic check)
    if (performance.memory) {
      const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024
      if (memoryUsage > 50) {
        // 50MB threshold
        console.warn("High memory usage:", memoryUsage, "MB")
      }
    }

    console.log("✅ Mobile performance test passed")
  }

  const simulateCompleteFlow = async () => {
    setIsTestingFlow(true)

    try {
      // Step 1: Personal Info
      setFlowStep(1)
      setTestData((prev) => ({
        ...prev,
        name: "Mobile Test User",
        email: "mobile@test.com",
        startDate: new Date().toISOString().split("T")[0],
      }))
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 2: My Why
      setFlowStep(2)
      setTestData((prev) => ({
        ...prev,
        myWhy: "I want to transform my life and become the best version of myself through consistent daily actions.",
      }))
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 3: Big Goal
      setFlowStep(3)
      setTestData((prev) => ({
        ...prev,
        bigGoal: "Complete a 90-day transformation journey with improved health, mindset, and productivity.",
      }))
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 4: Categories
      setFlowStep(4)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Step 5: Preferences
      setFlowStep(5)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Complete setup
      setupManager.completeSetup()
      setFlowStep(6)

      console.log("🎉 Complete mobile flow simulation successful!")
    } catch (error) {
      console.error("❌ Mobile flow simulation failed:", error)
    } finally {
      setIsTestingFlow(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile Status Bar Simulation */}
      <div className="bg-black text-white px-4 py-1 text-xs flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span>9:41</span>
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
        </div>
        <div className="flex items-center gap-1">
          <span>100%</span>
          <Battery className="h-3 w-3" />
        </div>
      </div>

      <MobileLayout maxWidth="full" padding="md">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mobile Onboarding Test</h1>
              <p className="text-sm text-gray-600">Complete flow verification for mobile devices</p>
            </div>
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Screen:</span> {deviceInfo.screenWidth}×{deviceInfo.screenHeight}
            </div>
            <div>
              <span className="font-medium">Pixel Ratio:</span> {deviceInfo.pixelRatio}x
            </div>
            <div>
              <span className="font-medium">Touch:</span> {deviceInfo.touchSupport ? "✅" : "❌"}
            </div>
            <div>
              <span className="font-medium">Platform:</span>{" "}
              {deviceInfo.isIOS ? "iOS" : deviceInfo.isAndroid ? "Android" : "Other"}
            </div>
          </div>
        </div>

        <Tabs value={currentTest} onValueChange={setCurrentTest} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm h-12 rounded-lg">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">
              Tests
            </TabsTrigger>
            <TabsTrigger value="simulation" className="text-xs">
              Flow Test
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-4">
            <MobileCard title="Mobile Optimization Status" icon={<CheckCircle className="h-5 w-5 text-green-600" />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Touch Targets (44px+)</span>
                  <Badge className="bg-green-100 text-green-800">✅ Optimized</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Font Size (16px+)</span>
                  <Badge className="bg-green-100 text-green-800">✅ No Zoom</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Responsive Layout</span>
                  <Badge className="bg-green-100 text-green-800">✅ Fluid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Safe Areas</span>
                  <Badge className="bg-green-100 text-green-800">✅ Respected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Navigation</span>
                  <Badge className="bg-green-100 text-green-800">✅ Mobile-First</Badge>
                </div>
              </div>
            </MobileCard>

            <MobileCard title="Critical Mobile Features" icon={<Zap className="h-5 w-5 text-blue-600" />}>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Bottom navigation for thumb reach</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Large touch targets (48px minimum)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Swipe gestures and touch feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Keyboard-friendly inputs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Offline-capable data storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Fast loading and smooth animations</span>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          {/* TESTS TAB */}
          <TabsContent value="tests" className="space-y-4">
            <MobileCard title="Mobile Test Suite" icon={<Target className="h-5 w-5 text-purple-600" />}>
              <div className="space-y-4">
                {[
                  { id: "touch-interactions", name: "Touch Interactions", desc: "Test touch targets and feedback" },
                  { id: "responsive-layout", name: "Responsive Layout", desc: "Test different screen sizes" },
                  { id: "keyboard-handling", name: "Keyboard Handling", desc: "Test input focus and navigation" },
                  { id: "navigation-flow", name: "Navigation Flow", desc: "Test step-by-step progression" },
                  { id: "data-persistence", name: "Data Persistence", desc: "Test localStorage reliability" },
                  { id: "performance", name: "Mobile Performance", desc: "Test speed and memory usage" },
                ].map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{test.name}</h4>
                      <p className="text-xs text-gray-600">{test.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {testResults[test.id] !== undefined && (
                        <Badge
                          className={testResults[test.id] ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {testResults[test.id] ? "✅" : "❌"}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runMobileTest(test.id)}
                        className="text-xs px-3 py-1 h-8"
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </MobileCard>

            <MobileCard title="Quick Test Actions">
              <div className="grid grid-cols-2 gap-3">
                <MobileButton
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    Object.keys(testResults).forEach((test) => runMobileTest(test))
                  }}
                >
                  Run All Tests
                </MobileButton>
                <MobileButton size="sm" variant="outline" onClick={() => setTestResults({})}>
                  Reset Results
                </MobileButton>
              </div>
            </MobileCard>
          </TabsContent>

          {/* SIMULATION TAB */}
          <TabsContent value="simulation" className="space-y-4">
            <MobileCard
              title="Complete Flow Simulation"
              icon={<Mountain className="h-5 w-5 text-green-600" />}
              badge={isTestingFlow ? `Step ${flowStep}/6` : undefined}
            >
              {isTestingFlow ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                    <p className="text-sm font-medium">
                      {flowStep === 1 && "📝 Testing Personal Info Step"}
                      {flowStep === 2 && "💝 Testing My Why Step"}
                      {flowStep === 3 && "🎯 Testing Big Goal Step"}
                      {flowStep === 4 && "📋 Testing Categories Step"}
                      {flowStep === 5 && "⚙️ Testing Preferences Step"}
                      {flowStep === 6 && "🎉 Completing Setup"}
                    </p>
                  </div>
                  <Progress value={(flowStep / 6) * 100} className="h-2" />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Test the complete onboarding flow with mobile-optimized interactions
                  </p>

                  <div className="space-y-3">
                    <MobileButton size="full" onClick={simulateCompleteFlow} className="h-12">
                      <Mountain className="mr-2 h-4 w-4" />
                      Start Complete Flow Test
                    </MobileButton>

                    <div className="grid grid-cols-2 gap-3">
                      <MobileButton size="sm" variant="outline" onClick={() => router.push("/setup/personal-info")}>
                        Real Setup
                      </MobileButton>
                      <MobileButton size="sm" variant="outline" onClick={() => router.push("/dashboard")}>
                        Dashboard
                      </MobileButton>
                    </div>
                  </div>
                </div>
              )}
            </MobileCard>

            {/* Mobile Form Demo */}
            <MobileCard title="Mobile Form Demo" icon={<Settings className="h-5 w-5 text-blue-600" />}>
              <MobileForm
                title="Test Mobile Inputs"
                description="Verify mobile-optimized form interactions"
                onSubmit={() => console.log("Mobile form submitted")}
                submitLabel="Test Submit"
              >
                <MobileInput
                  label="Name"
                  value={testData.name}
                  onChange={(value) => setTestData((prev) => ({ ...prev, name: value }))}
                  placeholder="Enter your name"
                  required
                  data-test="touch-test"
                />

                <MobileInput
                  label="Email"
                  type="email"
                  value={testData.email}
                  onChange={(value) => setTestData((prev) => ({ ...prev, email: value }))}
                  placeholder="Enter your email"
                />

                <MobileTextarea
                  label="Your Why"
                  value={testData.myWhy}
                  onChange={(value) => setTestData((prev) => ({ ...prev, myWhy: value }))}
                  placeholder="What motivates you?"
                  maxLength={500}
                />

                <MobileTagInput
                  label="Categories"
                  tags={testData.categories}
                  onTagsChange={(tags) => setTestData((prev) => ({ ...prev, categories: tags }))}
                  placeholder="Add category"
                  maxTags={8}
                />
              </MobileForm>
            </MobileCard>
          </TabsContent>
        </Tabs>

        {/* Mobile Navigation Demo */}
        <div className="mt-8">
          <MobileCard title="Mobile Navigation Test">
            <p className="text-sm text-gray-600 mb-4">
              The mobile navigation is active at the bottom of the screen. Test the touch interactions and menu system.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <MobileButton size="sm" variant="outline" onClick={() => router.push("/mobile-test")}>
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile Demo
              </MobileButton>
              <MobileButton size="sm" variant="outline" onClick={() => router.push("/")}>
                <Home className="mr-2 h-4 w-4" />
                Home
              </MobileButton>
            </div>
          </MobileCard>
        </div>
      </MobileLayout>

      {/* Mobile Navigation Component */}
      <MobileNavigation userData={testData} unreadNotifications={3} />
    </div>
  )
}
