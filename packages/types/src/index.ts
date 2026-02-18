/**
 * Shared TypeScript Types
 * Type definitions used across the entire platform
 */

// ============================================================================
// Tool Types
// ============================================================================

export type InputType = 
  | 'text' 
  | 'number' 
  | 'select' 
  | 'textarea' 
  | 'checkbox' 
  | 'date' 
  | 'color' 
  | 'file' 
  | 'email' 
  | 'url';

export type OutputType = 'text' | 'json' | 'image' | 'textarea' | 'html';

export interface ToolInput {
  id: string;
  name: string;
  type: InputType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  defaultValue?: string | number | boolean;
}

export interface ToolOutput {
  id: string;
  type: OutputType;
  label: string;
  format?: string;
}

export interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc?: string;
  category: string;
  icon?: string;
  featured?: boolean;
  inputs: ToolInput[];
  outputs: ToolOutput[];
  logic: {
    type: 'client' | 'server';
    function?: string;
    endpoint?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface ToolExecutionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  executionTime?: number;
}

// ============================================================================
// Category Types
// ============================================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  toolCount?: number;
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
  updates: boolean;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuthLayer {
  layer: 1 | 2 | 3;
  status: 'pending' | 'verified' | 'failed';
  attempts: number;
  maxAttempts: number;
  lockedUntil?: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// ============================================================================
// API Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rateLimit?: number;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, string | string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// Blog Types
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  categoryId?: string;
  category?: BlogCategory;
  tags: string[];
  authorId: string;
  author?: User;
  seo?: BlogSeo;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsPeriod {
  start: Date;
  end: Date;
}

export interface ToolUsageStats {
  toolId: string;
  toolName: string;
  executions: number;
  uniqueUsers: number;
  avgExecutionTime: number;
  errorRate: number;
}

export interface TrafficStats {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTools: number;
  totalExecutions: number;
  newUsersToday: number;
  popularTools: ToolUsageStats[];
}

// ============================================================================
// AI Types
// ============================================================================

export type AIProvider = 'groq' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
  enabled: boolean;
}

export interface AIUsage {
  id: string;
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  createdAt: Date;
}

export interface ContentGenerationRequest {
  type: 'tool_description' | 'blog_post' | 'seo_meta' | 'faq' | 'how_to';
  prompt: string;
  context?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail?: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultTheme: 'light' | 'dark' | 'system';
  analyticsEnabled: boolean;
  aiEnabled: boolean;
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordMinLength: number;
  requireStrongPassword: boolean;
  sessionTimeout: number;
  mfaEnabled: boolean;
}

// ============================================================================
// File Upload Types
// ============================================================================

export interface FileUpload {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, unknown>;
  uploadedBy?: string;
  createdAt: Date;
}

export interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  path?: string;
}

// ============================================================================
// Audit Log Types
// ============================================================================

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'login' 
  | 'logout' 
  | 'export' 
  | 'import';

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface SelectOption {
  label: string;
  value: string;
}

export interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

export interface ErrorInfo {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  stack?: string;
}

// ============================================================================
// Export all types
// ============================================================================

export * from './index';
