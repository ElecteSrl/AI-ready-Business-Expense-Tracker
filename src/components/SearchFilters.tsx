import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag, CreditCard, DollarSign, X } from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../types';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

export interface SearchFilters {
  query: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  categories: ExpenseCategory[];
  paymentMethods: PaymentMethod[];
  taxDeductibleOnly: boolean;
  hasReceipt: boolean;
}

const CATEGORIES: ExpenseCategory[] = ['Office Supplies', 'Travel', 'Meals', 'Utilities', 'Miscellaneous'];
const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

export function SearchFilters({ onSearch, onReset }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    categories: [],
    paymentMethods: [],
    taxDeductibleOnly: false,
    hasReceipt: false
  });

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      categories: [],
      paymentMethods: [],
      taxDeductibleOnly: false,
      hasReceipt: false
    });
    onReset();
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
            className="input-field pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 btn-secondary flex items-center"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 mt-6 border-t pt-6 border-gray-200 dark:border-gray-700">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Min Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.minAmount}
                onChange={(e) => handleInputChange('minAmount', e.target.value)}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                Max Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.maxAmount}
                onChange={(e) => handleInputChange('maxAmount', e.target.value)}
                className="input-field"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
              <Tag className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    handleInputChange(
                      'categories',
                      filters.categories.includes(category)
                        ? filters.categories.filter(c => c !== category)
                        : [...filters.categories, category]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filters.categories.includes(category)
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
              <CreditCard className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
              Payment Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    handleInputChange(
                      'paymentMethods',
                      filters.paymentMethods.includes(method)
                        ? filters.paymentMethods.filter(m => m !== method)
                        : [...filters.paymentMethods, method]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filters.paymentMethods.includes(method)
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.taxDeductibleOnly}
                onChange={(e) => handleInputChange('taxDeductibleOnly', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 
                  focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">Tax Deductible Only</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.hasReceipt}
                onChange={(e) => handleInputChange('hasReceipt', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 
                  focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">Has Receipt</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              Reset
            </button>
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}