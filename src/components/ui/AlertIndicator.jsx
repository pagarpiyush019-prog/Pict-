import React from 'react';
import Icon from '../AppIcon';

const AuthenticationWrapper = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={24} color="white" />
            </div>
            <span className="text-2xl font-bold text-foreground">FinanceTracker</span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-card sm:rounded-lg sm:px-10 border border-border">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 FinanceTracker. Secure financial management for everyone.
        </p>
      </div>
    </div>
  );
};

export default AuthenticationWrapper;