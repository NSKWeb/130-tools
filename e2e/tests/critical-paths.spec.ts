/**
 * E2E Tests - Critical User Paths
 * Uses Playwright for browser automation
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const ADMIN_URL = process.env.TEST_ADMIN_URL || 'http://localhost:3001';

test.describe('Critical User Paths', () => {
  test.describe('Public Site', () => {
    test('user can navigate from homepage to tool and get results', async ({ page }) => {
      // Navigate to homepage
      await page.goto(BASE_URL);
      
      // Verify homepage loads
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="tool-grid"]')).toBeVisible();
      
      // Search for a tool
      await page.fill('[data-testid="search-input"]', 'bmi');
      await page.press('[data-testid="search-input"]', 'Enter');
      
      // Click on BMI calculator
      await page.click('text=BMI Calculator');
      
      // Verify tool page loads
      await expect(page.locator('h1')).toContainText('BMI Calculator');
      await expect(page.locator('[data-testid="tool-form"]')).toBeVisible();
      
      // Fill in inputs
      await page.fill('input[name="height"]', '175');
      await page.fill('input[name="weight"]', '70');
      
      // Submit form
      await page.click('[data-testid="calculate-button"]');
      
      // Verify results appear
      await expect(page.locator('[data-testid="result"]')).toBeVisible();
      await expect(page.locator('[data-testid="result"]')).toContainText('22.9');
    });

    test('user can browse tools by category', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Click on Calculators category
      await page.click('text=Calculators');
      
      // Verify category page
      await expect(page.url()).toContain('/category/calculators');
      await expect(page.locator('h1')).toContainText('Calculators');
      
      // Verify tools are listed
      const tools = await page.locator('[data-testid="tool-card"]').count();
      expect(tools).toBeGreaterThan(0);
    });

    test('user can use search functionality', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Search for password generator
      await page.fill('[data-testid="search-input"]', 'password');
      
      // Wait for search results
      await page.waitForSelector('[data-testid="search-results"]');
      
      // Verify results contain password tools
      const results = await page.locator('[data-testid="search-result"]').count();
      expect(results).toBeGreaterThan(0);
    });

    test('dark mode toggle works', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Toggle dark mode
      await page.click('[data-testid="theme-toggle"]');
      
      // Verify dark class is applied
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Toggle back to light
      await page.click('[data-testid="theme-toggle"]');
      
      // Verify dark class is removed
      await expect(page.locator('html')).not.toHaveClass(/dark/);
    });
  });

  test.describe('Admin Dashboard', () => {
    test('admin can complete 3-layer authentication', async ({ page }) => {
      await page.goto(`${ADMIN_URL}/auth`);
      
      // Layer 1: Security Question
      await expect(page.locator('h1')).toContainText('Security Question');
      await page.fill('input[name="answer"]', process.env.ADMIN_SECURITY_ANSWER || 'test');
      await page.click('button[type="submit"]');
      
      // Layer 2: Password
      await expect(page.locator('h1')).toContainText('Password');
      await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || 'test');
      await page.click('button[type="submit"]');
      
      // Layer 3: Access Key
      await expect(page.locator('h1')).toContainText('Access Key');
      
      // Mock access key entry (or use test access key)
      await page.fill('input[name="accessKey"]', 'ABC-1234');
      await page.click('button[type="submit"]');
      
      // Verify dashboard access
      await expect(page.locator('h1')).toContainText('Dashboard');
    });

    test('admin can create a new tool', async ({ page }) => {
      // Login first (assume helper function or state)
      await page.goto(`${ADMIN_URL}/dashboard/tools/new`);
      
      // Fill tool details
      await page.fill('input[name="name"]', 'Test Tool');
      await page.fill('input[name="slug"]', 'test-tool');
      await page.fill('textarea[name="description"]', 'This is a test tool description that is long enough.');
      
      // Select category
      await page.selectOption('select[name="category"]', 'calculators');
      
      // Add input
      await page.click('button[data-testid="add-input"]');
      await page.fill('input[name="inputs[0].name"]', 'value');
      await page.selectOption('select[name="inputs[0].type"]', 'number');
      
      // Add output
      await page.click('button[data-testid="add-output"]');
      await page.fill('input[name="outputs[0].name"]', 'result');
      
      // Save tool
      await page.click('button[type="submit"]');
      
      // Verify success
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    test('admin can view analytics', async ({ page }) => {
      await page.goto(`${ADMIN_URL}/dashboard/analytics`);
      
      // Verify analytics page loads
      await expect(page.locator('h1')).toContainText('Analytics');
      
      // Verify stats cards are visible
      await expect(page.locator('[data-testid="stats-card"]')).toBeVisible();
      
      // Verify chart is rendered
      await expect(page.locator('[data-testid="analytics-chart"]')).toBeVisible();
    });
  });

  test.describe('Tool Execution Flow', () => {
    const tools = [
      { name: 'BMI Calculator', path: '/tools/bmi-calculator', inputs: { height: '175', weight: '70' } },
      { name: 'Word Counter', path: '/tools/word-counter', inputs: { text: 'Hello world this is a test' } },
      { name: 'Password Generator', path: '/tools/password-generator', inputs: { length: '16' } },
    ];

    for (const tool of tools) {
      test(`can execute ${tool.name}`, async ({ page }) => {
        await page.goto(`${BASE_URL}${tool.path}`);
        
        // Fill all inputs
        for (const [key, value] of Object.entries(tool.inputs)) {
          const input = page.locator(`input[name="${key}"], textarea[name="${key}"]`);
          await input.fill(value);
        }
        
        // Submit
        await page.click('button[type="submit"]');
        
        // Verify results
        await expect(page.locator('[data-testid="result"]')).toBeVisible();
      });
    }
  });

  test.describe('Error Handling', () => {
    test('shows 404 for non-existent tool', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/non-existent-tool`);
      
      await expect(page.locator('h1')).toContainText('Not Found');
      await expect(page.locator('text=Go back home')).toBeVisible();
    });

    test('shows validation errors for invalid inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/bmi-calculator`);
      
      // Submit without filling required fields
      await page.click('button[type="submit"]');
      
      // Verify validation errors
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });

    test('handles network errors gracefully', async ({ page }) => {
      // Block tool API
      await page.route('**/api/tools/**/execute', route => route.abort());
      
      await page.goto(`${BASE_URL}/tools/bmi-calculator`);
      await page.fill('input[name="height"]', '175');
      await page.fill('input[name="weight"]', '70');
      await page.click('button[type="submit"]');
      
      // Verify error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('tool page loads within acceptable time', async ({ page }) => {
      const start = Date.now();
      
      await page.goto(`${BASE_URL}/tools/bmi-calculator`);
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('tool execution responds quickly', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/bmi-calculator`);
      
      await page.fill('input[name="height"]', '175');
      await page.fill('input[name="weight"]', '70');
      
      const start = Date.now();
      await page.click('button[type="submit"]');
      await page.waitForSelector('[data-testid="result"]');
      
      const executionTime = Date.now() - start;
      expect(executionTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  test.describe('Accessibility', () => {
    test('homepage meets accessibility standards', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check for ARIA labels
      const images = await page.locator('img').count();
      const imagesWithAlt = await page.locator('img[alt]').count();
      expect(imagesWithAlt).toBe(images);
      
      // Check for heading hierarchy
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);
    });

    test('tools can be used with keyboard only', async ({ page }) => {
      await page.goto(`${BASE_URL}/tools/bmi-calculator`);
      
      // Navigate using Tab key
      await page.press('body', 'Tab');
      
      // Fill inputs using keyboard
      await page.fill('input[name="height"]', '175');
      await page.press('input[name="height"]', 'Tab');
      await page.fill('input[name="weight"]', '70');
      
      // Submit with Enter
      await page.press('input[name="weight"]', 'Enter');
      
      // Verify results
      await expect(page.locator('[data-testid="result"]')).toBeVisible();
    });
  });
});
