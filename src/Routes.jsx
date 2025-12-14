import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import InvestmentPortfolio from './pages/investment-portfolio';
import TransactionManagement from './pages/transaction-management';
import UserRegistration from './pages/user-registration';
import FinancialDashboard from './pages/financial-dashboard';
import BudgetPlanning from './pages/budget-planning';
import Profile from './pages/profile';
import Reports from './pages/reports';
import MoneyTracker from './pages/money-tracker';
import Savings from './pages/savings';
import Advisor from './pages/advisor';
import PaperTrading from './pages/paper-trading';
import InvestmentQuiz from './pages/investment-quiz';
import AdvisorDashboard from './pages/advisor-dashboard';
import MoreMenu from './pages/more-menu';
import Layout from "components/Layout";
import ProtectedRoute from "components/ProtectedRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<UserLogin />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-registration" element={<UserRegistration />} />

          {/* Advisor Dashboard - Only accessible to advisors */}
          <Route 
            path="/advisor-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['advisor']}>
                <Layout><AdvisorDashboard /></Layout>
              </ProtectedRoute>
            } 
          />

          {/* All other routes - accessible to both users and advisors */}
          <Route 
            path="/financial-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><FinancialDashboard /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transaction-management" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><TransactionManagement /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/budget-planning" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><BudgetPlanning /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/investment-portfolio" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><InvestmentPortfolio /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><Reports /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/money-tracker" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><MoneyTracker /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/savings" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><Savings /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/advisor" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><Advisor /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/paper-trading" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><PaperTrading /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/investment-quiz" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><InvestmentQuiz /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/more-menu" 
            element={
              <ProtectedRoute allowedRoles={['normal_user', 'advisor']}>
                <Layout><MoreMenu /></Layout>
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
