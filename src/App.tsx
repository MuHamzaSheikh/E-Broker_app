import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { ShipperPortal } from './pages/ShipperPortal';
import { OwnerPortal } from './pages/OwnerPortal';
import { DriverPortal } from './pages/DriverPortal';
import { AdminPortal } from './pages/AdminPortal';
import type { UserRole } from './types';

const MainLayout: React.FC = () => {
  const { currentRole, language } = useApp();

  const getDefaultTabForRole = (role: UserRole) => {
    if (role === 'driver') return 'trip';
    if (role === 'admin') return 'map';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTabForRole(currentRole));

  // Keep activeTab synchronized when switching roles
  useEffect(() => {
    setActiveTab(getDefaultTabForRole(currentRole));
  }, [currentRole]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-150 overflow-x-hidden w-full max-w-full">
      {/* Top Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Role-Locked Portal View (With Mobile Safe Area Bottom Padding) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8 overflow-x-hidden">
        {currentRole === 'shipper' && (
          <ShipperPortal activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {currentRole === 'owner' && (
          <OwnerPortal activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {currentRole === 'driver' && (
          <DriverPortal activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {currentRole === 'admin' && (
          <AdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Mobile Native Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modern Desktop Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-5 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {language === 'ur' ? 'ای-بروکر پاکستان لاجسٹکس نیٹ ورک' : 'E-Broker Freight Network'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">&bull;</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {language === 'ur' ? 'سرکاری ڈیجیٹل بلٹی اور محفوظ ایسکرو' : 'Verified E-Bilty & Escrow'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Regulated by National Road Transport Authority of Pakistan.
          </div>
        </div>
      </footer>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <MainLayout /> : <AuthScreen />;
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
