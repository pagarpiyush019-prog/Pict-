import React from 'react';
import Icon from '../../../components/AppIcon';

const PortfolioSummary = ({ portfolioData }) => {
  const { totalBonds, totalMutualFunds, totalSIP } = portfolioData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const SummaryCard = ({ icon, title, value, gradient }) => (
    <div className={`relative overflow-hidden rounded-xl p-5 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${gradient}`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon name={icon} size={20} />
          </div>
          <span className="font-semibold uppercase tracking-wider">{title}</span>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(value)}</p>
      </div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20">
        <Icon name={icon} size={80} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SummaryCard icon="Landmark" title="Total Bonds" value={totalBonds} gradient="bg-gradient-to-br from-indigo-500 to-blue-600" />
        <SummaryCard icon="Library" title="Mutual Funds" value={totalMutualFunds} gradient="bg-gradient-to-br from-emerald-500 to-green-600" />
        <SummaryCard icon="Repeat" title="Total SIP" value={totalSIP} gradient="bg-gradient-to-br from-amber-500 to-yellow-600" />
      </div>
    </div>
  );
};

export default PortfolioSummary;