import React, { useState } from 'react';
import { Calendar, DollarSign, Tag, CreditCard, FileText, Clock, CalendarRange } from 'lucide-react';
import { RecurringExpense, ExpenseCategory, PaymentMethod, RecurringFrequency } from '../types';

interface RecurringExpenseFormProps {
  onSubmit: (expense: RecurringExpense) => void;
  onCancel: () => void;
  initialData?: RecurringExpense;
}

const CATEGORIES: ExpenseCategory[] = ['Office Supplies', 'Travel', 'Meals', 'Utilities', 'Miscellaneous'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];
const FREQUENCIES: RecurringFrequency[] = ['Monthly', 'Quarterly', 'Yearly'];

export function RecurringExpenseForm({ onSubmit, onCancel, initialData }: RecurringExpenseFormProps) {
  const [formData, setFormData] = useState({
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate || '',
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Office Supplies' as ExpenseCategory,
    description: initialData?.description || '',
    payment_method: initialData?.payment_method || 'Credit Card' as PaymentMethod,
    frequency: initialData?.frequency || 'Monthly' as RecurringFrequency,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const recurringExpense: RecurringExpense = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      amount: parseFloat(formData.amount),
      endDate: formData.endDate || undefined,
    };
    onSubmit(recurringExpense);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
            <Clock className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            {initialData ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <CalendarRange className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="input-field"
                min={formData.startDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Amount
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
                <Clock className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={e => setFormData(prev => ({ ...prev, frequency: e.target.value as RecurringFrequency }))}
                className="input-field"
              >
                {FREQUENCIES.map(frequency => (
                  <option key={frequency} value={frequency}>{frequency}</option>
                ))}
              </select>
            </div>
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
                <CreditCard className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={e => setFormData(prev => ({ ...prev, payment_method: e.target.value as PaymentMethod }))}
                className="input-field"
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <FileText className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Description
              </label>
              <input
                type="text"
                maxLength={200}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field"
                placeholder="Enter expense description"
                required
              />
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
              <Clock className="w-5 h-5 mr-2" />
              {initialData ? 'Update Recurring Expense' : 'Add Recurring Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}