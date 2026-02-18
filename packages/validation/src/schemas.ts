import { z } from 'zod';

/**
 * Tool Input Validation Schema
 * Validates tool execution requests
 */
export const toolInputSchema = z.object({
  toolId: z.string().uuid(),
  inputs: z.record(z.unknown()),
});

/**
 * Layer 1 Authentication Schema
 * Validates security question answers
 */
export const layer1Schema = z.object({
  userId: z.string().uuid(),
  answer: z.string().min(1).max(255).trim(),
});

/**
 * Layer 2 Authentication Schema
 * Validates password authentication
 */
export const layer2Schema = z.object({
  sessionToken: z.string().length(64),
  password: z.string().min(12).max(128),
});

/**
 * Layer 3 Authentication Schema
 * Validates access key (format: ABC-1234)
 */
export const layer3Schema = z.object({
  sessionToken: z.string().length(64),
  accessKey: z.string().regex(/^[A-Z0-9]{3}-[0-9]{4}$/, 'Access key must be in format ABC-1234'),
});

/**
 * User Login Schema
 * Validates user login credentials
 */
export const loginSchema = z.object({
  email: z.string().email().max(255).trim().toLowerCase(),
  password: z.string().min(8).max(128),
  rememberMe: z.boolean().optional(),
});

/**
 * User Registration Schema
 * Validates new user registration
 */
export const registerSchema = z.object({
  email: z.string().email().max(255).trim().toLowerCase(),
  password: z.string().min(12).max(128).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number, and special character'
  ),
  confirmPassword: z.string().min(12).max(128),
  name: z.string().min(2).max(100).trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Admin Tool Creation Schema
 * Validates new tool creation
 */
export const createToolSchema = z.object({
  name: z.string().min(3).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  description: z.string().min(10).max(500),
  shortDesc: z.string().min(5).max(150).optional(),
  category: z.string().uuid(),
  icon: z.string().max(10).optional(),
  featured: z.boolean().optional(),
  config: z.object({
    inputs: z.array(z.object({
      id: z.string().min(1).max(50),
      name: z.string().min(1).max(100),
      type: z.enum(['text', 'number', 'select', 'textarea', 'checkbox', 'date', 'color', 'file', 'email', 'url']),
      label: z.string().min(1).max(100),
      placeholder: z.string().max(200).optional(),
      required: z.boolean().default(false),
      options: z.array(z.object({
        label: z.string(),
        value: z.string(),
      })).optional(),
      validation: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
        message: z.string().optional(),
      }).optional(),
    })),
    outputs: z.array(z.object({
      id: z.string().min(1).max(50),
      type: z.enum(['text', 'json', 'image', 'textarea', 'html']),
      label: z.string().min(1).max(100),
    })),
  }),
  seo: z.object({
    title: z.string().max(70).optional(),
    description: z.string().max(160).optional(),
    keywords: z.array(z.string().max(50)).max(10).optional(),
  }).optional(),
});

/**
 * Blog Post Validation Schema
 * Validates blog post creation and updates
 */
export const blogPostSchema = z.object({
  title: z.string().min(10).max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens only'),
  excerpt: z.string().min(50).max(300),
  content: z.string().min(100),
  featuredImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    keywords: z.array(z.string().max(50)).max(10).optional(),
    ogImage: z.string().url().optional(),
  }).optional(),
  authorId: z.string().uuid(),
  publishedAt: z.string().datetime().optional(),
});

/**
 * Category Schema
 * Validates category creation
 */
export const categorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be valid hex color').optional(),
  order: z.number().int().min(0).optional(),
});

/**
 * API Key Schema
 * Validates API key creation
 */
export const apiKeySchema = z.object({
  name: z.string().min(3).max(50),
  permissions: z.array(z.enum(['read', 'write', 'delete', 'admin'])),
  rateLimit: z.number().int().min(10).max(10000).optional(),
  expiresAt: z.string().datetime().optional(),
});

/**
 * Settings Update Schema
 * Validates application settings updates
 */
export const settingsSchema = z.object({
  siteName: z.string().min(3).max(50).optional(),
  siteDescription: z.string().max(500).optional(),
  contactEmail: z.string().email().optional(),
  maintenanceMode: z.boolean().optional(),
  allowRegistration: z.boolean().optional(),
  defaultTheme: z.enum(['light', 'dark', 'system']).optional(),
});

/**
 * Pagination Schema
 * Validates pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Search Query Schema
 * Validates search parameters
 */
export const searchSchema = z.object({
  q: z.string().min(1).max(200).trim(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

/**
 * Contact Form Schema
 * Validates contact form submissions
 */
export const contactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).trim().toLowerCase(),
  subject: z.string().min(5).max(100).trim(),
  message: z.string().min(10).max(5000).trim(),
  honeypot: z.string().max(0).optional(), // Spam protection
});

/**
 * Password Reset Schema
 * Validates password reset requests
 */
export const passwordResetSchema = z.object({
  email: z.string().email().max(255).trim().toLowerCase(),
});

/**
 * New Password Schema
 * Validates new password after reset
 */
export const newPasswordSchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(12).max(128).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number, and special character'
  ),
  confirmPassword: z.string().min(12).max(128),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Export types inferred from schemas
export type ToolInput = z.infer<typeof toolInputSchema>;
export type Layer1Input = z.infer<typeof layer1Schema>;
export type Layer2Input = z.infer<typeof layer2Schema>;
export type Layer3Input = z.infer<typeof layer3Schema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateToolInput = z.infer<typeof createToolSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ApiKeyInput = z.infer<typeof apiKeySchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
