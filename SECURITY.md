# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

### 3-Layer Authentication System

The platform uses a robust 3-layer authentication system for admin access:

#### Layer 1: Security Question
- Predefined security question configured in environment
- Answer is hashed with bcrypt
- Rate limited to 5 attempts per 15 minutes
- Account lockout after 5 failed attempts

#### Layer 2: Password Authentication
- Minimum 12 characters required
- Complexity requirements: uppercase, lowercase, numbers, symbols
- bcrypt hashing with configurable rounds (default: 12)
- Rate limited to 5 attempts per 15 minutes

#### Layer 3: Access Key
- 7-digit alphanumeric format (ABC-1234)
- Generated and sent via email or displayed on screen
- 5-minute expiry
- One-time use per session

### Rate Limiting

Implemented using Redis-backed rate limiter:

| Endpoint | Limit | Window |
|----------|-------|--------|
| General API | 100 requests | 1 minute |
| Authentication | 5 attempts | 15 minutes |
| Tool Execution | 30 executions | 1 minute |
| Admin Operations | 50 operations | 1 minute |
| Password Reset | 3 attempts | 1 hour |
| Email Sending | 10 emails | 1 hour |

### Security Headers

All responses include comprehensive security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

### CSRF Protection

- CSRF tokens generated using HMAC-SHA256
- Tokens valid for 24 hours
- Required for all state-changing operations (POST, PUT, DELETE, PATCH)
- Automatic token rotation

### Input Validation

All inputs validated using Zod schemas:

- Type safety enforcement
- Length and format validation
- Sanitization of user input
- Custom validation rules per field

### Database Security

- Connection pooling to prevent resource exhaustion
- Query timeout protection (10 seconds)
- Prepared statements to prevent SQL injection
- Connection encryption (via PostgreSQL SSL)

### File Upload Security

- File type validation by MIME type and extension
- File size limits (configurable, default 10MB)
- Virus scanning integration ready
- Secure file storage with unique filenames

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public issue
2. Email security details to: security@yourdomain.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will:
- Acknowledge receipt within 48 hours
- Investigate and validate within 5 business days
- Provide regular updates on progress
- Credit researchers (with permission) after fix is deployed

## Security Checklist

Before deploying to production:

- [ ] Change all default secrets and passwords
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure security headers in middleware
- [ ] Enable rate limiting
- [ ] Set up Redis for caching and rate limiting
- [ ] Configure database connection pooling
- [ ] Enable audit logging
- [ ] Set up error tracking (Sentry recommended)
- [ ] Review and customize CSP policy
- [ ] Enable HSTS preload
- [ ] Configure backup and disaster recovery
- [ ] Set up monitoring and alerting
- [ ] Run security scan (npm audit, etc.)
- [ ] Review file upload permissions
- [ ] Enable database query logging for anomalies
- [ ] Configure session timeout appropriately

## Security Configuration

### Environment Variables

Required security-related environment variables:

```env
# Authentication
JWT_SECRET="min-32-characters-random-string"
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_SECRET="different-32-char-random-string"
BCRYPT_ROUNDS=12

# CSRF
CSRF_SECRET="csrf-secret-min-32-chars"

# Security Headers
CSP_NONCE_SECRET="csp-nonce-secret"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5

# Account Security
SECURITY_QUESTION_ATTEMPTS=3
PASSWORD_MIN_LENGTH=12
ACCOUNT_LOCKOUT_MINUTES=15
```

### Security Headers Customization

To customize security headers, edit `apps/admin/lib/security-headers.ts`:

```typescript
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'nonce-{nonce}'; " + // Add your nonce
    // ... add your policies
};
```

### Rate Limiting Configuration

Adjust rate limits in `apps/admin/lib/rate-limiter.ts`:

```typescript
export const apiLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'api_limit',
  points: 100,      // requests
  duration: 60,     // per minute
  blockDuration: 60 // block for 1 minute
});
```

## Compliance

The platform follows security best practices aligned with:

- **OWASP Top 10** - Web application security
- **CSP Guidelines** - Content Security Policy
- **HSTS Standards** - HTTPS enforcement
- **GDPR** - Data protection (configurable data retention)

## Security Updates

Security updates are released as patch versions. To stay updated:

1. Watch the repository for releases
2. Subscribe to security advisories
3. Run `pnpm audit` regularly
4. Keep dependencies updated

## Penetration Testing

Recommended tools for security testing:

- **OWASP ZAP** - Web vulnerability scanner
- **Burp Suite** - Web security testing
- **npm audit** - Dependency vulnerability check
- **Snyk** - Continuous security monitoring

Run basic security scan:

```bash
pnpm audit
pnpm audit --fix
```

## Incident Response

In case of a security incident:

1. **Contain** - Isolate affected systems
2. **Assess** - Determine scope and impact
3. **Notify** - Inform affected users if required
4. **Fix** - Deploy security patches
5. **Review** - Post-incident analysis
6. **Improve** - Update security measures

## Contact

Security Team: security@yourdomain.com  
Bug Bounty: https://yourdomain.com/bug-bounty

---

Last Updated: 2024
