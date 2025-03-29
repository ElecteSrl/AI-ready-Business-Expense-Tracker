import { format } from 'date-fns';

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Other';

export type ExpenseCategory = 'Office Supplies' | 'Travel' | 'Meals' | 'Utilities' | 'Miscellaneous';

export type RecurringFrequency = 'Monthly' | 'Quarterly' | 'Yearly';

export interface Budget {
  id: string;
  category: ExpenseCategory;
  amount: number;
  period: 'Monthly' | 'Yearly';
  notifications: boolean;
  warningThreshold: number;
}

export interface BudgetStatus {
  category: ExpenseCategory;
  spent: number;
  budget: number;
  percentage: number;
  remaining: number;
  status: 'under' | 'near' | 'over';
}

export interface RecurringExpense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  payment_method: PaymentMethod;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  lastProcessed?: string;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  payment_method: PaymentMethod;
  receipt_url?: string;
  is_recurring?: boolean;
  recurring_id?: string;
  tax_deductible?: boolean;
  notes?: string;
  tags?: string[];
}

export interface MonthlyReport {
  total: number;
  categories: Record<ExpenseCategory, number>;
}

export interface TrendData {
  month: string;
  amount: number;
}

export interface CategoryTrend {
  category: ExpenseCategory;
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyChange: number;
  trendData: TrendData[];
  categoryTrends: CategoryTrend[];
  recentExpenses: Expense[];
  budgetStatus: BudgetStatus[];
  forecast: {
    nextMonth: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
  };
  insights: {
    type: 'info' | 'warning' | 'success';
    message: string;
  }[];
}

export interface Forecast {
  amount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};