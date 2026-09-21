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
import { Sparkles, Package, Truck, Smartphone, ShieldCheck, Star } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, switchDemoAccount, language } = useApp();

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

  const tourSteps: Array<{ role: UserRole; titleEn: string; titleUr: string; icon: React.FC<{ className?: string }> }> = [
    {
      role: 'shipper',
      titleEn: '1. Post Load',
      titleUr: '1. مال لگائیں (تاجر)',
      icon: Package
    },
    {
      role: 'owner',
      titleEn: '2. Quote Rate',
      titleUr: '2. ریٹ دیں (ٹرانسپورٹر)',
      icon: Truck
    },
    {
      role: 'shipper',
      titleEn: '3. Accept & Escrow',
      titleUr: '3. ٹرک بک کریں',
      icon: ShieldCheck
    },
    {
      role: 'driver',
      titleEn: '4. Driver E-Bilty',
      titleUr: '4. ڈرائیور و بلٹی',
      icon: Smartphone
    },
    {
      role: 'shipper',
      titleEn: '5. Settle & Rate',
      titleUr: '5. ادائیگی و ریٹنگ',
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-150">
      {/* Top Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Interactive Process Guide Banner */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold">
            <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'ur' ? 'پروسیس کے مراحل:' : 'End-to-End Persona Workflow:'}
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 no-scrollbar">
            {tourSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = currentRole === step.role;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    switchDemoAccount(step.role);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Switch to this persona"
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{language === 'ur' ? step.titleUr : step.titleEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Role-Locked Portal View (With Mobile Safe Area Bottom Padding) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 md:pb-8">
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
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {language === 'ur' ? 'ای-بروکر پاکستان لاجسٹکس نیٹ ورک' : 'E-Broker Freight Network'}
            </span>
            <span>&bull;</span>
            <span className="text-blue-700 dark:text-blue-400 font-semibold">
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
