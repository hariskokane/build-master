import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface StatsCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'red' | 'purple';
  isPercentage?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    icon: 'text-cyan-600',
    text: 'text-cyan-600',
    gradient: 'from-cyan-500 to-blue-600'
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-50 to-green-100',
    icon: 'text-emerald-600',
    text: 'text-emerald-600',
    gradient: 'from-emerald-500 to-green-600'
  },
  red: {
    bg: 'bg-gradient-to-br from-rose-50 to-red-100',
    icon: 'text-rose-600',
    text: 'text-rose-600',
    gradient: 'from-rose-500 to-red-600'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-pink-100',
    icon: 'text-purple-600',
    text: 'text-purple-600',
    gradient: 'from-purple-500 to-pink-600'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  amount, 
  icon: Icon, 
  trend, 
  color,
  isPercentage = false
}) => {
  const classes = colorClasses[color];

  const displayValue = isPercentage 
    ? `${Math.round(amount)}%` 
    : formatCurrency(amount);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${classes.bg} rounded-xl flex items-center justify-center shadow-sm`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700' 
              : 'bg-gradient-to-r from-rose-100 to-red-100 text-rose-700'
          }`}>
            <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className={`text-2xl font-bold bg-gradient-to-r ${classes.gradient} bg-clip-text text-transparent`}>
        {displayValue}
      </p>
    </div>
  );
};