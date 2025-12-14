import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const StockRecommendations = ({ recommendations, onBuyStock }) => {
  const [livePrices, setLivePrices] = useState({});
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live price updates
  useEffect(() => {
    const updatePrices = () => {
      const updatedPrices = {};
      recommendations.forEach(stock => {
        const basePrice = stock.currentPrice || 0;
        // Simulate price movement (±2% variation)
        const variation = (Math.random() - 0.5) * 0.04; // ±2%
        const newPrice = basePrice * (1 + variation);
        const change = newPrice - basePrice;
        const changePercent = (change / basePrice) * 100;

        updatedPrices[stock.symbol] = {
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          timestamp: new Date()
        };
      });
      setLivePrices(updatedPrices);
      setLastUpdate(new Date());
    };

    // Initial update
    updatePrices();

    // Update every 3 seconds for live feel
    const interval = setInterval(updatePrices, 3000);

    return () => clearInterval(interval);
  }, [recommendations]);
  const getRecommendationStrength = (strength) => {
    switch (strength) {
      case 'strong':
        return { 
          bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
          text: 'text-emerald-700 dark:text-emerald-400', 
          border: 'border-emerald-200 dark:border-emerald-800',
          badge: 'bg-emerald-600 text-white',
          icon: 'TrendingUp'
        };
      case 'moderate':
        return { 
          bg: 'bg-blue-50 dark:bg-blue-900/20', 
          text: 'text-blue-700 dark:text-blue-400', 
          border: 'border-blue-200 dark:border-blue-800',
          badge: 'bg-blue-600 text-white',
          icon: 'ArrowUp'
        };
      case 'weak':
        return { 
          bg: 'bg-amber-50 dark:bg-amber-900/20', 
          text: 'text-amber-700 dark:text-amber-400', 
          border: 'border-amber-200 dark:border-amber-800',
          badge: 'bg-amber-600 text-white',
          icon: 'Minus'
        };
      default:
        return { 
          bg: 'bg-gray-50 dark:bg-gray-700', 
          text: 'text-gray-700 dark:text-gray-300', 
          border: 'border-gray-200 dark:border-gray-600',
          badge: 'bg-gray-600 text-white',
          icon: 'Info'
        };
    }
  };

  const getRiskLevel = (risk) => {
    switch (risk) {
      case 'low':
        return { text: 'Low Risk', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' };
      case 'medium':
        return { text: 'Medium Risk', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' };
      case 'high':
        return { text: 'High Risk', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
      default:
        return { text: 'Medium Risk', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700' };
    }
  };

  return (
    <div className="p-6">
      {/* Header Info */}
      <div className="mb-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={16} className="text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">AI-Powered Stock Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-gray-600 dark:text-gray-400">
              Live • Updated {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Based on your risk profile, market trends, and portfolio diversification needs
        </p>
      </div>

      {/* Stock Recommendations List */}
      <div className="space-y-4">
        {recommendations?.map((stock) => {
          const strength = getRecommendationStrength(stock.strength);
          const risk = getRiskLevel(stock.riskLevel);
          
          // Use live price if available, otherwise use current price
          const liveData = livePrices[stock.symbol];
          const displayPrice = liveData?.price || stock.currentPrice;
          const priceChange = liveData?.change || 0;
          const priceChangePercent = liveData?.changePercent || 0;
          const isPriceUp = priceChange >= 0;
          
          const expectedReturn = stock.targetPrice && displayPrice 
            ? ((stock.targetPrice - displayPrice) / displayPrice * 100).toFixed(1)
            : stock.expectedReturn || 'N/A';

          return (
            <div 
              key={stock.id} 
              className={`p-5 rounded-xl border-2 ${strength.border} ${strength.bg} hover:shadow-lg transition-all`}
            >
              <div className="flex items-start gap-4">
                {/* Stock Icon/Logo */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${strength.bg} border-2 ${strength.border}`}>
                  <Icon name={strength.icon} size={24} className={strength.text} />
                </div>

                {/* Stock Details */}
                <div className="flex-1 min-w-0">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{stock.symbol}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${strength.badge} uppercase`}>
                          {stock.strength} Buy
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <p className={`text-lg font-bold transition-all duration-300 ${
                          isPriceUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          ₹{displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {liveData && (
                          <div className={`flex items-center gap-1 text-xs font-semibold ${
                            isPriceUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            <Icon name={isPriceUp ? "ArrowUp" : "ArrowDown"} size={12} />
                            <span>{Math.abs(priceChangePercent).toFixed(2)}%</span>
                          </div>
                        )}
                      </div>
                      {stock.targetPrice && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Target: ₹{stock.targetPrice.toLocaleString('en-IN')}</p>
                      )}
                      {liveData && (
                        <p className={`text-[10px] font-medium ${
                          isPriceUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {isPriceUp ? '+' : ''}₹{Math.abs(priceChange).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tags Row */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${risk.bg} ${risk.color}`}>
                      {risk.text}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {stock.sector || 'Technology'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                      {stock.marketCap || 'Large Cap'}
                    </span>
                  </div>

                  {/* Reason */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    <span className="font-semibold">Why buy:</span> {stock.reason}
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">Expected Return</p>
                      <p className={`text-sm font-bold transition-colors duration-300 ${
                        parseFloat(expectedReturn) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {parseFloat(expectedReturn) > 0 ? '+' : ''}{expectedReturn}%
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">52W High</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">₹{stock.yearHigh?.toLocaleString('en-IN') || 'N/A'}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">P/E Ratio</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{stock.peRatio || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onBuyStock && onBuyStock({ ...stock, currentPrice: displayPrice })}
                    className={`w-full px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r ${
                      stock.strength === 'strong' 
                        ? 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'
                        : stock.strength === 'moderate'
                        ? 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                        : 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                    } rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 relative overflow-hidden`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon name="ShoppingCart" size={16} />
                      Buy {stock.symbol} @ ₹{displayPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {liveData && (
                      <span className={`absolute inset-0 opacity-10 ${
                        isPriceUp ? 'bg-emerald-400' : 'bg-red-400'
                      } animate-pulse`}></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-2">
          <Icon name="AlertCircle" size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700 dark:text-amber-400">
            <span className="font-semibold">Disclaimer:</span> These recommendations are AI-generated based on market analysis. Always do your own research and consult with a financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockRecommendations;

