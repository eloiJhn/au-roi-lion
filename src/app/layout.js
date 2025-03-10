import React from 'react';
import './globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';

// Configuration des métadonnées pour le SEO
export const metadata = {
  title: 'Au Roi Lion - Location de charme au cœur de Dijon',
  description: 'Appartement de charme de 60m² du XVIIe siècle au centre historique de Dijon, vue sur l\'église Saint Michel',
  keywords: 'location, Dijon, appartement, charme, centre ville, vacances, église Saint Michel',
  openGraph: {
    images: ['/assets/og-image.jpg'],
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.auroilion.com',
    title: 'Au Roi Lion - Location à Dijon',
    description: 'Appartement de charme de 60m² du XVIIe siècle au centre historique de Dijon'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Au Roi Lion - Location à Dijon',
    description: 'Appartement de charme au centre historique de Dijon',
    images: ['/assets/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.auroilion.com',
    languages: {
      'en': 'https://www.auroilion.com/en',
      'fr': 'https://www.auroilion.com'
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Configuration du cache pour améliorer le TTFB
export const headers = () => {
  return [
    {
      source: '/((?!api).*)',  // Applique à toutes les routes sauf les API
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        },
      ],
    },
  ];
};

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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Préchargement des ressources critiques */}
        <link rel="preload" href="/assets/logo.png" as="image" />
        <link rel="preload" href="/assets/couloir.jpeg" as="image" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          
          {/* Analytics et mesures de performance chargés de manière optimale */}
          <Analytics />
          <SpeedInsights />
          
          {/* Scripts tiers chargés en différé pour ne pas bloquer le rendu */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" 
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXX');
            `}
          </Script>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}