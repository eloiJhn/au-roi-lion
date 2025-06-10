// Optimisations de performance pour améliorer le SEO
import { logger } from './logger';

export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  const criticalResources = [
    { href: '/assets/logo.png', as: 'image', type: 'image/png' },
    { href: '/assets/salon.jpeg', as: 'image', type: 'image/jpeg' },
    { href: '/assets/chambre.jpeg', as: 'image', type: 'image/jpeg' },
    { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) link.type = resource.type;
    if (resource.as === 'style') link.onload = function() { this.rel = 'stylesheet'; };
    document.head.appendChild(link);
  });
};

export const optimizeImageLoading = () => {
  if (typeof window === 'undefined') return;

  // Lazy loading natif pour les navigateurs qui le supportent
  const images = document.querySelectorAll('img[data-src]');
  
  if ('loading' in HTMLImageElement.prototype) {
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else {
    // Fallback avec Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  }
};

export const optimizeScriptLoading = () => {
  if (typeof window === 'undefined') return;

  // Différer les scripts non critiques
  const deferredScripts = [
    'https://www.googletagmanager.com/gtag/js',
    // Ajoutez d'autres scripts non critiques ici
  ];

  deferredScripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  });
};

export const optimizeFonts = () => {
  if (typeof window === 'undefined') return;

  // Précharger les polices critiques
  const fontPreloads = [
    { href: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', type: 'font/woff2' },
  ];

  fontPreloads.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font.href;
    link.as = 'font';
    link.type = font.type;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

export const optimizeCSS = () => {
  if (typeof window === 'undefined') return;

  // Charger le CSS critique en inline et différer le reste
  const criticalCSS = `
    /* CSS critique pour le above-the-fold */
    body { font-family: Inter, sans-serif; margin: 0; padding: 0; }
    .header { position: relative; z-index: 1000; }
    .hero-section { min-height: 50vh; }
    .loading { opacity: 0; transition: opacity 0.3s ease; }
    .loaded { opacity: 1; }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

export const enableResourceHints = () => {
  if (typeof window === 'undefined') return;

  const resourceHints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'dns-prefetch', href: '//vercel.live' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  ];

  resourceHints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
    document.head.appendChild(link);
  });
};

export const optimizeServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  // Enregistrer un service worker pour la mise en cache
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      logger.info('Service Worker enregistré', { registration });
    })
    .catch(error => {
      logger.warn('Erreur Service Worker', { error });
    });
};

export const measurePerformance = () => {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  // Mesurer les métriques de performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const metrics = {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        request: perfData.responseStart - perfData.requestStart,
        response: perfData.responseEnd - perfData.responseStart,
        dom: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        load: perfData.loadEventEnd - perfData.loadEventStart,
        total: perfData.loadEventEnd - perfData.navigationStart
      };

      // Envoyer les métriques à votre service d'analytics
      if (window.gtag) {
        Object.entries(metrics).forEach(([key, value]) => {
          window.gtag('event', 'timing_complete', {
            name: key,
            value: Math.round(value)
          });
        });
      }
    }, 0);
  });
};

// Fonction principale d'initialisation
export const initPerformanceOptimizations = () => {
  if (typeof window === 'undefined') return;

  // Exécuter les optimisations dans l'ordre approprié
  enableResourceHints();
  preloadCriticalResources();
  optimizeFonts();
  optimizeCSS();
  
  // Optimisations après le chargement initial
  window.addEventListener('DOMContentLoaded', () => {
    optimizeImageLoading();
    optimizeScriptLoading();
  });

  // Optimisations après le chargement complet
  window.addEventListener('load', () => {
    optimizeServiceWorker();
    measurePerformance();
  });
}; 