// Optimiseur Open Graph pour différents types de contenu

export const generateOpenGraphTags = (pageType, data = {}) => {
  const baseUrl = 'https://www.auroilion.com';
  const defaultImage = `${baseUrl}/assets/logo.png`;
  
  const baseOG = {
    site_name: 'Au Roi Lion Dijon',
    locale: 'fr_FR',
    type: 'website',
  };

  switch (pageType) {
    case 'homepage':
      return {
        ...baseOG,
        title: 'Au Roi Lion - Appartement de Luxe XVIIe siècle à Dijon | Location Prestige',
        description: 'Vivez comme un roi dans ce somptueux appartement du XVIIe siècle en plein centre historique! Décoration raffinée vert émeraude et or, prestations haut de gamme, vue imprenable sur l\'église Saint Michel. Réservez maintenant!',
        url: baseUrl,
        image: {
          url: defaultImage,
          width: 800,
          height: 800,
          alt: 'Logo Au Roi Lion - Lion élégant habillé en costume vert sur fond bleu',
          type: 'image/png'
        },
        // Propriétés spécifiques pour les locations
        'property:rental:price:amount': '80',
        'property:rental:price:currency': 'EUR',
        'property:rental:availability': 'available',
        'property:rental:category': 'luxury apartment',
      };

    case 'gallery':
      return {
        ...baseOG,
        title: 'Galerie Photos - Appartement Au Roi Lion Dijon',
        description: 'Découvrez en images notre magnifique appartement du XVIIe siècle. Décoration raffinée, vue sur l\'église Saint Michel, prestations de luxe.',
        url: `${baseUrl}/galerie`,
        image: {
          url: data.image || `${baseUrl}/assets/salon.jpeg`,
          width: 1200,
          height: 630,
          alt: data.imageAlt || 'Galerie photos de l\'appartement Au Roi Lion',
          type: 'image/jpeg'
        },
        type: 'article',
      };

    case 'booking':
      return {
        ...baseOG,
        title: 'Réservation - Au Roi Lion Dijon | Appartement de Luxe',
        description: 'Réservez votre séjour dans notre appartement de prestige. Disponibilités en temps réel, réservation sécurisée.',
        url: `${baseUrl}/reservation`,
        image: {
          url: defaultImage,
          width: 800,
          height: 800,
          alt: 'Réservation Au Roi Lion - Appartement de luxe à Dijon',
          type: 'image/png'
        },
        type: 'website',
      };

    case 'contact':
      return {
        ...baseOG,
        title: 'Contact - Au Roi Lion Dijon | Informations et Réservations',
        description: 'Contactez-nous pour toute question sur notre appartement de luxe à Dijon. Réponse rapide garantie.',
        url: `${baseUrl}/contact`,
        image: {
          url: defaultImage,
          width: 800,
          height: 800,
          alt: 'Contact Au Roi Lion Dijon',
          type: 'image/png'
        },
      };

    default:
      return {
        ...baseOG,
        title: data.title || 'Au Roi Lion - Appartement de Luxe à Dijon',
        description: data.description || 'Découvrez notre appartement de prestige du XVIIe siècle au cœur de Dijon.',
        url: data.url || baseUrl,
        image: {
          url: data.image || defaultImage,
          width: 800,
          height: 800,
          alt: data.imageAlt || 'Au Roi Lion - Appartement de luxe à Dijon',
          type: 'image/png'
        },
      };
  }
};

export const generateTwitterCardTags = (pageType, data = {}) => {
  const baseUrl = 'https://www.auroilion.com';
  const defaultImage = `${baseUrl}/assets/logo.png`;

  const baseTW = {
    card: 'summary_large_image',
    site: '@AuRoiLion',
    creator: '@AuRoiLion',
  };

  switch (pageType) {
    case 'homepage':
      return {
        ...baseTW,
        title: 'Au Roi Lion | Séjournez dans l\'élégance à Dijon',
        description: 'Un appartement royal où tradition et modernité se rencontrent. Décoré avec goût dans les tons vert émeraude et or, vous tomberez sous le charme dès les premiers instants. Idéal pour découvrir Dijon et la Bourgogne.',
        image: defaultImage,
      };

    case 'gallery':
      return {
        ...baseTW,
        title: 'Galerie Photos - Au Roi Lion Dijon',
        description: 'Découvrez la beauté de notre appartement historique en images. Chaque détail raconte une histoire.',
        image: data.image || `${baseUrl}/assets/salon.jpeg`,
      };

    default:
      return {
        ...baseTW,
        title: data.title || 'Au Roi Lion - Appartement de Luxe à Dijon',
        description: data.description || 'Découvrez notre appartement de prestige du XVIIe siècle.',
        image: data.image || defaultImage,
      };
  }
};

// Fonction pour générer les métadonnées complètes selon le type de page
export const generatePageMetadata = (pageType, customData = {}) => {
  const ogTags = generateOpenGraphTags(pageType, customData);
  const twitterTags = generateTwitterCardTags(pageType, customData);

  return {
    openGraph: ogTags,
    twitter: twitterTags,
    // Ajout d'autres métadonnées spécifiques
    robots: customData.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: ogTags.url,
    },
  };
}; 