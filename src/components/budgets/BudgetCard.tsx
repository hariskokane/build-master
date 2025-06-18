import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Budget } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface BudgetCardProps {
  budget: Budget;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
  const remaining = budget.limit - budget.spent;
  const isOverBudget = budget.spent > budget.limit;
  const isNearLimit = percentage > 80 && !isOverBudget;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{budget.category}</h3>
        <div className="flex items-center gap-2">
          {isOverBudget ? (
            <div className="w-8 h-8 bg-gradient-to-br from-red-50 to-rose-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
          ) : isNearLimit ? (
            <div className="w-8 h-8 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-50 to-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent</span>
          <span className="font-medium">{formatCurrency(budget.spent)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Budget</span>
          <span className="font-medium">{formatCurrency(budget.limit)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remaining</span>
          <span className={`font-medium ${
            remaining < 0 
              ? 'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent'
          }`}>
            {remaining >= 0 ? formatCurrency(remaining) : `${formatCurrency(Math.abs(remaining))} over`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget 
                ? 'bg-gradient-to-r from-red-500 to-rose-500' 
                : isNearLimit 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {isOverBudget && (
        <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
          <p className="text-xs text-red-700">
            You've exceeded your budget by {formatCurrency(budget.spent - budget.limit)}
          </p>
        </div>
      )}
      
      {isNearLimit && !isOverBudget && (
        <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-700">
            You're approaching your budget limit
          </p>
        </div>
      )}
    </div>
  );
};