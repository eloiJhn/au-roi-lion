import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activer l'optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
  // Compression Gzip
  compress: process.env.NODE_ENV === 'production',
  // Cache des pages statiques
  staticPageGenerationTimeout: 120,
  // Optimisation pour le référencement
  poweredByHeader: false,
  
  // Configuration des alias de chemin
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(process.cwd(), 'src');
    return config;
  },
  // Configuration pour générer automatiquement le sitemap
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    optimizePackageImports: ['@vercel/analytics', '@vercel/speed-insights'],
  },
  
  // Optimisations SEO supplémentaires
  trailingSlash: false,
  generateEtags: true,
  
  // Configuration pour les redirections SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'production' 
              ? 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800'
              : 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
