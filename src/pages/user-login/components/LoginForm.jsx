import React, { useState, useRef, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onSubmit, isLoading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [demoFilled, setDemoFilled] = useState(false);
  const submitButtonRef = useRef(null);

  // Demo credentials for normal user
  const demoCredentials = {
    normal_user: { email: 'user@financetracker.com', password: 'user123' }
  };

  const roleCards = [
    {
      value: 'normal_user',
      label: 'Normal User',
      icon: 'User',
      benefit: 'Complete financial management with all features - investments, budgeting, savings, reports, and more',
      color: 'blue',
      recommended: true
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: {
        bg: isSelected ? 'bg-blue-500/20' : 'bg-white/5',
        border: isSelected ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400',
        text: isSelected ? 'text-blue-300' : 'text-slate-300',
        button: 'bg-blue-500 hover:bg-blue-600',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      },
      green: {
        bg: isSelected ? 'bg-green-500/20' : 'bg-white/5',
        border: isSelected ? 'border-green-500 ring-2 ring-green-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-400',
        text: isSelected ? 'text-green-300' : 'text-slate-300',
        button: 'bg-green-500 hover:bg-green-600'
      },
      purple: {
        bg: isSelected ? 'bg-purple-500/20' : 'bg-white/5',
        border: isSelected ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-400',
        text: isSelected ? 'text-purple-300' : 'text-slate-300',
        button: 'bg-purple-500 hover:bg-purple-600'
      },
      orange: {
        bg: isSelected ? 'bg-orange-500/20' : 'bg-white/5',
        border: isSelected ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-white/10',
        icon: isSelected ? 'bg-orange-500 text-white' : 'bg-orange-500/20 text-orange-400',
        text: isSelected ? 'text-orange-300' : 'text-slate-300',
        button: 'bg-orange-500 hover:bg-orange-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const handleDemoClick = (role) => {
    const creds = demoCredentials[role.value];
    setFormData({
      email: creds.email,
      password: creds.password,
      role: role.value,
      rememberMe: true
    });
    setValidationErrors({});
    setDemoFilled(true);
    
    // Focus the submit button after a short delay
    setTimeout(() => {
      submitButtonRef.current?.focus();
      submitButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDemoFilled(false);
    if (validationErrors?.[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData?.role) {
      errors.role = 'Please select a role by clicking "Use Demo"';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-2 border-blue-500/30 mb-4">
          <Icon name="User" size={32} className="text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Welcome Back!</h3>
        <p className="text-sm text-slate-400">Sign in to access all financial features</p>
      </div>

      {/* Role Cards */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300 block flex items-center gap-2">
          <Icon name="UserCircle" size={16} />
          User Account
        </label>
        
        <div className="grid grid-cols-1 gap-3">
          {roleCards.map((role) => {
            const isSelected = formData?.role === role.value;
            const colors = getColorClasses(role.color, isSelected);
            
            return (
              <div
                key={role.value}
                className={`
                  relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300
                  ${colors.bg} ${colors.border}
                  ${isSelected ? 'shadow-xl shadow-blue-500/20 scale-[1.02]' : 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]'}
                  backdrop-blur-sm
                `}
              >
                {/* Recommended Badge */}
                {role.recommended && (
                  <div className="absolute -top-2 left-4 animate-pulse">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 ${colors.badge} shadow-lg`}>
                      ⭐ Recommended
                    </span>
                  </div>
                )}
                
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 animate-bounce">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50 ring-2 ring-green-500/30">
                      <Icon name="Check" size={16} className="text-white" />
                    </div>
                  </div>
                )}
                
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg ${colors.icon}`}>
                  <Icon name={role.icon} size={28} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={`text-lg font-bold mb-1 ${colors.text}`}>
                    {role.label}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed">
                    {role.benefit}
                  </div>
                  {/* Features list */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Investments', 'Budgeting', 'Savings', 'Reports', 'Paper Trading', 'Quiz'].map((feature, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-slate-400 border border-white/10">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Use Demo Button */}
                <button
                  type="button"
                  onClick={() => handleDemoClick(role)}
                  disabled={isLoading}
                  className={`
                    px-5 py-3 rounded-xl text-white text-sm font-bold transition-all flex-shrink-0 shadow-lg
                    ${isSelected 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/30' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/30'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:scale-105 active:scale-95
                    flex items-center gap-2
                  `}
                >
                  {isSelected ? (
                    <>
                      <Icon name="CheckCircle" size={16} />
                      Selected
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={16} />
                      Use Demo
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
        {validationErrors?.role && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              {validationErrors.role}
            </p>
          </div>
        )}
      </div>

      {/* Credentials Preview (shown when demo is selected) */}
      {demoFilled && formData.role && (
        <div className="p-5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl backdrop-blur-sm animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-green-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-green-300">Demo credentials loaded!</span>
              <p className="text-xs text-green-400/80">Ready to sign in</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-slate-400 block mb-1">Email</span>
              <span className="text-white font-mono">{formData.email}</span>
            </div>
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-slate-400 block mb-1">Password</span>
              <span className="text-white font-mono">{'•'.repeat(formData.password.length)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden inputs for form data */}
      <input type="hidden" name="email" value={formData.email} />
      <input type="hidden" name="password" value={formData.password} />
      <input type="hidden" name="role" value={formData.role} />
      
      {/* Submit Button */}
      <button
        ref={submitButtonRef}
        type="submit"
        disabled={isLoading || !formData.role}
        className={`
          w-full h-16 text-white font-bold rounded-2xl shadow-2xl transition-all duration-300 
          flex items-center justify-center gap-3 text-lg relative overflow-hidden
          ${formData.role 
            ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 hover:scale-[1.02]' 
            : 'bg-slate-700 cursor-not-allowed'
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100
          ${demoFilled ? 'ring-4 ring-green-500/50 ring-offset-2 ring-offset-slate-900' : ''}
        `}
      >
        {formData.role && (
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
          ) : formData.role ? (
            <>
              <Icon name="LogIn" size={24} />
              <span>Sign In as {roleCards.find(r => r.value === formData.role)?.label}</span>
              <Icon name="ArrowRight" size={20} />
            </>
          ) : (
            <>
              <Icon name="MousePointer" size={20} />
              <span>Select Demo Account Above</span>
            </>
          )}
        </span>
      </button>
      
      {/* Quick tip */}
      {!formData.role && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-center text-xs text-blue-300 flex items-center justify-center gap-2">
            <Icon name="Info" size={14} />
            Click "Use Demo" to auto-fill credentials
          </p>
        </div>
      )}
      
      {/* Advisor Login Link */}
      <div className="pt-4 border-t border-white/10">
        <a
          href="/advisor-login"
          className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 text-violet-300 font-bold rounded-xl border-2 border-violet-500/30 hover:bg-violet-500/30 hover:border-violet-500/50 transition-all shadow-lg hover:shadow-violet-500/20 group"
        >
          <Icon name="UserCheck" size={20} className="group-hover:scale-110 transition-transform" />
          <span>Login as Financial Advisor</span>
          <Icon name="ArrowRight" size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </form>
  );
};

export default LoginForm;