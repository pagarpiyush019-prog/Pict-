// Role-based feature filtering utility
export const ROLES = {
  STUDENT: 'student',
  GIG_WORKER: 'gig_worker',
  PROFESSIONAL: 'professional',
  ENTREPRENEUR: 'entrepreneur',
  NORMAL_USER: 'normal_user',
  ADVISOR: 'advisor'
};

// Feature definitions for each role
export const ROLE_FEATURES = {
  [ROLES?.STUDENT]: {
    dashboard: {
      budgetPlanning: true,
      transactionManagement: true,
      investmentPortfolio: false, // Limited access for students
      financialGoals: true,
      scholarshipTracker: true, // Student-specific
      studentLoanManagement: true, // Student-specific
      partTimeIncomeTracker: true, // Student-specific
      textbookBudget: true // Student-specific
    },
    navigation: {
      showAdvancedInvestments: false,
      showBusinessTools: false,
      showStudentTools: true
    },
    limits: {
      maxBudgetCategories: 10,
      maxInvestmentAccounts: 2
    }
  },
  
  [ROLES?.GIG_WORKER]: {
    dashboard: {
      budgetPlanning: true,
      transactionManagement: true,
      investmentPortfolio: true,
      multiIncomeTracker: true, // Gig-specific
      expenseDeductionTracker: true, // Gig-specific
      taxPreparationTools: true, // Gig-specific
      platformEarningsTracker: true, // Gig-specific
      equipmentDepreciation: true, // Gig-specific
      mileageTracker: true // Gig-specific
    },
    navigation: {
      showGigTools: true,
      showTaxTools: true,
      showBusinessTools: false
    },
    limits: {
      maxIncomeStreams: 15,
      maxExpenseCategories: 20
    }
  },

  [ROLES?.PROFESSIONAL]: {
    dashboard: {
      budgetPlanning: true,
      transactionManagement: true,
      investmentPortfolio: true,
      retirementPlanning: true, // Professional-specific
      advancedAnalytics: true, // Professional-specific
      performanceMetrics: true, // Professional-specific
      portfolioRebalancing: true, // Professional-specific
      riskAssessment: true // Professional-specific
    },
    navigation: {
      showAdvancedInvestments: true,
      showProfessionalTools: true,
      showAnalytics: true
    },
    limits: {
      maxInvestmentAccounts: 10,
      maxPortfolioAllocations: 20
    }
  },

  [ROLES?.ENTREPRENEUR]: {
    dashboard: {
      budgetPlanning: true,
      transactionManagement: true,
      investmentPortfolio: true,
      businessExpenseTracker: true, // Entrepreneur-specific
      cashFlowForecasting: true, // Entrepreneur-specific
      invoiceManagement: true, // Entrepreneur-specific
      growthAnalytics: true, // Entrepreneur-specific
      businessMetrics: true, // Entrepreneur-specific
      taxPlanningTools: true // Entrepreneur-specific
    },
    navigation: {
      showBusinessTools: true,
      showAnalytics: true,
      showForecastingTools: true
    },
    limits: {
      maxBusinessCategories: 25,
      maxClients: 100
    }
  },

  [ROLES?.NORMAL_USER]: {
    dashboard: {
      budgetPlanning: true,
      transactionManagement: true,
      investmentPortfolio: true,
      financialGoals: true,
      paperTrading: true,
      investmentQuiz: true,
      savings: true,
      reports: true,
      moneyTracker: true,
      advisorAccess: true
    },
    navigation: {
      showAllFeatures: true,
      showAdvisorDashboard: false
    },
    limits: {
      maxBudgetCategories: 20,
      maxInvestmentAccounts: 10
    }
  },

  [ROLES?.ADVISOR]: {
    dashboard: {
      budgetPlanning: true,
      transactionManagement: true,
      investmentPortfolio: true,
      financialGoals: true,
      paperTrading: true,
      investmentQuiz: true,
      savings: true,
      reports: true,
      moneyTracker: true,
      advisorAccess: true,
      advisorDashboard: true, // Advisor-specific
      clientManagement: true, // Advisor-specific
      meetingScheduler: true, // Advisor-specific
      messagingSystem: true // Advisor-specific
    },
    navigation: {
      showAllFeatures: true,
      showAdvisorDashboard: true
    },
    limits: {
      maxClients: 500,
      maxMeetingsPerDay: 20
    }
  }
};

// Get user role from localStorage
export const getUserRole = () => {
  try {
    return localStorage.getItem('userRole') || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

// Set user role in localStorage
export const setUserRole = (role) => {
  try {
    if (Object.values(ROLES)?.includes(role)) {
      localStorage.setItem('userRole', role);
      return true;
    }
    throw new Error('Invalid role');
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
};

// Check if user has access to a specific feature
export const hasFeatureAccess = (featureCategory, featureName) => {
  const userRole = getUserRole();
  if (!userRole || !ROLE_FEATURES?.[userRole]) {
    return false;
  }
  
  const roleFeatures = ROLE_FEATURES?.[userRole];
  return roleFeatures?.[featureCategory]?.[featureName] === true;
};

// Get all features for current user role
export const getUserFeatures = () => {
  const userRole = getUserRole();
  if (!userRole || !ROLE_FEATURES?.[userRole]) {
    return null;
  }
  return ROLE_FEATURES?.[userRole];
};

// Get navigation items based on user role
export const getFilteredNavigation = (allNavItems) => {
  const userRole = getUserRole();
  if (!userRole) return allNavItems;
  
  const roleFeatures = ROLE_FEATURES?.[userRole];
  if (!roleFeatures?.navigation) return allNavItems;
  
  return allNavItems?.filter(item => {
    // Check if navigation item should be shown for this role
    switch (item?.key) {
      case 'advanced-investments':
        return roleFeatures?.navigation?.showAdvancedInvestments;
      case 'business-tools':
        return roleFeatures?.navigation?.showBusinessTools;
      case 'student-tools':
        return roleFeatures?.navigation?.showStudentTools;
      case 'gig-tools':
        return roleFeatures?.navigation?.showGigTools;
      case 'tax-tools':
        return roleFeatures?.navigation?.showTaxTools;
      case 'professional-tools':
        return roleFeatures?.navigation?.showProfessionalTools;
      case 'analytics':
        return roleFeatures?.navigation?.showAnalytics;
      case 'forecasting-tools':
        return roleFeatures?.navigation?.showForecastingTools;
      default:
        return true; // Show basic items for all roles
    }
  });
};

// Get role-specific dashboard widgets
export const getRoleDashboardWidgets = () => {
  const userRole = getUserRole();
  if (!userRole) return [];
  
  const roleFeatures = ROLE_FEATURES?.[userRole]?.dashboard;
  if (!roleFeatures) return [];
  
  const widgets = [];
  
  // Common widgets for all roles
  if (roleFeatures?.budgetPlanning) {
    widgets?.push({
      id: 'budget-overview',
      title: 'Budget Overview',
      component: 'BudgetOverview',
      priority: 1
    });
  }
  
  if (roleFeatures?.transactionManagement) {
    widgets?.push({
      id: 'recent-transactions',
      title: 'Recent Transactions',
      component: 'RecentTransactions',
      priority: 2
    });
  }
  
  // Role-specific widgets
  switch (userRole) {
    case ROLES?.STUDENT:
      if (roleFeatures?.scholarshipTracker) {
        widgets?.push({
          id: 'scholarship-tracker',
          title: 'Scholarship Tracker',
          component: 'ScholarshipTracker',
          priority: 3
        });
      }
      if (roleFeatures?.studentLoanManagement) {
        widgets?.push({
          id: 'student-loans',
          title: 'Student Loans',
          component: 'StudentLoans',
          priority: 4
        });
      }
      break;
      
    case ROLES?.GIG_WORKER:
      if (roleFeatures?.multiIncomeTracker) {
        widgets?.push({
          id: 'income-streams',
          title: 'Income Streams',
          component: 'IncomeStreams',
          priority: 3
        });
      }
      if (roleFeatures?.expenseDeductionTracker) {
        widgets?.push({
          id: 'expense-deductions',
          title: 'Tax Deductions',
          component: 'ExpenseDeductions',
          priority: 4
        });
      }
      break;
      
    case ROLES?.PROFESSIONAL:
      if (roleFeatures?.investmentPortfolio) {
        widgets?.push({
          id: 'portfolio-performance',
          title: 'Portfolio Performance',
          component: 'PortfolioPerformance',
          priority: 3
        });
      }
      if (roleFeatures?.retirementPlanning) {
        widgets?.push({
          id: 'retirement-progress',
          title: 'Retirement Progress',
          component: 'RetirementProgress',
          priority: 4
        });
      }
      break;
      
    case ROLES?.ENTREPRENEUR:
      if (roleFeatures?.businessExpenseTracker) {
        widgets?.push({
          id: 'business-expenses',
          title: 'Business Expenses',
          component: 'BusinessExpenses',
          priority: 3
        });
      }
      if (roleFeatures?.cashFlowForecasting) {
        widgets?.push({
          id: 'cash-flow-forecast',
          title: 'Cash Flow Forecast',
          component: 'CashFlowForecast',
          priority: 4
        });
      }
      break;
  }
  
  return widgets?.sort((a, b) => a?.priority - b?.priority);
};

// Get role display information
export const getRoleDisplayInfo = (role) => {
  const roleInfo = {
    [ROLES?.STUDENT]: {
      label: 'Student',
      description: 'Focused on educational expenses and future planning',
      color: 'blue',
      icon: 'GraduationCap'
    },
    [ROLES?.GIG_WORKER]: {
      label: 'Gig Worker',
      description: 'Managing multiple income streams and expenses',
      color: 'green',
      icon: 'Car'
    },
    [ROLES?.PROFESSIONAL]: {
      label: 'Professional',
      description: 'Advanced investment and retirement planning',
      color: 'purple',
      icon: 'Briefcase'
    },
    [ROLES?.ENTREPRENEUR]: {
      label: 'Entrepreneur',
      description: 'Business financial management and growth',
      color: 'orange',
      icon: 'Building'
    }
  };
  
  return roleInfo?.[role] || null;
};

export default {
  ROLES,
  ROLE_FEATURES,
  getUserRole,
  setUserRole,
  hasFeatureAccess,
  getUserFeatures,
  getFilteredNavigation,
  getRoleDashboardWidgets,
  getRoleDisplayInfo
};