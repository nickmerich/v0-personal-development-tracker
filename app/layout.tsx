import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationProvider } from "@/components/notification-provider"
import { TourProvider } from "@/components/tour-provider"
import { CleanAppInitializer } from "@/components/clean-app-initializer"
import { SimpleAuthProvider } from "@/components/simple-auth-provider"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Gryt - Personal Development Tracker",
  description: "Transform your life in 90 days with The Gryt personal development tracker",
  keywords: ["personal development", "goal tracking", "habit tracker", "90-day challenge"],
  authors: [{ name: "The Gryt Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#16a34a",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/images/the-gryt-logo.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Performance optimizations */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <SimpleAuthProvider>
              <NotificationProvider>
                <TourProvider>
                  <CleanAppInitializer>{children}</CleanAppInitializer>
                </TourProvider>
              </NotificationProvider>
            </SimpleAuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
