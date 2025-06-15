import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/auth/AuthForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { TransactionList } from './components/transactions/TransactionList';
import { BudgetList } from './components/budgets/BudgetList';
import { SavingsList } from './components/savings/SavingsList';
import { ReportsView } from './components/reports/ReportsView';
import { FinancialPlanning } from './components/planning/FinancialPlanning';
import { FinancialCalendar } from './components/calendar/FinancialCalendar';
import { ConsultantsList } from './components/consultants/ConsultantsList';
import { Transaction, Budget, SavingsGoal } from './types';

function App() {
  const { user, isLoading, login, signup, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      // Load user's data from localStorage or start with empty arrays
      const userTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
      const userBudgets = JSON.parse(localStorage.getItem(`budgets_${user.id}`) || '[]');
      const userSavingsGoals = JSON.parse(localStorage.getItem(`savingsGoals_${user.id}`) || '[]');
      
      setTransactions(userTransactions);
      setBudgets(userBudgets);
      setSavingsGoals(userSavingsGoals);
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions_${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`budgets_${user.id}`, JSON.stringify(budgets));
    }
  }, [budgets, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`savingsGoals_${user.id}`, JSON.stringify(savingsGoals));
    }
  }, [savingsGoals, user]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'userId'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
      userId: user?.id || '1'
    };
    setTransactions(prev => [transaction, ...prev]);

    // Update budget spent amounts if it's an expense
    if (newTransaction.type === 'expense') {
      setBudgets(prev => prev.map(budget => 
        budget.category === newTransaction.category
          ? { ...budget, spent: budget.spent + newTransaction.amount }
          : budget
      ));
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Update budget spent amounts if it was an expense
      if (transaction.type === 'expense') {
        setBudgets(prev => prev.map(budget => 
          budget.category === transaction.category
            ? { ...budget, spent: Math.max(0, budget.spent - transaction.amount) }
            : budget
        ));
      }
    }
  };

  const handleAddBudget = (newBudget: Omit<Budget, 'id' | 'userId' | 'spent'>) => {
    // Calculate spent amount based on existing transactions
    const spent = transactions
      .filter(t => t.category === newBudget.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const budget: Budget = {
      ...newBudget,
      id: Date.now().toString(),
      userId: user?.id || '1',
      spent
    };
    setBudgets(prev => [...prev, budget]);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const handleAddSavingsGoal = (newGoal: Omit<SavingsGoal, 'id' | 'userId'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: Date.now().toString(),
      userId: user?.id || '1'
    };
    setSavingsGoals(prev => [...prev, goal]);
  };

  const handleDeleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleUpdateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
        : goal
    ));
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Budget Master...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={login} onSignup={signup} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} budgets={budgets} user={user} onNavigate={handleNavigate} />;
      case 'transactions':
        return (
          <TransactionList 
            transactions={transactions} 
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'budgets':
        return (
          <BudgetList 
            budgets={budgets} 
            onAddBudget={handleAddBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        );
      case 'savings':
        return (
          <SavingsList 
            savingsGoals={savingsGoals} 
            onAddGoal={handleAddSavingsGoal}
            onDeleteGoal={handleDeleteSavingsGoal}
            onUpdateGoal={handleUpdateSavingsGoal}
          />
        );
      case 'reports':
        return <ReportsView transactions={transactions} />;
      case 'planning':
        return <FinancialPlanning transactions={transactions} />;
      case 'calendar':
        return <FinancialCalendar transactions={transactions} />;
      case 'consultants':
        return <ConsultantsList />;
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">{user.phone}</span>
                      </div>
                    )}
                    {user.occupation && (
                      <div>
                        <span className="text-gray-600">Occupation:</span>
                        <span className="ml-2 font-medium capitalize">{user.occupation.replace('_', ' ')}</span>
                      </div>
                    )}
                    {user.monthlyIncome && (
                      <div>
                        <span className="text-gray-600">Monthly Income:</span>
                        <span className="ml-2 font-medium">₹{user.monthlyIncome.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Address:</span>
                        <span className="ml-2 font-medium">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard transactions={transactions} budgets={budgets} user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header user={user} />
        <main className="flex-1 overflow-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;