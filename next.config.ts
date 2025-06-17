import type { NextConfig } from 'next'

const allowedBots = '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*'

export default {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/preview',
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
      },
    ]
  },
} as NextConfig


