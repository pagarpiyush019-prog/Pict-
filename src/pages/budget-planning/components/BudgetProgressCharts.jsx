import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetProgressCharts = ({ budgets, compact = false }) => {
  const [activeChart, setActiveChart] = useState('spending');

  // Prepare data for charts
  const overviewData = budgets?.map(budget => ({
    category: budget?.category?.charAt(0)?.toUpperCase() + budget?.category?.slice(1),
    allocated: budget?.allocated,
    spent: budget?.spent,
    remaining: Math.max(0, budget?.allocated - budget?.spent),
    percentage: (budget?.spent / budget?.allocated) * 100
  }));

  const pieData = budgets?.map(budget => ({
    name: budget?.category?.charAt(0)?.toUpperCase() + budget?.category?.slice(1),
    value: budget?.spent,
    color: budget?.color === 'bg-primary' ? '#1E40AF' : 
           budget?.color === 'bg-success' ? '#10B981' :
           budget?.color === 'bg-warning' ? '#F59E0B' :
           budget?.color === 'bg-error' ? '#EF4444' :
           budget?.color === 'bg-purple-500' ? '#8B5CF6' :
           budget?.color === 'bg-pink-500' ? '#EC4899' :
           budget?.color === 'bg-indigo-500' ? '#6366F1' : '#14B8A6'
  }));

  // Mock historical data for trend analysis
  const trendData = [
    { month: 'Jan', totalSpent: 3200, totalBudget: 4000 },
    { month: 'Feb', totalSpent: 3800, totalBudget: 4000 },
    { month: 'Mar', totalSpent: 3600, totalBudget: 4000 },
    { month: 'Apr', totalSpent: 4200, totalBudget: 4000 },
    { month: 'May', totalSpent: 3900, totalBudget: 4000 },
    { month: 'Jun', totalSpent: 4100, totalBudget: 4000 }
  ];

  const chartTypes = [
    { id: 'overview', label: 'Budget Overview', icon: 'BarChart3' },
    { id: 'spending', label: 'Spending Distribution', icon: 'PieChart' },
    { id: 'trends', label: 'Spending Trends', icon: 'TrendingUp' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: ${entry?.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-foreground">{data?.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data?.value?.toLocaleString()} ({((data?.value / pieData?.reduce((sum, item) => sum + item?.value, 0)) * 100)?.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'overview':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="category" 
                stroke="#6B7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="allocated" fill="#1E40AF" name="Allocated" radius={[2, 2, 0, 0]} />
              <Bar dataKey="spent" fill="#10B981" name="Spent" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'spending':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                labelLine={false}
              >
                {pieData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="totalBudget" 
                stroke="#1E40AF" 
                strokeWidth={2}
                name="Budget"
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="totalSpent" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Actual Spending"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className={compact ? 'p-4' : 'bg-card rounded-lg border border-border p-6'}>
      {!compact && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 lg:mb-0">Budget Analytics</h2>
          
          {/* Chart Type Selector */}
          <div className="flex flex-wrap gap-2">
            {chartTypes?.map((type) => (
              <Button
                key={type?.id}
                variant={activeChart === type?.id ? 'default' : 'outline'}
                size="sm"
                iconName={type?.icon}
                iconPosition="left"
                onClick={() => setActiveChart(type?.id)}
                className="text-sm"
              >
                {type?.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {compact && (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 mb-4">
          {chartTypes?.map((type) => (
            <button
              key={type?.id}
              onClick={() => setActiveChart(type?.id)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
                activeChart === type?.id 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name={type?.icon} size={12} />
              <span className="hidden sm:inline">{type?.label?.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Chart Container */}
      <div className={`w-full ${compact ? 'h-[200px]' : ''}`} aria-label={`${chartTypes?.find(t => t?.id === activeChart)?.label} Chart`}>
        {renderChart()}
      </div>

      {/* Chart Insights */}
      {!compact && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Total Allocated</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${budgets?.reduce((sum, budget) => sum + budget?.allocated, 0)?.toLocaleString()}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="DollarSign" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Total Spent</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${budgets?.reduce((sum, budget) => sum + budget?.spent, 0)?.toLocaleString()}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Wallet" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Remaining</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${budgets?.reduce((sum, budget) => sum + Math.max(0, budget?.allocated - budget?.spent), 0)?.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetProgressCharts;