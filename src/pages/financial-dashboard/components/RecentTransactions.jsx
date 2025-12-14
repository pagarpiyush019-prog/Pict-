import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactions = ({ transactions, onViewAll }) => {
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food & Dining': 'Utensils',
      'Transportation': 'Car',
      'Shopping': 'ShoppingBag',
      'Entertainment': 'Film',
      'Bills & Utilities': 'Receipt',
      'Healthcare': 'Heart',
      'Income': 'DollarSign',
      'Investment': 'TrendingUp',
      'Transfer': 'ArrowRightLeft',
      'Other': 'MoreHorizontal'
    };
    return iconMap?.[category] || 'MoreHorizontal';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Food & Dining': 'bg-orange-500',
      'Transportation': 'bg-blue-500',
      'Shopping': 'bg-purple-500',
      'Entertainment': 'bg-pink-500',
      'Bills & Utilities': 'bg-yellow-500',
      'Healthcare': 'bg-red-500',
      'Income': 'bg-green-500',
      'Investment': 'bg-indigo-500',
      'Transfer': 'bg-gray-500',
      'Other': 'bg-slate-500'
    };
    return colorMap?.[category] || 'bg-slate-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })?.format(Math.abs(amount));
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    })?.format(new Date(date));
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <Button variant="outline" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {transactions?.map((transaction) => (
          <div key={transaction?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition-colors duration-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(transaction?.category)}`}>
              <Icon name={getCategoryIcon(transaction?.category)} size={16} color="white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {transaction?.description}
                </p>
                <p className={`text-sm font-semibold ${
                  transaction?.amount > 0 ? 'text-success' : 'text-foreground'
                }`}>
                  {transaction?.amount > 0 ? '+' : '-'}{formatCurrency(transaction?.amount)}
                </p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">{transaction?.category}</p>
                <p className="text-xs text-muted-foreground">{formatDate(transaction?.date)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {transactions?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Receipt" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent transactions</p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;