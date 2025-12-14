import React, { useState } from 'react';

/**
 * Shared layout wrapper for authentication pages (login / registration).
 *
 * Props:
 * - title: string – main heading for the page
 * - subtitle: string – supporting description under the title
 * - children: ReactNode – the actual form / content
 * - onTryDemo: function – callback for demo button
 * - onViewRoles: function – callback for view roles button
 */
const AuthenticationWrapper = ({ title, subtitle, children, onTryDemo, onViewRoles }) => {
  const [showRolesModal, setShowRolesModal] = useState(false);

  const handleTryDemo = () => {
    if (onTryDemo) {
      onTryDemo();
    } else {
      // Default: scroll to form or trigger student demo
      window.dispatchEvent(new CustomEvent('tryStudentDemo'));
    }
  };

  const handleViewRoles = () => {
    setShowRolesModal(true);
  };

  const roles = [
    { name: 'Normal User', icon: '👤', desc: 'Complete financial management with all features', color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
          
          {/* Left: Premium Hero Section */}
          <div className="hidden lg:flex flex-col space-y-10">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-1 ring-white/10">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  FinanceTracker
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 rounded-full border border-blue-500/30">
                    AI-Powered
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Title */}
            <div className="space-y-5">
              {/* Stats Badges - moved up */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
                  <span className="text-green-400 text-sm font-bold">50K+</span>
                  <span className="text-green-400/70 text-xs">users</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                  <span className="text-yellow-400 text-sm font-bold">4.9★</span>
                  <span className="text-yellow-400/70 text-xs">rating</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <span className="text-blue-400 text-sm font-bold">₹2Cr+</span>
                  <span className="text-blue-400/70 text-xs">tracked</span>
                </div>
              </div>
              
              <h2 className="text-5xl xl:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Your AI Finance Coach,{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Complete Financial Management
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
                Intelligent financial guidance with investment tracking, budgeting, savings, reports, and expert advisor access.
              </p>
              
              {/* Social Proof Line */}
              <p className="text-sm text-slate-500 italic">
                Used by students, freelancers & small businesses to manage over ₹2 Crore in tracked spending.
              </p>
              
              {/* AI Features Strip */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Adaptive Budgets
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Multi-Income Coaching
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Smart Alerts
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  Goal Insights
                </span>
              </div>
            </div>

            {/* AI Feature Highlights */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="font-semibold text-white text-sm">AI Coach</div>
                <div className="text-xs text-slate-500 mt-1">Personalized advice via LLM</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="font-semibold text-white text-sm">Smart Budgets</div>
                <div className="text-xs text-slate-500 mt-1">Auto-adjusts to your spending</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="font-semibold text-white text-sm">Auto Insights</div>
                <div className="text-xs text-slate-500 mt-1">Anomaly detection & tips</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="/advisor-login"
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-600 text-white font-bold rounded-xl shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer"></div>
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-xl">👨‍💼</span>
                  <span>Advisor Login</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
            </div>

            {/* Security Icons Row - compact */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400">Bank-grade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400">MFA Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400">GDPR</span>
              </div>
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 ring-1 ring-inset ring-white/10">
              {/* Mobile Logo */}
              <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">
                  FinanceTracker
                </span>
              </div>

              {/* Card Header */}
              <div className="space-y-2 mb-8 text-center lg:text-left">
                {title && (
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Form Content */}
              <div className="space-y-5">
                {children}
              </div>
            </div>

            {/* Mobile CTAs */}
            <div className="flex lg:hidden items-center justify-center gap-4 mt-6">
              <a
                href="/advisor-login"
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg"
              >
                👨‍💼 Advisor Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Modal */}
      {showRolesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRolesModal(false)}>
          <div 
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Choose Your Role</h3>
              <button 
                onClick={() => setShowRolesModal(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid gap-3">
              {roles.map((role) => (
                <div
                  key={role.name}
                  className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center gap-4"
                  onClick={() => setShowRolesModal(false)}
                >
                  <div className="text-3xl">{role.icon}</div>
                  <div>
                    <div className="font-semibold text-white">{role.name}</div>
                    <div className="text-sm text-slate-400">{role.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationWrapper;
