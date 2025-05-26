import Head from 'next/head';
import { generatePageTitle, generateMetaDescription, generateKeywords } from '../utils/seoOptimizations';

export function SEOHead({
  title,
  description,
  keywords = [],
  image = '/assets/logo.png',
  url = 'https://www.auroilion.com',
  type = 'website',
  structuredData = null,
  noindex = false,
  canonical = null
}) {
  const pageTitle = generatePageTitle(title);
  const metaDescription = generateMetaDescription(description);
  const allKeywords = generateKeywords(keywords);
  const canonicalUrl = canonical || url;

  return (
    <Head>
      {/* Titre de la page */}
      <title>{pageTitle}</title>
      
      {/* Métadonnées de base */}
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      
      {/* URL canonique */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={`https://www.auroilion.com${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Au Roi Lion Dijon" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={`https://www.auroilion.com${image}`} />
      <meta name="twitter:creator" content="@AuRoiLion" />
      
      {/* Données structurées */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      
      {/* Préchargement DNS */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Préconnexion */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
} 