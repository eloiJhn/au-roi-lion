import React from 'react';
import './globals.css';
import { NextIntlClientProvider } from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from 'next/script';
import ClientThemeProvider from './ClientThemeProvider';

export const metadata = {
  title: {
    default: 'Au Roi Lion',
    template: '%s | Au Roi Lion Dijon'
  },
  description: 'Vivez l\'expérience exceptionnelle d\'un séjour dans un appartement du XVIIe siècle. Vue imprenable sur l\'église Saint Michel, décoration raffinée et prestations haut de gamme.',
  keywords: [
    'location prestige Dijon',
    'appartement luxe Dijon',
    'centre historique Dijon',
    'église Saint Michel',
    '17ème siècle',
    'vacances Bourgogne',
    'hébergement de charme',
    'Airbnb Dijon',
    'Booking Dijon',
    'location courte durée',
    'appartement historique',
    'Dijon tourisme',
    'Bourgogne séjour',
    'location meublée Dijon'
  ],
  authors: [{ name: 'Au Roi Lion' }],
  creator: 'Au Roi Lion',
  publisher: 'Au Roi Lion',
  metadataBase: new URL('https://www.auroilion.com'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/assets/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/logo.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/assets/logo.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/assets/logo.png',
  },
  alternates: {
    canonical: 'https://www.auroilion.com',
    languages: {
      'fr': 'https://www.auroilion.com/fr',
      'en': 'https://www.auroilion.com/en',
      'de': 'https://www.auroilion.com/de',
    },
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
    <html lang={locale} suppressHydrationWarning>
    <head>
      <meta name="theme-color" content="#003E50" />
      <meta name="msapplication-TileColor" content="#003E50" />
      <meta name="msapplication-TileImage" content="/assets/logo.png" />
      <meta name="application-name" content="Au Roi Lion" />
      <meta name="apple-mobile-web-app-title" content="Au Roi Lion" />
      <meta property="og:price:amount" content="80" />
      <meta property="og:price:currency" content="EUR" />
      <meta property="og:availability" content="instock" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      <meta name="geo.region" content="FR-21" />
      <meta name="geo.placename" content="Dijon" />
      <meta name="geo.position" content="47.322047;5.04148" />
      <meta name="ICBM" content="47.322047, 5.04148" />
      <meta name="DC.title" content="Au Roi Lion - Appartement de Luxe à Dijon" />
      <meta name="DC.creator" content="Au Roi Lion" />
      <meta name="DC.subject" content="Location appartement luxe Dijon" />
      <meta name="DC.description" content="Appartement de prestige du XVIIe siècle à Dijon" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="fr" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="canonical" href="https://www.auroilion.com" />
      <link rel="alternate" hrefLang="fr" href="https://www.auroilion.com/fr" />
      <link rel="alternate" hrefLang="en" href="https://www.auroilion.com/en" />
      <link rel="alternate" hrefLang="de" href="https://www.auroilion.com/de" />
      <link rel="alternate" hrefLang="x-default" href="https://www.auroilion.com" />
      <link rel="alternate" type="application/rss+xml" title="Au Roi Lion RSS Feed" href="https://www.auroilion.com/feed.xml" />
      
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      <link rel="icon" href="/assets/logo.png" sizes="any" />
      <link rel="shortcut icon" href="/assets/logo.png" />
      <link rel="apple-touch-icon" href="/assets/logo.png" />
      
      {/* Preload critical assets */}
      <link rel="preload" href="/assets/logo.png" as="image" />
      
      {/* Style initial pour éviter le flash */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Style initial pour éviter le flash de thème */
          html {
            background-color: #fff;
            color: #333;
          }
          
          /* Si l'utilisateur préfère le mode sombre */
          @media (prefers-color-scheme: dark) {
            html:not(.light-mode) {
              background-color: #121212 !important;
              color: #e0e0e0 !important;
            }
            html:not(.light-mode) body {
              background-color: #121212 !important;
              color: #e0e0e0 !important;
            }
          }
          
          /* Styles pour les classes appliquées par JavaScript */
          html.dark-mode {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
          }
          html.dark-mode body {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
          }
          
          html.light-mode {
            background-color: #fff !important;
            color: #333 !important;
          }
          html.light-mode body {
            background-color: #fff !important;
            color: #333 !important;
          }
        `
      }} />
      
      {/* Script pour prévenir le flash de contenu en mode sombre */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Vérifier si le thème est dans le localStorage
                var storedTheme = localStorage.getItem('theme');
                var htmlElement = document.documentElement;
                
                // Fonction pour appliquer le thème sombre
                function enableDarkMode() {
                  htmlElement.classList.add('dark-mode');
                  htmlElement.classList.remove('light-mode');
                  document.body.style.backgroundColor = '#121212';
                  document.body.style.color = '#e0e0e0';
                }
                
                // Fonction pour appliquer le thème clair
                function disableDarkMode() {
                  htmlElement.classList.remove('dark-mode');
                  htmlElement.classList.add('light-mode');
                  document.body.style.backgroundColor = '';
                  document.body.style.color = '';
                }
                
                if (storedTheme === 'dark') {
                  enableDarkMode();
                } else if (storedTheme === 'light') {
                  disableDarkMode();
                } else {
                  // Sinon, utiliser les préférences du système
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    enableDarkMode();
                  } else {
                    disableDarkMode();
                  }
                }
              } catch (e) {
                // En cas d'erreur (par exemple en SSR), ne rien faire
                console.error('Error applying theme:', e);
              }
            })();
          `,
        }}
      />
    </head>
    <body>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ClientThemeProvider>
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
              [
                {
                  "@context": "https://schema.org",
                  "@type": "LodgingBusiness",
                  "name": "Au Roi Lion",
                  "url": "https://www.auroilion.com",
                  "description": "Appartement de luxe du XVIIe siècle au cœur de Dijon avec vue sur l'église Saint Michel",
                  "telephone": "+33600000000",
                  "priceRange": "€€€",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Centre Historique",
                    "addressLocality": "Dijon",
                    "postalCode": "21000",
                    "addressCountry": "FR",
                    "addressRegion": "Bourgogne-Franche-Comté"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "47.322047",
                    "longitude": "5.04148"
                  },
                  "image": [
                    "https://www.auroilion.com/assets/logo.png",
                    "https://www.auroilion.com/assets/salon.jpeg",
                    "https://www.auroilion.com/assets/chambre.jpeg"
                  ],
                  "starRating": {
                    "@type": "Rating",
                    "ratingValue": "4.8",
                    "bestRating": "5",
                    "worstRating": "1"
                  },
                  "amenityFeature": [
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Vue sur église Saint Michel",
                      "value": true
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Appartement historique XVIIe siècle",
                      "value": true
                    },
                    {
                      "@type": "LocationFeatureSpecification",
                      "name": "Centre historique",
                      "value": true
                    }
                  ],
                  "checkinTime": "15:00",
                  "checkoutTime": "11:00",
                  "petsAllowed": false,
                  "smokingAllowed": false
                },
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "Au Roi Lion",
                  "url": "https://www.auroilion.com",
                  "description": "Location d'appartement de luxe à Dijon",
                  "inLanguage": ["fr", "en", "de"],
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.auroilion.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "Au Roi Lion",
                  "url": "https://www.auroilion.com",
                  "logo": "https://www.auroilion.com/assets/logo.png",
                  "description": "Spécialiste de la location d'appartements de prestige à Dijon",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Dijon",
                    "addressCountry": "FR"
                  },
                  "sameAs": [
                    "https://www.airbnb.fr/rooms/1020299057539782769",
                    "https://www.booking.com/hotel/fr/au-roi-lion-place-saint-michel.fr.html"
                  ]
                }
              ]
            `}
          </Script>
        </ClientThemeProvider>
      </NextIntlClientProvider>
    </body>
    </html>
  );
}