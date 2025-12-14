import React, { useState, useEffect } from 'react';
import BudgetOverviewTable from './components/BudgetOverviewTable';
import BudgetCreationForm from './components/BudgetCreationForm';
import BudgetProgressCharts from './components/BudgetProgressCharts';
import AlertConfigurationPanel from './components/AlertConfigurationPanel';
import BudgetPeriodSelector from './components/BudgetPeriodSelector';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { generateBudgetRebalanceSuggestions, generateBudgetDistribution } from '../../utils/geminiAI';

const BudgetPlanning = () => {
  const [budgets, setBudgets] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [currentPeriod, setCurrentPeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [showAiRebalanceModal, setShowAiRebalanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' or 'overview'
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [totalBudgetInput, setTotalBudgetInput] = useState('');
  const [userType, setUserType] = useState('student');

  // Mock budget data - Student persona (amounts in INR)
  const mockBudgets = [
    {
      id: 1,
      category: 'Hostel/PG Rent',
      allocated: 8000,
      spent: 8000,
      period: 'monthly',
      color: 'bg-primary',
      alertThreshold: 100
    },
    {
      id: 2,
      category: 'Canteen & Dining',
      allocated: 4500,
      spent: 3850,
      period: 'monthly',
      color: 'bg-success',
      alertThreshold: 85
    },
    {
      id: 3,
      category: 'Commute/UPI Transport',
      allocated: 1500,
      spent: 1420,
      period: 'monthly',
      color: 'bg-warning',
      alertThreshold: 75
    },
    {
      id: 4,
      category: 'Coaching/Fees',
      allocated: 3000,
      spent: 3000,
      period: 'monthly',
      color: 'bg-indigo-500',
      alertThreshold: 100
    },
    {
      id: 5,
      category: 'Books & Stationery',
      allocated: 800,
      spent: 650,
      period: 'monthly',
      color: 'bg-teal-500',
      alertThreshold: 80
    },
    {
      id: 6,
      category: 'Fest/Events',
      allocated: 1200,
      spent: 1450,
      period: 'monthly',
      color: 'bg-error',
      alertThreshold: 85
    },
    {
      id: 7,
      category: 'Mobile & Internet',
      allocated: 500,
      spent: 499,
      period: 'monthly',
      color: 'bg-purple-500',
      alertThreshold: 90
    },
    {
      id: 8,
      category: 'Savings',
      allocated: 2000,
      spent: 2000,
      period: 'monthly',
      color: 'bg-emerald-500',
      alertThreshold: 100
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setBudgets(mockBudgets);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateBudget = () => {
    setEditingBudget(null);
    setIsCreateFormOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsCreateFormOpen(true);
  };

  const handleSaveBudget = (budgetData) => {
    if (editingBudget) {
      setBudgets(prev => prev?.map(budget => 
        budget?.id === editingBudget?.id ? { ...budgetData, id: editingBudget?.id } : budget
      ));
    } else {
      setBudgets(prev => [...prev, { ...budgetData, id: Date.now() }]);
    }
  };

  const handleDeleteBudget = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(prev => prev?.filter(budget => budget?.id !== budgetId));
    }
  };

  const handleBulkEdit = () => {
    console.log('Bulk edit functionality');
  };

  const handleExportData = () => {
    console.log('Export budget data');
  };

  const handleImportData = () => {
    console.log('Import budget data');
  };

  const handleUpdateAlerts = (alertConfig) => {
    console.log('Update alert configuration:', alertConfig);
  };

  const handleAiRebalance = async () => {
    setShowAiRebalanceModal(true);
    setIsLoadingAI(false);
    setAiError(null);
    setAiSuggestions(null);
    setTotalBudgetInput('');
  };

  const handleGenerateBudgetDistribution = async () => {
    const budget = parseFloat(totalBudgetInput);
    
    if (!budget || budget <= 0) {
      setAiError('Please enter a valid budget amount');
      return;
    }

    if (budget < 5000) {
      setAiError('Minimum budget should be ₹5,000 for meaningful distribution');
      return;
    }

    setIsLoadingAI(true);
    setAiError(null);
    setAiSuggestions(null);

    try {
      // Call AI to generate budget distribution
      const distribution = await generateBudgetDistribution(budget, userType);
      setAiSuggestions(distribution);
    } catch (error) {
      console.error('AI Budget Distribution Error:', error);
      setAiError('Unable to generate budget distribution. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleApplyAiDistribution = () => {
    if (!aiSuggestions || !aiSuggestions.distribution) return;

    // Create new budgets from AI distribution
    const newBudgets = aiSuggestions.distribution.map((dist, idx) => ({
      id: Date.now() + idx,
      category: dist.category,
      allocated: dist.allocated,
      spent: 0,
      period: 'monthly',
      color: ['bg-primary', 'bg-success', 'bg-warning', 'bg-indigo-500', 'bg-teal-500', 'bg-error', 'bg-purple-500', 'bg-emerald-500'][idx % 8],
      alertThreshold: 85
    }));

    setBudgets(newBudgets);
    setShowAiRebalanceModal(false);
    setTotalBudgetInput('');
    
    // Show success notification
    alert('✅ AI budget distribution applied successfully!');
  };

  const getPeriodData = () => {
    const totalAllocated = budgets?.reduce((sum, budget) => sum + budget?.allocated, 0);
    const totalSpent = budgets?.reduce((sum, budget) => sum + budget?.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;

    return {
      totalBudgets: budgets?.length,
      totalAllocated,
      totalSpent,
      totalRemaining: Math.max(0, totalRemaining)
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading your budget data...</p>
        </div>
      </div>
    );
  }

  // Get budget health status
  const getBudgetHealth = () => {
    const totalAllocated = budgets?.reduce((sum, b) => sum + b?.allocated, 0) || 0;
    const totalSpent = budgets?.reduce((sum, b) => sum + b?.spent, 0) || 0;
    const percentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
    
    if (percentage <= 75) return { status: 'healthy', color: 'emerald', label: 'On Track' };
    if (percentage <= 90) return { status: 'warning', color: 'amber', label: 'Near Limit' };
    return { status: 'danger', color: 'red', label: 'Over Budget' };
  };

  const health = getBudgetHealth();
  const periodData = getPeriodData();

  // Load budget overview data
  const budgetOverview = {
    monthlyIncome: 21500,
    monthlyExpenses: 21869,
    monthlySavings: -369,
    categories: budgets.map(b => ({
      name: b.category,
      allocated: b.allocated,
      spent: b.spent,
      percentage: (b.spent / budgets.reduce((sum, budget) => sum + budget.spent, 0)) * 100 || 0
    }))
  };

  return (
    <div className="pb-20 pt-2 px-3 md:pt-4 md:px-4 space-y-3 md:space-y-4 min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1 md:mb-2">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Budget Planning</h1>
          <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 md:gap-1.5 mt-0.5">
            <Icon name="GraduationCap" size={10} className="text-indigo-500 md:w-3 md:h-3" />
            <span>Student</span>
            <span className="text-gray-300">•</span>
            <span>November 2025</span>
            <span className="text-gray-300">•</span>
            <span>Monthly View</span>
          </p>
        </div>
        
        <div className="mt-2 lg:mt-0 flex items-center gap-1.5 md:gap-2">
          <button
            onClick={handleAiRebalance}
            disabled={isLoadingAI}
            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name={isLoadingAI ? "Loader2" : "Sparkles"} size={12} className={isLoadingAI ? "animate-spin" : ""} />
            <span className="hidden sm:inline">AI Budget Plan</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon name="Download" size={12} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={handleCreateBudget}
            className="flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 md:py-2 text-[10px] md:text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Icon name="Plus" size={12} />
            <span>New Budget</span>
          </button>
        </div>
      </div>

      {/* Period Selector Row */}
      <BudgetPeriodSelector
        currentPeriod={currentPeriod}
        onPeriodChange={setCurrentPeriod}
        periodData={periodData}
      />

      {/* Budget Overview Cards */}
      {budgetOverview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-100 shadow-sm">
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
              <p className="text-[10px] md:text-xs font-bold text-green-700 uppercase tracking-wide">Monthly Income</p>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <Icon name="TrendingUp" size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">₹{(budgetOverview.monthlyIncome / 1000).toFixed(1)}K</p>
            <span className="text-[10px] md:text-xs font-medium text-green-600 bg-green-100 px-1.5 md:px-2 py-0.5 rounded-md mt-1.5 md:mt-2 inline-block">
              Income Source
            </span>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-red-100 shadow-sm">
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
              <p className="text-[10px] md:text-xs font-bold text-red-700 uppercase tracking-wide">Monthly Expenses</p>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <Icon name="TrendingDown" size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900">₹{(budgetOverview.monthlyExpenses / 1000).toFixed(1)}K</p>
            <span className="text-[10px] md:text-xs font-medium text-red-600 bg-red-100 px-1.5 md:px-2 py-0.5 rounded-md mt-1.5 md:mt-2 inline-block">
              {((budgetOverview.monthlyExpenses / budgetOverview.monthlyIncome) * 100).toFixed(0)}% of Income
            </span>
          </div>

          <div className={`bg-gradient-to-br rounded-lg md:rounded-xl p-3 md:p-4 border shadow-sm ${
            budgetOverview.monthlySavings >= 0
              ? 'from-blue-50 to-indigo-50 border-blue-100'
              : 'from-orange-50 to-red-50 border-orange-100'
          }`}>
            <div className="flex items-center justify-between mb-1.5 md:mb-2">
              <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                budgetOverview.monthlySavings >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>Monthly Savings</p>
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
                budgetOverview.monthlySavings >= 0
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                <Icon name={budgetOverview.monthlySavings >= 0 ? "PiggyBank" : "AlertTriangle"} size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
            <p className={`text-xl md:text-2xl font-bold ${
              budgetOverview.monthlySavings >= 0 ? 'text-gray-900' : 'text-orange-700'
            }`}>
              ₹{Math.abs(budgetOverview.monthlySavings / 1000).toFixed(1)}K
            </p>
            <span className={`text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 rounded-md mt-1.5 md:mt-2 inline-block ${
              budgetOverview.monthlySavings >= 0
                ? 'text-blue-600 bg-blue-100'
                : 'text-orange-600 bg-orange-100'
            }`}>
              {budgetOverview.monthlySavings >= 0 ? 'Surplus' : 'Deficit'}
            </span>
          </div>
        </div>
      )}

      {/* Two Column Layout: Table + Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-2.5 md:gap-4">
        {/* Category Budgets Card */}
        <div className="xl:col-span-2 bg-white rounded-lg md:rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Icon name="LayoutGrid" size={14} className="text-gray-400 md:w-4 md:h-4" />
              <h2 className="text-xs md:text-sm font-semibold text-gray-900">Category Budgets</h2>
            </div>
            <span className="text-[10px] md:text-xs text-gray-400">{budgets?.length} categories</span>
          </div>
          
          {/* AI Budget Coach Suggestions */}
          <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
                <Icon name="Sparkles" size={12} className="text-violet-600" />
              </div>
              <span className="text-xs font-semibold text-violet-900">AI Budget Coach Suggestions</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Icon name="TrendingDown" size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-700">
                  <span className="font-medium text-red-600">Reduce shopping by $70</span> based on last 3 months – you’re consistently over budget.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="TrendingUp" size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-700">
                  <span className="font-medium text-emerald-600">Auto-increase healthcare by $30</span> – you have unused allocation that could cover rising costs.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="ArrowRightLeft" size={12} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-gray-700">
                  <span className="font-medium text-indigo-600">Move $70 from entertainment to savings</span> to hit your monthly goal faster.
                </p>
              </div>
            </div>
          </div>
          
          <BudgetOverviewTable
            budgets={budgets}
            onEditBudget={handleEditBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        </div>

        {/* Budget Analytics Card */}
        <div className="bg-white rounded-lg md:rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Icon name="PieChart" size={14} className="text-gray-400 md:w-4 md:h-4" />
              <h2 className="text-xs md:text-sm font-semibold text-gray-900">Analytics</h2>
            </div>
          </div>
          <BudgetProgressCharts budgets={budgets} compact />
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="bg-white rounded-lg md:rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Icon name="Bell" size={14} className="text-gray-400 md:w-4 md:h-4" />
            <h2 className="text-xs md:text-sm font-semibold text-gray-900">Budget Alerts</h2>
          </div>
        </div>
        <AlertConfigurationPanel
          budgets={budgets}
          onUpdateAlerts={handleUpdateAlerts}
        />
      </div>

          {/* Empty State */}
          {budgets?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Icon name="Target" size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets created yet</h3>
              <p className="text-gray-500 mb-6">
                Start by creating your first budget to track your spending.
              </p>
              <button
                onClick={handleCreateBudget}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Icon name="Plus" size={16} />
                Create Your First Budget
              </button>
            </div>
          )}

      {/* Budget Creation/Edit Form Modal */}
      <BudgetCreationForm
        isOpen={isCreateFormOpen}
        onClose={() => {
          setIsCreateFormOpen(false);
          setEditingBudget(null);
        }}
        onSave={handleSaveBudget}
        editingBudget={editingBudget}
      />

      {/* AI Rebalance Modal */}
      {showAiRebalanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                    <Icon name="Sparkles" size={12} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">AI Budget Distribution</h2>
                    <p className="text-[9px] text-white/80">Smart money allocation</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiRebalanceModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Icon name="X" size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1">
              {/* Input Form - Show if no suggestions yet */}
              {!isLoadingAI && !aiSuggestions && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-3">
                      Enter your total monthly budget and let AI suggest how to distribute it across categories.
                    </p>
                  </div>

                  {/* User Type Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      I am a:
                    </label>
                    <div className="flex gap-2">
                      {['student', 'professional', 'family'].map(type => (
                        <button
                          key={type}
                          onClick={() => setUserType(type)}
                          className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                            userType === type
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-violet-300'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Total Monthly Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={totalBudgetInput}
                      onChange={(e) => setTotalBudgetInput(e.target.value)}
                      placeholder="e.g., 25000"
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      min="5000"
                      step="1000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum ₹5,000 required</p>
                  </div>

                  {/* Error Display */}
                  {aiError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium text-red-900">Error</p>
                          <p className="text-red-700 mt-0.5">{aiError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerateBudgetDistribution}
                    disabled={!totalBudgetInput || parseFloat(totalBudgetInput) < 5000}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg hover:from-violet-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Sparkles" size={16} />
                    Generate AI Budget Distribution
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isLoadingAI && (
                <div className="text-center py-12">
                  <Icon name="Loader2" size={40} className="animate-spin text-violet-600 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-700">Creating your budget plan...</p>
                  <p className="text-xs text-gray-500 mt-1">AI is analyzing best distribution</p>
                </div>
              )}

              {/* AI Distribution Results */}
              {!isLoadingAI && aiSuggestions && aiSuggestions.distribution && (
                <div className="space-y-4">
                  {/* Budget Summary Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-[10px] text-blue-600 font-medium mb-1">Needs (50%)</p>
                      <p className="text-lg font-bold text-blue-900">₹{aiSuggestions.breakdown.needs.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-[10px] text-amber-600 font-medium mb-1">Wants (30%)</p>
                      <p className="text-lg font-bold text-amber-900">₹{aiSuggestions.breakdown.wants.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <p className="text-[10px] text-emerald-600 font-medium mb-1">Savings ({aiSuggestions.insights.savingsRate}%)</p>
                      <p className="text-lg font-bold text-emerald-900">₹{aiSuggestions.breakdown.savings.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Icon name="Info" size={16} className="text-violet-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-violet-700">
                        {aiSuggestions.insights.summary}
                      </p>
                    </div>
                  </div>

                  {/* Distribution Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-3 py-2 font-medium text-gray-600 text-xs">Category</th>
                          <th className="text-right px-3 py-2 font-medium text-gray-600 text-xs">Amount</th>
                          <th className="text-right px-3 py-2 font-medium text-gray-600 text-xs">%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {aiSuggestions.distribution.map((dist, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <div className="font-medium text-gray-900 text-xs">{dist.category}</div>
                              <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{dist.reason}</div>
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-violet-600 whitespace-nowrap text-sm">
                              ₹{dist.allocated.toLocaleString('en-IN')}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-600 whitespace-nowrap text-xs">
                              {dist.percentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                        <tr>
                          <td className="px-3 py-2 font-bold text-gray-900 text-xs">TOTAL</td>
                          <td className="px-3 py-2 text-right font-bold text-violet-700 text-sm">
                            ₹{aiSuggestions.totalBudget.toLocaleString('en-IN')}
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-gray-600 text-xs">100%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowAiRebalanceModal(false);
                    setAiSuggestions(null);
                    setAiError(null);
                    setTotalBudgetInput('');
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {aiSuggestions && aiSuggestions.distribution ? 'Cancel' : 'Close'}
                </button>
                {aiSuggestions && aiSuggestions.distribution && (
                  <button
                    onClick={handleApplyAiDistribution}
                    disabled={isLoadingAI}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg hover:from-violet-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="Check" size={16} />
                    Apply Budget Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Budget Overview Section Component (moved from Dashboard)
const BudgetOverviewSection = ({ budget }) => {
  const utilizationPercentage = budget.monthlyIncome > 0 ? (budget.monthlyExpenses / budget.monthlyIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-100 dark:border-green-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">Monthly Income</p>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-800/30 text-green-600 dark:text-green-400 flex items-center justify-center">
              <Icon name="TrendingUp" size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">₹{(budget.monthlyIncome / 1000).toFixed(1)}K</p>
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-md">
              Income Source
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-red-100 dark:border-red-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">Monthly Expenses</p>
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Icon name="TrendingDown" size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">₹{(budget.monthlyExpenses / 1000).toFixed(1)}K</p>
            <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-md">
              {utilizationPercentage.toFixed(0)}% of Income
            </span>
          </div>
        </div>

        <div className={`bg-gradient-to-br rounded-xl p-6 border shadow-sm ${
          budget.monthlySavings >= 0 
            ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-700'
            : 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100 dark:border-red-700'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold uppercase tracking-wide ${
              budget.monthlySavings >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {budget.monthlySavings >= 0 ? 'Monthly Savings' : 'Monthly Deficit'}
            </p>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              budget.monthlySavings >= 0 
                ? 'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400'
                : 'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400'
            }`}>
              <Icon name={budget.monthlySavings >= 0 ? 'PiggyBank' : 'AlertCircle'} size={20} />
            </div>
          </div>
          <div>
            <p className={`text-3xl font-bold mb-2 ${
              budget.monthlySavings >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'
            }`}>
              ₹{Math.abs(budget.monthlySavings / 1000).toFixed(1)}K
            </p>
            <span className={`text-xs font-bold px-3 py-1 rounded-md ${
              budget.monthlySavings >= 0 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50'
                : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50'
            }`}>
              {budget.monthlyIncome > 0 ? ((Math.abs(budget.monthlySavings) / budget.monthlyIncome) * 100).toFixed(0) : 0}% {budget.monthlySavings >= 0 ? 'Savings' : 'Overspent'} Rate
            </span>
          </div>
        </div>
      </div>

      {/* Budget Utilization Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <Icon name="PieChart" size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">Category Breakdown</h3>
          </div>
          <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
            utilizationPercentage > 100 ? 'bg-red-500 text-white' :
            utilizationPercentage > 90 ? 'bg-amber-500 text-white' :
            utilizationPercentage > 75 ? 'bg-yellow-500 text-gray-900' :
            'bg-green-500 text-white'
          }`}>
            {utilizationPercentage.toFixed(0)}% Used
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Overall Health */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Budget Health</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {utilizationPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  utilizationPercentage > 100 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                  utilizationPercentage > 90 ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                  utilizationPercentage > 75 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                  'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {budget.categories.map((category, idx) => {
              const categoryPercentage = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
              const isOverBudget = category.spent > category.allocated;
              
              return (
                <div 
                  key={idx} 
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                >
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 truncate">{category.name}</h4>
                  <p className={`text-xl font-bold mb-1 ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    ₹{(category.spent / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">of ₹{(category.allocated / 1000).toFixed(1)}K</p>
                  
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget 
                          ? 'bg-gradient-to-r from-red-500 to-red-600' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                      }`}
                      style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                    />
                  </div>
                  
                  <p className={`text-xs font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`}>
                    {isOverBudget ? (
                      <>⚠️ +₹{((category.spent - category.allocated) / 1000).toFixed(1)}K over</>
                    ) : (
                      <>{category.percentage.toFixed(1)}% of total</>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-6 py-4 border-b border-indigo-100 dark:border-indigo-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon name="List" size={20} className="text-indigo-600" />
            Detailed Breakdown
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Category</th>
                  <th className="text-right px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Allocated</th>
                  <th className="text-right px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Spent</th>
                  <th className="text-right px-4 py-3 font-bold text-gray-600 dark:text-gray-400 uppercase text-xs tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody>
                {budget.categories.map((category, idx) => (
                  <tr key={idx} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-4 text-gray-900 dark:text-white font-semibold">{category.name}</td>
                    <td className="text-right px-4 py-4 text-gray-600 dark:text-gray-400">₹{category.allocated.toLocaleString()}</td>
                    <td className={`text-right px-4 py-4 font-bold text-base ${
                      category.spent > category.allocated ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      ₹{category.spent.toLocaleString()}
                    </td>
                    <td className="text-right px-4 py-4">
                      <span className="text-base font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-200 dark:border-gray-600 font-bold bg-gray-50 dark:bg-gray-800">
                  <td className="px-4 py-4 text-gray-900 dark:text-white text-base">Total</td>
                  <td className="text-right px-4 py-4 text-gray-900 dark:text-white text-lg">₹{budget.categories.reduce((sum, c) => sum + c.allocated, 0).toLocaleString()}</td>
                  <td className="text-right px-4 py-4 text-gray-900 dark:text-white text-lg">₹{budget.monthlyExpenses.toLocaleString()}</td>
                  <td className="text-right px-4 py-4 text-purple-600 dark:text-purple-400 text-base">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;