import { LRUCache } from 'lru-cache';

const rateLimit = (options) => {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (request, limit, token) =>
      new Promise((resolve, reject) => {
        let tokenCount = tokenCache.get(token) || [0];
        
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage > limit;


        if (isRateLimited) {
          reject(new Error('Too Many Requests'));
        } else {
          resolve();
        }
      }),
  };
};

export { rateLimit };
