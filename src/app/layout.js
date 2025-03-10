import React from 'react';
import './globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';

export const metadata = {
  title: 'Au Roi Lion',
  description: 'Appartement de charme de 60m² du XVIIe siècle au centre historique de Dijon, vue sur l\'église Saint Michel',
  keywords: 'location, Dijon, appartement, charme, centre ville, vacances',
  icons: {
    icon: '/assets/logo-rounded.png', // This will be used as favicon
    apple: '/assets/logo-rounded.png', // For Apple devices
  },
  openGraph: {
    images: ['/assets/logo-rounded.png'], // Fixed the path
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.auroilion.com',
  },
};

// Configuration du cache pour améliorer le TTFB - Format corrigé pour App Router
export function generateHeaders() {
  return {
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
  };
}

// Configuration statique pour améliorer le TTFB
export const dynamic = 'force-static';
export const revalidate = 86400; // 24h

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
    <head>
      {/* DNS Prefetch et Preconnect pour les domaines externes */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon configuration */}
      <link rel="icon" href="/assets/logo.png" />
      <link rel="apple-touch-icon" href="/assets/logo-rounded.png" />
      
      {/* Préchargement des ressources critiques */}
      <link rel="preload" href="/assets/logo-rounded.png" as="image" />
    </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Analytics />
          <SpeedInsights />
          
          {/* Scripts tiers chargés en différé */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" 
            strategy="lazyOnload"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}