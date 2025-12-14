import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useSidebar } from '../../context/SidebarContext';
import { getUserRole } from '../../utils/roleFilter';

const MainNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const userRole = getUserRole();

  const allNavigationItems = [
    {
      label: 'Dashboard',
      path: '/financial-dashboard',
      icon: 'Home',
      description: 'Financial overview and metrics',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Paper Trading',
      path: '/paper-trading',
      icon: 'PlayCircle',
      description: 'Practice trading with virtual money',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Investment Quiz',
      path: '/investment-quiz',
      icon: 'Brain',
      description: 'Test your investment knowledge',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Transactions',
      path: '/transaction-management',
      icon: 'List',
      description: 'Track and categorize expenses',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Budget',
      path: '/budget-planning',
      icon: 'Target',
      description: 'Plan and monitor budgets',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Investments',
      path: '/investment-portfolio',
      icon: 'TrendingUp',
      description: 'Portfolio tracking and analysis',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: 'BarChart',
      description: 'Generate financial reports',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Money Tracker',
      path: '/money-tracker',
      icon: 'CreditCard',
      description: 'Track and manage all your money',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Savings',
      path: '/savings',
      icon: 'PiggyBank',
      description: 'Monitor your savings goals',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Advisor',
      path: '/advisor',
      icon: 'UserCheck',
      description: 'Get advice from your financial advisor',
      roles: ['normal_user', 'advisor']
    },
    {
      label: 'Advisor Dashboard',
      path: '/advisor-dashboard',
      icon: 'Users',
      description: 'Manage clients and advisor tools',
      roles: ['advisor']
    },
  ];

  // Filter navigation items based on user role
  const navigationItems = useMemo(() => {
    return allNavigationItems.filter(item => item.roles.includes(userRole));
  }, [userRole]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location?.pathname === path;

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav
        className={`hidden md:flex flex-col fixed top-0 left-0 h-full z-40 bg-card border-r border-border transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-border">
          <button 
            onClick={() => handleNavigation('/financial-dashboard')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="white" />
            </div>
            {isSidebarOpen && <span className="text-xl font-semibold text-foreground">FinanceTracker</span>}
          </button>
        </div>
        <div className={`px-4 ${!isSidebarOpen && 'px-2'}`}>
          <div className="flex flex-col space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`group flex items-center space-x-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isSidebarOpen ? 'px-4' : 'px-2 justify-center'
                } ${
                  isActive(item?.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                }`}
                title={isSidebarOpen ? item?.description : item.label}
              >
                <Icon
                  name={item?.icon}
                  size={18}
                  className={`transition-colors duration-200 ${
                    isActive(item?.path) ? 'text-primary' : 'text-current'
                  }`}
                />
                {isSidebarOpen && <span>{item?.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="grid grid-cols-5 overflow-x-auto">
          {navigationItems?.slice(0, 5).map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-colors duration-200 min-w-[70px] ${
                isActive(item?.path)
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                name={item?.icon}
                size={20}
                className={`mb-1 transition-colors duration-200 ${
                  isActive(item?.path) ? 'text-primary' : 'text-current'
                }`}
              />
              <span className="text-xs font-medium text-center leading-tight">{item?.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 border-t border-border">
          {navigationItems?.slice(5).map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-colors duration-200 ${
                isActive(item?.path)
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon
                name={item?.icon}
                size={20}
                className={`mb-1 transition-colors duration-200 ${
                  isActive(item?.path) ? 'text-primary' : 'text-current'
                }`}
              />
              <span className="text-xs font-medium text-center leading-tight">{item?.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;