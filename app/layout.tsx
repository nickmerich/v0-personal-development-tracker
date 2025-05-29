import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/components/notification-provider"
import { cn } from "@/lib/utils"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Personal Development Tracker",
  description: "Transform your life with purpose-driven daily actions",
  generator: "v0.dev",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("antialiased", inter.variable, montserrat.variable)}>
      <body
        className={cn(
          "min-h-screen bg-gradient-to-br from-forest-50 to-stone-50 font-sans",
          "text-forest-900 selection:bg-forest-200 selection:text-forest-900",
        )}
      >
        <ErrorBoundary>
          <NotificationProvider>
            <div className="relative flex min-h-screen flex-col">{children}</div>
          </NotificationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
