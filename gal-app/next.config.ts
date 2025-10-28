import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for SSR performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configure images for better performance
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Set the correct workspace root to avoid lockfile warnings
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
