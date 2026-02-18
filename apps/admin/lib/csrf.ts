/**
 * CSRF Protection Utilities
 * Provides functions for generating and verifying CSRF tokens
 */

import { createHash, randomBytes } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'dev-csrf-secret';

/**
 * Generate a new CSRF token
 * @returns Object containing token and cookie value
 */
export function generateCSRFToken(): { token: string; cookieValue: string } {
  const random = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString(36);
  const cookieValue = `${timestamp}:${random}`;
  
  const token = createHash('sha256')
    .update(`${cookieValue}:${CSRF_SECRET}`)
    .digest('hex');
  
  return { token, cookieValue };
}

/**
 * Verify a CSRF token against its cookie value
 * @param token - The CSRF token from the request header
 * @param cookieValue - The CSRF token from the cookie
 * @returns boolean indicating if the token is valid
 */
export function verifyCSRFToken(token: string, cookieValue: string): boolean {
  try {
    const expectedToken = createHash('sha256')
      .update(`${cookieValue}:${CSRF_SECRET}`)
      .digest('hex');
    
    // Timing-safe comparison
    return timingSafeEqual(token, expectedToken);
  } catch {
    return false;
  }
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Check if token is expired (older than 24 hours)
 * @param cookieValue - The CSRF cookie value
 * @returns boolean indicating if the token is expired
 */
export function isCSRFTokenExpired(cookieValue: string): boolean {
  try {
    const [timestamp] = cookieValue.split(':');
    const issuedAt = parseInt(timestamp, 36);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return now - issuedAt > maxAge;
  } catch {
    return true;
  }
}

/**
 * CSRF protection middleware helper
 * For use in API routes
 */
export const csrfProtection = {
  /**
   * Verify CSRF token from request
   * @param request - The incoming request
   * @returns boolean indicating if CSRF is valid
   */
  verify(request: Request): boolean {
    const headerToken = request.headers.get('x-csrf-token');
    const cookieHeader = request.headers.get('cookie');
    
    if (!headerToken || !cookieHeader) {
      return false;
    }
    
    // Extract CSRF cookie value
    const cookies = parseCookies(cookieHeader);
    const cookieValue = cookies['admin-csrf-token'];
    
    if (!cookieValue) {
      return false;
    }
    
    // Check expiration
    if (isCSRFTokenExpired(cookieValue)) {
      return false;
    }
    
    return verifyCSRFToken(headerToken, cookieValue);
  },
  
  /**
   * Generate new CSRF token pair
   */
  generate() {
    return generateCSRFToken();
  },
};

/**
 * Parse cookies from cookie header
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}

export default csrfProtection;
