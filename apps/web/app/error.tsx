'use client';

import { useEffect } from 'react';

/**
 * Global Error Boundary for Web Application
 * Catches and handles all unhandled errors in the app
 */

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to monitoring service
    logError(error);
  }, [error]);

  const logError = (err: Error & { digest?: string }) => {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: err.message,
      stack: err.stack,
      digest: err.digest,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    };

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary Caught:', errorInfo);
    }

    // Send to error tracking in production
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Sentry.captureException(err, { extra: errorInfo });
    }

    // Send to your logging endpoint
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo),
    }).catch(() => {
      // Silent fail for logging
    });
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* Error Icon */}
        <div className="bg-red-500 dark:bg-red-600 p-6 flex justify-center">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            We&apos;re sorry, but an unexpected error occurred. Our team has been notified and is working to fix the issue.
          </p>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Error Details:
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
              {error.stack && (
                <pre className="mt-3 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40 p-2 bg-white dark:bg-gray-950 rounded">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
            
            <button
              onClick={handleRefresh}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
            >
              Refresh Page
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
            >
              Go Back Home
            </button>
          </div>

          {/* Support Link */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-500">
            If the problem persists, please{' '}
            <a 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
