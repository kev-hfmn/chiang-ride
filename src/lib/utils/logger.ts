/**
 * Centralized logging utility for development and production environments.
 * Replaces console.log/error/warn with structured logging.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Structured logger that only logs in development mode.
 * In production, errors are logged but info/debug are suppressed.
 */
export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, context || '');
    }
  },

  /**
   * Log warning messages
   */
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context || '');
  },

  /**
   * Log error messages with optional error object
   */
  error: (message: string, error?: unknown, context?: LogContext) => {
    const errorDetails = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    
    console.error(`[ERROR] ${message}`, {
      error: errorDetails,
      ...context,
    });
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  },
};
