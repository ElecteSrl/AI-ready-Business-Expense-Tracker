import React, { useMemo, useState } from 'react';
import { BarChart, Download, TrendingUp, DollarSign } from 'lucide-react';
import { Expense, ExpenseCategory, MonthlyReport } from '../types';
import { ExportDialog } from './ExportDialog';

interface ExpenseReportProps {
  expenses: Expense[];
  onExport: () => void;
}

const getCategoryColor = (category: string, opacity: number = 1) => {
  const colors = {
    'Office Supplies': `rgba(59, 130, 246, ${opacity})`,
    'Travel': `rgba(147, 51, 234, ${opacity})`,
    'Meals': `rgba(34, 197, 94, ${opacity})`,
    'Utilities': `rgba(249, 115, 22, ${opacity})`,
    'Miscellaneous': `rgba(107, 114, 128, ${opacity})`
  };
  return colors[category as keyof typeof colors] || `rgba(107, 114, 128, ${opacity})`;
};

export function ExpenseReport({ expenses }: ExpenseReportProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);

  const report: MonthlyReport = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categories = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return { total, categories };
  }, [expenses]);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
            <BarChart className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            Monthly Report
          </h2>
          <button
            onClick={() => setShowExportDialog(true)}
            className="btn-primary"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </button>
        </div>

        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-indigo-100">Total Expenses</span>
            <DollarSign className="w-6 h-6 text-indigo-200" />
          </div>
          <p className="text-4xl font-bold">${report.total.toFixed(2)}</p>
        </div>

        <div>
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Category Breakdown</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(report.categories).map(([category, amount]) => (
              <div key={category} className="group">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{category}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${amount.toFixed(2)}
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                      ({((amount / report.total) * 100).toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 group-hover:opacity-90"
                      style={{
                        width: `${(amount / report.total) * 100}%`,
                        backgroundColor: getCategoryColor(category)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showExportDialog && (
        <ExportDialog
          expenses={expenses}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
}