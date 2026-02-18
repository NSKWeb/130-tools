import { ToolConfig } from '@tools-platform/types';
import { ToolExecutor } from './engine/executor';

// Import tool configs
import bmiCalculator from './configs/calculators/bmi-calculator.json';
import ageCalculator from './configs/calculators/age-calculator.json';
import percentageCalculator from './configs/calculators/percentage-calculator.json';
import loanCalculator from './configs/calculators/loan-calculator.json';
import discountCalculator from './configs/calculators/discount-calculator.json';
import emiCalculator from './configs/calculators/emi-calculator.json';
import tipCalculator from './configs/calculators/tip-calculator.json';
import lengthConverter from './configs/converters/length-converter.json';
import temperatureConverter from './configs/converters/temperature-converter.json';
import currencyConverter from './configs/converters/currency-converter.json';
import weightConverter from './configs/converters/weight-converter.json';
import wordCounter from './configs/text-tools/word-counter.json';
import caseConverter from './configs/text-tools/case-converter.json';
import reverseText from './configs/text-tools/reverse-text.json';
import characterCounter from './configs/text-tools/character-counter.json';
import removeDuplicates from './configs/text-tools/remove-duplicates.json';
import jsonFormatter from './configs/developer-tools/json-formatter.json';
import passwordGenerator from './configs/developer-tools/password-generator.json';
import qrCodeGenerator from './configs/generators/qr-code-generator.json';
import loremIpsumGenerator from './configs/generators/lorem-ipsum-generator.json';
import randomNumberGenerator from './configs/generators/random-number-generator.json';
import uuidGenerator from './configs/generators/uuid-generator.json';
import base64Encoder from './configs/developer-tools/base64-encoder.json';
import urlEncoder from './configs/developer-tools/url-encoder.json';
import hashGenerator from './configs/developer-tools/hash-generator.json';

// All tool configurations
export const toolConfigs: ToolConfig[] = [
  // Calculators
  bmiCalculator as ToolConfig,
  ageCalculator as ToolConfig,
  percentageCalculator as ToolConfig,
  loanCalculator as ToolConfig,
  discountCalculator as ToolConfig,
  emiCalculator as ToolConfig,
  tipCalculator as ToolConfig,

  // Converters
  lengthConverter as ToolConfig,
  temperatureConverter as ToolConfig,
  currencyConverter as ToolConfig,
  weightConverter as ToolConfig,

  // Text Tools
  wordCounter as ToolConfig,
  caseConverter as ToolConfig,
  reverseText as ToolConfig,
  characterCounter as ToolConfig,
  removeDuplicates as ToolConfig,

  // Developer Tools
  jsonFormatter as ToolConfig,
  passwordGenerator as ToolConfig,
  base64Encoder as ToolConfig,
  urlEncoder as ToolConfig,
  hashGenerator as ToolConfig,

  // Generators
  qrCodeGenerator as ToolConfig,
  loremIpsumGenerator as ToolConfig,
  randomNumberGenerator as ToolConfig,
  uuidGenerator as ToolConfig,
];

// Get tool by slug
export function getToolBySlug(slug: string): ToolConfig | undefined {
  return toolConfigs.find(tool => tool.slug === slug);
}

// Get tools by category
export function getToolsByCategory(category: string): ToolConfig[] {
  return toolConfigs.filter(tool => tool.category === category);
}

// Search tools
export function searchTools(query: string): ToolConfig[] {
  const lowerQuery = query.toLowerCase();
  return toolConfigs.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.slug.toLowerCase().includes(lowerQuery)
  );
}

// Get all categories
export function getCategories(): string[] {
  return Array.from(new Set(toolConfigs.map(tool => tool.category)));
}

// Get featured tools
export function getFeaturedTools(): ToolConfig[] {
  return toolConfigs.filter(tool => tool.featured || Math.random() > 0.7).slice(0, 6);
}

// Export ToolExecutor
export { ToolExecutor };
