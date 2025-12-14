import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AddTransactionModal from './components/AddTransactionModal';

const TransactionManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All'); // All, Income, Expense
  const [activeSection, setActiveSection] = useState('Transactions'); // Transactions, Categories
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Check URL params to auto-open scanner
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('openScanner') === 'true') {
      setIsReceiptScannerOpen(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Mock transaction data
  const mockTransactions = [
    {
      id: "1",
      date: "2025-12-14",
      time: "03:17 PM",
      title: "Fun & Holiday Expenses",
      category: "Games/Sports",
      amount: 200,
      type: "expense",
      paymentMethod: "Cash",
      icon: "🎉"
    },
    {
      id: "2",
      date: "2025-12-13",
      time: "02:30 PM",
      title: "Grocery Shopping",
      category: "Food & Dining",
      amount: 150,
      type: "expense",
      paymentMethod: "Card",
      icon: "🛒"
    },
    {
      id: "3",
      date: "2025-12-12",
      time: "11:45 AM",
      title: "Salary",
      category: "Income",
      amount: 5000,
      type: "income",
      paymentMethod: "Bank Transfer",
      icon: "💰"
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const handleAddTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now().toString()
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Calculate stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const avgSpendDaily = totalExpenses > 0 ? (totalExpenses / 30).toFixed(2) : 200.00;

  // Filter transactions based on active tab and search
  const filteredTransactions = transactions.filter(t => {
    const matchesTab = activeTab === 'All' || t.type === activeTab.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="flex items-center justify-between px-4 py-3 pt-safe">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h1 className="text-lg font-semibold flex-1 text-center">All Transaction</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Icon name="Share2" size={20} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Icon name="HelpCircle" size={20} />
            </button>
          </div>
        </div>

        {/* Type Tabs */}
        <div className="flex items-center gap-1 px-4 pb-3">
          <button
            onClick={() => setActiveTab('All')}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              activeTab === 'All'
                ? 'text-white border-b-2 border-white'
                : 'text-purple-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('Income')}
            className={`flex-1 py-2 text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'Income'
                ? 'text-white border-b-2 border-white'
                : 'text-purple-200'
            }`}
          >
            Income 📊
          </button>
          <button
            onClick={() => setActiveTab('Expense')}
            className={`flex-1 py-2 text-sm font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'Expense'
                ? 'text-white border-b-2 border-white'
                : 'text-purple-200'
            }`}
          >
            Expense 📦
          </button>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
        <h2 className="text-gray-900 font-semibold text-base mb-4">Transaction Summary</h2>
        
        <div className="flex items-center justify-between gap-4">
          {/* Donut Chart */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#fee2e2"
                strokeWidth="12"
              />
              {/* Expense arc (red) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${(totalExpenses / (totalIncome + totalExpenses || 1)) * 251.2} 251.2`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[10px] text-gray-500">Avg Spend Daily</p>
              <p className="text-sm font-bold text-gray-900">₹{avgSpendDaily}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="text-xs text-gray-600 whitespace-nowrap">Income</span>
              <span className="text-sm font-semibold text-green-600 ml-auto">₹{totalIncome}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
              <span className="text-xs text-gray-600 whitespace-nowrap">Expense</span>
              <span className="text-sm font-semibold text-red-600 ml-auto">₹{totalExpenses}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-purple-400 text-center mt-4">You have no budget set for this month.</p>
      </div>

      {/* Search Bar */}
      <div className="px-4 mt-4">
        <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <Icon name="Search" size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Transactions/Categories Tabs */}
      <div className="px-4 mt-4 flex items-center justify-between">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveSection('Transactions')}
            className={`pb-2 text-sm font-medium transition-all ${
              activeSection === 'Transactions'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveSection('Categories')}
            className={`pb-2 text-sm font-medium transition-all ${
              activeSection === 'Categories'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {/* Filter Icon and Add Transaction Button */}
      <div className="px-4 mt-4 flex items-center justify-between gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
          <Icon name="SlidersHorizontal" size={20} className="text-purple-600" />
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:from-purple-700 hover:to-purple-800 transition-all whitespace-nowrap"
        >
          <Icon name="Plus" size={14} />
          Add Transaction
        </button>
      </div>

      {/* Transaction List */}
      <div className="px-4 mt-4 space-y-3 pb-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
              {transaction.icon}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{transaction.title}</h3>
              <p className="text-xs text-gray-500">{transaction.category}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {transaction.date.split('-')[2]} Dec {transaction.date.split('-')[0].slice(2)} {transaction.time}
              </p>
            </div>

            {/* Amount and Payment Method */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <p className={`text-base font-bold whitespace-nowrap ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{transaction.amount}
              </p>
              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                💵 {transaction.paymentMethod}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddTransaction}
      />
    </div>
  );
};

export default TransactionManagement;