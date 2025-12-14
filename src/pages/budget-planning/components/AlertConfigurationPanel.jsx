import React, { useState } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

// AI Alert Presets
const aiPresets = {
  conservative: {
    name: 'Conservative',
    description: 'Early warnings, strict limits',
    icon: 'Shield',
    color: 'emerald',
    settings: { warningAt: 60, criticalAt: 80 }
  },
  balanced: {
    name: 'Balanced',
    description: 'Standard alerts for most users',
    icon: 'Scale',
    color: 'indigo',
    settings: { warningAt: 75, criticalAt: 90 }
  },
  aggressive: {
    name: 'Aggressive',
    description: 'Maximize spending flexibility',
    icon: 'Zap',
    color: 'amber',
    settings: { warningAt: 85, criticalAt: 95 }
  }
};

const AlertConfigurationPanel = ({ budgets, onUpdateAlerts }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('balanced');
  const [globalSettings, setGlobalSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    dailyDigest: true,
    weeklyReport: true,
    monthlyReport: true
  });

  const [budgetAlerts, setBudgetAlerts] = useState(
    budgets?.reduce((acc, budget) => {
      acc[budget.id] = {
        threshold: budget?.alertThreshold || 80,
        enabled: true,
        warningAt: 75,
        criticalAt: 90
      };
      return acc;
    }, {})
  );

  const notificationMethods = [
    { value: 'email', label: 'Email', icon: 'Mail' },
    { value: 'push', label: 'Push Notification', icon: 'Bell' },
    { value: 'sms', label: 'SMS', icon: 'MessageSquare' }
  ];

  const alertTypes = [
    {
      id: 'budget_warning',
      label: 'Budget Warning',
      description: 'Alert when spending reaches warning threshold',
      icon: 'AlertTriangle',
      color: 'text-warning'
    },
    {
      id: 'budget_exceeded',
      label: 'Budget Exceeded',
      description: 'Alert when budget limit is exceeded',
      icon: 'AlertCircle',
      color: 'text-error'
    },
    {
      id: 'unusual_spending',
      label: 'Unusual Spending',
      description: 'Alert for spending patterns outside normal range',
      icon: 'TrendingUp',
      color: 'text-primary'
    },
    {
      id: 'bill_reminder',
      label: 'Bill Reminders',
      description: 'Remind about upcoming bill payments',
      icon: 'Calendar',
      color: 'text-accent'
    }
  ];

  const handleGlobalSettingChange = (setting, value) => {
    setGlobalSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleBudgetAlertChange = (budgetId, field, value) => {
    setBudgetAlerts(prev => ({
      ...prev,
      [budgetId]: { ...prev?.[budgetId], [field]: value }
    }));
  };

  const saveAlertSettings = () => {
    const alertConfig = {
      global: globalSettings,
      budgets: budgetAlerts
    };
    onUpdateAlerts(alertConfig);
    
    // Show success message (in a real app, this would be a toast notification)
    alert('Alert settings saved successfully!');
  };

  const resetToDefaults = () => {
    setGlobalSettings({
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      dailyDigest: true,
      weeklyReport: true,
      monthlyReport: true
    });

    setBudgetAlerts(
      budgets?.reduce((acc, budget) => {
        acc[budget.id] = {
          threshold: 80,
          enabled: true,
          warningAt: 75,
          criticalAt: 90
        };
        return acc;
      }, {})
    );
  };

  return (
    <div className="">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Configure alert thresholds and notifications</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            selectedPreset === 'conservative' ? 'bg-emerald-100 text-emerald-700' :
            selectedPreset === 'balanced' ? 'bg-indigo-100 text-indigo-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {aiPresets[selectedPreset]?.name} Mode
          </span>
          <Icon 
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
            size={16} 
            className="text-gray-400" 
          />
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 space-y-5">
          {/* AI Alert Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={14} className="text-violet-500" />
              <h4 className="text-sm font-medium text-gray-900">AI Alert Profiles</h4>
              <span className="text-[10px] px-1.5 py-0.5 bg-violet-100 text-violet-600 rounded font-medium">Recommended</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(aiPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedPreset(key);
                    // Apply preset to all budgets
                    setBudgetAlerts(prev => {
                      const updated = { ...prev };
                      Object.keys(updated).forEach(id => {
                        updated[id] = { ...updated[id], ...preset.settings };
                      });
                      return updated;
                    });
                  }}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedPreset === key
                      ? `border-${preset.color}-500 bg-${preset.color}-50`
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      preset.color === 'emerald' ? 'bg-emerald-100' :
                      preset.color === 'indigo' ? 'bg-indigo-100' : 'bg-amber-100'
                    }`}>
                      <Icon name={preset.icon} size={14} className={`${
                        preset.color === 'emerald' ? 'text-emerald-600' :
                        preset.color === 'indigo' ? 'text-indigo-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{preset.name}</span>
                    {selectedPreset === key && (
                      <Icon name="Check" size={14} className={`ml-auto ${
                        preset.color === 'emerald' ? 'text-emerald-600' :
                        preset.color === 'indigo' ? 'text-indigo-600' : 'text-amber-600'
                      }`} />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">{preset.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                    <span>Warn: {preset.settings.warningAt}%</span>
                    <span>•</span>
                    <span>Critical: {preset.settings.criticalAt}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Global Notification Settings */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Icon name="Bell" size={14} className="text-gray-400" />
              <span>Notification Channels</span>
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={globalSettings?.emailNotifications}
                  onChange={(e) => handleGlobalSettingChange('emailNotifications', e?.target?.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Icon name="Mail" size={14} className="text-gray-400" />
                <span className="text-xs text-gray-700">Email</span>
              </label>
              
              <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={globalSettings?.pushNotifications}
                  onChange={(e) => handleGlobalSettingChange('pushNotifications', e?.target?.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Icon name="Bell" size={14} className="text-gray-400" />
                <span className="text-xs text-gray-700">Push</span>
              </label>
              
              <label className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={globalSettings?.smsNotifications}
                  onChange={(e) => handleGlobalSettingChange('smsNotifications', e?.target?.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Icon name="MessageSquare" size={14} className="text-gray-400" />
                <span className="text-xs text-gray-700">SMS</span>
              </label>
            </div>
          </div>

          {/* Reports */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Icon name="FileText" size={14} className="text-gray-400" />
              <span>Scheduled Reports</span>
            </h4>
            
            <div className="flex flex-wrap gap-2">
              <label className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                globalSettings?.dailyDigest ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <input
                  type="checkbox"
                  checked={globalSettings?.dailyDigest}
                  onChange={(e) => handleGlobalSettingChange('dailyDigest', e?.target?.checked)}
                  className="hidden"
                />
                <Icon name={globalSettings?.dailyDigest ? 'Check' : 'Circle'} size={12} />
                <span className="text-xs font-medium">Daily Digest</span>
              </label>
              
              <label className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                globalSettings?.weeklyReport ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <input
                  type="checkbox"
                  checked={globalSettings?.weeklyReport}
                  onChange={(e) => handleGlobalSettingChange('weeklyReport', e?.target?.checked)}
                  className="hidden"
                />
                <Icon name={globalSettings?.weeklyReport ? 'Check' : 'Circle'} size={12} />
                <span className="text-xs font-medium">Weekly Report</span>
              </label>
              
              <label className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                globalSettings?.monthlyReport ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <input
                  type="checkbox"
                  checked={globalSettings?.monthlyReport}
                  onChange={(e) => handleGlobalSettingChange('monthlyReport', e?.target?.checked)}
                  className="hidden"
                />
                <Icon name={globalSettings?.monthlyReport ? 'Check' : 'Circle'} size={12} />
                <span className="text-xs font-medium">Monthly Overview</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              onClick={resetToDefaults}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Reset to defaults
            </button>
            
            <button
              onClick={saveAlertSettings}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Icon name="Save" size={14} />
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertConfigurationPanel;