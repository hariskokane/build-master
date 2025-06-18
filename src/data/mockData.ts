import { Transaction, Budget, SavingsGoal, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com'
};

// Start with empty arrays - users should add their own data
export const mockTransactions: Transaction[] = [];

export const mockBudgets: Budget[] = [];

export const mockSavingsGoals: SavingsGoal[] = [];

// Separate categories for income and expense
export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investment Returns',
  'Business Income',
  'Rental Income',
  'Bonus',
  'Gift Money',
  'Other Income'
];

export const expenseCategories = [
  'Housing',
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Insurance',
  'Debt Payment',
  'Travel',
  'Personal Care',
  'Other Expense'
];

// Combined categories for backward compatibility
export const categories = [...incomeCategories, ...expenseCategories];