import { Expense, RecurringExpense } from '../types';
import { addMonths, addYears, isBefore, startOfDay } from 'date-fns';

const STORAGE_KEY = 'expenses';
const RECURRING_KEY = 'recurring_expenses';
const MAX_ENTRIES = 1000;

export const saveExpenses = (expenses: Expense[]): void => {
  if (expenses.length > MAX_ENTRIES) {
    throw new Error(`Maximum number of entries (${MAX_ENTRIES}) exceeded`);
  }
  
  const serialized = JSON.stringify(expenses);
  if (serialized.length > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('Storage limit (5MB) exceeded');
  }
  
  localStorage.setItem(STORAGE_KEY, serialized);
};

export const loadExpenses = (): Expense[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRecurringExpenses = (expenses: RecurringExpense[]): void => {
  localStorage.setItem(RECURRING_KEY, JSON.stringify(expenses));
};

export const loadRecurringExpenses = (): RecurringExpense[] => {
  const stored = localStorage.getItem(RECURRING_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const processRecurringExpenses = (): Expense[] => {
  const recurring = loadRecurringExpenses();
  const today = startOfDay(new Date());
  const newExpenses: Expense[] = [];

  recurring.forEach(recurringExpense => {
    const startDate = startOfDay(new Date(recurringExpense.startDate));
    const endDate = recurringExpense.endDate ? startOfDay(new Date(recurringExpense.endDate)) : null;
    const lastProcessed = recurringExpense.lastProcessed 
      ? startOfDay(new Date(recurringExpense.lastProcessed)) 
      : startDate;

    // Skip if the recurring expense has ended
    if (endDate && isBefore(endDate, today)) {
      return;
    }

    let nextDate = new Date(lastProcessed);

    // Calculate next occurrence based on frequency
    switch (recurringExpense.frequency) {
      case 'Monthly':
        nextDate = addMonths(nextDate, 1);
        break;
      case 'Quarterly':
        nextDate = addMonths(nextDate, 3);
        break;
      case 'Yearly':
        nextDate = addYears(nextDate, 1);
        break;
    }

    // Create new expenses for all occurrences up to today
    while (isBefore(nextDate, today)) {
      if (endDate && isBefore(endDate, nextDate)) {
        break;
      }

      newExpenses.push({
        id: crypto.randomUUID(),
        date: nextDate.toISOString().split('T')[0],
        amount: recurringExpense.amount,
        category: recurringExpense.category,
        description: recurringExpense.description,
        payment_method: recurringExpense.payment_method,
        is_recurring: true,
        recurring_id: recurringExpense.id
      });

      // Update last processed date
      recurringExpense.lastProcessed = nextDate.toISOString().split('T')[0];

      // Move to next occurrence
      switch (recurringExpense.frequency) {
        case 'Monthly':
          nextDate = addMonths(nextDate, 1);
          break;
        case 'Quarterly':
          nextDate = addMonths(nextDate, 3);
          break;
        case 'Yearly':
          nextDate = addYears(nextDate, 1);
          break;
      }
    }
  });

  if (newExpenses.length > 0) {
    saveRecurringExpenses(recurring);
    const existingExpenses = loadExpenses();
    saveExpenses([...existingExpenses, ...newExpenses]);
  }

  return newExpenses;
};