require('@testing-library/jest-dom');

// Mock next/navigation
try {
  require.resolve('next/navigation');
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }),
    useSearchParams: () => ({
      get: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
    }),
    usePathname: () => '/',
  }));
} catch (e) {
  // next/navigation not available, skipping mock
}

// Mock next/image
try {
  require.resolve('next/image');
  jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
      // Standard way to mock React component without JSX
      const React = require('react');
      return React.createElement('img', props);
    },
  }));
} catch (e) {
  // next/image not available, skipping mock
}


// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  JWT_SECRET: 'test-secret',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  REDIS_URL: 'redis://localhost:6379',
};

// Global fetch mock
global.fetch = jest.fn();

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}
global.IntersectionObserver = MockIntersectionObserver;

// Mock crypto.randomUUID
global.crypto = {
  ...global.crypto,
  randomUUID: () => '123e4567-e89b-12d3-a456-426614174000',
  timingSafeEqual: (a, b) => a.toString() === b.toString(),
};

// Suppress console errors during tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // error: jest.fn(),
  // warn: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
