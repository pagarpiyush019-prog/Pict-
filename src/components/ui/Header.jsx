import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useSidebar } from '../../context/SidebarContext';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleSidebar, isSidebarOpen } = useSidebar();

  const navigationItems = [
    { label: 'Dashboard', path: '/financial-dashboard', icon: 'Home' },
    { label: 'Transactions', path: '/transaction-management', icon: 'List' },
    { label: 'Budget', path: '/budget-planning', icon: 'Target' },
    { label: 'Investments', path: '/investment-portfolio', icon: 'TrendingUp' },
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/user-login';
  };

  return (
    <header className={`fixed top-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-20'}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo & Sidebar Toggle */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            iconName={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeftOpen'}
            onClick={toggleSidebar}
            className="hidden md:flex mr-4 hover:bg-slate-100 dark:hover:bg-slate-800"
          />
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200">
            <Icon name="Bell" size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-all duration-200">
                AS
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Arjun</span>
              <Icon name="ChevronDown" size={16} className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                {/* Profile Header */}
                <div className="px-4 py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      AS
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Arjun Sharma</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">arjun.sharma@email.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <Icon name="User" size={18} />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('/financial-dashboard')}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <Icon name="Settings" size={18} />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <Icon name="LogOut" size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 py-3 space-y-2">
            {/* Profile Section */}
            <div className="flex items-center gap-3 px-4 py-3 mb-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                AS
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Arjun Sharma</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">arjun.sharma@email.com</p>
              </div>
            </div>
            
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location?.pathname === item?.path
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon name={item?.icon} size={20} />
                <span>{item?.label}</span>
              </button>
            ))}
            
            <div className="border-t border-slate-200 dark:border-slate-700 my-3"></div>
            
            <button
              onClick={() => handleNavigation('/profile')}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <Icon name="User" size={20} />
              <span>My Profile</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            >
              <Icon name="LogOut" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;