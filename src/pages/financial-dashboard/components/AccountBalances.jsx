import React from 'react';
import Icon from '../../../components/AppIcon';

const AccountBalances = ({ accounts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })?.format(amount);
  };

  const getAccountIcon = (type) => {
    const iconMap = {
      'checking': 'CreditCard',
      'savings': 'PiggyBank',
      'investment': 'TrendingUp',
      'credit': 'CreditCard'
    };
    return iconMap?.[type] || 'Wallet';
  };

  const getAccountColor = (type) => {
    const colorMap = {
      'checking': 'bg-blue-500',
      'savings': 'bg-green-500',
      'investment': 'bg-purple-500',
      'credit': 'bg-orange-500'
    };
    return colorMap?.[type] || 'bg-gray-500';
  };

  const getSyncStatus = (lastSync) => {
    const now = new Date();
    const syncTime = new Date(lastSync);
    const diffMinutes = Math.floor((now - syncTime) / (1000 * 60));
    
    if (diffMinutes < 5) {
      return { status: 'synced', text: 'Just now', color: 'text-success' };
    } else if (diffMinutes < 60) {
      return { status: 'recent', text: `${diffMinutes}m ago`, color: 'text-warning' };
    } else {
      return { status: 'stale', text: 'Sync needed', color: 'text-error' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Account Balances</h3>
        <button className="text-primary hover:text-primary/80 transition-colors duration-200">
          <Icon name="RefreshCw" size={16} />
        </button>
      </div>
      <div className="space-y-4">
        {accounts?.map((account) => {
          const syncStatus = getSyncStatus(account?.lastSync);
          
          return (
            <div key={account?.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition-colors duration-200">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAccountColor(account?.type)}`}>
                <Icon name={getAccountIcon(account?.type)} size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {account?.name}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(account?.balance)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    ••••{account?.accountNumber?.slice(-4)}
                  </p>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      syncStatus?.status === 'synced' ? 'bg-success' :
                      syncStatus?.status === 'recent' ? 'bg-warning' : 'bg-error'
                    }`} />
                    <p className={`text-xs ${syncStatus?.color}`}>
                      {syncStatus?.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {accounts?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Wallet" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No accounts connected</p>
        </div>
      )}
    </div>
  );
};

export default AccountBalances;