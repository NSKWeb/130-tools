'use client';

import { useEffect } from 'react';

/**
 * Global Error Boundary for Admin Dashboard
 * Handles errors specific to admin operations
 */

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to admin monitoring
    logError(error);
  }, [error]);

  const logError = (err: Error & { digest?: string }) => {
    const errorInfo = {
      source: 'admin-dashboard',
      timestamp: new Date().toISOString(),
      message: err.message,
      stack: err.stack,
      digest: err.digest,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    };

    console.error('Admin Error:', errorInfo);

    // Send to admin error endpoint
    fetch('/api/admin/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorInfo),
    }).catch(() => {
      // Silent fail
    });
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Clear session and redirect to auth
      document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/auth';
    }
  };

  const handleDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  // Check if it's an authentication error
  const isAuthError = error.message?.toLowerCase().includes('auth') ||
                      error.message?.toLowerCase().includes('session') ||
                      error.message?.toLowerCase().includes('unauthorized');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`p-6 flex justify-center ${isAuthError ? 'bg-amber-500' : 'bg-red-500'}`}>
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isAuthError ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            )}
          </svg>
        </div>

        {/* Content */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            {isAuthError ? 'Session Expired' : 'Admin Error'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            {isAuthError 
              ? 'Your session has expired or is invalid. Please log in again to continue.'
              : 'An error occurred in the admin dashboard. Please try again or contact support.'}
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
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isAuthError && (
              <button
                onClick={reset}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            )}
            
            {!isAuthError && (
              <button
                onClick={handleDashboard}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
              >
                Go to Dashboard
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className={`w-full px-4 py-3 font-medium rounded-lg transition-colors duration-200 ${
                isAuthError
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isAuthError ? 'Log In Again' : 'Log Out'}
            </button>
          </div>

          {/* Admin Support */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Need help?</span>{' '}
              Contact the system administrator or check the{' '}
              <a 
                href="/admin/docs" 
                className="underline hover:no-underline"
              >
                documentation
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
