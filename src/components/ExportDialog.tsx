import React, { useState } from 'react';
import { Download, FileText, Calculator, Calendar, Tag, X } from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { generateCSV, generateSummaryReport, generateTaxReport, downloadFile } from '../utils/export';

interface ExportDialogProps {
  expenses: Expense[];
  onClose: () => void;
}

export function ExportDialog({ expenses, onClose }: ExportDialogProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [taxDeductibleOnly, setTaxDeductibleOnly] = useState(false);
  const [taxYear, setTaxYear] = useState(new Date().getFullYear());

  const handleExportCSV = () => {
    const options = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      categories: selectedCategories.length ? selectedCategories : undefined,
      taxDeductibleOnly
    };

    const csv = generateCSV(expenses, options);
    downloadFile(csv, 'expenses.csv', 'text/csv;charset=utf-8;');
  };

  const handleExportSummary = () => {
    const options = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      categories: selectedCategories.length ? selectedCategories : undefined,
      taxDeductibleOnly
    };

    const summary = generateSummaryReport(expenses, options);
    downloadFile(summary, 'expense_summary.txt', 'text/plain;charset=utf-8;');
  };

  const handleExportTax = () => {
    const taxReport = generateTaxReport(expenses, taxYear);
    downloadFile(taxReport, `tax_report_${taxYear}.txt`, 'text/plain;charset=utf-8;');
  };

  const categories = Array.from(new Set(expenses.map(e => e.category)));

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <Download className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Export Expenses
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
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
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategories(prev =>
                        prev.includes(category)
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tax Options */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="taxDeductible"
                  checked={taxDeductibleOnly}
                  onChange={(e) => setTaxDeductibleOnly(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 
                    focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <label htmlFor="taxDeductible" className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                  Tax Deductible Expenses Only
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center">
                  <Calculator className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400" />
                  Tax Year
                </label>
                <select
                  value={taxYear}
                  onChange={(e) => setTaxYear(parseInt(e.target.value))}
                  className="input-field"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExportCSV}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleExportSummary}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Export Summary
              </button>
              <button
                onClick={handleExportTax}
                className="btn-primary flex-1 flex items-center justify-center"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Export Tax Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}