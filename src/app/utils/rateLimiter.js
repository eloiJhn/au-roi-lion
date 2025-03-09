import { Redis } from '@upstash/redis';

// Initialiser Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export function rateLimit(options = {}) {
  const {
    interval = 60 * 1000, // 1 minute par défaut
    uniqueTokenPerInterval = 500,
  } = options;

  // Convertir l'intervalle en secondes pour Redis
  const intervalSeconds = Math.ceil(interval / 1000);

  return {
    check: async (request, limit, token) => {
      // Identifier l'utilisateur (par IP ou token)
      const identifier = token || request.headers.get('x-forwarded-for') || 'anonymous';
      
      // Clé unique pour Redis
      const key = `ratelimit:${identifier}`;
      
      // Récupérer le compteur actuel
      let currentRequests = await redis.get(key);
      
      // Première requête
      if (!currentRequests) {
        await redis.set(key, 1, { ex: intervalSeconds });
        return;
      }
      
      currentRequests = parseInt(currentRequests, 10);
      
      // Vérifier la limite
      if (currentRequests >= limit) {
        throw new Error('Too Many Requests');
      }
      
      // Incrémenter le compteur
      await redis.incr(key);
      
      return;
    }
  };
}