import {
  AppError,
  ValidationError,
  FieldValidationError,
  AuthenticationError,
  AuthorizationError,
  RateLimitError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  AIServiceError,
  TimeoutError,
  CSRFError,
  ToolExecutionError,
  FileUploadError,
  handleError,
  asyncHandler,
  safeExecute,
  logError,
} from '../index';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create base error with all properties', () => {
      const error = new AppError(
        'TEST_ERROR',
        'Test message',
        500,
        { extra: 'data' },
        true
      );

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test message');
      expect(error.statusCode).toBe(500);
      expect(error.details).toEqual({ extra: 'data' });
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
    });

    it('should convert to JSON format', () => {
      const error = new AppError('TEST', 'Message', 400, { field: 'value' });
      const json = error.toJSON();

      expect(json.error.code).toBe('TEST');
      expect(json.error.message).toBe('Message');
      expect(json.error.details).toEqual({ field: 'value' });
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with default status', () => {
      const error = new ValidationError('Invalid input');

      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should include validation details', () => {
      const error = new ValidationError('Field error', { field: 'email' });
      expect(error.details).toEqual({ field: 'email' });
    });
  });

  describe('FieldValidationError', () => {
    it('should include field name in details', () => {
      const error = new FieldValidationError('email', 'Invalid email format');

      expect(error.field).toBe('email');
      expect(error.details).toEqual({ field: 'email' });
      expect(error.statusCode).toBe(400);
    });
  });

  describe('AuthenticationError', () => {
    it('should create auth error with default message', () => {
      const error = new AuthenticationError();

      expect(error.code).toBe('AUTH_ERROR');
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should accept custom message', () => {
      const error = new AuthenticationError('Session expired');
      expect(error.message).toBe('Session expired');
    });
  });

  describe('AuthorizationError', () => {
    it('should include required permission', () => {
      const error = new AuthorizationError('Admin access required', 'admin');

      expect(error.code).toBe('FORBIDDEN');
      expect(error.statusCode).toBe(403);
      expect(error.requiredPermission).toBe('admin');
      expect(error.details).toEqual({ requiredPermission: 'admin' });
    });
  });

  describe('RateLimitError', () => {
    it('should include retry after time', () => {
      const error = new RateLimitError('Too many requests', 120);

      expect(error.code).toBe('RATE_LIMIT');
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(120);
      expect(error.details).toEqual({ retryAfter: 120 });
    });

    it('should use default retry time', () => {
      const error = new RateLimitError();
      expect(error.retryAfter).toBe(60);
    });
  });

  describe('NotFoundError', () => {
    it('should format message with identifier', () => {
      const error = new NotFoundError('User', '123');

      expect(error.code).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("User with id '123' not found");
    });

    it('should format message without identifier', () => {
      const error = new NotFoundError('Resource');
      expect(error.message).toBe('Resource not found');
    });
  });

  describe('ConflictError', () => {
    it('should create conflict error', () => {
      const error = new ConflictError('Email already exists', { field: 'email' });

      expect(error.code).toBe('CONFLICT');
      expect(error.statusCode).toBe(409);
      expect(error.details).toEqual({ field: 'email' });
    });
  });

  describe('DatabaseError', () => {
    it('should be non-operational by default', () => {
      const error = new DatabaseError('Connection failed');

      expect(error.code).toBe('DATABASE_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
    });
  });

  describe('ExternalServiceError', () => {
    it('should include service name', () => {
      const error = new ExternalServiceError('Stripe', 'Payment failed');

      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(error.statusCode).toBe(502);
      expect(error.message).toBe('Stripe: Payment failed');
      expect(error.details).toEqual({ service: 'Stripe' });
    });
  });

  describe('AIServiceError', () => {
    it('should include provider name', () => {
      const error = new AIServiceError('OpenAI', 'Model unavailable');

      expect(error.code).toBe('AI_SERVICE_ERROR');
      expect(error.statusCode).toBe(503);
      expect(error.details).toEqual({ provider: 'OpenAI' });
    });
  });

  describe('TimeoutError', () => {
    it('should format timeout message', () => {
      const error = new TimeoutError('Database query', 5000);

      expect(error.code).toBe('TIMEOUT');
      expect(error.statusCode).toBe(504);
      expect(error.message).toBe('Database query timed out after 5000ms');
      expect(error.details).toEqual({ operation: 'Database query', timeoutMs: 5000 });
    });
  });

  describe('CSRFError', () => {
    it('should create CSRF error', () => {
      const error = new CSRFError();

      expect(error.code).toBe('CSRF_ERROR');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Invalid CSRF token');
    });
  });

  describe('ToolExecutionError', () => {
    it('should include tool ID', () => {
      const error = new ToolExecutionError('bmi-calculator', 'Invalid input');

      expect(error.code).toBe('TOOL_EXECUTION_ERROR');
      expect(error.statusCode).toBe(422);
      expect(error.details).toEqual({ toolId: 'bmi-calculator' });
    });
  });

  describe('FileUploadError', () => {
    it('should set 413 status for size errors', () => {
      const error = new FileUploadError('File too large', 'file.pdf', 10485760);
      expect(error.statusCode).toBe(413);
    });

    it('should set 415 status for type errors', () => {
      const error = new FileUploadError('Invalid file type');
      expect(error.statusCode).toBe(415);
    });
  });
});

describe('Error Utilities', () => {
  describe('handleError', () => {
    it('should return AppError as-is', () => {
      const original = new ValidationError('Test');
      const result = handleError(original);

      expect(result).toBe(original);
    });

    it('should wrap standard Error', () => {
      const original = new Error('Something went wrong');
      const result = handleError(original);

      expect(result).toBeInstanceOf(AppError);
      expect(result.code).toBe('INTERNAL_ERROR');
      expect(result.message).toBe('Something went wrong');
    });

    it('should wrap unknown errors', () => {
      const result = handleError('string error');

      expect(result).toBeInstanceOf(AppError);
      expect(result.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('asyncHandler', () => {
    it('should return function result on success', async () => {
      const fn = async () => 'success';
      const handled = asyncHandler(fn);

      const result = await handled();
      expect(result).toBe('success');
    });

    it('should convert thrown error to AppError', async () => {
      const fn = async () => {
        throw new Error('Async error');
      };
      const handled = asyncHandler(fn);

      await expect(handled()).rejects.toBeInstanceOf(AppError);
    });
  });

  describe('safeExecute', () => {
    it('should return success result', async () => {
      const result = await safeExecute(async () => 'data');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('data');
      }
    });

    it('should return error result on failure', async () => {
      const result = await safeExecute(async () => {
        throw new Error('Failed');
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AppError);
      }
    });
  });

  describe('logError', () => {
    it('should log error without throwing', () => {
      const error = new ValidationError('Test error');
      
      expect(() => logError(error)).not.toThrow();
    });

    it('should log error with context', () => {
      const error = new ValidationError('Test error');
      const context = { userId: '123' };
      
      expect(() => logError(error, context)).not.toThrow();
    });
  });
});
