const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, ''),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { hostname: '**.printify.com' },
      { hostname: '**.shopify.com' },
      { hostname: 'cdn.shopify.com' },
    ],
  },
};

module.exports = nextConfig;
