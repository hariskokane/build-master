import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, DollarSign, CreditCard, Target, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface FinancialCalendarProps {
  transactions: Transaction[];
}

interface CalendarEvent {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'bill' | 'goal';
  date: string;
  recurring?: 'monthly' | 'yearly' | 'weekly';
  category?: string;
}

export const FinancialCalendar: React.FC<FinancialCalendarProps> = ({ transactions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Get actual transactions for this date
    const dayTransactions = transactions.filter(t => t.date === dateString);
    
    // Get scheduled events for this date
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      
      if (event.recurring === 'monthly') {
        return eventDate.getDate() === date.getDate();
      } else if (event.recurring === 'yearly') {
        return eventDate.getDate() === date.getDate() && eventDate.getMonth() === date.getMonth();
      } else if (event.recurring === 'weekly') {
        return eventDate.getDay() === date.getDay();
      } else {
        return event.date === dateString;
      }
    });
    
    return { transactions: dayTransactions, events: dayEvents };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'income':
        return <DollarSign className="w-3 h-3" />;
      case 'expense':
        return <CreditCard className="w-3 h-3" />;
      case 'bill':
        return <AlertCircle className="w-3 h-3" />;
      case 'goal':
        return <Target className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'income':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200';
      case 'expense':
        return 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border-cyan-200';
      case 'bill':
        return 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border-rose-200';
      case 'goal':
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddEvent = () => {
    setIsAddEventModalOpen(true);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  // Calculate monthly summary
  const monthlyIncome = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'income' && 
             tDate.getMonth() === currentDate.getMonth() && 
             tDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'expense' && 
             tDate.getMonth() === currentDate.getMonth() && 
             tDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const upcomingBills = events.filter(event => 
    event.type === 'bill' && 
    new Date(event.date).getDate() > today.getDate()
  );

  if (transactions.length === 0 && events.length === 0) {
    return (
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Financial Calendar</h1>
              <p className="text-purple-100 text-lg">Track your financial events and plan ahead</p>
            </div>
            
            <button 
              onClick={handleAddEvent}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 border border-white border-opacity-20"
            >
              <Plus className="w-5 h-5" />
              Add Event
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Start Planning Your Finances</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Add transactions and create financial events to see them on your calendar. 
            Plan recurring bills, income, and savings goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleAddEvent}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 justify-center shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Financial Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -translate-y-24 translate-x-24"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Financial Calendar</h1>
            <p className="text-purple-100">Track your financial events and plan ahead</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded-xl text-sm transition-all duration-200 ${
                  view === 'month' 
                    ? 'bg-white bg-opacity-20 text-white border border-white border-opacity-30' 
                    : 'bg-white bg-opacity-10 text-purple-100 hover:bg-opacity-20'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 rounded-xl text-sm transition-all duration-200 ${
                  view === 'week' 
                    ? 'bg-white bg-opacity-20 text-white border border-white border-opacity-30' 
                    : 'bg-white bg-opacity-10 text-purple-100 hover:bg-opacity-20'
                }`}
              >
                Week
              </button>
            </div>
            
            <button 
              onClick={handleAddEvent}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 border border-white border-opacity-20"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Income</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{formatCurrency(monthlyIncome)}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Expenses</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">{formatCurrency(monthlyExpenses)}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Net Savings</h3>
          <p className={`text-2xl font-bold ${monthlyIncome - monthlyExpenses >= 0 ? 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent'}`}>
            {formatCurrency(monthlyIncome - monthlyExpenses)}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Upcoming Bills</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{upcomingBills.length}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 rounded-xl transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 rounded-xl transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2 h-24"></div>;
            }

            const { transactions: dayTransactions, events: dayEvents } = getEventsForDate(day);
            const isToday = day.toDateString() === today.toDateString();
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();

            return (
              <div
                key={day.toISOString()}
                className={`p-2 h-24 border border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200 rounded-lg ${
                  isToday ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : ''
                } ${!isCurrentMonth ? 'text-gray-400' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-gray-800'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1 overflow-hidden">
                  {/* Show transactions */}
                  {dayTransactions.slice(0, 2).map(transaction => (
                    <div
                      key={transaction.id}
                      className={`text-xs px-1 py-0.5 rounded border ${
                        transaction.type === 'income' 
                          ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200'
                          : 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </div>
                  ))}
                  
                  {/* Show scheduled events */}
                  {dayEvents.slice(0, 2 - dayTransactions.length).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded border flex items-center gap-1 ${getEventTypeColor(event.type)}`}
                    >
                      {getEventTypeIcon(event.type)}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  
                  {/* Show more indicator */}
                  {(dayTransactions.length + dayEvents.length) > 2 && (
                    <div className="text-xs text-gray-500">
                      +{(dayTransactions.length + dayEvents.length) - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Upcoming Financial Events</h3>
          <div className="space-y-3">
            {events
              .filter(event => new Date(event.date) >= today)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(event.date)} • {event.category}
                        {event.recurring && ` • Recurring ${event.recurring}`}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    event.type === 'income' 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent'
                  }`}>
                    {event.type === 'income' ? '+' : '-'}{formatCurrency(event.amount)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Add Event Modal Placeholder */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Add Financial Event</h2>
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Event creation feature coming soon!</p>
              <button
                onClick={() => setIsAddEventModalOpen(false)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};