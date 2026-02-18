import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

/**
 * Rate Limiter Configuration
 * Provides Redis-backed rate limiting for various endpoints
 */

// Initialize Redis client with error handling
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false,
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('Rate limiter connected to Redis');
});

/**
 * General API rate limiter
 * 100 requests per minute per IP
 */
export const apiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'api_limit',
  points: 100,
  duration: 60,
  blockDuration: 60,
});

/**
 * Auth specific rate limiter
 * 5 attempts per 15 minutes per IP
 */
export const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'auth_limit',
  points: 5,
  duration: 900, // 15 minutes
  blockDuration: 900,
});

/**
 * Tool execution rate limiter
 * 30 executions per minute per user/IP
 */
export const toolLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'tool_limit',
  points: 30,
  duration: 60,
  blockDuration: 60,
});

/**
 * Admin operations rate limiter
 * 50 admin actions per minute
 */
export const adminLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'admin_limit',
  points: 50,
  duration: 60,
  blockDuration: 120,
});

/**
 * Email sending rate limiter
 * 10 emails per hour per user
 */
export const emailLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'email_limit',
  points: 10,
  duration: 3600, // 1 hour
  blockDuration: 3600,
});

/**
 * Password reset rate limiter
 * 3 attempts per hour per email
 */
export const passwordResetLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'password_reset_limit',
  points: 3,
  duration: 3600,
  blockDuration: 3600,
});

/**
 * AI generation rate limiter
 * Configurable based on AI provider limits
 */
export const aiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ai_limit',
  points: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '60'),
  duration: 60,
  blockDuration: 60,
});

/**
 * Rate limit check result interface
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime?: Date;
  retryAfter?: number;
}

/**
 * Check rate limit for a given key
 * @param limiter - The rate limiter to use
 * @param key - Unique identifier (IP, userId, etc.)
 * @returns RateLimitResult with allowed status and remaining points
 */
export async function checkRateLimit(
  limiter: RateLimiterRedis,
  key: string
): Promise<RateLimitResult> {
  try {
    const result = await limiter.consume(key);
    return {
      allowed: true,
      remaining: result.remainingPoints,
      resetTime: new Date(Date.now() + result.msBeforeNext),
    };
  } catch (rejRes: any) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(Date.now() + rejRes.msBeforeNext),
      retryAfter: Math.ceil(rejRes.msBeforeNext / 1000),
    };
  }
}

/**
 * Check rate limit without consuming points
 * Useful for previewing remaining quota
 * @param limiter - The rate limiter to use
 * @param key - Unique identifier
 * @returns RateLimitResult with current status
 */
export async function peekRateLimit(
  limiter: RateLimiterRedis,
  key: string
): Promise<RateLimitResult> {
  try {
    const result = await limiter.get(key);
    if (result) {
      return {
        allowed: result.remainingPoints > 0,
        remaining: result.remainingPoints,
        resetTime: new Date(Date.now() + result.msBeforeNext),
      };
    }
    return {
      allowed: true,
      remaining: limiter.points,
    };
  } catch {
    return {
      allowed: true,
      remaining: limiter.points,
    };
  }
}

/**
 * Reset rate limit for a specific key
 * @param limiter - The rate limiter to reset
 * @param key - Unique identifier to reset
 */
export async function resetRateLimit(
  limiter: RateLimiterRedis,
  key: string
): Promise<void> {
  await limiter.delete(key);
}

/**
 * Get client IP from request
 * Handles proxy forwarding and extracts real IP
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback - this won't work in all environments
  return 'unknown';
}

/**
 * Middleware helper to apply rate limiting
 * @param limiter - Rate limiter to apply
 * @param keyGenerator - Function to generate unique key from request
 */
export function createRateLimitMiddleware(
  limiter: RateLimiterRedis,
  keyGenerator: (req: Request) => string = getClientIP
) {
  return async (request: Request): Promise<RateLimitResult> => {
    const key = keyGenerator(request);
    return checkRateLimit(limiter, key);
  };
}

export { redisClient };
