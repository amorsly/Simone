/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ensures ESLint errors don't block deployment
  },
  // No custom output or distDir configurations needed for Vercel
}

export default nextConfig