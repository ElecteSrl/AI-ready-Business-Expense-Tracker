import { Expense } from '../types';
import { SearchFilters } from '../components/SearchFilters';

export const filterExpenses = (expenses: Expense[], filters: SearchFilters): Expense[] => {
  return expenses.filter(expense => {
    // Text search
    if (filters.query) {
      const searchQuery = filters.query.toLowerCase();
      const searchableText = `
        ${expense.description.toLowerCase()}
        ${expense.category.toLowerCase()}
        ${expense.payment_method.toLowerCase()}
        ${expense.notes?.toLowerCase() || ''}
        ${(expense.tags || []).join(' ').toLowerCase()}
      `;
      if (!searchableText.includes(searchQuery)) {
        return false;
      }
    }

    // Date range
    if (filters.startDate && new Date(expense.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(expense.date) > new Date(filters.endDate)) {
      return false;
    }

    // Amount range
    if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) {
      return false;
    }
    if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) {
      return false;
    }

    // Categories
    if (filters.categories.length > 0 && !filters.categories.includes(expense.category)) {
      return false;
    }

    // Payment methods
    if (filters.paymentMethods.length > 0 && !filters.paymentMethods.includes(expense.payment_method)) {
      return false;
    }

    // Tax deductible
    if (filters.taxDeductibleOnly && !expense.tax_deductible) {
      return false;
    }

    // Has receipt
    if (filters.hasReceipt && !expense.receipt_url) {
      return false;
    }

    return true;
  });
};