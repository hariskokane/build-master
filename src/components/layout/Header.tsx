import React, { useState } from 'react';
import { Bell, Search, User, X, Calendar, AlertTriangle, CheckCircle, Info, DollarSign, ChevronDown, Menu } from 'lucide-react';
import { User as UserType, Notification } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ProfileModal } from '../profile/ProfileModal';

interface HeaderProps {
  user: UserType;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onUpdateProfile: (userData: Partial<UserType>) => void;
  onChangePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onUpdateProfile,
  onChangePassword,
  onMenuToggle
}) => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string, category: string) => {
    switch (category) {
      case 'budget':
        return <AlertTriangle className="w-4 h-4" />;
      case 'bill':
        return <Calendar className="w-4 h-4" />;
      case 'goal':
        return <CheckCircle className="w-4 h-4" />;
      case 'transaction':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'from-amber-100 to-orange-100 text-amber-800 border-amber-200';
      case 'error':
        return 'from-red-100 to-rose-100 text-red-800 border-red-200';
      case 'success':
        return 'from-emerald-100 to-green-100 text-emerald-800 border-emerald-200';
      default:
        return 'from-blue-100 to-cyan-100 text-blue-800 border-blue-200';
    }
  };

  const sortedNotifications = notifications.sort((a, b) => {
    // Unread first, then by date
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            {/* Search - hidden on mobile, shown on larger screens */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions, budgets..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 md:w-64 lg:w-80 bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNotificationPanelOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100 rounded-xl transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.monthlyIncome && (
                      <p className="text-xs text-gray-400 mt-1">Monthly Income: ₹{user.monthlyIncome.toLocaleString('en-IN')}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    View & Edit Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileDropdownOpen(false)}
        ></div>
      )}

      {/* Notification Panel */}
      {isNotificationPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50">
          <div className="bg-white w-full sm:w-96 h-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <p className="text-purple-100 text-sm">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </p>
                </div>
                <button
                  onClick={() => setIsNotificationPanelOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="mt-3 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {sortedNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications</h3>
                  <p className="text-gray-500 text-sm">You're all caught up! New notifications will appear here when you have transactions, budgets, or events.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sortedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getNotificationColor(notification.type)} border`}>
                          {getNotificationIcon(notification.type, notification.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium text-gray-800 ${!notification.read ? 'font-semibold' : ''}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getNotificationColor(notification.type)} border`}>
                              {notification.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateProfile={onUpdateProfile}
        onChangePassword={onChangePassword}
      />
    </>
  );
};
