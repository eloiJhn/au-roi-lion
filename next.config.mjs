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
  // Configuration du cache
  
  // Configuration des alias de chemin
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(process.cwd(), 'src');
    return config;
  },
};

export default withNextIntl(nextConfig);
