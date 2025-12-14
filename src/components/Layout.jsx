import React from 'react';
import Header from './ui/Header';
import MainNavigation from './ui/MainNavigation';
import MobileHeader from './ui/MobileHeader';
import MobileNavigation from './ui/MobileNavigation';
import { useSidebar } from '../context/SidebarContext';
import { isNativeApp } from '../utils/capacitor';

const Layout = ({ children }) => {
  const { isSidebarOpen } = useSidebar();
  const isMobileApp = isNativeApp();

  if (isMobileApp) {
    return (
      <div className="min-h-screen bg-slate-950">
        <MobileHeader />
        <main className="pt-14 pb-20">
          <div className="w-full">{children}</div>
        </main>
        <MobileNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainNavigation />
      <main
        className={`pt-24 pb-20 md:pb-8 transition-all duration-300 ${
          isSidebarOpen ? 'md:pl-64' : 'md:pl-20'
        }`}
      >
        <div className="w-full px-4 sm:px-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
