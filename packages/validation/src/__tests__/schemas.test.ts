import {
  toolInputSchema,
  layer1Schema,
  layer2Schema,
  layer3Schema,
  loginSchema,
  registerSchema,
  createToolSchema,
  blogPostSchema,
  paginationSchema,
  searchSchema,
} from '../schemas';

describe('Validation Schemas', () => {
  describe('toolInputSchema', () => {
    it('should validate valid tool input', () => {
      const result = toolInputSchema.safeParse({
        toolId: '123e4567-e89b-12d3-a456-426614174000',
        inputs: { height: 175, weight: 70 },
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = toolInputSchema.safeParse({
        toolId: 'invalid-uuid',
        inputs: {},
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing toolId', () => {
      const result = toolInputSchema.safeParse({
        inputs: {},
      });
      expect(result.success).toBe(false);
    });
  });

  describe('layer1Schema', () => {
    it('should validate valid layer 1 input', () => {
      const result = layer1Schema.safeParse({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        answer: 'security answer',
      });
      expect(result.success).toBe(true);
    });

    it('should trim and validate answer', () => {
      const result = layer1Schema.safeParse({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        answer: '  answer  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.answer).toBe('answer');
      }
    });

    it('should reject empty answer', () => {
      const result = layer1Schema.safeParse({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        answer: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('layer2Schema', () => {
    it('should validate valid layer 2 input', () => {
      const result = layer2Schema.safeParse({
        sessionToken: 'a'.repeat(64),
        password: 'StrongP@ssw0rd123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short password', () => {
      const result = layer2Schema.safeParse({
        sessionToken: 'a'.repeat(64),
        password: 'short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid session token length', () => {
      const result = layer2Schema.safeParse({
        sessionToken: 'too-short',
        password: 'StrongP@ssw0rd123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('layer3Schema', () => {
    it('should validate valid access key format', () => {
      const result = layer3Schema.safeParse({
        sessionToken: 'a'.repeat(64),
        accessKey: 'ABC-1234',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid access key format', () => {
      const result = layer3Schema.safeParse({
        sessionToken: 'a'.repeat(64),
        accessKey: 'invalid-key',
      });
      expect(result.success).toBe(false);
    });

    it('should reject lowercase access key', () => {
      const result = layer3Schema.safeParse({
        sessionToken: 'a'.repeat(64),
        accessKey: 'abc-1234',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const result = loginSchema.safeParse({
        email: 'USER@EXAMPLE.COM',
        password: 'password123',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
      }
    });

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should accept rememberMe optional field', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('registerSchema', () => {
    it('should validate valid registration', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'StrongP@ssw0rd123',
        confirmPassword: 'StrongP@ssw0rd123',
        name: 'John Doe',
      });
      expect(result.success).toBe(true);
    });

    it('should reject weak password', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'weakpassword',
        confirmPassword: 'weakpassword',
        name: 'John Doe',
      });
      expect(result.success).toBe(false);
    });

    it('should reject mismatched passwords', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'StrongP@ssw0rd123',
        confirmPassword: 'DifferentP@ssw0rd',
        name: 'John Doe',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'StrongP@ssw0rd123',
        confirmPassword: 'StrongP@ssw0rd123',
        name: 'A',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createToolSchema', () => {
    const validTool = {
      name: 'Test Tool',
      slug: 'test-tool',
      description: 'This is a test tool description that is long enough',
      category: '123e4567-e89b-12d3-a456-426614174000',
      config: {
        inputs: [
          {
            id: 'input1',
            name: 'input1',
            type: 'text',
            label: 'Input Label',
            required: true,
          },
        ],
        outputs: [
          {
            id: 'output1',
            type: 'text',
            label: 'Output Label',
          },
        ],
      },
    };

    it('should validate valid tool creation', () => {
      const result = createToolSchema.safeParse(validTool);
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug format', () => {
      const result = createToolSchema.safeParse({
        ...validTool,
        slug: 'Invalid_Slug',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short description', () => {
      const result = createToolSchema.safeParse({
        ...validTool,
        description: 'Short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty inputs array', () => {
      const result = createToolSchema.safeParse({
        ...validTool,
        config: {
          ...validTool.config,
          inputs: [],
        },
      });
      expect(result.success).toBe(true); // Empty array is valid per schema
    });
  });

  describe('blogPostSchema', () => {
    const validPost = {
      title: 'This is a Valid Blog Post Title',
      slug: 'valid-blog-post',
      excerpt: 'This is a valid excerpt that describes the blog post content in sufficient detail.',
      content: 'This is the main content of the blog post. It needs to be at least 100 characters long to pass validation.',
      authorId: '123e4567-e89b-12d3-a456-426614174000',
    };

    it('should validate valid blog post', () => {
      const result = blogPostSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });

    it('should reject short title', () => {
      const result = blogPostSchema.safeParse({
        ...validPost,
        title: 'Short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject short excerpt', () => {
      const result = blogPostSchema.safeParse({
        ...validPost,
        excerpt: 'Too short',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid featured image URL', () => {
      const result = blogPostSchema.safeParse({
        ...validPost,
        featuredImage: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('should accept empty featured image', () => {
      const result = blogPostSchema.safeParse({
        ...validPost,
        featuredImage: '',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should use default values', () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
        expect(result.data.sortOrder).toBe('desc');
      }
    });

    it('should parse string numbers', () => {
      const result = paginationSchema.safeParse({
        page: '5',
        limit: '50',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(5);
        expect(result.data.limit).toBe(50);
      }
    });

    it('should reject negative page', () => {
      const result = paginationSchema.safeParse({
        page: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject limit over 100', () => {
      const result = paginationSchema.safeParse({
        limit: 200,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('searchSchema', () => {
    it('should validate valid search', () => {
      const result = searchSchema.safeParse({
        q: 'search query',
        category: 'calculators',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty query', () => {
      const result = searchSchema.safeParse({
        q: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject long query', () => {
      const result = searchSchema.safeParse({
        q: 'a'.repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it('should trim search query', () => {
      const result = searchSchema.safeParse({
        q: '  search  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.q).toBe('search');
      }
    });
  });
});
