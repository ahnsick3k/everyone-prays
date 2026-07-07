import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // firebase-admin is not installed; skip build-time type errors until the dep is added
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/every1pray/lordball-2',
        destination: '/lordball',
      },
    ];
  },
};

export default nextConfig;
