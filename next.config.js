/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    esmExternals: false,
  },
  trailingSlash: true,
  output: "export",
  distDir: "dist",
}

module.exports = nextConfig
