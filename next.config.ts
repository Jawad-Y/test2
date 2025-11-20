import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/test2',
  assetPrefix: '/test2/',
};

export default nextConfig;
