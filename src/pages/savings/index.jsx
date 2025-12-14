import React, { useState, useMemo } from 'react';
import Icon from '../../components/AppIcon';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart } from 'recharts';

const Savings = () => {
  const [goals, setGoals] = useState([
    { 
      id: '1', 
      name: 'Emergency Fund', 
      target: 250000, 
      saved: 187500,
      deadline: '2026-06-01',
      category: 'emergency',
      color: '#10B981',
      icon: 'ShieldCheck'
    },
    { 
      id: '2', 
      name: 'New Laptop', 
      target: 90000, 
      saved: 24000,
      deadline: '2026-03-15',
      category: 'purchase',
      color: '#6366F1',
      icon: 'Laptop'
    },
    { 
      id: '3', 
      name: 'Europe Trip', 
      target: 450000, 
      saved: 120000,
      deadline: '2026-12-01',
      category: 'travel',
      color: '#F59E0B',
      icon: 'PlaneTakeoff'
    },
    {
      id: '4',
      name: 'Down Payment',
      target: 2000000,
      saved: 350000,
      deadline: '2027-06-01',
      category: 'house',
      color: '#8B5CF6',
      icon: 'Home'
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', category: 'purchase' });

  const totals = useMemo(() => {
    const target = goals.reduce((s, g) => s + g.target, 0);
    const saved = goals.reduce((s, g) => s + g.saved, 0);
    return { target, saved, percentage: (saved / target) * 100 };
  }, [goals]);

  // Calculate days until deadline
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate monthly savings needed
  const getMonthlySavingsNeeded = (goal) => {
    const daysRemaining = getDaysRemaining(goal.deadline);
    const monthsRemaining = daysRemaining / 30;
    const remaining = goal.target - goal.saved;
    return monthsRemaining > 0 ? Math.ceil(remaining / monthsRemaining) : remaining;
  };

  // Mock savings rate data
  const savingsRateData = [
    { month: 'May', rate: 18.5 },
    { month: 'Jun', rate: 22.3 },
    { month: 'Jul', rate: 20.1 },
    { month: 'Aug', rate: 24.7 },
    { month: 'Sep', rate: 23.2 },
    { month: 'Oct', rate: 25.8 },
    { month: 'Nov', rate: 28.4 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

  const pieData = goals.map(g => ({
    name: g.name,
    value: g.saved,
    color: g.color
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-xl">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{payload[0].payload.month || payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].color }}>
            {payload[0].name === 'Savings Rate' ? `${payload[0].value}%` : `₹${payload[0].value.toLocaleString('en-IN')}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      const goal = {
        id: String(Date.now()),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        saved: 0,
        deadline: newGoal.deadline,
        category: newGoal.category,
        color: COLORS[goals.length % COLORS.length],
        icon: 'Target'
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: '', target: '', deadline: '', category: 'purchase' });
      setShowAddGoal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-6 border-2 border-emerald-100 dark:border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
            <Icon name="PiggyBank" size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track progress and achieve your financial dreams</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md"
        >
          <Icon name="Plus" size={16} />
          <span>New Goal</span>
        </button>
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Icon name="Target" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Total Progress</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Across all savings goals</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Total Saved</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totals.saved)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Total Target</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totals.target)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Overall Progress</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totals.percentage.toFixed(1)}%</p>
            </div>
          </div>
          <div className="relative">
            <div className="h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div 
                className="h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${totals.percentage}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.saved)} / {formatCurrency(totals.target)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Rate Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Icon name="TrendingUp" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Savings Rate Trend</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Monthly savings percentage</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={savingsRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rate" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const pct = Math.max(0, Math.min(100, Math.round((goal.saved / goal.target) * 100)));
          const daysRemaining = getDaysRemaining(goal.deadline);
          const monthlyNeeded = getMonthlySavingsNeeded(goal);
          const isOnTrack = daysRemaining > 0 && monthlyNeeded > 0 && monthlyNeeded <= (goal.target / 12);

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: goal.color + '20' }}
                    >
                      <Icon name={goal.icon} size={24} style={{ color: goal.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{goal.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    pct >= 100 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {pct}%
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(goal.saved)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">of {formatCurrency(goal.target)}</p>
                  </div>
                  <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: goal.color }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deadline</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{daysRemaining} days left</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Needed</p>
                    <p className={`text-sm font-bold ${isOnTrack ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {formatCurrency(monthlyNeeded)}
                    </p>
                    {isOnTrack && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                        <Icon name="CheckCircle" size={12} />
                        On track
                      </span>
                    )}
                  </div>
                </div>

                {pct >= 100 && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" size={20} className="text-emerald-600 dark:text-emerald-400" />
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Goal Achieved! 🎉</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Savings Distribution</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Smart Tips</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <Icon name="Lightbulb" size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Automate Your Savings</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Set up automatic transfers to reach your goals faster</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Icon name="Target" size={20} className="text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Review Monthly</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Track progress and adjust contributions as needed</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <Icon name="TrendingUp" size={20} className="text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Increase Gradually</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Boost savings rate by 1-2% each quarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Goal</h3>
              <button
                onClick={() => setShowAddGoal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., New Car"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Amount (₹)</label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  placeholder="100000"
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                onClick={handleAddGoal}
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Savings;
