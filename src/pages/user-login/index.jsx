import React, { useState, useEffect } from 'react';
import AuthenticationWrapper from '../../components/ui/AuthenticationWrapper';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import ErrorMessage from './components/ErrorMessage';
import CreateAccountLink from './components/CreateAccountLink';
import { setUserRole, ROLES } from '../../utils/roleFilter';

const UserLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  // Enhanced mock credentials - both users and advisors
  const mockCredentials = {
    // Regular users
    user1: { email: "user@financetracker.com", password: "user123", role: 'normal_user' },
    user2: { email: "demo@financetracker.com", password: "demo123", role: 'normal_user' },
    user3: { email: "john.doe@example.com", password: "SecurePass123!", role: 'normal_user' },
    // Advisors
    advisor1: { email: "advisor@financetracker.com", password: "advisor123", role: 'advisor' },
    advisor2: { email: "rajesh.kumar@advisor.com", password: "advisor123", role: 'advisor' },
    advisor3: { email: "priya.sharma@advisor.com", password: "advisor123", role: 'advisor' }
  };

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (authToken && userRole) {
      redirectToDashboard(userRole);
    }
  }, []);

  const redirectToDashboard = (role) => {
    if (role === 'advisor') {
      window.location.href = '/advisor-dashboard';
    } else {
      window.location.href = '/financial-dashboard';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleDemoClick = (type) => {
    if (type === 'user') {
      setFormData({
        email: 'user@financetracker.com',
        password: 'user123',
        rememberMe: true
      });
    } else {
      setFormData({
        email: 'advisor@financetracker.com',
        password: 'advisor123',
        rememberMe: true
      });
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find matching credentials
      const matchingCredential = Object.values(mockCredentials).find(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (!matchingCredential) {
        throw new Error('Invalid email or password');
      }

      // Simulate successful login
      const mockToken = `token_${matchingCredential.role}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userEmail', formData.email);
      
      // Set user role using the utility
      setUserRole(matchingCredential.role);
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Role-specific data storage
      localStorage.setItem('userProfile', JSON.stringify({
        email: formData.email,
        role: matchingCredential.role,
        loginTime: new Date().toISOString(),
        features: getUserRoleFeatures(matchingCredential.role)
      }));

      // Redirect to appropriate dashboard
      redirectToDashboard(matchingCredential.role);

    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRoleFeatures = (role) => {
    if (role === 'advisor') {
      return {
        investments: true,
        budgeting: true,
        savings: true,
        reports: true,
        moneyTracker: true,
        paperTrading: true,
        investmentQuiz: true,
        advisorAccess: true,
        advisorDashboard: true,
        clientManagement: true
      };
    }
    return {
      investments: true,
      budgeting: true,
      savings: true,
      reports: true,
      moneyTracker: true,
      paperTrading: true,
      investmentQuiz: true,
      advisorAccess: true
    };
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationWrapper
        title="Welcome Back"
        subtitle="Sign in to your FinanceTracker account - for users and financial advisors"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && <ErrorMessage error={error} onDismiss={handleDismissError} />}

          {/* Welcome Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-blue-500/30 mb-4">
              <Icon name="Lock" size={32} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Secure Login</h3>
            <p className="text-sm text-slate-400">Access your personalized financial dashboard</p>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Icon name="Mail" size={16} />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Icon name="Lock" size={16} />
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pr-12"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                disabled={isLoading}
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-2 focus:ring-blue-500/30"
                disabled={isLoading}
              />
              <span className="text-sm text-slate-400">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Icon name="Loader" size={20} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <Icon name="LogIn" size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Demo Credentials */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <p className="text-sm text-slate-400 text-center font-medium">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoClick('user')}
                disabled={isLoading}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Icon name="User" size={24} className="text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">User Demo</span>
                  <span className="text-xs text-slate-400">All features except advisor</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('advisor')}
                disabled={isLoading}
                className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-500/30 hover:border-violet-500/50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                    <Icon name="UserCheck" size={24} className="text-violet-400" />
                  </div>
                  <span className="text-sm font-semibold text-white">Advisor Demo</span>
                  <span className="text-xs text-slate-400">Full access + advisor tools</span>
                </div>
              </button>
            </div>
          </div>

          {/* Create Account Link */}
          <CreateAccountLink />
        </form>
      </AuthenticationWrapper>
    </div>
  );
};

export default UserLogin;