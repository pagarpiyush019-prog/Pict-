import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { generatePortfolioInsights } from '../../../utils/geminiAI';

const PortfolioManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [portfolioData, setPortfolioData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Mock Portfolio Data
  const mockPortfolioData = {
    totalValue: 3395000,
    bonds: {
      totalValue: 850000,
      items: [
        { id: 1, name: 'Government Bonds', amount: 500000, maturityDate: '2028-12-31', interestRate: 7.5, rating: 'AAA' },
        { id: 2, name: 'Corporate Bonds', amount: 350000, maturityDate: '2027-06-30', interestRate: 8.2, rating: 'AA+' }
      ]
    },
    mutualFunds: {
      totalValue: 1245000,
      items: [
        { id: 1, name: 'Equity Fund', amount: 645000, returns: 14.5, fundType: 'Equity', riskLevel: 'High' },
        { id: 2, name: 'Debt Fund', amount: 400000, returns: 7.8, fundType: 'Debt', riskLevel: 'Low' },
        { id: 3, name: 'Hybrid Fund', amount: 200000, returns: 10.2, fundType: 'Hybrid', riskLevel: 'Medium' }
      ]
    },
    sips: {
      totalValue: 750000,
      items: [
        { id: 1, name: 'SIP - Large Cap', monthlyAmount: 15000, totalInvested: 360000, currentValue: 425000, returns: 18.1 },
        { id: 2, name: 'SIP - Mid Cap', monthlyAmount: 10000, totalInvested: 240000, currentValue: 285000, returns: 18.8 },
        { id: 3, name: 'SIP - Index Fund', monthlyAmount: 5000, totalInvested: 60000, currentValue: 40000, returns: -33.3 }
      ]
    },
    gold: {
      totalValue: 550000,
      items: [
        { id: 1, name: 'Physical Gold', amount: 300000, weight: 150, purity: '24K', purchaseDate: '2023-05-15' },
        { id: 2, name: 'Gold ETF', amount: 150000, units: 750, currentPrice: 200, returns: 12.5 },
        { id: 3, name: 'Sovereign Gold Bonds', amount: 100000, maturityDate: '2031-08-15', interestRate: 2.5 }
      ]
    },
    budget: {
      monthlyIncome: 125000,
      monthlyExpenses: 75000,
      monthlySavings: 50000,
      categories: [
        { name: 'Housing', allocated: 35000, spent: 35000, percentage: 46.7 },
        { name: 'Food', allocated: 15000, spent: 12500, percentage: 16.7 },
        { name: 'Transportation', allocated: 10000, spent: 8500, percentage: 11.3 },
        { name: 'Entertainment', allocated: 8000, spent: 9500, percentage: 10.7 },
        { name: 'Healthcare', allocated: 7000, spent: 5000, percentage: 6.7 },
        { name: 'Others', allocated: 0, spent: 4500, percentage: 6.0 }
      ]
    },
    diversification: {
      score: 7.8,
      metrics: [
        { name: 'Asset Class Spread', score: 8.5, status: 'good' },
        { name: 'Sector Distribution', score: 7.0, status: 'medium' },
        { name: 'Risk Balance', score: 8.2, status: 'good' },
        { name: 'Geographic Spread', score: 6.5, status: 'needs-improvement' }
      ],
      currentAllocation: [
        { category: 'Bonds', percentage: 29.9 },
        { category: 'Equity MF', percentage: 22.7 },
        { category: 'Debt MF', percentage: 14.1 },
        { category: 'Hybrid MF', percentage: 7.0 },
        { category: 'SIPs', percentage: 26.3 }
      ],
      recommendedAllocation: [
        { category: 'Bonds', percentage: 25.0 },
        { category: 'Equity MF', percentage: 30.0 },
        { category: 'Debt MF', percentage: 15.0 },
        { category: 'Hybrid MF', percentage: 10.0 },
        { category: 'SIPs', percentage: 20.0 }
      ]
    }
  };

  // Load user investments from localStorage
  const loadUserInvestments = () => {
    try {
      const userInvestments = JSON.parse(localStorage.getItem('userInvestments') || '[]');
      
      const bonds = { totalValue: 0, items: [] };
      const mutualFunds = { totalValue: 0, items: [] };
      const sips = { totalValue: 0, items: [] };
      
      userInvestments.forEach(inv => {
        const item = {
          id: inv.id,
          name: inv.name,
          amount: parseFloat(inv.amount),
          currentValue: parseFloat(inv.currentValue || inv.amount),
          interestRate: parseFloat(inv.interestRate?.replace('%', '') || 0),
          returns: parseFloat(inv.returns || 0),
          riskLevel: inv.riskLevel || 'Medium',
          tenure: inv.tenure,
          date: inv.date
        };
        
        if (inv.type === 'bonds') {
          bonds.items.push(item);
          bonds.totalValue += item.amount;
        } else if (inv.type === 'mutualFunds') {
          mutualFunds.items.push(item);
          mutualFunds.totalValue += item.amount;
        } else if (inv.type === 'sips') {
          sips.items.push(item);
          sips.totalValue += item.amount;
        }
      });
      
      return { bonds, mutualFunds, sips };
    } catch (error) {
      console.error('Error loading investments:', error);
      return { bonds: { totalValue: 0, items: [] }, mutualFunds: { totalValue: 0, items: [] }, sips: { totalValue: 0, items: [] } };
    }
  };

  // Load user budget from localStorage
  const loadUserBudget = () => {
    try {
      const savedBudget = localStorage.getItem('userBudget');
      if (savedBudget) {
        return JSON.parse(savedBudget);
      }
      return null;
    } catch (error) {
      console.error('Error loading budget:', error);
      return null;
    }
  };

  useEffect(() => {
    // Load data with user investments and budget
    const loadData = () => {
      const userInv = loadUserInvestments();
      const userBudget = loadUserBudget();
      
      // Merge user investments and budget with mock data
      const updatedMockData = {
        ...mockPortfolioData,
        totalValue: mockPortfolioData.totalValue + userInv.bonds.totalValue + userInv.mutualFunds.totalValue + userInv.sips.totalValue,
        bonds: {
          totalValue: mockPortfolioData.bonds.totalValue + userInv.bonds.totalValue,
          items: [...userInv.bonds.items, ...mockPortfolioData.bonds.items]
        },
        mutualFunds: {
          totalValue: mockPortfolioData.mutualFunds.totalValue + userInv.mutualFunds.totalValue,
          items: [...userInv.mutualFunds.items, ...mockPortfolioData.mutualFunds.items]
        },
        sips: {
          totalValue: mockPortfolioData.sips.totalValue + userInv.sips.totalValue,
          items: [...userInv.sips.items, ...mockPortfolioData.sips.items]
        },
        budget: userBudget || mockPortfolioData.budget
      };
      
      setPortfolioData(updatedMockData);
      setLoading(false);
      generateAIInsights(updatedMockData);
      generateMLPrediction(updatedMockData);
      
      return updatedMockData; // Return data for handleStorageChange
    };
    
    // Initial load
    setTimeout(loadData, 1000);
    
    // Listen for storage changes (when new investment or budget is updated)
    const handleStorageChange = () => {
      const updatedData = loadData();
      // Regenerate AI insights automatically when portfolio changes
      if (updatedData && !loading) {
        generateAIInsights(updatedData);
        generateMLPrediction(updatedData, selectedStock);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const generateAIInsights = async (data) => {
    setAiLoading(true);
    try {
      // Call real Gemini AI API
      const insights = await generatePortfolioInsights(data);
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      // Fallback insights are already handled in geminiAI.js
    } finally {
      setAiLoading(false);
    }
  };

  const generateMLPrediction = async (data, stockItem = null) => {
    setMlLoading(true);
    try {
      // Generate OHLCV data from portfolio data or specific stock (60 days x 6 features)
      const ohlcvData = stockItem ? generateStockOHLCVData(stockItem) : generateOHLCVData(data);
      
      // Call ML prediction API
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [ohlcvData]  // 60x6 array
        })
      });
      
      if (!response.ok) {
        throw new Error('ML API request failed');
      }
      
      const result = await response.json();
      console.log('Raw ML API response:', result);
      
      // Normalize prediction to 0-100 scale
      let normalizedScore = result.prediction;
      console.log('Raw prediction value:', normalizedScore);
      
      // Handle different prediction formats
      if (Array.isArray(normalizedScore)) {
        normalizedScore = normalizedScore[0]; // Take first element if array
      }
      
      // Convert to 0-100 scale based on the raw value range
      if (normalizedScore < 3) {
        // If prediction is small (0-2 range), scale up to 0-100
        normalizedScore = normalizedScore * 50;
      } else if (normalizedScore > 100) {
        // If prediction is large price value, normalize it differently
        // Map it to a 0-100 range based on relative performance
        normalizedScore = 50 + ((normalizedScore % 100) / 2); // Center around 50
      }
      
      // Clamp to 0-100 range
      normalizedScore = Math.max(0, Math.min(100, normalizedScore));
      
      setMlPrediction(normalizedScore);
      console.log('Normalized prediction (0-100):', normalizedScore);
    } catch (error) {
      console.error('Failed to generate ML prediction:', error);
      // Set fallback prediction on error
      setMlPrediction(null);
    } finally {
      setMlLoading(false);
    }
  };

  // Seeded random number generator for consistent results
  const seededRandom = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  // Helper function to generate OHLCV data from portfolio data
  const generateOHLCVData = (data) => {
    // Generate 60 days of historical OHLCV data based on portfolio values
    const ohlcvArray = [];
    const baseValue = data.totalValue;
    // Add current timestamp to seed for live updates while keeping consistency per minute
    const timeSeed = Math.floor(Date.now() / 60000); // Changes every minute
    const seed = baseValue + timeSeed; // Use portfolio value + time as seed
    
    for (let i = 0; i < 60; i++) {
      // Simulate realistic market variations with deterministic randomness
      const volatility = 0.02; // 2% daily volatility
      const trend = 1 + (i * 0.001); // Slight upward trend
      
      const rand1 = seededRandom(seed + i * 4);
      const rand2 = seededRandom(seed + i * 4 + 1);
      const rand3 = seededRandom(seed + i * 4 + 2);
      const rand4 = seededRandom(seed + i * 4 + 3);
      
      const open = baseValue * trend * (1 + (rand1 - 0.5) * volatility);
      const high = open * (1 + rand2 * volatility);
      const low = open * (1 - rand3 * volatility);
      const close = low + rand4 * (high - low);
      const volume = Math.floor(1000000 + rand1 * 5000000);
      const vwap = (high + low + close) / 3; // Volume Weighted Average Price
      
      ohlcvArray.push([open, high, low, close, volume, vwap]);
    }
    
    return ohlcvArray;
  };

  // Helper function to generate OHLCV data for specific stock/investment
  const generateStockOHLCVData = (stockItem) => {
    const ohlcvArray = [];
    const basePrice = stockItem.amount || stockItem.currentValue || 1000;
    
    // Add current timestamp for live updates (changes every minute)
    const timeSeed = Math.floor(Date.now() / 60000);
    
    // Create unique seed from stock properties + time for live updates
    const stockSeed = basePrice + (stockItem.id * 1000) + 
                      (stockItem.interestRate || stockItem.returns || 0) * 100 + 
                      timeSeed;
    
    // Determine volatility based on investment type
    let volatility = 0.015; // Default 1.5%
    if (stockItem.riskLevel === 'High') volatility = 0.03;
    else if (stockItem.riskLevel === 'Medium') volatility = 0.02;
    else if (stockItem.riskLevel === 'Low') volatility = 0.01;
    
    // Set trend based on returns
    const dailyReturn = stockItem.returns ? (stockItem.returns / 100) / 60 : 0.0005;
    
    for (let i = 0; i < 60; i++) {
      const trend = 1 + (i * dailyReturn);
      
      // Use seeded random for deterministic results
      const rand1 = seededRandom(stockSeed + i * 6);
      const rand2 = seededRandom(stockSeed + i * 6 + 1);
      const rand3 = seededRandom(stockSeed + i * 6 + 2);
      const rand4 = seededRandom(stockSeed + i * 6 + 3);
      const rand5 = seededRandom(stockSeed + i * 6 + 4);
      const rand6 = seededRandom(stockSeed + i * 6 + 5);
      
      const randomFactor = (rand1 - 0.5) * volatility;
      
      const open = basePrice * trend * (1 + randomFactor);
      const high = open * (1 + Math.abs(randomFactor) + rand2 * volatility);
      const low = open * (1 - Math.abs(randomFactor) - rand3 * volatility);
      const close = low + rand4 * (high - low);
      const volume = Math.floor(500000 + rand5 * 3000000);
      const vwap = (high + low + close) / 3;
      
      ohlcvArray.push([open, high, low, close, volume, vwap]);
    }
    
    return ohlcvArray;
  };

  const exportToPDF = () => {
    // Navigate to reports page for exporting
    window.location.href = '/reports';
  };

  const handleAddInvestment = () => {
    // Navigate to transaction management to add investment
    window.location.href = '/transaction-management?action=add';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Icon name="Loader" size={48} className="text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-0">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">Track and optimize your investment portfolio</p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 mt-2 lg:mt-0">
          <button
            onClick={exportToPDF}
            className="flex-1 md:flex-none px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Export
          </button>
          <button
            onClick={handleAddInvestment}
            className="flex-1 md:flex-none px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
          >
            Add Investment
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 scrollbar-hide">
          {['overview', 'diversification'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-gray-900 dark:text-white border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="hidden md:inline">{tab === 'overview' ? 'Portfolio Overview' : 'Asset Allocation & Risk Analysis'}</span>
              <span className="md:hidden">{tab === 'overview' ? 'Overview' : 'Allocation'}</span>
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {activeTab === 'overview' && (
            <PortfolioOverview 
              portfolioData={portfolioData}
              aiInsights={aiInsights}
              aiLoading={aiLoading}
              mlPrediction={mlPrediction}
              mlLoading={mlLoading}
              selectedStock={selectedStock}
              setSelectedStock={setSelectedStock}
              activeSubTab={activeSubTab}
              setActiveSubTab={setActiveSubTab}
              generateAIInsights={generateAIInsights}
              generateMLPrediction={generateMLPrediction}
            />
          )}
          {activeTab === 'diversification' && (
            <DiversificationAnalysis 
              portfolioData={portfolioData}
              aiInsights={aiInsights}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Portfolio Overview Component
const PortfolioOverview = ({ portfolioData, aiInsights, aiLoading, mlPrediction, mlLoading, selectedStock, setSelectedStock, activeSubTab, setActiveSubTab, generateAIInsights, generateMLPrediction }) => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Portfolio Dashboard Card */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-xl p-4 md:p-6 lg:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-3 md:gap-0">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-1">Portfolio Dashboard</h2>
            <p className="text-blue-100 text-xs md:text-sm">Financial summary and insights</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-blue-100 uppercase tracking-wide mb-1">Total Portfolio Value</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold">₹{(portfolioData.totalValue / 100000).toFixed(2)}L</p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="inline-flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-full md:w-auto">
        {['overview', 'investments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 text-xs md:text-sm font-medium capitalize rounded-md transition-all ${
              activeSubTab === tab
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === 'overview' && <OverviewSubTab portfolioData={portfolioData} aiInsights={aiInsights} aiLoading={aiLoading} mlPrediction={mlPrediction} mlLoading={mlLoading} selectedStock={selectedStock} setSelectedStock={setSelectedStock} generateAIInsights={generateAIInsights} generateMLPrediction={generateMLPrediction} />}
      {activeSubTab === 'investments' && <InvestmentsSubTab portfolioData={portfolioData} />}
    </div>
  );
};

// Overview Sub-Tab
const OverviewSubTab = ({ portfolioData, aiInsights, aiLoading, mlPrediction, mlLoading, selectedStock, setSelectedStock, generateAIInsights, generateMLPrediction }) => {
  const assetAllocation = [
    { name: 'Bonds', value: portfolioData.bonds.totalValue, color: '#3B82F6' },
    { name: 'Mutual Funds', value: portfolioData.mutualFunds.totalValue, color: '#8B5CF6' },
    { name: 'SIPs', value: portfolioData.sips.totalValue, color: '#F59E0B' },
    { name: 'Gold', value: portfolioData.gold.totalValue, color: '#EAB308' }
  ];

  // Combine all investment items for stock selection
  const allInvestments = [
    ...portfolioData.bonds.items.map(item => ({ ...item, type: 'Bond', category: 'Bonds' })),
    ...portfolioData.mutualFunds.items.map(item => ({ ...item, type: 'Mutual Fund', category: 'Mutual Funds' })),
    ...portfolioData.sips.items.map(item => ({ ...item, type: 'SIP', category: 'SIPs' })),
    ...portfolioData.gold.items.map(item => ({ ...item, type: 'Gold', category: 'Gold' }))
  ];

  const handleStockChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId === 'portfolio') {
      setSelectedStock(null);
      generateMLPrediction(portfolioData, null);
    } else {
      const stock = allInvestments.find(inv => inv.id.toString() === selectedId.split('-')[1] && inv.category === selectedId.split('-')[0]);
      setSelectedStock(stock);
      generateMLPrediction(portfolioData, stock);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <SummaryCard 
          title="Bonds" 
          value={portfolioData.bonds.totalValue}
          count={portfolioData.bonds.items.length}
          icon="Shield"
          color="purple"
        />
        <SummaryCard 
          title="Mutual Funds" 
          value={portfolioData.mutualFunds.totalValue}
          count={portfolioData.mutualFunds.items.length}
          icon="TrendingUp"
          color="pink"
        />
        <SummaryCard 
          title="SIPs" 
          value={portfolioData.sips.totalValue}
          count={portfolioData.sips.items.length}
          icon="Repeat"
          color="amber"
        />
        <SummaryCard 
          title="Gold" 
          value={portfolioData.gold.totalValue}
          count={portfolioData.gold.items.length}
          icon="Award"
          color="gold"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Asset Allocation Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="PieChart" size={14} className="text-gray-400 md:hidden" />
              <Icon name="PieChart" size={16} className="text-gray-400 hidden md:block" />
              <h2 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">Asset Allocation</h2>
            </div>
          </div>
          <div className="p-3 md:p-4">
            <SimplePieChart data={assetAllocation} />
          </div>
        </div>

        {/* Investment Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="BarChart3" size={14} className="text-gray-400 md:hidden" />
              <Icon name="BarChart3" size={16} className="text-gray-400 hidden md:block" />
              <h2 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">Investment Distribution</h2>
            </div>
          </div>
          <div className="p-3 md:p-4">
            <SimpleRadarChart data={assetAllocation} />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Icon name="Sparkles" size={16} className="text-gray-600 dark:text-gray-400 md:hidden" />
              <Icon name="Sparkles" size={20} className="text-gray-600 dark:text-gray-400 hidden md:block" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Insights</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Generated by Google Gemini & ML Model</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <select
              value={selectedStock ? `${selectedStock.category}-${selectedStock.id}` : 'portfolio'}
              onChange={handleStockChange}
              disabled={mlLoading}
              className="flex-1 md:flex-none px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
            >
              <option value="portfolio">Full Portfolio</option>
              <optgroup label="Bonds">
                {portfolioData.bonds.items.map(item => (
                  <option key={`Bonds-${item.id}`} value={`Bonds-${item.id}`}>{item.name}</option>
                ))}
              </optgroup>
              <optgroup label="Mutual Funds">
                {portfolioData.mutualFunds.items.map(item => (
                  <option key={`Mutual Funds-${item.id}`} value={`Mutual Funds-${item.id}`}>{item.name}</option>
                ))}
              </optgroup>
              <optgroup label="SIPs">
                {portfolioData.sips.items.map(item => (
                  <option key={`SIPs-${item.id}`} value={`SIPs-${item.id}`}>{item.name}</option>
                ))}
              </optgroup>
              <optgroup label="Gold">
                {portfolioData.gold.items.map(item => (
                  <option key={`Gold-${item.id}`} value={`Gold-${item.id}`}>{item.name}</option>
                ))}
              </optgroup>
            </select>
            <button
              onClick={() => {
                generateAIInsights(portfolioData);
                generateMLPrediction(portfolioData, selectedStock);
              }}
              disabled={aiLoading || mlLoading}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="RefreshCw" size={14} className={`inline mr-1 ${(aiLoading || mlLoading) ? 'animate-spin' : ''} md:hidden`} />
              <Icon name="RefreshCw" size={16} className={`inline mr-1 ${(aiLoading || mlLoading) ? 'animate-spin' : ''} hidden md:inline`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
          </div>
        </div>
        
        {(aiLoading || mlLoading) ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader" size={32} className="text-purple-600 animate-spin" />
            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Generating AI insights...</span>
          </div>
        ) : (
          <>
          {/* ML Prediction Section */}
          {mlPrediction !== null && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon name="TrendingUp" size={20} className="text-gray-600 dark:text-gray-400" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">ML Market Prediction</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {selectedStock ? `${selectedStock.name} (${selectedStock.type})` : 'Full Portfolio'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prediction Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{mlPrediction.toFixed(1)}</p>
                  <p className={`text-xs font-medium mt-1 ${
                    mlPrediction < 40 ? 'text-red-600' : 
                    mlPrediction < 60 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {mlPrediction < 40 ? '📉 Sell Signal' : mlPrediction < 60 ? '⏸️ Hold Signal' : '📈 Buy Signal'}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Outlook</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {mlPrediction >= 60 ? 'Bullish ↗' : mlPrediction >= 40 ? 'Neutral →' : 'Bearish ↘'}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence Level</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(mlPrediction > 70 || mlPrediction < 30) ? 'High' : 
                     (mlPrediction > 65 || mlPrediction < 35) ? 'Medium' : 'Low'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                <Icon name="Info" size={12} className="inline mr-1" />
                Based on 60-day OHLCV analysis using machine learning model • 0-40: Sell • 40-60: Hold • 60-100: Buy
              </p>
            </div>
          )}
          
          {aiInsights ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icon name="Info" size={16} className="text-gray-600 dark:text-gray-400" />
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {aiInsights.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Icon name="CheckCircle" size={16} className="text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Icon name="Lightbulb" size={16} className="text-gray-600 dark:text-gray-400" />
                  Smart Tips
                </h4>
                <ul className="space-y-2">
                  {aiInsights.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Icon name="ArrowRight" size={16} className="text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Icon name="AlertCircle" size={32} className="text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Unable to generate AI insights</p>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};

// Investments Sub-Tab
const InvestmentsSubTab = ({ portfolioData }) => {
  return (
    <div className="space-y-6">
      {/* Bonds Section */}
      <InvestmentSection 
        title="Bonds" 
        icon="Shield"
        color="purple"
        items={portfolioData.bonds.items}
        total={portfolioData.bonds.totalValue}
        type="bonds"
      />

      {/* Mutual Funds Section */}
      <InvestmentSection 
        title="Mutual Funds" 
        icon="TrendingUp"
        color="pink"
        items={portfolioData.mutualFunds.items}
        total={portfolioData.mutualFunds.totalValue}
        type="mutualFunds"
      />

      {/* SIPs Section */}
      <InvestmentSection 
        title="SIPs" 
        icon="Repeat"
        color="amber"
        items={portfolioData.sips.items}
        total={portfolioData.sips.totalValue}
        type="sips"
      />

      {/* Gold Section */}
      <InvestmentSection 
        title="Gold" 
        icon="Award"
        color="gold"
        items={portfolioData.gold.items}
        total={portfolioData.gold.totalValue}
        type="gold"
      />
    </div>
  );
};

// Budget Sub-Tab
const BudgetSubTab = ({ portfolioData }) => {
  const { budget } = portfolioData;
  const utilizationPercentage = (budget.monthlyExpenses / budget.monthlyIncome) * 100;
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState(null);

  const handleEditBudget = () => {
    setEditingBudget(JSON.parse(JSON.stringify(budget)));
    setShowEditModal(true);
  };

  const handleSaveBudget = () => {
    // Save to localStorage
    localStorage.setItem('userBudget', JSON.stringify(editingBudget));
    setShowEditModal(false);
    
    // Trigger storage event for live update
    window.dispatchEvent(new Event('storage'));
    
    alert('Budget updated successfully!');
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = { ...editingBudget };
    updated.categories[index][field] = parseFloat(value) || 0;
    
    // Recalculate percentages and totals
    const totalSpent = updated.categories.reduce((sum, cat) => sum + cat.spent, 0);
    updated.monthlyExpenses = totalSpent;
    updated.monthlySavings = updated.monthlyIncome - totalSpent;
    
    updated.categories.forEach(cat => {
      cat.percentage = totalSpent > 0 ? (cat.spent / totalSpent) * 100 : 0;
    });
    
    setEditingBudget(updated);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Budget Header with Edit Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white">Budget Management</h3>
        <button
          onClick={handleEditBudget}
          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg md:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-xs md:text-sm"
        >
          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="hidden md:inline">Edit Budget</span>
          <span className="md:hidden">Edit</span>
        </button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-100 dark:border-green-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase">Monthly Income</p>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400 flex items-center justify-center">
              <Icon name="TrendingUp" size={16} className="md:hidden" />
              <Icon name="TrendingUp" size={18} className="hidden md:block" />
            </div>
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">₹{(budget.monthlyIncome / 1000).toFixed(0)}K</p>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-md">
              Income Source
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-red-100 dark:border-red-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-red-700 dark:text-red-300 uppercase">Monthly Expenses</p>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Icon name="TrendingDown" size={16} className="md:hidden" />
              <Icon name="TrendingDown" size={18} className="hidden md:block" />
            </div>
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">₹{(budget.monthlyExpenses / 1000).toFixed(0)}K</p>
            <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-md">
              {utilizationPercentage.toFixed(0)}% of Income
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-100 dark:border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Monthly Savings</p>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icon name="PiggyBank" size={16} className="md:hidden" />
              <Icon name="PiggyBank" size={18} className="hidden md:block" />
            </div>
          </div>
          <div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">₹{(budget.monthlySavings / 1000).toFixed(0)}K</p>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-md">
              {((budget.monthlySavings / budget.monthlyIncome) * 100).toFixed(0)}% Savings Rate
            </span>
          </div>
        </div>
      </div>

      {/* Budget Utilization Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-3 md:px-5 py-2.5 md:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-2.5">
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Icon name="PieChart" size={16} className="md:hidden" />
              <Icon name="PieChart" size={20} className="hidden md:block" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-white">Category Breakdown</h3>
          </div>
          <div className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs font-bold ${
            utilizationPercentage > 90 ? 'bg-red-500 text-white' :
            utilizationPercentage > 75 ? 'bg-amber-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {utilizationPercentage.toFixed(0)}%
          </div>
        </div>
        
        <div className="p-3 md:p-4 space-y-3">
          {/* Overall Health */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-3.5 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Overall Health</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {utilizationPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  utilizationPercentage > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                  utilizationPercentage > 75 ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                  'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${utilizationPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {budget.categories.map((category, idx) => {
              const categoryPercentage = (category.spent / (category.allocated || category.spent)) * 100;
              const isOverBudget = category.spent > category.allocated;
              const categoryColors = [
                { bg: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20', border: 'border-purple-200 dark:border-purple-700', text: 'text-purple-700 dark:text-purple-300', accent: 'text-purple-900 dark:text-purple-100' },
                { bg: 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20', border: 'border-pink-200 dark:border-pink-700', text: 'text-pink-700 dark:text-pink-300', accent: 'text-pink-900 dark:text-pink-100' },
                { bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300', accent: 'text-blue-900 dark:text-blue-100' },
                { bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20', border: 'border-green-200 dark:border-green-700', text: 'text-green-700 dark:text-green-300', accent: 'text-green-900 dark:text-green-100' },
                { bg: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20', border: 'border-amber-200 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-300', accent: 'text-amber-900 dark:text-amber-100' },
                { bg: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20', border: 'border-indigo-200 dark:border-indigo-700', text: 'text-indigo-700 dark:text-indigo-300', accent: 'text-indigo-900 dark:text-indigo-100' },
              ];
              const colorScheme = categoryColors[idx % categoryColors.length];
              
              return (
                <div 
                  key={idx} 
                  className={`bg-gradient-to-br ${isOverBudget ? 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-300 dark:border-red-700' : colorScheme.bg + ' ' + colorScheme.border} border rounded-xl p-4 hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold mb-1 ${isOverBudget ? 'text-red-900 dark:text-red-200' : colorScheme.accent}`}>
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Budget: ₹{(category.allocated / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg ${isOverBudget ? 'bg-red-100 dark:bg-red-900/30' : 'bg-white/50 dark:bg-gray-800/50'} flex items-center justify-center shadow-sm`}>
                      <span className={`text-lg font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : colorScheme.text}`}>
                        {categoryPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Spent</span>
                      <span className={`text-xl font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        ₹{(category.spent / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                      }`}
                      style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                    />
                  </div>
                  
                  {isOverBudget && (
                    <div className="mt-3 flex items-center gap-1.5 text-red-600 dark:text-red-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-xs font-bold">
                        Over by ₹{((category.spent - category.allocated) / 1000).toFixed(1)}K
                      </span>
                    </div>
                  )}
                  
                  {!isOverBudget && categoryPercentage < 100 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      ₹{((category.allocated - category.spent) / 1000).toFixed(1)}K remaining
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Budget Allocation Pie Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
            <Icon name="DollarSign" size={18} className="text-purple-600 md:hidden" />
            <Icon name="DollarSign" size={20} className="text-purple-600 hidden md:block" />
            Budget Allocation
          </h3>
          <SimplePieChart data={budget.categories.map(c => ({
            name: c.name,
            value: c.spent,
            color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6366f1'][budget.categories.indexOf(c) % 6]
          }))} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-3 md:px-6 py-3 md:py-4 border-b border-indigo-100 dark:border-indigo-700">
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Icon name="List" size={18} className="text-indigo-600 md:hidden" />
              <Icon name="List" size={20} className="text-indigo-600 hidden md:block" />
              Category Breakdown
            </h3>
          </div>
          <div className="p-3 md:p-6">
            <div className="overflow-x-auto -mx-3 md:-mx-6 px-3 md:px-6">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left px-2 md:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Category</th>
                    <th className="text-right px-2 md:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Spent</th>
                    <th className="text-right px-2 md:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.categories.map((category, idx) => (
                    <tr key={idx} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-2 md:px-4 py-3 md:py-4 text-gray-900 dark:text-white font-semibold">{category.name}</td>
                      <td className="text-right px-2 md:px-4 py-3 md:py-4 text-gray-900 dark:text-white font-bold text-sm md:text-base">₹{category.spent.toLocaleString()}</td>
                      <td className="text-right px-2 md:px-4 py-3 md:py-4">
                        <span className="text-sm md:text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {category.percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-200 dark:border-gray-600 font-bold">
                    <td className="px-2 md:px-4 py-3 md:py-4 text-gray-900 dark:text-white text-sm md:text-base">Total</td>
                    <td className="text-right px-2 md:px-4 py-3 md:py-4 text-gray-900 dark:text-white text-base md:text-lg">₹{budget.monthlyExpenses.toLocaleString()}</td>
                    <td className="text-right px-2 md:px-4 py-3 md:py-4 text-purple-600 dark:text-purple-400 text-sm md:text-base">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Edit Modal */}
      {showEditModal && editingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 md:p-6 rounded-t-xl md:rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold">Edit Budget</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 md:p-2 transition-colors"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Income Input */}
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 text-base md:text-lg">₹</span>
                  <input
                    type="number"
                    value={editingBudget.monthlyIncome}
                    onChange={(e) => {
                      const updated = { ...editingBudget };
                      updated.monthlyIncome = parseFloat(e.target.value) || 0;
                      updated.monthlySavings = updated.monthlyIncome - updated.monthlyExpenses;
                      setEditingBudget(updated);
                    }}
                    className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter monthly income"
                  />
                </div>
              </div>

              {/* Category Allocations */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Expense Categories</h3>
                <div className="space-y-3 md:space-y-4">
                  {editingBudget.categories.map((category, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg md:rounded-xl p-3 md:p-4">
                      <h4 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mb-2 md:mb-3">{category.name}</h4>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Allocated
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                            <input
                              type="number"
                              value={category.allocated}
                              onChange={(e) => handleCategoryChange(index, 'allocated', e.target.value)}
                              className="w-full pl-6 md:pl-8 pr-2 md:pr-3 py-1.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-xs md:text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Spent
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                            <input
                              type="number"
                              value={category.spent}
                              onChange={(e) => handleCategoryChange(index, 'spent', e.target.value)}
                              className="w-full pl-6 md:pl-8 pr-2 md:pr-3 py-1.5 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-xs md:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {category.spent > category.allocated && (
                          <span className="text-red-600 dark:text-red-400 font-bold">
                            ⚠️ Over budget by ₹{(category.spent - category.allocated).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-100 dark:border-blue-700">
                <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 md:mb-3">Budget Summary</h3>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Total Income:</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{editingBudget.monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Total Expenses:</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{editingBudget.monthlyExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
                    <span className="text-gray-700 dark:text-gray-300 font-bold">Savings:</span>
                    <span className={`font-bold ${editingBudget.monthlySavings >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ₹{editingBudget.monthlySavings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 pt-2 md:pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg md:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBudget}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg md:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  Save Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AI Portfolio Recommendations Component
const AIPortfolioRecommendations = ({ portfolioData, aiInsights }) => {
  const { bonds, mutualFunds, sips, gold, totalValue } = portfolioData;

  // Calculate current allocation dynamically from actual holdings
  const currentAllocation = React.useMemo(() => {
    const bondValue = bonds.totalValue;
    const equityMFValue = mutualFunds.items.filter(m => m.type === 'Equity').reduce((sum, m) => sum + (m.currentValue || 0), 0);
    const debtMFValue = mutualFunds.items.filter(m => m.type === 'Debt').reduce((sum, m) => sum + (m.currentValue || 0), 0);
    const hybridMFValue = mutualFunds.items.filter(m => m.type === 'Hybrid').reduce((sum, m) => sum + (m.currentValue || 0), 0);
    const sipValue = sips.totalValue;
    const goldValue = gold?.totalValue || 0;

    return [
      { category: 'Bonds', percentage: (bondValue / totalValue) * 100, value: bondValue, color: 'purple' },
      { category: 'Equity MF', percentage: (equityMFValue / totalValue) * 100, value: equityMFValue, color: 'pink' },
      { category: 'Debt MF', percentage: (debtMFValue / totalValue) * 100, value: debtMFValue, color: 'blue' },
      { category: 'Hybrid MF', percentage: (hybridMFValue / totalValue) * 100, value: hybridMFValue, color: 'indigo' },
      { category: 'SIPs', percentage: (sipValue / totalValue) * 100, value: sipValue, color: 'amber' },
      { category: 'Gold', percentage: (goldValue / totalValue) * 100, value: goldValue, color: 'yellow' }
    ].filter(item => item.value > 0);
  }, [bonds, mutualFunds, sips, gold, totalValue]);

  // Generate recommended allocation based on current portfolio
  const recommendedAllocation = React.useMemo(() => {
    const bondPercent = (bonds.totalValue / totalValue) * 100;
    const equityPercent = ((mutualFunds.items.filter(m => m.type === 'Equity').reduce((sum, m) => sum + (m.currentValue || 0), 0) + sips.totalValue) / totalValue) * 100;
    
    // AI recommendation logic
    let recommendations = [];
    
    if (bondPercent > 35) {
      // Too conservative
      recommendations = [
        { category: 'Bonds', percentage: 25, explanation: 'Reduce bond allocation for better growth potential' },
        { category: 'Equity MF', percentage: 35, explanation: 'Increase equity exposure for long-term wealth creation' },
        { category: 'Debt MF', percentage: 15, explanation: 'Maintain stable debt component' },
        { category: 'Hybrid MF', percentage: 10, explanation: 'Balanced risk-reward option' },
        { category: 'SIPs', percentage: 15, explanation: 'Systematic equity accumulation' }
      ];
    } else if (equityPercent > 60) {
      // Too aggressive
      recommendations = [
        { category: 'Bonds', percentage: 30, explanation: 'Increase bonds for portfolio stability' },
        { category: 'Equity MF', percentage: 25, explanation: 'Reduce equity concentration risk' },
        { category: 'Debt MF', percentage: 20, explanation: 'Add debt for risk mitigation' },
        { category: 'Hybrid MF', percentage: 15, explanation: 'Diversify with hybrid funds' },
        { category: 'SIPs', percentage: 10, explanation: 'Maintain disciplined equity investment' }
      ];
    } else {
      // Well balanced
      recommendations = [
        { category: 'Bonds', percentage: 28, explanation: 'Optimal safety allocation' },
        { category: 'Equity MF', percentage: 30, explanation: 'Growth-oriented allocation' },
        { category: 'Debt MF', percentage: 17, explanation: 'Stability component' },
        { category: 'Hybrid MF', percentage: 10, explanation: 'Balanced exposure' },
        { category: 'SIPs', percentage: 15, explanation: 'Systematic investment' }
      ];
    }

    return recommendations.map(r => ({
      ...r,
      value: (totalValue * r.percentage) / 100,
      difference: r.percentage - (currentAllocation.find(c => c.category === r.category)?.percentage || 0)
    }));
  }, [currentAllocation, bonds, mutualFunds, sips, totalValue]);

  // Generate specific actions
  const rebalancingActions = React.useMemo(() => {
    const actions = [];
    
    recommendedAllocation.forEach(rec => {
      const current = currentAllocation.find(c => c.category === rec.category);
      const diff = rec.difference;
      
      if (Math.abs(diff) > 3) {
        if (diff > 0) {
          actions.push({
            action: `Increase ${rec.category}`,
            amount: Math.abs(rec.value - (current?.value || 0)),
            currentPercent: current?.percentage || 0,
            targetPercent: rec.percentage,
            explanation: rec.explanation,
            type: 'increase'
          });
        } else {
          actions.push({
            action: `Reduce ${rec.category}`,
            amount: Math.abs(rec.value - (current?.value || 0)),
            currentPercent: current?.percentage || 0,
            targetPercent: rec.percentage,
            explanation: rec.explanation,
            type: 'decrease'
          });
        }
      }
    });
    
    return actions.sort((a, b) => Math.abs(b.currentPercent - b.targetPercent) - Math.abs(a.currentPercent - a.targetPercent));
  }, [currentAllocation, recommendedAllocation]);

  const getColorScheme = (category) => {
    const schemes = {
      'Bonds': { from: 'from-purple-500', to: 'to-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
      'Equity MF': { from: 'from-pink-500', to: 'to-rose-700', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
      'Debt MF': { from: 'from-blue-500', to: 'to-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
      'Hybrid MF': { from: 'from-indigo-500', to: 'to-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
      'SIPs': { from: 'from-amber-500', to: 'to-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
      'Gold': { from: 'from-yellow-500', to: 'to-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' }
    };
    return schemes[category] || schemes['Bonds'];
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-full mb-4 shadow-md">
            <Icon name="Sparkles" size={20} className="text-white" />
            <span className="text-white font-bold text-sm uppercase tracking-wide">AI-Powered Insights</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Portfolio Optimization
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Watch your portfolio transform with intelligent recommendations</p>
        </div>

        {/* Comparison Visualization */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Current State</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">Your Portfolio</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <Icon name="ArrowRight" size={32} className="text-purple-600 dark:text-purple-400" />
                <div className="h-1 w-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">AI Optimized</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">Target State</p>
              </div>
            </div>

            {/* Side by Side Bars */}
            <div className="space-y-4">
              {currentAllocation.map((current, idx) => {
                const recommended = recommendedAllocation.find(r => r.category === current.category);
                const colors = getColorScheme(current.category);
                const diff = recommended ? recommended.difference : 0;
                
                return (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{current.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">₹{(current.value / 1000).toFixed(0)}K</span>
                        {diff !== 0 && (
                          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            diff > 0 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'
                          }`}>
                            {diff > 0 ? '↑' : '↓'} {Math.abs(diff).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Current Bar */}
                      <div className="flex-1 relative">
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                          <div 
                            className={`h-full bg-gradient-to-r ${colors.from} ${colors.to} transition-all duration-1000 ease-out relative overflow-hidden`}
                            style={{ width: `${current.percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20"></div>
                          </div>
                        </div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-900 dark:text-white bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded">
                          {current.percentage.toFixed(1)}%
                        </span>
                      </div>

                      {/* Arrow Indicator */}
                      <div className="w-8 flex justify-center">
                        {diff !== 0 && (
                          <Icon 
                            name={diff > 0 ? "TrendingUp" : "TrendingDown"} 
                            size={20} 
                            className={diff > 0 ? "text-green-600" : "text-red-600"}
                          />
                        )}
                      </div>

                      {/* Recommended Bar */}
                      <div className="flex-1 relative">
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-purple-300 dark:border-purple-700">
                          <div 
                            className={`h-full bg-gradient-to-r ${colors.from} ${colors.to} transition-all duration-1000 ease-out relative overflow-hidden`}
                            style={{ width: `${recommended?.percentage || 0}%` }}
                          >
                            <div className="absolute inset-0 bg-white/30"></div>
                          </div>
                        </div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-900 dark:text-white bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded">
                          {recommended?.percentage.toFixed(1) || 0}%
                        </span>
                      </div>
                    </div>

                    {/* Explanation */}
                    {recommended && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 pl-2 italic">{recommended.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-5 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-green-700 dark:text-green-300 font-bold uppercase">Growth Potential</p>
                <p className="text-2xl font-black text-green-900 dark:text-white">+{Math.abs(recommendedAllocation.reduce((sum, r) => sum + r.difference, 0) / 2).toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">Enhanced equity exposure</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-bold uppercase">Risk Balance</p>
                <p className="text-2xl font-black text-blue-900 dark:text-white">Optimized</p>
              </div>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">Better diversification</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                <Icon name="Target" size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-purple-700 dark:text-purple-300 font-bold uppercase">Changes Needed</p>
                <p className="text-2xl font-black text-purple-900 dark:text-white">{rebalancingActions.length}</p>
              </div>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">Allocation adjustments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Asset Allocation & Risk Analysis Component
const DiversificationAnalysis = ({ portfolioData, aiInsights }) => {
  const { diversification, bonds, mutualFunds, sips, gold, totalValue } = portfolioData;

  // Calculate dynamic percentages
  const bondPercentage = ((bonds.totalValue / totalValue) * 100).toFixed(1);
  const mfPercentage = ((mutualFunds.totalValue / totalValue) * 100).toFixed(1);
  const sipPercentage = ((sips.totalValue / totalValue) * 100).toFixed(1);
  const goldPercentage = gold ? ((gold.totalValue / totalValue) * 100).toFixed(1) : 0;

  // Calculate risk distribution dynamically
  const highRiskAssets = mutualFunds.items.filter(m => m.riskLevel === 'High');
  const mediumRiskAssets = [...mutualFunds.items.filter(m => m.riskLevel === 'Medium'), ...sips.items];
  const lowRiskAssets = [...bonds.items, ...mutualFunds.items.filter(m => m.riskLevel === 'Low')];
  
  const highRiskValue = highRiskAssets.reduce((sum, a) => sum + (a.amount || a.currentValue || 0), 0);
  const mediumRiskValue = mediumRiskAssets.reduce((sum, a) => sum + (a.amount || a.currentValue || 0), 0);
  const lowRiskValue = lowRiskAssets.reduce((sum, a) => sum + (a.amount || a.currentValue || 0), 0);
  
  const highRiskPercent = ((highRiskValue / totalValue) * 100).toFixed(0);
  const mediumRiskPercent = ((mediumRiskValue / totalValue) * 100).toFixed(0);
  const lowRiskPercent = ((lowRiskValue / totalValue) * 100).toFixed(0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Asset Allocation Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-5 flex items-center gap-2">
          <Icon name="PieChart" size={18} className="text-blue-600 md:hidden" />
          <Icon name="PieChart" size={22} className="text-blue-600 hidden md:block" />
          Asset Allocation Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-semibold text-purple-700 dark:text-purple-300">Bonds</span>
              <Icon name="Shield" size={16} className="text-purple-600 md:hidden" />
              <Icon name="Shield" size={18} className="text-purple-600 hidden md:block" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100">{bondPercentage}%</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">₹{(bonds.totalValue / 100000).toFixed(2)}L</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-pink-200 dark:border-pink-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-semibold text-pink-700 dark:text-pink-300">Mutual Funds</span>
              <Icon name="TrendingUp" size={16} className="text-pink-600 md:hidden" />
              <Icon name="TrendingUp" size={18} className="text-pink-600 hidden md:block" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-pink-900 dark:text-pink-100">{mfPercentage}%</p>
            <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">₹{(mutualFunds.totalValue / 100000).toFixed(2)}L</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-amber-200 dark:border-amber-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs md:text-sm font-semibold text-amber-700 dark:text-amber-300">SIPs</span>
              <Icon name="Repeat" size={16} className="text-amber-600 md:hidden" />
              <Icon name="Repeat" size={18} className="text-amber-600 hidden md:block" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100">{sipPercentage}%</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">₹{(sips.totalValue / 100000).toFixed(2)}L</p>
          </div>
          
          {gold && gold.totalValue > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg md:rounded-xl p-3 md:p-4 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs md:text-sm font-semibold text-yellow-700 dark:text-yellow-300">Gold</span>
                <Icon name="Award" size={16} className="text-yellow-600 md:hidden" />
                <Icon name="Award" size={18} className="text-yellow-600 hidden md:block" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-100">{goldPercentage}%</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">₹{(gold.totalValue / 100000).toFixed(2)}L</p>
            </div>
          )}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-5 flex items-center gap-2">
          <Icon name="AlertTriangle" size={18} className="text-orange-600 md:hidden" />
          <Icon name="AlertTriangle" size={22} className="text-orange-600 hidden md:block" />
          Risk Assessment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* High Risk Card */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg md:rounded-xl p-4 md:p-5 border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Icon name="AlertCircle" size={18} className="text-red-600 md:hidden" />
                <Icon name="AlertCircle" size={20} className="text-red-600 hidden md:block" />
              </div>
              <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${
                parseFloat(highRiskPercent) > 40 ? 'bg-red-500 text-white' : 
                'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300'
              }`}>
                {parseFloat(highRiskPercent) > 40 ? 'Alert' : 'Caution'}
              </div>
            </div>
            <h4 className="text-xs md:text-sm font-bold text-red-900 dark:text-red-200 mb-2">High Risk</h4>
            <p className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{highRiskPercent}%</p>
            <div className="flex items-center justify-between text-xs text-red-700 dark:text-red-300 mb-2 md:mb-3">
              <span>{highRiskAssets.length} assets</span>
              <span>₹{(highRiskValue / 100000).toFixed(2)}L</span>
            </div>
            <div className="w-full h-1.5 md:h-2 bg-red-200 dark:bg-red-900/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" style={{ width: `${highRiskPercent}%` }} />
            </div>
          </div>

          {/* Medium Risk Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg md:rounded-xl p-4 md:p-5 border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Icon name="TrendingUp" size={18} className="text-amber-600 md:hidden" />
                <Icon name="TrendingUp" size={20} className="text-amber-600 hidden md:block" />
              </div>
              <div className="px-2 md:px-3 py-1 rounded-full text-xs font-bold bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300">
                Balanced
              </div>
            </div>
            <h4 className="text-xs md:text-sm font-bold text-amber-900 dark:text-amber-200 mb-2">Medium Risk</h4>
            <p className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">{mediumRiskPercent}%</p>
            <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 mb-2 md:mb-3">
              <span>{mediumRiskAssets.length} assets</span>
              <span>₹{(mediumRiskValue / 100000).toFixed(2)}L</span>
            </div>
            <div className="w-full h-1.5 md:h-2 bg-amber-200 dark:bg-amber-900/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500" style={{ width: `${mediumRiskPercent}%` }} />
            </div>
          </div>

          {/* Low Risk Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg md:rounded-xl p-4 md:p-5 border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Icon name="Shield" size={18} className="text-green-600 md:hidden" />
                <Icon name="Shield" size={20} className="text-green-600 hidden md:block" />
              </div>
              <div className="px-2 md:px-3 py-1 rounded-full text-xs font-bold bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300">
                Safe
              </div>
            </div>
            <h4 className="text-xs md:text-sm font-bold text-green-900 dark:text-green-200 mb-2">Low Risk</h4>
            <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{lowRiskPercent}%</p>
            <div className="flex items-center justify-between text-xs text-green-700 dark:text-green-300 mb-2 md:mb-3">
              <span>{lowRiskAssets.length} assets</span>
              <span>₹{(lowRiskValue / 100000).toFixed(2)}L</span>
            </div>
            <div className="w-full h-1.5 md:h-2 bg-green-200 dark:bg-green-900/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500" style={{ width: `${lowRiskPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Portfolio Recommendations */}
      {aiInsights && (
        <AIPortfolioRecommendations portfolioData={portfolioData} aiInsights={aiInsights} />
      )}
    </div>
  );
};

// Helper Components
const SummaryCard = ({ title, value, count, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 lg:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 md:mb-4">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">₹{(value / 100000).toFixed(2)}L</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{count} active</p>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center">
          <Icon name={icon} size={16} className="md:hidden" />
          <Icon name={icon} size={20} className="hidden md:block lg:hidden" />
          <Icon name={icon} size={24} className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
};

const InvestmentSection = ({ title, icon, color, items, total, type }) => {
  const iconColors = {
    purple: 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 text-purple-600 border-purple-200 dark:border-purple-700',
    pink: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-600 border-pink-200 dark:border-pink-700',
    amber: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 border-amber-200 dark:border-amber-700',
    gold: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 text-yellow-600 border-yellow-200 dark:border-yellow-700'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className={`px-3 md:px-4 lg:px-6 py-3 md:py-4 border-b border-gray-100 dark:border-gray-700 ${iconColors[color]}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-lg md:rounded-xl border flex items-center justify-center shadow-sm ${iconColors[color]}`}>
              <Icon name={icon} size={16} className="md:hidden" />
              <Icon name={icon} size={20} className="hidden md:block lg:hidden" />
              <Icon name={icon} size={22} className="hidden lg:block" />
            </div>
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</p>
            <p className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">₹{(total / 100000).toFixed(2)}L</p>
          </div>
        </div>
      </div>
      
      <div className="p-3 md:p-4 lg:p-6">
        <div className="overflow-x-auto -mx-3 md:-mx-4 lg:-mx-6 px-3 md:px-4 lg:px-6">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Name</th>
                <th className="text-right px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Amount</th>
              {type === 'bonds' && (
                <>
                  <th className="text-right px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Interest</th>
                  <th className="text-center px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider hidden md:table-cell">Rating</th>
                </>
              )}
              {type === 'mutualFunds' && (
                <>
                  <th className="text-right px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Returns</th>
                  <th className="text-center px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider hidden md:table-cell">Risk</th>
                </>
              )}
              {type === 'sips' && (
                <>
                  <th className="text-right px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider hidden md:table-cell">Monthly</th>
                  <th className="text-right px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Returns</th>
                </>
              )}
              {type === 'gold' && (
                <>
                  <th className="text-right px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider hidden md:table-cell">Details</th>
                  <th className="text-right px-2 md:px-3 lg:px-4 py-2 md:py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Returns</th>
                </>
              )}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                  <td className="px-2 md:px-3 lg:px-4 py-3 md:py-4 text-gray-900 dark:text-white font-semibold">{item.name}</td>
                  <td className="text-right px-2 md:px-3 lg:px-4 py-3 md:py-4 text-gray-900 dark:text-white font-bold text-sm md:text-base">₹{(item.amount / 1000).toFixed(0)}K</td>
                  {type === 'bonds' && (
                    <>
                      <td className="text-right px-2 md:px-3 lg:px-4 py-3 md:py-4 text-green-600 dark:text-green-400 font-bold text-sm md:text-base">{item.interestRate}%</td>
                      <td className="text-center px-2 md:px-3 lg:px-4 py-3 md:py-4 hidden md:table-cell">
                        <span className="px-2 md:px-3 py-1 md:py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg">
                          {item.rating}
                        </span>
                      </td>
                    </>
                  )}
                  {type === 'mutualFunds' && (
                    <>
                      <td className="text-right px-2 md:px-3 lg:px-4 py-3 md:py-4 text-green-600 dark:text-green-400 font-bold text-sm md:text-base">+{item.returns}%</td>
                      <td className="text-center px-2 md:px-3 lg:px-4 py-3 md:py-4 hidden md:table-cell">
                        <span className={`px-2 md:px-3 py-1 md:py-1.5 text-xs font-bold rounded-lg ${
                          item.riskLevel === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          item.riskLevel === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                          'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                          {item.riskLevel}
                        </span>
                      </td>
                    </>
                  )}
                  {type === 'sips' && (
                    <>
                      <td className="text-right px-2 md:px-3 lg:px-4 py-3 md:py-4 text-gray-900 dark:text-white font-semibold text-sm md:text-base hidden md:table-cell">₹{(item.monthlyAmount / 1000).toFixed(0)}K</td>
                      <td className={`text-right px-2 md:px-3 lg:px-4 py-3 md:py-4 font-bold text-sm md:text-base ${item.returns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {item.returns >= 0 ? '+' : ''}{item.returns.toFixed(1)}%
                      </td>
                    </>
                  )}
                  {type === 'gold' && (
                    <>
                      <td className="text-right px-4 py-4 text-gray-600 dark:text-gray-400 text-xs font-medium">
                        {item.weight ? `${item.weight}g ${item.purity}` : item.units ? `${item.units} units` : `Maturity: ${item.maturityDate}`}
                      </td>
                      <td className={`text-right px-4 py-4 font-bold text-base ${
                        item.returns >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {item.returns ? `+${item.returns.toFixed(1)}%` : item.interestRate ? `${item.interestRate}% p.a.` : 'N/A'}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Allocation Bars */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Allocation Breakdown</h4>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-700/20 rounded-lg p-2 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {((item.amount / total) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-blue-500' :
                      color === 'pink' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                      color === 'gold' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 
                      'bg-gradient-to-r from-amber-500 to-orange-500'
                    } rounded-full`}
                    style={{ width: `${(item.amount / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SimplePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      <div className="relative">
        <svg width="240" height="240" viewBox="0 0 240 240">
          {/* Background Circle */}
          <circle cx="120" cy="120" r="90" fill="#F3F4F6" className="dark:fill-gray-700" />
          
          {data.map((item, idx) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const outerRadius = 90;
            const innerRadius = 55;
            
            const x1Outer = 120 + outerRadius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1Outer = 120 + outerRadius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2Outer = 120 + outerRadius * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2Outer = 120 + outerRadius * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const x1Inner = 120 + innerRadius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1Inner = 120 + innerRadius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2Inner = 120 + innerRadius * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2Inner = 120 + innerRadius * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArc = angle > 180 ? 1 : 0;

            return (
              <g key={idx}>
                <path
                  d={`M ${x1Outer} ${y1Outer} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1Inner} ${y1Inner} Z`}
                  fill={item.color}
                  className="transition-opacity hover:opacity-80 cursor-pointer"
                />
              </g>
            );
          })}
          
          {/* Center Circle */}
          <circle cx="120" cy="120" r="50" fill="white" className="dark:fill-gray-800" />
          <text x="120" y="130" textAnchor="middle" className="text-3xl font-bold fill-gray-900 dark:fill-white" style={{ fontFamily: 'system-ui' }}>
            100%
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, idx) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">₹{(item.value / 100000).toFixed(2)}L</div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SimpleRadarChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="space-y-6 py-4">
      {data.map((item, idx) => {
        const percentage = ((item.value / total) * 100).toFixed(1);
        return (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{percentage}%</span>
            </div>
            <div className="relative">
              <div className="w-full h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div 
                  className="h-full rounded-lg transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(item.value / total) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioManagement;
