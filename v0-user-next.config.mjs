/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // Replace with your Render backend URL
            value: process.env.NEXT_PUBLIC_BASE_URL || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
  // Configure WebSocket proxy
  async rewrites() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';
    return [
      {
        source: '/ws-chat',
        destination: `${BACKEND_URL}/ws-chat`,
      },
      {
        source: '/ws-chat/:path*',
        destination: `${BACKEND_URL}/ws-chat/:path*`,
      },
      {
        source: '/topic/:path*',
        destination: `${BACKEND_URL}/topic/:path*`,
      },
      {
        source: '/app/:path*',
        destination: `${BACKEND_URL}/app/:path*`,
      }
    ];
  },
};

export default nextConfig; 