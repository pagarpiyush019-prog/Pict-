import React from 'react';
import Icon from '../../../components/AppIcon';

const ErrorMessage = ({ error, onDismiss }) => {
  if (!error) return null;

  const getErrorDetails = (errorType) => {
    const errorMap = {
      'invalid_credentials': {
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please try again.',
        suggestion: 'Check your email and password, or use "Forgot password?" to reset.'
      },
      'role_mismatch': {
        title: 'Role Mismatch',
        message: 'The selected role does not match your account type.',
        suggestion: 'Please select the correct role for your account.'
      },
      'account_locked': {
        title: 'Account Temporarily Locked',
        message: 'Your account has been locked due to multiple failed login attempts.',
        suggestion: 'Please wait 15 minutes before trying again or reset your password.'
      },
      'network_error': {
        title: 'Connection Problem',
        message: 'Unable to connect to our servers. Please check your internet connection.',
        suggestion: 'Try refreshing the page or check your network connection.'
      },
      'server_error': {
        title: 'Server Error',
        message: 'We\'re experiencing technical difficulties. Please try again in a few minutes.',
        suggestion: 'If the problem persists, please contact our support team.'
      },
      'validation_error': {
        title: 'Invalid Input',
        message: 'Please check your email and password format.',
        suggestion: 'Ensure your email is valid and password is at least 6 characters.'
      }
    };

    return errorMap?.[errorType] || {
      title: 'Login Failed',
      message: typeof error === 'string' ? error : 'An unexpected error occurred.',
      suggestion: 'Please try again or contact support if the issue persists.'
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <Icon name="AlertCircle" size={18} className="text-red-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-400 mb-1">
            {errorDetails?.title}
          </h3>
          <p className="text-sm text-red-300/80 mb-1">
            {errorDetails?.message}
          </p>
          <p className="text-xs text-slate-500">
            {errorDetails?.suggestion}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-red-400/60 hover:text-red-400 transition-colors duration-200"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;