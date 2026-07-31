import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker / AWS App Runner deployment
  output: "standalone",

  // Allow images from S3 (for future asset hosting)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.ap-northeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
