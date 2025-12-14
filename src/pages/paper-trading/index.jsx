import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

const PaperTrading = () => {
  const [virtualBalance, setVirtualBalance] = useState(100000);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [tradingHistory, setTradingHistory] = useState([]);
  
  // TradingView-style features
  const [chartType, setChartType] = useState('candlestick');
  const [timeframe, setTimeframe] = useState('1m');
  const [showVolume, setShowVolume] = useState(true);
  const [theme, setTheme] = useState('light');
  const [leftPanelTab, setLeftPanelTab] = useState('watchlist');
  const [bottomPanelTab, setBottomPanelTab] = useState('positions');
  const [candlestickData, setCandlestickData] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [historyDateRange, setHistoryDateRange] = useState('today');

  // Tutorial System
  const [showTutorial, setShowTutorial] = useState(() => {
    const hasSeenTutorial = localStorage.getItem('paperTradingTutorialCompleted');
    return !hasSeenTutorial;
  });
  const [tutorialStep, setTutorialStep] = useState(0);
  const [beginnerMode, setBeginnerMode] = useState(() => {
    const savedMode = localStorage.getItem('paperTradingBeginnerMode');
    return savedMode !== 'false';
  });
  const [showHelpTooltips, setShowHelpTooltips] = useState(true);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showEducationPanel, setShowEducationPanel] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('paperTradingWelcome');
    return !hasSeenWelcome;
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const tutorialSteps = [
    {
      title: "Welcome to Paper Trading! 📈",
      content: "Learn to trade with virtual money (₹1,00,000). Practice without any real risk!",
      target: "welcome",
      action: "Let's start the tour"
    },
    {
      title: "Step 1: Choose a Stock 📊",
      content: "Click here to select a stock from the dropdown. Start with popular stocks like RELIANCE or TCS.",
      target: "stock-selector",
      action: "Next"
    },
    {
      title: "Step 2: View the Chart 📉",
      content: "This chart shows the stock's price movement. Green means price went up, red means down.",
      target: "chart-area",
      action: "Next"
    },
    {
      title: "Step 3: Place Your First Trade 💰",
      content: "Click the TRADE tab to buy or sell stocks. Start with buying 1 share to learn!",
      target: "trade-tab",
      action: "Next"
    },
    {
      title: "Step 4: Monitor Your Portfolio 📊",
      content: "After buying, check the POSITIONS tab to see your holdings and profit/loss.",
      target: "positions-tab",
      action: "Next"
    },
    {
      title: "You're Ready! 🎉",
      content: "Start trading! Remember: Green = Profit, Red = Loss. Practice makes perfect!",
      target: "complete",
      action: "Start Trading"
    }
  ];

  const tradingTips = [
    { icon: "TrendingUp", title: "Buy Low, Sell High", description: "The golden rule of trading - buy when price is low, sell when it's high." },
    { icon: "Shield", title: "Manage Risk", description: "Never invest all your money in one stock. Diversify your portfolio." },
    { icon: "Clock", title: "Be Patient", description: "Good trades take time. Don't panic if price drops temporarily." },
    { icon: "BarChart", title: "Read the Chart", description: "Green candles = price increased, Red candles = price decreased." },
    { icon: "Target", title: "Set Goals", description: "Decide your target profit and maximum loss before trading." },
    { icon: "BookOpen", title: "Learn Daily", description: "Practice every day to improve your trading skills." }
  ];

  const availableStocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2580.50, change: 45.20, changePercent: 1.78, volume: 12500000, high: 2595.30, low: 2540.20, open: 2545.80 },
    { symbol: 'INFY', name: 'Infosys Ltd', price: 1520.75, change: 23.50, changePercent: 1.57, volume: 8900000, high: 1535.20, low: 1498.30, open: 1500.00 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1720.30, change: -12.40, changePercent: -0.72, volume: 7800000, high: 1745.60, low: 1715.20, open: 1738.50 },
    { symbol: 'TCS', name: 'TCS', price: 3550.80, change: 28.90, changePercent: 0.82, volume: 4500000, high: 3565.40, low: 3520.10, open: 3525.60 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 985.60, change: 15.30, changePercent: 1.58, volume: 11200000, high: 992.30, low: 972.40, open: 975.20 },
    { symbol: 'SBIN', name: 'State Bank of India', price: 625.40, change: -8.20, changePercent: -1.29, volume: 15600000, high: 638.90, low: 623.10, open: 635.20 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1125.90, change: 18.70, changePercent: 1.69, volume: 6700000, high: 1132.50, low: 1110.40, open: 1112.30 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: 2450.20, change: 12.50, changePercent: 0.51, volume: 3200000, high: 2465.80, low: 2438.90, open: 2442.00 },
    { symbol: 'ITC', name: 'ITC Limited', price: 445.75, change: 5.20, changePercent: 1.18, volume: 18900000, high: 448.90, low: 441.30, open: 442.50 },
    { symbol: 'WIPRO', name: 'Wipro Limited', price: 425.30, change: -3.80, changePercent: -0.88, volume: 7200000, high: 432.10, low: 424.20, open: 430.50 }
  ];

  const [liveStocks, setLiveStocks] = useState(availableStocks);

  // Generate candlestick data for selected stock
  useEffect(() => {
    if (!selectedStock) return;
    
    const generateCandlesticks = () => {
      const data = [];
      let basePrice = selectedStock.price;
      const periods = timeframe === '1m' ? 390 : timeframe === '5m' ? 78 : timeframe === '15m' ? 26 : timeframe === '1H' ? 7 : timeframe === '1D' ? 90 : timeframe === '1W' ? 52 : 12;
      
      for (let i = periods; i >= 0; i--) {
        const variation = (Math.random() - 0.5) * 0.04;
        const open = basePrice * (1 + variation);
        const close = open * (1 + (Math.random() - 0.5) * 0.03);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.floor(Math.random() * 1000000) + 500000;
        
        let time;
        if (timeframe === '1D') {
          time = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        } else if (timeframe === '1W') {
          time = `W${52 - i}`;
        } else if (timeframe === '1M') {
          time = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { month: 'short' });
        } else {
          const minutesAgo = i * (timeframe === '1m' ? 1 : timeframe === '5m' ? 5 : timeframe === '15m' ? 15 : 60);
          time = new Date(Date.now() - minutesAgo * 60 * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        }
        
        data.push({ time, open, high, low, close, volume });
        basePrice = close;
      }
      return data;
    };
    
    setCandlestickData(generateCandlesticks());
  }, [selectedStock, timeframe]);

  // Update selected stock price in real-time
  useEffect(() => {
    if (!selectedStock) return;
    
    const interval = setInterval(() => {
      const updatedStock = liveStocks.find(s => s.symbol === selectedStock.symbol);
      if (updatedStock) {
        setSelectedStock(updatedStock);
      }
    }, 5000); // Update every 5 seconds for more realistic movement

    return () => clearInterval(interval);
  }, [selectedStock, liveStocks]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStocks(prev => prev.map(stock => {
        const variation = (Math.random() - 0.5) * 0.005; // Reduced variation for smoother movement
        const basePrice = stock.price - stock.change;
        const newPrice = stock.price * (1 + variation);
        const change = newPrice - basePrice;
        const changePercent = (change / basePrice) * 100;
        
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          high: Math.max(stock.high, newPrice),
          low: Math.min(stock.low, newPrice)
        };
      }));

      // Update portfolio value
      const totalValue = portfolio.reduce((sum, holding) => {
        const currentStock = liveStocks.find(s => s.symbol === holding.symbol);
        return sum + (currentStock?.price || holding.avgPrice) * holding.quantity;
      }, 0);
      setPortfolioValue(totalValue + virtualBalance);
    }, 5000); // Update every 5 seconds for more realistic movement

    return () => clearInterval(interval);
  }, [portfolio, virtualBalance, liveStocks]);

  const handleBuy = () => {
    if (!selectedStock || !quantity || isNaN(quantity) || Number(quantity) <= 0) return;
    
    const qty = Number(quantity);
    const price = orderType === 'market' ? selectedStock.price : parseFloat(limitPrice) || selectedStock.price;
    const totalValue = qty * price;
    const charges = totalValue * 0.001;
    const netAmount = totalValue + charges;

    if (netAmount > virtualBalance) {
      alert('Insufficient virtual balance!');
      return;
    }

    const existingHolding = portfolio.find(h => h.symbol === selectedStock.symbol);
    if (existingHolding) {
      const newQuantity = existingHolding.quantity + qty;
      const newAvgPrice = ((existingHolding.avgPrice * existingHolding.quantity) + (price * qty)) / newQuantity;
      setPortfolio(prev => prev.map(h => 
        h.symbol === selectedStock.symbol ? { ...h, quantity: newQuantity, avgPrice: newAvgPrice } : h
      ));
    } else {
      setPortfolio(prev => [...prev, {
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: qty,
        avgPrice: price,
        currentPrice: selectedStock.price
      }]);
    }

    setVirtualBalance(prev => prev - netAmount);
    setTradingHistory(prev => [{
      id: Date.now(),
      type: 'BUY',
      symbol: selectedStock.symbol,
      quantity: qty,
      price: price,
      amount: netAmount,
      timestamp: new Date().toISOString(),
      status: 'Completed'
    }, ...prev]);

    // Show success for first trade
    if (tradingHistory.length === 0 && beginnerMode) {
      setSuccessMessage(`🎉 Congratulations! You just bought ${qty} ${qty === 1 ? 'share' : 'shares'} of ${selectedStock.symbol}! Check the Positions tab to see it.`);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 5000);
    }

    setQuantity('');
    setLimitPrice('');
    setBottomPanelTab('positions'); // Auto switch to positions tab
  };

  const handleSell = () => {
    if (!selectedStock || !quantity || isNaN(quantity) || Number(quantity) <= 0) return;
    
    const qty = Number(quantity);
    const holding = portfolio.find(h => h.symbol === selectedStock.symbol);
    
    if (!holding || holding.quantity < qty) {
      alert('Insufficient shares to sell!');
      return;
    }

    const price = orderType === 'market' ? selectedStock.price : parseFloat(limitPrice) || selectedStock.price;
    const totalValue = qty * price;
    const charges = totalValue * 0.001;
    const netProceeds = totalValue - charges;
    const profit = (price - holding.avgPrice) * qty - charges;

    if (holding.quantity === qty) {
      setPortfolio(prev => prev.filter(h => h.symbol !== selectedStock.symbol));
    } else {
      setPortfolio(prev => prev.map(h => 
        h.symbol === selectedStock.symbol ? { ...h, quantity: h.quantity - qty } : h
      ));
    }

    setVirtualBalance(prev => prev + netProceeds);
    setTradingHistory(prev => [{
      id: Date.now(),
      type: 'SELL',
      symbol: selectedStock.symbol,
      quantity: qty,
      price: price,
      amount: netProceeds,
      profit: profit,
      timestamp: new Date().toISOString(),
      status: 'Completed'
    }, ...prev]);

    setQuantity('');
    setLimitPrice('');
  };

  // Calculate position values with P&L
  const enrichedPortfolio = portfolio.map(holding => {
    const currentStock = liveStocks.find(s => s.symbol === holding.symbol);
    const currentPrice = currentStock?.price || holding.avgPrice;
    const currentValue = currentPrice * holding.quantity;
    const investedValue = holding.avgPrice * holding.quantity;
    const pnl = currentValue - investedValue;
    const pnlPercent = (pnl / investedValue) * 100;

    return {
      ...holding,
      currentPrice,
      currentValue,
      investedValue,
      pnl,
      pnlPercent
    };
  });

  const totalPnL = portfolio.reduce((sum, holding) => {
    const currentStock = liveStocks.find(s => s.symbol === holding.symbol);
    if (!currentStock) return sum;
    return sum + (currentStock.price - holding.avgPrice) * holding.quantity;
  }, 0);

  const totalReturn = ((portfolioValue - 100000) / 100000) * 100;

  // Tutorial Handlers
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      completeTutorial();
    }
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('paperTradingTutorialCompleted', 'true');
  };

  const restartTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
    localStorage.removeItem('paperTradingTutorialCompleted');
  };

  const toggleBeginnerMode = () => {
    const newMode = !beginnerMode;
    setBeginnerMode(newMode);
    localStorage.setItem('paperTradingBeginnerMode', newMode.toString());
  };

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('paperTradingWelcome', 'true');
  };

  const bgColor = theme === 'dark' ? 'bg-[#131722]' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-[#1E222D]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-[#2A2E39]' : 'border-gray-300';
  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-900';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const hoverBg = theme === 'dark' ? 'hover:bg-[#2A2E39]' : 'hover:bg-gray-100';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col pb-6`}>
      {/* Success Notification */}
      {showSuccessModal && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎉</span>
              </div>
              <div>
                <p className="font-bold text-lg mb-1">Trade Successful!</p>
                <p className="text-sm opacity-90">{successMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-2xl shadow-2xl max-w-2xl w-full p-8 border ${borderColor}`}>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="TrendingUp" size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Welcome to Paper Trading! 🎉</h2>
              <p className={`text-lg ${textMuted} mb-6`}>
                Learn to trade stocks with virtual money - Zero Risk, Real Learning!
              </p>
              
              <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-blue-50'} rounded-xl p-6 mb-6 text-left`}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Gift" size={20} className="text-blue-500" />
                  Your Starting Capital
                </h3>
                <div className="text-4xl font-bold text-blue-500 mb-2">₹1,00,000</div>
                <p className={`text-sm ${textMuted}`}>Virtual money to practice trading</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-50'} rounded-lg p-4`}>
                  <Icon name="Shield" size={32} className="text-green-500 mx-auto mb-2" />
                  <h4 className="font-bold mb-1">100% Safe</h4>
                  <p className={`text-xs ${textMuted}`}>No real money involved</p>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-50'} rounded-lg p-4`}>
                  <Icon name="BookOpen" size={32} className="text-blue-500 mx-auto mb-2" />
                  <h4 className="font-bold mb-1">Learn By Doing</h4>
                  <p className={`text-xs ${textMuted}`}>Interactive tutorials</p>
                </div>
                <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-50'} rounded-lg p-4`}>
                  <Icon name="Target" size={32} className="text-purple-500 mx-auto mb-2" />
                  <h4 className="font-bold mb-1">Track Progress</h4>
                  <p className={`text-xs ${textMuted}`}>See your improvement</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    closeWelcomeModal();
                    setShowTutorial(true);
                    setTutorialStep(0);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Start Tutorial
                </button>
                <button
                  onClick={closeWelcomeModal}
                  className={`px-8 py-3 ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-200'} rounded-lg font-bold hover:shadow transition-all`}
                >
                  Skip & Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={completeTutorial}></div>
          <div className={`${cardBg} rounded-2xl shadow-2xl max-w-lg w-full p-6 relative z-50 border-4 border-blue-500`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {tutorialStep + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{tutorialSteps[tutorialStep].title}</h3>
                  <p className={`text-xs ${textMuted}`}>Step {tutorialStep + 1} of {tutorialSteps.length}</p>
                </div>
              </div>
              <button
                onClick={completeTutorial}
                className={`${textMuted} hover:text-red-500 transition-colors`}
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <p className={`text-lg ${textColor} mb-6`}>
              {tutorialSteps[tutorialStep].content}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((tutorialStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>

            <div className="flex gap-3">
              {tutorialStep > 0 && (
                <button
                  onClick={() => setTutorialStep(tutorialStep - 1)}
                  className={`px-6 py-2 ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-200'} rounded-lg font-bold hover:shadow transition-all`}
                >
                  Previous
                </button>
              )}
              <button
                onClick={nextTutorialStep}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                {tutorialSteps[tutorialStep].action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Panel */}
      {showEducationPanel && (
        <div className="fixed right-4 top-20 w-80 max-h-[600px] overflow-y-auto z-30 shadow-2xl rounded-xl border-2 border-blue-500">
          <div className={`${cardBg} rounded-xl`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-xl">
              <div className="flex items-center justify-between text-white">
                <h3 className="font-bold text-lg">📚 Trading Guide</h3>
                <button onClick={() => setShowEducationPanel(false)}>
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {tradingTips.map((tip, index) => (
                <div key={index} className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-blue-50'} rounded-lg p-4 border ${borderColor}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name={tip.icon} size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{tip.title}</h4>
                      <p className={`text-sm ${textMuted}`}>{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Toolbar - TradingView Style */}
      <div className={`${cardBg} border-b ${borderColor} px-4 py-3 flex items-center justify-between flex-wrap gap-3 shadow-sm`}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Stock Selector */}
          <div className="relative group" data-tutorial-target="stock-selector">
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded ${hoverBg} transition-colors`}>
              {selectedStock ? (
                <>
                  <span className="font-bold text-lg">{selectedStock.symbol}</span>
                  <span className={`text-sm font-semibold ${selectedStock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
                  </span>
                </>
              ) : (
                <span className="font-bold text-lg">Select Stock</span>
              )}
              <Icon name="ChevronDown" size={16} />
            </button>
            
            {/* Dropdown */}
            <div className={`absolute top-full left-0 mt-1 w-80 ${cardBg} border ${borderColor} rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-96 overflow-y-auto`}>
              <div className="p-2 space-y-1">
                {liveStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full text-left px-3 py-2 rounded ${hoverBg} transition-colors`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold">{stock.symbol}</div>
                        <div className={`text-xs ${textMuted}`}>{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{stock.price.toFixed(2)}</div>
                        <div className={`text-xs font-semibold ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-opacity-50 rounded p-1">
            {['1m', '5m', '15m', '1H', '1D', '1W', '1M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  timeframe === tf 
                    ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : `${textMuted} ${hoverBg}`
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type */}
          <div className="flex items-center gap-1 p-1 rounded">
            {[
              { type: 'candlestick', icon: 'BarChart3', label: 'Candlestick' },
              { type: 'line', icon: 'TrendingUp', label: 'Line' },
              { type: 'area', icon: 'Activity', label: 'Area' },
              { type: 'bar', icon: 'BarChart', label: 'Bar' }
            ].map((ct) => (
              <button
                key={ct.type}
                onClick={() => setChartType(ct.type)}
                className={`p-1.5 rounded transition-colors ${
                  chartType === ct.type 
                    ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    : `${textMuted} ${hoverBg}`
                }`}
                title={ct.label}
              >
                <Icon name={ct.icon} size={16} />
              </button>
            ))}
          </div>

          {/* Indicators */}
          <button 
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              showVolume ? 'bg-blue-600 text-white' : `${textMuted} ${hoverBg}`
            }`}
          >
            Volume
          </button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Help & Tutorial Buttons */}
          <button
            onClick={() => setShowEducationPanel(!showEducationPanel)}
            className={`px-3 py-2 rounded-lg ${showEducationPanel ? 'bg-blue-500 text-white' : `${hoverBg}`} transition-all font-medium text-sm flex items-center gap-2`}
            title="Trading Guide & Tips"
          >
            <Icon name="BookOpen" size={18} />
            {beginnerMode && <span>Guide</span>}
          </button>

          <button
            onClick={restartTutorial}
            className={`px-3 py-2 rounded-lg ${hoverBg} transition-all font-medium text-sm flex items-center gap-2`}
            title="Restart Tutorial"
          >
            <Icon name="HelpCircle" size={18} />
            {beginnerMode && <span>Tutorial</span>}
          </button>

          {/* Beginner Mode Toggle */}
          <button
            onClick={toggleBeginnerMode}
            className={`px-3 py-2 rounded-lg transition-all font-medium text-sm flex items-center gap-2 ${
              beginnerMode ? 'bg-green-500 text-white' : `${hoverBg}`
            }`}
            title={beginnerMode ? 'Switch to Advanced Mode' : 'Switch to Beginner Mode'}
          >
            <Icon name={beginnerMode ? 'GraduationCap' : 'Zap'} size={18} />
            {beginnerMode ? 'Beginner' : 'Advanced'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded ${hoverBg}`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={18} />
          </button>

          {/* Balance Display */}
          <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-white border border-gray-300'} ${beginnerMode ? 'min-w-[140px]' : ''}`}>
            <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Icon name="Wallet" size={12} />
              {beginnerMode ? 'Available Cash' : 'Balance'}
            </div>
            <div className="font-bold text-lg text-gray-900 mt-0.5">₹{Math.round(virtualBalance).toLocaleString('en-IN')}</div>
            {beginnerMode && virtualBalance < 10000 && (
              <div className="text-xs text-orange-600 mt-1">⚠️ Low balance</div>
            )}
          </div>

          {/* Portfolio Value */}
          {beginnerMode && (
            <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-blue-50 border border-blue-200'}`}>
              <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
                <Icon name="PieChart" size={12} />
                Total Value
              </div>
              <div className="font-bold text-lg text-blue-700 mt-0.5">₹{Math.round(portfolioValue).toLocaleString('en-IN')}</div>
            </div>
          )}

          {/* P&L Display */}
          <div className={`px-4 py-2 rounded-lg ${totalPnL >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} ${beginnerMode ? 'min-w-[140px]' : ''}`}>
            <div className={`text-xs font-medium flex items-center gap-1 ${totalPnL >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              <Icon name={totalPnL >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
              {beginnerMode ? (totalPnL >= 0 ? 'Your Profit' : 'Your Loss') : 'Total P&L'}
            </div>
            <div className={`font-bold text-lg mt-0.5 ${totalPnL >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {totalPnL >= 0 ? '+' : ''}₹{Math.round(totalPnL).toLocaleString('en-IN')}
            </div>
            {beginnerMode && totalPnL !== 0 && (
              <div className={`text-xs mt-1 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}% return
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Trading Area */}
      <div className={`flex-1 flex overflow-hidden min-h-[600px] ${theme === 'dark' ? 'bg-[#131722]' : 'bg-gray-50'}`}>
        {/* Left Sidebar - Watchlist */}
        <div className={`w-72 ${cardBg} border-r-2 ${borderColor} flex flex-col shadow-xl`}>
          {/* Tab Headers */}
          <div className={`flex border-b ${borderColor}`}>
            {['watchlist', 'alerts', 'news'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftPanelTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium capitalize ${
                  leftPanelTab === tab 
                    ? `border-b-2 border-blue-600 ${textColor}` 
                    : textMuted
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Watchlist Content */}
          {leftPanelTab === 'watchlist' && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-1.5">
                {liveStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedStock?.symbol === stock.symbol 
                        ? (theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-200')
                        : hoverBg
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{stock.symbol}</div>
                        <div className={`text-xs ${textMuted} truncate`}>{stock.name.substring(0, 18)}</div>
                      </div>
                      <div className="text-right ml-2">
                        <div className="font-semibold text-sm">₹{stock.price.toFixed(2)}</div>
                        <div className={`text-xs font-medium ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {leftPanelTab === 'alerts' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-4">
                <Icon name="Bell" size={32} className={textMuted} />
                <p className={`text-sm ${textMuted} mt-2`}>No active alerts</p>
                <p className={`text-xs ${textMuted} mt-1`}>Set price alerts for stocks</p>
              </div>
            </div>
          )}

          {leftPanelTab === 'news' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-white'} p-3 rounded border ${borderColor}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="text-xs text-green-500 font-semibold">Market Update</div>
                </div>
                <div className="text-sm font-medium mb-1">Nifty 50 hits new high</div>
                <div className={`text-xs ${textMuted}`}>Indian benchmark index crosses 25,000...</div>
              </div>
              <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-white'} p-3 rounded border ${borderColor}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-xs text-blue-500 font-semibold">Company News</div>
                </div>
                <div className="text-sm font-medium mb-1">Reliance Q4 results beat expectations</div>
                <div className={`text-xs ${textMuted}`}>Strong performance across segments...</div>
              </div>
              <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-white'} p-3 rounded border ${borderColor}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="text-xs text-purple-500 font-semibold">FII Activity</div>
                </div>
                <div className="text-sm font-medium mb-1">Foreign investors continue buying</div>
                <div className={`text-xs ${textMuted}`}>Net inflows reach ₹5,000 crore...</div>
              </div>
            </div>
          )}
        </div>

        {/* Center - Chart Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden" data-tutorial-target="chart-area">
          {/* Chart */}
          <div className="flex-1 p-6 overflow-hidden min-h-[400px]">
            {selectedStock ? (
              <div className="h-full flex flex-col">
                {/* Stock Info Header */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="text-4xl font-bold text-gray-900">₹{selectedStock.price.toFixed(2)}</span>
                    <span className={`text-xl font-bold ${selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedStock.changePercent >= 0 ? '+' : ''}₹{selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </span>
                    {beginnerMode && (
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedStock.changePercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedStock.changePercent >= 0 ? '📈 Trending Up' : '📉 Trending Down'}
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-6 mt-3 text-sm ${textMuted} font-medium flex-wrap`}>
                    <span title={beginnerMode ? "Opening price today" : ""}>O: ₹{selectedStock.open.toFixed(2)}</span>
                    <span title={beginnerMode ? "Highest price today" : ""} className="text-green-600">H: ₹{selectedStock.high.toFixed(2)}</span>
                    <span title={beginnerMode ? "Lowest price today" : ""} className="text-red-600">L: ₹{selectedStock.low.toFixed(2)}</span>
                    <span title={beginnerMode ? "Trading volume" : ""}>Vol: {(selectedStock.volume / 1000000).toFixed(2)}M</span>
                  </div>
                  
                  {beginnerMode && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                      <div className="flex items-start gap-2">
                        <Icon name="Info" size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-blue-700">Reading the Chart: </span>
                          <span className={textMuted}>
                            {chartType === 'candlestick' && "Green candles = price went up, Red candles = price went down. Taller candles = bigger moves."}
                            {chartType === 'line' && "Line going up = price increasing, Line going down = price decreasing."}
                            {chartType === 'area' && "The shaded area shows price movement over time. Higher = better!"}
                            {chartType === 'bar' && "Green bars = price closed higher, Red bars = price closed lower."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chart Canvas */}
                <div className="flex-1 relative min-h-0">
                  {candlestickData.length > 0 ? (
                    <>
                      {chartType === 'candlestick' && (
                        <svg className="w-full h-full" preserveAspectRatio="none">
                          {candlestickData.map((candle, i) => {
                            const x = (i / candlestickData.length) * 100;
                            const width = 100 / candlestickData.length * 0.6;
                            const prices = candlestickData.flatMap(c => [c.high, c.low]);
                            const maxPrice = Math.max(...prices);
                            const minPrice = Math.min(...prices);
                            const priceRange = maxPrice - minPrice;
                            
                            const yOpen = 90 - ((candle.open - minPrice) / priceRange) * 80;
                            const yClose = 90 - ((candle.close - minPrice) / priceRange) * 80;
                            const yHigh = 90 - ((candle.high - minPrice) / priceRange) * 80;
                            const yLow = 90 - ((candle.low - minPrice) / priceRange) * 80;
                            const isGreen = candle.close >= candle.open;
                            
                            return (
                              <g key={i}>
                                {/* High-Low Wick */}
                                <line
                                  x1={`${x}%`}
                                  y1={`${yHigh}%`}
                                  x2={`${x}%`}
                                  y2={`${yLow}%`}
                                  stroke={isGreen ? '#10b981' : '#ef4444'}
                                  strokeWidth="1.5"
                                />
                                {/* Body */}
                                <rect
                                  x={`${x - width/2}%`}
                                  y={`${Math.min(yOpen, yClose)}%`}
                                  width={`${width}%`}
                                  height={`${Math.max(Math.abs(yClose - yOpen), 0.5)}%`}
                                  fill={isGreen ? '#10b981' : '#ef4444'}
                                />
                              </g>
                            );
                          })}
                        </svg>
                      )}

                      {chartType === 'line' && (
                        <svg className="w-full h-full" preserveAspectRatio="none">
                          <polyline
                            points={candlestickData.map((candle, i) => {
                              const x = (i / candlestickData.length) * 100;
                              const prices = candlestickData.map(c => c.close);
                              const maxPrice = Math.max(...prices);
                              const minPrice = Math.min(...prices);
                              const priceRange = maxPrice - minPrice;
                              const y = 90 - ((candle.close - minPrice) / priceRange) * 80;
                              return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#2962ff"
                            strokeWidth="2"
                          />
                        </svg>
                      )}

                      {chartType === 'area' && (
                        <svg className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" style={{ stopColor: '#2962ff', stopOpacity: 0.4 }} />
                              <stop offset="100%" style={{ stopColor: '#2962ff', stopOpacity: 0 }} />
                            </linearGradient>
                          </defs>
                          <polygon
                            points={candlestickData.map((candle, i) => {
                              const x = (i / candlestickData.length) * 100;
                              const prices = candlestickData.map(c => c.close);
                              const maxPrice = Math.max(...prices);
                              const minPrice = Math.min(...prices);
                              const priceRange = maxPrice - minPrice;
                              const y = 90 - ((candle.close - minPrice) / priceRange) * 80;
                              return `${x},${y}`;
                            }).join(' ') + ' 100,95 0,95'}
                            fill="url(#areaGradient)"
                            stroke="#2962ff"
                            strokeWidth="2"
                          />
                        </svg>
                      )}

                      {chartType === 'bar' && (
                        <svg className="w-full h-full" preserveAspectRatio="none">
                          {candlestickData.map((candle, i) => {
                            const x = (i / candlestickData.length) * 100;
                            const width = 100 / candlestickData.length * 0.8;
                            const prices = candlestickData.flatMap(c => [c.high, c.low]);
                            const maxPrice = Math.max(...prices);
                            const minPrice = Math.min(...prices);
                            const priceRange = maxPrice - minPrice;
                            const baseline = 90;
                            const yClose = 90 - ((candle.close - minPrice) / priceRange) * 80;
                            const height = baseline - yClose;
                            const isGreen = candle.close >= candle.open;
                            
                            return (
                              <rect
                                key={i}
                                x={`${x - width/2}%`}
                                y={`${yClose}%`}
                                width={`${width}%`}
                                height={`${Math.abs(height)}%`}
                                fill={isGreen ? '#10b98199' : '#ef444499'}
                              />
                            );
                          })}
                        </svg>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Icon name="BarChart3" size={48} className={textMuted} />
                        <p className={`${textMuted} mt-2`}>Loading chart data...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Volume Chart */}
                {showVolume && candlestickData.length > 0 && (
                  <div className="h-24 mt-4 pt-4 border-t border-gray-200">
                    <div className={`text-xs font-semibold ${textMuted} uppercase mb-2`}>Volume</div>
                    <svg className="w-full h-full" preserveAspectRatio="none">
                      {candlestickData.map((candle, i) => {
                        const x = (i / candlestickData.length) * 100;
                        const width = 100 / candlestickData.length * 0.6;
                        const maxVolume = Math.max(...candlestickData.map(c => c.volume));
                        const height = (candle.volume / maxVolume) * 90;
                        const isGreen = candle.close >= candle.open;
                        
                        return (
                          <rect
                            key={i}
                            x={`${x - width/2}%`}
                            y={`${95 - height}%`}
                            width={`${width}%`}
                            height={`${height}%`}
                            fill={isGreen ? '#10b98166' : '#ef444466'}
                          />
                        );
                      })}
                    </svg>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Icon name="TrendingUp" size={64} className={textMuted} />
                  <p className={`${textMuted} mt-4 text-lg font-medium`}>Select a stock to view chart</p>
                  <p className={`text-sm ${textMuted} mt-2`}>Choose from the watchlist on the left</p>
                </div>
              </div>
            )}
          </div>

          {/* Trading Panel - Below Chart */}
          <div className={`border-t-2 ${borderColor}`}>
            {/* Tabs */}
            <div className={`flex border-b ${borderColor} ${theme === 'dark' ? 'bg-[#1E222D]' : 'bg-gray-50'}`}>
              {['positions', 'orders', 'history', 'trade'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBottomPanelTab(tab)}
                  className={`flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                    bottomPanelTab === tab 
                      ? `border-b-2 border-blue-600 ${textColor}` 
                      : textMuted
                  }`}
                >
                  {tab === 'positions' && portfolio.length > 0 ? `${tab} (${portfolio.length})` : tab}
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="max-h-60 overflow-y-auto">
              {bottomPanelTab === 'positions' && (
                <div className="p-3" data-tutorial-target="positions-tab">
                  {enrichedPortfolio.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="Package" size={32} className="text-white" />
                      </div>
                      <p className={`text-sm font-bold ${textColor} mb-2`}>No positions yet</p>
                      <p className={`text-xs ${textMuted} mb-4`}>Start trading to build your portfolio</p>
                      {beginnerMode && (
                        <div className={`${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'} border border-blue-500 rounded-lg p-3 text-xs max-w-sm mx-auto`}>
                          <p className="font-bold text-blue-600 mb-1">👋 First time?</p>
                          <p className={textMuted}>
                            1. Select a stock from the left<br/>
                            2. Click the "Trade" tab above<br/>
                            3. Buy 1 share to start learning!
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {beginnerMode && (
                        <div className="mb-3 bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="TrendingUp" size={18} />
                            <h4 className="font-bold text-sm">Your Portfolio</h4>
                          </div>
                          <p className="text-xs opacity-90">
                            {totalPnL >= 0 
                              ? `Great job! You're up ₹${totalPnL.toFixed(2)}! 🎉`
                              : `Down ₹${Math.abs(totalPnL).toFixed(2)}. Stay patient, prices fluctuate!`
                            }
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {enrichedPortfolio.map((position, index) => (
                          <div key={index} className={`rounded-lg overflow-hidden border-2 ${position.pnl >= 0 ? 'border-green-500' : 'border-red-500'} ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-white'} shadow-md`}>
                            <div className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="font-bold text-lg">{position.symbol}</div>
                                  <div className={`text-xs ${textMuted}`}>{position.name}</div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${position.pnl >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {position.pnl >= 0 ? '📈 Profit' : '📉 Loss'}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className={`${theme === 'dark' ? 'bg-[#1E222D]' : 'bg-gray-50'} rounded p-2`}>
                                  <div className={`text-xs ${textMuted} mb-1`}>Quantity</div>
                                  <div className="font-bold">{position.quantity} shares</div>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-[#1E222D]' : 'bg-gray-50'} rounded p-2`}>
                                  <div className={`text-xs ${textMuted} mb-1`}>Avg Price</div>
                                  <div className="font-bold">₹{position.avgPrice.toFixed(2)}</div>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-[#1E222D]' : 'bg-gray-50'} rounded p-2`}>
                                  <div className={`text-xs ${textMuted} mb-1`}>Current Price</div>
                                  <div className="font-bold text-blue-600">₹{position.currentPrice.toFixed(2)}</div>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-[#1E222D]' : 'bg-gray-50'} rounded p-2`}>
                                  <div className={`text-xs ${textMuted} mb-1`}>Current Value</div>
                                  <div className="font-bold">₹{position.currentValue.toFixed(2)}</div>
                                </div>
                              </div>

                              <div className={`p-3 rounded-lg ${position.pnl >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className={`text-xs font-medium ${position.pnl >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                      {position.pnl >= 0 ? 'Total Profit' : 'Total Loss'}
                                    </div>
                                    {beginnerMode && (
                                      <div className={`text-xs ${textMuted} mt-1`}>
                                        Invested: ₹{position.investedValue.toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className={`text-xl font-bold ${position.pnl >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                      {position.pnl >= 0 ? '+' : ''}₹{position.pnl.toFixed(2)}
                                    </div>
                                    <div className={`text-sm font-semibold ${position.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {beginnerMode && (
                                <div className={`mt-3 pt-3 border-t ${borderColor} text-xs ${textMuted}`}>
                                  <div className="flex items-center gap-1">
                                    <Icon name="Lightbulb" size={12} />
                                    <span className="font-semibold">Tip:</span>
                                    {position.pnl >= 0 
                                      ? " Consider selling some shares to lock in profits!"
                                      : " Prices fluctuate. Hold on if you believe in the stock."
                                    }
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {bottomPanelTab === 'orders' && (
                <div className="p-3 text-center py-4">
                  <Icon name="FileText" size={28} className={`${textMuted} mx-auto mb-2`} />
                  <p className={`text-xs ${textMuted}`}>No pending orders</p>
                </div>
              )}

              {bottomPanelTab === 'history' && (
                <div className="p-3">
                  {tradingHistory.length === 0 ? (
                    <div className="text-center py-4">
                      <Icon name="History" size={28} className={`${textMuted} mx-auto mb-2`} />
                      <p className={`text-xs ${textMuted}`}>No trading history</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tradingHistory.slice().reverse().map((trade, index) => (
                        <div key={index} className={`p-2 rounded ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-white'} border ${borderColor}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${trade.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {trade.type.toUpperCase()}
                                </span>
                                <span className="text-xs font-medium">{trade.symbol}</span>
                              </div>
                              <div className={`text-xs ${textMuted} mt-1`}>
                                {trade.quantity} shares @ ₹{trade.price.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-right text-xs">
                              <div className="font-semibold">₹{trade.total.toFixed(2)}</div>
                              <div className={textMuted}>{new Date(trade.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {bottomPanelTab === 'trade' && (
                <div className="p-4" data-tutorial-target="trade-tab">
                  {selectedStock ? (
                    <div className="space-y-3">
                      {/* Beginner Mode Helper */}
                      {beginnerMode && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mb-4">
                          <div className="flex items-start gap-2">
                            <Icon name="Lightbulb" size={20} className="flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-sm mb-1">Quick Trading Guide</h4>
                              <p className="text-xs opacity-90">
                                {tradeType === 'buy' 
                                  ? `Buying ${selectedStock.symbol} means you own shares. If price goes up, you profit! 📈`
                                  : `Selling your ${selectedStock.symbol} shares locks in your profit or loss. 💰`
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Trade Type Toggle */}
                      <div>
                        {beginnerMode && (
                          <label className={`block text-xs font-bold mb-2 ${textColor} flex items-center gap-1`}>
                            <Icon name="TrendingUp" size={14} />
                            Choose Action
                          </label>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setTradeType('buy')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                              tradeType === 'buy'
                                ? 'bg-emerald-500 text-white shadow-lg'
                                : `${theme === 'dark' ? 'bg-[#2A2E39] text-gray-400' : 'bg-gray-100 text-gray-600'}`
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Icon name="ShoppingCart" size={16} />
                              BUY
                            </div>
                            {beginnerMode && <div className="text-xs opacity-80 mt-1">Purchase shares</div>}
                          </button>
                          <button
                            onClick={() => setTradeType('sell')}
                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                              tradeType === 'sell'
                                ? 'bg-red-500 text-white shadow-lg'
                                : `${theme === 'dark' ? 'bg-[#2A2E39] text-gray-400' : 'bg-gray-100 text-gray-600'}`
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Icon name="DollarSign" size={16} />
                              SELL
                            </div>
                            {beginnerMode && <div className="text-xs opacity-80 mt-1">Sell your shares</div>}
                          </button>
                        </div>
                      </div>

                      {/* Order Type */}
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${textColor} uppercase flex items-center gap-2`}>
                          Order Type
                          {beginnerMode && (
                            <span className={`text-xs font-normal normal-case ${textMuted}`}>
                              (Market = Buy now, Limit = Buy at your price)
                            </span>
                          )}
                        </label>
                        <select
                          value={orderType}
                          onChange={(e) => setOrderType(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-[#2A2E39] text-gray-200' : 'bg-white text-gray-900'} border ${borderColor}`}
                        >
                          <option value="market">Market Order - Execute immediately</option>
                          <option value="limit">Limit Order - Set your price</option>
                        </select>
                        {beginnerMode && orderType === 'market' && (
                          <p className={`text-xs ${textMuted} mt-1 flex items-center gap-1`}>
                            <Icon name="Zap" size={12} />
                            Executes instantly at current price: ₹{selectedStock.price.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${textColor} uppercase flex items-center gap-2`}>
                          Quantity
                          {beginnerMode && (
                            <span className={`text-xs font-normal normal-case ${textMuted}`}>
                              (How many shares)
                            </span>
                          )}
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder={beginnerMode ? "Start with 1 or 2 shares" : "0"}
                          min="1"
                          className={`w-full px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-[#2A2E39] text-gray-200' : 'bg-white text-gray-900'} border ${borderColor}`}
                        />
                        {beginnerMode && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => setQuantity('1')}
                              className={`px-3 py-1 rounded text-xs ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-100'} ${hoverBg}`}
                            >
                              1 share
                            </button>
                            <button
                              onClick={() => setQuantity('5')}
                              className={`px-3 py-1 rounded text-xs ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-100'} ${hoverBg}`}
                            >
                              5 shares
                            </button>
                            <button
                              onClick={() => setQuantity('10')}
                              className={`px-3 py-1 rounded text-xs ${theme === 'dark' ? 'bg-[#2A2E39]' : 'bg-gray-100'} ${hoverBg}`}
                            >
                              10 shares
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Limit Price */}
                      {orderType === 'limit' && (
                        <div>
                          <label className={`block text-xs font-bold mb-1 ${textColor} uppercase flex items-center gap-2`}>
                            Limit Price
                            {beginnerMode && (
                              <span className={`text-xs font-normal normal-case ${textMuted}`}>
                                (Your target price)
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            placeholder={selectedStock.price.toFixed(2)}
                            step="0.05"
                            className={`w-full px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-[#2A2E39] text-gray-200' : 'bg-white text-gray-900'} border ${borderColor}`}
                          />
                          {beginnerMode && (
                            <p className={`text-xs ${textMuted} mt-1 flex items-center gap-1`}>
                              <Icon name="Info" size={12} />
                              Order will execute only when price reaches ₹{limitPrice || selectedStock.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Order Summary */}
                      {quantity && Number(quantity) > 0 && (
                        <div className={`${theme === 'dark' ? 'bg-[#2A2E39]' : tradeType === 'buy' ? 'bg-green-50' : 'bg-red-50'} border-2 ${tradeType === 'buy' ? 'border-green-500' : 'border-red-500'} rounded-lg p-4 space-y-2`}>
                          <h4 className={`text-sm font-bold ${textColor} flex items-center gap-2`}>
                            <Icon name="Calculator" size={16} />
                            Order Summary
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className={textMuted}>Price per share</span>
                              <span className="font-semibold">₹{(orderType === 'market' ? selectedStock.price : (parseFloat(limitPrice) || selectedStock.price)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textMuted}>Quantity</span>
                              <span className="font-semibold">{quantity} shares</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={textMuted}>Charges (0.1%)</span>
                              <span className="font-semibold">₹{((Number(quantity) * (orderType === 'market' ? selectedStock.price : (parseFloat(limitPrice) || selectedStock.price))) * 0.001).toFixed(2)}</span>
                            </div>
                            <div className={`pt-2 border-t-2 ${borderColor} flex justify-between items-center`}>
                              <span className="font-bold">Total {tradeType === 'buy' ? 'Cost' : 'Proceeds'}</span>
                              <span className={`font-bold text-lg ${tradeType === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{((Number(quantity) * (orderType === 'market' ? selectedStock.price : (parseFloat(limitPrice) || selectedStock.price))) * (tradeType === 'buy' ? 1.001 : 0.999)).toFixed(2)}
                              </span>
                            </div>
                            {beginnerMode && tradeType === 'buy' && (
                              <p className={`text-xs ${textMuted} pt-2 flex items-start gap-1`}>
                                <Icon name="AlertCircle" size={12} className="mt-0.5 flex-shrink-0" />
                                <span>This amount will be deducted from your balance: ₹{virtualBalance.toFixed(2)}</span>
                              </p>
                            )}
                            {beginnerMode && tradeType === 'sell' && (
                              <p className={`text-xs ${textMuted} pt-2 flex items-start gap-1`}>
                                <Icon name="AlertCircle" size={12} className="mt-0.5 flex-shrink-0" />
                                <span>This amount will be added to your balance</span>
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Place Order Button */}
                      <button
                        onClick={tradeType === 'buy' ? handleBuy : handleSell}
                        disabled={!quantity || Number(quantity) <= 0}
                        className={`w-full py-3 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                          tradeType === 'buy' 
                            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-xl' 
                            : 'bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <Icon name={tradeType === 'buy' ? 'ShoppingCart' : 'DollarSign'} size={18} />
                        {tradeType === 'buy' ? 'PLACE BUY ORDER' : 'PLACE SELL ORDER'}
                        {beginnerMode && quantity && Number(quantity) > 0 && (
                          <span className="opacity-80">
                            ({quantity} {Number(quantity) === 1 ? 'share' : 'shares'})
                          </span>
                        )}
                      </button>
                      
                      {beginnerMode && (
                        <div className={`${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'} border border-blue-500 rounded-lg p-3 text-xs`}>
                          <div className="flex items-start gap-2">
                            <Icon name="Info" size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-blue-600 mb-1">💡 Trading Tip</p>
                              <p className={textMuted}>
                                {tradeType === 'buy' 
                                  ? "Start small! Buy 1-2 shares to learn. You can always buy more later."
                                  : "Make sure you own shares before selling. Check the Positions tab above."
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Icon name="TrendingUp" size={28} className={`${textMuted} mx-auto mb-2`} />
                      <p className={`text-xs ${textMuted}`}>Select a stock to trade</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperTrading;

