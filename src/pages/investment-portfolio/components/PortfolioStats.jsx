import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioStats = ({ totalValue, walletBalance, monthlyReturns, activeInvestments }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-indigo-100 dark:border-gray-700 shadow flex flex-col items-start">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="PieChart" size={20} className="text-indigo-600" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Portfolio Value</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalValue?.toLocaleString() || '-'}</div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-emerald-100 dark:border-gray-700 shadow flex flex-col items-start">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="Wallet" size={20} className="text-emerald-600" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Wallet Balance</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{walletBalance?.toLocaleString() || '-'}</div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-blue-100 dark:border-gray-700 shadow flex flex-col items-start">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="TrendingUp" size={20} className="text-blue-600" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Monthly Returns</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{monthlyReturns ? `${monthlyReturns}%` : '-'}</div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-amber-100 dark:border-gray-700 shadow flex flex-col items-start">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="Briefcase" size={20} className="text-amber-600" />
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Active Investments</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeInvestments || '-'}</div>
    </div>
  </div>
);

export default PortfolioStats;
