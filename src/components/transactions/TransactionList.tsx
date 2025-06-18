import React, { useState } from 'react';
import { Plus, Filter, ArrowUpRight, ArrowDownRight, Edit, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { Transaction, User } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TransactionForm } from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'userId'>) => void;
  onDeleteTransaction: (id: string) => void;
  user?: User;
}

interface GroupedTransaction {
  id: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  amount: number;
  count: number;
  originalIds: string[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onAddTransaction,
  onDeleteTransaction,
  user
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [groupTransactions, setGroupTransactions] = useState(true);

  // Group transactions by category and date
  const groupTransactionsByDateAndCategory = (transactions: Transaction[]): GroupedTransaction[] => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      const key = `${transaction.date}-${transaction.category}-${transaction.type}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(transaction);
    });

    return Object.values(groups).map(group => {
      const totalAmount = group.reduce((sum, t) => sum + t.amount, 0);
      const firstTransaction = group[0];
      
      return {
        id: `group-${firstTransaction.date}-${firstTransaction.category}-${firstTransaction.type}`,
        description: group.length > 1 
          ? `${firstTransaction.category} (${group.length} transactions)`
          : firstTransaction.description,
        category: firstTransaction.category,
        type: firstTransaction.type,
        date: firstTransaction.date,
        amount: totalAmount,
        count: group.length,
        originalIds: group.map(t => t.id)
      };
    });
  };

  const processedTransactions = groupTransactions 
    ? groupTransactionsByDateAndCategory(transactions)
    : transactions.map(t => ({
        ...t,
        count: 1,
        originalIds: [t.id]
      }));

  const filteredTransactions = processedTransactions
    .filter(t => filter === 'all' || t.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  const handleDelete = (transaction: GroupedTransaction) => {
    if (transaction.count > 1) {
      // For grouped transactions, ask which ones to delete
      const confirmMessage = `This will delete ${transaction.count} transactions in ${transaction.category} on ${formatDate(transaction.date)}. Are you sure?`;
      if (window.confirm(confirmMessage)) {
        transaction.originalIds.forEach(id => onDeleteTransaction(id));
      }
    } else {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        onDeleteTransaction(transaction.originalIds[0]);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section with Financial Background */}
      <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* Financial Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 text-white opacity-10 transform rotate-12">
            <DollarSign className="w-12 h-12" />
          </div>
          <div className="absolute bottom-20 right-10 text-white opacity-10 transform -rotate-12">
            <TrendingUp className="w-10 h-10" />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transaction Manager</h1>
            <p className="text-emerald-100 text-lg">Track every penny, build your wealth</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 border border-white border-opacity-20"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="border border-gray-300 rounded-xl px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="border border-gray-300 rounded-xl px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={groupTransactions}
                onChange={(e) => setGroupTransactions(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700">Group by category & date</span>
            </label>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-600' 
                      : 'bg-gradient-to-br from-rose-50 to-red-100 text-rose-600'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="w-6 h-6" />
                    ) : (
                      <ArrowDownRight className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-800">{transaction.description}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="bg-gradient-to-r from-gray-100 to-slate-100 px-2 py-1 rounded-lg text-xs">
                        {transaction.category}
                      </span>
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.count > 1 && (
                        <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium">
                          {transaction.count} items
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-semibold ${
                    transaction.type === 'income' 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      className="text-gray-400 hover:text-purple-600 transition-colors p-1 hover:bg-purple-50 rounded-lg"
                      title="Edit transaction"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(transaction)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded-lg"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center">
            {/* Beautiful Empty State with Background */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 opacity-50"></div>
                <Plus className="w-16 h-16 text-emerald-600 relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">Start tracking your finances by adding your first transaction</p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
              >
                Add your first transaction
              </button>
            </div>
          </div>
        )}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={onAddTransaction}
        user={user}
        transactions={transactions}
      />
    </div>
  );
};