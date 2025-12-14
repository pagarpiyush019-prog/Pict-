import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { getUserRole } from '../../utils/roleFilter';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [isFabOpen, setIsFabOpen] = useState(false);

  const mainNavItems = [
    { label: 'Home', path: '/financial-dashboard', icon: 'Home' },
    { label: 'Budget', path: '/budget-planning', icon: 'Wallet' },
    { label: 'Invest', path: '/investment-portfolio', icon: 'TrendingUp' },
    { label: 'Budget', path: '/transaction-management', icon: 'PieChart' },
    { label: 'More', path: '/more-menu', icon: 'Menu' },
  ];

  const moreMenuPaths = useMemo(() => {
    const basePaths = ['/reports', '/money-tracker', '/savings', '/advisor', '/paper-trading', '/investment-quiz', '/profile', '/more-menu'];
    if (userRole === 'advisor') {
      basePaths.push('/advisor-dashboard');
    }
    return basePaths;
  }, [userRole]);

  const isActive = (path) => {
    if (path === '/more-menu') {
      return moreMenuPaths.includes(location.pathname);
    }
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleFab = () => {
    setIsFabOpen(!isFabOpen);
  };

  const handleFabAction = (action) => {
    setIsFabOpen(false);
    
    // Handle different actions
    switch(action) {
      case 'gallery':
        // Open gallery/photo picker
        console.log('Open gallery');
        break;
      case 'camera':
        // Open camera
        console.log('Open camera');
        break;
      case 'add':
        // Navigate to add transaction
        navigate('/transaction-management');
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isFabOpen && (
        <div 
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            background: '#4C1D95',
            opacity: 0.95
          }}
          onClick={() => setIsFabOpen(false)}
        />
      )}

      {/* Floating Action Buttons */}
      {isFabOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
          {/* Gallery Button - Left */}
          <button
            onClick={() => handleFabAction('gallery')}
            style={{
              animation: 'fabSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: '0.05s',
              opacity: 0
            }}
            className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            <Icon name="Image" size={28} className="text-purple-900" strokeWidth={2} />
          </button>

          {/* Plus Button - Center */}
          <button
            onClick={() => handleFabAction('add')}
            style={{
              animation: 'fabSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: '0s',
              opacity: 0
            }}
            className="w-16 h-16 bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            <Icon name="Plus" size={30} className="text-white" strokeWidth={3} />
          </button>

          {/* Camera Button - Right */}
          <button
            onClick={() => handleFabAction('camera')}
            style={{
              animation: 'fabSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              animationDelay: '0.1s',
              opacity: 0
            }}
            className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
          >
            <Icon name="Camera" size={28} className="text-purple-900" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-purple-400/20 safe-area-bottom shadow-lg" style={{ backgroundColor: '#9277DC' }}>
        <div className="flex items-center justify-around h-16 px-2">
          {/* Home */}
          <button
            onClick={() => handleNavigation('/financial-dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
              isActive('/financial-dashboard')
                ? 'text-white'
                : 'text-purple-200 active:text-white'
            }`}
          >
            <Icon name="Home" size={24} strokeWidth={isActive('/financial-dashboard') ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-0.5">
              Home
            </span>
          </button>

          {/* Activity */}
          <button
            onClick={() => handleNavigation('/transaction-management')}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
              isActive('/transaction-management')
                ? 'text-white'
                : 'text-purple-200 active:text-white'
            }`}
          >
            <Icon name="Clock" size={24} strokeWidth={isActive('/transaction-management') ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-0.5">
              Activity
            </span>
          </button>

          {/* Center Plus Button - Elevated */}
          <div className="flex flex-col items-center justify-center flex-1 -mt-8">
            <button
              onClick={toggleFab}
              className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
                isFabOpen 
                  ? 'bg-white rotate-45 scale-110' 
                  : 'hover:scale-105'
              }`}
              style={!isFabOpen ? { backgroundColor: '#9277DC' } : {}}
            >
              <Icon 
                name="Plus" 
                size={28} 
                className={isFabOpen ? 'text-purple-600' : 'text-white'} 
                strokeWidth={3} 
              />
            </button>
          </div>

          {/* Reports */}
          <button
            onClick={() => handleNavigation('/reports')}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
              isActive('/reports')
                ? 'text-white'
                : 'text-purple-200 active:text-white'
            }`}
          >
            <Icon name="BarChart3" size={24} strokeWidth={isActive('/reports') ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-0.5">
              Reports
            </span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleNavigation('/profile')}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
              isActive('/profile')
                ? 'text-white'
                : 'text-purple-200 active:text-white'
            }`}
          >
            <Icon name="User" size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-0.5">
              Profile
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
