import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvestmentsTable = ({ investments }) => {
  const [sortField, setSortField] = useState('symbol');
  const [sortDirection, setSortDirection] = useState('asc');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value?.toFixed(2)}%`;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedInvestments = [...investments]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return (
      <Icon 
        name={sortDirection === 'asc' ? "ArrowUp" : "ArrowDown"} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Holdings</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span>Live data</span>
            </div>
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">
                <button 
                  onClick={() => handleSort('symbol')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Symbol</span>
                  <SortIcon field="symbol" />
                </button>
              </th>
              <th className="text-left p-4">
                <button 
                  onClick={() => handleSort('shares')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Shares</span>
                  <SortIcon field="shares" />
                </button>
              </th>
              <th className="text-left p-4">
                <button 
                  onClick={() => handleSort('currentPrice')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Price</span>
                  <SortIcon field="currentPrice" />
                </button>
              </th>
              <th className="text-left p-4">
                <button 
                  onClick={() => handleSort('marketValue')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Market Value</span>
                  <SortIcon field="marketValue" />
                </button>
              </th>
              <th className="text-left p-4">
                <button 
                  onClick={() => handleSort('gainLoss')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Gain/Loss</span>
                  <SortIcon field="gainLoss" />
                </button>
              </th>
              <th className="text-left p-4">
                <button 
                  onClick={() => handleSort('changePercentage')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Change %</span>
                  <SortIcon field="changePercentage" />
                </button>
              </th>
              <th className="text-right p-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedInvestments?.map((investment) => (
              <tr key={investment?.id} className="border-b border-border hover:bg-muted/50">
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{investment?.symbol}</p>
                    <p className="text-sm text-muted-foreground">{investment?.name}</p>
                  </div>
                </td>
                <td className="p-4 text-foreground">{investment?.shares?.toLocaleString()}</td>
                <td className="p-4 text-foreground">{formatCurrency(investment?.currentPrice)}</td>
                <td className="p-4 text-foreground font-medium">{formatCurrency(investment?.marketValue)}</td>
                <td className="p-4">
                  <span className={investment?.gainLoss >= 0 ? "text-success" : "text-error"}>
                    {formatCurrency(Math.abs(investment?.gainLoss))}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={investment?.changePercentage >= 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      className={investment?.changePercentage >= 0 ? "text-success" : "text-error"}
                    />
                    <span className={investment?.changePercentage >= 0 ? "text-success" : "text-error"}>
                      {formatPercentage(investment?.changePercentage)}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden">
        {sortedInvestments?.map((investment) => (
          <div key={investment?.id} className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium text-foreground">{investment?.symbol}</p>
                <p className="text-sm text-muted-foreground">{investment?.name}</p>
              </div>
              <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Shares</p>
                <p className="font-medium text-foreground">{investment?.shares?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium text-foreground">{formatCurrency(investment?.currentPrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Market Value</p>
                <p className="font-medium text-foreground">{formatCurrency(investment?.marketValue)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Change</p>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={investment?.changePercentage >= 0 ? "TrendingUp" : "TrendingDown"} 
                    size={14} 
                    className={investment?.changePercentage >= 0 ? "text-success" : "text-error"}
                  />
                  <span className={investment?.changePercentage >= 0 ? "text-success" : "text-error"}>
                    {formatPercentage(investment?.changePercentage)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentsTable;