import { ToolConfig } from '@tools-platform/types';
import { ToolExecutor } from './engine/executor';

// Import tool configs - Calculators
import bmiCalculator from './configs/calculators/bmi-calculator.json';
import ageCalculator from './configs/calculators/age-calculator.json';
import percentageCalculator from './configs/calculators/percentage-calculator.json';
import loanCalculator from './configs/calculators/loan-calculator.json';
import discountCalculator from './configs/calculators/discount-calculator.json';
import emiCalculator from './configs/calculators/emi-calculator.json';
import tipCalculator from './configs/calculators/tip-calculator.json';
import mortgageCalculator from './configs/calculators/mortgage-calculator.json';
import taxCalculator from './configs/calculators/tax-calculator.json';
import salaryCalculator from './configs/calculators/salary-calculator.json';
import investmentCalculator from './configs/calculators/investment-calculator.json';
import retirementCalculator from './configs/calculators/retirement-calculator.json';
import savingsCalculator from './configs/calculators/savings-calculator.json';
import compoundInterestCalculator from './configs/calculators/compound-interest-calculator.json';
import markupCalculator from './configs/calculators/markup-calculator.json';
import marginCalculator from './configs/calculators/margin-calculator.json';
import breakevenCalculator from './configs/calculators/breakeven-calculator.json';
import profitCalculator from './configs/calculators/profit-calculator.json';
import salesTaxCalculator from './configs/calculators/sales-tax-calculator.json';
import vatCalculator from './configs/calculators/vat-calculator.json';
import creditCardPayoffCalculator from './configs/calculators/credit-card-payoff-calculator.json';

// Converters
import lengthConverter from './configs/converters/length-converter.json';
import temperatureConverter from './configs/converters/temperature-converter.json';
import currencyConverter from './configs/converters/currency-converter.json';
import weightConverter from './configs/converters/weight-converter.json';
import areaConverter from './configs/converters/area-converter.json';
import volumeConverter from './configs/converters/volume-converter.json';
import speedConverter from './configs/converters/speed-converter.json';
import timeConverter from './configs/converters/time-converter.json';
import dataSizeConverter from './configs/converters/data-size-converter.json';
import pressureConverter from './configs/converters/pressure-converter.json';
import numberBaseConverter from './configs/converters/number-base-converter.json';
import romanNumeralConverter from './configs/converters/roman-numeral-converter.json';

// Text Tools
import wordCounter from './configs/text-tools/word-counter.json';
import caseConverter from './configs/text-tools/case-converter.json';
import reverseText from './configs/text-tools/reverse-text.json';
import characterCounter from './configs/text-tools/character-counter.json';
import removeDuplicates from './configs/text-tools/remove-duplicates.json';
import sentenceCounter from './configs/text-tools/sentence-counter.json';
import paragraphCounter from './configs/text-tools/paragraph-counter.json';
import sortLines from './configs/text-tools/sort-lines.json';
import removeAccents from './configs/text-tools/remove-accents.json';
import cleanText from './configs/text-tools/clean-text.json';
import letterCounter from './configs/text-tools/letter-counter.json';
import lineCounter from './configs/text-tools/line-counter.json';
import emptyLineRemover from './configs/text-tools/empty-line-remover.json';

// Developer Tools
import jsonFormatter from './configs/developer-tools/json-formatter.json';
import passwordGenerator from './configs/developer-tools/password-generator.json';
import base64Encoder from './configs/developer-tools/base64-encoder.json';
import urlEncoder from './configs/developer-tools/url-encoder.json';
import hashGenerator from './configs/developer-tools/hash-generator.json';
import htmlFormatter from './configs/developer-tools/html-formatter.json';
import cssFormatter from './configs/developer-tools/css-formatter.json';
import javascriptFormatter from './configs/developer-tools/javascript-formatter.json';
import xmlFormatter from './configs/developer-tools/xml-formatter.json';
import sqlFormatter from './configs/developer-tools/sql-formatter.json';
import yamlFormatter from './configs/developer-tools/yaml-formatter.json';
import regexTester from './configs/developer-tools/regex-tester.json';
import colorPicker from './configs/developer-tools/color-picker.json';
import jsonToXml from './configs/developer-tools/json-to-xml.json';
import xmlToJson from './configs/developer-tools/xml-to-json.json';
import jsonToCsv from './configs/developer-tools/json-to-csv.json';
import csvToJson from './configs/developer-tools/csv-to-json.json';

// Generators
import qrCodeGenerator from './configs/generators/qr-code-generator.json';
import loremIpsumGenerator from './configs/generators/lorem-ipsum-generator.json';
import randomNumberGenerator from './configs/generators/random-number-generator.json';
import uuidGenerator from './configs/generators/uuid-generator.json';
import invoiceGenerator from './configs/generators/invoice-generator.json';
import receiptGenerator from './configs/generators/receipt-generator.json';
import barcodeGenerator from './configs/generators/barcode-generator.json';
import colorPaletteGenerator from './configs/generators/color-palette-generator.json';
import gradientGenerator from './configs/generators/gradient-generator.json';
import avatarGenerator from './configs/generators/avatar-generator.json';
import couponGenerator from './configs/generators/coupon-generator.json';
import randomPicker from './configs/generators/random-picker.json';
import timestampGenerator from './configs/generators/timestamp-generator.json';
import quoteGenerator from './configs/generators/quote-generator.json';

// Security Tools
import passwordStrengthChecker from './configs/security-tools/password-strength-checker.json';
import hashGeneratorSecurity from './configs/security-tools/hash-generator.json';
import sslChecker from './configs/security-tools/ssl-checker.json';
import ipLookup from './configs/security-tools/ip-lookup.json';
import whoisLookup from './configs/security-tools/whois-lookup.json';
import dnsLookup from './configs/security-tools/dns-lookup.json';
import httpHeadersChecker from './configs/security-tools/http-headers-checker.json';
import userAgentParser from './configs/security-tools/user-agent-parser.json';
import securityHeadersChecker from './configs/security-tools/security-headers-checker.json';
import corsChecker from './configs/security-tools/cors-checker.json';

// Misc Tools
import timeZoneConverter from './configs/misc/time-zone-converter.json';
import dateCalculator from './configs/misc/date-calculator.json';
import daysBetweenDates from './configs/misc/days-between-dates.json';
import workDaysCalculator from './configs/misc/work-days-calculator.json';
import sunriseSunset from './configs/misc/sunrise-sunset.json';
import moonPhase from './configs/misc/moon-phase.json';
import zipCodeLookup from './configs/misc/zip-code-lookup.json';
import diceRoller from './configs/misc/dice-roller.json';
import coinFlip from './configs/misc/coin-flip.json';
import randomLetterGenerator from './configs/misc/random-letter-generator.json';
import percentageChangeCalculator from './configs/misc/percentage-change-calculator.json';

// SEO Tools
import metaTagAnalyzer from './configs/seo-tools/meta-tag-analyzer.json';
import keywordDensity from './configs/seo-tools/keyword-density.json';
import serpPreview from './configs/seo-tools/serp-preview.json';
import openGraphPreview from './configs/seo-tools/open-graph-preview.json';
import twitterCardPreview from './configs/seo-tools/twitter-card-preview.json';
import headingAnalyzer from './configs/seo-tools/heading-analyzer.json';
import imageAltChecker from './configs/seo-tools/image-alt-checker.json';
import sitemapGenerator from './configs/seo-tools/sitemap-generator.json';
import robotsTxtGenerator from './configs/seo-tools/robots-txt-generator.json';
import internalLinkAnalyzer from './configs/seo-tools/internal-link-analyzer.json';

// Social Media Tools
import hashtagGenerator from './configs/social-media/hashtag-generator.json';
import usernameGenerator from './configs/social-media/username-generator.json';
import bioGenerator from './configs/social-media/bio-generator.json';
import captionGenerator from './configs/social-media/caption-generator.json';
import postScheduler from './configs/social-media/post-scheduler.json';

// All tool configurations (113 tools total)
export const toolConfigs: ToolConfig[] = [
  // Calculators (20 tools)
  bmiCalculator as ToolConfig,
  ageCalculator as ToolConfig,
  percentageCalculator as ToolConfig,
  loanCalculator as ToolConfig,
  discountCalculator as ToolConfig,
  emiCalculator as ToolConfig,
  tipCalculator as ToolConfig,
  mortgageCalculator as ToolConfig,
  taxCalculator as ToolConfig,
  salaryCalculator as ToolConfig,
  investmentCalculator as ToolConfig,
  retirementCalculator as ToolConfig,
  savingsCalculator as ToolConfig,
  compoundInterestCalculator as ToolConfig,
  markupCalculator as ToolConfig,
  marginCalculator as ToolConfig,
  breakevenCalculator as ToolConfig,
  profitCalculator as ToolConfig,
  salesTaxCalculator as ToolConfig,
  vatCalculator as ToolConfig,
  creditCardPayoffCalculator as ToolConfig,

  // Converters (12 tools)
  lengthConverter as ToolConfig,
  temperatureConverter as ToolConfig,
  currencyConverter as ToolConfig,
  weightConverter as ToolConfig,
  areaConverter as ToolConfig,
  volumeConverter as ToolConfig,
  speedConverter as ToolConfig,
  timeConverter as ToolConfig,
  dataSizeConverter as ToolConfig,
  pressureConverter as ToolConfig,
  numberBaseConverter as ToolConfig,
  romanNumeralConverter as ToolConfig,

  // Text Tools (13 tools)
  wordCounter as ToolConfig,
  caseConverter as ToolConfig,
  reverseText as ToolConfig,
  characterCounter as ToolConfig,
  removeDuplicates as ToolConfig,
  sentenceCounter as ToolConfig,
  paragraphCounter as ToolConfig,
  sortLines as ToolConfig,
  removeAccents as ToolConfig,
  cleanText as ToolConfig,
  letterCounter as ToolConfig,
  lineCounter as ToolConfig,
  emptyLineRemover as ToolConfig,

  // Developer Tools (16 tools)
  jsonFormatter as ToolConfig,
  passwordGenerator as ToolConfig,
  base64Encoder as ToolConfig,
  urlEncoder as ToolConfig,
  hashGenerator as ToolConfig,
  htmlFormatter as ToolConfig,
  cssFormatter as ToolConfig,
  javascriptFormatter as ToolConfig,
  xmlFormatter as ToolConfig,
  sqlFormatter as ToolConfig,
  yamlFormatter as ToolConfig,
  regexTester as ToolConfig,
  colorPicker as ToolConfig,
  jsonToXml as ToolConfig,
  xmlToJson as ToolConfig,
  jsonToCsv as ToolConfig,
  csvToJson as ToolConfig,

  // Generators (13 tools)
  qrCodeGenerator as ToolConfig,
  loremIpsumGenerator as ToolConfig,
  randomNumberGenerator as ToolConfig,
  uuidGenerator as ToolConfig,
  invoiceGenerator as ToolConfig,
  receiptGenerator as ToolConfig,
  barcodeGenerator as ToolConfig,
  colorPaletteGenerator as ToolConfig,
  gradientGenerator as ToolConfig,
  avatarGenerator as ToolConfig,
  couponGenerator as ToolConfig,
  randomPicker as ToolConfig,
  timestampGenerator as ToolConfig,
  quoteGenerator as ToolConfig,

  // Security Tools (10 tools)
  passwordStrengthChecker as ToolConfig,
  hashGeneratorSecurity as ToolConfig,
  sslChecker as ToolConfig,
  ipLookup as ToolConfig,
  whoisLookup as ToolConfig,
  dnsLookup as ToolConfig,
  httpHeadersChecker as ToolConfig,
  userAgentParser as ToolConfig,
  securityHeadersChecker as ToolConfig,
  corsChecker as ToolConfig,

  // Misc Tools (11 tools)
  timeZoneConverter as ToolConfig,
  dateCalculator as ToolConfig,
  daysBetweenDates as ToolConfig,
  workDaysCalculator as ToolConfig,
  sunriseSunset as ToolConfig,
  moonPhase as ToolConfig,
  zipCodeLookup as ToolConfig,
  diceRoller as ToolConfig,
  coinFlip as ToolConfig,
  randomLetterGenerator as ToolConfig,
  percentageChangeCalculator as ToolConfig,

  // SEO Tools (10 tools)
  metaTagAnalyzer as ToolConfig,
  keywordDensity as ToolConfig,
  serpPreview as ToolConfig,
  openGraphPreview as ToolConfig,
  twitterCardPreview as ToolConfig,
  headingAnalyzer as ToolConfig,
  imageAltChecker as ToolConfig,
  sitemapGenerator as ToolConfig,
  robotsTxtGenerator as ToolConfig,
  internalLinkAnalyzer as ToolConfig,

  // Social Media (5 tools)
  hashtagGenerator as ToolConfig,
  usernameGenerator as ToolConfig,
  bioGenerator as ToolConfig,
  captionGenerator as ToolConfig,
  postScheduler as ToolConfig,
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
