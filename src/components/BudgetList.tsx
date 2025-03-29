import React, { useState } from 'react';
import { Trash2, Edit, DollarSign, AlertCircle } from 'lucide-react';
import { Budget, BudgetStatus, formatCurrency } from '../types';

interface BudgetListProps {
  budgets: Budget[];
  budgetStatus: BudgetStatus[];
  onDelete: (id: string) => void;
  onEdit: (budget: Budget) => void;
}

export function BudgetList({ budgets, budgetStatus, onDelete, onEdit }: BudgetListProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  if (budgets.length === 0) {
    return (
      <div className="card p-8 text-center">
        <DollarSign className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets set</h3>
        <p className="text-gray-500 dark:text-gray-400">Set your first budget using the form above.</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = (confirmed: boolean) => {
    if (confirmed && showConfirmDelete) {
      onDelete(showConfirmDelete);
    }
    setShowConfirmDelete(null);
  };

  const getStatusColor = (status: BudgetStatus['status']) => {
    switch (status) {
      case 'over':
        return 'text-red-600 dark:text-red-400';
      case 'near':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getProgressColor = (status: BudgetStatus['status']) => {
    switch (status) {
      case 'over':
        return 'bg-red-600 dark:bg-red-500';
      case 'near':
        return 'bg-yellow-600 dark:bg-yellow-500';
      default:
        return 'bg-green-600 dark:bg-green-500';
    }
  };

  return (
    <>
      <div className="space-y-6">
        {budgets.map(budget => {
          const status = budgetStatus.find(s => s.category === budget.category);
          if (!status) return null;

          return (
            <div key={budget.id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{budget.category}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{budget.period} Budget</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(budget)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Spent: {formatCurrency(status.spent)}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Budget: {formatCurrency(status.budget)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(status.status)}`}
                      style={{ width: `${Math.min(status.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${getStatusColor(status.status)}`}>
                      {status.percentage.toFixed(1)}% used
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatCurrency(status.remaining)} remaining
                    </span>
                  </div>
                </div>

                {status.status !== 'under' && (
                  <div className={`flex items-start space-x-2 p-3 rounded-lg ${
                    status.status === 'over' 
                      ? 'bg-red-100 dark:bg-red-900/20' 
                      : 'bg-yellow-100 dark:bg-yellow-900/20'
                  }`}>
                    <AlertCircle className={`w-5 h-5 ${
                      status.status === 'over'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`} />
                    <p className={`text-sm ${
                      status.status === 'over'
                        ? 'text-red-800 dark:text-red-200'
                        : 'text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {status.status === 'over'
                        ? `Budget exceeded by ${formatCurrency(Math.abs(status.remaining))}`
                        : `Approaching budget limit (${status.percentage.toFixed(1)}% used)`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this budget? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => confirmDelete(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(true)}
                className="btn-primary bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}