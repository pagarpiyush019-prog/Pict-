import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

import Button from '../../../components/ui/Button';

const PerformanceChart = ({ performanceData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('1Y');
  const [chartType, setChartType] = useState('line');

  const periods = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'ALL', value: 'ALL' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const formatTooltipValue = (value, name) => {
    if (name === 'Portfolio' || name === 'Nifty 50') {
      return [formatCurrency(value), name];
    }
    return [value, name];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm font-medium text-foreground">
                {entry?.name}: {formatCurrency(entry?.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-xl font-semibold text-foreground">Performance</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              iconName="TrendingUp"
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              iconName="BarChart3"
              onClick={() => setChartType('area')}
            >
              Area
            </Button>
          </div>

          {/* Period Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {periods?.map((period) => (
              <button
                key={period?.value}
                onClick={() => setSelectedPeriod(period?.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedPeriod === period?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={performanceData?.[selectedPeriod]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={false}
                name="Portfolio"
              />
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                stroke="var(--color-muted-foreground)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="S&P 500"
              />
            </LineChart>
          ) : (
            <AreaChart data={performanceData?.[selectedPeriod]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="portfolio" 
                stroke="var(--color-primary)" 
                fill="var(--color-primary)"
                fillOpacity={0.1}
                strokeWidth={2}
                name="Portfolio"
              />
              <Area 
                type="monotone" 
                dataKey="benchmark" 
                stroke="var(--color-muted-foreground)" 
                fill="var(--color-muted-foreground)"
                fillOpacity={0.05}
                strokeWidth={2}
                strokeDasharray="5 5"
                name="S&P 500"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-primary" />
          <span className="text-sm text-muted-foreground">Your Portfolio</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-0.5 bg-muted-foreground border-dashed border-t" />
          <span className="text-sm text-muted-foreground">S&P 500 Benchmark</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;