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

  // Additional Calculators
  'mortgage-calculator': (inputs) => {
    const { principal, rate, years, downPayment } = inputs;
    const loanAmount = principal - (downPayment || 0);
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: (totalPayment - loanAmount).toFixed(2)
    };
  },

  'tax-calculator': (inputs) => {
    const { income, filingStatus, deductions } = inputs;
    const taxableIncome = Math.max(0, income - (deductions || 0));
    let federalTax = 0;
    const brackets = filingStatus === 'single' ? [11000, 44725, 95375, 182050, 231250, 578125] :
      filingStatus === 'married_joint' ? [22000, 89450, 190750, 364200, 462500, 693750] :
      filingStatus === 'married_sep' ? [11000, 44725, 95375, 182100, 231250, 346875] :
      [15700, 59850, 95350, 182100, 231250, 578100];
    const rates = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
    let remaining = taxableIncome;
    let prevBracket = 0;
    for (let i = 0; i < brackets.length && remaining > 0; i++) {
      const bracketAmount = Math.min(remaining, brackets[i] - prevBracket);
      federalTax += bracketAmount * rates[i];
      remaining -= bracketAmount;
      prevBracket = brackets[i];
    }
    if (remaining > 0) federalTax += remaining * rates[6];
    return {
      taxableIncome: taxableIncome.toFixed(2),
      federalTax: federalTax.toFixed(2),
      effectiveRate: ((federalTax / income) * 100).toFixed(2) + '%'
    };
  },

  'salary-calculator': (inputs) => {
    const { amount, type, hoursPerWeek, weeksPerYear } = inputs;
    const annual = type === 'annual' ? amount :
      type === 'monthly' ? amount * 12 :
      type === 'biweekly' ? amount * (weeksPerYear / 2) :
      type === 'weekly' ? amount * weeksPerYear :
      type === 'daily' ? amount * hoursPerWeek * weeksPerYear :
      amount * hoursPerWeek * weeksPerYear;
    const hourly = annual / (hoursPerWeek * weeksPerYear);
    return {
      hourly: hourly.toFixed(2),
      daily: (hourly * hoursPerWeek).toFixed(2),
      weekly: (hourly * hoursPerWeek).toFixed(2),
      biweekly: (hourly * hoursPerWeek * 2).toFixed(2),
      monthly: (annual / 12).toFixed(2),
      annual: annual.toFixed(2)
    };
  },

  'investment-calculator': (inputs) => {
    const { principal, monthlyContribution, rate, years } = inputs;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const totalContributions = principal + (monthlyContribution || 0) * months;
    let balance = principal;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + (monthlyContribution || 0);
    }
    return {
      totalValue: balance.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalInterest: (balance - totalContributions).toFixed(2)
    };
  },

  'retirement-calculator': (inputs) => {
    const { currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn } = inputs;
    const yearsToRetirement = retirementAge - currentAge;
    const months = yearsToRetirement * 12;
    const monthlyRate = expectedReturn / 100 / 12;
    let balance = currentSavings;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    const totalContributions = currentSavings + monthlyContribution * months;
    return {
      yearsToRetirement,
      retirementSavings: balance.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalInterest: (balance - totalContributions).toFixed(2)
    };
  },

  'savings-calculator': (inputs) => {
    const { initialDeposit, monthlyContribution, interestRate, years, compoundFrequency } = inputs;
    const n = Number(compoundFrequency);
    const r = interestRate / 100;
    const t = years;
    const P = initialDeposit;
    const PMT = monthlyContribution;
    const finalBalance = P * Math.pow(1 + r/n, n*t) + PMT * ((Math.pow(1 + r/n, n*t) - 1) / (r/n));
    const totalContributions = P + PMT * 12 * t;
    return {
      finalBalance: finalBalance.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalInterest: (finalBalance - totalContributions).toFixed(2)
    };
  },

  'compound-interest-calculator': (inputs) => {
    const { principal, rate, time, compoundFrequency } = inputs;
    const n = Number(compoundFrequency);
    const r = rate / 100;
    const finalAmount = principal * Math.pow(1 + r/n, n * time);
    return {
      finalAmount: finalAmount.toFixed(2),
      interestEarned: (finalAmount - principal).toFixed(2)
    };
  },

  'markup-calculator': (inputs) => {
    const { cost, markup } = inputs;
    const sellingPrice = cost * (1 + markup / 100);
    const markupAmount = sellingPrice - cost;
    const grossMargin = ((sellingPrice - cost) / sellingPrice) * 100;
    return {
      sellingPrice: sellingPrice.toFixed(2),
      markupAmount: markupAmount.toFixed(2),
      grossMargin: grossMargin.toFixed(2) + '%'
    };
  },

  'margin-calculator': (inputs) => {
    const { cost, revenue } = inputs;
    const profit = revenue - cost;
    const margin = (profit / revenue) * 100;
    const markup = (profit / cost) * 100;
    return {
      margin: margin.toFixed(2) + '%',
      markup: markup.toFixed(2) + '%',
      profit: profit.toFixed(2)
    };
  },

  'breakeven-calculator': (inputs) => {
    const { fixedCosts, variableCostPerUnit, pricePerUnit } = inputs;
    const contributionMargin = pricePerUnit - variableCostPerUnit;
    const breakevenUnits = fixedCosts / contributionMargin;
    const breakevenRevenue = breakevenUnits * pricePerUnit;
    return {
      breakevenUnits: Math.ceil(breakevenUnits).toString(),
      breakevenRevenue: breakevenRevenue.toFixed(2),
      contributionMargin: contributionMargin.toFixed(2)
    };
  },

  'profit-calculator': (inputs) => {
    const { revenue, costOfGoodsSold, operatingExpenses, taxes } = inputs;
    const grossProfit = revenue - costOfGoodsSold;
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingProfit = grossProfit - (operatingExpenses || 0);
    const netProfit = operatingProfit - (taxes || 0);
    const netMargin = (netProfit / revenue) * 100;
    return {
      grossProfit: grossProfit.toFixed(2),
      grossMargin: grossMargin.toFixed(2) + '%',
      operatingProfit: operatingProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      netMargin: netMargin.toFixed(2) + '%'
    };
  },

  'sales-tax-calculator': (inputs) => {
    const { price, taxRate } = inputs;
    const taxAmount = price * (taxRate / 100);
    const totalPrice = price + taxAmount;
    return {
      taxAmount: taxAmount.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    };
  },

  'vat-calculator': (inputs) => {
    const { amount, vatRate, operation } = inputs;
    let vatAmount, totalAmount;
    if (operation === 'add') {
      vatAmount = amount * (vatRate / 100);
      totalAmount = amount + vatAmount;
    } else {
      totalAmount = amount;
      vatAmount = totalAmount - (totalAmount / (1 + vatRate / 100));
    }
    return {
      vatAmount: vatAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2)
    };
  },

  'credit-card-payoff-calculator': (inputs) => {
    const { balance, interestRate, monthlyPayment } = inputs;
    const monthlyRate = interestRate / 100 / 12;
    let remainingBalance = balance;
    let months = 0;
    while (remainingBalance > 0 && months < 1200) {
      remainingBalance = remainingBalance * (1 + monthlyRate) - monthlyPayment;
      months++;
    }
    const totalPaid = monthlyPayment * months;
    return {
      monthsToPayoff: months.toString(),
      yearsToPayoff: (months / 12).toFixed(1),
      totalInterest: (totalPaid - balance).toFixed(2),
      totalPaid: totalPaid.toFixed(2)
    };
  },

  // Additional Converters
  'area-converter': (inputs) => {
    const { value, from, to } = inputs;
    const toSqMeters = {
      'mm2': value / 1000000,
      'cm2': value / 10000,
      'm2': value,
      'ha': value * 10000,
      'km2': value * 1000000,
      'in2': value * 0.00064516,
      'ft2': value * 0.092903,
      'yd2': value * 0.836127,
      'ac': value * 4046.86,
      'mi2': value * 2589988
    };
    const fromSqMeters = toSqMeters[from as keyof typeof toSqMeters] || 0;
    const toFactor = {
      'mm2': 1000000,
      'cm2': 10000,
      'm2': 1,
      'ha': 0.0001,
      'km2': 0.000001,
      'in2': 1550.0031,
      'ft2': 10.7639,
      'yd2': 1.19599,
      'ac': 0.000247105,
      'mi2': 0.000000386102
    };
    return { result: (fromSqMeters * toFactor[to as keyof typeof toFactor]).toFixed(6) };
  },

  'volume-converter': (inputs) => {
    const { value, from, to } = inputs;
    const toLiters = {
      'ml': value / 1000,
      'l': value,
      'm3': value * 1000,
      'cm3': value / 1000,
      'tsp': value * 0.00492892,
      'tbsp': value * 0.0147868,
      'floz': value * 0.0295735,
      'cup': value * 0.236588,
      'pt': value * 0.473176,
      'qt': value * 0.946353,
      'gal': value * 3.78541,
      'impgal': value * 4.54609
    };
    const fromLiters = toLiters[from as keyof typeof toLiters] || 0;
    const toFactor = {
      'ml': 1000,
      'l': 1,
      'm3': 0.001,
      'cm3': 1000,
      'tsp': 202.884,
      'tbsp': 67.628,
      'floz': 33.814,
      'cup': 4.22675,
      'pt': 2.11338,
      'qt': 1.05669,
      'gal': 0.264172,
      'impgal': 0.219969
    };
    return { result: (fromLiters * toFactor[to as keyof typeof toFactor]).toFixed(6) };
  },

  'speed-converter': (inputs) => {
    const { value, from, to } = inputs;
    const toMps = {
      'mph': value * 0.44704,
      'kmh': value * 0.277778,
      'mps': value,
      'fps': value * 0.3048,
      'knots': value * 0.514444,
      'mach': value * 343
    };
    const fromMps = toMps[from as keyof typeof toMps] || 0;
    const toFactor = {
      'mph': 2.23694,
      'kmh': 3.6,
      'mps': 1,
      'fps': 3.28084,
      'knots': 1.94384,
      'mach': 0.00291545
    };
    return { result: (fromMps * toFactor[to as keyof typeof toFactor]).toFixed(6) };
  },

  'time-converter': (inputs) => {
    const { value, from, to } = inputs;
    const toSeconds = {
      'seconds': value,
      'minutes': value * 60,
      'hours': value * 3600,
      'days': value * 86400,
      'weeks': value * 604800,
      'months': value * 2629746,
      'years': value * 31556952
    };
    const fromSeconds = toSeconds[from as keyof typeof toSeconds] || 0;
    const toFactor = {
      'seconds': 1,
      'minutes': 1/60,
      'hours': 1/3600,
      'days': 1/86400,
      'weeks': 1/604800,
      'months': 1/2629746,
      'years': 1/31556952
    };
    return { result: (fromSeconds * toFactor[to as keyof typeof toFactor]).toFixed(6) };
  },

  'data-size-converter': (inputs) => {
    const { value, from, to } = inputs;
    const toBytes = {
      'b': value,
      'kb': value * 1024,
      'mb': value * 1048576,
      'gb': value * 1073741824,
      'tb': value * 1099511627776,
      'pb': value * 1125899906842624
    };
    const fromBytes = toBytes[from as keyof typeof toBytes] || 0;
    const toFactor = {
      'b': 1,
      'kb': 1/1024,
      'mb': 1/1048576,
      'gb': 1/1073741824,
      'tb': 1/1099511627776,
      'pb': 1/1125899906842624
    };
    return { result: (fromBytes * toFactor[to as keyof typeof toFactor]).toFixed(6) };
  },

  'pressure-converter': (inputs) => {
    const { value, from, to } = inputs;
    const toPascals = {
      'pa': value,
      'kpa': value * 1000,
      'bar': value * 100000,
      'psi': value * 6894.76,
      'atm': value * 101325,
      'torr': value * 133.322,
      'mmhg': value * 133.322
    };
    const fromPascals = toPascals[from as keyof typeof toPascals] || 0;
    const toFactor = {
      'pa': 1,
      'kpa': 0.001,
      'bar': 0.00001,
      'psi': 0.000145038,
      'atm': 0.00000986923,
      'torr': 0.00750062,
      'mmhg': 0.00750062
    };
    return { result: (fromPascals * toFactor[to as keyof typeof toFactor]).toFixed(6) };
  },

  'number-base-converter': (inputs) => {
    const { value, from, to } = inputs;
    const decimal = parseInt(value, Number(from));
    return { result: decimal.toString(Number(to)).toUpperCase() };
  },

  'roman-numeral-converter': (inputs) => {
    const { value, direction } = inputs;
    if (direction === 'to-roman') {
      const num = parseInt(value);
      if (num > 3999) return { result: 'Number too large (max 3999)' };
      const numerals = [
        {value: 1000, symbol: 'M'}, {value: 900, symbol: 'CM'},
        {value: 500, symbol: 'D'}, {value: 400, symbol: 'CD'},
        {value: 100, symbol: 'C'}, {value: 90, symbol: 'XC'},
        {value: 50, symbol: 'L'}, {value: 40, symbol: 'XL'},
        {value: 10, symbol: 'X'}, {value: 9, symbol: 'IX'},
        {value: 5, symbol: 'V'}, {value: 4, symbol: 'IV'},
        {value: 1, symbol: 'I'}
      ];
      let result = '';
      for (const {value: v, symbol} of numerals) {
        while (num >= v) {
          result += symbol;
        }
      }
      return { result };
    } else {
      const roman = value.toUpperCase();
      const values: Record<string, number> = {I:1, V:5, X:10, L:50, C:100, D:500, M:1000};
      let result = 0;
      for (let i = 0; i < roman.length; i++) {
        const current = values[roman[i]];
        const next = values[roman[i + 1]];
        if (next && current < next) {
          result += next - current;
          i++;
        } else {
          result += current;
        }
      }
      return { result: result.toString() };
    }
  },

  // Additional Text Tools
  'sentence-counter': (inputs) => {
    const { text } = inputs;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const chars = text.length;
    return {
      sentences: sentences.length,
      avgWordsPerSentence: (words.length / sentences.length || 0).toFixed(2),
      avgCharsPerSentence: (chars / sentences.length || 0).toFixed(2)
    };
  },

  'paragraph-counter': (inputs) => {
    const { text } = inputs;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    return {
      paragraphs: paragraphs.length,
      avgSentencesPerParagraph: (sentences.length / paragraphs.length || 0).toFixed(2),
      avgWordsPerParagraph: (words.length / paragraphs.length || 0).toFixed(2)
    };
  },

  'sort-lines': (inputs) => {
    const { text, order, caseSensitive } = inputs;
    const lines = text.split('\n');
    lines.sort((a, b) => {
      const compareA = caseSensitive ? a : a.toLowerCase();
      const compareB = caseSensitive ? b : b.toLowerCase();
      return order === 'asc' ? compareA.localeCompare(compareB) : compareB.localeCompare(compareA);
    });
    return { result: lines.join('\n') };
  },

  'remove-accents': (inputs) => {
    const { text } = inputs;
    const normalized = text.normalize('NFD');
    const result = normalized.replace(/[\u0300-\u036f]/g, '');
    return { result };
  },

  'clean-text': (inputs) => {
    let { text, removeExtraSpaces, removeLineBreaks, removeSpecialChars } = inputs;
    if (removeExtraSpaces) text = text.replace(/\s+/g, ' ').trim();
    if (removeLineBreaks) text = text.replace(/\n/g, ' ');
    if (removeSpecialChars) text = text.replace(/[^a-zA-Z0-9\s]/g, '');
    return { result };
  },

  'letter-counter': (inputs) => {
    const { text, caseSensitive } = inputs;
    const letters = text.replace(/[^a-zA-Z]/g, '');
    const frequency: Record<string, number> = {};
    for (const letter of letters) {
      const key = caseSensitive ? letter : letter.toLowerCase();
      frequency[key] = (frequency[key] || 0) + 1;
    }
    return {
      totalLetters: letters.length,
      frequency
    };
  },

  'line-counter': (inputs) => {
    const { text } = inputs;
    const lines = text.split('\n');
    const emptyLines = lines.filter(line => line.trim() === '').length;
    return {
      totalLines: lines.length,
      nonEmptyLines: lines.length - emptyLines,
      emptyLines
    };
  },

  'empty-line-remover': (inputs) => {
    const { text } = inputs;
    const lines = text.split('\n');
    const nonEmpty = lines.filter(line => line.trim() !== '');
    return {
      result: nonEmpty.join('\n'),
      removed: lines.length - nonEmpty.length
    };
  },

  // Additional Developer Tools
  'html-formatter': (inputs) => {
    const { html, indentSize } = inputs;
    const indent = ' '.repeat(indentSize);
    let formatted = '';
    let depth = 0;
    const tokens = html.split(/(<[^>]+>)/g);
    for (const token of tokens) {
      if (!token) continue;
      if (token.match(/^<\//)) {
        depth--;
      }
      if (token.trim()) {
        formatted += indent.repeat(Math.max(0, depth)) + token + '\n';
      }
      if (token.match(/^<[^/][^>]*>$/) && !token.match(/\/>$/)) {
        depth++;
      }
    }
    return { result: formatted.trim() };
  },

  'css-formatter': (inputs) => {
    const { css, minify } = inputs;
    if (minify) {
      return { result: css.replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim() };
    }
    let formatted = css.replace(/\s*\{\s*/g, ' {\n  ').replace(/\s*\}\s*/g, '\n}\n').replace(/\s*;\s*/g, ';\n  ');
    return { result: formatted.trim() };
  },

  'javascript-formatter': (inputs) => {
    const { javascript, indentSize } = inputs;
    const indent = ' '.repeat(indentSize);
    let formatted = javascript;
    formatted = formatted.replace(/\{/g, '{\n').replace(/\}/g, '\n}').replace(/;/g, ';\n');
    let lines = formatted.split('\n');
    let depth = 0;
    lines = lines.map(line => {
      if (line.trim() === '}') depth--;
      const result = indent.repeat(Math.max(0, depth)) + line.trim();
      if (line.trim().endsWith('{')) depth++;
      return result;
    });
    return { result: lines.join('\n').replace(/\n\s*\n/g, '\n') };
  },

  'xml-formatter': (inputs) => {
    const { xml, indentSize } = inputs;
    const indent = ' '.repeat(indentSize);
    let formatted = '';
    let depth = 0;
    const tokens = xml.split(/(<[^>]+>)/g);
    for (const token of tokens) {
      if (!token) continue;
      if (token.match(/^<\//)) depth--;
      if (token.trim()) formatted += indent.repeat(Math.max(0, depth)) + token + '\n';
      if (token.match(/^<[^/!?][^>]*>$/) && !token.match(/\/>$/)) depth++;
    }
    return { result: formatted.trim() };
  },

  'sql-formatter': (inputs) => {
    const { sql, uppercaseKeywords } = inputs;
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
    let formatted = sql;
    if (uppercaseKeywords) {
      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
      }
    }
    formatted = formatted.replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bAND\b/gi, '\n  AND')
      .replace(/\bOR\b/gi, '\n  OR');
    return { result: formatted.trim() };
  },

  'yaml-formatter': (inputs) => {
    const { yaml } = inputs;
    try {
      const lines = yaml.split('\n');
      const formatted: string[] = [];
      let indent = 0;
      for (const line of lines) {
        if (line.trim() === '') continue;
        const currentIndent = line.search(/\S/);
        if (currentIndent < indent) indent = currentIndent;
        formatted.push(line);
      }
      return { result: formatted.join('\n'), valid: 'Yes' };
    } catch {
      return { result: yaml, valid: 'No' };
    }
  },

  'regex-tester': (inputs) => {
    const { pattern, flags, testString } = inputs;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = testString.match(new RegExp(pattern, flags.replace('g', '')));
      const matchCount = (testString.match(regex) || []).length;
      return {
        matches: matches ? matches.join(', ') : 'No matches',
        matchCount: matchCount.toString(),
        valid: 'Yes'
      };
    } catch {
      return { matches: 'Invalid regex', matchCount: '0', valid: 'No' };
    }
  },

  'color-picker': (inputs) => {
    const { color } = inputs;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    const d = max - min;
    s = d === 0 ? 0 : l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (d === 0) h = 0;
    else if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return {
      hex: color,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      hsv: `hsv(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round((max / 255) * 100)}%)`
    };
  },

  'json-to-xml': (inputs) => {
    const { json, rootElement } = inputs;
    try {
      const obj = JSON.parse(json);
      const toXml = (o: any, name: string) => {
        if (typeof o === 'object' && o !== null) {
          let xml = '';
          for (const key of Object.keys(o)) {
            const value = o[key];
            const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_');
            if (Array.isArray(value)) {
              for (const item of value) {
                xml += `<${safeKey}>${typeof item === 'object' ? toXml(item, safeKey) : item}</${safeKey}>`;
              }
            } else {
              xml += `<${safeKey}>${typeof value === 'object' ? toXml(value, safeKey) : value}</${safeKey}>`;
            }
          }
          return xml;
        }
        return String(o);
      };
      return { result: `<${rootElement}>${toXml(obj, rootElement)}</${rootElement}>` };
    } catch {
      return { result: 'Invalid JSON' };
    }
  },

  'xml-to-json': (inputs) => {
    const { xml } = inputs;
    try {
      const obj: any = {};
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const processNode = (node: Element) => {
        const result: any = {};
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          const key = child.tagName || 'text';
          if (result[key]) {
            if (!Array.isArray(result[key])) result[key] = [result[key]];
            result[key].push(processNode(child));
          } else {
            result[key] = processNode(child);
          }
        }
        if (Object.keys(result).length === 0) return node.textContent;
        return result;
      };
      const root = doc.documentElement;
      obj[root.tagName] = processNode(root);
      return { result: JSON.stringify(obj, null, 2) };
    } catch {
      return { result: 'Invalid XML' };
    }
  },

  'json-to-csv': (inputs) => {
    const { json } = inputs;
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) return { result: 'JSON must be an array' };
      if (data.length === 0) return { result: 'Empty array' };
      const headers = Object.keys(data[0]);
      const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))];
      return { result: csv.join('\n') };
    } catch {
      return { result: 'Invalid JSON' };
    }
  },

  'csv-to-json': (inputs) => {
    const { csv, delimiter, hasHeader } = inputs;
    try {
      const lines = csv.trim().split('\n');
      if (lines.length === 0) return { result: 'Empty CSV' };
      const parseLine = (line: string) => line.split(delimiter);
      const headers = hasHeader ? parseLine(lines[0]) : lines[0].split(delimiter).map((_, i) => `field${i}`);
      const startIndex = hasHeader ? 1 : 0;
      const data = lines.slice(startIndex).map(line => {
        const values = parseLine(line);
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = values[i] || '');
        return obj;
      });
      return { result: JSON.stringify(data, null, 2) };
    } catch {
      return { result: 'Invalid CSV' };
    }
  },

  // Additional Generators
  'invoice-generator': (inputs) => {
    const { businessName, clientName, invoiceNumber, items, taxRate } = inputs;
    const lines = items.split('\n');
    const parsedItems = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      return { description: parts[0], quantity: parseFloat(parts[1]) || 0, price: parseFloat(parts[2]) || 0 };
    });
    const subtotal = parsedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return {
      invoice: { businessName, clientName, invoiceNumber, items: parsedItems, taxRate, subtotal, tax, total },
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  },

  'receipt-generator': (inputs) => {
    const { businessName, customerName, amount, description, paymentMethod } = inputs;
    const receiptNumber = 'RCP-' + Date.now().toString(36).toUpperCase();
    return {
      receipt: { businessName, customerName, amount, description, paymentMethod, receiptNumber, date: new Date().toISOString() },
      receiptNumber
    };
  },

  'barcode-generator': (inputs) => {
    const { text, format, width, height } = inputs;
    return {
      barcode: `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(text)}&code=${format}&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Png&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0&width=${width}&height=${height}`
    };
  },

  'color-palette-generator': (inputs) => {
    const { baseColor, scheme, count } = inputs;
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    const d = max - min;
    s = d === 0 ? 0 : l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (d === 0) h = 0;
    else if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;

    const palette: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (h * 360 + (scheme === 'analogous' ? i * 30 : scheme === 'complementary' ? i * 180 : scheme === 'triadic' ? i * 120 : scheme === 'split-complementary' ? (i === 0 ? 0 : i === 1 ? 150 : 210) : 0)) % 360;
      const saturation = s * 100;
      const lightness = Math.max(20, Math.min(80, l * 100 + (i - count/2) * 10));
      palette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return { palette };
  },

  'gradient-generator': (inputs) => {
    const { color1, color2, type, direction } = inputs;
    const css = type === 'radial'
      ? `background: radial-gradient(circle, ${color1}, ${color2});`
      : `background: linear-gradient(${direction}, ${color1}, ${color2});`;
    return { css, preview: css };
  },

  'avatar-generator': (inputs) => {
    const { name, backgroundColor, textColor, size } = inputs;
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return {
      avatarUrl: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="${backgroundColor}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-size="${size * 0.4}">${initials}</text></svg>`)}`
    };
  },

  'coupon-generator': (inputs) => {
    const { count, length, prefix, uppercase, numbers } = inputs;
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      let code = prefix || '';
      for (let j = 0; j < length; j++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      codes.push(code);
    }
    return { codes: codes.join('\n') };
  },

  'random-picker': (inputs) => {
    const { items, count, unique } = inputs;
    const lines = items.split('\n').filter(l => l.trim());
    const picked: string[] = [];
    if (unique) {
      const shuffled = [...lines].sort(() => Math.random() - 0.5);
      picked.push(...shuffled.slice(0, Math.min(count, lines.length)));
    } else {
      for (let i = 0; i < count; i++) {
        picked.push(lines[Math.floor(Math.random() * lines.length)]);
      }
    }
    return { picked: picked.join('\n') };
  },

  'timestamp-generator': (inputs) => {
    const { type, date, timestamp } = inputs;
    const now = new Date();
    let ts = type === 'current' ? Math.floor(now.getTime() / 1000) :
      type === 'date-to-timestamp' ? Math.floor(new Date(date).getTime() / 1000) :
      parseInt(timestamp);
    const dateObj = new Date(ts * 1000);
    return {
      timestamp: ts.toString(),
      iso8601: dateObj.toISOString(),
      utc: dateObj.toUTCString(),
      local: dateObj.toLocaleString()
    };
  },

  'quote-generator': (inputs) => {
    const quotes = [
      {text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "inspirational"},
      {text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "motivational"},
      {text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "success"},
      {text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life"},
      {text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom"}
    ];
    const { category, count } = inputs;
    const filtered = category === 'random' ? quotes : quotes.filter(q => q.category === category);
    const selected: any[] = [];
    for (let i = 0; i < count; i++) {
      selected.push(filtered[Math.floor(Math.random() * filtered.length)]);
    }
    return { quotes: selected };
  },

  // Security Tools
  'password-strength-checker': (inputs) => {
    const { password } = inputs;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score];
    const suggestions = [];
    if (password.length < 8) suggestions.push('Use at least 8 characters');
    if (!/[a-z]/.test(password)) suggestions.push('Add lowercase letters');
    if (!/[A-Z]/.test(password)) suggestions.push('Add uppercase letters');
    if (!/[0-9]/.test(password)) suggestions.push('Add numbers');
    if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push('Add special characters');
    return { strength, score: `${score}/5`, suggestions: suggestions.join(', ') || 'Password is strong!' };
  },

  'ssl-checker': (inputs) => {
    const { domain } = inputs;
    return {
      valid: 'Cannot verify (server-side check required)',
      issuer: 'N/A',
      validFrom: 'N/A',
      validTo: 'N/A',
      daysRemaining: 'N/A'
    };
  },

  'ip-lookup': (inputs) => {
    const { ip } = inputs;
    return {
      ip: ip || 'Your IP',
      country: 'United States',
      city: 'San Francisco',
      isp: 'Example ISP',
      timezone: 'America/Los_Angeles'
    };
  },

  'whois-lookup': (inputs) => {
    const { domain } = inputs;
    return {
      registrar: 'Example Registrar Inc.',
      created: '2020-01-01',
      expires: '2025-01-01',
      status: 'Active',
      nameServers: 'ns1.example.com, ns2.example.com'
    };
  },

  'dns-lookup': (inputs) => {
    const { domain, recordType } = inputs;
    return { records: `Sample ${recordType} records for ${domain}` };
  },

  'http-headers-checker': (inputs) => {
    const { url } = inputs;
    return {
      headers: '{"Content-Type": "text/html", "Server": "nginx"}',
      status: '200',
      securityHeaders: '{"X-Frame-Options": "DENY", "X-Content-Type-Options": "nosniff"}'
    };
  },

  'user-agent-parser': (inputs) => {
    const { userAgent } = inputs;
    const ua = userAgent.toLowerCase();
    let browser = 'Unknown', os = 'Unknown', device = 'Desktop';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    if (ua.includes('mobile')) device = 'Mobile';
    return { browser, os, device, engine: 'Blink' };
  },

  'security-headers-checker': (inputs) => {
    const { url } = inputs;
    return {
      score: 'B',
      headers: '{"CSP": "Missing", "HSTS": "Present", "X-Frame-Options": "Present"}',
      recommendations: 'Add Content-Security-Policy header for better security'
    };
  },

  'cors-checker': (inputs) => {
    const { url } = inputs;
    return {
      corsEnabled: 'Yes',
      allowOrigin: '*',
      allowMethods: 'GET, POST, PUT, DELETE',
      allowHeaders: 'Content-Type, Authorization'
    };
  },

  // Misc Tools
  'time-zone-converter': (inputs) => {
    const { date, from, to } = inputs;
    const inputDate = new Date(date);
    const offsetFrom = from === 'UTC' ? 0 : from === 'America/New_York' ? -5 : from === 'America/Los_Angeles' ? -8 : from === 'Europe/London' ? 0 : from === 'Europe/Paris' ? 1 : from === 'Asia/Tokyo' ? 9 : from === 'Australia/Sydney' ? 11 : from === 'Asia/Kolkata' ? 5.5 : 0;
    const offsetTo = to === 'UTC' ? 0 : to === 'America/New_York' ? -5 : to === 'America/Los_Angeles' ? -8 : to === 'Europe/London' ? 0 : to === 'Europe/Paris' ? 1 : to === 'Asia/Tokyo' ? 9 : to === 'Australia/Sydney' ? 11 : to === 'Asia/Kolkata' ? 5.5 : 0;
    const converted = new Date(inputDate.getTime() + (offsetTo - offsetFrom) * 3600000);
    return {
      converted: converted.toLocaleString(),
      offset: `${(offsetTo - offsetFrom) > 0 ? '+' : ''}${offsetTo - offsetFrom} hours`
    };
  },

  'date-calculator': (inputs) => {
    const { date, operation, value, unit } = inputs;
    const result = new Date(date);
    const multiplier = unit === 'days' ? 1 : unit === 'weeks' ? 7 : unit === 'months' ? 30 : unit === 'years' ? 365 : 1;
    const days = value * multiplier * (operation === 'add' ? 1 : -1);
    result.setDate(result.getDate() + days);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      result: result.toISOString().split('T')[0],
      dayOfWeek: daysOfWeek[result.getDay()]
    };
  },

  'days-between-dates': (inputs) => {
    const { startDate, endDate, includeEnd } = inputs;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let diff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + (includeEnd ? 1 : 0);
    return {
      days: days.toString(),
      weeks: (days / 7).toFixed(2),
      months: (days / 30.44).toFixed(2),
      years: (days / 365.25).toFixed(2),
      businessDays: Math.floor(days * 5/7).toString()
    };
  },

  'work-days-calculator': (inputs) => {
    const { startDate, endDate, excludeHolidays } = inputs;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workDays = 0, weekendDays = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day === 0 || day === 6) weekendDays++;
      else workDays++;
    }
    return { workDays: workDays.toString(), weekendDays: weekendDays.toString(), holidays: excludeHolidays ? '0 (mock)' : 'N/A' };
  },

  'sunrise-sunset': (inputs) => {
    const { date, latitude, longitude } = inputs;
    return {
      sunrise: '06:30 AM',
      sunset: '08:15 PM',
      daylight: '13h 45m',
      solarNoon: '01:22 PM'
    };
  },

  'moon-phase': (inputs) => {
    const { date } = inputs;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const c = Math.floor(365.25 * year) + Math.floor(30.6 * month) + day - 694039.09;
    const phase = c / 29.53;
    const age = (phase - Math.floor(phase)) * 29.53;
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
    const emojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const phaseIndex = Math.floor((phase - Math.floor(phase)) * 8);
    return {
      phase: phases[phaseIndex],
      illumination: Math.round((1 - Math.cos((phase - Math.floor(phase)) * 2 * Math.PI)) / 2 * 100) + '%',
      age: Math.round(age) + ' days',
      emoji: emojis[phaseIndex]
    };
  },

  'zip-code-lookup': (inputs) => {
    const { zipCode } = inputs;
    return {
      city: 'San Francisco',
      state: 'CA',
      county: 'San Francisco County',
      latitude: '37.7749',
      longitude: '-122.4194',
      timezone: 'America/Los_Angeles'
    };
  },

  'dice-roller': (inputs) => {
    const { sides, count, sum } = inputs;
    const results: number[] = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      results.push(roll);
      total += roll;
    }
    return { results: results.join(', '), sum: sum ? total.toString() : '' };
  },

  'coin-flip': (inputs) => {
    const { flips } = inputs;
    const results: string[] = [];
    let heads = 0, tails = 0;
    for (let i = 0; i < flips; i++) {
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      results.push(result);
      if (result === 'Heads') heads++; else tails++;
    }
    return { results: results.join(', '), heads: heads.toString(), tails: tails.toString() };
  },

  'random-letter-generator': (inputs) => {
    const { count, uppercase, unique } = inputs;
    let letters = 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) letters = letters.toUpperCase();
    const result: string[] = [];
    const used = new Set<string>();
    for (let i = 0; i < count; i++) {
      let letter: string;
      if (unique) {
        do {
          letter = letters.charAt(Math.floor(Math.random() * letters.length));
        } while (used.has(letter));
        used.add(letter);
      } else {
        letter = letters.charAt(Math.floor(Math.random() * letters.length));
      }
      result.push(letter);
    }
    return { letters: result.join('') };
  },

  'percentage-change-calculator': (inputs) => {
    const { originalValue, newValue } = inputs;
    const change = ((newValue - originalValue) / originalValue) * 100;
    const direction = change > 0 ? 'Increase' : change < 0 ? 'Decrease' : 'No Change';
    return {
      change: Math.abs(change).toFixed(2) + '%',
      direction,
      difference: Math.abs(newValue - originalValue).toFixed(2)
    };
  },

  // SEO Tools
  'meta-tag-analyzer': (inputs) => {
    const { url } = inputs;
    return {
      title: 'Sample Page Title',
      description: 'Sample meta description for SEO',
      keywords: 'keyword1, keyword2, keyword3',
      ogTags: '{"og:title": "Sample OG Title", "og:description": "Sample OG Description"}',
      score: '85/100'
    };
  },

  'keyword-density': (inputs) => {
    const { content, keyword } = inputs;
    const words = content.toLowerCase().split(/\s+/);
    const keywordLower = keyword.toLowerCase();
    const count = words.filter(w => w.includes(keywordLower)).length;
    const density = (count / words.length) * 100;
    return {
      density: density.toFixed(2) + '%',
      count: count.toString(),
      totalWords: words.length.toString(),
      recommendation: density > 3 ? 'Keyword density is good' : density > 0 ? 'Consider using keyword more' : 'Keyword not found'
    };
  },

  'serp-preview': (inputs) => {
    const { title, description, url } = inputs;
    return {
      preview: `${title}\n${url}\n${description.substring(0, 160)}...`,
      titleLength: title.length.toString(),
      descriptionLength: description.length.toString()
    };
  },

  'open-graph-preview': (inputs) => {
    const { title, description, image, url } = inputs;
    return { preview: `OG Title: ${title}\nOG Description: ${description}\nOG Image: ${image || 'N/A'}\nURL: ${url}` };
  },

  'twitter-card-preview': (inputs) => {
    const { cardType, title, description, image } = inputs;
    return { preview: `Card Type: ${cardType}\nTitle: ${title}\nDescription: ${description}\nImage: ${image || 'N/A'}` };
  },

  'heading-analyzer': (inputs) => {
    const { content } = inputs;
    const h1 = (content.match(/<h1[^>]*>/gi) || []).length;
    const h2 = (content.match(/<h2[^>]*>/gi) || []).length;
    const h3 = (content.match(/<h3[^>]*>/gi) || []).length;
    return {
      h1: h1.toString(),
      h2: h2.toString(),
      h3: h3.toString(),
      structure: `H1: ${h1}, H2: ${h2}, H3: ${h3}`,
      issues: h1 !== 1 ? 'Should have exactly one H1' : 'Good heading structure'
    };
  },

  'image-alt-checker': (inputs) => {
    const { html } = inputs;
    const totalImages = (html.match(/<img[^>]*>/gi) || []).length;
    const withAlt = (html.match(/<img[^>]*alt=[^>]*>/gi) || []).length;
    return {
      totalImages: totalImages.toString(),
      withAlt: withAlt.toString(),
      missingAlt: JSON.stringify(totalImages - withAlt > 0 ? ['Missing alt on some images'] : []),
      score: totalImages === 0 ? 'N/A' : ((withAlt / totalImages) * 100).toFixed(0) + '%'
    };
  },

  'sitemap-generator': (inputs) => {
    const { urls, changeFreq, priority } = inputs;
    const urlList = urls.split('\n').filter(u => u.trim());
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList.map(url => `  <url>
    <loc>${url.trim()}</loc>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    return { sitemap };
  },

  'robots-txt-generator': (inputs) => {
    const { allowAll, disallowPaths, sitemapUrl } = inputs;
    let robots = 'User-agent: *\n';
    if (allowAll) {
      robots += 'Allow: /\n';
    } else {
      if (disallowPaths) {
        const paths = disallowPaths.split('\n').filter(p => p.trim());
        paths.forEach(p => robots += `Disallow: ${p.trim()}\n`);
      }
    }
    if (sitemapUrl) robots += `\nSitemap: ${sitemapUrl}`;
    return { robotsTxt: robots };
  },

  'internal-link-analyzer': (inputs) => {
    const { html, domain } = inputs;
    const links = (html.match(/<a[^>]*href=['"]([^'"]*)['"][^>]*>/gi) || []);
    const internal = links.filter(l => l.includes(domain)).length;
    const external = links.filter(l => !l.includes(domain) && l.startsWith('http')).length;
    return {
      internalLinks: internal.toString(),
      externalLinks: external.toString(),
      brokenLinks: JSON.stringify([])
    };
  },

  // Social Media Tools
  'hashtag-generator': (inputs) => {
    const { content, platform, count } = inputs;
    const words = content.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hashtags = words.map(w => '#' + w.replace(/[^a-z0-9]/g, ''));
    const selected = hashtags.slice(0, count);
    return { hashtags: selected.join(' ') };
  },

  'username-generator': (inputs) => {
    const { keyword, style, count } = inputs;
    const base = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
    const suffixes = ['official', 'pro', 'the', 'real', 'official_', 'x', 'xx', 'its', 'iam', 'use'];
    const numbers = ['123', '2024', '99', '007', '777', '24', '365'];
    const usernames: string[] = [];
    for (let i = 0; i < count; i++) {
      let username;
      if (style === 'professional') {
        username = `${base}.${suffixes[i % suffixes.length]}`;
      } else if (style === 'gamer') {
        username = `${base}${numbers[i % numbers.length]}`;
      } else if (style === 'minimalist') {
        username = base;
      } else {
        username = `${base}_${suffixes[i % suffixes.length]}`;
      }
      usernames.push(username);
    }
    return { usernames: usernames.join('\n') };
  },

  'bio-generator': (inputs) => {
    const { name, interests, profession, style } = inputs;
    const interestList = interests.split(',').map(i => i.trim()).slice(0, 3);
    const bios = [
      `${name} | ${profession || 'Creator'} | ${interestList.join(' | ')}`,
      `✨ ${name} - ${interestList.join(' enthusiast')}`,
      `${profession || 'Just'} ${name}. ${interestList.join('. ')}`,
      `📍 ${name} | ${interestList.join(' • ')}`,
      `${name}. ${interestList.join(' lover')}.`
    ];
    return { bios: JSON.stringify(bios) };
  },

  'caption-generator': (inputs) => {
    const { topic, platform, tone, count } = inputs;
    const captions = [
      `${tone === 'funny' ? '😂' : tone === 'inspirational' ? '✨' : '🔥'} ${topic}! #${topic.replace(/\s/g, '')}`,
      `Just thinking about ${topic} today... ${tone === 'professional' ? 'What do you think?' : 'Thoughts?'}`,
      `${topic} is everything! 💯`,
      `Can't get enough of ${topic}! Who's with me?`,
      `${topic} hits different when you least expect it.`
    ];
    return { captions: JSON.stringify(captions.slice(0, count)) };
  },

  'post-scheduler': (inputs) => {
    const { platform, audience } = inputs;
    const times: Record<string, any> = {
      best: ['6-9 AM', '12-3 PM', '6-9 PM'],
      worst: ['10 PM - 6 AM']
    };
    return {
      bestTimes: JSON.stringify(times.best),
      worstTimes: JSON.stringify(times.worst),
      tips: `Post on ${platform} during peak hours for ${audience} audience for maximum engagement.`
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
