import React, { useState, useEffect } from 'react';
import DashboardQuickActions from '../../components/ui/DashboardQuickActions';
import PortfolioSummary from './components/PortfolioSummary';
import InvestmentsTable from './components/InvestmentsTable';
import PerformanceChart from './components/PerformanceChart';
import MarketNews from './components/MarketNews';
import PortfolioStats from './components/PortfolioStats';
import StockTradingPanel from './components/StockTradingPanel';
import Watchlist from './components/Watchlist';
import AllocationRecommendations from './components/AllocationRecommendations';
import StockRecommendations from './components/StockRecommendations';
import AIRebalanceModal from './components/AIRebalanceModal';
import InvestmentForm from './components/InvestmentForm';
import Icon from '../../components/AppIcon';


const InvestmentPortfolio = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [isRebalanced, setIsRebalanced] = useState(false);

  // Mock data - initialize immediately so page works without backend
  const mockPortfolioData = {
    totalValue: 85420,
    walletBalance: 15000,
    monthlyReturns: 5.2,
    totalBonds: 25000,
    totalMutualFunds: 35000,
    totalSIP: 25420,
    assets: [
      { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 10, avgPrice: 2450, currentPrice: 2580, value: 25800, change: 5.3 },
      { symbol: 'INFY', name: 'Infosys Ltd', quantity: 20, avgPrice: 1450, currentPrice: 1520, value: 30400, change: 4.8 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 15, avgPrice: 1650, currentPrice: 1720, value: 25800, change: 4.2 },
      { symbol: 'TCS', name: 'TCS', quantity: 8, avgPrice: 3450, currentPrice: 3550, value: 28400, change: 2.9 }
    ],
    allocationData: [
      { name: 'Equity', percentage: 60, color: '#6366F1' },
      { name: 'Mutual Funds', percentage: 25, color: '#10B981' },
      { name: 'Bonds', percentage: 10, color: '#F59E0B' },
      { name: 'Gold', percentage: 5, color: '#EC4899' }
    ]
  };

  const mockPerformanceData = {
    '1D': [
      { date: '9:30 AM', portfolio: 84200, benchmark: 83800 },
      { date: '10:00 AM', portfolio: 84500, benchmark: 84000 },
      { date: '11:00 AM', portfolio: 84900, benchmark: 84200 },
      { date: '12:00 PM', portfolio: 85100, benchmark: 84400 },
      { date: '1:00 PM', portfolio: 85300, benchmark: 84600 },
      { date: '2:00 PM', portfolio: 85200, benchmark: 84500 },
      { date: '3:00 PM', portfolio: 85420, benchmark: 84700 }
    ],
    '1W': [
      { date: 'Mon', portfolio: 83500, benchmark: 83100 },
      { date: 'Tue', portfolio: 83900, benchmark: 83400 },
      { date: 'Wed', portfolio: 84300, benchmark: 83800 },
      { date: 'Thu', portfolio: 84900, benchmark: 84300 },
      { date: 'Fri', portfolio: 85420, benchmark: 84700 }
    ],
    '1M': [
      { date: 'Week 1', portfolio: 81000, benchmark: 80500 },
      { date: 'Week 2', portfolio: 82500, benchmark: 82000 },
      { date: 'Week 3', portfolio: 84000, benchmark: 83400 },
      { date: 'Week 4', portfolio: 85420, benchmark: 84700 }
    ],
    '3M': [
      { date: 'Sep', portfolio: 75000, benchmark: 74500 },
      { date: 'Oct', portfolio: 78500, benchmark: 78000 },
      { date: 'Nov', portfolio: 85420, benchmark: 84700 }
    ],
    '6M': [
      { date: 'Jun', portfolio: 68000, benchmark: 67500 },
      { date: 'Jul', portfolio: 70500, benchmark: 70000 },
      { date: 'Aug', portfolio: 73000, benchmark: 72500 },
      { date: 'Sep', portfolio: 75000, benchmark: 74500 },
      { date: 'Oct', portfolio: 78500, benchmark: 78000 },
      { date: 'Nov', portfolio: 85420, benchmark: 84700 }
    ],
    '1Y': [
      { date: 'Dec 24', portfolio: 55000, benchmark: 54500 },
      { date: 'Feb 25', portfolio: 60000, benchmark: 59500 },
      { date: 'Apr 25', portfolio: 65000, benchmark: 64500 },
      { date: 'Jun 25', portfolio: 70000, benchmark: 69500 },
      { date: 'Aug 25', portfolio: 75000, benchmark: 74500 },
      { date: 'Oct 25', portfolio: 80000, benchmark: 79500 },
      { date: 'Nov 25', portfolio: 85420, benchmark: 84700 }
    ],
    'ALL': [
      { date: '2023', portfolio: 25000, benchmark: 24800 },
      { date: '2024', portfolio: 55000, benchmark: 54500 },
      { date: '2025', portfolio: 85420, benchmark: 84700 }
    ]
  };

  const mockNewsData = [
    { id: 1, title: 'Indian Markets Hit Record High', source: 'Economic Times', time: '2h ago' },
    { id: 2, title: 'Tech Stocks Rally on Strong Earnings', source: 'Business Standard', time: '4h ago' },
    { id: 3, title: 'RBI Keeps Interest Rates Unchanged', source: 'Mint', time: '6h ago' }
  ];

  const mockWatchlistData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.3 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 380.20, change: 1.8 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.30, change: -0.5 }
  ];

  const mockRecommendations = [
    { id: 1, type: 'rebalance', asset: 'Equity', current: 60, suggested: 65, reason: 'Increase equity allocation for growth' },
    { id: 2, type: 'buy', asset: 'Index Funds', current: 0, suggested: 10, reason: 'Add low-cost index funds for diversification' }
  ];

  const mockStockRecommendations = [
    {
      id: 1,
      symbol: 'RELIANCE',
      name: 'Reliance Industries Ltd',
      currentPrice: 2580.50,
      targetPrice: 2850.00,
      expectedReturn: 10.4,
      strength: 'strong',
      riskLevel: 'medium',
      sector: 'Energy',
      marketCap: 'Large Cap',
      reason: 'Strong fundamentals, expanding digital and retail segments, and consistent dividend payments make this a solid long-term investment.',
      yearHigh: 2750.00,
      peRatio: 28.5
    },
    {
      id: 2,
      symbol: 'INFY',
      name: 'Infosys Ltd',
      currentPrice: 1520.75,
      targetPrice: 1680.00,
      expectedReturn: 10.5,
      strength: 'strong',
      riskLevel: 'low',
      sector: 'IT Services',
      marketCap: 'Large Cap',
      reason: 'Leading IT services company with strong client relationships, digital transformation focus, and attractive valuation.',
      yearHigh: 1650.00,
      peRatio: 24.8
    },
    {
      id: 3,
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Ltd',
      currentPrice: 1720.30,
      targetPrice: 1900.00,
      expectedReturn: 10.4,
      strength: 'moderate',
      riskLevel: 'low',
      sector: 'Banking',
      marketCap: 'Large Cap',
      reason: 'Well-managed private sector bank with strong asset quality and consistent growth. Good for portfolio stability.',
      yearHigh: 1850.00,
      peRatio: 18.2
    },
    {
      id: 4,
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      currentPrice: 3550.80,
      targetPrice: 3800.00,
      expectedReturn: 7.0,
      strength: 'moderate',
      riskLevel: 'low',
      sector: 'IT Services',
      marketCap: 'Large Cap',
      reason: 'Market leader in IT services with strong margins and cash generation. Suitable for conservative investors.',
      yearHigh: 3750.00,
      peRatio: 30.1
    }
  ];

  // Initialize with mock data immediately
  const [portfolioData, setPortfolioData] = useState(mockPortfolioData);
  const [investments, setInvestments] = useState(mockPortfolioData.assets);
  const [performanceData, setPerformanceData] = useState(mockPerformanceData);
  const [newsData, setNewsData] = useState(mockNewsData);
  const [watchlistData, setWatchlistData] = useState(mockWatchlistData);
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [stockRecommendations, setStockRecommendations] = useState(mockStockRecommendations);
  const [isRefreshingAI, setIsRefreshingAI] = useState(false);
  
  // Live data states
  const [riskData, setRiskData] = useState({
    score: 56,
    volatility: 18.2,
    beta: 1.12,
    sharpeRatio: 1.45
  });
  
  const [taxData, setTaxData] = useState({
    taxSavings: 45200,
    section80CUtilized: 85,
    section80CAmount: 127000,
    section80CLimit: 150000,
    ltcgGains: 120000
  });
  
  const [dividendData, setDividendData] = useState({
    totalDividends: 28450,
    yearOverYearChange: 12.5,
    recentDividends: [
      { company: 'Reliance Industries', amount: 8500, quarter: 'Q3 2024' },
      { company: 'Infosys Ltd', amount: 6200, quarter: 'Q3 2024' },
      { company: 'HDFC Bank', amount: 5750, quarter: 'Q3 2024' }
    ],
    upcomingDividends: [
      { company: 'TCS', amount: 3200 },
      { company: 'Wipro', amount: 2100 }
    ]
  });
  const [availableStocks, setAvailableStocks] = useState([
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2580.50', change: '45.20', percent_change: '1.78', exchange: 'NSE' },
    { symbol: 'INFY', name: 'Infosys Ltd', price: '1520.75', change: '23.50', percent_change: '1.57', exchange: 'NSE' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '1720.30', change: '-12.40', percent_change: '-0.72', exchange: 'NSE' },
    { symbol: 'TCS', name: 'TCS', price: '3550.80', change: '28.90', percent_change: '0.82', exchange: 'NSE' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: '985.60', change: '15.30', percent_change: '1.58', exchange: 'NSE' },
    { symbol: 'SBIN', name: 'State Bank of India', price: '625.40', change: '-8.20', percent_change: '-1.29', exchange: 'NSE' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '1125.90', change: '18.70', percent_change: '1.69', exchange: 'NSE' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', price: '2450.20', change: '12.50', percent_change: '0.51', exchange: 'NSE' }
  ]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setCurrentLanguage(savedLanguage);

    // Try to fetch from backend in background, but don't block rendering
    const fetchData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const portfolioRes = await fetch('http://localhost:5000/portfolio/1', { 
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (portfolioRes.ok) {
          const portfolio = await portfolioRes.json();
          setPortfolioData(portfolio);
          setInvestments(portfolio.assets || []);
        }
      } catch (error) {
        // Silently fail - we're using mock data already
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const newsRes = await fetch('http://localhost:5000/market-news', { 
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (newsRes.ok) {
          const news = await newsRes.json();
          setNewsData(news);
        }
      } catch (error) {
        // Use mock data
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const watchlistRes = await fetch('http://localhost:5000/watchlist/1', { 
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (watchlistRes.ok) {
          const watchlist = await watchlistRes.json();
          setWatchlistData(watchlist);
        }
      } catch (error) {
        // Use mock data
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const recommendationsRes = await fetch('http://localhost:5000/recommendations/1', { 
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (recommendationsRes.ok) {
          const recs = await recommendationsRes.json();
          setRecommendations(recs);
        }
      } catch (error) {
        // Use mock data
      }
    };

    fetchData();
    
    // Update stock recommendations periodically (every 30 seconds)
    const stockUpdateInterval = setInterval(() => {
      // Simulate updating stock prices
      setStockRecommendations(prev => prev.map(stock => ({
        ...stock,
        currentPrice: stock.currentPrice * (1 + (Math.random() - 0.5) * 0.02) // ±1% variation
      })));
    }, 30000);

    return () => clearInterval(stockUpdateInterval);
  }, []);

  const handleApplyRecommendation = (id) => {
    setRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'applied' } : rec));
  };

  const handleRefreshRecommendations = async () => {
    setIsRefreshingAI(true);
    try {
      const recommendationsRes = await fetch('http://localhost:5000/recommendations/1');
      const recs = await recommendationsRes.json();
      setRecommendations(recs.map(rec => ({...rec, status: 'pending'})));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsRefreshingAI(false);
    }
  };

  const handleRebalanceConfirm = async () => {
    try {
      const res = await fetch('http://localhost:5000/rebalance/1', {
        method: 'POST',
      });
      const data = await res.json();
      setPortfolioData(data.new_portfolio);
      setIsRebalanced(true);
      setShowRebalanceModal(false);
    } catch (error) {
      console.error("Error rebalancing portfolio:", error);
    }
  };

  const handleInvestmentSubmit = (investmentData) => {
    console.log('New Investment:', investmentData);
    
    // Update portfolio data based on investment type
    const amount = parseFloat(investmentData.amount);
    
    // Save to localStorage for dashboard access
    const existingInvestments = JSON.parse(localStorage.getItem('userInvestments') || '[]');
    const newInvestment = {
      ...investmentData,
      id: Date.now(),
      date: new Date().toISOString(),
      currentValue: amount,
      returns: 0
    };
    existingInvestments.push(newInvestment);
    localStorage.setItem('userInvestments', JSON.stringify(existingInvestments));
    
    setPortfolioData(prev => {
      const updated = { ...prev };
      updated.totalValue += amount;
      
      // Update specific category totals
      if (investmentData.type === 'bonds') {
        updated.totalBonds += amount;
      } else if (investmentData.type === 'mutualFunds') {
        updated.totalMutualFunds += amount;
      } else if (investmentData.type === 'sips') {
        updated.totalSIP += amount;
      }
      
      return updated;
    });
    
    // Show success message
    alert(`Successfully invested ₹${amount.toLocaleString()} in ${investmentData.name}!\n\nView your investment in the Dashboard.`);
    
    // Trigger storage event for dashboard to update
    window.dispatchEvent(new Event('storage'));
    
    // In production, send to backend:
    // await fetch('http://localhost:5000/investments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(investmentData)
    // });
  };

  // Page always renders now since we initialize with mock data












  // Mock user profile - Student persona
  const userProfile = {
    age: "20-24",
    riskTolerance: "Moderate-Aggressive",
    timeHorizon: "8-10 years",
    investmentGoal: "Education + Early Wealth",
    experience: "Beginner/Intermediate"
  };





  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl p-6 border border-indigo-100 dark:border-gray-700">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Icon name="TrendingUp" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Investment Portfolio</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                <Icon name="GraduationCap" size={14} className="text-indigo-600" />
                <span className="font-medium">Student Investor</span>
                <span className="text-gray-400">•</span>
                <span>Long-term Growth Strategy</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-4 lg:mt-0 flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-white border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm hover:shadow">
            <Icon name="Sparkles" size={16} />
            <span>AI Insights</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow">
            <Icon name="Download" size={16} />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowInvestmentForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <Icon name="Plus" size={16} />
            <span>Make Investment</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: Stock Trading Panel with Graph and Buy/Sell Details */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <StockTradingPanel 
        stocks={availableStocks}
        walletBalance={portfolioData?.walletBalance}
        onTrade={(tradeData) => {
          console.log('Trade executed:', tradeData);
          // Here you would typically send this to your backend
          alert(`Order placed: ${tradeData.type.toUpperCase()} ${tradeData.quantity} shares of ${tradeData.stock.symbol} at ₹${tradeData.price}`);
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: Holdings Table + Watchlist */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Holdings Table - Takes 2 columns */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                <Icon name="Briefcase" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Holdings</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{investments.length} active investments • Real-time market data</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
                Live Data
              </span>
            </div>
          </div>
          <InvestmentsTable investments={investments} />
        </div>

        {/* Watchlist - Takes 1 column */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
                <Icon name="Eye" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Watchlist</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Tracking {watchlistData.length} stocks</p>
              </div>
            </div>
          </div>
          <Watchlist watchlistData={watchlistData} setWatchlistData={setWatchlistData} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: Portfolio Stats */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <PortfolioStats
        totalValue={portfolioData?.totalValue}
        walletBalance={portfolioData?.walletBalance}
        monthlyReturns={portfolioData?.monthlyReturns}
        activeInvestments={investments.length}
      />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: Market News + AI Portfolio Coach */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market News - Left Column */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <Icon name="Newspaper" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Market News</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Latest India market updates</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <MarketNews newsData={newsData} />
          </div>
        </div>

        {/* AI Portfolio Coach - Right Column */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-100 dark:border-purple-900/50 shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-purple-100 dark:border-purple-900/50 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-fuchsia-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg animate-pulse">
                  <Icon name="Sparkles" size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Portfolio Coach</h2>
                    <span className="text-[9px] px-2 py-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full font-bold uppercase tracking-wider shadow-md">
                      AI Powered
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Intelligent rebalancing & optimization recommendations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isRebalanced && (
                  <span className="text-xs px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-semibold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                    <Icon name="Check" size={12} />
                    Optimized
                  </span>
                )}
                <button
                  onClick={() => setShowRebalanceModal(true)}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-xl hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Icon name="Zap" size={16} />
                  Apply AI Rebalance
                </button>
              </div>
            </div>
          </div>
          <StockRecommendations
            recommendations={stockRecommendations}
            onBuyStock={(stock) => {
              // Navigate to trading panel or show buy modal
              alert(`Opening buy order for ${stock.symbol} at ₹${stock.currentPrice}`);
              // You can integrate this with the StockTradingPanel component
            }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: Unique Features - Risk Analysis, Tax Insights, Dividend Tracker */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Risk Analysis Dashboard */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-red-100 dark:border-red-900/50 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-red-100 dark:border-red-900/50 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-rose-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg">
                  <Icon name="AlertTriangle" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Risk Analysis</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Portfolio risk assessment</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-600 dark:text-gray-400">Live</span>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(riskData.score / 100) * 351} 351`}
                    className="text-amber-600 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-600 transition-all duration-300">{Math.round(riskData.score)}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Risk Score</p>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {riskData.score < 40 ? 'Low Risk' : riskData.score < 60 ? 'Moderate Risk' : 'High Risk'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={16} className="text-emerald-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Volatility</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white transition-all duration-300">
                  {riskData.volatility.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-2">
                  <Icon name="BarChart3" size={16} className="text-blue-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Beta</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white transition-all duration-300">
                  {riskData.beta.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-2">
                  <Icon name="Shield" size={16} className="text-purple-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Sharpe Ratio</span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white transition-all duration-300">
                  {riskData.sharpeRatio.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Risk Factors:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Well-diversified portfolio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Moderate equity exposure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300">Adequate debt allocation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Optimization Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-amber-100 dark:border-amber-900/50 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-amber-100 dark:border-amber-900/50 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-yellow-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center shadow-lg">
                  <Icon name="FileText" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tax Insights</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Optimize your tax liability</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-600 dark:text-gray-400">Live</span>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Tax Savings (FY 2024-25)</span>
                <Icon name="TrendingDown" size={16} className="text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 transition-all duration-300">
                ₹{Math.round(taxData.taxSavings).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Through ELSS & tax-saving FDs</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Section 80C</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Utilized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-2 bg-emerald-600 rounded-full transition-all duration-500" 
                      style={{ width: `${taxData.section80CUtilized}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 transition-all duration-300">
                    {Math.round(taxData.section80CUtilized)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-all duration-300">
                  ₹{(taxData.section80CAmount / 1000).toFixed(1)}L / ₹{(taxData.section80CLimit / 1000).toFixed(1)}L limit
                </p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">LTCG Exempt</span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">Optimized</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-all duration-300">
                  Long-term gains: ₹{(taxData.ltcgGains / 1000).toFixed(1)}L (within ₹1L exemption)
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommendations:</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={14} className="text-emerald-600 mt-0.5" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Consider increasing ELSS contribution</span>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={14} className="text-emerald-600 mt-0.5" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Hold equity investments for 1+ year</span>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Lightbulb" size={14} className="text-amber-600 mt-0.5" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Consider NPS for additional deduction</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dividend Tracker */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/50 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
                  <Icon name="DollarSign" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dividend Tracker</h2>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Passive income tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-600 dark:text-gray-400">Live</span>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Dividends (This Year)</p>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 transition-all duration-300">
                ₹{Math.round(dividendData.totalDividends).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 transition-all duration-300">
                +{dividendData.yearOverYearChange.toFixed(1)}% vs last year
              </p>
            </div>

            <div className="space-y-3">
              {dividendData.recentDividends.map((div, index) => {
                const colors = [
                  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600' },
                  { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600' },
                  { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600' }
                ];
                const color = colors[index] || colors[0];
                return (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center`}>
                          <Icon name="TrendingUp" size={14} className={color.icon} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{div.company}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{div.quarter}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 transition-all duration-300">
                        ₹{Math.round(div.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Upcoming Dividends</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Next 30 days</span>
              </div>
              <div className="space-y-2">
                {dividendData.upcomingDividends.map((div, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">{div.company}</span>
                    <span className="font-semibold text-gray-900 dark:text-white transition-all duration-300">
                      ₹{Math.round(div.amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards for Mobile/Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:hidden">
        <button
          onClick={() => window.location.href = '/transaction-management?action=add'}
          className="p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={18} className="text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Add Investment</p>
              <p className="text-xs text-muted-foreground">Buy new stocks or ETFs</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => window.location.href = '/portfolio-rebalance'}
          className="p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <Icon name="Scale" size={18} className="text-violet-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Rebalance</p>
              <p className="text-xs text-muted-foreground">Optimize allocation</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => window.location.href = '/portfolio-reports'}
          className="p-4 bg-card border border-border rounded-lg hover:bg-muted transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={18} className="text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">Reports</p>
              <p className="text-xs text-muted-foreground">Performance analysis</p>
            </div>
          </div>
        </button>
      </div>

      {/* Mobile Quick Actions */}
      <div className="lg:hidden">
        <DashboardQuickActions />
      </div>

      {/* AI Rebalance Modal */}
      <AIRebalanceModal
        isOpen={showRebalanceModal}
        onClose={() => setShowRebalanceModal(false)}
        onConfirm={handleRebalanceConfirm}
        portfolioValue={portfolioData.totalValue}
      />

      {/* Investment Form Modal */}
      {showInvestmentForm && (
        <InvestmentForm
          onClose={() => setShowInvestmentForm(false)}
          onSubmit={handleInvestmentSubmit}
        />
      )}
    </div>
  );

};

export default InvestmentPortfolio;