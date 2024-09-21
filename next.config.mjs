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
    ignoreDuringBuilds: true,
  },
  // Remove the output and distDir configurations
}

export default nextConfig;