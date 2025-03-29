import { Budget, BudgetStatus, Expense, ExpenseCategory } from '../types';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const STORAGE_KEY = 'budgets';

export const saveBudgets = (budgets: Budget[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
};

export const loadBudgets = (): Budget[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const calculateBudgetStatus = (
  budgets: Budget[],
  expenses: Expense[],
  date: Date = new Date()
): BudgetStatus[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  return budgets
    .filter(budget => budget.period === 'Monthly')
    .map(budget => {
      const spent = expenses
        .filter(expense => 
          expense.category === budget.category &&
          isWithinInterval(new Date(expense.date), { start: monthStart, end: monthEnd })
        )
        .reduce((sum, expense) => sum + expense.amount, 0);

      const percentage = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;
      
      let status: 'under' | 'near' | 'over';
      if (percentage >= 100) {
        status = 'over';
      } else if (percentage >= budget.warningThreshold) {
        status = 'near';
      } else {
        status = 'under';
      }

      return {
        category: budget.category,
        spent,
        budget: budget.amount,
        percentage,
        remaining,
        status
      };
    });
};

export const getBudgetWarnings = (budgetStatus: BudgetStatus[]): string[] => {
  return budgetStatus
    .filter(status => status.status !== 'under')
    .map(status => {
      if (status.status === 'over') {
        return `You've exceeded your ${status.category} budget by ${formatCurrency(Math.abs(status.remaining))}`;
      } else {
        return `You're approaching your ${status.category} budget (${status.percentage.toFixed(1)}% used)`;
      }
    });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};