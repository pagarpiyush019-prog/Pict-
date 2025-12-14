import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

// AI categorization data - in production this would come from backend
const aiCategorizedIds = ['1', '3', '4', '6']; // IDs of transactions auto-categorized by AI
const aiConfidence = {
  '1': 94,
  '3': 87,
  '4': 92,
  '6': 89
};

const TransactionTable = ({ 
  transactions, 
  selectedTransactions, 
  onSelectionChange, 
  onSort, 
  sortConfig, 
  onEdit, 
  onDelete, 
  onSplit 
}) => {
  const [editingId, setEditingId] = useState(null);
  const [hoveredAiBadge, setHoveredAiBadge] = useState(null);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(transactions?.map(t => t?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectTransaction = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedTransactions, id]);
    } else {
      onSelectionChange(selectedTransactions?.filter(tid => tid !== id));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return "ArrowUpDown";
    return sortConfig?.direction === 'asc' ? "ArrowUp" : "ArrowDown";
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = Math.abs(amount)?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    
    return type === 'expense' ? `-${formattedAmount}` : `+${formattedAmount}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'failed': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'food': 'Utensils',
      'transportation': 'Car',
      'shopping': 'ShoppingBag',
      'entertainment': 'Film',
      'utilities': 'Zap',
      'healthcare': 'Heart',
      'income': 'TrendingUp',
      'investment': 'PieChart'
    };
    return icons?.[category] || 'DollarSign';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="w-10 p-3">
                <Checkbox
                  checked={selectedTransactions?.length === transactions?.length && transactions?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="w-24 text-left p-3">
                <button
                  onClick={() => onSort('date')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('date')} size={12} />
                </button>
              </th>
              <th className="text-left p-3">
                <button
                  onClick={() => onSort('description')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  <span>Description</span>
                  <Icon name={getSortIcon('description')} size={12} />
                </button>
              </th>
              <th className="w-32 text-left p-3">
                <button
                  onClick={() => onSort('category')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  <span>Category</span>
                  <Icon name={getSortIcon('category')} size={12} />
                </button>
              </th>
              <th className="w-28 text-left p-3">
                <button
                  onClick={() => onSort('account')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  <span>Account</span>
                  <Icon name={getSortIcon('account')} size={12} />
                </button>
              </th>
              <th className="w-24 text-right p-3">
                <button
                  onClick={() => onSort('amount')}
                  className="flex items-center justify-end gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 ml-auto"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={12} />
                </button>
              </th>
              <th className="w-20 text-center p-3">
                <span className="text-xs font-medium text-gray-500">Status</span>
              </th>
              <th className="w-20 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr key={transaction?.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-3">
                  <Checkbox
                    checked={selectedTransactions?.includes(transaction?.id)}
                    onChange={(e) => handleSelectTransaction(transaction?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-3 text-xs text-gray-600">
                  {new Date(transaction.date)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={getCategoryIcon(transaction?.category)} size={14} className="text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div 
                        className="text-sm font-medium text-gray-900 truncate"
                        title={transaction?.description}
                      >
                        {transaction?.description}
                      </div>
                      {transaction?.merchant && (
                        <div 
                          className="text-[10px] text-gray-400 truncate"
                          title={transaction?.merchant}
                        >
                          {transaction?.merchant}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 truncate max-w-[80px]">
                      {transaction?.category?.charAt(0)?.toUpperCase() + transaction?.category?.slice(1)}
                    </span>
                    {aiCategorizedIds.includes(transaction?.id) && (
                      <div className="relative">
                        <button
                          className="flex items-center justify-center w-4 h-4 rounded-full bg-violet-100 text-violet-600 hover:bg-violet-200 transition-colors"
                          onMouseEnter={() => setHoveredAiBadge(transaction?.id)}
                          onMouseLeave={() => setHoveredAiBadge(null)}
                        >
                          <Icon name="Sparkles" size={8} />
                        </button>
                        {hoveredAiBadge === transaction?.id && (
                          <div className="absolute left-0 top-full mt-1 z-50 px-2 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg whitespace-nowrap shadow-lg">
                            <div className="flex items-center gap-1">
                              <Icon name="Sparkles" size={10} className="text-violet-300" />
                              <span>AI suggested · {aiConfidence[transaction?.id]}%</span>
                            </div>
                            <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-xs text-gray-500 truncate block" title={transaction?.account}>
                    {transaction?.account?.replace(' Account', '')}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <span className={`text-sm font-semibold ${
                    transaction?.type === 'expense' ? 'text-red-500' : 'text-emerald-600'
                  }`}>
                    {formatAmount(transaction?.amount, transaction?.type)}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    transaction?.status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {transaction?.status === 'completed' ? 'Done' : 'Pending'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-0.5">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Icon name="Edit" size={14} />
                    </button>
                    <button
                      onClick={() => onSplit(transaction)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Split"
                    >
                      <Icon name="Split" size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(transaction?.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3 p-4">
        {transactions?.map((transaction) => (
          <div key={transaction?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedTransactions?.includes(transaction?.id)}
                  onChange={(e) => handleSelectTransaction(transaction?.id, e?.target?.checked)}
                />
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name={getCategoryIcon(transaction?.category)} size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{transaction?.description}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(transaction.date)?.toLocaleDateString('en-US')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-semibold ${
                  transaction?.type === 'expense' ? 'text-error' : 'text-success'
                }`}>
                  {formatAmount(transaction?.amount, transaction?.type)}
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                  {transaction?.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <span>{transaction?.category} • {transaction?.account}</span>
                {aiCategorizedIds.includes(transaction?.id) && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-medium">
                    <Icon name="Sparkles" size={10} />
                    <span>AI · {aiConfidence[transaction?.id]}%</span>
                  </span>
                )}
              </div>
              {transaction?.merchant && <span>{transaction?.merchant}</span>}
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                size="xs"
                iconName="Edit"
                onClick={() => onEdit(transaction)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="Split"
                onClick={() => onSplit(transaction)}
              >
                Split
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="Trash2"
                onClick={() => onDelete(transaction?.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {transactions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add a new transaction.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;