import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export function rateLimit(options = {}) {
  const {
    interval = 60 * 1000, 
    uniqueTokenPerInterval = 500,
  } = options;

  const intervalSeconds = Math.ceil(interval / 1000);

  return {
    check: async (request, limit, token) => {
      const identifier = token || request.headers.get('x-forwarded-for') || 'anonymous';
      
      const key = `ratelimit:${identifier}`;
      
      let currentRequests = await redis.get(key);
      
      if (!currentRequests) {
        await redis.set(key, 1, { ex: intervalSeconds });
        return;
      }
      
      currentRequests = parseInt(currentRequests, 10);
      
      if (currentRequests >= limit) {
        throw new Error('Too Many Requests');
      }
            await redis.incr(key);
      
      return;
    }
  };
}