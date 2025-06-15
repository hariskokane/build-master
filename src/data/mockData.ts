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

export const categories = [
  'Salary',
  'Freelance',
  'Investment',
  'Business Income',
  'Rental Income',
  'Other Income',
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Insurance',
  'Debt Payment',
  'Other Expense'
];