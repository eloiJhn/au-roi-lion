import { Redis } from '@upstash/redis';
import { logger } from './logger';

// Fallback local rate limiter using Map
class LocalRateLimiter {
  constructor(interval) {
    this.requests = new Map();
    this.interval = interval;
  }

  async check(identifier, limit) {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Clean old requests
    const validRequests = userRequests.filter(time => now - time < this.interval);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

let redis;
let localLimiter;
let useLocalLimiter = false;

try {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
} catch (error) {
  logger.warn("Failed to initialize Redis, falling back to local rate limiter", { error: error.message });
  useLocalLimiter = true;
}

export function rateLimit(options = {}) {
  const {
    interval = 60 * 1000, 
    uniqueTokenPerInterval = 500,
  } = options;

  const intervalSeconds = Math.ceil(interval / 1000);

  if (!localLimiter) {
    localLimiter = new LocalRateLimiter(interval);
  }

  return {
    check: async (request, limit, token) => {
      try {
        const identifier = token || request.headers.get('x-forwarded-for') || 'anonymous';
        
        if (useLocalLimiter) {
          logger.debug("Using local rate limiter", { identifier });
          const allowed = await localLimiter.check(identifier, limit);
          if (!allowed) {
            throw new Error('Too Many Requests');
          }
          return;
        }

        const key = `ratelimit:${identifier}`;
        
        try {
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
        } catch (redisError) {
          logger.warn("Redis operation failed, falling back to local rate limiter", { 
            error: redisError.message,
            identifier 
          });
          
          // Fallback to local limiter on Redis failure
          useLocalLimiter = true;
          const allowed = await localLimiter.check(identifier, limit);
          if (!allowed) {
            throw new Error('Too Many Requests');
          }
        }
      } catch (error) {
        if (error.message === 'Too Many Requests') {
          throw error;
        }
        logger.error("Rate limit check error", { 
          error: error.message,
          stack: error.stack 
        });
        // En cas d'erreur, on laisse passer la requête
        return;
      }
    }
  };
}