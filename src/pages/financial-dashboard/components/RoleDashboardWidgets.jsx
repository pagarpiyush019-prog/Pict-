import React from 'react';
import { getUserRole, getRoleDashboardWidgets, ROLES } from '../../../utils/roleFilter';
import Icon from '../../../components/AppIcon';

// Student-specific compact widgets
const ScholarshipTrackerCompact = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-2">
      <Icon name="Award" size={16} className="text-blue-600" />
      <h4 className="text-xs font-semibold text-gray-700">Scholarships</h4>
    </div>
    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
      <div>
        <p className="text-xs font-medium text-gray-800">Merit Scholarship</p>
        <p className="text-[10px] text-gray-500">Due: March 15</p>
      </div>
      <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-medium rounded-full">$2,500</span>
    </div>
    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
      <div>
        <p className="text-xs font-medium text-gray-800">Excellence Grant</p>
        <p className="text-[10px] text-green-600 font-medium">Received ✓</p>
      </div>
      <span className="px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-medium rounded-full">$1,800</span>
    </div>
  </div>
);

const StudentLoansCompact = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-2">
      <Icon name="GraduationCap" size={16} className="text-blue-600" />
      <h4 className="text-xs font-semibold text-gray-700">Student Loans</h4>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-gray-500">Federal Loan</span>
      <span className="text-xs font-semibold text-red-600">$18,420</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-gray-500">Private Loan</span>
      <span className="text-xs font-semibold text-red-600">$8,350</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-gray-500">Next Payment</span>
      <span className="text-xs font-semibold">$245 (Jan 15)</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
      <div className="bg-blue-600 h-1 rounded-full" style={{width: '35%'}}></div>
    </div>
    <p className="text-[10px] text-center text-gray-400">35% paid off</p>
  </div>
);

// Gig worker compact widgets
const IncomeStreamsCompact = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-3">
      <Icon name="Wallet" size={18} className="text-green-600" />
      <h4 className="text-sm font-semibold text-gray-800">Income Streams</h4>
    </div>
    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Icon name="Car" size={14} className="text-green-600" />
        <span className="text-sm font-medium">Rideshare</span>
      </div>
      <span className="text-sm font-semibold text-green-600">$1,240</span>
    </div>
    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Icon name="Package" size={14} className="text-blue-600" />
        <span className="text-sm font-medium">Delivery</span>
      </div>
      <span className="text-sm font-semibold text-blue-600">$680</span>
    </div>
    <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Icon name="Laptop" size={14} className="text-purple-600" />
        <span className="text-sm font-medium">Freelance</span>
      </div>
      <span className="text-sm font-semibold text-purple-600">$920</span>
    </div>
  </div>
);

const ExpenseDeductionsCompact = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-3">
      <Icon name="Receipt" size={18} className="text-green-600" />
      <h4 className="text-sm font-semibold text-gray-800">Tax Deductions</h4>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm">Vehicle Expenses</span>
      <span className="text-sm font-semibold text-green-600">$1,240</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm">Phone & Data</span>
      <span className="text-sm font-semibold text-green-600">$180</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm">Equipment</span>
      <span className="text-sm font-semibold text-green-600">$320</span>
    </div>
    <div className="h-px bg-gray-200 my-2" />
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">Total</span>
      <span className="text-sm font-bold text-green-600">$1,740</span>
    </div>
  </div>
);

// Professional compact widgets
const PortfolioPerformanceCompact = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-3">
      <Icon name="TrendingUp" size={18} className="text-purple-600" />
      <h4 className="text-sm font-semibold text-gray-800">Portfolio</h4>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">Total Value</span>
      <span className="text-lg font-bold text-gray-900">$124,680</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">Today</span>
      <span className="text-sm font-semibold text-green-600">+$2,340 (+1.9%)</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">YTD Return</span>
      <span className="text-sm font-semibold text-green-600">+12.4%</span>
    </div>
    <div className="grid grid-cols-3 gap-1 mt-3">
      <div className="text-center p-1.5 bg-blue-50 rounded">
        <p className="text-[10px] text-gray-500">Stocks</p>
        <p className="text-xs font-bold text-blue-600">65%</p>
      </div>
      <div className="text-center p-1.5 bg-green-50 rounded">
        <p className="text-[10px] text-gray-500">Bonds</p>
        <p className="text-xs font-bold text-green-600">25%</p>
      </div>
      <div className="text-center p-1.5 bg-orange-50 rounded">
        <p className="text-[10px] text-gray-500">Other</p>
        <p className="text-xs font-bold text-orange-600">10%</p>
      </div>
    </div>
  </div>
);

const RetirementProgressCompact = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-3">
      <Icon name="PiggyBank" size={18} className="text-purple-600" />
      <h4 className="text-sm font-semibold text-gray-800">Retirement</h4>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">401(k)</span>
      <span className="text-sm font-semibold">$89,420</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">IRA</span>
      <span className="text-sm font-semibold">$35,680</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
      <div className="bg-purple-600 h-2 rounded-full" style={{width: '42%'}}></div>
    </div>
    <p className="text-xs text-center text-gray-500">42% to goal • On track for 65</p>
  </div>
);

// Entrepreneur compact widgets
const BusinessExpensesCompact = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-3">
      <Icon name="Building" size={18} className="text-orange-600" />
      <h4 className="text-sm font-semibold text-gray-800">Business Expenses</h4>
    </div>
    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
      <span className="text-sm">Office Rent</span>
      <span className="text-sm font-semibold text-red-600">$2,800</span>
    </div>
    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
      <span className="text-sm">Software</span>
      <span className="text-sm font-semibold text-blue-600">$580</span>
    </div>
    <div className="flex justify-between items-center p-2 bg-green-50 rounded">
      <span className="text-sm">Marketing</span>
      <span className="text-sm font-semibold text-green-600">$1,200</span>
    </div>
  </div>
);

const CashFlowForecastCompact = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 mb-3">
      <Icon name="BarChart3" size={18} className="text-orange-600" />
      <h4 className="text-sm font-semibold text-gray-800">Cash Flow Forecast</h4>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">Expected Revenue</span>
      <span className="text-sm font-semibold text-green-600">$28,400</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">Projected Expenses</span>
      <span className="text-sm font-semibold text-red-600">$19,600</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500">Net Cash Flow</span>
      <span className="text-sm font-bold text-green-600">+$8,800</span>
    </div>
    <div className="p-2 bg-green-50 rounded-lg mt-2">
      <p className="text-xs text-center text-green-700">📈 Positive trend for Q4</p>
    </div>
  </div>
);

// Full-size widgets (keeping original versions)
const ScholarshipTracker = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="Award" size={24} className="text-blue-600" />
      <h3 className="text-lg font-semibold">Scholarship Tracker</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
        <div>
          <p className="font-medium">Merit Scholarship</p>
          <p className="text-sm text-muted-foreground">Due: March 15, 2025</p>
        </div>
        <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">$2,500</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
        <div>
          <p className="font-medium">Academic Excellence Grant</p>
          <p className="text-sm text-muted-foreground">Received</p>
        </div>
        <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">$1,800</span>
      </div>
    </div>
  </div>
);

const StudentLoans = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="GraduationCap" size={24} className="text-blue-600" />
      <h3 className="text-lg font-semibold">Student Loans</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Federal Loan Balance</span>
        <span className="font-semibold text-red-600">$18,420</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Private Loan Balance</span>
        <span className="font-semibold text-red-600">$8,350</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Next Payment</span>
        <span className="font-semibold">$245 (Jan 15)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div className="bg-blue-600 h-2 rounded-full" style={{width: '35%'}}></div>
      </div>
      <p className="text-xs text-center text-muted-foreground">35% paid off</p>
    </div>
  </div>
);

const IncomeStreams = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="Car" size={24} className="text-green-600" />
      <h3 className="text-lg font-semibold">Income Streams</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="Car" size={16} className="text-green-600" />
          <span className="font-medium">Rideshare</span>
        </div>
        <span className="font-semibold text-green-600">$1,240</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="Package" size={16} className="text-blue-600" />
          <span className="font-medium">Delivery</span>
        </div>
        <span className="font-semibold text-blue-600">$680</span>
      </div>
      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="Laptop" size={16} className="text-purple-600" />
          <span className="font-medium">Freelance</span>
        </div>
        <span className="font-semibold text-purple-600">$920</span>
      </div>
    </div>
  </div>
);

const ExpenseDeductions = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="Receipt" size={24} className="text-green-600" />
      <h3 className="text-lg font-semibold">Tax Deductions</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm">Vehicle Expenses</span>
        <span className="font-semibold text-green-600">$1,240</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Phone & Data</span>
        <span className="font-semibold text-green-600">$180</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Equipment</span>
        <span className="font-semibold text-green-600">$320</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between items-center">
        <span className="font-medium">Total Deductions</span>
        <span className="font-bold text-green-600">$1,740</span>
      </div>
    </div>
  </div>
);

const PortfolioPerformance = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="TrendingUp" size={24} className="text-purple-600" />
      <h3 className="text-lg font-semibold">Portfolio Performance</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Value</span>
        <span className="font-bold text-lg">$124,680</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Today's Change</span>
        <span className="font-semibold text-green-600">+$2,340 (+1.9%)</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">YTD Return</span>
        <span className="font-semibold text-green-600">+12.4%</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center p-2 bg-blue-50 rounded">
          <p className="text-xs text-muted-foreground">Stocks</p>
          <p className="font-semibold text-blue-600">65%</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <p className="text-xs text-muted-foreground">Bonds</p>
          <p className="font-semibold text-green-600">25%</p>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded">
          <p className="text-xs text-muted-foreground">Other</p>
          <p className="font-semibold text-orange-600">10%</p>
        </div>
      </div>
    </div>
  </div>
);

const RetirementProgress = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="PiggyBank" size={24} className="text-purple-600" />
      <h3 className="text-lg font-semibold">Retirement Progress</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">401(k) Balance</span>
        <span className="font-semibold">$89,420</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">IRA Balance</span>
        <span className="font-semibold">$35,680</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
        <div className="bg-purple-600 h-3 rounded-full" style={{width: '42%'}}></div>
      </div>
      <p className="text-xs text-center text-muted-foreground">42% to retirement goal</p>
      <p className="text-sm text-center">On track for age 65 retirement</p>
    </div>
  </div>
);

const BusinessExpenses = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="Building" size={24} className="text-orange-600" />
      <h3 className="text-lg font-semibold">Business Expenses</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
        <span className="text-sm">Office Rent</span>
        <span className="font-semibold text-red-600">$2,800</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
        <span className="text-sm">Software & Tools</span>
        <span className="font-semibold text-blue-600">$580</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
        <span className="text-sm">Marketing</span>
        <span className="font-semibold text-green-600">$1,200</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
        <span className="text-sm">Equipment</span>
        <span className="font-semibold text-purple-600">$450</span>
      </div>
    </div>
  </div>
);

const CashFlowForecast = () => (
  <div className="bg-white rounded-lg p-6 border border-border">
    <div className="flex items-center gap-3 mb-4">
      <Icon name="BarChart3" size={24} className="text-orange-600" />
      <h3 className="text-lg font-semibold">Cash Flow Forecast</h3>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Expected Revenue</span>
        <span className="font-semibold text-green-600">$28,400</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Projected Expenses</span>
        <span className="font-semibold text-red-600">$19,600</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Net Cash Flow</span>
        <span className="font-bold text-green-600">+$8,800</span>
      </div>
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-sm text-center text-green-700">
          📈 Positive trend for next quarter
        </p>
      </div>
    </div>
  </div>
);

// Widget component mapping
const WIDGET_COMPONENTS = {
  'ScholarshipTracker': ScholarshipTracker,
  'StudentLoans': StudentLoans,
  'IncomeStreams': IncomeStreams,
  'ExpenseDeductions': ExpenseDeductions,
  'PortfolioPerformance': PortfolioPerformance,
  'RetirementProgress': RetirementProgress,
  'BusinessExpenses': BusinessExpenses,
  'CashFlowForecast': CashFlowForecast,
};

// Compact widget mapping
const COMPACT_WIDGET_COMPONENTS = {
  'ScholarshipTracker': ScholarshipTrackerCompact,
  'StudentLoans': StudentLoansCompact,
  'IncomeStreams': IncomeStreamsCompact,
  'ExpenseDeductions': ExpenseDeductionsCompact,
  'PortfolioPerformance': PortfolioPerformanceCompact,
  'RetirementProgress': RetirementProgressCompact,
  'BusinessExpenses': BusinessExpensesCompact,
  'CashFlowForecast': CashFlowForecastCompact,
};

const RoleDashboardWidgets = ({ compact = false }) => {
  const userRole = getUserRole();
  const widgets = getRoleDashboardWidgets();

  // Fallback to Student role widgets if no role is set (for demo purposes)
  const effectiveRole = userRole || ROLES.STUDENT;
  const effectiveWidgets = widgets?.length > 0 ? widgets : [
    { id: 'scholarship-tracker', component: 'ScholarshipTracker' },
    { id: 'student-loans', component: 'StudentLoans' }
  ];

  // Compact version - show first 2 widgets stacked
  if (compact) {
    const widgetMapping = COMPACT_WIDGET_COMPONENTS;
    const roleLabel = getRoleLabel(effectiveRole);
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {roleLabel === 'Student' ? 'Scholarship & Loans' : 
             roleLabel === 'Gig Worker' ? 'Income & Deductions' :
             roleLabel === 'Professional' ? 'Portfolio & Retirement' : 'Business Overview'}
          </h3>
          <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
            effectiveRole === ROLES?.STUDENT ? 'bg-blue-100 text-blue-700' :
            effectiveRole === ROLES?.GIG_WORKER ? 'bg-green-100 text-green-700' :
            effectiveRole === ROLES?.PROFESSIONAL ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {roleLabel}
          </span>
        </div>
        
        <div className="flex-1 space-y-3 overflow-y-auto">
          {effectiveWidgets?.slice(0, 2).map((widget) => {
            const WidgetComponent = widgetMapping?.[widget?.component];
            if (!WidgetComponent) return null;
            return <WidgetComponent key={widget?.id} />;
          })}
        </div>
      </div>
    );
  }

  // Full version
  return (
    <div className="space-y-6">
      {/* Role indicator */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
        <div className="flex items-center gap-3">
          <Icon 
            name={getRoleIcon(effectiveRole)} 
            size={24} 
            className={getRoleColor(effectiveRole)}
          />
          <div>
            <h2 className="text-lg font-semibold">{getRoleLabel(effectiveRole)} Dashboard</h2>
            <p className="text-sm text-muted-foreground">Customized for your financial needs</p>
          </div>
        </div>
      </div>
      {/* Role-specific widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {effectiveWidgets?.map((widget) => {
          const WidgetComponent = WIDGET_COMPONENTS?.[widget?.component];
          
          if (!WidgetComponent) {
            return (
              <div key={widget?.id} className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground">Widget not found: {widget?.component}</p>
              </div>
            );
          }

          return <WidgetComponent key={widget?.id} />;
        })}
      </div>
    </div>
  );
};

// Helper functions
const getRoleIcon = (role) => {
  const icons = {
    [ROLES?.STUDENT]: 'GraduationCap',
    [ROLES?.GIG_WORKER]: 'Car',
    [ROLES?.PROFESSIONAL]: 'Briefcase',
    [ROLES?.ENTREPRENEUR]: 'Building'
  };
  return icons?.[role] || 'User';
};

const getRoleColor = (role) => {
  const colors = {
    [ROLES?.STUDENT]: 'text-blue-600',
    [ROLES?.GIG_WORKER]: 'text-green-600',
    [ROLES?.PROFESSIONAL]: 'text-purple-600',
    [ROLES?.ENTREPRENEUR]: 'text-orange-600'
  };
  return colors?.[role] || 'text-gray-600';
};

const getRoleLabel = (role) => {
  const labels = {
    [ROLES?.STUDENT]: 'Student',
    [ROLES?.GIG_WORKER]: 'Gig Worker',
    [ROLES?.PROFESSIONAL]: 'Professional',
    [ROLES?.ENTREPRENEUR]: 'Entrepreneur'
  };
  return labels?.[role] || 'User';
};

export default RoleDashboardWidgets;