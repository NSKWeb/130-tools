/**
 * Quick Theme Toggle Component
 * Compact theme switcher for the sidebar
 */

'use client';

import React, { useState } from 'react';
import { useThemeStore } from '../../lib/theme-store';
import { Button } from '@130tools/ui/src/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@130tools/ui/src/components/ui/popover';
import { ScrollArea } from '@130tools/ui/src/components/ui/scroll-area';
import { cn } from '@130tools/ui/src/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { currentTheme, setTheme, getTheme, getUserThemes } = useThemeStore();
  const [open, setOpen] = useState(false);
  const themes = getUserThemes();
  const currentThemeId = currentTheme.id;

  const handleThemeSelect = async (themeId: string) => {
    await setTheme(themeId);
    setOpen(false);
  };

  // Get a few popular themes for quick access
  const popularThemes = themes.filter(t => 
    ['midnight-dark', 'light', 'ocean-blue', 'forest-green'].includes(t.id)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start gap-2 font-normal',
            className
          )}
          title={`Current theme: ${currentTheme.name}`}
        >
          <span className="text-lg">{currentTheme.preview.icon}</span>
          <span className="flex-1 text-left truncate">
            {currentTheme.name}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side="right" 
        className="w-80 p-0"
        align="start"
      >
        <div className="border-b p-3">
          <h4 className="font-semibold text-sm">Switch Theme</h4>
          <p className="text-xs text-muted-foreground">
            Choose from our collection of themes
          </p>
        </div>
        
        <ScrollArea className="max-h-96">
          {/* Popular Themes */}
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">
              Popular Themes
            </p>
            <div className="space-y-1">
              {popularThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors',
                    currentThemeId === theme.id && 'bg-muted'
                  )}
                >
                  <div
                    className="w-8 h-8 rounded border flex-shrink-0 overflow-hidden"
                    style={{ borderColor: theme.colors.border }}
                  >
                    <div className="flex h-full">
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
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{theme.preview.icon}</span>
                      <span className="text-sm font-medium truncate">
                        {theme.name}
                      </span>
                      {currentThemeId === theme.id && (
                        <div className="w-2 h-2 rounded-full bg-primary ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {theme.preview.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* All Themes */}
          <div className="p-2 border-t">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-2">
              All Themes
            </p>
            <div className="grid grid-cols-2 gap-2 px-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={cn(
                    'p-2 rounded-md border-2 transition-all hover:scale-105',
                    currentThemeId === theme.id 
                      ? 'border-primary' 
                      : 'border-border hover:border-primary/50'
                  )}
                  style={{
                    backgroundColor: theme.colors.background,
                  }}
                  title={theme.name}
                >
                  <div
                    className="h-12 rounded mb-2 overflow-hidden relative"
                    style={{ backgroundColor: theme.colors.card }}
                  >
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
                  </div>
                  <div className="text-xs font-medium truncate text-center">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              setOpen(false);
              // Navigate to theme settings
              window.location.href = '/dashboard/settings/appearance';
            }}
          >
            More Theme Options
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeToggle;