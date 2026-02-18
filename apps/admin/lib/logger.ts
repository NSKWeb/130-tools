/**
 * Logger Utility
 * Centralized logging with structured output and multiple log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : undefined,
    };
  }

  private output(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print in development
      const colors: Record<LogLevel, string> = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
        fatal: '\x1b[35m', // Magenta
      };
      const reset = '\x1b[0m';
      
      console.log(
        `${colors[entry.level]}[${entry.timestamp}] ${entry.level.toUpperCase()}:${reset} ${entry.message}`,
        entry.context || '',
        entry.error || ''
      );
    } else {
      // Structured JSON in production
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      this.output(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      this.output(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      this.output(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('error')) {
      this.output(this.formatMessage('error', message, context, error));
    }
  }

  fatal(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('fatal')) {
      this.output(this.formatMessage('fatal', message, context, error));
    }
    // Fatal errors should also trigger any alerting mechanisms
    if (!this.isDevelopment) {
      // Send to error tracking service (e.g., Sentry)
      this.sendToErrorTracking(message, error, context);
    }
  }

  private sendToErrorTracking(message: string, error?: Error, context?: LogContext): void {
    // Integration with Sentry or similar would go here
    if (process.env.SENTRY_DSN) {
      // Sentry.captureException(error || new Error(message), { extra: context });
    }
  }

  // Audit logging for security events
  audit(action: string, userId: string, details: LogContext): void {
    this.output(this.formatMessage('info', `AUDIT: ${action}`, {
      userId,
      action,
      ...details,
    }));
  }

  // Performance logging
  performance(operation: string, durationMs: number, context?: LogContext): void {
    this.output(this.formatMessage('debug', `PERF: ${operation}`, {
      operation,
      durationMs,
      ...context,
    }));
  }
}

export const logger = new Logger();
export default logger;
