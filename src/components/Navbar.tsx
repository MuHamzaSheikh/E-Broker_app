import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import {
  Trailer22WheelerIcon,
  UrduVoiceSpeakerIcon,
  VerifiedTransporterBadge
} from './icons/TransportIcons';
import {
  Languages,
  LogOut,
  ChevronDown,
  Shield,
  Truck,
  Package,
  Smartphone,
  Sun,
  Moon,
  Settings,
  Volume2,
  VolumeX,
  Square
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    currentRole,
    logout,
    language,
    toggleLanguage,
    playVoiceHelp,
    stopVoice,
    isVoiceMuted,
    toggleVoiceMute,
    theme,
    toggleTheme
  } = useApp();

  const isUrdu = language === 'ur';
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleConfigs: Array<{ role: UserRole; titleEn: string; titleUr: string; icon: React.FC<{ className?: string }> }> = [
    {
      role: 'shipper',
      titleEn: 'Shipper Desk',
      titleUr: 'مالکِ مال (تاجر)',
      icon: Package
    },
    {
      role: 'owner',
      titleEn: 'Carrier & Fleet',
      titleUr: 'ٹرانسپورٹر و فلیٹ',
      icon: Truck
    },
    {
      role: 'driver',
      titleEn: 'Driver Console',
      titleUr: 'ڈرائیور کنسول',
      icon: Smartphone
    },
    {
      role: 'admin',
      titleEn: 'Admin Operations',
      titleUr: 'ایڈمن کنٹرول',
      icon: Shield
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Landmark */}
          <div
            onClick={() => setActiveTab && setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Trailer22WheelerIcon className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white font-sans">
                  E-BROKER
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-400/30 px-2 py-0.5 rounded-full">
                  PAKISTAN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                {isUrdu
                  ? 'قومی ڈیجیٹل مال برداری نیٹ ورک'
                  : 'National Digital Freight Network'}
              </p>
            </div>
          </div>

          {/* Center: Role Badge Indicator (Confidentiality & Role-Lock Enforced) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {(() => {
              const activeConfig = roleConfigs.find((r) => r.role === currentRole) || roleConfigs[0];
              const Icon = activeConfig.icon;
              return (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {isUrdu ? activeConfig.titleUr : activeConfig.titleEn}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md">
                    {isUrdu ? 'محفوظ سیشن' : 'Isolated Session'}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* Right Toolbar: Theme Toggle, Language, Audio Guide, Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Urdu / English Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Audio Controls: Mute/Unmute & Play/Stop */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              {/* Play Guide Button */}
              <button
                type="button"
                onClick={() => {
                  if (isVoiceMuted) {
                    toggleVoiceMute();
                  }
                  playVoiceHelp(
                    isUrdu
                      ? 'ای-بروکر پاکستان میں خوش آمدید۔ آپ جس اسکرین پر ہیں وہاں کے اہم بٹن اور کام واضح نظر آ رہے ہیں۔'
                      : 'Welcome to E-Broker Pakistan. Follow the primary action on your screen to proceed.'
                  );
                }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isVoiceMuted
                    ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    : 'text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-700'
                }`}
                title={isUrdu ? 'صوتی رہنمائی چلائیں' : 'Play Voice Guide'}
              >
                <UrduVoiceSpeakerIcon className="w-4 h-4" />
              </button>

              {/* Stop Voice button */}
              <button
                type="button"
                onClick={stopVoice}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={isUrdu ? 'آواز روکیں (Stop Voice)' : 'Stop Active Speech'}
              >
                <Square className="w-3 h-3 fill-current" />
              </button>

              {/* Mute / Unmute Button */}
              <button
                type="button"
                onClick={toggleVoiceMute}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isVoiceMuted
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
                }`}
                title={isVoiceMuted ? 'Unmute Audio / آواز بحال کریں' : 'Mute Audio / آواز بند کریں'}
              >
                {isVoiceMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* User Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-white max-w-[100px] truncate hidden sm:block">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                      <VerifiedTransporterBadge className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{currentUser.phone}</p>
                    <span className="inline-block text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded mt-1">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (setActiveTab) setActiveTab('settings');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span>{isUrdu ? 'ترتیبات و پروفائل' : 'Settings & Profile'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        toggleTheme();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
                      <span>{theme === 'dark' ? 'Switch to Light ☀️' : 'Switch to Dark 🌙'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>{isUrdu ? 'لاگ آؤٹ' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
