import type { NextConfig } from 'next'

const allowedBots = '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*'

const config: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/preview',
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
      },
    ]
  },
  // Enable edge runtime for API routes
  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    }
  },
  // Ensure API routes are properly handled
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

export default config


