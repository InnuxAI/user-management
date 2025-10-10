import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Reduce console errors in dev
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  devIndicators: false,
  // API rewrites to proxy to backend
  async rewrites() {
    const fastapiUrl = process.env.FASTAPI_URL || 'http://localhost:8001';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${fastapiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
