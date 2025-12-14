import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');

  const categoryOptions = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'income', label: 'Income' },
    { value: 'investment', label: 'Investment' }
  ];

  const handleBulkCategorize = (category) => {
    onBulkAction('categorize', { category });
    setShowCategoryDropdown(false);
    setBulkCategory('');
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} transactions? This action cannot be undone.`)) {
      onBulkAction('delete');
    }
  };

  const handleBulkExport = () => {
    onBulkAction('export');
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-indigo-600 rounded-xl p-3 mb-4 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={14} />
            </div>
            <span className="text-sm font-medium">
              {selectedCount} selected
            </span>
          </div>
          
          <button
            onClick={onClearSelection}
            className="text-xs text-indigo-200 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Categorize */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-white rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Icon name="Tag" size={14} />
              <span>Categorize</span>
              <Icon name="ChevronDown" size={12} />
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleBulkCategorize(cat.value)}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mark as Reimbursed */}
          <button
            onClick={() => onBulkAction('markReimbursed')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Icon name="Receipt" size={14} />
            <span>Mark Reimbursed</span>
          </button>

          {/* Export */}
          <button
            onClick={handleBulkExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Icon name="Download" size={14} />
            <span>Export</span>
          </button>

          {/* More Actions */}
          <div className="h-4 w-px bg-white/30 mx-1"></div>
          
          <button
            onClick={() => onBulkAction('markCompleted')}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors"
            title="Mark as Completed"
          >
            <Icon name="Check" size={14} />
          </button>
          
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-red-300 hover:text-red-200 transition-colors"
            title="Delete Selected"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;