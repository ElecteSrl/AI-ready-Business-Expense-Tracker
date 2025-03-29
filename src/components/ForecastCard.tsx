import React from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, AlertCircle } from 'lucide-react';
import { Forecast, formatCurrency } from '../types';

interface ForecastCardProps {
  forecast: Forecast;
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const getTrendIcon = () => {
    switch (forecast.trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'decreasing':
        return <TrendingDown className="w-5 h-5 text-green-500 dark:text-green-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  const getTrendText = () => {
    switch (forecast.trend) {
      case 'increasing':
        return 'Expected to increase';
      case 'decreasing':
        return 'Expected to decrease';
      default:
        return 'Expected to remain stable';
    }
  };

  const getConfidenceColor = () => {
    if (forecast.confidence >= 70) return 'text-green-600 dark:text-green-400';
    if (forecast.confidence >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        Next Month Forecast
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Expenses</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <DollarSign className="w-6 h-6 mr-1" />
              {formatCurrency(forecast.amount).replace('$', '')}
            </p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
            {getTrendIcon()}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Trend</span>
            <span className="text-sm font-medium">{getTrendText()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
            <span className={`text-sm font-medium ${getConfidenceColor()}`}>
              {forecast.confidence.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}