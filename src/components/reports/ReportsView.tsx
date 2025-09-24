import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Target, Filter, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface ReportsViewProps {
  transactions: Transaction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ transactions }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState<'monthly' | 'yearly' | 'category'>('monthly');
  const [timeRange, setTimeRange] = useState<'6months' | '1year' | '2years' | 'all'>('1year');

  // Get available years from transactions
  const availableYears = React.useMemo(() => {
    const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  }, [transactions]);

  // Monthly data for selected year
  const monthlyData = React.useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map((month, index) => {
      const monthIndex = index + 1;
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === selectedYear && 
               transactionDate.getMonth() + 1 === monthIndex;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        month,
        income,
        expenses,
        savings: income - expenses,
        net: income - expenses
      };
    });
  }, [transactions, selectedYear]);

  // Yearly comparison data
  const yearlyData = React.useMemo(() => {
    return availableYears.map(year => {
      const yearTransactions = transactions.filter(t => 
        new Date(t.date).getFullYear() === year
      );

      const income = yearTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = yearTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        year: year.toString(),
        income,
        expenses,
        savings: income - expenses,
        transactionCount: yearTransactions.length
      };
    });
  }, [transactions, availableYears]);

  // Category-wise spending with trends
  const categoryData = React.useMemo(() => {
    const currentYearTransactions = transactions.filter(t => 
      new Date(t.date).getFullYear() === selectedYear
    );
    
    const categoryTotals = currentYearTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, selectedYear]);

  // Quarterly data
  const quarterlyData = React.useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    return quarters.map((quarter, index) => {
      const startMonth = index * 3;
      const endMonth = startMonth + 2;
      
      const quarterTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const month = transactionDate.getMonth();
        return transactionDate.getFullYear() === selectedYear && 
               month >= startMonth && month <= endMonth;
      });

      const income = quarterTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = quarterTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        quarter,
        income,
        expenses,
        savings: income - expenses
      };
    });
  }, [transactions, selectedYear]);

  // Expense trend over time
  const expenseTrendData = React.useMemo(() => {
    const last12Months = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === date.getFullYear() && 
               transactionDate.getMonth() === date.getMonth();
      });

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      last12Months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        expenses,
        avgExpenses: expenses // You could calculate rolling average here
      });
    }
    
    return last12Months;
  }, [transactions]);

  // Calculate key metrics
  const currentYearStats = React.useMemo(() => {
    const currentYearTransactions = transactions.filter(t => 
      new Date(t.date).getFullYear() === selectedYear
    );

    const totalIncome = currentYearTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentYearTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const avgMonthlyIncome = totalIncome / 12;
    const avgMonthlyExpenses = totalExpenses / 12;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      totalSavings: totalIncome - totalExpenses,
      avgMonthlyIncome,
      avgMonthlyExpenses,
      savingsRate,
      transactionCount: currentYearTransactions.length
    };
  }, [transactions, selectedYear]);

  const colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#EC4899', '#F97316', '#84CC16'];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Hero Section with Analytics Theme */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* Analytics Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 text-white opacity-10 transform rotate-12">
            <BarChart3 className="w-12 h-12" />
          </div>
          <div className="absolute bottom-20 right-10 text-white opacity-10 transform -rotate-12">
            <PieChartIcon className="w-10 h-10" />
          </div>
          <div className="absolute top-1/2 left-10 text-white opacity-10 transform rotate-45">
            <Activity className="w-8 h-8" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Financial Analytics</h1>
            <p className="text-purple-100 text-base lg:text-lg">Comprehensive insights into your financial patterns and trends</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-100" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-3 py-1 text-sm text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-0"
              >
                {availableYears.map(year => (
                  <option key={year} value={year} className="text-gray-800">{year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-100" />
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as 'monthly' | 'yearly' | 'category')}
                className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl px-3 py-1 text-sm text-white placeholder-purple-200 focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-0"
              >
                <option value="monthly" className="text-gray-800">Monthly View</option>
                <option value="yearly" className="text-gray-800">Yearly Comparison</option>
                <option value="category" className="text-gray-800">Category Analysis</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Income ({selectedYear})</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent relative z-10">{formatCurrency(currentYearStats.totalIncome)}</p>
          <p className="text-sm text-gray-500 mt-1 relative z-10">Avg: {formatCurrency(currentYearStats.avgMonthlyIncome)}/month</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-100 to-red-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-50 to-red-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Expenses ({selectedYear})</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent relative z-10">{formatCurrency(currentYearStats.totalExpenses)}</p>
          <p className="text-sm text-gray-500 mt-1 relative z-10">Avg: {formatCurrency(currentYearStats.avgMonthlyExpenses)}/month</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Net Savings ({selectedYear})</h3>
          </div>
          <p className={`text-2xl font-bold relative z-10 ${currentYearStats.totalSavings >= 0 ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent'}`}>
            {formatCurrency(currentYearStats.totalSavings)}
          </p>
          <p className="text-sm text-gray-500 mt-1 relative z-10">
            {currentYearStats.totalSavings >= 0 ? 'Surplus' : 'Deficit'}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <div className="flex items-center gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Savings Rate</h3>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent relative z-10">{Math.round(currentYearStats.savingsRate)}%</p>
          <p className="text-sm text-gray-500 mt-1 relative z-10">{currentYearStats.transactionCount} transactions</p>
        </div>
      </div>

      {/* Main Charts */}
      {viewType === 'monthly' && (
        <>
          {/* Monthly Income vs Expenses */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Monthly Breakdown - {selectedYear}</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quarterly Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Quarterly Performance - {selectedYear}</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="expenses" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Savings Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Savings Trend - {selectedYear}</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Savings']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {viewType === 'yearly' && (
        <>
          {/* Yearly Comparison */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Year-over-Year Comparison</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                  <Bar dataKey="savings" fill="#8B5CF6" name="Net Savings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Growth Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {yearlyData.map((yearData, index) => {
              const prevYear = yearlyData[index + 1];
              const incomeGrowth = prevYear ? ((yearData.income - prevYear.income) / prevYear.income) * 100 : 0;
              const expenseGrowth = prevYear ? ((yearData.expenses - prevYear.expenses) / prevYear.expenses) * 100 : 0;
              
              return (
                <div key={yearData.year} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-8 translate-x-8 opacity-50"></div>
                  <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 relative z-10">{yearData.year}</h4>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Income:</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(yearData.income)}</span>
                        {prevYear && (
                          <div className={`text-xs ${incomeGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {incomeGrowth >= 0 ? '+' : ''}{incomeGrowth.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expenses:</span>
                      <div className="text-right">
                        <span className="font-medium">{formatCurrency(yearData.expenses)}</span>
                        {prevYear && (
                          <div className={`text-xs ${expenseGrowth <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {expenseGrowth >= 0 ? '+' : ''}{expenseGrowth.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Net:</span>
                      <span className={`font-semibold ${yearData.savings >= 0 ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' : 'bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent'}`}>
                        {formatCurrency(yearData.savings)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {viewType === 'category' && (
        <>
          {/* Category Spending Pie Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Expense Distribution - {selectedYear}</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="amount"
                      nameKey="category"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Category Breakdown</h3>
              <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                {categoryData.map((category, index) => {
                  const percentage = (category.amount / categoryData.reduce((sum, c) => sum + c.amount, 0)) * 100;
                  return (
                    <div key={category.category} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="font-medium text-gray-800">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{formatCurrency(category.amount)}</div>
                        <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category Spending Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Category Spending Comparison</h3>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Expense Trend Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">12-Month Expense Trend</h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={expenseTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Expenses']}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};