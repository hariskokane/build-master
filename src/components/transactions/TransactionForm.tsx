import React, { useState } from 'react';
import { Plus, X, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { Transaction, User } from '../../types';
import { incomeCategories, expenseCategories } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  user?: User;
  transactions?: Transaction[];
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  user,
  transactions = []
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });
  const [validationError, setValidationError] = useState('');

  // Calculate available balance
  const calculateAvailableBalance = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Add user's monthly income if available
    const userMonthlyIncome = user?.monthlyIncome || 0;
    
    return totalIncome + userMonthlyIncome - totalExpenses;
  };

  // Calculate monthly spending limits
  const calculateMonthlyLimits = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const selectedMonth = formData.date.slice(0, 7);
    
    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(selectedMonth))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(selectedMonth))
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Add user's monthly income if it's the current month or future
    const userMonthlyIncome = (selectedMonth >= currentMonth && user?.monthlyIncome) ? user.monthlyIncome : 0;
    
    const totalMonthlyIncome = monthlyIncome + userMonthlyIncome;
    const remainingMonthlyBudget = totalMonthlyIncome - monthlyExpenses;
    
    return {
      totalMonthlyIncome,
      monthlyExpenses,
      remainingMonthlyBudget
    };
  };

  const availableBalance = calculateAvailableBalance();
  const monthlyLimits = calculateMonthlyLimits();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    // Clear any previous errors
    setValidationError('');
    
    // Basic validation
    if (!formData.description.trim()) {
      setValidationError('Please enter a description');
      return;
    }
    
    if (!formData.category) {
      setValidationError('Please select a category');
      return;
    }
    
    if (!amount || amount <= 0) {
      setValidationError('Please enter a valid amount greater than 0');
      return;
    }

    // Expense validation against income
    if (formData.type === 'expense') {
      // Check against total available balance
      if (amount > availableBalance) {
        setValidationError(
          `Insufficient funds! You only have ${formatCurrency(availableBalance)} available. ` +
          `This expense of ${formatCurrency(amount)} would exceed your total income.`
        );
        return;
      }

      // Check against monthly budget
      if (amount > monthlyLimits.remainingMonthlyBudget) {
        const selectedMonth = new Date(formData.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        setValidationError(
          `Monthly budget exceeded! You have ${formatCurrency(monthlyLimits.remainingMonthlyBudget)} ` +
          `remaining for ${selectedMonth}. This expense of ${formatCurrency(amount)} would exceed your monthly income.`
        );
        return;
      }
    }

    // Submit the transaction
    onSubmit({
      amount,
      description: formData.description.trim(),
      category: formData.category,
      type: formData.type,
      date: formData.date
    });
    
    // Reset form
    setFormData({
      amount: '',
      description: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
    setValidationError('');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      // If the type is changing, reset category
      if (name === 'type') {
        return {
          ...prev,
          type: value as 'income' | 'expense',
          category: '', // reset category when type changes
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError('');
    }
  };

  if (!isOpen) return null;

  // Get categories based on transaction type
  const availableCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Financial Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Financial Overview
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white bg-opacity-60 rounded-lg p-2">
              <p className="text-gray-600">Available Balance</p>
              <p className={`font-semibold ${availableBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(availableBalance)}
              </p>
            </div>
            <div className="bg-white bg-opacity-60 rounded-lg p-2">
              <p className="text-gray-600">Monthly Remaining</p>
              <p className={`font-semibold ${monthlyLimits.remainingMonthlyBudget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyLimits.remainingMonthlyBudget)}
              </p>
            </div>
          </div>
          {user?.monthlyIncome && (
            <div className="mt-2 text-xs text-blue-700">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Monthly Income: {formatCurrency(user.monthlyIncome)}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                  className="mr-2 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-emerald-600 font-medium">Income</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                  className="mr-2 text-rose-600 focus:ring-rose-500"
                />
                <span className="text-rose-600 font-medium">Expense</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
              {formData.type === 'expense' && availableBalance > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  (Max: {formatCurrency(availableBalance)})
                </span>
              )}
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              max={formData.type === 'expense' ? availableBalance : undefined}
              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:border-transparent bg-gray-50 ${
                validationError && !formData.amount ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="0.00"
            />
            {formData.type === 'expense' && formData.amount && parseFloat(formData.amount) > 0 && (
              <div className="mt-1 text-xs">
                {parseFloat(formData.amount) > availableBalance ? (
                  <p className="text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Exceeds available balance by {formatCurrency(parseFloat(formData.amount) - availableBalance)}
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Remaining after expense: {formatCurrency(availableBalance - parseFloat(formData.amount))}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:border-transparent bg-gray-50 ${
                validationError && !formData.description.trim() ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
              }`}
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:border-transparent bg-gray-50 ${
                validationError && !formData.category ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
              }`}
            >
              <option value="">
                {formData.type === 'income' ? 'Select income category' : 'Select expense category'}
              </option>
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.type === 'income' 
                ? `${incomeCategories.length} income categories available`
                : `${expenseCategories.length} expense categories available`
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            />
          </div>

          {validationError && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Budget Warning */}
          {formData.type === 'expense' && availableBalance <= 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">No Available Balance</p>
                <p>You need to add income before recording expenses. Consider adding your salary or other income sources first.</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.type === 'expense' && availableBalance <= 0}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};