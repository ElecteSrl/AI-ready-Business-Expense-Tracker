import { subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { Expense, Forecast } from '../types';

export const calculateMonthlyTotal = (expenses: Expense[], date: Date): number => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    })
    .reduce((total, expense) => total + expense.amount, 0);
};

export const calculateTrend = (current: number, previous: number): 'increasing' | 'decreasing' | 'stable' => {
  const percentChange = ((current - previous) / previous) * 100;
  if (Math.abs(percentChange) < 5) return 'stable';
  return percentChange > 0 ? 'increasing' : 'decreasing';
};

export const generateInsights = (expenses: Expense[]): string[] => {
  return []; // Return empty array to remove insights
};

export const forecastNextMonth = (expenses: Expense[]): Forecast => {
  const now = new Date();
  const monthlyTotals = Array.from({ length: 3 }).map((_, i) => 
    calculateMonthlyTotal(expenses, subMonths(now, i))
  );

  // Simple linear regression
  const xMean = 1;
  const yMean = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
  
  let numerator = 0;
  let denominator = 0;
  
  monthlyTotals.forEach((y, i) => {
    const x = i;
    numerator += (x - xMean) * (y - yMean);
    denominator += Math.pow(x - xMean, 2);
  });

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Predict next month
  const prediction = intercept + slope * (monthlyTotals.length);
  
  // Calculate R-squared for confidence
  const yPred = monthlyTotals.map((_, i) => intercept + slope * i);
  const ssRes = monthlyTotals.reduce((acc, y, i) => acc + Math.pow(y - yPred[i], 2), 0);
  const ssTot = monthlyTotals.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
  const rSquared = 1 - (ssRes / ssTot);

  return {
    amount: Math.max(0, prediction), // Ensure non-negative
    trend: calculateTrend(prediction, monthlyTotals[0]),
    confidence: Math.max(0, Math.min(1, rSquared)) * 100
  };
};