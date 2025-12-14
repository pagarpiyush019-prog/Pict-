import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BudgetQuickActions = ({ onCreateBudget, onBulkEdit, onExportData, onImportData }) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  const primaryActions = [
    {
      label: 'Create Budget',
      icon: 'Plus',
      action: onCreateBudget,
      variant: 'default',
      description: 'Add a new budget category'
    },
    {
      label: 'Bulk Edit',
      icon: 'Edit3',
      action: onBulkEdit,
      variant: 'outline',
      description: 'Edit multiple budgets at once'
    }
  ];

  const secondaryActions = [
    {
      label: 'Export Data',
      icon: 'Download',
      action: onExportData,
      description: 'Download budget data as CSV/PDF'
    },
    {
      label: 'Import Data',
      icon: 'Upload',
      action: onImportData,
      description: 'Import budget data from file'
    },
    {
      label: 'Budget Templates',
      icon: 'FileText',
      action: () => console.log('Show templates'),
      description: 'Use pre-built budget templates'
    },
    {
      label: 'Set Goals',
      icon: 'Target',
      action: () => console.log('Set financial goals'),
      description: 'Define financial objectives'
    },
    {
      label: 'Budget History',
      icon: 'History',
      action: () => console.log('View history'),
      description: 'View past budget performance'
    },
    {
      label: 'Share Budget',
      icon: 'Share2',
      action: () => console.log('Share budget'),
      description: 'Share budget with family/advisor'
    }
  ];

  return (
    <>
      {/* Desktop Quick Actions */}
      <div className="hidden lg:flex items-center justify-between bg-card rounded-lg border border-border p-4">
        <div className="flex items-center space-x-3">
          {primaryActions?.map((action, index) => (
            <Button
              key={index}
              variant={action?.variant}
              iconName={action?.icon}
              iconPosition="left"
              onClick={action?.action}
              title={action?.description}
            >
              {action?.label}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            iconName="MoreHorizontal"
            onClick={() => setShowMoreActions(!showMoreActions)}
            title="More actions"
          >
            More Actions
          </Button>

          {showMoreActions && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-modal z-50">
              <div className="py-2">
                {secondaryActions?.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action?.action();
                      setShowMoreActions(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                    title={action?.description}
                  >
                    <Icon name={action?.icon} size={16} />
                    <span>{action?.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Quick Actions Bar */}
      <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
        <div className="bg-card border border-border rounded-lg shadow-modal p-3">
          <div className="flex items-center justify-between">
            {primaryActions?.map((action, index) => (
              <Button
                key={index}
                variant={action?.variant}
                size="sm"
                iconName={action?.icon}
                onClick={action?.action}
                className="flex-1 mx-1"
              >
                {action?.label}
              </Button>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreVertical"
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="ml-2"
            />
          </div>
        </div>

        {/* Mobile More Actions Modal */}
        {showMoreActions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
            <div className="bg-card w-full rounded-t-lg p-4 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-foreground">More Actions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setShowMoreActions(false)}
                  className="h-8 w-8 p-0"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {secondaryActions?.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action?.action();
                      setShowMoreActions(false);
                    }}
                    className="flex flex-col items-center space-y-2 p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <Icon name={action?.icon} size={24} className="text-primary" />
                    <span className="text-sm font-medium text-foreground text-center">
                      {action?.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay for desktop dropdown */}
      {showMoreActions && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setShowMoreActions(false)}
        />
      )}
    </>
  );
};

export default BudgetQuickActions;