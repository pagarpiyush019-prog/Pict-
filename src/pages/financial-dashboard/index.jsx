import React, { useState, useEffect } from 'react';
import DashboardQuickActions from '../../components/ui/DashboardQuickActions';
import Icon from '../../components/AppIcon';

import CashFlowChart from './components/CashFlowChart';
import RecentTransactions from './components/RecentTransactions';
import AccountBalances from './components/AccountBalances';
import NotificationPanel from './components/NotificationPanel';
import TimePeriodSelector from './components/TimePeriodSelector';
import RoleDashboardWidgets from './components/RoleDashboardWidgets';
import PortfolioManagement from './components/PortfolioManagement';
import { getUserRole, hasFeatureAccess, ROLES, getRoleDashboardWidgets } from '../../utils/roleFilter';

const FinancialDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [notifications, setNotifications] = useState([]);
  const [aiRebalanceToast, setAiRebalanceToast] = useState(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('F');
  const [selectedMonth, setSelectedMonth] = useState('December 2025');

  // Get user name and initial from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || localStorage.getItem('fullName') || 'User';
    setUserName(storedName);
    setUserInitial(storedName.charAt(0).toUpperCase());
  }, []);

  // Listen for AI rebalance completion from portfolio page
  useEffect(() => {
    const handleAiRebalance = (event) => {
      setAiRebalanceToast(event.detail);
      setTimeout(() => setAiRebalanceToast(null), 10000);
    };

    window.addEventListener('aiRebalanceComplete', handleAiRebalance);

    // Check localStorage for recent AI notification on page load
    const stored = localStorage.getItem('aiRebalanceNotification');
    if (stored) {
      const notification = JSON.parse(stored);
      if (notification.isNew) {
        setAiRebalanceToast(notification);
        localStorage.removeItem('aiRebalanceNotification');
        setTimeout(() => setAiRebalanceToast(null), 10000);
      }
    }

    return () => window.removeEventListener('aiRebalanceComplete', handleAiRebalance);
  }, []);

  // Mock data for cash flow chart
  const cashFlowData = [
    { period: 'Jan', income: 8200, expenses: 5100 },
    { period: 'Feb', income: 8500, expenses: 5300 },
    { period: 'Mar', income: 8300, expenses: 4900 },
    { period: 'Apr', income: 8700, expenses: 5400 },
    { period: 'May', income: 8400, expenses: 5200 },
    { period: 'Jun', income: 8600, expenses: 5100 },
    { period: 'Jul', income: 8500, expenses: 5240 }
  ];

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      description: 'Salary Deposit - Tech Corp',
      amount: 8500,
      category: 'Income',
      date: '2025-11-15T10:00:00Z'
    },
    {
      id: 2,
      description: 'Grocery Store - Whole Foods',
      amount: -127.45,
      category: 'Food & Dining',
      date: '2025-11-14T18:30:00Z'
    },
    {
      id: 3,
      description: 'Gas Station - Shell',
      amount: -45.20,
      category: 'Transportation',
      date: '2025-11-14T08:15:00Z'
    },
    {
      id: 4,
      description: 'Netflix Subscription',
      amount: -15.99,
      category: 'Entertainment',
      date: '2025-11-13T12:00:00Z'
    },
    {
      id: 5,
      description: 'Investment Transfer - Vanguard',
      amount: -1000,
      category: 'Investment',
      date: '2025-11-12T14:20:00Z'
    }
  ];

  // Mock data for account balances
  const accountBalances = [
    {
      id: 1,
      name: 'Chase Checking',
      type: 'checking',
      balance: 12450.75,
      accountNumber: '1234567890',
      lastSync: '2025-11-17T16:15:00Z'
    },
    {
      id: 2,
      name: 'Chase Savings',
      type: 'savings',
      balance: 25800.00,
      accountNumber: '0987654321',
      lastSync: '2025-11-17T16:10:00Z'
    },
    {
      id: 3,
      name: 'Vanguard 401k',
      type: 'investment',
      balance: 89200.50,
      accountNumber: '5555666677',
      lastSync: '2025-11-17T15:45:00Z'
    },
    {
      id: 4,
      name: 'Chase Freedom Card',
      type: 'credit',
      balance: -1240.30,
      accountNumber: '4444333322',
      lastSync: '2025-11-17T16:12:00Z'
    }
  ];

  // Initialize notifications
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'bill_reminder',
        priority: 'high',
        title: 'Credit Card Payment Due',
        message: `Your Chase Freedom card payment of $1,240.30 is due in 3 days. Set up autopay to avoid late fees and maintain your credit score.`,
        timestamp: '2025-11-17T14:30:00Z',
        actionRequired: true,
        actionButton: {
          text: 'Pay Now',
          onClick: () => window.location.href = '/transaction-management?action=pay-bill'
        }
      },
      {
        id: 2,
        type: 'goal_milestone',
        priority: 'medium',
        title: 'Emergency Fund Goal Achieved!',
        message: `Congratulations! You've reached your emergency fund goal of $25,000. Consider increasing your investment contributions or setting a new savings target.`,
        timestamp: '2025-11-17T12:15:00Z',
        actionRequired: false,
        actionButton: {
          text: 'View Goals',
          onClick: () => window.location.href = '/budget-planning?tab=goals'
        }
      },
      {
        id: 3,
        type: 'budget_overage',
        priority: 'medium',
        title: 'Dining Budget Alert',
        message: `You've spent $420 on dining this month, which is 105% of your $400 budget. Consider cooking more meals at home to stay on track.`,
        timestamp: '2025-11-17T10:45:00Z',
        actionRequired: false
      },
      {
        id: 4,
        type: 'investment_alert',
        priority: 'low',
        title: 'Portfolio Rebalancing Suggested',
        message: `Your portfolio allocation has drifted from your target. Consider rebalancing to maintain your desired risk level and investment strategy.`,
        timestamp: '2025-11-16T16:20:00Z',
        actionRequired: false,
        actionButton: {
          text: 'View Portfolio',
          onClick: () => window.location.href = '/investment-portfolio'
        }
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // In a real app, this would trigger data refetch
  };

  const handleViewAllTransactions = () => {
    window.location.href = '/transaction-management';
  };

  const handleViewAllNotifications = () => {
    // In a real app, this would navigate to a notifications page
    console.log('View all notifications');
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  const userRole = getUserRole();
  const widgets = getRoleDashboardWidgets();

  // Calculate totals for key overview
  const totalBalance = accountBalances.reduce((acc, account) => acc + account.balance, 0);
  const monthlyIncome = 8500;
  const monthlyExpenses = 5240;
  const monthlySurplus = monthlyIncome - monthlyExpenses;

  // Get role info for styling
  const getRoleInfo = (role) => {
    const roleMap = {
      [ROLES?.STUDENT]: { icon: 'GraduationCap', color: 'text-blue-600', bg: 'bg-blue-50', label: 'Student' },
      [ROLES?.GIG_WORKER]: { icon: 'Car', color: 'text-green-600', bg: 'bg-green-50', label: 'Gig Worker' },
      [ROLES?.PROFESSIONAL]: { icon: 'Briefcase', color: 'text-purple-600', bg: 'bg-purple-50', label: 'Professional' },
      [ROLES?.ENTREPRENEUR]: { icon: 'Building', color: 'text-orange-600', bg: 'bg-orange-50', label: 'Entrepreneur' }
    };
    return roleMap?.[role] || { icon: 'User', color: 'text-gray-600', bg: 'bg-gray-50', label: 'User' };
  };

  const roleInfo = getRoleInfo(userRole);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Banner */}
      <div className="px-4 py-3 text-center" style={{ backgroundColor: '#9277DC' }}>
        <p className="text-white text-sm md:text-base font-medium">
          🎉 1 Days of Empowering Financial Growth
        </p>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-4 pb-24">
        {/* Greeting Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.href = '/profile'}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl hover:shadow-lg transition-shadow"
            >
              {userInitial}
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Hi, {userName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFamilyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              <Icon name="Users" size={16} />
              Family
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Icon name="Check" size={20} className="text-green-600" />
            </button>
            <button 
              onClick={() => setShowNotificationModal(true)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon name="Bell" size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl p-5 text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: '#9277DC' }}>
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
          </div>

          <div className="relative z-10">
            {/* Month Selector */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setShowMonthModal(true)}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 hover:bg-white/20 transition-colors"
              >
                <Icon name="Calendar" size={18} />
                <span className="text-sm font-semibold">{selectedMonth}</span>
                <Icon name="ChevronDown" size={14} />
              </button>
              <button className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon name="ArrowRight" size={18} />
              </button>
            </div>

            {/* Balance Info */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-white/70 text-xs mb-1">Current Balance</p>
                <p className="text-xl font-bold">₹{totalBalance.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-xs mb-1">Total Balance</p>
                <p className="text-xl font-bold">₹{totalBalance.toLocaleString()}</p>
              </div>
            </div>

            {/* Income & Expenses */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Income</p>
                  <p className="text-base font-bold text-gray-900">₹{monthlyIncome.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingDown" size={18} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Expenses</p>
                  <p className="text-base font-bold text-gray-900">₹{monthlyExpenses.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions / Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Icon name="Receipt" size={20} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Activity</h2>
            </div>
            <button 
              onClick={() => window.location.href = '/transaction-management'}
              className="flex items-center gap-1 px-3 py-1.5 text-purple-600 dark:text-purple-400 text-sm font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              View All
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                No Transaction Yet ?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Your recent transaction will appear here once you make one.
              </p>
              <button 
                onClick={() => window.location.href = '/transaction-management?action=add'}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <Icon name="Plus" size={18} />
                Add
              </button>
            </div>
            <div className="flex-shrink-0">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Document with lines */}
                <rect x="15" y="20" width="45" height="55" rx="4" fill="#E0F2F1" stroke="#4DB6AC" strokeWidth="2"/>
                <line x1="22" y1="30" x2="45" y2="30" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="38" x2="52" y2="38" stroke="#80CBC4" strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="46" x2="48" y2="46" stroke="#80CBC4" strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="54" x2="50" y2="54" stroke="#B2DFDB" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Arrow */}
                <g transform="translate(52, 15)">
                  <path d="M5 10 L15 10 L15 5 L25 12.5 L15 20 L15 15 L5 15 Z" fill="#EC407A"/>
                </g>
                
                {/* Clock */}
                <circle cx="70" cy="55" r="15" fill="#FFB74D"/>
                <circle cx="70" cy="55" r="12" fill="#FFF9C4"/>
                <line x1="70" y1="55" x2="70" y2="48" stroke="#F57C00" strokeWidth="2" strokeLinecap="round"/>
                <line x1="70" y1="55" x2="75" y2="58" stroke="#F57C00" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="70" cy="55" r="1.5" fill="#F57C00"/>
                
                {/* Green accent bar */}
                <rect x="20" y="63" width="35" height="4" rx="2" fill="#66BB6A"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Budget Overview</h2>
            </div>
            <button 
              onClick={() => window.location.href = '/budget-planning'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              style={{ color: '#9277DC' }}
            >
              <span className="text-gray-700 dark:text-gray-300">Add</span>
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: '#9277DC' }}>
                <Icon name="Plus" size={14} className="text-white" strokeWidth={3} />
              </div>
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Monthly Spending</h3>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Icon name="Edit" size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Updated in 1 hour ago</p>
            
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ₹ {monthlyExpenses.toFixed(2)} spent
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                of ₹{(monthlyIncome * 0.8).toLocaleString()}.00
              </p>
            </div>

            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((monthlyExpenses / (monthlyIncome * 0.8)) * 100, 100)}%`,
                  backgroundColor: '#9277DC'
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>0%</span>
              <span className="font-semibold" style={{ color: '#9277DC' }}>
                {((monthlyExpenses / (monthlyIncome * 0.8)) * 100).toFixed(1)}% Utilized
              </span>
              <span>100%</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Remaining Budget</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  ₹ {((monthlyIncome * 0.8) - monthlyExpenses).toLocaleString()}.00
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Budget Status</p>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                  Awesome! You're Managing Your Expenses Well
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Passbook Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📘</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Passbook</h2>
            </div>
            <button 
              onClick={() => window.location.href = '/transaction-management'}
              className="text-sm font-medium hover:underline"
              style={{ color: '#9277DC' }}
            >
              More <Icon name="ChevronRight" size={14} className="inline" />
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💵</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">Cash In Hand</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">•••• Cash</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Recent transaction</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">₹0.00</span>
                  <Icon name="TrendingUp" size={16} className="text-red-500" />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total balance</span>
                <span className="text-base font-bold text-gray-900 dark:text-white">₹0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Invite Modal */}
      {showFamilyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Family & Friends</h2>
                <button 
                  onClick={() => setShowFamilyModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <Icon name="X" size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Family Financial Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage finances together with your family members. Share budgets, track expenses, and achieve goals as a team.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Invite via Email
                </label>
                <div className="flex gap-2">
                  <input 
                    type="email"
                    placeholder="friend@example.com"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                    Send
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or share link</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Invitation Link
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value="https://financeapp.com/invite/ABC123XYZ"
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('https://financeapp.com/invite/ABC123XYZ');
                      alert('Link copied to clipboard!');
                    }}
                    className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Icon name="Copy" size={18} />
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Current Members</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {userInitial}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Owner</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
                <button 
                  onClick={() => setShowNotificationModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <Icon name="X" size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Icon name="Bell" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Stay Updated</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your notification preferences to stay informed about important financial activities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction Alerts</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="DollarSign" size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Large Transactions</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Above ₹10,000</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="CreditCard" size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">All Transactions</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Every payment & deposit</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Budget & Goals</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="AlertCircle" size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Budget Overspending</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">When exceeding limits</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="Target" size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Goal Milestones</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Progress updates</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bills & Payments</h3>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Icon name="Calendar" size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Bill Reminders</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">3 days before due</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <button 
                onClick={() => setShowNotificationModal(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month Details Modal */}
      {showMonthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Overview</h2>
                <button 
                  onClick={() => setShowMonthModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                >
                  <Icon name="X" size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Month Selector */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Month</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025', 
                    'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025'].map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        setSelectedMonth(month);
                        setShowMonthModal(false);
                      }}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        selectedMonth === month
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {month.split(' ')[0].substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spending Overview */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Icon name="PieChart" size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Overview</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setShowMonthModal(false);
                      window.location.href = '/budget-planning';
                    }}
                    className="text-purple-600 dark:text-purple-400 text-sm font-semibold"
                  >
                    View Details
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{monthlyExpenses.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{(monthlyIncome * 0.8).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { category: 'Food & Dining', amount: 1840, color: 'bg-orange-500', icon: 'UtensilsCrossed' },
                    { category: 'Transportation', amount: 980, color: 'bg-blue-500', icon: 'Car' },
                    { category: 'Entertainment', amount: 720, color: 'bg-pink-500', icon: 'Film' },
                    { category: 'Shopping', amount: 1200, color: 'bg-green-500', icon: 'ShoppingBag' },
                    { category: 'Bills', amount: 500, color: 'bg-red-500', icon: 'Receipt' }
                  ].map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.category}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Icon name="Receipt" size={16} className="text-white" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setShowMonthModal(false);
                      window.location.href = '/transaction-management';
                    }}
                    className="text-purple-600 dark:text-purple-400 text-sm font-semibold"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-2">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.amount > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          <Icon 
                            name={transaction.amount > 0 ? 'ArrowDown' : 'ArrowUp'} 
                            size={18} 
                            className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'} 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{transaction.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Due and Reminders */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-red-200 dark:border-red-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <Icon name="AlertCircle" size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Due & Reminders</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="CreditCard" size={18} className="text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Credit Card Payment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chase Freedom - Due in 3 days</p>
                      <p className="text-lg font-bold text-red-600">₹1,240</p>
                    </div>
                    <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold">
                      Pay Now
                    </button>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Zap" size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Electricity Bill</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Due in 7 days</p>
                      <p className="text-lg font-bold text-orange-600">₹2,150</p>
                    </div>
                    <button className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-semibold">
                      Pay Now
                    </button>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Home" size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Rent Payment</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Due on Dec 25</p>
                      <p className="text-lg font-bold text-blue-600">₹15,000</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>

              {/* My Budget */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Icon name="Target" size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Budget</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setShowMonthModal(false);
                      window.location.href = '/budget-planning';
                    }}
                    className="text-green-600 dark:text-green-400 text-sm font-semibold"
                  >
                    Edit Budget
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Food & Dining', spent: 1840, budget: 2000, color: 'orange' },
                    { name: 'Transportation', spent: 980, budget: 1500, color: 'blue' },
                    { name: 'Entertainment', spent: 720, budget: 800, color: 'pink' },
                    { name: 'Shopping', spent: 1200, budget: 1000, color: 'red' }
                  ].map((item) => {
                    const percentage = (item.spent / item.budget) * 100;
                    const isOverBudget = percentage > 100;
                    return (
                      <div key={item.name} className="p-3 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</span>
                          <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                            ₹{item.spent} / ₹{item.budget}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOverBudget ? 'bg-red-500' : `bg-${item.color}-500`
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {percentage.toFixed(0)}% utilized
                          </span>
                          {isOverBudget && (
                            <span className="text-xs text-red-600 font-semibold">Over budget!</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Passbook */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <Icon name="Book" size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Passbook</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setShowMonthModal(false);
                      window.location.href = '/transaction-management';
                    }}
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Opening Balance</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Dec 1, 2025</p>
                    </div>
                    <p className="text-base font-bold text-gray-900 dark:text-white">₹120,000</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Income</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
                    </div>
                    <p className="text-base font-bold text-green-600">+₹{monthlyIncome.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Expenses</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
                    </div>
                    <p className="text-base font-bold text-red-600">-₹{monthlyExpenses.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl border-2 border-indigo-300 dark:border-indigo-600">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Current Balance</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">As of today</p>
                    </div>
                    <p className="text-lg font-bold text-indigo-600">₹{totalBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default FinancialDashboard;