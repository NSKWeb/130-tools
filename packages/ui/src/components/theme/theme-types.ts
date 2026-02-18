/**
 * Theme System Type Definitions
 * Defines the structure for the comprehensive theme system
 */

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  mono: string;
}

export interface ThemeEffects {
  borderRadius: string;
  boxShadow: string;
  transitions: boolean;
  animations: boolean;
}

export interface ThemePreview {
  icon: string;
  description: string;
  colorScheme: 'light' | 'dark' | 'auto';
  category: 'aesthetic' | 'eye-friendly' | 'medical' | 'child-friendly' | 'business' | 'accessibility' | 'specialty';
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  effects: ThemeEffects;
  preview: ThemePreview;
}

export interface UserTheme {
  id: string;
  userId: string;
  themeId: string;
  customColors?: Partial<ThemeColors>;
  customFonts?: Partial<ThemeFonts>;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomTheme {
  id: string;
  userId: string;
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  effects: ThemeEffects;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeSettings {
  autoSwitch: boolean;
  autoSwitchTime?: 'sunrise' | 'sunset' | 'custom';
  customSwitchTime?: string;
  followSystem: boolean;
  transitionDuration: number;
  enableAnimations: boolean;
}