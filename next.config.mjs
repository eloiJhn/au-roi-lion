import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Activer l'optimisation des images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
  // Optimisation du JavaScript
  swcMinify: true,
  // Compression Gzip
  compress: process.env.NODE_ENV === 'production',
  // Cache des pages statiques
  staticPageGenerationTimeout: 120,
  // Optimisation des polices
  optimizeFonts: true,
  // Configuration du cache
};

export default withNextIntl(nextConfig);
