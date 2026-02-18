/**
 * Integration Tests for Tool Execution
 * Tests complete tool workflows from input to output
 */

describe('Tool Integration Tests', () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  beforeAll(() => {
    // Setup test environment
  });

  describe('Calculator Tools', () => {
    it('should execute BMI calculator with valid inputs', async () => {
      const response = await fetch(`${API_BASE}/tools/bmi-calculator/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { height: 175, weight: 70 },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.bmi).toBeDefined();
      expect(result.data.category).toBeDefined();
    });

    it('should execute percentage calculator', async () => {
      const response = await fetch(`${API_BASE}/tools/percentage-calculator/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { value: 100, percentage: 25, operation: 'of' },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.result).toContain('25');
    });

    it('should handle calculator validation errors', async () => {
      const response = await fetch(`${API_BASE}/tools/bmi-calculator/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { height: -100, weight: 70 },
        }),
      });

      const result = await response.json();
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Text Tools', () => {
    it('should execute word counter', async () => {
      const response = await fetch(`${API_BASE}/tools/word-counter/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { text: 'This is a test sentence.' },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.wordCount).toBe(5);
      expect(result.data.characterCount).toBe(24);
    });

    it('should execute case converter', async () => {
      const response = await fetch(`${API_BASE}/tools/case-converter/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { text: 'Hello World', targetCase: 'uppercase' },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.result).toBe('HELLO WORLD');
    });
  });

  describe('Developer Tools', () => {
    it('should execute JSON formatter', async () => {
      const response = await fetch(`${API_BASE}/tools/json-formatter/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { json: '{"key":"value"}', indent: 2 },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.isValid).toBe(true);
      expect(result.data.formatted).toContain('\n');
    });

    it('should execute Base64 encoder', async () => {
      const response = await fetch(`${API_BASE}/tools/base64-encoder/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { text: 'Hello World', operation: 'encode' },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.result).toBe('SGVsbG8gV29ybGQ=');
    });
  });

  describe('Generator Tools', () => {
    it('should execute password generator', async () => {
      const response = await fetch(`${API_BASE}/tools/password-generator/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.password).toHaveLength(16);
      expect(result.data.strength).toBeDefined();
    });

    it('should execute UUID generator', async () => {
      const response = await fetch(`${API_BASE}/tools/uuid-generator/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { count: 5 },
        }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data.uuids).toHaveLength(5);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent tool', async () => {
      const response = await fetch(`${API_BASE}/tools/non-existent-tool/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: {} }),
      });

      expect(response.status).toBe(404);
    });

    it('should handle rate limiting', async () => {
      // Make multiple rapid requests
      const requests = Array(35).fill(null).map(() =>
        fetch(`${API_BASE}/tools/word-counter/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: { text: 'test' } }),
        })
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(r => r.status === 429);
      
      expect(rateLimited).toBe(true);
    });

    it('should validate required inputs', async () => {
      const response = await fetch(`${API_BASE}/tools/bmi-calculator/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: {} }),
      });

      const result = await response.json();
      
      expect(response.status).toBe(400);
      expect(result.success).toBe(false);
      expect(result.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Performance', () => {
    it('should execute tools within acceptable time', async () => {
      const start = Date.now();
      
      const response = await fetch(`${API_BASE}/tools/bmi-calculator/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: { height: 175, weight: 70 },
        }),
      });

      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
