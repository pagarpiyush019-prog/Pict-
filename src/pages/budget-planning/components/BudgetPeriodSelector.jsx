import React from 'react';
import Icon from '../../../components/AppIcon';


const BudgetPeriodSelector = ({ currentPeriod, onPeriodChange, periodData }) => {
  const periods = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'yearly', label: 'Yearly' }
  ];

  const getCurrentPeriodInfo = () => {
    const now = new Date();
    switch (currentPeriod) {
      case 'monthly':
        return {
          title: now?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        };
      case 'quarterly':
        const quarter = Math.floor(now?.getMonth() / 3) + 1;
        return {
          title: `Q${quarter} ${now?.getFullYear()}`,
        };
      case 'yearly':
        return {
          title: now?.getFullYear()?.toString(),
        };
      default:
        return { title: '' };
    }
  };

  const periodInfo = getCurrentPeriodInfo();

  const navigatePeriod = (direction) => {
    console.log(`Navigate ${direction} for ${currentPeriod} period`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Period Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {periods?.map((period) => (
            <button
              key={period?.id}
              onClick={() => onPeriodChange(period?.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentPeriod === period?.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {period?.label}
            </button>
          ))}
        </div>

        {/* Period Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigatePeriod('previous')}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ChevronLeft" size={16} />
          </button>
          
          <span className="text-sm font-medium text-gray-900 min-w-[80px] text-center">
            {periodInfo?.title}
          </span>
          
          <button
            onClick={() => navigatePeriod('next')}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetPeriodSelector;