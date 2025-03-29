import { Expense, ExpenseCategory } from '../types';
import { format } from 'date-fns';

interface ExportOptions {
  startDate?: Date;
  endDate?: Date;
  categories?: ExpenseCategory[];
  taxDeductibleOnly?: boolean;
}

export const generateCSV = (expenses: Expense[], options?: ExportOptions): string => {
  let filteredExpenses = [...expenses];

  if (options) {
    if (options.startDate) {
      filteredExpenses = filteredExpenses.filter(e => new Date(e.date) >= options.startDate!);
    }
    if (options.endDate) {
      filteredExpenses = filteredExpenses.filter(e => new Date(e.date) <= options.endDate!);
    }
    if (options.categories?.length) {
      filteredExpenses = filteredExpenses.filter(e => options.categories!.includes(e.category));
    }
    if (options.taxDeductibleOnly) {
      filteredExpenses = filteredExpenses.filter(e => e.tax_deductible);
    }
  }

  const headers = [
    'Date',
    'Amount',
    'Category',
    'Description',
    'Payment Method',
    'Tax Deductible',
    'Receipt URL',
    'Tags',
    'Notes'
  ];

  const rows = filteredExpenses.map(expense => [
    format(new Date(expense.date), 'yyyy-MM-dd'),
    expense.amount.toFixed(2),
    expense.category,
    `"${expense.description.replace(/"/g, '""')}"`,
    expense.payment_method,
    expense.tax_deductible ? 'Yes' : 'No',
    expense.receipt_url || '',
    (expense.tags || []).join(';'),
    expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : ''
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

export const generateSummaryReport = (expenses: Expense[], options?: ExportOptions): string => {
  let filteredExpenses = [...expenses];
  const dateRange = {
    start: options?.startDate || new Date(Math.min(...expenses.map(e => new Date(e.date).getTime()))),
    end: options?.endDate || new Date(Math.max(...expenses.map(e => new Date(e.date).getTime())))
  };

  if (options) {
    if (options.startDate) {
      filteredExpenses = filteredExpenses.filter(e => new Date(e.date) >= options.startDate!);
    }
    if (options.endDate) {
      filteredExpenses = filteredExpenses.filter(e => new Date(e.date) <= options.endDate!);
    }
    if (options.categories?.length) {
      filteredExpenses = filteredExpenses.filter(e => options.categories!.includes(e.category));
    }
    if (options.taxDeductibleOnly) {
      filteredExpenses = filteredExpenses.filter(e => e.tax_deductible);
    }
  }

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const taxDeductible = filteredExpenses.filter(e => e.tax_deductible).reduce((sum, e) => sum + e.amount, 0);
  
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const paymentMethodTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.payment_method] = (acc[expense.payment_method] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const report = [
    'Expense Summary Report',
    '====================',
    '',
    `Date Range: ${format(dateRange.start, 'MMM dd, yyyy')} to ${format(dateRange.end, 'MMM dd, yyyy')}`,
    `Total Expenses: $${totalExpenses.toFixed(2)}`,
    `Tax Deductible Expenses: $${taxDeductible.toFixed(2)}`,
    '',
    'Category Breakdown:',
    '-------------------',
    ...Object.entries(categoryTotals).map(([category, amount]) => 
      `${category}: $${amount.toFixed(2)} (${((amount / totalExpenses) * 100).toFixed(1)}%)`
    ),
    '',
    'Payment Method Breakdown:',
    '------------------------',
    ...Object.entries(paymentMethodTotals).map(([method, amount]) =>
      `${method}: $${amount.toFixed(2)} (${((amount / totalExpenses) * 100).toFixed(1)}%)`
    )
  ];

  return report.join('\n');
};

export const generateTaxReport = (expenses: Expense[], year: number): string => {
  const taxDeductibleExpenses = expenses.filter(e => 
    e.tax_deductible && 
    new Date(e.date).getFullYear() === year
  );

  const categoryTotals = taxDeductibleExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const totalDeductible = taxDeductibleExpenses.reduce((sum, e) => sum + e.amount, 0);

  const report = [
    `Tax Deductible Expenses Report - ${year}`,
    '====================================',
    '',
    `Total Tax Deductible Expenses: $${totalDeductible.toFixed(2)}`,
    '',
    'Category Breakdown:',
    '-------------------',
    ...Object.entries(categoryTotals).map(([category, amount]) =>
      `${category}: $${amount.toFixed(2)}`
    ),
    '',
    'Detailed Expenses:',
    '-----------------',
    ...taxDeductibleExpenses.map(e =>
      `${format(new Date(e.date), 'MMM dd, yyyy')} - ${e.category} - ${e.description} - $${e.amount.toFixed(2)}${e.receipt_url ? ' (Receipt Available)' : ''}`
    )
  ];

  return report.join('\n');
};

export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};