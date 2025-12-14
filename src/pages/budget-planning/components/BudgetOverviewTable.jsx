import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

// AI suggestions for problem categories (Student persona)
const aiSuggestions = {
  'Fest/Events': { type: 'over', suggestion: 'Cut by ₹250', action: 'Skip non-essential events this week' },
  'Commute/UPI Transport': { type: 'warning', suggestion: 'At risk', action: 'Consider metro pass for savings' },
  'Mobile & Internet': { type: 'warning', suggestion: 'Monitor closely', action: 'You have ₹1 left for 3 days' },
};

const BudgetOverviewTable = ({ budgets, onEditBudget, onDeleteBudget }) => {
  const [sortBy, setSortBy] = useState('category');
  const [sortOrder, setSortOrder] = useState('asc');

  const getProgressColor = (percentage) => {
    if (percentage <= 75) return 'bg-success';
    if (percentage <= 90) return 'bg-warning';
    return 'bg-error';
  };

  const getStatusColor = (percentage) => {
    if (percentage <= 75) return 'text-success';
    if (percentage <= 90) return 'text-warning';
    return 'text-error';
  };

  const sortedBudgets = [...budgets]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];
    
    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left p-3 font-medium text-gray-500 text-xs">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                >
                  <span>Category</span>
                  <Icon 
                    name={sortBy === 'category' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={12} 
                  />
                </button>
              </th>
              <th className="text-right p-3 font-medium text-gray-500 text-xs">
                <button
                  onClick={() => handleSort('allocated')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors ml-auto"
                >
                  <span>Budget</span>
                  <Icon 
                    name={sortBy === 'allocated' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={12} 
                  />
                </button>
              </th>
              <th className="text-right p-3 font-medium text-gray-500 text-xs">
                <button
                  onClick={() => handleSort('spent')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors ml-auto"
                >
                  <span>Spent</span>
                  <Icon 
                    name={sortBy === 'spent' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={12} 
                  />
                </button>
              </th>
              <th className="text-center p-3 font-medium text-gray-500 text-xs w-40">Progress</th>
              <th className="text-center p-3 font-medium text-gray-500 text-xs w-20">Status</th>
              <th className="w-16 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedBudgets?.map((budget) => {
              const percentage = (budget?.spent / budget?.allocated) * 100;
              const remaining = budget?.allocated - budget?.spent;
              const status = percentage <= 75 ? 'healthy' : percentage <= 90 ? 'warning' : 'over';
              const aiTip = aiSuggestions[budget?.category];
              
              return (
                <tr key={budget?.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                  aiTip?.type === 'over' ? 'bg-red-50/30' : aiTip?.type === 'warning' ? 'bg-amber-50/30' : ''
                }`}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'healthy' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 capitalize">{budget?.category}</span>
                        {aiTip && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Icon name="Sparkles" size={10} className="text-violet-500" />
                            <span className={`text-[10px] font-medium ${
                              aiTip.type === 'over' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                              {aiTip.type === 'over' ? 'Over Budget' : 'At Risk'} – AI suggests: {aiTip.suggestion}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right text-sm text-gray-600">
                    ₹{budget?.allocated?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-sm font-medium ${
                      status === 'healthy' ? 'text-emerald-600' : status === 'warning' ? 'text-amber-600' : 'text-red-500'
                    }`}>
                      ₹{budget?.spent?.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            status === 'healthy' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {percentage?.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                      status === 'healthy' ? 'bg-emerald-50 text-emerald-600' : 
                      status === 'warning' ? 'bg-amber-50 text-amber-600' : 
                      'bg-red-50 text-red-500'
                    }`}>
                      {status === 'healthy' ? 'On Track' : status === 'warning' ? 'Near Limit' : 'Over'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-0.5">
                      <button
                        onClick={() => onEditBudget(budget)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Icon name="Edit" size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteBudget(budget?.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 p-3">
        {sortedBudgets?.map((budget) => {
          const percentage = (budget?.spent / budget?.allocated) * 100;
          const remaining = budget?.allocated - budget?.spent;
          const status = percentage <= 75 ? 'healthy' : percentage <= 90 ? 'warning' : 'over';
          const aiTip = aiSuggestions[budget?.category];
          
          return (
            <div key={budget?.id} className={`rounded-lg p-3 space-y-2 ${
              aiTip?.type === 'over' ? 'bg-red-50' : aiTip?.type === 'warning' ? 'bg-amber-50' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'healthy' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">{budget?.category}</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium ${
                    status === 'healthy' ? 'bg-emerald-100 text-emerald-600' : 
                    status === 'warning' ? 'bg-amber-100 text-amber-600' : 
                    'bg-red-100 text-red-500'
                  }`}>
                    {status === 'healthy' ? 'On Track' : status === 'warning' ? 'Near' : 'Over'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditBudget(budget)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Icon name="Edit" size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteBudget(budget?.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
              
              {aiTip && (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${
                  aiTip.type === 'over' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                  <Icon name="Sparkles" size={10} className="text-violet-500" />
                  <span className={`text-[10px] font-medium ${
                    aiTip.type === 'over' ? 'text-red-700' : 'text-amber-700'
                  }`}>
                    AI: {aiTip.suggestion} – {aiTip.action}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Budget: ₹{budget?.allocated?.toLocaleString('en-IN')}</span>
                <span className={`font-medium ${
                  status === 'healthy' ? 'text-emerald-600' : status === 'warning' ? 'text-amber-600' : 'text-red-500'
                }`}>
                  ₹{budget?.spent?.toLocaleString('en-IN')} spent
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      status === 'healthy' ? 'bg-emerald-500' : status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-500">{percentage?.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetOverviewTable;