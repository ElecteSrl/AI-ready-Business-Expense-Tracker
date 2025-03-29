import React, { useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import {
  BarChart as BarChartIcon,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Clock,
  FileText,
  Download,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats, Expense, ExpenseCategory } from '../types';
import { generateInsights, forecastNextMonth } from '../utils/analytics';
import { ForecastCard } from './ForecastCard';
import { ExportDialog } from './ExportDialog';
import { SearchFilters } from './SearchFilters';

interface DashboardProps {
  expenses: Expense[];
  onAddExpense?: () => void;
  onShowRecurring?: () => void;
  onShowReports?: () => void;
  onShowFilters?: () => void;
}

const calculateDashboardStats = (expenses: Expense[]): DashboardStats => {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const previousMonthStart = startOfMonth(subMonths(now, 1));
  const previousMonthEnd = endOfMonth(subMonths(now, 1));

  const currentMonthExpenses = expenses.filter(
    (e) => new Date(e.date) >= currentMonthStart && new Date(e.date) <= currentMonthEnd
  );
  const previousMonthExpenses = expenses.filter(
    (e) => new Date(e.date) >= previousMonthStart && new Date(e.date) <= previousMonthEnd
  );

  const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const previousTotal = previousMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlyChange = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;

  // Generate trend data for the last 6 months
  const trendData = Array.from({ length: 6 }).map((_, i) => {
    const monthDate = subMonths(now, 5 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthExpenses = expenses.filter(
      (e) => new Date(e.date) >= monthStart && new Date(e.date) <= monthEnd
    );
    return {
      month: format(monthDate, 'MMM'),
      amount: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  });

  // Calculate category trends
  const categories: ExpenseCategory[] = [
    'Office Supplies',
    'Travel',
    'Meals',
    'Utilities',
    'Miscellaneous',
  ];
  const categoryTrends = categories.map((category) => {
    const currentMonthCategoryTotal = currentMonthExpenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    const previousMonthCategoryTotal = previousMonthExpenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    const percentageChange = previousMonthCategoryTotal
      ? ((currentMonthCategoryTotal - previousMonthCategoryTotal) / previousMonthCategoryTotal) * 100
      : 0;

    return {
      category,
      currentMonth: currentMonthCategoryTotal,
      previousMonth: previousMonthCategoryTotal,
      percentageChange,
    };
  });

  // Generate insights and forecast
  const insights = generateInsights(expenses).map(message => ({
    type: message.includes('increased') ? 'warning' : message.includes('decreased') ? 'success' : 'info',
    message
  }));

  return {
    totalExpenses: currentTotal,
    monthlyChange,
    trendData,
    categoryTrends,
    recentExpenses: expenses.slice(0, 5),
    budgetStatus: [],
    forecast: {
      ...forecastNextMonth(expenses),
      nextMonth: 0
    },
    insights
  };
};

export function Dashboard({ expenses, onAddExpense, onShowRecurring, onShowReports, onShowFilters }: DashboardProps) {
  const stats = calculateDashboardStats(expenses);
  const forecast = forecastNextMonth(expenses);
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
              <DollarSign className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Change</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.abs(stats.monthlyChange).toFixed(1)}%
                </p>
                {stats.monthlyChange > 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-red-500 dark:text-red-400 ml-2" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-green-500 dark:text-green-400 ml-2" />
                )}
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Insights</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.insights.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={onAddExpense}
                className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/70 transition-colors">
                    <PlusCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Add Expense</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Record a new expense</p>
                  </div>
                </div>
              </button>

              <button
                onClick={onShowRecurring}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/70 transition-colors">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Recurring</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Set up recurring expenses</p>
                  </div>
                </div>
              </button>

              <button
                onClick={onShowReports}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/70 transition-colors">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Reports</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Generate expense reports</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowExportDialog(true)}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/70 transition-colors">
                    <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Export</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Export expense data</p>
                  </div>
                </div>
              </button>

              <button
                onClick={onShowFilters}
                className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/70 transition-colors">
                    <Filter className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Filter</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Filter expenses</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <ForecastCard forecast={forecast} />
        </div>
      </div>

      {/* Expense Trend Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <BarChartIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Expense Trends
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.trendData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis dataKey="month" className="chart-text" />
              <YAxis className="chart-text" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Recent Expenses
        </h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {stats.recentExpenses.map((expense) => (
            <div key={expense.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          expenses={expenses}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
}