import React, { useState, useMemo, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const Reports = () => {
  // Mock portfolio data - what user actually bought
  const [portfolioData, setPortfolioData] = useState({
    assets: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 10, avgPrice: 2450, currentPrice: 2580, value: 25800, change: 5.3, buyDate: '2024-08-15' },
      { symbol: 'INFY', name: 'Infosys Ltd', quantity: 20, avgPrice: 1450, currentPrice: 1520, value: 30400, change: 4.8, buyDate: '2024-09-10' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 15, avgPrice: 1650, currentPrice: 1720, value: 25800, change: 4.2, buyDate: '2024-07-20' },
      { symbol: 'TCS', name: 'TCS', quantity: 8, avgPrice: 3450, currentPrice: 3550, value: 28400, change: 2.9, buyDate: '2024-10-05' },
      { symbol: 'ICICIBANK', name: 'ICICI Bank', quantity: 12, avgPrice: 950, currentPrice: 985, value: 11820, change: 3.7, buyDate: '2024-09-25' },
      { symbol: 'SBIN', name: 'State Bank of India', quantity: 25, avgPrice: 650, currentPrice: 625, value: 15625, change: -3.8, buyDate: '2024-08-30' }
    ]
  });

  // Mock AI recommendations - what AI suggested
  const [aiRecommendations, setAiRecommendations] = useState([
    {
      id: 1,
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      recommendedPrice: 2450,
      recommendedDate: '2024-08-10',
      currentPrice: 2580,
      expectedReturn: 10.4,
      strength: 'strong',
      reason: 'Strong fundamentals, expanding digital and retail segments'
    },
    {
      id: 2,
      symbol: 'INFY',
      name: 'Infosys Ltd',
      recommendedPrice: 1480,
      recommendedDate: '2024-09-05',
      currentPrice: 1520,
      expectedReturn: 10.5,
      strength: 'strong',
      reason: 'Leading IT services company with strong client relationships'
    },
    {
      id: 3,
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      recommendedPrice: 1680,
      recommendedDate: '2024-07-15',
      currentPrice: 1720,
      expectedReturn: 10.4,
      strength: 'moderate',
      reason: 'Well-managed private sector bank with strong asset quality'
    },
    {
      id: 4,
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel',
      recommendedPrice: 1100,
      recommendedDate: '2024-09-20',
      currentPrice: 1125,
      expectedReturn: 8.5,
      strength: 'moderate',
      reason: 'Telecom sector growth and 5G expansion opportunities'
    },
    {
      id: 5,
      symbol: 'HINDUNILVR',
      name: 'Hindustan Unilever',
      recommendedPrice: 2400,
      recommendedDate: '2024-10-01',
      currentPrice: 2450,
      expectedReturn: 7.2,
      strength: 'moderate',
      reason: 'Stable FMCG company with consistent dividend payments'
    }
  ]);

  // Calculate total profit/loss
  const totalProfitLoss = useMemo(() => {
    return portfolioData.assets.reduce((total, asset) => {
      const investedAmount = asset.quantity * asset.avgPrice;
      const currentValue = asset.quantity * asset.currentPrice;
      return total + (currentValue - investedAmount);
    }, 0);
  }, [portfolioData]);

  // Calculate total invested
  const totalInvested = useMemo(() => {
    return portfolioData.assets.reduce((total, asset) => {
      return total + (asset.quantity * asset.avgPrice);
    }, 0);
  }, [portfolioData]);

  // Calculate total current value
  const totalCurrentValue = useMemo(() => {
    return portfolioData.assets.reduce((total, asset) => {
      return total + (asset.quantity * asset.currentPrice);
    }, 0);
  }, [portfolioData]);

  // Calculate profit/loss percentage
  const profitLossPercentage = useMemo(() => {
    return totalInvested > 0 ? ((totalProfitLoss / totalInvested) * 100).toFixed(2) : 0;
  }, [totalProfitLoss, totalInvested]);

  // Find best performing stock
  const bestPerformingStock = useMemo(() => {
    if (portfolioData.assets.length === 0) return null;
    return portfolioData.assets.reduce((best, current) => {
      const bestProfit = (best.currentPrice - best.avgPrice) / best.avgPrice * 100;
      const currentProfit = (current.currentPrice - current.avgPrice) / current.avgPrice * 100;
      return currentProfit > bestProfit ? current : best;
    });
  }, [portfolioData]);

  // Find worst performing stock
  const worstPerformingStock = useMemo(() => {
    if (portfolioData.assets.length === 0) return null;
    return portfolioData.assets.reduce((worst, current) => {
      const worstProfit = (worst.currentPrice - worst.avgPrice) / worst.avgPrice * 100;
      const currentProfit = (current.currentPrice - current.avgPrice) / current.avgPrice * 100;
      return currentProfit < worstProfit ? current : worst;
    });
  }, [portfolioData]);

  // Calculate performance metrics for 4th section
  const performanceMetrics = useMemo(() => {
    const totalReturn = profitLossPercentage;
    const bestReturn = bestPerformingStock 
      ? ((bestPerformingStock.currentPrice - bestPerformingStock.avgPrice) / bestPerformingStock.avgPrice * 100).toFixed(2)
      : 0;
    const worstReturn = worstPerformingStock
      ? ((worstPerformingStock.currentPrice - worstPerformingStock.avgPrice) / worstPerformingStock.avgPrice * 100).toFixed(2)
      : 0;
    const avgReturn = portfolioData.assets.length > 0
      ? (portfolioData.assets.reduce((sum, asset) => {
          return sum + ((asset.currentPrice - asset.avgPrice) / asset.avgPrice * 100);
        }, 0) / portfolioData.assets.length).toFixed(2)
      : 0;

    return {
      totalReturn: parseFloat(totalReturn),
      bestReturn: parseFloat(bestReturn),
      worstReturn: parseFloat(worstReturn),
      avgReturn: parseFloat(avgReturn),
      totalStocks: portfolioData.assets.length,
      winningStocks: portfolioData.assets.filter(asset => asset.currentPrice > asset.avgPrice).length,
      losingStocks: portfolioData.assets.filter(asset => asset.currentPrice < asset.avgPrice).length
    };
  }, [portfolioData, profitLossPercentage, bestPerformingStock, worstPerformingStock]);

  // Compare bought vs AI recommendations
  const comparisonData = useMemo(() => {
    const bought = portfolioData.assets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      type: 'bought',
      price: asset.avgPrice,
      currentPrice: asset.currentPrice,
      return: ((asset.currentPrice - asset.avgPrice) / asset.avgPrice * 100).toFixed(2),
      date: asset.buyDate
    }));

    const recommended = aiRecommendations.map(rec => ({
      symbol: rec.symbol,
      name: rec.name,
      type: 'recommended',
      price: rec.recommendedPrice,
      currentPrice: rec.currentPrice,
      return: ((rec.currentPrice - rec.recommendedPrice) / rec.recommendedPrice * 100).toFixed(2),
      date: rec.recommendedDate,
      strength: rec.strength,
      reason: rec.reason
    }));

    // Find matches (bought stocks that were also recommended)
    const matches = bought.filter(boughtStock => 
      recommended.some(rec => rec.symbol === boughtStock.symbol)
    ).map(boughtStock => {
      const rec = recommended.find(r => r.symbol === boughtStock.symbol);
      return {
        symbol: boughtStock.symbol,
        name: boughtStock.name,
        boughtPrice: boughtStock.price,
        recommendedPrice: rec.price,
        currentPrice: boughtStock.currentPrice,
        boughtReturn: parseFloat(boughtStock.return),
        recommendedReturn: parseFloat(rec.return),
        priceDifference: Math.abs(boughtStock.price - rec.price),
        dateDifference: Math.abs(new Date(boughtStock.date) - new Date(rec.date)) / (1000 * 60 * 60 * 24) // days
      };
    });

    // Find missed opportunities (recommended but not bought)
    const missed = recommended.filter(rec => 
      !bought.some(boughtStock => boughtStock.symbol === rec.symbol)
    );

    return {
      matches,
      missed,
      boughtOnly: bought.filter(boughtStock => 
        !recommended.some(rec => rec.symbol === boughtStock.symbol)
      )
    };
  }, [portfolioData, aiRecommendations]);

  // Chart data for profit/loss trend
  const profitLossChartData = useMemo(() => {
    return portfolioData.assets.map(asset => {
      const profitLoss = (asset.currentPrice - asset.avgPrice) * asset.quantity;
      const profitLossPercent = ((asset.currentPrice - asset.avgPrice) / asset.avgPrice * 100);
      return {
        name: asset.symbol,
        profitLoss: profitLoss,
        profitLossPercent: parseFloat(profitLossPercent.toFixed(2))
      };
    }).sort((a, b) => b.profitLoss - a.profitLoss);
  }, [portfolioData]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioData(prev => ({
        assets: prev.assets.map(asset => ({
          ...asset,
          currentPrice: asset.currentPrice * (1 + (Math.random() - 0.5) * 0.01), // ±0.5% variation
          value: asset.quantity * asset.currentPrice * (1 + (Math.random() - 0.5) * 0.01)
        }))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${parseFloat(value).toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-6 border-2 border-violet-100 dark:border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Icon name="BarChart" size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investment Performance Report</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Live Updates</span>
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Profit/Loss */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <Icon name="TrendingUp" size={28} className="text-white opacity-90" />
              <span className="text-xs font-semibold text-white bg-white/20 px-3 py-1 rounded-full">Total P&L</span>
            </div>
            <h2 className={`text-3xl font-bold text-white mb-1 ${totalProfitLoss >= 0 ? '' : ''}`}>
              {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
            </h2>
            <p className="text-sm text-white opacity-90">Unrealized gains/losses</p>
          </div>
        </div>

        {/* Card 2: Best Performing Stock */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <Icon name="Award" size={28} className="text-white opacity-90" />
              <span className="text-xs font-semibold text-white bg-white/20 px-3 py-1 rounded-full">Best Stock</span>
            </div>
            {bestPerformingStock ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-1">{bestPerformingStock.symbol}</h2>
                <p className="text-sm text-white opacity-90">
                  {formatPercentage(((bestPerformingStock.currentPrice - bestPerformingStock.avgPrice) / bestPerformingStock.avgPrice * 100))} return
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-1">N/A</h2>
                <p className="text-sm text-white opacity-90">No holdings</p>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Worst Performing Stock */}
        <div className="bg-gradient-to-br from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <Icon name="AlertTriangle" size={28} className="text-white opacity-90" />
              <span className="text-xs font-semibold text-white bg-white/20 px-3 py-1 rounded-full">Worst Stock</span>
            </div>
            {worstPerformingStock ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-1">{worstPerformingStock.symbol}</h2>
                <p className="text-sm text-white opacity-90">
                  {formatPercentage(((worstPerformingStock.currentPrice - worstPerformingStock.avgPrice) / worstPerformingStock.avgPrice * 100))} return
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-white mb-1">N/A</h2>
                <p className="text-sm text-white opacity-90">No holdings</p>
              </>
            )}
          </div>
        </div>

        {/* Card 4: Portfolio Performance */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <Icon name="PieChart" size={28} className="text-white opacity-90" />
              <span className="text-xs font-semibold text-white bg-white/20 px-3 py-1 rounded-full">Portfolio</span>
            </div>
            <h2 className={`text-3xl font-bold text-white mb-1`}>
              {formatPercentage(performanceMetrics.totalReturn)}
            </h2>
            <p className="text-sm text-white opacity-90">Total portfolio return</p>
          </div>
        </div>
      </div>

      {/* Detailed Profit/Loss Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profit/Loss by Stock</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitLossChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
              />
              <Bar dataKey="profitLoss" radius={[8, 8, 0, 0]}>
                {profitLossChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.profitLoss >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 5: Comparison - Bought vs AI Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Icon name="GitCompare" size={24} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Decisions vs AI Recommendations</h2>
          </div>

          {/* Matched Stocks (Bought & Recommended) */}
          {comparisonData.matches.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="CheckCircle" size={20} className="text-emerald-600 dark:text-emerald-400" />
                Stocks You Bought That AI Also Recommended ({comparisonData.matches.length})
              </h3>
              <div className="space-y-4">
                {comparisonData.matches.map((match, index) => (
                  <div key={index} className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{match.symbol}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{match.name}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          match.boughtReturn >= match.recommendedReturn 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {match.boughtReturn >= match.recommendedReturn ? 'Better Entry' : 'Could Be Better'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">You Bought At</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(match.boughtPrice)}</p>
                        <p className={`text-xs font-semibold ${match.boughtReturn >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatPercentage(match.boughtReturn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">AI Recommended At</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(match.recommendedPrice)}</p>
                        <p className={`text-xs font-semibold ${match.recommendedReturn >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatPercentage(match.recommendedReturn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price Difference</p>
                        <p className={`text-sm font-bold ${Math.abs(match.boughtPrice - match.recommendedPrice) < 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {formatCurrency(match.priceDifference)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(match.currentPrice)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missed Opportunities */}
          {comparisonData.missed.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="AlertCircle" size={20} className="text-amber-600 dark:text-amber-400" />
                Missed Opportunities - AI Recommended But You Didn't Buy ({comparisonData.missed.length})
              </h3>
              <div className="space-y-4">
                {comparisonData.missed.map((missed, index) => {
                  const returnValue = parseFloat(missed.return);
                  return (
                    <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{missed.symbol}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{missed.name}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            missed.strength === 'strong' 
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {missed.strength === 'strong' ? 'Strong Buy' : 'Moderate Buy'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">AI Recommended At</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(missed.price)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(missed.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Return If Bought</p>
                          <p className={`text-sm font-bold ${returnValue >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatPercentage(returnValue)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{missed.reason}"</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stocks Bought But Not Recommended */}
          {comparisonData.boughtOnly.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Icon name="Info" size={20} className="text-blue-600 dark:text-blue-400" />
                Stocks You Bought Without AI Recommendation ({comparisonData.boughtOnly.length})
              </h3>
              <div className="space-y-4">
                {comparisonData.boughtOnly.map((stock, index) => {
                  const returnValue = parseFloat(stock.return);
                  return (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{stock.symbol}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${returnValue >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatPercentage(returnValue)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bought At</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(stock.price)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(stock.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Return</p>
                          <p className={`text-sm font-bold ${returnValue >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatPercentage(returnValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
