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
    icon: '/logo.ico', // Mettre à jour ici
    apple: '/logo.ico', // Et ici
    shortcut: '/logo.ico', // Ajouter cette ligne aussi
  },
  openGraph: {
    images: ['/logo.ico'],
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.auroilion.com',
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
      
      <link rel="icon" href="/logo.ico" />
      <link rel="shortcut icon" href="/logo.ico" />
      <link rel="apple-touch-icon" href="/logo.ico" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Analytics />
          <SpeedInsights />
          
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" 
            strategy="lazyOnload"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}