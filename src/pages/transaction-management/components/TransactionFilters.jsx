import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TransactionFilters = ({ onFiltersChange, totalTransactions, filteredCount }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    account: '',
    category: '',
    amountMin: '',
    amountMax: '',
    search: '',
    status: ''
  });

  const accountOptions = [
    { value: '', label: 'All Accounts' },
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'investment', label: 'Investment' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'income', label: 'Income' },
    { value: 'investment', label: 'Investment' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateFrom: '',
      dateTo: '',
      account: '',
      category: '',
      amountMin: '',
      amountMax: '',
      search: '',
      status: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');
  const advancedFiltersCount = [filters.category, filters.status, filters.amountMin, filters.amountMax].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
      {/* Primary Filters Row - Always visible */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Icon name="Calendar" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              className="pl-8 pr-2 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
            />
          </div>
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={filters?.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            className="px-2 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
          />
        </div>

        {/* Account Dropdown */}
        <select
          value={filters?.account}
          onChange={(e) => handleFilterChange('account', e?.target?.value)}
          className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px]"
        >
          {accountOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* More Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            showAdvanced || advancedFiltersCount > 0
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
          }`}
        >
          <Icon name="SlidersHorizontal" size={14} />
          <span>More</span>
          {advancedFiltersCount > 0 && (
            <span className="w-4 h-4 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center">
              {advancedFiltersCount}
            </span>
          )}
          <Icon name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} size={12} />
        </button>

        {/* Clear & Count */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Icon name="X" size={12} />
              Clear
            </button>
          )}
          <span className="text-[10px] text-gray-400 whitespace-nowrap">
            {filteredCount} of {totalTransactions}
          </span>
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Category */}
            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1 block">Category</label>
              <select
                value={filters?.category}
                onChange={(e) => handleFilterChange('category', e?.target?.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1 block">Status</label>
              <select
                value={filters?.status}
                onChange={(e) => handleFilterChange('status', e?.target?.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Min Amount */}
            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1 block">Min Amount</label>
              <input
                type="number"
                placeholder="$0"
                value={filters?.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Max Amount */}
            <div>
              <label className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-1 block">Max Amount</label>
              <input
                type="number"
                placeholder="$10,000"
                value={filters?.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(filters)?.map(([key, value]) => {
            if (!value) return null;
            
            let displayValue = value;
            let displayKey = key;
            if (key === 'account') {
              displayValue = accountOptions?.find(opt => opt?.value === value)?.label || value;
            } else if (key === 'category') {
              displayValue = categoryOptions?.find(opt => opt?.value === value)?.label || value;
            } else if (key === 'status') {
              displayValue = statusOptions?.find(opt => opt?.value === value)?.label || value;
            } else if (key === 'dateFrom') {
              displayKey = 'From';
            } else if (key === 'dateTo') {
              displayKey = 'To';
            } else if (key === 'amountMin') {
              displayKey = 'Min';
              displayValue = '$' + value;
            } else if (key === 'amountMax') {
              displayKey = 'Max';
              displayValue = '$' + value;
            } else if (key === 'search') {
              displayKey = '';
              displayValue = `"${value}"`;
            }

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium"
              >
                {displayKey && <span className="text-indigo-400">{displayKey}:</span>}
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="hover:bg-indigo-100 rounded-full p-0.5 transition-colors"
                >
                  <Icon name="X" size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;