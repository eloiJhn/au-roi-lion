// Utilitaires pour l'optimisation SEO

export const generatePageTitle = (pageTitle, siteName = 'Au Roi Lion Dijon') => {
  if (!pageTitle) return `${siteName} - Appartement de Luxe XVIIe siècle à Dijon`;
  return `${pageTitle} | ${siteName}`;
};

export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) {
    return 'Vivez l\'expérience exceptionnelle d\'un séjour dans un appartement du XVIIe siècle. Vue imprenable sur l\'église Saint Michel, décoration raffinée et prestations haut de gamme.';
  }
  
  if (content.length <= maxLength) return content;
  
  return content.substring(0, maxLength - 3).trim() + '...';
};

export const generateKeywords = (additionalKeywords = []) => {
  const baseKeywords = [
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
  ];
  
  return [...baseKeywords, ...additionalKeywords];
};

export const generateStructuredData = (type, data) => {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };
  
  return JSON.stringify(baseStructuredData);
};

export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return generateStructuredData('BreadcrumbList', {
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  });
};

export const generateFAQStructuredData = (faqs) => {
  return generateStructuredData('FAQPage', {
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  });
};

export const generateReviewStructuredData = (reviews) => {
  return generateStructuredData('Product', {
    name: 'Au Roi Lion - Appartement de Luxe',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: reviews.length.toString(),
      bestRating: '5',
      worstRating: '1'
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1'
      },
      reviewBody: review.text,
      datePublished: review.date
    }))
  });
};

// Fonction pour optimiser les images pour le SEO
export const optimizeImageForSEO = (src, alt, context = '') => {
  const baseAlt = alt || '';
  const contextualAlt = context ? `${baseAlt} - ${context}` : baseAlt;
  
  return {
    src,
    alt: contextualAlt,
    loading: 'lazy',
    decoding: 'async',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  };
};

// Fonction pour générer des URLs canoniques
export const generateCanonicalUrl = (path = '', baseUrl = 'https://www.auroilion.com') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

// Fonction pour générer des balises hreflang
export const generateHreflangTags = (currentPath = '', supportedLocales = ['fr', 'en', 'de']) => {
  const baseUrl = 'https://www.auroilion.com';
  
  return supportedLocales.map(locale => ({
    hreflang: locale,
    href: `${baseUrl}/${locale}${currentPath}`
  }));
};

// Fonction pour optimiser le contenu textuel pour le SEO
export const optimizeTextForSEO = (text, keywords = []) => {
  if (!text || !keywords.length) return text;
  
  let optimizedText = text;
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (!regex.test(optimizedText)) {
      // Ajouter le mot-clé de manière naturelle si absent
      optimizedText = `${optimizedText} ${keyword}`;
    }
  });
  
  return optimizedText;
}; 