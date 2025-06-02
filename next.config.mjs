/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    domains: ['blob.v0.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: false,
  },
  // Optimize bundle size
  swcMinify: true,
  // Enable compression
  compress: true,
  // Optimize images
  optimizeFonts: true,
}

export default nextConfig
