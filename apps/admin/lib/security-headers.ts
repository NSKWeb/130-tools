/**
 * Security Headers Configuration
 * Comprehensive security headers for Next.js applications
 */

export interface SecurityHeaders {
  [key: string]: string;
}

/**
 * Content Security Policy
 * Defines allowed sources for various content types
 */
const generateCSP = (nonce?: string): string => {
  const nonceStr = nonce ? `'nonce-${nonce}'` : '';
  
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${nonceStr} https://analytics.google.com https://www.google-analytics.com https://ssl.google-analytics.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.groq.com https://openrouter.ai https://www.google-analytics.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
};

/**
 * Core security headers for all environments
 */
export const securityHeaders: SecurityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': generateCSP(),
  
  // HTTPS enforcement
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Clickjacking protection
  'X-Frame-Options': 'DENY',
  
  // MIME type sniffing protection
  'X-Content-Type-Options': 'nosniff',
  
  // XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Feature policy / Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
  
  // Disable caching for sensitive pages
  'Cache-Control': 'no-store, max-age=0',
  
  // Prevent information leakage
  'X-DNS-Prefetch-Control': 'off',
  
  // Corporate/IE security
  'X-Download-Options': 'noopen',
  
  // Cross-origin policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/**
 * Development-specific headers (less strict)
 */
export const devSecurityHeaders: SecurityHeaders = {
  ...securityHeaders,
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' *",
  ].join('; '),
  'Strict-Transport-Security': 'max-age=0',
};

/**
 * API-specific headers
 */
export const apiSecurityHeaders: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
};

/**
 * Static asset headers (allows caching)
 */
export const staticAssetHeaders: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'public, max-age=31536000, immutable',
};

/**
 * Get appropriate headers based on environment and route
 */
export function getSecurityHeaders(
  isDev: boolean = process.env.NODE_ENV === 'development',
  isApi: boolean = false,
  isStatic: boolean = false,
  nonce?: string
): SecurityHeaders {
  if (isDev) {
    return devSecurityHeaders;
  }
  
  if (isApi) {
    return apiSecurityHeaders;
  }
  
  if (isStatic) {
    return staticAssetHeaders;
  }
  
  if (nonce) {
    return {
      ...securityHeaders,
      'Content-Security-Policy': generateCSP(nonce),
    };
  }
  
  return securityHeaders;
}

/**
 * Apply security headers to a Headers object
 */
export function applySecurityHeaders(
  headers: Headers,
  securityHeaders: SecurityHeaders
): Headers {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  return headers;
}

/**
 * Generate nonce for CSP
 */
export function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64').slice(0, 16);
}

export default securityHeaders;
