# API Documentation

Complete reference for the 130 Tools Platform REST API.

## Base URL

```
Production: https://api.yourdomain.com
Development: http://localhost:3000/api
```

## Authentication

The API uses JWT Bearer tokens for authentication.

```http
Authorization: Bearer <token>
```

### Admin Authentication Flow

The admin dashboard uses a 3-layer security system:

1. **Layer 1** - Security Question
   ```http
   POST /api/auth/layer1
   Content-Type: application/json
   
   {
     "answer": "your-answer"
   }
   ```

2. **Layer 2** - Password
   ```http
   POST /api/auth/layer2
   Content-Type: application/json
   
   {
     "sessionToken": "layer1-session-token",
     "password": "your-password"
   }
   ```

3. **Layer 3** - Access Key
   ```http
   POST /api/auth/layer3
   Content-Type: application/json
   
   {
     "sessionToken": "layer2-session-token",
     "accessKey": "ABC-1234"
   }
   ```

### Token Refresh

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

## Rate Limiting

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 requests | 1 minute |
| Auth | 5 attempts | 15 minutes |
| Tool Execution | 30 executions | 1 minute |
| Admin | 50 operations | 1 minute |

Rate limit headers are included in responses:

```http
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| AUTH_ERROR | 401 | Authentication required/failed |
| FORBIDDEN | 403 | Insufficient permissions |
| CSRF_ERROR | 403 | Invalid CSRF token |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| TOOL_EXECUTION_ERROR | 422 | Tool execution failed |
| RATE_LIMIT | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Server error |
| DATABASE_ERROR | 500 | Database operation failed |
| EXTERNAL_SERVICE_ERROR | 502 | External API error |
| AI_SERVICE_ERROR | 503 | AI service unavailable |
| TIMEOUT | 504 | Request timeout |

---

## Endpoints

### Tools

#### List All Tools

```http
GET /api/tools
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category slug |
| search | string | Search query |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| featured | boolean | Filter featured tools |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "slug": "bmi-calculator",
      "name": "BMI Calculator",
      "description": "Calculate your Body Mass Index",
      "category": "calculators",
      "icon": "📊",
      "featured": true,
      "inputs": [...],
      "outputs": [...]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 113,
    "hasMore": true
  }
}
```

#### Get Tool by Slug

```http
GET /api/tools/:slug
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "slug": "bmi-calculator",
    "name": "BMI Calculator",
    "description": "Calculate your Body Mass Index",
    "shortDesc": "Quick BMI calculation",
    "category": "calculators",
    "icon": "📊",
    "inputs": [
      {
        "id": "height",
        "name": "height",
        "type": "number",
        "label": "Height (cm)",
        "required": true,
        "validation": {
          "min": 1,
          "max": 300
        }
      }
    ],
    "outputs": [
      {
        "id": "bmi",
        "type": "text",
        "label": "Your BMI"
      }
    ],
    "seo": {
      "title": "BMI Calculator - Calculate Your Body Mass Index",
      "description": "Free online BMI calculator...",
      "keywords": ["bmi", "calculator", "health"]
    }
  }
}
```

#### Execute Tool

```http
POST /api/tools/:slug/execute
Content-Type: application/json

{
  "inputs": {
    "height": 175,
    "weight": 70
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "bmi": "22.9",
    "category": "Normal weight",
    "recommendation": "Maintain your current lifestyle"
  },
  "meta": {
    "executionTime": 12
  }
}
```

#### Create Tool (Admin)

```http
POST /api/admin/tools
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Tool",
  "slug": "new-tool",
  "description": "Tool description",
  "category": "category-id",
  "inputs": [...],
  "outputs": [...]
}
```

#### Update Tool (Admin)

```http
PUT /api/admin/tools/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Delete Tool (Admin)

```http
DELETE /api/admin/tools/:id
Authorization: Bearer <admin-token>
```

---

### Categories

#### List Categories

```http
GET /api/categories
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "cat-1",
      "name": "Calculators",
      "slug": "calculators",
      "description": "Mathematical calculators",
      "icon": "🧮",
      "color": "#3B82F6",
      "toolCount": 20
    }
  ]
}
```

#### Get Category

```http
GET /api/categories/:slug
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cat-1",
    "name": "Calculators",
    "slug": "calculators",
    "tools": [...]
  }
}
```

---

### Blog

#### List Posts

```http
GET /api/blog/posts
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| tag | string | Filter by tag |
| status | string | Filter by status |
| page | number | Page number |
| limit | number | Items per page |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "post-1",
      "title": "How to Use Our Tools",
      "slug": "how-to-use-tools",
      "excerpt": "Learn how to make the most of our tools...",
      "featuredImage": "https://...",
      "publishedAt": "2024-01-01T00:00:00Z",
      "author": {
        "name": "John Doe",
        "avatar": "https://..."
      },
      "category": {
        "name": "Tutorials"
      }
    }
  ]
}
```

#### Get Post

```http
GET /api/blog/posts/:slug
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "post-1",
    "title": "How to Use Our Tools",
    "slug": "how-to-use-tools",
    "content": "Full markdown content...",
    "seo": {
      "metaTitle": "...",
      "metaDescription": "...",
      "keywords": ["tools", "tutorial"]
    }
  }
}
```

#### Create Post (Admin)

```http
POST /api/admin/blog/posts
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "New Post",
  "slug": "new-post",
  "excerpt": "Post excerpt",
  "content": "Post content...",
  "status": "published"
}
```

---

### Users

#### Get Current User

```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-1",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "role": "user",
    "preferences": {
      "theme": "dark",
      "language": "en"
    }
  }
}
```

#### Update User

```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "preferences": {
    "theme": "light"
  }
}
```

#### List Users (Admin)

```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

---

### Analytics

#### Dashboard Stats (Admin)

```http
GET /api/admin/analytics/dashboard
Authorization: Bearer <admin-token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "activeUsers": 500,
    "totalTools": 113,
    "totalExecutions": 50000,
    "newUsersToday": 25,
    "popularTools": [...]
  }
}
```

#### Tool Usage Stats

```http
GET /api/admin/analytics/tools
Authorization: Bearer <admin-token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | day, week, month, year |
| start | date | Start date |
| end | date | End date |

---

### AI

#### Generate Content

```http
POST /api/admin/ai/generate
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "type": "tool_description",
  "prompt": "Generate description for BMI calculator",
  "maxTokens": 500,
  "temperature": 0.7
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "content": "Generated content...",
    "tokens": {
      "prompt": 50,
      "completion": 150,
      "total": 200
    },
    "cost": 0.002
  }
}
```

---

### Settings

#### Get Settings (Admin)

```http
GET /api/admin/settings
Authorization: Bearer <admin-token>
```

#### Update Settings (Admin)

```http
PUT /api/admin/settings
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "siteName": "130 Tools",
  "maintenanceMode": false
}
```

---

## Webhooks

### Tool Execution Webhook

Configure webhooks to receive notifications when tools are executed.

**Payload:**

```json
{
  "event": "tool.executed",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "toolId": "tool-1",
    "toolName": "BMI Calculator",
    "executionTime": 12,
    "success": true
  }
}
```

### Signature Verification

```http
X-Webhook-Signature: sha256=<signature>
```

Verify using your webhook secret:

```javascript
const crypto = require('crypto');

const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex');
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { ToolsAPI } from '@130tools/sdk';

const api = new ToolsAPI({
  baseURL: 'https://api.yourdomain.com',
  token: 'your-jwt-token'
});

// List tools
const tools = await api.tools.list({ category: 'calculators' });

// Execute tool
const result = await api.tools.execute('bmi-calculator', {
  height: 175,
  weight: 70
});
```

### cURL

```bash
# List tools
curl -X GET https://api.yourdomain.com/api/tools \
  -H "Authorization: Bearer <token>"

# Execute tool
curl -X POST https://api.yourdomain.com/api/tools/bmi-calculator/execute \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"inputs": {"height": 175, "weight": 70}}'
```

---

## Changelog

### v1.0.0 (2024-01-01)

- Initial API release
- 113 tools available
- 3-layer authentication
- Rate limiting implemented
- AI content generation

---

For support, contact: api-support@yourdomain.com
