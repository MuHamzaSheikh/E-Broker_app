import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Package,
  Truck,
  MapPin,
  MessageSquare,
  Search,
  BookOpen,
  History,
  Settings,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, language } = useApp();

  const isUrdu = language === 'ur';

  // Define clean tab items for each persona
  const getTabs = () => {
    if (currentRole === 'shipper') {
      return [
        { id: 'home', labelEn: 'Home', labelUr: 'ہوم', icon: Home },
        { id: 'loads', labelEn: 'My Loads', labelUr: 'میرے لوڈ', icon: Package },
        { id: 'shipments', labelEn: 'Tracking', labelUr: 'ٹریکنگ', icon: MapPin },
        { id: 'messages', labelEn: 'Chat', labelUr: 'چیٹ', icon: MessageSquare },
        { id: 'settings', labelEn: 'Settings', labelUr: 'ترتیبات', icon: Settings }
      ];
    }

    if (currentRole === 'owner') {
      return [
        { id: 'home', labelEn: 'Home', labelUr: 'ہوم', icon: Home },
        { id: 'marketplace', labelEn: 'Find Loads', labelUr: 'لوڈ تلاش', icon: Search },
        { id: 'trips', labelEn: 'My Trips', labelUr: 'چکر', icon: Truck },
        { id: 'fleet', labelEn: 'Fleet Khata', labelUr: 'کھاتہ', icon: BookOpen },
        { id: 'settings', labelEn: 'Settings', labelUr: 'ترتیبات', icon: Settings }
      ];
    }

    if (currentRole === 'driver') {
      return [
        { id: 'trip', labelEn: "Today's Trip", labelUr: 'آج کا سفر', icon: Truck },
        { id: 'history', labelEn: 'History', labelUr: 'ریکارڈ', icon: History },
        { id: 'messages', labelEn: 'Chat', labelUr: 'پیغامات', icon: MessageSquare },
        { id: 'settings', labelEn: 'Settings', labelUr: 'ترتیبات', icon: Settings }
      ];
    }

    // Admin
    return [
      { id: 'map', labelEn: 'Corridors', labelUr: 'روٹس', icon: MapPin },
      { id: 'kyc', labelEn: 'KYC Queue', labelUr: 'ویریفکیشن', icon: ShieldCheck },
      { id: 'audit_logs', labelEn: 'Audit Logs', labelUr: 'لاگز', icon: Activity },
      { id: 'settings', labelEn: 'Settings', labelUr: 'ترتیبات', icon: Settings }
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'trip' && (activeTab === 'home' || activeTab === 'current_trip')) ||
            (tab.id === 'settings' && activeTab === 'profile') ||
            (tab.id === 'marketplace' && activeTab === 'loads' && currentRole === 'owner');

          const label = isUrdu ? tab.labelUr : tab.labelEn;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer min-w-0 select-none active:scale-95 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/20'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] leading-tight truncate px-0.5 mt-0.5">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
