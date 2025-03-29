import React, { useState, useCallback } from 'react';
import { PlusCircle, DollarSign, Calendar, Tag, CreditCard, FileText, Receipt, Link, Upload, X } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod } from '../types';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  initialData?: Expense;
}

const CATEGORIES: ExpenseCategory[] = ['Office Supplies', 'Travel', 'Meals', 'Utilities', 'Miscellaneous'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
};

export function ExpenseForm({ onSubmit, initialData }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    amount: initialData?.amount.toString() || '',
    category: initialData?.category || 'Office Supplies' as ExpenseCategory,
    description: initialData?.description || '',
    payment_method: initialData?.payment_method || 'Credit Card' as PaymentMethod,
    receipt_url: initialData?.receipt_url || '',
    tax_deductible: initialData?.tax_deductible || false,
  });

  const [receiptError, setReceiptError] = useState<string>('');
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);

  const validateReceiptUrl = useCallback(async (url: string) => {
    if (!url) {
      setReceiptError('');
      return true;
    }

    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setReceiptError('Please enter a valid HTTP or HTTPS URL');
        return false;
      }

      setIsValidatingUrl(true);
      const isValid = await isValidImageUrl(url);
      setIsValidatingUrl(false);

      if (!isValid) {
        setReceiptError('URL must point to a valid image file');
        return false;
      }

      setReceiptError('');
      return true;
    } catch {
      setReceiptError('Please enter a valid URL');
      return false;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.receipt_url && !(await validateReceiptUrl(formData.receipt_url))) {
      return;
    }

    const expense: Expense = {
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      amount: parseFloat(formData.amount),
      receipt_url: formData.receipt_url || undefined,
    };
    
    onSubmit(expense);
    if (!initialData) {
      setFormData(prev => ({ 
        ...prev, 
        amount: '', 
        description: '', 
        receipt_url: '' 
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center">
        <PlusCircle className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="input-field"
            required
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
            <Receipt className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
            Receipt URL
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
              <Link className="w-4 h-4" />
            </span>
            <input
              type="url"
              value={formData.receipt_url}
              onChange={async (e) => {
                const url = e.target.value;
                setFormData(prev => ({ ...prev, receipt_url: url }));
                if (url) {
                  await validateReceiptUrl(url);
                } else {
                  setReceiptError('');
                }
              }}
              className={`input-field pl-9 pr-10 ${receiptError ? 'border-red-500 dark:border-red-400' : ''}`}
              placeholder="https://example.com/receipt.jpg"
            />
            {formData.receipt_url && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, receipt_url: '' }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </button>
            )}
          </div>
          {isValidatingUrl && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Validating URL...</p>
          )}
          {receiptError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{receiptError}</p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter a URL for your receipt image (supported formats: JPG, PNG, GIF)
          </p>
        </div>
        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.tax_deductible}
              onChange={e => setFormData(prev => ({ ...prev, tax_deductible: e.target.checked }))}
              className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 
                shadow-sm focus:border-indigo-300 dark:focus:border-indigo-700 focus:ring 
                focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:ring-opacity-50
                bg-white dark:bg-gray-800"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Tax Deductible</span>
          </label>
        </div>
      </div>
      <button 
        type="submit" 
        className="btn-primary mt-6 flex items-center justify-center w-full sm:w-auto"
        disabled={isValidatingUrl}
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        {initialData ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
}