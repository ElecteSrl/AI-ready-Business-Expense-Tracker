import React from 'react';
import { AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';

interface InsightCardProps {
  type: 'info' | 'warning' | 'success';
  message: string;
}

export function InsightCard({ type, message }: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className={`rounded-lg p-4 flex items-start space-x-3 ${getStyles()}`}>
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}