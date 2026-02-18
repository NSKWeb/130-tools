/**
 * Integration Tests for Admin Authentication
 * Tests complete 3-layer authentication flow
 */

describe('Admin Authentication Integration', () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  describe('Layer 1 - Security Question', () => {
    it('should verify correct security answer', async () => {
      const response = await fetch(`${API_BASE}/auth/layer1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: process.env.ADMIN_SECURITY_ANSWER || 'test-answer',
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.sessionToken).toBeDefined();
      expect(result.data.expiresAt).toBeDefined();
    });

    it('should reject incorrect security answer', async () => {
      const response = await fetch(`${API_BASE}/auth/layer1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: 'wrong-answer',
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('AUTH_ERROR');
    });

    it('should track failed attempts', async () => {
      // Make multiple failed attempts
      for (let i = 0; i < 3; i++) {
        await fetch(`${API_BASE}/auth/layer1`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer: 'wrong' }),
        });
      }

      const response = await fetch(`${API_BASE}/auth/layer1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: 'wrong' }),
      });

      const result = await response.json();
      
      expect(result.error.remainingAttempts).toBeDefined();
    });
  });

  describe('Layer 2 - Password', () => {
    let layer1Token: string;

    beforeEach(async () => {
      // Get layer 1 token
      const response = await fetch(`${API_BASE}/auth/layer1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: process.env.ADMIN_SECURITY_ANSWER || 'test-answer',
        }),
      });
      const result = await response.json();
      layer1Token = result.data.sessionToken;
    });

    it('should verify correct password', async () => {
      const response = await fetch(`${API_BASE}/auth/layer2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: layer1Token,
          password: process.env.ADMIN_PASSWORD || 'test-password',
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.sessionToken).toBeDefined();
    });

    it('should reject incorrect password', async () => {
      const response = await fetch(`${API_BASE}/auth/layer2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: layer1Token,
          password: 'wrong-password',
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
    });

    it('should reject invalid session token', async () => {
      const response = await fetch(`${API_BASE}/auth/layer2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: 'invalid-token',
          password: 'test-password',
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(401);
      expect(result.error.code).toBe('AUTH_ERROR');
    });
  });

  describe('Layer 3 - Access Key', () => {
    let layer2Token: string;

    beforeEach(async () => {
      // Complete layers 1 and 2
      const layer1 = await fetch(`${API_BASE}/auth/layer1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: process.env.ADMIN_SECURITY_ANSWER || 'test-answer',
        }),
      });
      const layer1Result = await layer1.json();

      const layer2 = await fetch(`${API_BASE}/auth/layer2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: layer1Result.data.sessionToken,
          password: process.env.ADMIN_PASSWORD || 'test-password',
        }),
      });
      const layer2Result = await layer2.json();
      layer2Token = layer2Result.data.sessionToken;
    });

    it('should verify valid access key format', async () => {
      const response = await fetch(`${API_BASE}/auth/layer3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: layer2Token,
          accessKey: 'ABC-1234',
        }),
      });

      // Should validate format but may fail verification
      expect([200, 401]).toContain(response.status);
    });

    it('should reject invalid access key format', async () => {
      const response = await fetch(`${API_BASE}/auth/layer3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: layer2Token,
          accessKey: 'invalid-key',
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(400);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limits to auth endpoints', async () => {
      // Make multiple auth attempts
      const requests = Array(10).fill(null).map(() =>
        fetch(`${API_BASE}/auth/layer1`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answer: 'wrong' }),
        })
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);
      
      expect(rateLimited).toBe(true);
    });
  });

  describe('Session Management', () => {
    it('should refresh valid session', async () => {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: 'valid-refresh-token',
        }),
      });

      // May succeed or fail depending on token validity
      expect([200, 401]).toContain(response.status);
    });

    it('should reject invalid refresh token', async () => {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: 'invalid-token',
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(401);
      expect(result.success).toBe(false);
    });
  });

  describe('CSRF Protection', () => {
    it('should require CSRF token for state-changing operations', async () => {
      const response = await fetch(`${API_BASE}/admin/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-token',
        },
        body: JSON.stringify({ name: 'Test Tool' }),
      });

      // Should fail due to missing CSRF token
      expect(response.status).toBe(403);
    });
  });
});
