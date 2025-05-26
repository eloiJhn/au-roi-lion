// Optimisations pour les Core Web Vitals

export function reportWebVitals(metric) {
  // Envoyer les métriques à votre service d'analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
  
  // Log pour le développement
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
}

// Optimisation du Largest Contentful Paint (LCP)
export const optimizeLCP = () => {
  // Précharger les images critiques
  const criticalImages = [
    '/assets/logo.png',
    '/assets/salon.jpeg',
    '/assets/chambre.jpeg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

// Optimisation du First Input Delay (FID)
export const optimizeFID = () => {
  // Différer les scripts non critiques
  const deferScripts = () => {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      script.defer = true;
    });
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferScripts);
  } else {
    deferScripts();
  }
};

// Optimisation du Cumulative Layout Shift (CLS)
export const optimizeCLS = () => {
  // Définir des dimensions explicites pour les images
  const images = document.querySelectorAll('img:not([width]):not([height])');
  images.forEach(img => {
    img.addEventListener('load', function() {
      if (!this.width || !this.height) {
        this.style.aspectRatio = `${this.naturalWidth} / ${this.naturalHeight}`;
      }
    });
  });
  
  // Réserver de l'espace pour le contenu dynamique
  const dynamicContent = document.querySelectorAll('[data-dynamic]');
  dynamicContent.forEach(element => {
    element.style.minHeight = element.dataset.minHeight || '200px';
  });
};

// Optimisation générale des performances
export const optimizePerformance = () => {
  // Lazy loading pour les images non critiques
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-lazy]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // Préconnexion aux domaines externes
  const externalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com'
  ];
  
  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Fonction d'initialisation à appeler au chargement de la page
export const initWebVitalsOptimizations = () => {
  if (typeof window !== 'undefined') {
    optimizeLCP();
    optimizeFID();
    optimizeCLS();
    optimizePerformance();
  }
}; 