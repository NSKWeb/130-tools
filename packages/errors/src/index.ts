/**
 * Error Handling System
 * Custom error classes with standardized error codes and HTTP status codes
 */

/**
 * Base application error
 * All custom errors should extend this class
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for API responses
   */
  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
      },
    };
  }
}

/**
 * Validation Error - 400 Bad Request
 * Used when input validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, 400, details, true);
    this.name = 'ValidationError';
  }
}

/**
 * Field Validation Error - 400 Bad Request
 * Specific field-level validation errors
 */
export class FieldValidationError extends ValidationError {
  constructor(
    public field: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message, { field, ...details });
    this.name = 'FieldValidationError';
  }
}

/**
 * Authentication Error - 401 Unauthorized
 * Used when authentication fails or is missing
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super('AUTH_ERROR', message, 401, undefined, true);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error - 403 Forbidden
 * Used when user lacks permissions
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Access denied',
    public requiredPermission?: string
  ) {
    super('FORBIDDEN', message, 403, { requiredPermission }, true);
    this.name = 'AuthorizationError';
  }
}

/**
 * Rate Limit Error - 429 Too Many Requests
 * Used when rate limit is exceeded
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter: number = 60
  ) {
    super('RATE_LIMIT', message, 429, { retryAfter }, true);
    this.name = 'RateLimitError';
  }
}

/**
 * Not Found Error - 404 Not Found
 * Used when a resource is not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(
      'NOT_FOUND',
      identifier ? `${resource} with id '${identifier}' not found` : `${resource} not found`,
      404,
      { resource, identifier },
      true
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error - 409 Conflict
 * Used when there's a resource conflict
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('CONFLICT', message, 409, details, true);
    this.name = 'ConflictError';
  }
}

/**
 * Database Error - 500 Internal Server Error
 * Used for database-related errors
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database error', details?: Record<string, unknown>) {
    super('DATABASE_ERROR', message, 500, details, false);
    this.name = 'DatabaseError';
  }
}

/**
 * External Service Error - 502 Bad Gateway
 * Used when external API calls fail
 */
export class ExternalServiceError extends AppError {
  constructor(
    service: string,
    message: string = 'External service error',
    details?: Record<string, unknown>
  ) {
    super('EXTERNAL_SERVICE_ERROR', `${service}: ${message}`, 502, { service, ...details }, false);
    this.name = 'ExternalServiceError';
  }
}

/**
 * AI Service Error - 503 Service Unavailable
 * Used when AI provider fails
 */
export class AIServiceError extends AppError {
  constructor(
    provider: string,
    message: string = 'AI service unavailable'
  ) {
    super('AI_SERVICE_ERROR', message, 503, { provider }, false);
    this.name = 'AIServiceError';
  }
}

/**
 * Timeout Error - 504 Gateway Timeout
 * Used when operations timeout
 */
export class TimeoutError extends AppError {
  constructor(operation: string, timeoutMs: number) {
    super(
      'TIMEOUT',
      `${operation} timed out after ${timeoutMs}ms`,
      504,
      { operation, timeoutMs },
      false
    );
    this.name = 'TimeoutError';
  }
}

/**
 * CSRF Error - 403 Forbidden
 * Used when CSRF validation fails
 */
export class CSRFError extends AppError {
  constructor(message: string = 'Invalid CSRF token') {
    super('CSRF_ERROR', message, 403, undefined, true);
    this.name = 'CSRFError';
  }
}

/**
 * Tool Execution Error - 422 Unprocessable Entity
 * Used when tool execution fails
 */
export class ToolExecutionError extends AppError {
  constructor(
    toolId: string,
    message: string = 'Tool execution failed',
    details?: Record<string, unknown>
  ) {
    super('TOOL_EXECUTION_ERROR', message, 422, { toolId, ...details }, true);
    this.name = 'ToolExecutionError';
  }
}

/**
 * File Upload Error - 413 Payload Too Large / 415 Unsupported Media Type
 * Used for file upload-related errors
 */
export class FileUploadError extends AppError {
  constructor(
    message: string,
    public fileName?: string,
    public maxSize?: number
  ) {
    super(
      'FILE_UPLOAD_ERROR',
      message,
      message.includes('size') ? 413 : 415,
      { fileName, maxSize },
      true
    );
    this.name = 'FileUploadError';
  }
}

/**
 * Error codes mapping for client-side handling
 */
export const ErrorCodes = {
  // 4xx Client Errors
  VALIDATION_ERROR: 400,
  AUTH_ERROR: 401,
  FORBIDDEN: 403,
  CSRF_ERROR: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOOL_EXECUTION_ERROR: 422,
  FILE_UPLOAD_ERROR: 413,
  RATE_LIMIT: 429,
  
  // 5xx Server Errors
  INTERNAL_ERROR: 500,
  DATABASE_ERROR: 500,
  EXTERNAL_SERVICE_ERROR: 502,
  AI_SERVICE_ERROR: 503,
  TIMEOUT: 504,
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

/**
 * Error handler utility
 * Safely handles unknown errors and converts to AppError
 */
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      'INTERNAL_ERROR',
      error.message,
      500,
      { originalError: error.name },
      false
    );
  }

  return new AppError(
    'INTERNAL_ERROR',
    'An unknown error occurred',
    500,
    { error },
    false
  );
}

/**
 * Async error wrapper
 * Wraps async functions to catch and handle errors
 */
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error);
    }
  };
}

/**
 * Safe execution wrapper
 * Returns a result object instead of throwing
 */
export async function safeExecute<T>(
  operation: () => Promise<T>
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

/**
 * Error logging utility
 */
export function logError(error: AppError, context?: Record<string, unknown>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    isOperational: error.isOperational,
    stack: error.stack,
    details: error.details,
    context,
  };

  if (error.statusCode >= 500) {
    console.error('Server Error:', JSON.stringify(logEntry, null, 2));
  } else {
    console.warn('Client Error:', JSON.stringify(logEntry, null, 2));
  }
}

export default AppError;
