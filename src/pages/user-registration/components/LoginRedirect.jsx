import React from 'react';
import Button from '../../../components/ui/Button';

const LoginRedirect = () => {
  const handleLoginRedirect = () => {
    window.location.href = '/user-login';
  };

  return (
    <div className="mt-6 pt-6 border-t border-border text-center">
      <p className="text-sm text-muted-foreground mb-3">
        Already have an account?
      </p>
      <Button
        variant="outline"
        size="default"
        onClick={handleLoginRedirect}
        iconName="LogIn"
        iconPosition="left"
        className="w-full sm:w-auto"
      >
        Sign In to Your Account
      </Button>
    </div>
  );
};

export default LoginRedirect;