/**
 * Theme Selector Component
 * Grid of theme cards with previews for easy theme switching
 */

'use client';

import React from 'react';
import { Theme } from '@130tools/ui/src/components/theme/theme-types';
import { themeList, getThemesByCategory } from '@130tools/ui/src/components/theme/theme-definitions';
import { useThemeStore } from '../../lib/theme-store';
import { cn } from '@130tools/ui/src/lib/utils';

interface ThemeSelectorProps {
  className?: string;
  onThemeSelect?: (themeId: string) => void;
}

export function ThemeSelector({ className, onThemeSelect }: ThemeSelectorProps) {
  const { currentTheme, setTheme, getTheme, getUserThemes } = useThemeStore();
  const themes = getUserThemes();

  const handleThemeClick = async (themeId: string) => {
    await setTheme(themeId);
    onThemeSelect?.(themeId);
  };

  const categories = [
    { id: 'aesthetic', label: 'Aesthetic' },
    { id: 'eye-friendly', label: 'Eye-Friendly' },
    { id: 'medical', label: 'Medical' },
    { id: 'child-friendly', label: 'Child-Friendly' },
    { id: 'business', label: 'Business' },
    { id: 'accessibility', label: 'Accessibility' },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              'bg-muted hover:bg-muted/80 text-muted-foreground'
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isActive={currentTheme.id === theme.id}
            onClick={() => handleThemeClick(theme.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, isActive, onClick }: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full p-4 rounded-xl transition-all duration-200',
        'border-2 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2',
        isActive
          ? 'border-primary ring-2 ring-primary/20 shadow-lg'
          : 'border-border hover:border-primary/50'
      )}
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Theme Preview */}
      <div
        className="h-20 rounded-lg mb-3 overflow-hidden relative"
        style={{
          backgroundColor: theme.colors.card,
        }}
      >
        {/* Color Bars */}
        <div className="absolute inset-0 flex">
          <div
            className="flex-1"
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: theme.colors.secondary }}
          />
        </div>

        {/* Card Mockup */}
        <div className="absolute inset-0 p-2 flex flex-col justify-end">
          <div
            className="h-6 rounded"
            style={{
              backgroundColor: theme.colors.background,
              opacity: 0.9,
            }}
          >
            <div
              className="h-2 w-12 rounded mt-1 mx-auto"
              style={{ backgroundColor: theme.colors.primary }}
            />
          </div>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute top-2 right-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
              }}
            >
              ✓
            </div>
          </div>
        )}
      </div>

      {/* Theme Info */}
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="text-lg">{theme.preview.icon}</span>
          <span
            className="font-medium text-sm"
            style={{
              color: theme.colors.foreground,
            }}
          >
            {theme.name}
          </span>
        </div>
        <p
          className="text-xs mt-1 line-clamp-2"
          style={{
            color: theme.colors.mutedForeground,
          }}
        >
          {theme.preview.description}
        </p>
      </div>
    </button>
  );
}

export default ThemeSelector;