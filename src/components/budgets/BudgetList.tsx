import React, { useState } from 'react';
import { Plus, Trash2, Target, TrendingDown, AlertTriangle } from 'lucide-react';
import { Budget } from '../../types';
import { BudgetCard } from './BudgetCard';
import { BudgetForm } from './BudgetForm';

interface BudgetListProps {
  budgets: Budget[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'userId' | 'spent'>) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetList: React.FC<BudgetListProps> = ({ 
  budgets, 
  onAddBudget,
  onDeleteBudget 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      onDeleteBudget(id);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Hero Section with Budget Theme */}
      <div className="relative bg-gradient-to-r from-orange-600 via-pink-600 to-rose-600 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* Budget Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 text-white opacity-10 transform rotate-12">
            <Target className="w-12 h-12" />
          </div>
          <div className="absolute bottom-20 right-10 text-white opacity-10 transform -rotate-12">
            <TrendingDown className="w-10 h-10" />
          </div>
          <div className="absolute top-1/2 left-10 text-white opacity-10 transform rotate-45">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Budget Control Center</h1>
            <p className="text-orange-100 text-base lg:text-lg">Master your spending, achieve your goals</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 border border-white border-opacity-20 text-sm lg:text-base"
          >
            <Plus className="w-5 h-5" />
            Add Budget
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 relative z-10">Total Budget</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent relative z-10">₹{totalBudget.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 relative z-10">Total Spent</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10">₹{totalSpent.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <h3 className="text-sm font-medium text-gray-600 mb-2 relative z-10">Over Budget</h3>
          <p className={`text-2xl font-bold relative z-10 ${overBudgetCount > 0 ? 'bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent'}`}>
            {overBudgetCount} {overBudgetCount === 1 ? 'Category' : 'Categories'}
          </p>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="relative group">
            <BudgetCard budget={budget} />
            <button
              onClick={() => handleDelete(budget.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-red-500 to-rose-500 text-white p-1 rounded-full hover:from-red-600 hover:to-rose-600 shadow-lg"
              title="Delete budget"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {budgets.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Beautiful Empty State */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 opacity-50"></div>
              <Target className="w-16 h-16 text-orange-600 relative z-10" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">No budgets set yet</h3>
            <p className="text-gray-500 mb-6 text-sm lg:text-base">Take control of your spending by creating your first budget</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-orange-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg text-sm lg:text-base"
            >
              Create your first budget
            </button>
          </div>
        </div>
      )}

      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={onAddBudget}
      />
    </div>
  );
};