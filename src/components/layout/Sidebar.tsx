import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  PiggyBank, 
  Target, 
  BarChart3, 
  LogOut,
  Calendar,
  Calculator,
  Users,
  Menu,
  X,
  // Add more icon options for logo
  Wallet,
  TrendingUp,
  DollarSign,
  Coins,
  Banknote,
  CreditCard as Card,
  Landmark,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
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
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout, isOpen, onToggle }) => {
  // You can change the logo icon here - try any of these options:
  const LogoIcon = PiggyBank; // Current logo
  // const LogoIcon = Wallet;     // Alternative 1
  // const LogoIcon = TrendingUp;  // Alternative 2
  // const LogoIcon = DollarSign;  // Alternative 3
  // const LogoIcon = Coins;       // Alternative 4
  // const LogoIcon = Banknote;    // Alternative 5
  // const LogoIcon = Landmark;    // Alternative 6 (Bank building)
  // const LogoIcon = Building2;   // Alternative 7 (Modern building)

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 shadow-xl h-screen flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Mobile close button */}
        <button
          onClick={onToggle}
          className="lg:hidden absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
      <div className="p-6 border-b border-purple-700/30">
        <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
            <LogoIcon className="w-5 h-5 text-white" />
          </div>
          Budget Master
        </h1>
        <p className="text-xs text-purple-200 mt-1">Your Financial Companion</p>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
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
    </>
  );
};