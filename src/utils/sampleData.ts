import { addDays, subDays, format } from 'date-fns';
import { Expense, RecurringExpense, Budget, ExpenseCategory, PaymentMethod } from '../types';

const CATEGORIES: ExpenseCategory[] = ['Office Supplies', 'Travel', 'Meals', 'Utilities', 'Miscellaneous'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

const OFFICE_SUPPLIES = [
  'Printer Paper', 'Ink Cartridges', 'Staples', 'Notebooks', 'Pens', 'Desk Organizer',
  'File Folders', 'Sticky Notes', 'Whiteboard Markers', 'USB Drive'
];

const TRAVEL_EXPENSES = [
  'Flight to New York', 'Hotel Stay', 'Taxi Fare', 'Train Tickets', 'Car Rental',
  'Airport Parking', 'Business Conference Fee', 'Per Diem', 'Client Meeting Travel'
];

const MEAL_EXPENSES = [
  'Team Lunch', 'Client Dinner', 'Coffee Meeting', 'Catering for Meeting',
  'Business Breakfast', 'Office Snacks', 'Team Building Dinner'
];

const UTILITY_EXPENSES = [
  'Electricity Bill', 'Internet Service', 'Phone Bill', 'Water Bill',
  'Office Rent', 'Cleaning Service', 'HVAC Maintenance'
];

const MISC_EXPENSES = [
  'Emergency Equipment Repair'
];

const EXPENSE_DESCRIPTIONS: Record<ExpenseCategory, string[]> = {
  'Office Supplies': OFFICE_SUPPLIES,
  'Travel': TRAVEL_EXPENSES,
  'Meals': MEAL_EXPENSES,
  'Utilities': UTILITY_EXPENSES,
  'Miscellaneous': MISC_EXPENSES
};

const RECEIPT_URLS = [
  'https://images.unsplash.com/photo-1554774853-719586f82d77',
  'https://images.unsplash.com/photo-1555776606-c4d8a31a7d9a',
  'https://images.unsplash.com/photo-1554774853-b415df9eeb92',
];

// Define budget amounts per category
const BUDGET_AMOUNTS: Record<ExpenseCategory, number> = {
  'Office Supplies': 2000,
  'Travel': 5000,
  'Meals': 1500,
  'Utilities': 3000,
  'Miscellaneous': 1000
};

// Define typical expense ranges per category
const EXPENSE_RANGES: Record<ExpenseCategory, { min: number; max: number }> = {
  'Office Supplies': { min: 20, max: 300 },
  'Travel': { min: 100, max: 1000 },
  'Meals': { min: 15, max: 200 },
  'Utilities': { min: 50, max: 800 },
  'Miscellaneous': { min: 10, max: 500 }
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomAmount(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function generateExpense(date: Date, category?: ExpenseCategory, amount?: number): Expense {
  const expenseCategory = category || getRandomElement(CATEGORIES);
  const description = getRandomElement(EXPENSE_DESCRIPTIONS[expenseCategory]);
  const range = EXPENSE_RANGES[expenseCategory];
  
  return {
    id: crypto.randomUUID(),
    date: format(date, 'yyyy-MM-dd'),
    amount: amount || getRandomAmount(range.min, range.max),
    category: expenseCategory,
    description,
    payment_method: getRandomElement(PAYMENT_METHODS),
    receipt_url: Math.random() > 0.5 ? getRandomElement(RECEIPT_URLS) : undefined,
    tax_deductible: Math.random() > 0.7,
    notes: Math.random() > 0.8 ? `Additional notes for ${description}` : undefined,
    tags: Math.random() > 0.7 ? ['important', 'reviewed'] : undefined,
  };
}

function generateRecurringExpense(): RecurringExpense {
  const category = getRandomElement(CATEGORIES.filter(c => c !== 'Miscellaneous'));
  const description = getRandomElement(EXPENSE_DESCRIPTIONS[category]);
  const range = EXPENSE_RANGES[category];
  
  return {
    id: crypto.randomUUID(),
    startDate: format(subDays(new Date(), Math.floor(Math.random() * 60)), 'yyyy-MM-dd'),
    amount: getRandomAmount(range.min, range.max),
    category,
    description,
    payment_method: getRandomElement(PAYMENT_METHODS),
    frequency: getRandomElement(['Monthly', 'Quarterly', 'Yearly']),
  };
}

function generateBudget(category: ExpenseCategory): Budget {
  return {
    id: crypto.randomUUID(),
    category,
    amount: BUDGET_AMOUNTS[category],
    period: 'Monthly',
    notifications: true,
    warningThreshold: 80,
  };
}

export function generateSampleData(days: number = 90) {
  const expenses: Expense[] = [];
  const today = new Date();
  const budgets = CATEGORIES.map(category => generateBudget(category));
  
  // Generate regular expenses for all categories
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    const numExpenses = Math.floor(Math.random() * 3) + 1; // 1-3 expenses per day
    
    for (let j = 0; j < numExpenses; j++) {
      const category = getRandomElement(CATEGORIES);
      const range = EXPENSE_RANGES[category];
      expenses.push(generateExpense(date, category, getRandomAmount(range.min, range.max)));
    }
  }

  // Generate recurring expenses
  const recurringExpenses: RecurringExpense[] = Array.from(
    { length: 3 },
    generateRecurringExpense
  );

  return {
    expenses,
    recurringExpenses,
    budgets,
  };
}