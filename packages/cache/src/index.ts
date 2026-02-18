import Redis from 'ioredis';

/**
 * Redis Cache Layer
 * Provides caching utilities with TTL support and pattern-based invalidation
 */

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_URL?.split(':')[0] || 'localhost',
  port: parseInt(process.env.REDIS_URL?.split(':')[1]) || 6379,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
  lazyConnect: true,
};

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('reconnecting', () => {
  console.log('Redis reconnecting...');
});

/**
 * Cache utility object
 * Provides type-safe caching operations
 */
export const cache = {
  /**
   * Get a value from cache
   * @param key - Cache key
   * @returns Parsed value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set a value in cache
   * @param key - Cache key
   * @param value - Value to cache (will be JSON serialized)
   * @param ttl - Time to live in seconds (default: 3600 = 1 hour)
   */
  async set(key: string, value: unknown, ttl = 3600): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  /**
   * Delete a specific key from cache
   * @param key - Cache key to delete
   */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  },

  /**
   * Check if a key exists in cache
   * @param key - Cache key
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },

  /**
   * Get remaining TTL for a key
   * @param key - Cache key
   * @returns TTL in seconds, -1 if no TTL, -2 if key doesn't exist
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error('Cache TTL error:', error);
      return -2;
    }
  },

  /**
   * Increment a counter value
   * @param key - Cache key
   * @param amount - Amount to increment (default: 1)
   */
  async increment(key: string, amount = 1): Promise<number> {
    try {
      return await redis.incrby(key, amount);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  },

  /**
   * Decrement a counter value
   * @param key - Cache key
   * @param amount - Amount to decrement (default: 1)
   */
  async decrement(key: string, amount = 1): Promise<number> {
    try {
      return await redis.decrby(key, amount);
    } catch (error) {
      console.error('Cache decrement error:', error);
      return 0;
    }
  },

  /**
   * Set a value with expiry only if key doesn't exist
   * @param key - Cache key
   * @param value - Value to set
   * @param ttl - Time to live in seconds
   * @returns true if set, false if key already exists
   */
  async setNX(key: string, value: unknown, ttl: number): Promise<boolean> {
    try {
      const result = await redis.set(key, JSON.stringify(value), 'EX', ttl, 'NX');
      return result === 'OK';
    } catch (error) {
      console.error('Cache setNX error:', error);
      return false;
    }
  },

  /**
   * Get multiple values at once
   * @param keys - Array of cache keys
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const data = await redis.mget(keys);
      return data.map(item => item ? JSON.parse(item) : null);
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  },

  /**
   * Set multiple values at once
   * @param entries - Object with key-value pairs
   * @param ttl - Time to live in seconds
   */
  async mset(entries: Record<string, unknown>, ttl: number): Promise<void> {
    try {
      const pipeline = redis.pipeline();
      Object.entries(entries).forEach(([key, value]) => {
        pipeline.setex(key, ttl, JSON.stringify(value));
      });
      await pipeline.exec();
    } catch (error) {
      console.error('Cache mset error:', error);
    }
  },

  /**
   * Invalidate all keys matching a pattern
   * @param pattern - Redis pattern (e.g., "tools:*", "user:123:*")
   */
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        return keys.length;
      }
      return 0;
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
      return 0;
    }
  },

  /**
   * Clear entire cache (use with caution!)
   */
  async flushAll(): Promise<void> {
    try {
      await redis.flushall();
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  },

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connected: boolean;
    usedMemory?: string;
    totalKeys?: number;
    hitRate?: number;
  }> {
    try {
      const info = await redis.info('memory');
      const dbsize = await redis.dbsize();
      
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      
      return {
        connected: redis.status === 'ready',
        usedMemory: memoryMatch ? memoryMatch[1].trim() : undefined,
        totalKeys: dbsize,
      };
    } catch (error) {
      return { connected: false };
    }
  },

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    await redis.quit();
  },
};

/**
 * Cache key generators
 * Centralized key naming convention
 */
export const cacheKeys = {
  // Tool-related keys
  tool: (slug: string) => `tool:${slug}`,
  toolList: (category?: string) => `tools:list:${category || 'all'}`,
  toolCategories: () => 'tools:categories',
  toolSearch: (query: string) => `tools:search:${query.toLowerCase()}`,
  
  // Blog-related keys
  blogPost: (slug: string) => `blog:${slug}`,
  blogList: (page: number, limit: number) => `blog:list:${page}:${limit}`,
  blogCategories: () => 'blog:categories',
  blogTags: () => 'blog:tags',
  
  // Analytics keys
  analytics: (period: string) => `analytics:${period}`,
  toolUsage: (toolId: string, period: string) => `usage:${toolId}:${period}`,
  popularTools: () => 'tools:popular',
  
  // User-related keys
  user: (userId: string) => `user:${userId}`,
  userSession: (sessionId: string) => `session:${sessionId}`,
  userSettings: (userId: string) => `user:${userId}:settings`,
  
  // Admin keys
  adminDashboard: () => 'admin:dashboard',
  adminStats: (period: string) => `admin:stats:${period}`,
  
  // AI-related keys
  aiRateLimit: (userId: string) => `ai:ratelimit:${userId}`,
  aiCache: (prompt: string) => `ai:cache:${Buffer.from(prompt).toString('base64').slice(0, 32)}`,
  
  // SEO keys
  sitemap: () => 'seo:sitemap',
  robotsTxt: () => 'seo:robots',
  metaTags: (path: string) => `seo:meta:${path}`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const cacheTTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 3600,       // 1 hour
  DAY: 86400,       // 24 hours
  WEEK: 604800,     // 7 days
};

/**
 * Memoization wrapper for async functions
 * Automatically caches function results
 */
export function memoize<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = cacheTTL.HOUR
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const cacheKey = keyGenerator(...args);
    const cached = await cache.get<ReturnType<T>>(cacheKey);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = await fn(...args);
    await cache.set(cacheKey, result, ttl);
    return result;
  }) as T;
}

/**
 * Cache decorator for methods
 * Can be used with class methods
 */
export function cached(ttl: number = cacheTTL.HOUR, keyPrefix?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyPrefix 
        ? `${keyPrefix}:${args.join(':')}`
        : `${target.constructor.name}:${propertyKey}:${args.join(':')}`;
      
      const cached = await cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }
      
      const result = await originalMethod.apply(this, args);
      await cache.set(cacheKey, result, ttl);
      return result;
    };
    
    return descriptor;
  };
}

export { redis };
export default cache;
