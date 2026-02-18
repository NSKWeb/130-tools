'use client';

import { useState, useCallback, Suspense } from 'react';
import { CardSkeleton } from './skeletons/ToolSkeleton';

/**
 * Tool Renderer Component
 * Dynamically renders tool inputs and handles execution
 */

interface ToolConfig {
  id: string;
  name: string;
  inputs: Array<{
    id: string;
    name: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ label: string; value: string }>;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
      message?: string;
    };
  }>;
  outputs: Array<{
    id: string;
    type: string;
    label: string;
  }>;
  logic: {
    type: 'client' | 'server';
    function?: string;
    endpoint?: string;
  };
}

interface ToolRendererProps {
  config: ToolConfig;
}

export default function ToolRenderer({ config }: ToolRendererProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((id: string, value: any) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
    setError(null);
  }, []);

  const validateInputs = useCallback(() => {
    for (const input of config.inputs) {
      if (input.required && !inputs[input.id]) {
        return `${input.label} is required`;
      }
      
      if (input.validation && inputs[input.id]) {
        const value = inputs[input.id];
        
        if (input.validation.min !== undefined && value < input.validation.min) {
          return input.validation.message || `${input.label} must be at least ${input.validation.min}`;
        }
        
        if (input.validation.max !== undefined && value > input.validation.max) {
          return input.validation.message || `${input.label} must be at most ${input.validation.max}`;
        }
        
        if (input.validation.pattern && !new RegExp(input.validation.pattern).test(value)) {
          return input.validation.message || `${input.label} format is invalid`;
        }
      }
    }
    return null;
  }, [config.inputs, inputs]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (config.logic.type === 'client') {
        // Client-side execution would use the tool engine
        // For now, simulate with API call
        const response = await fetch(`/api/tools/${config.id}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs }),
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Execution failed');
        }
        
        setResult(data.data);
      } else {
        // Server-side execution
        const response = await fetch(config.logic.endpoint || `/api/tools/${config.id}/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs }),
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Execution failed');
        }
        
        setResult(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [config, inputs, validateInputs]);

  const renderInput = (input: ToolConfig['inputs'][0]) => {
    const baseClasses = `w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed`;

    switch (input.type) {
      case 'select':
        return (
          <select
            id={input.id}
            name={input.name}
            value={inputs[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            className={baseClasses}
            required={input.required}
          >
            <option value="">Select...</option>
            {input.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            id={input.id}
            name={input.name}
            value={inputs[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            className={`${baseClasses} min-h-[100px]`}
            required={input.required}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={input.id}
            name={input.name}
            checked={!!inputs[input.id]}
            onChange={(e) => handleInputChange(input.id, e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            required={input.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={input.id}
            name={input.name}
            value={inputs[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value))}
            placeholder={input.placeholder}
            min={input.validation?.min}
            max={input.validation?.max}
            className={baseClasses}
            required={input.required}
          />
        );

      default:
        return (
          <input
            type={input.type}
            id={input.id}
            name={input.name}
            value={inputs[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            className={baseClasses}
            required={input.required}
          />
        );
    }
  };

  const renderOutput = (output: ToolConfig['outputs'][0], value: any) => {
    switch (output.type) {
      case 'json':
        return (
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm font-mono">
            {JSON.stringify(value, null, 2)}
          </pre>
        );

      case 'textarea':
        return (
          <textarea
            readOnly
            value={value || ''}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-[100px]"
          />
        );

      case 'html':
        return (
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        );

      default:
        return (
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            {value}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6" data-testid="tool-form">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Fields */}
        <div className="space-y-4">
          {config.inputs.map((input) => (
            <div key={input.id} className="space-y-2">
              <label 
                htmlFor={input.id}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderInput(input)}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300" data-testid="error-message">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          data-testid="calculate-button"
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Calculate'
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700" data-testid="result">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Results</h2>
          <div className="space-y-4">
            {config.outputs.map((output) => (
              <div key={output.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {output.label}
                </label>
                {renderOutput(output, result[output.id])}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
