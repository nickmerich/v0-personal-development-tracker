"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout"
import {
  Smartphone,
  ContactIcon as Touch,
  Zap,
  Eye,
  Navigation,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
} from "lucide-react"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
}

export default function MobileTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [touchTest, setTouchTest] = useState({ x: 0, y: 0, active: false })
  const [swipeCount, setSwipeCount] = useState(0)
  const [longPressCount, setLongPressCount] = useState(0)
  const [refreshCount, setRefreshCount] = useState(0)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    pixelRatio: 1,
    orientation: "Portrait",
  })
  const touchRef = useRef<HTMLDivElement>(null)

  // Only run on client-side after component mounts
  useEffect(() => {
    // Initialize screen info
    setScreenInfo({
      width: window?.innerWidth || 0,
      height: window?.innerHeight || 0,
      pixelRatio: window?.devicePixelRatio || 1,
      orientation: (window?.innerWidth || 0) > (window?.innerHeight || 0) ? "Landscape" : "Portrait",
    })

    runMobileTests()

    // Add resize listener
    const handleResize = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        orientation: window.innerWidth > window.innerHeight ? "Landscape" : "Portrait",
      })
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  const runMobileTests = () => {
    if (typeof window === "undefined") return

    const results: TestResult[] = []

    // Test 1: Viewport and Screen Size
    const isMobile = window.innerWidth <= 768
    results.push({
      name: "Mobile Viewport Detection",
      status: isMobile ? "pass" : "warning",
      message: isMobile ? "Mobile viewport detected" : `Desktop viewport: ${window.innerWidth}px`,
    })

    // Test 2: Touch Support
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    results.push({
      name: "Touch Support",
      status: hasTouch ? "pass" : "fail",
      message: hasTouch ? "Touch events supported" : "No touch support detected",
    })

    // Test 3: Device Pixel Ratio
    const pixelRatio = window.devicePixelRatio || 1
    results.push({
      name: "High DPI Display",
      status: pixelRatio >= 2 ? "pass" : "warning",
      message: `Device pixel ratio: ${pixelRatio}`,
    })

    // Test 4: Orientation Support
    const hasOrientation = "orientation" in window
    results.push({
      name: "Orientation Detection",
      status: hasOrientation ? "pass" : "warning",
      message: hasOrientation ? "Orientation API available" : "No orientation API",
    })

    // Test 5: Local Storage
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      results.push({
        name: "Local Storage",
        status: "pass",
        message: "Local storage working",
      })
    } catch {
      results.push({
        name: "Local Storage",
        status: "fail",
        message: "Local storage not available",
      })
    }

    // Test 6: Network Information
    const connection = (navigator as any).connection
    if (connection) {
      results.push({
        name: "Network Information",
        status: "pass",
        message: `Connection: ${connection.effectiveType || "unknown"}`,
      })
    } else {
      results.push({
        name: "Network Information",
        status: "warning",
        message: "Network API not available",
      })
    }

    // Test 7: Vibration API
    const hasVibration = "vibrate" in navigator
    results.push({
      name: "Vibration Support",
      status: hasVibration ? "pass" : "warning",
      message: hasVibration ? "Vibration API available" : "No vibration support",
    })

    setTestResults(results)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchTest({
      x: touch.clientX,
      y: touch.clientY,
      active: true,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchTest.active) {
      const touch = e.touches[0]
      setTouchTest({
        x: touch.clientX,
        y: touch.clientY,
        active: true,
      })
    }
  }

  const handleTouchEnd = () => {
    setTouchTest((prev) => ({ ...prev, active: false }))
  }

  const handleRefresh = async () => {
    setRefreshCount((prev) => prev + 1)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const StatusIcon = ({ status }: { status: "pass" | "fail" | "warning" }) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-800">Mobile Test Suite</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 bg-white p-4 md:hidden">
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                <Touch className="mr-2 h-4 w-4" />
                Touch Tests
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                <Eye className="mr-2 h-4 w-4" />
                Visual Tests
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setIsMenuOpen(false)}>
                <Zap className="mr-2 h-4 w-4" />
                Performance
              </Button>
            </nav>
          </div>
        )}
      </header>

      <MobileLayout>
        <Tabs defaultValue="diagnostics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="diagnostics" className="text-xs">
              <CheckCircle className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="touch" className="text-xs">
              <Touch className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Touch</span>
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs">
              <Navigation className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Forms</span>
            </TabsTrigger>
            <TabsTrigger value="gestures" className="text-xs">
              <Zap className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Gestures</span>
            </TabsTrigger>
          </TabsList>

          {/* Diagnostic Tests */}
          <TabsContent value="diagnostics" className="space-y-4">
            <MobileCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Device Diagnostics</h2>
                </div>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={result.status} />
                        <span className="font-medium text-sm">{result.name}</span>
                      </div>
                      <Badge
                        variant={
                          result.status === "pass" ? "default" : result.status === "fail" ? "destructive" : "secondary"
                        }
                      >
                        {result.message}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={runMobileTests} className="w-full">
                  Re-run Tests
                </Button>
              </div>
            </MobileCard>

            {/* Screen Information */}
            <MobileCard>
              <div className="space-y-4">
                <h3 className="font-semibold">Screen Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Width:</span>
                    <span className="ml-2 font-mono">{screenInfo.width}px</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Height:</span>
                    <span className="ml-2 font-mono">{screenInfo.height}px</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pixel Ratio:</span>
                    <span className="ml-2 font-mono">{screenInfo.pixelRatio}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Orientation:</span>
                    <span className="ml-2 font-mono">{screenInfo.orientation}</span>
                  </div>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          {/* Touch Tests */}
          <TabsContent value="touch" className="space-y-4">
            <MobileCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Touch className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Touch Interaction Test</h2>
                </div>
                <p className="text-sm text-gray-600">Touch and drag in the area below to test touch responsiveness</p>

                <div
                  ref={touchRef}
                  className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg border-2 border-dashed border-blue-300 overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {touchTest.active && (
                    <div
                      className="absolute w-8 h-8 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        left: touchTest.x,
                        top: touchTest.y,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Touch className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-blue-600 font-medium">Touch Here</p>
                      {touchTest.active && (
                        <p className="text-xs text-blue-500 mt-1">
                          X: {Math.round(touchTest.x)}, Y: {Math.round(touchTest.y)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </MobileCard>

            {/* Button Tests */}
            <MobileCard>
              <div className="space-y-4">
                <h3 className="font-semibold">Button Touch Targets</h3>
                <p className="text-sm text-gray-600">Test different button sizes for mobile accessibility</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Small (32px) - Below recommended</p>
                    <Button size="sm" className="h-8">
                      Small Button
                    </Button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Medium (40px) - Minimum recommended</p>
                    <Button size="default">Medium Button</Button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Large (48px) - Comfortable</p>
                    <Button size="lg">Large Button</Button>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Mobile optimized</p>
                    <MobileButton size="full">Full Width Mobile Button</MobileButton>
                  </div>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          {/* Form Tests */}
          <TabsContent value="forms" className="space-y-4">
            <MobileCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Mobile Form Testing</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="text-base" // Prevents zoom on iOS
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      placeholder="Enter your message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      className="text-base min-h-[100px]"
                    />
                  </div>

                  <MobileButton size="full" onClick={() => alert("Form submitted!")}>
                    Submit Form
                  </MobileButton>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    ✓ Font size 16px+ prevents zoom on iOS
                    <br />✓ Proper input types for mobile keyboards
                    <br />✓ Large touch targets for buttons
                  </p>
                </div>
              </div>
            </MobileCard>
          </TabsContent>

          {/* Gesture Tests */}
          <TabsContent value="gestures" className="space-y-4">
            <MobileCard>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Gesture Testing</h2>
                </div>

                {/* Swipe Test */}
                <div className="space-y-2">
                  <h4 className="font-medium">Swipe Gestures</h4>
                  <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border">
                    <div className="text-center">
                      <ArrowLeft className="inline h-4 w-4 mr-2" />
                      Swipe left or right
                      <ArrowRight className="inline h-4 w-4 ml-2" />
                      <p className="text-sm text-gray-600 mt-1">Swipes: {swipeCount}</p>
                    </div>
                  </div>
                </div>

                {/* Long Press Test */}
                <div className="space-y-2">
                  <h4 className="font-medium">Long Press</h4>
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border text-center">
                    <p>Press and hold for 500ms</p>
                    <p className="text-sm text-gray-600 mt-1">Long presses: {longPressCount}</p>
                  </div>
                </div>

                {/* Pull to Refresh Test */}
                <div className="space-y-2">
                  <h4 className="font-medium">Pull to Refresh</h4>
                  <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border text-center">
                    <p>Pull down to refresh</p>
                    <p className="text-sm text-gray-600 mt-1">Refreshes: {refreshCount}</p>
                  </div>
                </div>
              </div>
            </MobileCard>

            {/* Performance Test */}
            <MobileCard>
              <div className="space-y-4">
                <h3 className="font-semibold">Performance Test</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">Memory</p>
                    <p className="text-xs text-gray-600">
                      {typeof window !== "undefined" && (performance as any).memory
                        ? `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB`
                        : "Not available"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">Connection</p>
                    <p className="text-xs text-gray-600">
                      {typeof window !== "undefined" && (navigator as any).connection?.effectiveType
                        ? (navigator as any).connection?.effectiveType
                        : "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </MobileCard>
          </TabsContent>
        </Tabs>
      </MobileLayout>
    </div>
  )
}
