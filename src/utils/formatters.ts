import { Transaction, User } from '../types';

export const formatCurrency = (amount: number, currency: string = '₹') => {
  return `${currency}${Math.abs(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatPercentage = (value: number, total: number) => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export const calculateDashboardStats = (transactions: Transaction[], user?: User) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Correct balance calculation: Income - Expenses
  const balance = totalIncome - totalExpenses;
  
  // Get current month transactions
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );
  
  const monthlyIncomeFromTransactions = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Use user's monthly income if available and no transactions this month, otherwise use calculated
  const monthlyIncome = monthlyIncomeFromTransactions > 0 
    ? monthlyIncomeFromTransactions 
    : (user?.monthlyIncome || 0);
  
  return {
    totalIncome,
    totalExpenses,
    balance,
    monthlyIncome,
    monthlyExpenses,
    savingsGoalsProgress: 0 // Will be calculated based on actual goals
  };
};