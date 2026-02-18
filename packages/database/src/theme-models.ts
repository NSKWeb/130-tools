/**
 * Theme Models for Prisma
 * Database models for theme persistence and customization
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

export interface ThemeSettings {
  autoSwitch: boolean;
  autoSwitchTime?: 'sunrise' | 'sunset' | 'custom';
  customSwitchTime?: string;
  followSystem: boolean;
  transitionDuration: number;
  enableAnimations: boolean;
}

// User Theme Preference
export interface UserThemePreference {
  id: string;
  userId: string;
  themeId: string;
  customColors?: ThemeColors;
  customFonts?: ThemeFonts;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Custom Theme
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
  // Relations
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Theme Settings
export interface UserThemeSettings {
  id: string;
  userId: string;
  autoSwitch: boolean;
  autoSwitchTime?: 'sunrise' | 'sunset' | 'custom';
  customSwitchTime?: string;
  followSystem: boolean;
  transitionDuration: number;
  enableAnimations: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Theme Usage Analytics
export interface ThemeUsage {
  id: string;
  userId: string;
  themeId: string;
  sessionId?: string;
  durationSeconds: number;
  switchedFrom?: string;
  switchedAt: Date;
  // Relations
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// Prisma schema additions (add to existing schema.prisma)
// These should be added to the main schema file:

/*
model UserThemePreference {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  themeId       String   @map("theme_id")
  customColors  Json?    @map("custom_colors")
  customFonts   Json?    @map("custom_fonts")
  isDefault     Boolean  @default(false) @map("is_default")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, themeId])
  @@map("user_theme_preferences")
}

model CustomTheme {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  name          String
  colors        Json
  fonts         Json
  effects       Json
  isPublic      Boolean  @default(false) @map("is_public")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("custom_themes")
}

model ThemeSettings {
  id                  String   @id @default(cuid())
  userId              String   @unique @map("user_id")
  autoSwitch          Boolean  @default(false) @map("auto_switch")
  autoSwitchTime      String?  @map("auto_switch_time")
  customSwitchTime    String?  @map("custom_switch_time")
  followSystem        Boolean  @default(true) @map("follow_system")
  transitionDuration  Int      @default(300) @map("transition_duration")
  enableAnimations    Boolean  @default(true) @map("enable_animations")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("theme_settings")
}

model ThemeUsage {
  id              String   @id @default(cuid())
  userId          String   @map("user_id")
  themeId         String   @map("theme_id")
  sessionId       String?  @map("session_id")
  durationSeconds Int      @default(0) @map("duration_seconds")
  switchedFrom    String?  @map("switched_from")
  switchedAt      DateTime @default(now()) @map("switched_at")

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("theme_usage_analytics")
}
*/