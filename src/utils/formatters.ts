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
  // Calculate total income from all transactions
  const totalIncomeFromTransactions = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate total expenses from all transactions
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Get current month for monthly calculations
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );
  
  // Calculate monthly income from transactions
  const monthlyIncomeFromTransactions = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate monthly expenses from transactions
  const monthlyExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Total income includes user's profile monthly income + all transaction income
  const userProfileIncome = user?.monthlyIncome || 0;
  const totalIncome = totalIncomeFromTransactions + userProfileIncome;
  
  // Monthly income is transaction income + user's monthly income (if any)
  const monthlyIncome = monthlyIncomeFromTransactions + userProfileIncome;
  
  // Balance is total income minus total expenses
  const balance = totalIncome - totalExpenses;
  
  return {
    totalIncome,
    totalExpenses,
    balance,
    monthlyIncome,
    monthlyExpenses,
    savingsGoalsProgress: 0 // Will be calculated based on actual goals
  };
};