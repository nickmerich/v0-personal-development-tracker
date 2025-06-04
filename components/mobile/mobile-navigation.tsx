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
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
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
      {/* Gryt Mobile Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-gryt-charcoal/95 backdrop-blur-md border-b transition-gryt safe-area-top",
          isScrolled ? "border-gryt-gray-muted/20 shadow-lg" : "border-transparent",
        )}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Gryt Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 touch-manipulation">
            <div className="w-8 h-8 bg-gryt-green rounded-lg flex items-center justify-center">
              <Mountain className="h-5 w-5 text-gryt-white" />
            </div>
            <span className="font-bold text-gryt-white text-lg">GRYT</span>
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white touch-manipulation"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gryt-red text-gryt-white border-gryt-charcoal">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white touch-manipulation"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 w-10 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white touch-manipulation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gryt-charcoal/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Gryt Mobile Menu */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gryt-charcoal z-50 transform transition-gryt duration-300 ease-out shadow-2xl border-l border-gryt-gray-muted/20",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full safe-area-top">
          {/* Menu Header */}
          <div className="p-6 border-b border-gryt-gray-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gryt-green rounded-xl flex items-center justify-center">
                <Mountain className="h-6 w-6 text-gryt-white" />
              </div>
              <div>
                <h2 className="font-bold text-gryt-white text-lg">GRYT</h2>
                <p className="text-sm text-gryt-gray-text">Transform Your Life</p>
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
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-gryt touch-manipulation",
                    isActive(item.href)
                      ? "bg-gryt-green text-gryt-white shadow-lg"
                      : "text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white active:bg-gryt-charcoal-lighter",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge className="ml-auto bg-gryt-red text-gryt-white text-xs">
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gryt-gray-muted/20">
              <h3 className="text-sm font-semibold text-gryt-gray-text mb-3 px-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-gryt-gray-muted/30 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white"
                >
                  <Plus className="h-4 w-4" />
                  Add New Task
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 border-gryt-gray-muted/30 text-gryt-gray-text hover:bg-gryt-charcoal-light hover:text-gryt-white"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Event
                </Button>
              </div>
            </div>
          </nav>

          {/* Menu Footer */}
          <div className="p-4 border-t border-gryt-gray-muted/20 safe-area-bottom">
            <div className="text-center text-xs text-gryt-gray-muted">
              <p>GRYT v1.0</p>
              <p>Your 90-Day Transformation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gryt Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gryt-charcoal/95 backdrop-blur-md border-t border-gryt-gray-muted/20 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-gryt touch-manipulation min-w-[60px]",
                isActive(item.href)
                  ? "text-gryt-green bg-gryt-charcoal-light"
                  : "text-gryt-gray-muted hover:text-gryt-white hover:bg-gryt-charcoal-light active:bg-gryt-charcoal-lighter",
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-gryt-red text-gryt-white border-gryt-charcoal">
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
            className="h-12 w-12 rounded-full bg-gryt-green text-gryt-white hover:bg-gryt-green-hover shadow-lg hover:shadow-xl transition-gryt touch-manipulation hover-glow-green"
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
