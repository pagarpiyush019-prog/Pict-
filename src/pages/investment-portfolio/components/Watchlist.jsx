import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const Watchlist = ({ watchlistData, setWatchlistData }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

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

  const handleAddToWatchlist = async () => {
    if (newSymbol?.trim()) {
      try {
        const res = await fetch('http://localhost:5000/watchlist/1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol: newSymbol }),
        });
        const newStock = await res.json();
        
        // Optimistic update
        const optimisticWatchlist = [...watchlistData, newStock];
        setWatchlistData(optimisticWatchlist);

        setNewSymbol('');
        setShowAddForm(false);
      } catch (error) {
        console.error("Error adding to watchlist:", error);
      }
    }
  };

  const handleRemoveFromWatchlist = async (symbol) => {
    try {
      // Optimistic update
      const optimisticWatchlist = watchlistData.filter(stock => stock.symbol !== symbol);
      setWatchlistData(optimisticWatchlist);

      await fetch(`http://localhost:5000/watchlist/1/${symbol}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      // Revert optimistic update if API call fails
      setWatchlistData(watchlistData);
    }
  };

  const handleSetAlert = (symbol) => {
    // In a real app, this would open an alert configuration modal
    console.log('Setting alert for:', symbol);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Watchlist</h2>
        <Button 
          variant="outline" 
          size="sm" 
          iconName="Plus"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Add Stock
        </Button>
      </div>
      {/* Add Stock Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e?.target?.value?.toUpperCase())}
                className="mb-0"
              />
            </div>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleAddToWatchlist}
              disabled={!newSymbol?.trim()}
            >
              Add
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              iconName="X"
              onClick={() => {
                setShowAddForm(false);
                setNewSymbol('');
              }}
            />
          </div>
        </div>
      )}
      {/* Watchlist Items */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {watchlistData?.map((stock) => (
          <div key={stock?.symbol} className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div>
                    <p className="font-medium text-foreground">{stock?.symbol}</p>
                    <p className="text-sm text-muted-foreground">{stock?.name}</p>
                  </div>
                  {stock?.hasAlert && (
                    <div className="flex items-center space-x-1 text-warning">
                      <Icon name="Bell" size={14} />
                      <span className="text-xs">Alert Set</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {formatCurrency(stock?.currentPrice)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={stock?.changePercentage >= 0 ? "TrendingUp" : "TrendingDown"} 
                        size={16} 
                        className={stock?.changePercentage >= 0 ? "text-success" : "text-error"}
                      />
                      <span className={`text-sm font-medium ${stock?.changePercentage >= 0 ? "text-success" : "text-error"}`}>
                        {formatCurrency(Math.abs(stock?.changeAmount))}
                      </span>
                      <span className={`text-sm ${stock?.changePercentage >= 0 ? "text-success" : "text-error"}`}>
                        ({formatPercentage(stock?.changePercentage)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      iconName="Bell"
                      onClick={() => handleSetAlert(stock?.symbol)}
                      className={stock?.hasAlert ? "text-warning" : ""}
                      title="Set price alert"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      iconName="TrendingUp"
                      onClick={() => window.location.href = `/investment-research?symbol=${stock?.symbol}`}
                      title="View research"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      iconName="Trash2"
                      onClick={() => handleRemoveFromWatchlist(stock?.symbol)}
                      className="text-error hover:text-error"
                      title="Remove from watchlist"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Price Target and Alert Info */}
            {stock?.priceTarget && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price Target:</span>
                  <span className="font-medium text-foreground">{formatCurrency(stock?.priceTarget)}</span>
                </div>
                {stock?.alertPrice && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Alert Price:</span>
                    <span className="font-medium text-warning">{formatCurrency(stock?.alertPrice)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {watchlistData?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Your watchlist is empty</p>
          <p className="text-sm text-muted-foreground">Add stocks to track their performance and set price alerts</p>
        </div>
      )}
    </div>
  );
};

export default Watchlist;