import { useState, useEffect } from 'react';
import { Notification, Transaction, Budget, SavingsGoal, User, CalendarEvent } from '../types';

export const useNotifications = (
  user: User | null,
  transactions: Transaction[],
  budgets: Budget[],
  savingsGoals: SavingsGoal[],
  calendarEvents?: CalendarEvent[]
) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on actual data conditions
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const newNotifications: Notification[] = [];
    const today = new Date();

    // Only generate notifications if there's actual data to work with

    // 1. Calendar Events Notifications (only if events exist)
    if (calendarEvents && calendarEvents.length > 0) {
      const upcomingEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.date);
        const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilEvent <= 3 && daysUntilEvent >= 0 && !event.notificationSent;
      });

      upcomingEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let urgency: 'info' | 'warning' | 'error' = 'info';
        if (daysUntilEvent === 0) urgency = 'warning';
        else if (daysUntilEvent === 1) urgency = 'info';

        const timeText = event.time ? ` at ${event.time}` : '';
        const dayText = daysUntilEvent === 0 ? 'Today' : daysUntilEvent === 1 ? 'Tomorrow' : `in ${daysUntilEvent} days`;

        newNotifications.push({
          id: `event-${event.id}`,
          title: `Upcoming: ${event.title}`,
          message: `${event.title} is scheduled for ${dayText}${timeText}. ${event.description || ''}`,
          type: urgency,
          date: new Date().toISOString(),
          read: false,
          userId: user.id,
          category: 'event'
        });
      });
    }

    // 2. Budget Overspending Notifications (only if budgets exist and have spending)
    if (budgets.length > 0) {
      budgets.forEach(budget => {
        if (budget.spent > 0) { // Only notify if there's actual spending
          const percentage = (budget.spent / budget.limit) * 100;
          
          if (percentage >= 100) {
            newNotifications.push({
              id: `budget-over-${budget.id}`,
              title: `Budget Exceeded: ${budget.category}`,
              message: `You've exceeded your ${budget.category} budget by ₹${(budget.spent - budget.limit).toLocaleString('en-IN')}. Consider reviewing your spending.`,
              type: 'error',
              date: new Date().toISOString(),
              read: false,
              userId: user.id,
              category: 'budget'
            });
          } else if (percentage >= 80) {
            newNotifications.push({
              id: `budget-warning-${budget.id}`,
              title: `Budget Alert: ${budget.category}`,
              message: `You've used ${Math.round(percentage)}% of your ${budget.category} budget. Only ₹${(budget.limit - budget.spent).toLocaleString('en-IN')} remaining.`,
              type: 'warning',
              date: new Date().toISOString(),
              read: false,
              userId: user.id,
              category: 'budget'
            });
          }
        }
      });
    }

    // 3. Savings Goals Achievements (only if goals exist and have progress)
    if (savingsGoals.length > 0) {
      savingsGoals.forEach(goal => {
        if (goal.currentAmount > 0) { // Only notify if there's actual progress
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          
          if (percentage >= 100) {
            newNotifications.push({
              id: `goal-achieved-${goal.id}`,
              title: `🎉 Goal Achieved: ${goal.title}`,
              message: `Congratulations! You've successfully reached your savings goal of ₹${goal.targetAmount.toLocaleString('en-IN')}!`,
              type: 'success',
              date: new Date().toISOString(),
              read: false,
              userId: user.id,
              category: 'goal'
            });
          } else if (percentage >= 75) {
            newNotifications.push({
              id: `goal-progress-${goal.id}`,
              title: `Almost There: ${goal.title}`,
              message: `You're ${Math.round(percentage)}% towards your ${goal.title} goal! Only ₹${(goal.targetAmount - goal.currentAmount).toLocaleString('en-IN')} to go.`,
              type: 'info',
              date: new Date().toISOString(),
              read: false,
              userId: user.id,
              category: 'goal'
            });
          }
        }
      });
    }

    // 4. Monthly Spending Limit Notifications (only if user has income and transactions)
    if (user.monthlyIncome && transactions.length > 0) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (monthlyExpenses > 0) { // Only notify if there are actual expenses
        const monthlyIncome = transactions
          .filter(t => t.type === 'income' && t.date.startsWith(currentMonth))
          .reduce((sum, t) => sum + t.amount, 0) + user.monthlyIncome;
        
        const spendingPercentage = (monthlyExpenses / monthlyIncome) * 100;
        
        if (spendingPercentage >= 90) {
          newNotifications.push({
            id: 'monthly-spending-critical',
            title: 'Critical: Monthly Spending Limit',
            message: `You've spent ${Math.round(spendingPercentage)}% of your monthly income. Only ₹${(monthlyIncome - monthlyExpenses).toLocaleString('en-IN')} remaining.`,
            type: 'error',
            date: new Date().toISOString(),
            read: false,
            userId: user.id,
            category: 'transaction'
          });
        } else if (spendingPercentage >= 75) {
          newNotifications.push({
            id: 'monthly-spending-warning',
            title: 'Monthly Spending Alert',
            message: `You've spent ${Math.round(spendingPercentage)}% of your monthly income. Consider monitoring your expenses closely.`,
            type: 'warning',
            date: new Date().toISOString(),
            read: false,
            userId: user.id,
            category: 'transaction'
          });
        }
      }
    }

    // 5. Large Transaction Notifications (only for recent large transactions)
    if (transactions.length > 0) {
      const recentLargeTransactions = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          const daysSince = Math.ceil((today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
          return daysSince <= 1 && t.amount >= 10000; // Transactions in last day over ₹10,000
        });

      recentLargeTransactions.forEach(transaction => {
        newNotifications.push({
          id: `large-transaction-${transaction.id}`,
          title: `Large ${transaction.type === 'income' ? 'Income' : 'Expense'} Recorded`,
          message: `${transaction.type === 'income' ? 'Received' : 'Spent'} ₹${transaction.amount.toLocaleString('en-IN')} on ${transaction.description} in ${transaction.category}.`,
          type: transaction.type === 'income' ? 'success' : 'info',
          date: new Date().toISOString(),
          read: false,
          userId: user.id,
          category: 'transaction'
        });
      });
    }

    // Load existing notifications from localStorage
    const existingNotifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
    
    // Merge with new notifications, avoiding duplicates
    const allNotifications = [...existingNotifications];
    newNotifications.forEach(newNotif => {
      if (!allNotifications.find(existing => existing.id === newNotif.id)) {
        allNotifications.push(newNotif);
      }
    });

    // Sort by date (newest first) and limit to last 50
    const sortedNotifications = allNotifications
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50);

    setNotifications(sortedNotifications);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(sortedNotifications));

  }, [user, transactions, budgets, savingsGoals, calendarEvents]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ).filter(n => !n.read); // Remove read notifications
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated: Notification[] = []; // Clear all notifications when marking all as read
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return {
    notifications,
    markAsRead,
    markAllAsRead
  };
};