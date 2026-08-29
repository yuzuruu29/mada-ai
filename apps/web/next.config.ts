import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@mada-ai/agent-core',
    '@mada-ai/auth',
    '@mada-ai/models',
    '@mada-ai/search',
    '@mada-ai/shared',
    '@mada-ai/evidence',
    '@mada-ai/citations',
    '@mada-ai/fetch',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
