'use client';

import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ToolSkeleton } from '@/components/skeletons/ToolSkeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load the tool renderer for code splitting
const ToolRenderer = lazy(() => import('@/components/ToolRenderer'));

/**
 * Tool Page
 * Dynamically renders tool based on slug parameter
 * Implements code splitting for performance optimization
 */

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [toolConfig, setToolConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTool() {
      try {
        const response = await fetch(`/api/tools/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Tool not found');
          }
          throw new Error('Failed to load tool');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to load tool');
        }
        
        setToolConfig(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadTool();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ToolSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Tool
          </h1>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!toolConfig) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-amber-800 dark:text-amber-200">
            Tool Not Found
          </h1>
          <p className="mt-2 text-amber-600 dark:text-amber-400">
            The tool you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Tool Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {toolConfig.icon && (
            <span className="text-4xl" role="img" aria-label={toolConfig.name}>
              {toolConfig.icon}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {toolConfig.name}
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {toolConfig.description}
        </p>
      </div>

      {/* Tool Renderer with Suspense */}
      <ErrorBoundary>
        <Suspense fallback={<ToolSkeleton />}>
          <ToolRenderer config={toolConfig} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
