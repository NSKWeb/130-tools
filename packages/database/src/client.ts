import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Configuration
 * Provides database connection with pooling, timeouts, and health checks
 */

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reloading.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Database connection configuration
 */
const getPrismaConfig = () => ({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  
  // Connection pooling configuration
  // Using connection_limit from connection string or fallback to env var
  
  // Query timeout to prevent long-running queries
  // Note: This is handled at connection string level or via middleware
  
  // Logging configuration
  log: process.env.NODE_ENV === 'development' 
    ? [
        { emit: 'stdout', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ] as const
    : [
        { emit: 'stdout', level: 'error' },
      ] as const,
});

/**
 * Create Prisma client with configuration
 */
const createPrismaClient = (): PrismaClient => {
  const client = new PrismaClient(getPrismaConfig());
  
  // Add query timeout middleware in production
  if (process.env.NODE_ENV === 'production') {
    client.$use(async (params, next) => {
      const before = Date.now();
      const timeoutMs = 10000; // 10 seconds
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Query timeout after ${timeoutMs}ms: ${params.model}.${params.action}`));
        }, timeoutMs);
      });
      
      // Race between query and timeout
      const result = await Promise.race([
        next(params),
        timeoutPromise,
      ]);
      
      const after = Date.now();
      const duration = after - before;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`[SLOW QUERY] ${params.model}.${params.action} took ${duration}ms`);
      }
      
      return result;
    });
  }
  
  return client;
};

/**
 * Prisma client singleton
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

/**
 * Connection pool configuration
 * These values should be set in DATABASE_URL connection string
 */
export const dbConfig = {
  poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '10'),
  maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '100'),
  connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '5000'),
  idleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
};

/**
 * Check database health
 * @returns boolean indicating if database is reachable
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Get database connection info
 */
export async function getConnectionInfo(): Promise<{
  isConnected: boolean;
  activeConnections: number;
  idleConnections: number;
}> {
  try {
    // Note: This query format depends on your database provider
    // Below is for PostgreSQL
    const result = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT count(*) as count FROM pg_stat_activity WHERE datname = current_database()
    `;
    
    return {
      isConnected: true,
      activeConnections: Number(result[0]?.count || 0),
      idleConnections: 0, // Would need more specific query for this
    };
  } catch (error) {
    console.error('Failed to get connection info:', error);
    return {
      isConnected: false,
      activeConnections: 0,
      idleConnections: 0,
    };
  }
}

/**
 * Execute a transaction with automatic retry
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Only retry on connection errors
      if (!isRetryableError(lastError) || attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.warn(`Database retry attempt ${attempt}/${maxRetries}`);
    }
  }
  
  throw lastError;
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: Error): boolean {
  const retryableMessages = [
    'connection',
    'timeout',
    'deadlock',
    'lock wait timeout',
    'too many connections',
  ];
  
  return retryableMessages.some(msg => 
    error.message.toLowerCase().includes(msg)
  );
}

/**
 * Graceful shutdown handler
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
    process.exit(1);
  }
}

// Store prisma client in global for hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
process.on('beforeExit', disconnectDatabase);
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default prisma;
