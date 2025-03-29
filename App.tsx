import React, { useState, useEffect } from 'react';
import { Receipt, LayoutDashboard, Clock, DollarSign } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseReport } from './components/ExpenseReport';
import { Dashboard } from './components/Dashboard';
import { RecurringExpenseForm } from './components/RecurringExpenseForm';
import { RecurringExpenseList } from './components/RecurringExpenseList';
import { BudgetForm } from './components/BudgetForm';
import { BudgetList } from './components/BudgetList';
import { ThemeToggle } from './components/ThemeToggle';
import { Expense, RecurringExpense, Budget } from './types';
import { loadExpenses, saveExpenses, loadRecurringExpenses, saveRecurringExpenses, processRecurringExpenses } from './utils/storage';
import { loadBudgets, saveBudgets, calculateBudgetStatus } from './utils/budget';

type View = 'dashboard' | 'expenses' | 'recurring' | 'budgets';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingRecurringExpense, setEditingRecurringExpense] = useState<RecurringExpense | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [showRecurringForm, setShowRecurringForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
    setRecurringExpenses(loadRecurringExpenses());
    setBudgets(loadBudgets());
    
    // Process recurring expenses on load
    const newExpenses = processRecurringExpenses();
    if (newExpenses.length > 0) {
      setExpenses(prev => [...prev, ...newExpenses]);
    }
  }, []);

  const handleAddExpense = (expense: Expense) => {
    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const handleUpdateExpense = (expense: Expense) => {
    const updatedExpenses = expenses.map(e => e.id === expense.id ? expense : e);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    saveExpenses(updatedExpenses);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleAddRecurringExpense = (expense: RecurringExpense) => {
    const updatedRecurring = [...recurringExpenses, expense];
    setRecurringExpenses(updatedRecurring);
    saveRecurringExpenses(updatedRecurring);
    setShowRecurringForm(false);
  };

  const handleUpdateRecurringExpense = (expense: RecurringExpense) => {
    const updatedRecurring = recurringExpenses.map(e => e.id === expense.id ? expense : e);
    setRecurringExpenses(updatedRecurring);
    saveRecurringExpenses(updatedRecurring);
    setEditingRecurringExpense(null);
  };

  const handleDeleteRecurringExpense = (id: string) => {
    const updatedRecurring = recurringExpenses.filter(expense => expense.id !== id);
    setRecurringExpenses(updatedRecurring);
    saveRecurringExpenses(updatedRecurring);
  };

  const handleEditRecurringExpense = (expense: RecurringExpense) => {
    setEditingRecurringExpense(expense);
  };

  const handleAddBudget = (budget: Budget) => {
    const updatedBudgets = [...budgets, budget];
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    setShowBudgetForm(false);
  };

  const handleUpdateBudget = (budget: Budget) => {
    const updatedBudgets = budgets.map(b => b.id === budget.id ? budget : b);
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
    setEditingBudget(null);
  };

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);
    saveBudgets(updatedBudgets);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const budgetStatus = calculateBudgetStatus(budgets, expenses);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Receipt className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
            AI-Friendly Expense Tracker
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`btn-primary flex items-center ${
                  activeView === 'dashboard' ? 'bg-indigo-700 dark:bg-indigo-600' : ''
                }`}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('expenses')}
                className={`btn-primary flex items-center ${
                  activeView === 'expenses' ? 'bg-indigo-700 dark:bg-indigo-600' : ''
                }`}
              >
                <Receipt className="w-5 h-5 mr-2" />
                Expenses
              </button>
              <button
                onClick={() => setActiveView('recurring')}
                className={`btn-primary flex items-center ${
                  activeView === 'recurring' ? 'bg-indigo-700 dark:bg-indigo-600' : ''
                }`}
              >
                <Clock className="w-5 h-5 mr-2" />
                Recurring
              </button>
              <button
                onClick={() => setActiveView('budgets')}
                className={`btn-primary flex items-center ${
                  activeView === 'budgets' ? 'bg-indigo-700 dark:bg-indigo-600' : ''
                }`}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Budgets
              </button>
            </div>
          </div>
        </div>

        {activeView === 'dashboard' ? (
          <Dashboard
            expenses={expenses}
            onAddExpense={() => {
              setShowExpenseForm(true);
              setActiveView('expenses');
            }}
            onShowRecurring={() => setActiveView('recurring')}
            onShowReports={() => setActiveView('expenses')}
            onShowFilters={() => setActiveView('expenses')}
          />
        ) : activeView === 'recurring' ? (
          <div className="space-y-8">
            {!editingRecurringExpense && !showRecurringForm && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRecurringForm(true)}
                  className="btn-primary flex items-center"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Add Recurring Expense
                </button>
              </div>
            )}
            <RecurringExpenseList
              expenses={recurringExpenses}
              onDelete={handleDeleteRecurringExpense}
              onEdit={handleEditRecurringExpense}
            />
          </div>
        ) : activeView === 'budgets' ? (
          <div className="space-y-8">
            {!editingBudget && !showBudgetForm && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowBudgetForm(true)}
                  className="btn-primary flex items-center"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Set New Budget
                </button>
              </div>
            )}
            <BudgetList
              budgets={budgets}
              budgetStatus={budgetStatus}
              onDelete={handleDeleteBudget}
              onEdit={handleEditBudget}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {(showExpenseForm || editingExpense) && (
                <ExpenseForm
                  onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                  initialData={editingExpense}
                />
              )}
              <ExpenseList
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onEdit={handleEditExpense}
              />
            </div>
            <div>
              <ExpenseReport expenses={expenses} />
            </div>
          </div>
        )}
      </div>

      {/* Recurring Expense Form Modal */}
      {(showRecurringForm || editingRecurringExpense) && (
        <RecurringExpenseForm
          onSubmit={editingRecurringExpense ? handleUpdateRecurringExpense : handleAddRecurringExpense}
          onCancel={() => {
            setShowRecurringForm(false);
            setEditingRecurringExpense(null);
          }}
          initialData={editingRecurringExpense}
        />
      )}

      {/* Budget Form Modal */}
      {(showBudgetForm || editingBudget) && (
        <BudgetForm
          onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
          onCancel={() => {
            setShowBudgetForm(false);
            setEditingBudget(null);
          }}
          initialData={editingBudget}
        />
      )}
    </div>
  );
}

export default App;