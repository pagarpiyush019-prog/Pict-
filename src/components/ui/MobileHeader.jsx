import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const MobileHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    const titles = {
      '/financial-dashboard': 'Dashboard',
      '/budget-planning': 'Budget',
      '/investment-portfolio': 'Investments',
      '/transaction-management': 'Transactions',
      '/reports': 'Reports',
      '/money-tracker': 'Money Tracker',
      '/savings': 'Savings',
      '/advisor': 'Advisor',
      '/paper-trading': 'Paper Trading',
      '/investment-quiz': 'Quiz',
      '/profile': 'Profile',
      '/more-menu': 'More',
    };
    return titles[location.pathname] || 'FinanceTracker';
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/user-login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <Icon name="DollarSign" size={18} color="white" />
          </div>
          <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <Icon name="Bell" size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold"
          >
            AS
          </button>
        </div>
      </div>

      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="absolute right-4 top-14 w-72 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-700">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
            </div>
            <div className="p-4 text-center text-slate-400 text-sm">
              No new notifications
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default MobileHeader;
