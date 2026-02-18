/**
 * Theme Store - Zustand store for theme management
 * Handles theme switching, persistence, and customization
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Theme, CustomTheme, ThemeSettings } from '@130tools/ui/src/components/theme/theme-types';
import { themes, themeList, getThemeById, defaultThemeId } from '@130tools/ui/src/components/theme/theme-definitions';

interface ThemeStore {
  // State
  currentTheme: Theme;
  customThemes: CustomTheme[];
  themeSettings: ThemeSettings;
  isLoading: boolean;

  // Actions
  setTheme: (themeId: string) => Promise<void>;
  setCurrentTheme: (theme: Theme) => void;
  createCustomTheme: (theme: Omit<CustomTheme, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => CustomTheme;
  updateCustomTheme: (id: string, updates: Partial<CustomTheme>) => void;
  deleteCustomTheme: (id: string) => void;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  getTheme: (themeId: string) => Theme | undefined;
  getAllThemes: () => Theme[];
  getUserThemes: () => (Theme | CustomTheme)[];
  resetToDefault: () => void;
  applyThemeToDOM: (theme: Theme) => void;
}

const defaultThemeSettings: ThemeSettings = {
  autoSwitch: false,
  followSystem: true,
  transitionDuration: 300,
  enableAnimations: true,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTheme: getThemeById(defaultThemeId) || themeList[0],
      customThemes: [],
      themeSettings: defaultThemeSettings,
      isLoading: false,

      // Set theme with persistence
      setTheme: async (themeId: string) => {
        set({ isLoading: true });
        try {
          const theme = get().getTheme(themeId);
          if (theme) {
            set({ currentTheme: theme, isLoading: false });
            get().applyThemeToDOM(theme);
          }
        } catch (error) {
          console.error('Failed to set theme:', error);
          set({ isLoading: false });
        }
      },

      // Set current theme directly
      setCurrentTheme: (theme: Theme) => {
        set({ currentTheme: theme });
        get().applyThemeToDOM(theme);
      },

      // Create custom theme
      createCustomTheme: (themeData) => {
        const customTheme: CustomTheme = {
          ...themeData,
          id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: 'current_user', // TODO: Get from auth context
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          customThemes: [...state.customThemes, customTheme],
        }));
        return customTheme;
      },

      // Update custom theme
      updateCustomTheme: (id: string, updates: Partial<CustomTheme>) => {
        set((state) => ({
          customThemes: state.customThemes.map((theme) =>
            theme.id === id
              ? { ...theme, ...updates, updatedAt: new Date() }
              : theme
          ),
        }));
      },

      // Delete custom theme
      deleteCustomTheme: (id: string) => {
        set((state) => ({
          customThemes: state.customThemes.filter((theme) => theme.id !== id),
        }));
      },

      // Update theme settings
      updateThemeSettings: (settings: Partial<ThemeSettings>) => {
        set((state) => ({
          themeSettings: { ...state.themeSettings, ...settings },
        }));
      },

      // Get theme by ID
      getTheme: (themeId: string) => {
        const state = get();
        // First check built-in themes
        const builtInTheme = getThemeById(themeId);
        if (builtInTheme) return builtInTheme;

        // Then check custom themes
        return state.customThemes.find((theme) => theme.id === themeId);
      },

      // Get all themes (built-in + custom)
      getAllThemes: () => {
        return [...themeList, ...get().customThemes];
      },

      // Get themes available to current user
      getUserThemes: () => {
        const state = get();
        return [...themeList, ...state.customThemes];
      },

      // Reset to default theme
      resetToDefault: () => {
        const defaultTheme = getThemeById(defaultThemeId);
        if (defaultTheme) {
          set({
            currentTheme: defaultTheme,
            customThemes: [],
            themeSettings: defaultThemeSettings,
          });
          get().applyThemeToDOM(defaultTheme);
        }
      },

      // Apply theme to DOM
      applyThemeToDOM: (theme: Theme) => {
        if (typeof window === 'undefined') return;

        const root = document.documentElement;
        const body = document.body;

        // Apply CSS variables to root
        const colors = theme.colors;
        const effects = theme.effects;

        // Apply color variables
        Object.entries(colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
        });

        // Apply font variables
        const fonts = theme.fonts;
        root.style.setProperty('--font-heading', fonts.heading);
        root.style.setProperty('--font-body', fonts.body);
        root.style.setProperty('--font-mono', fonts.mono);

        // Apply effect variables
        root.style.setProperty('--radius', effects.borderRadius);
        root.style.setProperty('--shadow', effects.boxShadow);

        // Apply transition settings
        if (effects.transitions) {
          body.classList.add('theme-transitions');
        } else {
          body.classList.remove('theme-transitions');
        }

        // Apply animation settings
        if (effects.animations && state.themeSettings.enableAnimations) {
          body.classList.add('theme-animations');
        } else {
          body.classList.remove('theme-animations');
        }

        // Set theme class for additional styling
        body.setAttribute('data-theme', theme.id);
        body.className = body.className.replace(/theme-\w+/g, '');
        body.classList.add(`theme-${theme.id}`);

        // Dispatch custom event for theme change
        window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        customThemes: state.customThemes,
        themeSettings: state.themeSettings,
      }),
    }
  )
);

// Auto-switch theme based on time/system preferences
export const initializeThemeAutoSwitch = () => {
  if (typeof window === 'undefined') return;

  const store = useThemeStore.getState();
  const { themeSettings } = store;

  // Follow system preference
  if (themeSettings.followSystem) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const isDark = e.matches;
      // Switch between light and dark themes based on system preference
      const systemThemeId = isDark ? 'midnight-dark' : 'light';
      const systemTheme = store.getTheme(systemThemeId);
      if (systemTheme) {
        store.setCurrentTheme(systemTheme);
      }
    };

    mediaQuery.addListener(handleChange);
    handleChange(mediaQuery);

    return () => mediaQuery.removeListener(handleChange);
  }

  // Auto-switch based on time
  if (themeSettings.autoSwitch) {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      let themeId: string;
      
      if (themeSettings.autoSwitchTime === 'sunrise') {
        themeId = hour >= 6 && hour < 18 ? 'light' : 'midnight-dark';
      } else if (themeSettings.autoSwitchTime === 'sunset') {
        themeId = hour >= 7 && hour < 19 ? 'light' : 'midnight-dark';
      } else {
        // Custom time
        const switchTime = themeSettings.customSwitchTime || '18:00';
        const [switchHour] = switchTime.split(':').map(Number);
        themeId = hour >= switchHour ? 'midnight-dark' : 'light';
      }

      const theme = store.getTheme(themeId);
      if (theme && theme.id !== store.currentTheme.id) {
        store.setCurrentTheme(theme);
      }
    };

    const interval = setInterval(checkTime, 60000); // Check every minute
    checkTime(); // Initial check

    return () => clearInterval(interval);
  }
};

// Hook for theme initialization on mount
export const useThemeInit = () => {
  if (typeof window !== 'undefined') {
    // Apply current theme on mount
    const { currentTheme, applyThemeToDOM } = useThemeStore.getState();
    applyThemeToDOM(currentTheme);

    // Initialize auto-switch
    initializeThemeAutoSwitch();
  }
};