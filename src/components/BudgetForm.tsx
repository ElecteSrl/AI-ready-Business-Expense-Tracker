import React, { useState } from 'react';
import { DollarSign, Bell, Tag, Calendar } from 'lucide-react';
import { Budget, ExpenseCategory } from '../types';

interface BudgetFormProps {
  onSubmit: (budget: Budget) => void;
  onCancel: () => void;
  initialData?: Budget;
}

const CATEGORIES: ExpenseCategory[] = ['Office Supplies', 'Travel', 'Meals', 'Utilities', 'Miscellaneous'];

export function BudgetForm({ onSubmit, onCancel, initialData }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Office Supplies' as ExpenseCategory,
    period: initialData?.period || 'Monthly',
    notifications: initialData?.notifications ?? true,
    warningThreshold: initialData?.warningThreshold || 80,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budget: Budget = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      amount: parseFloat(formData.amount),
    };
    onSubmit(budget);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg mx-4">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            {initialData ? 'Edit Budget' : 'Set New Budget'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <Tag className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
                className="input-field"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="input-field pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Period
              </label>
              <select
                value={formData.period}
                onChange={e => setFormData(prev => ({ ...prev, period: e.target.value as 'Monthly' | 'Yearly' }))}
                className="input-field"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <Bell className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Warning Threshold (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.warningThreshold}
                onChange={e => setFormData(prev => ({ ...prev, warningThreshold: parseInt(e.target.value) }))}
                className="input-field"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get notified when spending reaches this percentage of your budget
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                checked={formData.notifications}
                onChange={e => setFormData(prev => ({ ...prev, notifications: e.target.checked }))}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 
                  shadow-sm focus:border-indigo-300 dark:focus:border-indigo-700 focus:ring 
                  focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:ring-opacity-50
                  bg-white dark:bg-gray-800"
              />
              <label htmlFor="notifications" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                Enable notifications
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center justify-center"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              {initialData ? 'Update Budget' : 'Set Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}