import React, { useState, useMemo } from 'react';
import Icon from '../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const MoneyTracker = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'HDFC Savings',
      type: 'savings',
      balance: 125000,
      accountNumber: '****1234',
      bank: 'HDFC Bank',
      lastSync: '2025-11-17T10:30:00Z',
      color: '#10B981'
    },
    {
      id: 2,
      name: 'SBI Current',
      type: 'checking',
      balance: 45000,
      accountNumber: '****5678',
      bank: 'State Bank of India',
      lastSync: '2025-11-17T09:15:00Z',
      color: '#6366F1'
    },
    {
      id: 3,
      name: 'ICICI Credit Card',
      type: 'credit',
      balance: -12500,
      accountNumber: '****9012',
      bank: 'ICICI Bank',
      lastSync: '2025-11-17T11:00:00Z',
      color: '#EF4444'
    },
    {
      id: 4,
      name: 'Cash',
      type: 'cash',
      balance: 5000,
      accountNumber: 'N/A',
      bank: 'Physical',
      lastSync: '2025-11-17T08:00:00Z',
      color: '#F59E0B'
    },
    {
      id: 5,
      name: 'Paytm Wallet',
      type: 'wallet',
      balance: 2500,
      accountNumber: '****3456',
      bank: 'Paytm',
      lastSync: '2025-11-17T12:00:00Z',
      color: '#8B5CF6'
    }
  ]);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Mock net worth history
  const netWorthHistory = [
    { month: 'May', value: 145000 },
    { month: 'Jun', value: 152000 },
    { month: 'Jul', value: 158000 },
    { month: 'Aug', value: 165000 },
    { month: 'Sep', value: 172000 },
    { month: 'Oct', value: 180000 },
    { month: 'Nov', value: 187000 }
  ];

  const netWorth = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  const totalAssets = useMemo(() => {
    return accounts.filter(acc => acc.balance >= 0).reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  const totalLiabilities = useMemo(() => {
    return Math.abs(accounts.filter(acc => acc.balance < 0).reduce((sum, acc) => sum + acc.balance, 0));
  }, [accounts]);

  const accountTypeIcons = {
    savings: 'PiggyBank',
    checking: 'Wallet',
    credit: 'CreditCard',
    cash: 'Banknote',
    wallet: 'Smartphone',
    investment: 'TrendingUp'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{payload[0].payload.month}</p>
          <p className="text-lg font-bold text-emerald-600">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  const handleAddAccount = () => {
    const newAccount = {
      id: Date.now(),
      name: 'New Account',
      type: 'savings',
      balance: 0,
      accountNumber: '****0000',
      bank: 'Bank Name',
      lastSync: new Date().toISOString(),
      color: '#6366F1'
    };
    setAccounts([...accounts, newAccount]);
    setShowAddAccount(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-6 border-2 border-indigo-100 dark:border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Icon name="CreditCard" size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Money Tracker</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track all accounts, balances, and net worth</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddAccount(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
        >
          <Icon name="Plus" size={16} />
          <span>Add Account</span>
        </button>
      </div>

      {/* Net Worth Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Icon name="TrendingUp" size={24} className="opacity-80" />
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Net Worth</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(netWorth)}</p>
          <p className="text-xs opacity-90 mt-1">Total assets - liabilities</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs opacity-90">+₹{(netWorth - netWorthHistory[netWorthHistory.length - 2]?.value || 0).toLocaleString('en-IN')} this month</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Wallet" size={24} className="opacity-80" />
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Total Assets</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalAssets)}</p>
          <p className="text-xs opacity-90 mt-1">All positive balances</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <Icon name="AlertCircle" size={24} className="opacity-80" />
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">Liabilities</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalLiabilities)}</p>
          <p className="text-xs opacity-90 mt-1">Credit cards & loans</p>
        </div>
      </div>

      {/* Net Worth Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Icon name="LineChart" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Net Worth Trend</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">7-month growth trajectory</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={netWorthHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Icon name="Layers" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Accounts</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{accounts.length} accounts connected</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                Synced
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                onClick={() => setSelectedAccount(account)}
                className={`relative overflow-hidden rounded-xl p-5 border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
                  account.balance >= 0
                    ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600'
                    : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: account.color + '20' }}
                    >
                      <Icon name={accountTypeIcons[account.type] || 'Wallet'} size={24} style={{ color: account.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{account.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{account.bank}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 uppercase">
                    {account.type}
                  </span>
                </div>

                <div className="mb-3">
                  <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(account.balance)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Account: {account.accountNumber}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Last synced</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatDate(account.lastSync)}</span>
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <Icon name={accountTypeIcons[account.type] || 'Wallet'} size={80} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-700 p-4 text-center">
          <Icon name="Wallet" size={20} className="text-indigo-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Savings Accounts</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {accounts.filter(a => a.type === 'savings').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-700 p-4 text-center">
          <Icon name="CreditCard" size={20} className="text-red-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Credit Cards</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {accounts.filter(a => a.type === 'credit').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-700 p-4 text-center">
          <Icon name="Smartphone" size={20} className="text-purple-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Digital Wallets</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {accounts.filter(a => a.type === 'wallet').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-700 p-4 text-center">
          <Icon name="Banknote" size={20} className="text-amber-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cash</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {accounts.filter(a => a.type === 'cash').length}
          </p>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New Account</h3>
              <button
                onClick={() => setShowAddAccount(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This is a demo. In production, this would connect to bank APIs or manual entry.
            </p>
            <button
              onClick={handleAddAccount}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Add Demo Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyTracker;
