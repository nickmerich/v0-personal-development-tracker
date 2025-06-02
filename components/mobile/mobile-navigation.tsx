"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, CheckSquare, Calendar, BarChart3, Settings, Menu, X, Plus, Bell, User, Mountain } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  userData?: any
  unreadNotifications?: number
}

export function MobileNavigation({ userData, unreadNotifications = 0 }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Home", badge: null },
    { href: "/tasks", icon: CheckSquare, label: "Tasks", badge: null },
    { href: "/calendar", icon: Calendar, label: "Calendar", badge: null },
    { href: "/analytics", icon: BarChart3, label: "Progress", badge: null },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      badge: unreadNotifications > 0 ? unreadNotifications : null,
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-200 safe-area-top",
          isScrolled ? "border-forest-200 shadow-sm" : "border-transparent",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 touch-manipulation">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <Mountain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-forest-800 text-lg">Gryt</span>
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-forest-600 hover:bg-forest-50 touch-manipulation"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-white">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-forest-600 hover:bg-forest-50 touch-manipulation"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 w-10 text-forest-600 hover:bg-forest-50 touch-manipulation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full safe-area-top">
          {/* Menu Header */}
          <div className="p-6 border-b border-forest-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-forest-600 rounded-xl flex items-center justify-center">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-forest-800 text-lg">The Gryt</h2>
                <p className="text-sm text-stone-600">Transform Your Life</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 touch-manipulation",
                    isActive(item.href)
                      ? "bg-forest-100 text-forest-800 shadow-sm"
                      : "text-stone-600 hover:bg-forest-50 hover:text-forest-700 active:bg-forest-100",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-forest-200">
              <h3 className="text-sm font-semibold text-stone-700 mb-3 px-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Plus className="h-4 w-4" />
                  Add New Task
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-forest-300 text-forest-700 hover:bg-forest-50"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Event
                </Button>
              </div>
            </div>
          </nav>

          {/* Menu Footer */}
          <div className="p-4 border-t border-forest-200 safe-area-bottom">
            <div className="text-center text-xs text-stone-500">
              <p>The Gryt v1.0</p>
              <p>Your 90-Day Transformation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-forest-200 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 touch-manipulation min-w-[60px]",
                isActive(item.href)
                  ? "text-forest-600 bg-forest-50"
                  : "text-stone-500 hover:text-forest-600 hover:bg-forest-25 active:bg-forest-50",
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-red-500 text-white border-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}

          {/* FAB for Add Task */}
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-forest-600 text-white hover:bg-forest-700 shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 safe-area-top" />
      <div className="h-20 safe-area-bottom" />
    </>
  )
}
