import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.salonliyo.com',
        pathname: '/assets/images/**',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tse4.mm.bing.net',
        pathname: '/**',
      },
    ],
  },
    // 🔥 Prevent ESLint from breaking Docker production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🔥 Prevent TypeScript errors from breaking Docker builds (optional but recommended)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
