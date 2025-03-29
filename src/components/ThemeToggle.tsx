import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 
        hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600
        focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
        focus:ring-offset-2 dark:focus:ring-offset-gray-900
        transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}