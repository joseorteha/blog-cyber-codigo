const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: false,

    // Permitir cualquier dominio en desarrollo
    ...(process.env.NODE_ENV !== 'production'
      ? {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: '**',
              port: '',
              pathname: '/**',
            },
          ],
        }
      : {
          // Dominios permitidos en producción
          remotePatterns: [
            { protocol: 'https', hostname: 'cdn.abacus.ai', port: '', pathname: '/images/**' },
            { protocol: 'https', hostname: '*.supabase.co', port: '', pathname: '/storage/**' },
            { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'source.unsplash.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'akm-img-a-in.tosshub.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.tosshub.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'i0.wp.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.wp.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'cdn.cnn.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.cnn.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'techcrunch.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.techcrunch.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'theverge.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.theverge.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'wired.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.wired.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'arstechnica.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.arstechnica.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'engadget.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.engadget.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'gizmodo.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.gizmodo.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'media.kasperskydaily.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'media.kasperskycontenthub.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 'static01.nyt.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.bbc.co.uk', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.bbc.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: 's.yimg.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.yahoo.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.mzstatic.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.medium.com', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.futurecdn.net', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.cdn.sanity.io', port: '', pathname: '/**' },
            { protocol: 'https', hostname: '*.scdn.co', port: '', pathname: '/**' },
          ],
        }),

    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
