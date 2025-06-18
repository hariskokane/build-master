import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useNotifications } from './hooks/useNotifications';
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
import { Transaction, Budget, SavingsGoal, User, CalendarEvent } from './types';

function App() {
  const { user, isLoading, login, signup, logout, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const { notifications, markAsRead, markAllAsRead } = useNotifications(
    user,
    transactions,
    budgets,
    savingsGoals,
    calendarEvents
  );

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      // Load user's data from localStorage or start with empty arrays
      const userTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || '[]');
      const userBudgets = JSON.parse(localStorage.getItem(`budgets_${user.id}`) || '[]');
      const userSavingsGoals = JSON.parse(localStorage.getItem(`savingsGoals_${user.id}`) || '[]');
      const userCalendarEvents = JSON.parse(localStorage.getItem(`calendarEvents_${user.id}`) || '[]');
      
      setTransactions(userTransactions);
      setBudgets(userBudgets);
      setSavingsGoals(userSavingsGoals);
      setCalendarEvents(userCalendarEvents);
    } else {
      // Clear data when user logs out
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
      setCalendarEvents([]);
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

  useEffect(() => {
    if (user) {
      localStorage.setItem(`calendarEvents_${user.id}`, JSON.stringify(calendarEvents));
    }
  }, [calendarEvents, user]);

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

  const handleAddCalendarEvent = (newEvent: Omit<CalendarEvent, 'id' | 'userId'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: Date.now().toString(),
      userId: user?.id || '1'
    };
    setCalendarEvents(prev => [...prev, event]);
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUpdateProfile = (userData: Partial<User>) => {
    updateProfile(userData);
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    return changePassword(oldPassword, newPassword);
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
            user={user}
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
        return <FinancialCalendar transactions={transactions} calendarEvents={calendarEvents} onAddEvent={handleAddCalendarEvent} />;
      case 'consultants':
        return <ConsultantsList />;
      default:
        return <Dashboard transactions={transactions} budgets={budgets} user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={logout} />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header 
          user={user} 
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
        />
        <main className="flex-1 overflow-auto">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;