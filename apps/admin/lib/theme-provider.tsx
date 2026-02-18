/**
 * Theme Provider
 * Wraps the application with theme context
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useThemeStore, initializeThemeAutoSwitch } from '../theme-store';
import { Theme } from '@130tools/ui/src/components/theme/theme-types';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (themeId: string) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const { currentTheme, setTheme, isLoading } = useThemeStore();

  useEffect(() => {
    setIsClient(true);
    
    // Apply theme to DOM
    const { applyThemeToDOM } = useThemeStore.getState();
    applyThemeToDOM(currentTheme);

    // Initialize auto-switch
    const cleanup = initializeThemeAutoSwitch();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (isClient) {
      const { applyThemeToDOM } = useThemeStore.getState();
      applyThemeToDOM(currentTheme);
    }
  }, [currentTheme, isClient]);

  // Prevent hydration mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme,
        isLoading,
      }}
    >
      <div
        className="theme-wrapper"
        style={{
          '--theme-primary': currentTheme.colors.primary,
          '--theme-primary-foreground': currentTheme.colors.primaryForeground,
          '--theme-secondary': currentTheme.colors.secondary,
          '--theme-secondary-foreground': currentTheme.colors.secondaryForeground,
          '--theme-accent': currentTheme.colors.accent,
          '--theme-accent-foreground': currentTheme.colors.accentForeground,
          '--theme-background': currentTheme.colors.background,
          '--theme-foreground': currentTheme.colors.foreground,
          '--theme-card': currentTheme.colors.card,
          '--theme-card-foreground': currentTheme.colors.cardForeground,
          '--theme-popover': currentTheme.colors.popover,
          '--theme-popover-foreground': currentTheme.colors.popoverForeground,
          '--theme-muted': currentTheme.colors.muted,
          '--theme-muted-foreground': currentTheme.colors.mutedForeground,
          '--theme-border': currentTheme.colors.border,
          '--theme-input': currentTheme.colors.input,
          '--theme-ring': currentTheme.colors.ring,
          '--theme-destructive': currentTheme.colors.destructive,
          '--theme-destructive-foreground': currentTheme.colors.destructiveForeground,
          '--theme-success': currentTheme.colors.success,
          '--theme-success-foreground': currentTheme.colors.successForeground,
          '--theme-warning': currentTheme.colors.warning,
          '--theme-warning-foreground': currentTheme.colors.warningForeground,
          '--theme-info': currentTheme.colors.info,
          '--theme-info-foreground': currentTheme.colors.infoForeground,
          '--theme-font-heading': currentTheme.fonts.heading,
          '--theme-font-body': currentTheme.fonts.body,
          '--theme-font-mono': currentTheme.fonts.mono,
          '--theme-radius': currentTheme.effects.borderRadius,
          '--theme-shadow': currentTheme.effects.boxShadow,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useCurrentTheme() {
  const { theme, isLoading } = useTheme();
  return { theme, isLoading };
}