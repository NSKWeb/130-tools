import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized Image Component
 * Wrapper around Next.js Image with loading states and error handling
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Default blur placeholder (tiny transparent pixel)
const DEFAULT_BLUR_DATAURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  containerClassName = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  placeholder = 'blur',
  blurDataURL = DEFAULT_BLUR_DATAURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Error state fallback
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${containerClassName}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <div className="text-center p-4">
          <svg 
            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName} ${isLoading ? 'animate-pulse' : ''}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        loading={priority ? 'eager' : 'lazy'}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        className={`
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${className}
        `}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      )}
    </div>
  );
}

/**
 * Avatar image component
 * Optimized for profile pictures and avatars
 */
interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  fallback,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const sizeClass = sizeClasses[size];

  // Generate initials from alt text
  const initials = fallback || alt
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Background color based on initials
  const bgColorClass = getAvatarColor(alt);

  if (!src || hasError) {
    return (
      <div 
        className={`
          ${sizeClass} 
          ${bgColorClass}
          rounded-full 
          flex items-center justify-center 
          text-white font-medium
          ${className}
        `}
      >
        <span className="text-xs">{initials}</span>
      </div>
    );
  }

  return (
    <div className={`${sizeClass} relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={size === 'xs' ? '24px' : size === 'sm' ? '32px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : '96px'}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

/**
 * Generate consistent avatar color based on name
 */
function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Icon image component
 * For small icons with fixed dimensions
 */
interface IconImageProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

export function IconImage({ src, alt, size = 24, className = '' }: IconImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      loading="lazy"
    />
  );
}

export default OptimizedImage;
