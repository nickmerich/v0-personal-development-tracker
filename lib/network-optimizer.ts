"use client"

interface NetworkStrategy {
  preloadImages: boolean
  enableAnimations: boolean
  chunkSize: number
  timeout: number
}

class NetworkOptimizer {
  private strategy: NetworkStrategy

  constructor() {
    this.strategy = this.determineStrategy()
  }

  private determineStrategy(): NetworkStrategy {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (!connection) {
      return {
        preloadImages: true,
        enableAnimations: true,
        chunkSize: 10,
        timeout: 5000,
      }
    }

    const { effectiveType, downlink } = connection

    switch (effectiveType) {
      case "slow-2g":
      case "2g":
        return {
          preloadImages: false,
          enableAnimations: false,
          chunkSize: 3,
          timeout: 15000,
        }
      case "3g":
        return {
          preloadImages: false,
          enableAnimations: true,
          chunkSize: 5,
          timeout: 10000,
        }
      case "4g":
      default:
        return {
          preloadImages: true,
          enableAnimations: true,
          chunkSize: 10,
          timeout: 5000,
        }
    }
  }

  getStrategy(): NetworkStrategy {
    return this.strategy
  }

  // Adaptive loading based on network
  async adaptiveLoad<T>(
    items: T[],
    processor: (item: T) => Promise<any>,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<any[]> {
    const { chunkSize, timeout } = this.strategy
    const results: any[] = []

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize)

      const chunkPromises = chunk.map((item) =>
        Promise.race([
          processor(item),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
        ]).catch((error) => {
          console.warn("Failed to load item:", error)
          return null
        }),
      )

      const chunkResults = await Promise.all(chunkPromises)
      results.push(...chunkResults)

      if (onProgress) {
        onProgress(Math.min(i + chunkSize, items.length), items.length)
      }
    }

    return results
  }
}

export const networkOptimizer = new NetworkOptimizer()
