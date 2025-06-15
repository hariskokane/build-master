import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  PiggyBank, 
  Target, 
  BarChart3, 
  Settings,
  LogOut,
  Calendar,
  Calculator,
  Users,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'savings', label: 'Savings Goals', icon: Target },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'planning', label: 'Financial Planning', icon: Calculator },
  { id: 'calendar', label: 'Financial Calendar', icon: Calendar },
  { id: 'consultants', label: 'Financial Consultants', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 shadow-xl h-screen flex flex-col z-40">
      
      {/* Logo and Title */}
      <div className="p-6 border-b border-purple-700/30 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex items-center justify-center mb-2">
          <img src="/logo.png" alt="Budget Master Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-xl font-bold text-white">Budget Master</h1>
        <p className="text-xs text-purple-200 mt-1">Your Financial Companion</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-purple-200 hover:bg-purple-800/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-700/30">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/30 hover:text-red-200 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
