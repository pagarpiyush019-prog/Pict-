import React from 'react';

const CreateAccountLink = () => {
  const handleCreateAccount = () => {
    window.location.href = '/user-registration';
  };

  return (
    <div className="pt-6 border-t border-white/10">
      <div className="text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={handleCreateAccount}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign up free
          </button>
        </p>
      </div>
    </div>
  );
};

export default CreateAccountLink;