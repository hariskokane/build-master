export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  occupation?: string;
  monthlyIncome?: number;
  address?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  userId: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
  userId: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  userId: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoalsProgress: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
  userId: string;
  category: 'budget' | 'bill' | 'goal' | 'transaction' | 'general' | 'event';
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  category: string;
  recurring: 'monthly' | 'yearly' | 'weekly' | 'none';
  paid: boolean;
  userId: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  amount?: number;
  type: 'income' | 'expense' | 'bill' | 'goal' | 'reminder';
  date: string;
  time?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  category?: string;
  userId: string;
  notificationSent?: boolean;
}