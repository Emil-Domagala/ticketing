import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  server: {
    watch: {
      poll: 500,
    },
  },
};

export default nextConfig;
