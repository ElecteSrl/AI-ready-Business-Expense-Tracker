import React, { useState } from 'react';
import { Trash2, Edit, DollarSign, Receipt, ExternalLink } from 'lucide-react';
import { Expense } from '../types';
import { ReceiptModal } from './ReceiptModal';
import { SearchFilters, SearchFilters as SearchFiltersType } from './SearchFilters';
import { filterExpenses } from '../utils/search';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const getCategoryColor = (category: string) => {
  const colors = {
    'Office Supplies': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Travel': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Meals': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Utilities': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Miscellaneous': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

export function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SearchFiltersType | null>(null);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>(expenses);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);

  const handleSearch = (filters: SearchFiltersType) => {
    setActiveFilters(filters);
    setFilteredExpenses(filterExpenses(expenses, filters));
  };

  const handleResetSearch = () => {
    setActiveFilters(null);
    setFilteredExpenses(expenses);
  };

  const displayedExpenses = activeFilters ? filteredExpenses : expenses;

  if (expenses.length === 0) {
    return (
      <div className="card p-8 text-center">
        <DollarSign className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Add your first expense using the form above.</p>
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

  return (
    <>
      <SearchFilters onSearch={handleSearch} onReset={handleResetSearch} />

      {activeFilters && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredExpenses.length} of {expenses.length} expenses
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-full">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receipt</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {displayedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`category-badge ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center">
                      <div className="relative group">
                        <div 
                          className={`${
                            expandedDescription === expense.id ? '' : 'line-clamp-1'
                          } cursor-pointer`}
                          onClick={() => setExpandedDescription(
                            expandedDescription === expense.id ? null : expense.id
                          )}
                        >
                          {expense.description}
                        </div>
                        {expense.description.length > 50 && expandedDescription !== expense.id && (
                          <div className="hidden group-hover:block absolute z-20 bg-gray-900 dark:bg-gray-700 text-white p-2 rounded-lg shadow-lg max-w-xs mt-1">
                            {expense.description}
                          </div>
                        )}
                      </div>
                      {expense.tax_deductible && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full whitespace-nowrap">
                          Tax Deductible
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{expense.payment_method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {expense.receipt_url ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedReceipt(expense.receipt_url)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors duration-150"
                          title="View Receipt"
                        >
                          <Receipt className="w-5 h-5" />
                        </button>
                        <a
                          href={expense.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-150"
                          title="Open in New Tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">No receipt</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-4 transition-colors duration-150"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-150"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receiptUrl={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete this expense? This action cannot be undone.
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