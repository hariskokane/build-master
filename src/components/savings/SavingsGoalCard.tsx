import React from 'react';
import { Calendar, Target } from 'lucide-react';
import { SavingsGoal } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

export const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{goal.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(goal.targetDate)}</span>
              <span>({daysLeft} days left)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Saved</span>
          <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Target</span>
          <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remaining</span>
          <span className="font-medium bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {percentage >= 100 && (
        <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
          <p className="text-xs text-emerald-700 font-medium">
            🎉 Goal achieved! Congratulations!
          </p>
        </div>
      )}
      
      {percentage >= 80 && percentage < 100 && (
        <div className="mt-3 p-3 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
          <p className="text-xs text-cyan-700">
            You're almost there! Just {formatCurrency(remaining)} to go.
          </p>
        </div>
      )}
    </div>
  );
};