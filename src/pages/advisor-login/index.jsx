import React, { useState } from 'react';
import AuthenticationWrapper from '../../components/ui/AuthenticationWrapper';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';

const AdvisorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Mock advisor credentials
  const advisorCredentials = {
    advisor1: { email: 'advisor@financetracker.com', password: 'advisor123' },
    advisor2: { email: 'rajesh.kumar@advisor.com', password: 'advisor123' },
    advisor3: { email: 'priya.sharma@advisor.com', password: 'advisor123' }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleDemoClick = () => {
    const creds = advisorCredentials.advisor1;
    setFormData({
      email: creds.email,
      password: creds.password,
      rememberMe: true
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const matchingCredential = Object.values(advisorCredentials).find(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (!matchingCredential) {
        throw new Error('Invalid advisor credentials');
      }

      // Store advisor session
      const mockToken = `advisor_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userRole', 'advisor');
      localStorage.setItem('userProfile', JSON.stringify({
        email: formData.email,
        role: 'advisor',
        loginTime: new Date().toISOString()
      }));

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect to advisor dashboard
      window.location.href = '/advisor-dashboard';

    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationWrapper
        title="Advisor Login"
        subtitle="Access your professional advisor dashboard to manage clients and provide expert financial guidance"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Welcome Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-500/30 mb-4">
              <Icon name="UserCheck" size={32} className="text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Financial Advisor Portal</h3>
            <p className="text-sm text-slate-400">Professional tools for client management</p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { icon: 'Users', label: 'Clients', colorClass: 'text-violet-400' },
              { icon: 'Video', label: 'Meetings', colorClass: 'text-purple-400' },
              { icon: 'MessageCircle', label: 'Messages', colorClass: 'text-fuchsia-400' }
            ].map((feature, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 text-center hover:bg-white/10 transition-all">
                <Icon name={feature.icon} size={20} className={`${feature.colorClass} mx-auto mb-1`} />
                <p className="text-[10px] text-slate-400">{feature.label}</p>
              </div>
            ))}
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemoClick}
            className="w-full px-5 py-4 bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 text-white font-bold rounded-xl shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
          >
            <Icon name="Sparkles" size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Use Demo Credentials</span>
            <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl backdrop-blur-sm animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Icon name="AlertCircle" size={20} className="text-red-400" />
                </div>
                <span className="text-sm font-semibold text-red-400">{error}</span>
              </div>
            </div>
          )}

          {/* Credentials Preview (shown when demo is clicked) */}
          {formData.email && formData.password && (
            <div className="p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="CheckCircle" size={18} className="text-violet-400" />
                <span className="text-sm font-semibold text-violet-300">Credentials Ready</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-slate-400 block mb-1">Email</span>
                  <span className="text-white font-mono text-[10px]">{formData.email}</span>
                </div>
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-slate-400 block mb-1">Password</span>
                  <span className="text-white font-mono text-[10px]">{'•'.repeat(formData.password.length)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Icon name="Mail" size={16} />
              Advisor Email
            </label>
            <div className="relative">
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="advisor@financetracker.com"
                required
                className="w-full pl-10 bg-white/5 border-2 border-white/10 focus:border-violet-500/50"
              />
              <Icon name="Mail" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <Icon name="Lock" size={16} />
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-10 bg-white/5 border-2 border-white/10 focus:border-violet-500/50"
              />
              <Icon name="Lock" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-sm text-slate-300 cursor-pointer flex-1">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
            className="w-full h-16 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 relative overflow-hidden"
          >
            {formData.email && formData.password && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            )}
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={24} />
                  <span>Sign In as Advisor</span>
                  <Icon name="ArrowRight" size={20} />
                </>
              )}
            </span>
          </button>

          {/* Back to User Login */}
          <div className="pt-4 border-t border-white/10">
            <a
              href="/user-login"
              className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/5 text-slate-300 font-semibold rounded-xl border-2 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <Icon name="ArrowLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to User Login</span>
            </a>
          </div>
        </form>
      </AuthenticationWrapper>
    </div>
  );
};

export default AdvisorLogin;

