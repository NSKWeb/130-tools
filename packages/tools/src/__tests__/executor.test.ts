import { ToolExecutor } from '../engine/executor';

describe('ToolExecutor', () => {
  describe('BMI Calculator', () => {
    it('should calculate BMI correctly for normal weight', async () => {
      const { outputs: result } = await ToolExecutor.execute('bmi-calculator', {
        height: 175,
        weight: 70,
      });

      expect(result.bmi).toBeDefined();
      expect(result.category).toBe('Normal');
    });

    it('should calculate BMI correctly for underweight', async () => {
      const { outputs: result } = await ToolExecutor.execute('bmi-calculator', {
        height: 175,
        weight: 50,
      });

      expect(result.category).toBe('Underweight');
    });

    it('should calculate BMI correctly for overweight', async () => {
      const { outputs: result } = await ToolExecutor.execute('bmi-calculator', {
        height: 175,
        weight: 85,
      });

      expect(result.category).toBe('Overweight');
    });
  });

  describe('Age Calculator', () => {
    it('should calculate age correctly', async () => {
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);

      const { outputs: result } = await ToolExecutor.execute('age-calculator', {
        birthDate: birthDate.toISOString().split('T')[0],
      });

      expect(result.years).toBe(25);
    });
  });

  describe('Percentage Calculator', () => {
    it('should calculate percentage of value', async () => {
      const { outputs: result } = await ToolExecutor.execute('percentage-calculator', {
        x: 25,
        y: 100,
        calculation: 'of',
      });

      expect(result.result).toBe('25.00');
    });

    it('should calculate what percentage', async () => {
      const { outputs: result } = await ToolExecutor.execute('percentage-calculator', {
        x: 25,
        y: 100,
        calculation: 'is-what',
      });

      expect(result.result).toBe('25.00');
    });

    it('should calculate percentage change', async () => {
      const { outputs: result } = await ToolExecutor.execute('percentage-calculator', {
        x: 100,
        y: 150,
        calculation: 'change',
      });

      expect(result.result).toBe('50.00');
    });
  });

  describe('Word Counter', () => {
    it('should count words correctly', async () => {
      const { outputs: result } = await ToolExecutor.execute('word-counter', {
        text: 'This is a test sentence with eight words.',
      });

      expect(result.words).toBe(8);
    });

    it('should count characters', async () => {
      const { outputs: result } = await ToolExecutor.execute('word-counter', {
        text: 'Hello World',
      });

      expect(result.characters).toBe(11);
      expect(result.charactersNoSpaces).toBe(10);
    });

    it('should handle empty text', async () => {
      const { outputs: result } = await ToolExecutor.execute('word-counter', {
        text: '',
      });

      expect(result.words).toBe(0);
      expect(result.characters).toBe(0);
    });

    it('should count sentences', async () => {
      const { outputs: result } = await ToolExecutor.execute('word-counter', {
        text: 'First sentence. Second sentence! Third sentence?',
      });

      expect(result.sentences).toBe(3);
    });
  });

  describe('Password Generator', () => {
    it('should generate password of specified length', async () => {
      const { outputs: result } = await ToolExecutor.execute('password-generator', {
        length: 16,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      });

      expect(result.password).toHaveLength(16);
    });

    it('should generate password with only lowercase', async () => {
      const { outputs: result } = await ToolExecutor.execute('password-generator', {
        length: 12,
        uppercase: false,
        lowercase: true,
        numbers: false,
        symbols: false,
      });

      expect(result.password).toMatch(/^[a-z]+$/);
    });

    it('should calculate password strength', async () => {
      const { outputs: result } = await ToolExecutor.execute('password-generator', {
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
    it('should format valid JSON', async () => {
      const { outputs: result } = await ToolExecutor.execute('json-formatter', {
        json: '{"name":"test","value":123}',
        minify: false,
      });

      expect(result.result).toContain('\n');
      expect(result.valid).toBe(true);
    });

    it('should handle invalid JSON', async () => {
      const { outputs: result } = await ToolExecutor.execute('json-formatter', {
        json: '{invalid json}',
        minify: false,
      });

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should minify JSON', async () => {
      const { outputs: result } = await ToolExecutor.execute('json-formatter', {
        json: '{\n  "name": "test"\n}',
        minify: true,
      });

      expect(result.result).not.toContain('\n');
    });
  });

  describe('QR Code Generator', () => {
    it('should generate QR code URL', async () => {
      const { outputs: result } = await ToolExecutor.execute('qr-code-generator', {
        text: 'https://example.com',
        size: 200,
      });

      expect(result.qrCodeUrl).toContain('http');
    });
  });

  describe('Base64 Encoder/Decoder', () => {
    it('should encode text to base64', async () => {
      const { outputs: result } = await ToolExecutor.execute('base64-encoder', {
        text: 'Hello World',
        action: 'encode',
      });

      expect(result.result).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should decode base64 to text', async () => {
      const { outputs: result } = await ToolExecutor.execute('base64-encoder', {
        text: 'SGVsbG8gV29ybGQ=',
        action: 'decode',
      });

      expect(result.result).toBe('Hello World');
    });
  });

  describe('Color Picker', () => {
    it('should convert HEX to RGB', async () => {
      const { outputs: result } = await ToolExecutor.execute('color-picker', {
        color: '#FF5733',
      });

      expect(result.rgb).toBe('rgb(255, 87, 51)');
    });

    it('should convert HEX to HSL', async () => {
      const { outputs: result } = await ToolExecutor.execute('color-picker', {
        color: '#FF5733',
      });

      expect(result.hsl).toContain('hsl');
    });
  });

  describe('Date Calculator', () => {
    it('should calculate days between dates', async () => {
      const { outputs: result } = await ToolExecutor.execute('days-between-dates', {
        startDate: '2024-01-01',
        endDate: '2024-01-10',
        includeEnd: false,
      });

      expect(result.days).toBe("9");
    });

    it('should add days to date', async () => {
      const { outputs: result } = await ToolExecutor.execute('date-calculator', {
        date: '2024-01-01',
        value: 10,
        operation: 'add',
        unit: 'days',
      });

      expect(result.result).toBe('2024-01-11');
    });
  });

  describe('Image to Base64', () => {
    it('should convert image to base64', async () => {
      const { outputs: result } = await ToolExecutor.execute('image-to-base64', {
        image: 'data:image/png;base64,test',
      });

      expect(result.base64).toBe('data:image/png;base64,test');
      expect(result.preview).toBe('data:image/png;base64,test');
    });

    it('should throw error if no image provided', async () => {
      const result = await ToolExecutor.execute('image-to-base64', {});
      expect(result.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent tool', async () => {
      const result = await ToolExecutor.execute('non-existent-tool', {});
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle missing required inputs in validation', () => {
      const config = {
        inputs: [{ id: 'test', label: 'Test', required: true, type: 'text' }]
      } as any;
      const result = ToolExecutor.validateInputs(config, {});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Test is required');
    });
  });
});
