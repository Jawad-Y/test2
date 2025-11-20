import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/test2',
  assetPrefix: '/test2/',
  skipTrailingSlashRedirect: true,
  trailingSlash: true,
};

export default nextConfig;
