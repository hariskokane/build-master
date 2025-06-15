import React, { useState } from 'react';
import { Calculator, Target, TrendingUp, DollarSign, Calendar, PiggyBank, Home, Car, GraduationCap, Plus, BarChart3, Activity, Zap } from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { AddFundModal } from './AddFundModal';

interface FinancialPlanningProps {
  transactions: Transaction[];
}

export const FinancialPlanning: React.FC<FinancialPlanningProps> = ({ transactions }) => {
  const [activeCalculator, setActiveCalculator] = useState<'retirement' | 'loan' | 'investment' | 'emergency'>('retirement');
  const [isAddFundModalOpen, setIsAddFundModalOpen] = useState(false);
  
  // Retirement Calculator State
  const [retirementData, setRetirementData] = useState({
    currentAge: 25,
    retirementAge: 60,
    currentSavings: 0,
    monthlyContribution: 0,
    expectedReturn: 12,
    inflationRate: 6
  });

  // Loan Calculator State
  const [loanData, setLoanData] = useState({
    loanAmount: 0,
    interestRate: 8.5,
    loanTerm: 20,
    loanType: 'home'
  });

  // Investment Calculator State
  const [investmentData, setInvestmentData] = useState({
    initialAmount: 0,
    monthlyInvestment: 0,
    investmentPeriod: 10,
    expectedReturn: 15,
    investmentType: 'sip'
  });

  // Emergency Fund Calculator
  const [emergencyData, setEmergencyData] = useState({
    monthlyExpenses: 0,
    targetMonths: 6,
    currentEmergencyFund: 0
  });

  // Calculate current monthly expenses from transactions
  const currentMonthlyExpenses = React.useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = transactions
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    return monthlyExpenses || 0;
  }, [transactions]);

  // Auto-populate emergency fund monthly expenses
  React.useEffect(() => {
    if (currentMonthlyExpenses > 0 && emergencyData.monthlyExpenses === 0) {
      setEmergencyData(prev => ({ ...prev, monthlyExpenses: currentMonthlyExpenses }));
    }
  }, [currentMonthlyExpenses, emergencyData.monthlyExpenses]);

  // Retirement Calculations
  const retirementCalculations = React.useMemo(() => {
    const yearsToRetirement = retirementData.retirementAge - retirementData.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = retirementData.expectedReturn / 100 / 12;
    
    // Future value of current savings
    const futureValueCurrentSavings = retirementData.currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
    
    // Future value of monthly contributions (annuity)
    const futureValueContributions = retirementData.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
    
    const totalRetirementCorpus = futureValueCurrentSavings + futureValueContributions;
    
    // Adjust for inflation
    const realValue = totalRetirementCorpus / Math.pow(1 + retirementData.inflationRate / 100, yearsToRetirement);
    
    return {
      totalCorpus: totalRetirementCorpus,
      realValue,
      yearsToRetirement,
      monthlyContributionNeeded: retirementData.monthlyContribution
    };
  }, [retirementData]);

  // Loan Calculations
  const loanCalculations = React.useMemo(() => {
    if (loanData.loanAmount === 0) {
      return { emi: 0, totalAmount: 0, totalInterest: 0, totalPayments: 0 };
    }

    const monthlyRate = loanData.interestRate / 100 / 12;
    const totalPayments = loanData.loanTerm * 12;
    
    const emi = (loanData.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
                (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    const totalAmount = emi * totalPayments;
    const totalInterest = totalAmount - loanData.loanAmount;
    
    return {
      emi,
      totalAmount,
      totalInterest,
      totalPayments
    };
  }, [loanData]);

  // Investment Calculations
  const investmentCalculations = React.useMemo(() => {
    const monthlyReturn = investmentData.expectedReturn / 100 / 12;
    const totalMonths = investmentData.investmentPeriod * 12;
    
    // Future value of initial investment
    const futureValueInitial = investmentData.initialAmount * Math.pow(1 + monthlyReturn, totalMonths);
    
    // Future value of monthly SIP
    const futureValueSIP = investmentData.monthlyInvestment * 
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    
    const totalInvestment = investmentData.initialAmount + (investmentData.monthlyInvestment * totalMonths);
    const totalValue = futureValueInitial + futureValueSIP;
    const totalGains = totalValue - totalInvestment;
    
    return {
      totalInvestment,
      totalValue,
      totalGains,
      returnPercentage: totalInvestment > 0 ? (totalGains / totalInvestment) * 100 : 0
    };
  }, [investmentData]);

  // Emergency Fund Calculations
  const emergencyCalculations = React.useMemo(() => {
    const targetAmount = emergencyData.monthlyExpenses * emergencyData.targetMonths;
    const shortfall = Math.max(0, targetAmount - emergencyData.currentEmergencyFund);
    const progressPercentage = targetAmount > 0 ? (emergencyData.currentEmergencyFund / targetAmount) * 100 : 0;
    
    return {
      targetAmount,
      shortfall,
      progressPercentage: Math.min(progressPercentage, 100)
    };
  }, [emergencyData]);

  const handleAddToEmergencyFund = (amount: number) => {
    setEmergencyData(prev => ({
      ...prev,
      currentEmergencyFund: prev.currentEmergencyFund + amount
    }));
  };

  const calculatorTypes = [
    { id: 'retirement', label: 'Retirement Planning', icon: PiggyBank, color: 'blue' },
    { id: 'loan', label: 'Loan Calculator', icon: Home, color: 'green' },
    { id: 'investment', label: 'Investment Calculator', icon: TrendingUp, color: 'purple' },
    { id: 'emergency', label: 'Emergency Fund', icon: Target, color: 'red' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section with Planning Theme */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        {/* Planning Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 text-white opacity-10 transform rotate-12">
            <Calculator className="w-12 h-12" />
          </div>
          <div className="absolute bottom-20 right-10 text-white opacity-10 transform -rotate-12">
            <BarChart3 className="w-10 h-10" />
          </div>
          <div className="absolute top-1/2 left-10 text-white opacity-10 transform rotate-45">
            <Activity className="w-8 h-8" />
          </div>
          <div className="absolute bottom-10 left-1/3 text-white opacity-10 transform -rotate-30">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Financial Planning Hub</h1>
          <p className="text-blue-100 text-lg">Smart tools to secure your financial future</p>
        </div>
      </div>

      {/* Calculator Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {calculatorTypes.map((calc) => {
          const Icon = calc.icon;
          return (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id as any)}
              className={`p-6 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                activeCalculator === calc.id
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
              }`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-8 translate-x-8 opacity-30"></div>
              <Icon className={`w-8 h-8 mx-auto mb-3 relative z-10 ${
                activeCalculator === calc.id ? 'text-purple-600' : 'text-gray-600'
              }`} />
              <p className={`font-medium text-sm relative z-10 ${
                activeCalculator === calc.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : 'text-gray-800'
              }`}>
                {calc.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Retirement Planning Calculator */}
      {activeCalculator === 'retirement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 relative z-10">Retirement Planning Inputs</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
                <input
                  type="number"
                  value={retirementData.currentAge}
                  onChange={(e) => setRetirementData(prev => ({ ...prev, currentAge: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
                <input
                  type="number"
                  value={retirementData.retirementAge}
                  onChange={(e) => setRetirementData(prev => ({ ...prev, retirementAge: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings (₹)</label>
                <input
                  type="number"
                  value={retirementData.currentSavings}
                  onChange={(e) => setRetirementData(prev => ({ ...prev, currentSavings: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution (₹)</label>
                <input
                  type="number"
                  value={retirementData.monthlyContribution}
                  onChange={(e) => setRetirementData(prev => ({ ...prev, monthlyContribution: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={retirementData.expectedReturn}
                  onChange={(e) => setRetirementData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inflation Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={retirementData.inflationRate}
                  onChange={(e) => setRetirementData(prev => ({ ...prev, inflationRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 relative z-10">Retirement Projections</h3>
            <div className="space-y-6 relative z-10">
              <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Total Retirement Corpus</h4>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{formatCurrency(retirementCalculations.totalCorpus)}</p>
                <p className="text-sm text-gray-500 mt-1">In {retirementCalculations.yearsToRetirement} years</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Real Value (Inflation Adjusted)</h5>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(retirementCalculations.realValue)}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Years to Retirement</h5>
                  <p className="text-xl font-bold text-gray-800">{retirementCalculations.yearsToRetirement} years</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Monthly Contribution</h5>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(retirementData.monthlyContribution)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Calculator */}
      {activeCalculator === 'loan' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6 relative z-10">Loan Calculator Inputs</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
                <select
                  value={loanData.loanType}
                  onChange={(e) => setLoanData(prev => ({ ...prev, loanType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                >
                  <option value="home">Home Loan</option>
                  <option value="car">Car Loan</option>
                  <option value="personal">Personal Loan</option>
                  <option value="education">Education Loan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹)</label>
                <input
                  type="number"
                  value={loanData.loanAmount}
                  onChange={(e) => setLoanData(prev => ({ ...prev, loanAmount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (% per annum)</label>
                <input
                  type="number"
                  step="0.1"
                  value={loanData.interestRate}
                  onChange={(e) => setLoanData(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (years)</label>
                <input
                  type="number"
                  value={loanData.loanTerm}
                  onChange={(e) => setLoanData(prev => ({ ...prev, loanTerm: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6 relative z-10">Loan Calculations</h3>
            <div className="space-y-6 relative z-10">
              <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Monthly EMI</h4>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{formatCurrency(loanCalculations.emi)}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Total Amount Payable</h5>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(loanCalculations.totalAmount)}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Total Interest</h5>
                  <p className="text-xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">{formatCurrency(loanCalculations.totalInterest)}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Total Payments</h5>
                  <p className="text-xl font-bold text-gray-800">{loanCalculations.totalPayments} months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Calculator */}
      {activeCalculator === 'investment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6 relative z-10">Investment Calculator Inputs</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
                <select
                  value={investmentData.investmentType}
                  onChange={(e) => setInvestmentData(prev => ({ ...prev, investmentType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                >
                  <option value="sip">SIP (Systematic Investment Plan)</option>
                  <option value="lumpsum">Lump Sum Investment</option>
                  <option value="mixed">Mixed (Lump Sum + SIP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment (₹)</label>
                <input
                  type="number"
                  value={investmentData.initialAmount}
                  onChange={(e) => setInvestmentData(prev => ({ ...prev, initialAmount: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Investment (₹)</label>
                <input
                  type="number"
                  value={investmentData.monthlyInvestment}
                  onChange={(e) => setInvestmentData(prev => ({ ...prev, monthlyInvestment: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Period (years)</label>
                <input
                  type="number"
                  value={investmentData.investmentPeriod}
                  onChange={(e) => setInvestmentData(prev => ({ ...prev, investmentPeriod: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={investmentData.expectedReturn}
                  onChange={(e) => setInvestmentData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6 relative z-10">Investment Projections</h3>
            <div className="space-y-6 relative z-10">
              <div className="text-center p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Final Investment Value</h4>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{formatCurrency(investmentCalculations.totalValue)}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Total Investment</h5>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(investmentCalculations.totalInvestment)}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Total Gains</h5>
                  <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{formatCurrency(investmentCalculations.totalGains)}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Return Percentage</h5>
                  <p className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{investmentCalculations.returnPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Fund Calculator */}
      {activeCalculator === 'emergency' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6 relative z-10">Emergency Fund Planning</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses (₹)</label>
                <input
                  type="number"
                  value={emergencyData.monthlyExpenses}
                  onChange={(e) => setEmergencyData(prev => ({ ...prev, monthlyExpenses: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50"
                />
                {currentMonthlyExpenses > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current month expenses: {formatCurrency(currentMonthlyExpenses)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Months Coverage</label>
                <select
                  value={emergencyData.targetMonths}
                  onChange={(e) => setEmergencyData(prev => ({ ...prev, targetMonths: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50"
                >
                  <option value={3}>3 months (Minimum)</option>
                  <option value={6}>6 months (Recommended)</option>
                  <option value={9}>9 months (Conservative)</option>
                  <option value={12}>12 months (Very Conservative)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Emergency Fund (₹)</label>
                <input
                  type="number"
                  value={emergencyData.currentEmergencyFund}
                  onChange={(e) => setEmergencyData(prev => ({ ...prev, currentEmergencyFund: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6 relative z-10">Emergency Fund Status</h3>
            <div className="space-y-6 relative z-10">
              <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Target Emergency Fund</h4>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{formatCurrency(emergencyCalculations.targetAmount)}</p>
                <p className="text-sm text-gray-500 mt-1">{emergencyData.targetMonths} months coverage</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-600">Progress</h5>
                    <span className="text-sm font-bold text-gray-800">
                      {emergencyCalculations.progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(emergencyCalculations.progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Current Fund</h5>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(emergencyData.currentEmergencyFund)}</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                  <h5 className="text-sm font-medium text-gray-600">Amount Needed</h5>
                  <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{formatCurrency(emergencyCalculations.shortfall)}</p>
                </div>

                {/* Add Fund Button */}
                <button
                  onClick={() => setIsAddFundModalOpen(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Money to Emergency Fund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Fund Modal */}
      <AddFundModal
        isOpen={isAddFundModalOpen}
        onClose={() => setIsAddFundModalOpen(false)}
        onSubmit={handleAddToEmergencyFund}
      />
    </div>
  );
};