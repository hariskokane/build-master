import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Plus
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ExpenseChart } from './ExpenseChart';
import { RecentTransactions } from './RecentTransactions';
import { Transaction, Budget, User } from '../../types';
import { calculateDashboardStats } from '../../utils/formatters';

interface DashboardProps {
  transactions: Transaction[];
  budgets: Budget[];
  user?: User;
  onNavigate?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, budgets, user, onNavigate }) => {
  const stats = calculateDashboardStats(transactions, user);

  const expenseData = React.useMemo(() => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    const colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#EC4899'];
    
    return Object.entries(expensesByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Calculate savings rate properly
  const savingsRate = stats.monthlyIncome > 0 
    ? ((stats.monthlyIncome - stats.monthlyExpenses) / stats.monthlyIncome) * 100 
    : 0;

  const handleAddTransaction = () => {
    if (onNavigate) {
      onNavigate('transactions');
    }
  };

  const handleSetBudget = () => {
    if (onNavigate) {
      onNavigate('budgets');
    }
  };

  const handleViewAllTransactions = () => {
    if (onNavigate) {
      onNavigate('transactions');
    }
  };

  if (transactions.length === 0 && !user?.monthlyIncome) {
    return (
      <div className="p-6 space-y-6">
        {/* Hero Section with Background Image */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative z-10">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome to Budget Master!</h1>
            <p className="text-purple-100 text-base lg:text-lg">Your journey to financial freedom starts here</p>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" />
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Get Started with Your Finances</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm lg:text-base">
              Take control of your financial future with our comprehensive budgeting tools. 
              Track expenses, set budgets, and achieve your savings goals with ease.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Track Expenses</h4>
              <p className="text-sm text-gray-600">Monitor your spending patterns and identify areas for improvement</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Set Budgets</h4>
              <p className="text-sm text-gray-600">Create realistic budgets and stay on track with your financial goals</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Save Money</h4>
              <p className="text-sm text-gray-600">Build emergency funds and work towards your savings objectives</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button 
              onClick={handleAddTransaction}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-3 justify-center shadow-lg font-medium text-sm lg:text-base"
            >
              <Plus className="w-5 h-5" />
              Add First Transaction
            </button>
            <button 
              onClick={handleSetBudget}
              className="border-2 border-gray-300 text-gray-700 px-6 lg:px-8 py-3 lg:py-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-3 justify-center font-medium text-sm lg:text-base"
            >
              <Target className="w-5 h-5" />
              Set Budget Goals
            </button>
          </div>
        </div>

        {/* Show user's monthly income if available */}
        {user?.monthlyIncome && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Your Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">₹{user.monthlyIncome.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occupation</p>
                  <p className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent capitalize">
                    {user.occupation?.replace('_', ' ') || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Header with Background */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl lg:rounded-3xl p-4 lg:p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
        <div className="relative z-10">
          <h1 className="text-xl lg:text-2xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-purple-100 text-sm lg:text-base">Overview of your financial status</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title="Total Balance"
          amount={stats.balance}
          icon={Wallet}
          color={stats.balance >= 0 ? "blue" : "red"}
          trend={{ value: 12, isPositive: stats.balance >= 0 }}
        />
        <StatsCard
          title="Monthly Income"
          amount={stats.monthlyIncome}
          icon={TrendingUp}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Monthly Expenses"
          amount={stats.monthlyExpenses}
          icon={TrendingDown}
          color="red"
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Savings Rate"
          amount={savingsRate}
          icon={Target}
          color="purple"
          isPercentage={true}
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {expenseData.length > 0 ? (
          <ExpenseChart data={expenseData} />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Expense Breakdown</h3>
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingDown className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No expenses to show yet</p>
                <p className="text-sm">Add some expense transactions to see the breakdown</p>
              </div>
            </div>
          </div>
        )}
        <RecentTransactions transactions={transactions} onViewAll={handleViewAllTransactions} />
      </div>
    </div>
  );
};