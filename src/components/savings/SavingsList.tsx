import React, { useState } from 'react';
import { Plus, TrendingUp, Trash2, PlusCircle, Target, Coins, Banknote } from 'lucide-react';
import { SavingsGoal } from '../../types';
import { SavingsGoalCard } from './SavingsGoalCard';
import { SavingsForm } from './SavingsForm';
import { AddMoneyForm } from './AddMoneyForm';
import { formatCurrency } from '../../utils/formatters';

interface SavingsListProps {
  savingsGoals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'userId'>) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateGoal: (id: string, amount: number) => void;
}

export const SavingsList: React.FC<SavingsListProps> = ({ 
  savingsGoals, 
  onAddGoal,
  onDeleteGoal,
  onUpdateGoal
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [addMoneyGoalId, setAddMoneyGoalId] = useState<string | null>(null);

  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const completedGoals = savingsGoals.filter(goal => goal.currentAmount >= goal.targetAmount).length;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings goal?')) {
      onDeleteGoal(id);
    }
  };

  const handleAddMoney = (amount: number) => {
    if (addMoneyGoalId) {
      onUpdateGoal(addMoneyGoalId, amount);
      setAddMoneyGoalId(null);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Hero Section with Savings Theme */}
      <div className="relative bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* Savings Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 text-white opacity-10 transform rotate-12">
            <Coins className="w-12 h-12" />
          </div>
          <div className="absolute bottom-20 right-10 text-white opacity-10 transform -rotate-12">
            <Banknote className="w-10 h-10" />
          </div>
          <div className="absolute top-1/2 left-10 text-white opacity-10 transform rotate-45">
            <Target className="w-8 h-8" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Savings Goals Hub</h1>
            <p className="text-teal-100 text-base lg:text-lg">Dream big, save smart, achieve more</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl hover:bg-opacity-30 transition-all duration-200 flex items-center gap-2 border border-white border-opacity-20 text-sm lg:text-base"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Target</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent relative z-10">{formatCurrency(totalTarget)}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Saved</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent relative z-10">{formatCurrency(totalSaved)}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Completed Goals</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10">{completedGoals}</p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {savingsGoals.map((goal) => (
          <div key={goal.id} className="relative group">
            <SavingsGoalCard goal={goal} />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => setAddMoneyGoalId(goal.id)}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-1 rounded-full hover:from-emerald-600 hover:to-green-600 shadow-lg"
                title="Add money to goal"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(goal.id)}
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white p-1 rounded-full hover:from-red-600 hover:to-rose-600 shadow-lg"
                title="Delete goal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {savingsGoals.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Beautiful Empty State */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-200 to-cyan-200 opacity-50"></div>
              <Target className="w-16 h-16 text-teal-600 relative z-10" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">No savings goals yet</h3>
            <p className="text-gray-500 mb-6 text-sm lg:text-base">Start building your future by setting your first savings goal</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg text-sm lg:text-base"
            >
              Create your first savings goal
            </button>
          </div>
        </div>
      )}

      <SavingsForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={onAddGoal}
      />

      <AddMoneyForm
        isOpen={addMoneyGoalId !== null}
        onClose={() => setAddMoneyGoalId(null)}
        onSubmit={handleAddMoney}
        goalTitle={savingsGoals.find(g => g.id === addMoneyGoalId)?.title || ''}
      />
    </div>
  );
};