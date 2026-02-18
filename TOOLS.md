# Tool Development Guide

Complete guide for creating new tools in the 130 Tools Platform.

## Table of Contents

1. [Overview](#overview)
2. [Tool Structure](#tool-structure)
3. [Creating a Tool](#creating-a-tool)
4. [Input Types](#input-types)
5. [Output Types](#output-types)
6. [Validation](#validation)
7. [Logic Implementation](#logic-implementation)
8. [Testing](#testing)
9. [Examples](#examples)

## Overview

Tools in the 130 Tools Platform are JSON-driven and follow a consistent structure. Each tool consists of:

1. **Configuration** (JSON) - Defines inputs, outputs, and metadata
2. **Logic** (TypeScript) - Implements the tool's functionality
3. **SEO** (JSON) - Search engine optimization metadata

## Tool Structure

```
Tool
├── id (unique identifier)
├── slug (URL-friendly name)
├── name (display name)
├── description (long description)
├── shortDesc (brief description)
├── category (category slug)
├── icon (emoji)
├── inputs (input fields)
├── outputs (output fields)
├── logic (execution configuration)
└── seo (SEO metadata)
```

## Creating a Tool

### Step 1: Create Configuration File

Create a JSON file in `packages/tools/src/configs/[category]/your-tool.json`:

```json
{
  "id": "unique-tool-id",
  "slug": "your-tool-slug",
  "name": "Your Tool Name",
  "description": "A detailed description of what your tool does and how it can help users.",
  "shortDesc": "Brief description (50-100 chars)",
  "category": "calculators",
  "icon": "🔧",
  "featured": false,
  "inputs": [
    {
      "id": "input1",
      "name": "input1",
      "type": "number",
      "label": "Input Label",
      "placeholder": "Enter a value...",
      "required": true,
      "validation": {
        "min": 0,
        "max": 100,
        "message": "Value must be between 0 and 100"
      }
    }
  ],
  "outputs": [
    {
      "id": "result",
      "type": "text",
      "label": "Result"
    }
  ],
  "logic": {
    "type": "client",
    "function": "your-tool-function"
  },
  "seo": {
    "title": "Your Tool Name - Free Online Tool",
    "description": "Description for search engines (150-160 chars)",
    "keywords": ["tool", "calculator", "free"]
  }
}
```

### Step 2: Implement Logic

Add the tool's logic function to `packages/tools/src/engine/executor.ts`:

```typescript
const toolFunctions: Record<string, (inputs: any) => any> = {
  // ... existing functions
  
  'your-tool-function': (inputs) => {
    const { input1, input2 } = inputs;
    
    // Your calculation logic here
    const result = input1 * input2;
    
    return {
      result: result.toString(),
      formatted: `The result is: ${result}`
    };
  },
};
```

### Step 3: Export Tool

Add the import and export to `packages/tools/src/index.ts`:

```typescript
// Import your tool config
import yourTool from './configs/calculators/your-tool.json';

// Add to toolConfigs array
export const toolConfigs: ToolConfig[] = [
  // ... existing tools
  yourTool as ToolConfig,
];
```

### Step 4: Test

1. Run the development server: `pnpm dev`
2. Navigate to your tool: `http://localhost:3000/tools/your-tool-slug`
3. Test with various inputs including edge cases

## Input Types

### Text Input

```json
{
  "id": "username",
  "name": "username",
  "type": "text",
  "label": "Username",
  "placeholder": "Enter username",
  "required": true,
  "validation": {
    "pattern": "^[a-zA-Z0-9_]+$",
    "message": "Only letters, numbers, and underscores allowed"
  }
}
```

### Number Input

```json
{
  "id": "amount",
  "name": "amount",
  "type": "number",
  "label": "Amount",
  "placeholder": "0.00",
  "required": true,
  "validation": {
    "min": 0,
    "max": 1000000,
    "message": "Amount must be between 0 and 1,000,000"
  }
}
```

### Select Input

```json
{
  "id": "currency",
  "name": "currency",
  "type": "select",
  "label": "Currency",
  "required": true,
  "options": [
    { "label": "USD - US Dollar", "value": "USD" },
    { "label": "EUR - Euro", "value": "EUR" },
    { "label": "GBP - British Pound", "value": "GBP" }
  ]
}
```

### Textarea Input

```json
{
  "id": "content",
  "name": "content",
  "type": "textarea",
  "label": "Content",
  "placeholder": "Enter your text here...",
  "required": true,
  "validation": {
    "min": 10,
    "max": 5000,
    "message": "Content must be 10-5000 characters"
  }
}
```

### Checkbox Input

```json
{
  "id": "agree",
  "name": "agree",
  "type": "checkbox",
  "label": "I agree to the terms",
  "required": true
}
```

### Date Input

```json
{
  "id": "birthdate",
  "name": "birthdate",
  "type": "date",
  "label": "Birth Date",
  "required": true
}
```

### Color Input

```json
{
  "id": "color",
  "name": "color",
  "type": "color",
  "label": "Choose Color",
  "required": false,
  "defaultValue": "#3B82F6"
}
```

### File Input

```json
{
  "id": "document",
  "name": "document",
  "type": "file",
  "label": "Upload Document",
  "required": true,
  "validation": {
    "accept": ".pdf,.doc,.docx",
    "maxSize": 10485760,
    "message": "PDF or Word files up to 10MB"
  }
}
```

### Email Input

```json
{
  "id": "email",
  "name": "email",
  "type": "email",
  "label": "Email Address",
  "placeholder": "you@example.com",
  "required": true
}
```

### URL Input

```json
{
  "id": "website",
  "name": "website",
  "type": "url",
  "label": "Website URL",
  "placeholder": "https://example.com",
  "required": true
}
```

## Output Types

### Text Output

```json
{
  "id": "result",
  "type": "text",
  "label": "Result"
}
```

Returns plain text that is displayed directly.

### JSON Output

```json
{
  "id": "data",
  "type": "json",
  "label": "JSON Data"
}
```

Returns formatted JSON with syntax highlighting.

### Image Output

```json
{
  "id": "chart",
  "type": "image",
  "label": "Generated Chart"
}
```

Returns a URL to an image that will be displayed.

### Textarea Output

```json
{
  "id": "output",
  "type": "textarea",
  "label": "Output Text"
}
```

Returns multi-line text in a textarea.

### HTML Output

```json
{
  "id": "preview",
  "type": "html",
  "label": "Preview"
}
```

Returns HTML that will be rendered (sanitized).

## Validation

### Common Validation Rules

| Rule | Description | Applicable Types |
|------|-------------|------------------|
| `required` | Field must have a value | All |
| `min` | Minimum value/length | number, text, textarea |
| `max` | Maximum value/length | number, text, textarea |
| `pattern` | Regex pattern to match | text, email, url |
| `message` | Custom error message | All |

### Validation Examples

```javascript
// Number validation
{
  validation: {
    min: 0,
    max: 100,
    message: "Please enter a value between 0 and 100"
  }
}

// Text pattern validation
{
  validation: {
    pattern: "^[A-Za-z\\s]+$",
    message: "Only letters and spaces allowed"
  }
}

// Length validation
{
  validation: {
    min: 5,
    max: 100,
    message: "Must be between 5 and 100 characters"
  }
}
```

## Logic Implementation

### Client-Side Logic

For tools that run entirely in the browser:

```typescript
'tool-function-name': (inputs) => {
  const { value1, value2 } = inputs;
  
  // Validation
  if (value1 <= 0) {
    throw new Error('Value 1 must be positive');
  }
  
  // Calculation
  const result = value1 + value2;
  
  return {
    result: result.toFixed(2),
    summary: `${value1} + ${value2} = ${result}`
  };
}
```

### Server-Side Logic

For tools requiring external APIs or heavy processing:

```json
{
  "logic": {
    "type": "server",
    "endpoint": "/api/tools/your-tool/execute"
  }
}
```

Create API route at `apps/web/app/api/tools/your-tool/execute/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { inputs } = await request.json();
  
  // Process with external API
  const result = await fetchExternalAPI(inputs);
  
  return NextResponse.json({
    success: true,
    data: result
  });
}
```

### Error Handling

Always handle errors gracefully:

```typescript
'tool-function-name': (inputs) => {
  try {
    const { value } = inputs;
    
    if (!value) {
      return {
        error: 'Please provide a value',
        result: null
      };
    }
    
    // Processing...
    const result = processValue(value);
    
    return { result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred',
      result: null
    };
  }
}
```

## Testing

### Unit Tests

Create test file `packages/tools/src/__tests__/your-tool.test.ts`:

```typescript
import { executeTool } from '../engine/executor';

describe('Your Tool', () => {
  it('should calculate correctly with valid inputs', () => {
    const result = executeTool('your-tool-function', {
      input1: 10,
      input2: 20
    });
    
    expect(result.result).toBe('30');
  });
  
  it('should handle edge cases', () => {
    const result = executeTool('your-tool-function', {
      input1: 0,
      input2: 0
    });
    
    expect(result.result).toBe('0');
  });
  
  it('should handle invalid inputs', () => {
    const result = executeTool('your-tool-function', {
      input1: -1,
      input2: 10
    });
    
    expect(result.error).toBeDefined();
  });
});
```

### Manual Testing Checklist

- [ ] Tool loads correctly
- [ ] All inputs render properly
- [ ] Validation works for required fields
- [ ] Validation works for min/max values
- [ ] Validation works for patterns
- [ ] Calculate button works
- [ ] Results display correctly
- [ ] Error messages show appropriately
- [ ] Mobile responsive
- [ ] Dark mode works

## Examples

### Calculator Example: Percentage Calculator

**Config:**

```json
{
  "id": "percentage-calculator",
  "slug": "percentage-calculator",
  "name": "Percentage Calculator",
  "description": "Calculate percentages easily. Find what percentage one number is of another, or calculate percentage increase/decrease.",
  "shortDesc": "Calculate percentages, increases, and decreases",
  "category": "calculators",
  "icon": "📊",
  "inputs": [
    {
      "id": "value",
      "name": "value",
      "type": "number",
      "label": "Value",
      "placeholder": "Enter value",
      "required": true
    },
    {
      "id": "percentage",
      "name": "percentage",
      "type": "number",
      "label": "Percentage",
      "placeholder": "Enter percentage",
      "required": true,
      "validation": {
        "min": 0,
        "max": 100
      }
    },
    {
      "id": "operation",
      "name": "operation",
      "type": "select",
      "label": "Operation",
      "required": true,
      "options": [
        { "label": "Find percentage of value", "value": "of" },
        { "label": "What percentage is value of...", "value": "is" },
        { "label": "Percentage increase/decrease", "value": "change" }
      ]
    }
  ],
  "outputs": [
    {
      "id": "result",
      "type": "text",
      "label": "Result"
    },
    {
      "id": "formula",
      "type": "text",
      "label": "Formula Used"
    }
  ],
  "logic": {
    "type": "client",
    "function": "percentage-calculator"
  },
  "seo": {
    "title": "Percentage Calculator - Free Online Tool",
    "description": "Calculate percentages, percentage increases, and decreases with our free online percentage calculator.",
    "keywords": ["percentage calculator", "percent calculator", "percentage increase", "percentage decrease"]
  }
}
```

**Logic:**

```typescript
'percentage-calculator': (inputs) => {
  const { value, percentage, operation } = inputs;
  const val = parseFloat(value);
  const pct = parseFloat(percentage);
  
  let result: number;
  let formula: string;
  
  switch (operation) {
    case 'of':
      result = (val * pct) / 100;
      formula = `${pct}% of ${val} = ${result}`;
      break;
    case 'is':
      result = (val / pct) * 100;
      formula = `${val} is ${result}% of ${pct}`;
      break;
    case 'change':
      result = ((pct - val) / val) * 100;
      formula = `Percentage change from ${val} to ${pct} = ${result}%`;
      break;
    default:
      throw new Error('Invalid operation');
  }
  
  return {
    result: `${result.toFixed(2)}%`,
    formula
  };
}
```

### Converter Example: Length Converter

```typescript
'length-converter': (inputs) => {
  const { value, from, to } = inputs;
  const val = parseFloat(value);
  
  // Conversion factors to meters
  const toMeters: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34
  };
  
  // Convert to meters first, then to target
  const meters = val * toMeters[from];
  const result = meters / toMeters[to];
  
  return {
    result: `${result.toFixed(4)} ${to}`,
    inMeters: `${meters.toFixed(4)} m`
  };
}
```

### Generator Example: UUID Generator

```typescript
'uuid-generator': (inputs) => {
  const { count = 1, format = 'standard' } = inputs;
  
  const uuids: string[] = [];
  
  for (let i = 0; i < Math.min(count, 100); i++) {
    const uuid = crypto.randomUUID();
    
    switch (format) {
      case 'uppercase':
        uuids.push(uuid.toUpperCase());
        break;
      case 'nodashes':
        uuids.push(uuid.replace(/-/g, ''));
        break;
      default:
        uuids.push(uuid);
    }
  }
  
  return {
    result: uuids.join('\n'),
    count: uuids.length
  };
}
```

## Best Practices

1. **Keep it simple** - Tools should do one thing well
2. **Validate inputs** - Always validate and sanitize user input
3. **Handle errors** - Provide clear error messages
4. **Use appropriate types** - Choose the right input type for the data
5. **Add helpful labels** - Make labels clear and descriptive
6. **Include placeholders** - Show examples in placeholders
7. **Test edge cases** - Handle empty inputs, zeros, negatives
8. **Optimize performance** - Keep calculations fast
9. **Document clearly** - Good descriptions help users
10. **SEO matters** - Include relevant keywords

## Categories

Available tool categories:

- `calculators` - Mathematical calculators
- `converters` - Unit and format converters
- `generators` - Content and code generators
- `text-tools` - Text manipulation tools
- `developer-tools` - Developer utilities
- `security-tools` - Security and privacy tools
- `seo-tools` - SEO analysis tools
- `social-media` - Social media tools
- `misc` - Miscellaneous utilities

## Need Help?

- Check existing tools in `packages/tools/src/configs/`
- Review the logic in `packages/tools/src/engine/executor.ts`
- Ask in the development channel

---

Happy tool building! 🚀
