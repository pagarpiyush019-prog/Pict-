import React, { useState } from 'react';
import AuthenticationWrapper from '../../components/ui/AuthenticationWrapper';
import RegistrationForm from './components/RegistrationForm';
import SocialAuthOptions from './components/SocialAuthOptions';
import TrustSignals from './components/TrustSignals';
import LoginRedirect from './components/LoginRedirect';

const UserRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // Mock credentials for testing
  const mockCredentials = {
    testUser: {
      email: "john.doe@example.com",
      password: "SecurePass123!",
      fullName: "John Doe"
    },
    adminUser: {
      email: "admin@financetracker.com",
      password: "AdminPass456!",
      fullName: "Admin User"
    }
  };

  const handleRegistration = async (formData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock registration validation
      const existingEmails = [
        "existing@example.com",
        "taken@financetracker.com"
      ];
      
      if (existingEmails?.includes(formData?.email?.toLowerCase())) {
        alert('This email is already registered. Please use a different email or sign in to your existing account.');
        setLoading(false);
        return;
      }
      
      // Simulate successful registration
      const userData = {
        id: Date.now(),
        fullName: formData?.fullName,
        email: formData?.email,
        currency: formData?.currency,
        financialGoals: formData?.financialGoals,
        registeredAt: new Date()?.toISOString(),
        isVerified: false
      };
      
      // Store user data in localStorage (mock database)
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('authToken', `token_${userData?.id}`);
      localStorage.setItem('registrationSuccess', 'true');
      
      // Redirect to dashboard
      window.location.href = '/financial-dashboard';
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setSocialLoading(true);
    
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const googleUser = {
        id: Date.now(),
        fullName: "Google User",
        email: "google.user@gmail.com",
        currency: "USD",
        financialGoals: [],
        registeredAt: new Date()?.toISOString(),
        isVerified: true,
        authProvider: "google"
      };
      
      localStorage.setItem('userData', JSON.stringify(googleUser));
      localStorage.setItem('authToken', `google_token_${googleUser?.id}`);
      localStorage.setItem('registrationSuccess', 'true');
      
      window.location.href = '/financial-dashboard';
      
    } catch (error) {
      console.error('Google auth error:', error);
      alert('Google authentication failed. Please try again.');
    } finally {
      setSocialLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setSocialLoading(true);
    
    try {
      // Simulate Apple OAuth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const appleUser = {
        id: Date.now(),
        fullName: "Apple User",
        email: "apple.user@icloud.com",
        currency: "USD",
        financialGoals: [],
        registeredAt: new Date()?.toISOString(),
        isVerified: true,
        authProvider: "apple"
      };
      
      localStorage.setItem('userData', JSON.stringify(appleUser));
      localStorage.setItem('authToken', `apple_token_${appleUser?.id}`);
      localStorage.setItem('registrationSuccess', 'true');
      
      window.location.href = '/financial-dashboard';
      
    } catch (error) {
      console.error('Apple auth error:', error);
      alert('Apple authentication failed. Please try again.');
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticationWrapper
        title="Create Your Account"
        subtitle="Start your journey to financial freedom with secure, comprehensive money management"
      >
        <div className="space-y-6">
          {/* Social Authentication Options */}
          <SocialAuthOptions
            onGoogleAuth={handleGoogleAuth}
            onAppleAuth={handleAppleAuth}
            loading={socialLoading}
          />

          {/* Registration Form */}
          <RegistrationForm
            onSubmit={handleRegistration}
            loading={loading}
          />

          {/* Trust Signals */}
          <TrustSignals />

          {/* Login Redirect */}
          <LoginRedirect />
        </div>
      </AuthenticationWrapper>
    </div>
  );
};

export default UserRegistration;