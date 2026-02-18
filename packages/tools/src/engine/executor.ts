import { ToolConfig, ToolExecutionResponse, ToolExecutionRequest } from '@tools-platform/types';

// Tool execution functions for client-side tools
const toolFunctions: Record<string, (inputs: any) => any> = {
  // Calculator tools
  'bmi-calculator': (inputs) => {
    const { weight, height } = inputs;
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    return {
      bmi: bmi.toFixed(2),
      category: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    };
  },

  'age-calculator': (inputs) => {
    const { birthDate } = inputs;
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  },

  'percentage-calculator': (inputs) => {
    const { calculation, x, y } = inputs;
    let result: number;
    let formula: string;

    switch (calculation) {
      case 'of':
        result = (x / 100) * y;
        formula = `(${x} / 100) × ${y}`;
        break;
      case 'is-what':
        result = (x / y) * 100;
        formula = `(${x} / ${y}) × 100`;
        break;
      case 'change':
        result = ((y - x) / x) * 100;
        formula = `((${y} - ${x}) / ${x}) × 100`;
        break;
      default:
        result = 0;
        formula = '';
    }

    return {
      result: result.toFixed(2),
      formula
    };
  },

  'loan-calculator': (inputs) => {
    const { principal, rate, years } = inputs;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    };
  },

  'discount-calculator': (inputs) => {
    const { originalPrice, discount } = inputs;
    const savings = originalPrice * (discount / 100);
    const salePrice = originalPrice - savings;

    return {
      salePrice: salePrice.toFixed(2),
      savings: savings.toFixed(2)
    };
  },

  // Converter tools
  'length-converter': (inputs) => {
    const { value, from, to } = inputs;
    const meters = {
      'mm': value / 1000,
      'cm': value / 100,
      'm': value,
      'km': value * 1000,
      'in': value * 0.0254,
      'ft': value * 0.3048,
      'yd': value * 0.9144,
      'mi': value * 1609.34
    };
    const fromMeters = meters[from as keyof typeof meters] || 0;
    return {
      result: Object.entries(meters).reduce((acc, [unit, toMeters]) => {
        acc[unit] = (fromMeters / toMeters).toFixed(6);
        return acc;
      }, {} as Record<string, string>)
    };
  },

  'temperature-converter': (inputs) => {
    const { value, from, to } = inputs;
    let celsius: number;

    // Convert to Celsius first
    switch (from) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * (5 / 9);
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    let result: number;
    switch (to) {
      case 'celsius':
        result = celsius;
        break;
      case 'fahrenheit':
        result = (celsius * (9 / 5)) + 32;
        break;
      case 'kelvin':
        result = celsius + 273.15;
        break;
      default:
        result = celsius;
    }

    return {
      result: result.toFixed(2)
    };
  },

  'currency-converter': (inputs) => {
    const { amount, from, to } = inputs;
    // Mock exchange rates (in production, fetch from API)
    const rates: Record<string, number> = {
      'USD': 1,
      'EUR': 0.92,
      'GBP': 0.79,
      'JPY': 149.50,
      'AUD': 1.53,
      'CAD': 1.36,
      'CHF': 0.88,
      'CNY': 7.24
    };

    const rateFrom = rates[from] || 1;
    const rateTo = rates[to] || 1;
    const converted = (amount / rateFrom) * rateTo;
    const exchangeRate = rateTo / rateFrom;

    return {
      result: converted.toFixed(2),
      rate: `1 ${from} = ${exchangeRate.toFixed(4)} ${to}`
    };
  },

  'weight-converter': (inputs) => {
    const { value, from, to } = inputs;
    const kg = {
      'mg': value / 1000000,
      'g': value / 1000,
      'kg': value,
      'oz': value * 0.0283495,
      'lb': value * 0.453592,
      'st': value * 6.35029
    };
    const fromKg = kg[from as keyof typeof kg] || 0;
    return {
      result: Object.entries(kg).reduce((acc, [unit, toKg]) => {
        acc[unit] = (fromKg / toKg).toFixed(6);
        return acc;
      }, {} as Record<string, string>)
    };
  },

  // Text tools
  'word-counter': (inputs) => {
    const { text } = inputs;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    return {
      words: words.length,
      characters: chars,
      charactersNoSpaces: charsNoSpaces,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordLength: charsNoSpaces / words.length || 0
    };
  },

  'case-converter': (inputs) => {
    const { text, type } = inputs;
    const converters: Record<string, (t: string) => string> = {
      'uppercase': (t) => t.toUpperCase(),
      'lowercase': (t) => t.toLowerCase(),
      'titlecase': (t) => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()),
      'sentencecase': (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
      'camelcase': (t) => t.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^(.)/, (c) => c.toLowerCase()),
      'snakecase': (t) => t.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase(),
      'kebabcase': (t) => t.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase()
    };
    return { result: converters[type]?.(text) || text };
  },

  // Developer tools
  'json-formatter': (inputs) => {
    const { json, minify } = inputs;
    try {
      const parsed = JSON.parse(json);
      return {
        result: JSON.stringify(parsed, null, minify ? 0 : 2),
        valid: true
      };
    } catch (e) {
      return {
        result: '',
        valid: false,
        error: (e as Error).message
      };
    }
  },

  'password-generator': (inputs) => {
    const { length, uppercase, lowercase, numbers, symbols } = inputs;
    let chars = '';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Calculate strength
    let strength = 0;
    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (uppercase) strength++;
    if (numbers) strength++;
    if (symbols) strength++;
    
    return {
      password,
      strength: ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][Math.min(strength, 4)]
    };
  },

  'qr-code-generator': (inputs) => {
    const { text, size } = inputs;
    return {
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`
    };
  },

  'base64-encoder': (inputs) => {
    const { text, action } = inputs;
    try {
      const result = action === 'encode'
        ? btoa(text)
        : atob(text);
      return { result, success: true };
    } catch (e) {
      return { result: '', success: false, error: (e as Error).message };
    }
  },

  // Generator tools
  'lorem-ipsum-generator': (inputs) => {
    const { paragraphs, sentences } = inputs;
    const loremWords = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo'
    ];

    let text = '';
    for (let p = 0; p < paragraphs; p++) {
      let paragraph = '';
      for (let s = 0; s < sentences; s++) {
        let sentence = '';
        const numWords = Math.floor(Math.random() * 10) + 8;
        for (let w = 0; w < numWords; w++) {
          sentence += loremWords[Math.floor(Math.random() * loremWords.length)] + ' ';
        }
        paragraph += sentence.trim() + '. ';
      }
      text += paragraph + '\n\n';
    }

    return { result: text.trim() };
  },

  'weight-converter': (inputs) => {
    const { value, from, to } = inputs;
    const kg = {
      'mg': value / 1000000,
      'g': value / 1000,
      'kg': value,
      'oz': value * 0.0283495,
      'lb': value * 0.453592,
      'st': value * 6.35029
    };
    const fromKg = kg[from as keyof typeof kg] || 0;
    return {
      result: Object.entries(kg).reduce((acc, [unit, toKg]) => {
        acc[unit] = (fromKg / toKg).toFixed(6);
        return acc;
      }, {} as Record<string, string>)
    };
  },

  'random-number-generator': (inputs) => {
    const { min, max, count, unique } = inputs;
    const results: number[] = [];
    const used = new Set<number>();

    for (let i = 0; i < count; i++) {
      let num: number;
      if (unique) {
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (used.has(num) && used.size < (max - min + 1));
        used.add(num);
      } else {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
      }
      results.push(num);
    }

    return { results: results.join(', ') };
  },

  'uuid-generator': (inputs) => {
    const { count, uppercase, withBraces, withHyphens } = inputs;
    const uuids: string[] = [];

    for (let i = 0; i < count; i++) {
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      if (!withHyphens) uuid = uuid.replace(/-/g, '');
      if (uppercase) uuid = uuid.toUpperCase();
      if (withBraces) uuid = `{${uuid}}`;

      uuids.push(uuid);
    }

    return { uuids: uuids.join('\n') };
  },

  'url-encoder': (inputs) => {
    const { url, action } = inputs;
    try {
      const result = action === 'encode'
        ? encodeURIComponent(url)
        : decodeURIComponent(url);
      return { result };
    } catch (e) {
      return {
        result: '',
        error: (e as Error).message
      };
    }
  },

  'reverse-text': (inputs) => {
    const { text, mode } = inputs;
    let result: string;

    if (mode === 'chars') {
      result = text.split('').reverse().join('');
    } else {
      result = text.split(' ').reverse().join(' ');
    }

    return { result };
  },

  'character-counter': (inputs) => {
    const { text } = inputs;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const spaces = text.match(/\s/g)?.length || 0;
    const newlines = text.match(/\n/g)?.length || 0;

    return {
      chars,
      charsNoSpaces,
      spaces,
      newlines
    };
  },

  'remove-duplicates': (inputs) => {
    const { text, caseSensitive, trimSpaces } = inputs;
    const lines = text.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];
    let removed = 0;

    for (const line of lines) {
      let processed = line;
      if (trimSpaces) processed = processed.trim();
      const key = caseSensitive ? processed : processed.toLowerCase();

      if (!seen.has(key) && processed !== '') {
        seen.add(key);
        result.push(processed);
      } else if (processed !== '') {
        removed++;
      }
    }

    return {
      result: result.join('\n'),
      removed
    };
  },

  'hash-generator': async (inputs) => {
    const { text, algorithm } = inputs;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    let hashBuffer: ArrayBuffer;

    switch (algorithm) {
      case 'md5':
        // For MD5, we need a library in production. For now, return SHA-256
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'sha256':
      default:
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data);
        break;
    }

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return { hash: hashHex.toUpperCase() };
  },

  'emi-calculator': (inputs) => {
    const { principal, rate, months } = inputs;
    const monthlyRate = rate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return {
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    };
  },

  'tip-calculator': (inputs) => {
    const { billAmount, tipPercentage, splitBetween } = inputs;
    const tipAmount = billAmount * (tipPercentage / 100);
    const totalAmount = billAmount + tipAmount;
    const perPerson = totalAmount / splitBetween;

    return {
      tipAmount: tipAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      perPerson: perPerson.toFixed(2)
    };
  },
};

export class ToolExecutor {
  static async execute(config: ToolConfig, inputs: Record<string, any>): Promise<ToolExecutionResponse> {
    try {
      if (config.logic.type === 'client' && config.logic.function) {
        const func = toolFunctions[config.logic.function];
        if (!func) {
          throw new Error(`Tool function not found: ${config.logic.function}`);
        }
        const outputs = func(inputs);
        return {
          success: true,
          outputs,
        };
      } else if (config.logic.type === 'server' && config.logic.endpoint) {
        // Server-side tools require API call
        const response = await fetch(config.logic.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ toolSlug: config.slug, inputs }),
        });
        const data = await response.json();
        return data;
      } else {
        throw new Error('Invalid tool logic configuration');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static validateInputs(config: ToolConfig, inputs: Record<string, any>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const input of config.inputs) {
      const value = inputs[input.id];

      // Required check
      if (input.required && (value === undefined || value === null || value === '')) {
        errors.push(`${input.label} is required`);
        continue;
      }

      if (value === undefined || value === null || value === '') continue;

      // Type validation
      if (input.type === 'number' && isNaN(Number(value))) {
        errors.push(`${input.label} must be a number`);
      }

      // Range validation
      if (input.validation) {
        if (input.validation.min !== undefined && Number(value) < input.validation.min) {
          errors.push(`${input.label} must be at least ${input.validation.min}`);
        }
        if (input.validation.max !== undefined && Number(value) > input.validation.max) {
          errors.push(`${input.label} must be at most ${input.validation.max}`);
        }
        if (input.validation.pattern && !new RegExp(input.validation.pattern).test(String(value))) {
          errors.push(`${input.label} format is invalid`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
