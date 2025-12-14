import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardQuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      label: 'Add Transaction',
      icon: 'Plus',
      action: () => window.location.href = '/transaction-management?action=add',
      variant: 'default',
      description: 'Record a new expense or income'
    },
    {
      label: 'View Budget',
      icon: 'Target',
      action: () => window.location.href = '/budget-planning',
      variant: 'outline',
      description: 'Check budget status and limits'
    },
    {
      label: 'Portfolio Summary',
      icon: 'TrendingUp',
      action: () => window.location.href = '/investment-portfolio',
      variant: 'outline',
      description: 'View investment performance'
    },
  ];

  return (
    <>
      {/* Desktop Quick Actions */}
      <div className="hidden lg:block">
        <div className="flex items-center space-x-3">
          {quickActions?.map((action, index) => (
            <Button
              key={index}
              variant={action?.variant}
              size="sm"
              iconName={action?.icon}
              iconPosition="left"
              onClick={action?.action}
              className="whitespace-nowrap"
              title={action?.description}
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <div className="relative">
          {/* Expanded Actions */}
          {isExpanded && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
              {quickActions?.slice()?.reverse()?.map((action, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="bg-card text-foreground text-sm px-3 py-2 rounded-lg shadow-modal border border-border whitespace-nowrap">
                    {action?.label}
                  </span>
                  <button
                    onClick={() => {
                      action?.action();
                      setIsExpanded(false);
                    }}
                    className="w-12 h-12 bg-card border border-border rounded-full shadow-modal flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name={action?.icon} size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Main FAB */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-modal flex items-center justify-center transition-all duration-300 ${
              isExpanded ? 'rotate-45' : 'rotate-0'
            }`}
          >
            <Icon name="Plus" size={24} />
          </button>
        </div>

        {/* Overlay */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-30"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
      {/* Tablet Quick Actions Bar */}
      <div className="hidden md:block lg:hidden fixed bottom-16 left-4 right-4 z-40">
        <div className="bg-card border border-border rounded-lg shadow-modal p-3">
          <div className="grid grid-cols-3 gap-2">
            {quickActions?.map((action, index) => (
              <button
                key={index}
                onClick={action?.action}
                className="flex flex-col items-center space-y-2 p-3 rounded-md hover:bg-muted transition-colors duration-200"
              >
                <Icon name={action?.icon} size={20} className="text-primary" />
                <span className="text-xs font-medium text-foreground text-center">
                  {action?.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardQuickActions;