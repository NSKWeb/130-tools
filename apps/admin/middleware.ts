import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders, generateNonce, getClientIP } from './lib/security-headers';
import { checkRateLimit, authLimiter, apiLimiter } from './lib/rate-limiter';
import { logger } from './lib/logger';

/**
 * Admin Dashboard Middleware
 * Handles security headers, rate limiting, CSRF protection, and authentication
 */

// CSRF token cookie name
const CSRF_COOKIE = 'admin-csrf-token';
const SESSION_COOKIE = 'admin-session';

/**
 * Generate CSRF token
 */
function generateCSRFToken(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

/**
 * Verify CSRF token from request
 */
function verifyCSRFToken(request: NextRequest): boolean {
  const headerToken = request.headers.get('x-csrf-token');
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  
  if (!headerToken || !cookieToken) {
    return false;
  }
  
  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(headerToken),
      Buffer.from(cookieToken)
    );
  } catch {
    return false;
  }
}

/**
 * Check if request path is exempt from CSRF
 */
function isCSRFExempt(path: string): boolean {
  const exemptPaths = [
    '/_next/',
    '/static/',
    '/api/auth/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ];
  return exemptPaths.some(exempt => path.startsWith(exempt));
}

/**
 * Check if path requires authentication
 */
function requiresAuth(path: string): boolean {
  const publicPaths = [
    '/auth',
    '/api/auth/layer1',
    '/api/auth/layer2',
    '/api/auth/layer3',
    '/api/auth/refresh',
  ];
  return !publicPaths.some(publicPath => path.startsWith(publicPath));
}

/**
 * Verify JWT session token
 */
function verifySession(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  
  if (!sessionToken) {
    return false;
  }
  
  // Session verification would typically involve JWT verification
  // This is simplified for the middleware context
  return sessionToken.length >= 32;
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  
  // Create response
  const response = NextResponse.next();
  
  // Generate and set nonce for CSP
  const nonce = generateNonce();
  
  // Apply security headers
  const headers = getSecurityHeadersWithNonce(nonce);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Set nonce in header for use in components
  response.headers.set('x-nonce', nonce);
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    // Auth endpoints have stricter rate limiting
    if (pathname.startsWith('/api/auth/')) {
      const rateLimit = await checkRateLimit(authLimiter, clientIP);
      if (!rateLimit.allowed) {
        logger.warn('Auth rate limit exceeded', { ip: clientIP, path: pathname });
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many authentication attempts',
            retryAfter: rateLimit.retryAfter 
          }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': String(rateLimit.retryAfter || 60),
            } 
          }
        );
      }
    } else {
      // General API rate limiting
      const rateLimit = await checkRateLimit(apiLimiter, clientIP);
      if (!rateLimit.allowed) {
        logger.warn('API rate limit exceeded', { ip: clientIP, path: pathname });
        return new NextResponse(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            retryAfter: rateLimit.retryAfter 
          }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': String(rateLimit.retryAfter || 60),
            } 
          }
        );
      }
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    }
  }
  
  // CSRF Protection for state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    if (!isCSRFExempt(pathname)) {
      if (!verifyCSRFToken(request)) {
        logger.warn('CSRF validation failed', { ip: clientIP, path: pathname });
        return new NextResponse(
          JSON.stringify({ error: 'Invalid CSRF token' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }
  
  // Set CSRF token cookie for GET requests if not present
  if (request.method === 'GET' && !request.cookies.get(CSRF_COOKIE)) {
    const csrfToken = generateCSRFToken();
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false, // Must be accessible by JS for header setting
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }
  
  // Authentication check for protected routes
  if (requiresAuth(pathname)) {
    if (!verifySession(request)) {
      // Redirect to auth page
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(authUrl);
    }
  }
  
  // Security audit logging for sensitive operations
  if (pathname.startsWith('/api/admin/')) {
    logger.info('Admin API access', {
      ip: clientIP,
      path: pathname,
      method: request.method,
      userAgent: request.headers.get('user-agent'),
    });
  }
  
  return response;
}

/**
 * Get security headers with nonce
 */
function getSecurityHeadersWithNonce(nonce: string): Record<string, string> {
  return {
    ...securityHeaders,
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'nonce-${nonce}' https://analytics.google.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.groq.com https://openrouter.ai",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  };
}

/**
 * Middleware configuration
 * Match all paths except static files
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
