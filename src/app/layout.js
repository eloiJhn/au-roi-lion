import React from 'react';
import './globals.css';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';

export const metadata = {
  title: 'Au Roi Lion',
  description: 'Vivez l\'expérience exceptionnelle d\'un séjour dans un appartement du XVIIe siècle. Vue imprenable sur l\'église Saint Michel, décoration raffinée et prestations haut de gamme.',
  keywords: 'location prestige, Dijon, appartement luxe, charme, centre historique, église Saint Michel, 17ème siècle, vacances Bourgogne',
  metadataBase: new URL('https://www.auroilion.com'),
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
    shortcut: '/assets/logo.png',
  },
  alternates: {
    canonical: 'https://www.auroilion.com',
  },
  openGraph: {
    title: 'Au Roi Lion',
    description: 'Vivez comme un roi dans ce somptueux appartement du XVIIe siècle en plein centre historique! Décoration raffinée vert émeraude et or, prestations haut de gamme, vue imprenable sur l\'église Saint Michel. Réservez maintenant!',
    images: [
      {
        url: 'https://www.auroilion.com/assets/logo.png',
        width: 800,
        height: 800,
        alt: 'Logo Au Roi Lion - Lion élégant habillé en costume vert sur fond bleu',
        type: 'image/png'
      }
    ],
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.auroilion.com',
    siteName: 'Au Roi Lion Dijon',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Au Roi Lion | Séjournez dans l\'élégance à Dijon',
    description: 'Un appartement royal où tradition et modernité se rencontrent. Décoré avec goût dans les tons vert émeraude et or, vous tomberez sous le charme dès les premiers instants. Idéal pour découvrir Dijon et la Bourgogne.',
    images: ['https://www.auroilion.com/assets/logo.png'],
    creator: '@AuRoiLion',
  },
  other: {
    'theme-color': '#003E50',
    'msapplication-TileColor': '#003E50',
    'msapplication-TileImage': '/assets/logo.png',
    'application-name': 'Au Roi Lion',
    'apple-mobile-web-app-title': 'Au Roi Lion',
    'og:price:amount': '80',
    'og:price:currency': 'EUR',
    'og:availability': 'instock'
  }
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
      <meta name="theme-color" content="#003E50" />
      <meta name="msapplication-TileColor" content="#003E50" />
      <meta name="msapplication-TileImage" content="/assets/logo.png" />
      <meta name="application-name" content="Au Roi Lion" />
      <meta name="apple-mobile-web-app-title" content="Au Roi Lion" />
      <meta property="og:price:amount" content="80" />
      <meta property="og:price:currency" content="EUR" />
      <meta property="og:availability" content="instock" />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="FR-21" />
      <meta name="geo.placename" content="Dijon" />
      <link rel="canonical" href="https://www.auroilion.com" />
      
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
        {/* Structured data for rich results */}
        <Script id="structured-data" type="application/ld+json" strategy="afterInteraction">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "name": "Au Roi Lion",
              "url": "https://www.auroilion.com",
              "description": "Appartement de luxe du XVIIe siècle au cœur de Dijon avec vue sur l'église Saint Michel",
              "telephone": "+33600000000",
              "priceRange": "€€",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Centre Historique",
                "addressLocality": "Dijon",
                "postalCode": "21000",
                "addressCountry": "FR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "47.322047",
                "longitude": "5.04148"
              },
              "image": "https://www.auroilion.com/assets/logo.png",
              "starRating": {
                "@type": "Rating",
                "ratingValue": "4.8",
                "bestRating": "5"
              }
            }
          `}
        </Script>
      </NextIntlClientProvider>
    </body>
    </html>
  );
}