import React from 'react';
import './globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';

export const metadata = {
  title: 'Au Roi Lion - Appartement de charme à Dijon',
  description: 'Magnifique appartement de charme de 60m² du XVIIe siècle au centre historique de Dijon, vue sur l\'église Saint Michel',
  keywords: 'location, Dijon, appartement, charme, centre ville, vacances, église Saint Michel, 17ème siècle',
  metadataBase: new URL('https://www.auroilion.com'),
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
    shortcut: '/assets/logo.png',
  },
  openGraph: {
    title: 'Au Roi Lion - Appartement de charme à Dijon',
    description: 'Magnifique appartement de charme de 60m² du XVIIe siècle au centre historique de Dijon, vue sur l\'église Saint Michel',
    images: [
      {
        url: '/assets/salon2.jpeg',
        width: 1200,
        height: 630,
        alt: 'Intérieur de l\'appartement Au Roi Lion à Dijon',
      }
    ],
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.auroilion.com',
    siteName: 'Au Roi Lion Dijon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Au Roi Lion - Appartement de charme à Dijon',
    description: 'Magnifique appartement de charme de 60m² du XVIIe siècle au centre historique de Dijon',
    images: ['/assets/salon2.jpeg'],
    creator: '@AuRoiLion',
  },
};

export function generateHeaders() {
  return {
    'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
  };
}

export const dynamic = 'force-static';
export const revalidate = 86400; // 24h

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      <link rel="icon" href="/assets/logo.png" sizes="any" />
      <link rel="shortcut icon" href="/assets/logo.png" />
      <link rel="apple-touch-icon" href="/assets/logo.png" />
      
      {/* Preload critical assets */}
      <link rel="preload" href="/assets/logo.png" as="image" />
    </head>
    <body>
      <NextIntlClientProvider messages={messages}>
        {children}
        
        {/* Différer le chargement des outils d'analyse */}
        <Analytics strategy="afterInteraction" />
        <SpeedInsights strategy="afterInteraction" />
        
        {/* Utiliser defer pour différer le chargement du script Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" 
          strategy="afterInteraction"
          defer
        />
      </NextIntlClientProvider>
    </body>
    </html>
  );
}