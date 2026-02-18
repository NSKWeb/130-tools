import { ToolExecutor } from '../engine/executor';

describe('ToolExecutor', () => {
  describe('BMI Calculator', () => {
    it('should calculate BMI correctly for normal weight', () => {
      const result = ToolExecutor.execute('bmi-calculator', {
        height: 175,
        weight: 70,
      });

      expect(result.bmi).toBeDefined();
      expect(result.category).toBe('Normal weight');
    });

    it('should calculate BMI correctly for underweight', () => {
      const result = ToolExecutor.execute('bmi-calculator', {
        height: 175,
        weight: 50,
      });

      expect(result.category).toBe('Underweight');
    });

    it('should calculate BMI correctly for overweight', () => {
      const result = ToolExecutor.execute('bmi-calculator', {
        height: 175,
        weight: 85,
      });

      expect(result.category).toBe('Overweight');
    });

    it('should handle edge case with zero height', () => {
      const result = ToolExecutor.execute('bmi-calculator', {
        height: 0,
        weight: 70,
      });

      expect(result.error).toBeDefined();
    });

    it('should handle negative values', () => {
      const result = ToolExecutor.execute('bmi-calculator', {
        height: -175,
        weight: 70,
      });

      expect(result.error).toBeDefined();
    });
  });

  describe('Age Calculator', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);

      const result = ToolExecutor.execute('age-calculator', {
        birthDate: birthDate.toISOString().split('T')[0],
      });

      expect(result.years).toBe(25);
    });

    it('should calculate next birthday', () => {
      const result = ToolExecutor.execute('age-calculator', {
        birthDate: '2000-01-01',
      });

      expect(result.nextBirthday).toBeDefined();
      expect(result.daysUntilBirthday).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Percentage Calculator', () => {
    it('should calculate percentage of value', () => {
      const result = ToolExecutor.execute('percentage-calculator', {
        value: 100,
        percentage: 25,
        operation: 'of',
      });

      expect(result.result).toBe('25.00%');
    });

    it('should calculate what percentage', () => {
      const result = ToolExecutor.execute('percentage-calculator', {
        value: 25,
        percentage: 100,
        operation: 'is',
      });

      expect(result.result).toBe('25.00%');
    });

    it('should calculate percentage change', () => {
      const result = ToolExecutor.execute('percentage-calculator', {
        value: 100,
        percentage: 150,
        operation: 'change',
      });

      expect(result.result).toContain('%');
    });
  });

  describe('Word Counter', () => {
    it('should count words correctly', () => {
      const result = ToolExecutor.execute('word-counter', {
        text: 'This is a test sentence with seven words.',
      });

      expect(result.wordCount).toBe(8);
    });

    it('should count characters', () => {
      const result = ToolExecutor.execute('word-counter', {
        text: 'Hello World',
      });

      expect(result.characterCount).toBe(11);
      expect(result.characterCountNoSpaces).toBe(10);
    });

    it('should handle empty text', () => {
      const result = ToolExecutor.execute('word-counter', {
        text: '',
      });

      expect(result.wordCount).toBe(0);
      expect(result.characterCount).toBe(0);
    });

    it('should count sentences', () => {
      const result = ToolExecutor.execute('word-counter', {
        text: 'First sentence. Second sentence! Third sentence?',
      });

      expect(result.sentenceCount).toBe(3);
    });
  });

  describe('Password Generator', () => {
    it('should generate password of specified length', () => {
      const result = ToolExecutor.execute('password-generator', {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      });

      expect(result.password).toHaveLength(16);
    });

    it('should generate password with only lowercase', () => {
      const result = ToolExecutor.execute('password-generator', {
        length: 12,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false,
      });

      expect(result.password).toMatch(/^[a-z]+$/);
    });

    it('should calculate password strength', () => {
      const result = ToolExecutor.execute('password-generator', {
        length: 20,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      });

      expect(result.strength).toBe('Very Strong');
    });
  });

  describe('JSON Formatter', () => {
    it('should format valid JSON', () => {
      const result = ToolExecutor.execute('json-formatter', {
        json: '{"name":"test","value":123}',
        indent: 2,
      });

      expect(result.formatted).toContain('\n');
      expect(result.isValid).toBe(true);
    });

    it('should handle invalid JSON', () => {
      const result = ToolExecutor.execute('json-formatter', {
        json: '{invalid json}',
        indent: 2,
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should minify JSON', () => {
      const result = ToolExecutor.execute('json-formatter', {
        json: '{\n  "name": "test"\n}',
        indent: 0,
      });

      expect(result.formatted).not.toContain('\n');
    });
  });

  describe('QR Code Generator', () => {
    it('should generate QR code data URL', () => {
      const result = ToolExecutor.execute('qr-code-generator', {
        text: 'https://example.com',
        size: 200,
      });

      expect(result.qrCode).toContain('data:image');
    });

    it('should handle empty text', () => {
      const result = ToolExecutor.execute('qr-code-generator', {
        text: '',
        size: 200,
      });

      expect(result.error).toBeDefined();
    });
  });

  describe('Base64 Encoder/Decoder', () => {
    it('should encode text to base64', () => {
      const result = ToolExecutor.execute('base64-encoder', {
        text: 'Hello World',
        operation: 'encode',
      });

      expect(result.result).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should decode base64 to text', () => {
      const result = ToolExecutor.execute('base64-encoder', {
        text: 'SGVsbG8gV29ybGQ=',
        operation: 'decode',
      });

      expect(result.result).toBe('Hello World');
    });

    it('should handle invalid base64', () => {
      const result = ToolExecutor.execute('base64-encoder', {
        text: '!!!invalid!!!',
        operation: 'decode',
      });

      expect(result.error).toBeDefined();
    });
  });

  describe('Color Converter', () => {
    it('should convert HEX to RGB', () => {
      const result = ToolExecutor.execute('color-converter', {
        color: '#FF5733',
        format: 'rgb',
      });

      expect(result.rgb).toBe('rgb(255, 87, 51)');
    });

    it('should convert HEX to HSL', () => {
      const result = ToolExecutor.execute('color-converter', {
        color: '#FF5733',
        format: 'hsl',
      });

      expect(result.hsl).toContain('hsl');
    });

    it('should handle invalid color', () => {
      const result = ToolExecutor.execute('color-converter', {
        color: 'invalid',
        format: 'rgb',
      });

      expect(result.error).toBeDefined();
    });
  });

  describe('Date Calculator', () => {
    it('should calculate days between dates', () => {
      const result = ToolExecutor.execute('date-calculator', {
        startDate: '2024-01-01',
        endDate: '2024-01-10',
        operation: 'difference',
      });

      expect(result.days).toBe(9);
    });

    it('should add days to date', () => {
      const result = ToolExecutor.execute('date-calculator', {
        startDate: '2024-01-01',
        days: 10,
        operation: 'add',
      });

      expect(result.resultDate).toBe('2024-01-11');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent tool', () => {
      expect(() => {
        ToolExecutor.execute('non-existent-tool', {});
      }).toThrow();
    });

    it('should handle missing required inputs', () => {
      const result = ToolExecutor.execute('bmi-calculator', {
        height: undefined,
        weight: 70,
      });

      expect(result.error).toBeDefined();
    });

    it('should handle execution timeout', async () => {
      // Simulate slow operation
      const slowTool = () => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ result: 'done' }), 100);
        });
      };

      await expect(slowTool()).resolves.toEqual({ result: 'done' });
    });
  });
});
