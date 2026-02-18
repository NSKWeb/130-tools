import { cache, cacheKeys, cacheTTL, memoize } from '../index';

// Mock Redis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    get: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    ttl: jest.fn(),
    incrby: jest.fn(),
    decrby: jest.fn(),
    set: jest.fn(),
    mget: jest.fn(),
    pipeline: jest.fn(() => ({
      setex: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    })),
    keys: jest.fn(),
    flushall: jest.fn(),
    info: jest.fn(),
    dbsize: jest.fn(),
    quit: jest.fn(),
    status: 'ready',
  }));
});

describe('Cache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return parsed value', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.get.mockResolvedValue(JSON.stringify({ data: 'test' }));

      const result = await cache.get('key');
      expect(result).toEqual({ data: 'test' });
    });

    it('should return null for missing key', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.get.mockResolvedValue(null);

      const result = await cache.get('missing');
      expect(result).toBeNull();
    });

    it('should handle errors gracefully', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.get.mockRejectedValue(new Error('Redis error'));

      const result = await cache.get('key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value with TTL', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.setex.mockResolvedValue('OK');

      await cache.set('key', { data: 'value' }, 3600);
      expect(instance.setex).toHaveBeenCalledWith(
        'key',
        3600,
        JSON.stringify({ data: 'value' })
      );
    });

    it('should use default TTL', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.setex.mockResolvedValue('OK');

      await cache.set('key', 'value');
      expect(instance.setex).toHaveBeenCalledWith(
        'key',
        3600,
        JSON.stringify('value')
      );
    });
  });

  describe('del', () => {
    it('should delete key', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.del.mockResolvedValue(1);

      await cache.del('key');
      expect(instance.del).toHaveBeenCalledWith('key');
    });
  });

  describe('exists', () => {
    it('should return true for existing key', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.exists.mockResolvedValue(1);

      const result = await cache.exists('key');
      expect(result).toBe(true);
    });

    it('should return false for missing key', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.exists.mockResolvedValue(0);

      const result = await cache.exists('missing');
      expect(result).toBe(false);
    });
  });

  describe('increment', () => {
    it('should increment by 1 by default', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.incrby.mockResolvedValue(1);

      const result = await cache.increment('counter');
      expect(instance.incrby).toHaveBeenCalledWith('counter', 1);
      expect(result).toBe(1);
    });

    it('should increment by custom amount', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.incrby.mockResolvedValue(10);

      const result = await cache.increment('counter', 10);
      expect(instance.incrby).toHaveBeenCalledWith('counter', 10);
      expect(result).toBe(10);
    });
  });

  describe('setNX', () => {
    it('should return true on successful set', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.set.mockResolvedValue('OK');

      const result = await cache.setNX('key', 'value', 60);
      expect(result).toBe(true);
    });

    it('should return false if key exists', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.set.mockResolvedValue(null);

      const result = await cache.setNX('existing', 'value', 60);
      expect(result).toBe(false);
    });
  });

  describe('invalidatePattern', () => {
    it('should delete matching keys', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.keys.mockResolvedValue(['key1', 'key2']);
      instance.del.mockResolvedValue(2);

      const result = await cache.invalidatePattern('prefix:*');
      expect(result).toBe(2);
      expect(instance.del).toHaveBeenCalledWith('key1', 'key2');
    });

    it('should return 0 for no matches', async () => {
      const { default: Redis } = await import('ioredis');
      const mockRedis = Redis as jest.MockedClass<typeof Redis>;
      const instance = mockRedis.mock.results[0]?.value as any;
      
      instance.keys.mockResolvedValue([]);

      const result = await cache.invalidatePattern('nomatch:*');
      expect(result).toBe(0);
    });
  });
});

describe('Cache Keys', () => {
  it('should generate tool key', () => {
    expect(cacheKeys.tool('bmi-calculator')).toBe('tool:bmi-calculator');
  });

  it('should generate tool list key', () => {
    expect(cacheKeys.toolList()).toBe('tools:list:all');
    expect(cacheKeys.toolList('calculators')).toBe('tools:list:calculators');
  });

  it('should generate blog post key', () => {
    expect(cacheKeys.blogPost('my-post')).toBe('blog:my-post');
  });

  it('should generate analytics key', () => {
    expect(cacheKeys.analytics('daily')).toBe('analytics:daily');
  });

  it('should generate user key', () => {
    expect(cacheKeys.user('123')).toBe('user:123');
  });
});

describe('Cache TTL', () => {
  it('should have correct TTL values', () => {
    expect(cacheTTL.SHORT).toBe(60);
    expect(cacheTTL.MEDIUM).toBe(300);
    expect(cacheTTL.LONG).toBe(3600);
    expect(cacheTTL.DAY).toBe(86400);
    expect(cacheTTL.WEEK).toBe(604800);
  });
});

describe('memoize', () => {
  it('should cache function results', async () => {
    const fn = jest.fn().mockResolvedValue('result');
    const memoized = memoize(fn, (arg) => `key:${arg}`, 60);

    // First call
    const result1 = await memoized('test');
    expect(result1).toBe('result');
    expect(fn).toHaveBeenCalledTimes(1);

    // Second call should use cache
    const result2 = await memoized('test');
    expect(result2).toBe('result');
    expect(fn).toHaveBeenCalledTimes(1); // Not called again
  });

  it('should call function for different args', async () => {
    const fn = jest.fn().mockResolvedValue('result');
    const memoized = memoize(fn, (arg) => `key:${arg}`, 60);

    await memoized('a');
    await memoized('b');

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
