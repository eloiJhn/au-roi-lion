import { NextResponse } from 'next/server';

export function middleware(request) {
  // Récupérer la réponse
  const response = NextResponse.next();

  // Déterminer si nous sommes en production
  const isProduction = process.env.NODE_ENV === 'production';

  // Headers de sécurité
  const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };

  // CSP différente pour production et développement
  if (isProduction) {
    // CSP plus stricte en production
    securityHeaders['Content-Security-Policy'] = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://*.vercel-scripts.com https://*.vercel-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://*.vercel-scripts.com https://*.vercel-insights.com https://va.vercel-analytics.com;
      frame-src 'self' https://www.google.com/recaptcha/;
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim();
  } else {
    // CSP plus permissive en développement
    securityHeaders['Content-Security-Policy'] = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https:;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: http: https:;
      font-src 'self' data: http: https:;
      connect-src 'self' http: https:;
      frame-src 'self' http: https:;
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim();
  }

  // Ajouter les headers à la réponse
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}; 