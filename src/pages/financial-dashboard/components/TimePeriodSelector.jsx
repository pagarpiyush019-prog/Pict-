import React from 'react';
import Button from '../../../components/ui/Button';

const TimePeriodSelector = ({ selectedPeriod, onPeriodChange, className = '' }) => {
  const periods = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' }
  ];

  return (
    <div className={`flex items-center space-x-1 bg-muted rounded-lg p-1 ${className}`}>
      {periods?.map((period) => (
        <Button
          key={period?.value}
          variant={selectedPeriod === period?.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange(period?.value)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selectedPeriod === period?.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {period?.label}
        </Button>
      ))}
    </div>
  );
};

export default TimePeriodSelector;