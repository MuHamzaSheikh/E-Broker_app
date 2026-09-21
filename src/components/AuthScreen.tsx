import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import {
  Trailer22WheelerIcon,
  UrduVoiceSpeakerIcon
} from './icons/TransportIcons';
import {
  Truck,
  Package,
  Smartphone,
  Shield,
  Languages,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup, switchDemoAccount, language, toggleLanguage, playVoiceHelp } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('shipper');

  // Form Fields
  const [loginPhone, setLoginPhone] = useState('+92 300 4829101');
  const [authError, setAuthError] = useState<string | null>(null);

  // Signup Fields
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('+92 300 1234567');
  const [signupCnic, setSignupCnic] = useState('35201-1234567-1');
  const [signupCompany, setSignupCompany] = useState('');

  const personas: Array<{
    role: UserRole;
    titleEn: string;
    titleUr: string;
    descEn: string;
    descUr: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      role: 'shipper',
      titleEn: 'Cargo Shipper (Trader)',
      titleUr: 'مالکِ مال (تاجر)',
      descEn: 'Post cargo & hire verified trucks',
      descUr: 'اپنے مال کے لیے ٹرک بک کریں',
      icon: Package
    },
    {
      role: 'owner',
      titleEn: 'Transporter & Fleet Owner',
      titleUr: 'ٹرانسپورٹر و فلیٹ اونر',
      descEn: 'Find loads & manage trucks',
      descUr: 'لوڈ حاصل کریں اور کھاتہ بنائیں',
      icon: Truck
    },
    {
      role: 'driver',
      titleEn: 'Truck Driver',
      titleUr: 'ڈرائیور کنسول',
      descEn: 'Easy guided trip console',
      descUr: 'آسان آن روڈ ڈلیوری اسکرین',
      icon: Smartphone
    },
    {
      role: 'admin',
      titleEn: 'Admin Desk',
      titleUr: 'ایڈمن کنٹرول',
      descEn: 'Operations & oversight',
      descUr: 'ویریفکیشن و آپریشنز',
      icon: Shield
    }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const success = login(loginPhone, selectedRole);
    if (!success) {
      setAuthError(language === 'ur' ? 'غلط نمبر۔ برائے مہربانی دوبارہ کوشش کریں۔' : 'Invalid login credentials. Please try again.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupPhone.trim()) {
      setAuthError('Please fill all required fields.');
      return;
    }
    signup({
      name: signupName,
      phone: signupPhone,
      role: selectedRole,
      cnic: signupCnic || '35201-1234567-1',
      companyName: signupCompany || 'Trade Logistics'
    });
  };

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white ${language === 'ur' ? 'font-urdu' : 'font-sans'}`}>
      {/* Top Simple Header */}
      <header className="bg-slate-900 text-white px-4 py-3.5 border-b border-slate-800 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
              <Trailer22WheelerIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white">
                {language === 'ur' ? 'ای-بروکر پاکستان' : 'E-BROKER PAKISTAN'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            <button
              onClick={() =>
                playVoiceHelp(
                  language === 'ur'
                    ? 'ای-بروکر میں خوش آمدید۔ نیچے دیے گئے کسی بھی اکاؤنٹ پر کلک کر کے لاگ ان کریں۔'
                    : 'Welcome to E-Broker. Tap any persona below to quickly test the application.'
                )
              }
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 cursor-pointer"
              title="Voice Guide"
            >
              <UrduVoiceSpeakerIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Quick 1-Tap Demo Switcher (7 Cols) */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-micro text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                1-TAP DEMO ACCESS &bull; بغیر پاس ورڈ کے چیک کریں
              </span>
              <h1 className="heading-page text-slate-900 mt-2">
                {language === 'ur' ? 'آپ کس کردار کے طور پر استعمال کرنا چاہتے ہیں؟' : 'How would you like to use E-Broker?'}
              </h1>
              <p className="text-body-sm text-slate-600 mt-1">
                {language === 'ur'
                  ? 'کسی بھی اکاؤنٹ کا انتخاب کریں اور فوری استعمال شروع کریں۔'
                  : 'Select any role below to experience the guided workflow.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {personas.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => switchDemoAccount(p.role)}
                    className="app-card text-left hover:border-blue-600 hover:shadow-md cursor-pointer transition-all p-4 space-y-2 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="heading-card text-slate-900 group-hover:text-blue-700">
                        {language === 'ur' ? p.titleUr : p.titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'ur' ? p.descUr : p.descEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                      <span>{language === 'ur' ? 'داخل ہوں' : 'Start'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 3 Value Pillars */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'ur' ? 'سرکاری ای-بلٹی اور کانٹا پرچی کا خودکار نظام' : 'Official Digital E-Bilty & Kanta Verification'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'ur' ? 'محفوظ ایسکرو ادائیگی (JazzCash, Easypaisa, Bank)' : 'Secure Escrow Payment Gateway Protection'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'ur' ? 'کم پڑھے لکھے ڈرائیورز کے لیے آسان وائس گائیڈ' : 'Low-Literacy Voice Navigation for Drivers'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Standard Login / Registration Form (5 Cols) */}
          <div className="md:col-span-5">
            <div className="app-card space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h2 className="heading-section text-slate-900">
                  {mode === 'login'
                    ? (language === 'ur' ? 'لاگ ان کریں' : 'Sign In')
                    : (language === 'ur' ? 'نیا اکاؤنٹ بنائیں' : 'Create Account')}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setAuthError(null);
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {mode === 'login' ? 'Create Account' : 'Sign In'}
                </button>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number:</label>
                    <input
                      type="text"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-sm font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Login Role:</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold"
                    >
                      <option value="shipper">Cargo Shipper (تاجر)</option>
                      <option value="owner">Transporter / Fleet (ٹرانسپورٹر)</option>
                      <option value="driver">Truck Driver (ڈرائیور)</option>
                      <option value="admin">Admin Operations (ایڈمن)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-lg bg-blue-600 hover:bg-blue-700 mt-2"
                  >
                    <span>{language === 'ur' ? 'لاگ ان کریں' : 'Sign In'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Full Name:</label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number:</label>
                    <input
                      type="text"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">CNIC:</label>
                    <input
                      type="text"
                      value={signupCnic}
                      onChange={(e) => setSignupCnic(e.target.value)}
                      placeholder="35201-1234567-1"
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-sm font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Company / Agency:</label>
                    <input
                      type="text"
                      value={signupCompany}
                      onChange={(e) => setSignupCompany(e.target.value)}
                      placeholder="e.g. Al-Rehman Goods Agency"
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Role:</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold"
                    >
                      <option value="shipper">Cargo Shipper (تاجر)</option>
                      <option value="owner">Transporter / Fleet (ٹرانسپورٹر)</option>
                      <option value="driver">Truck Driver (ڈرائیور)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-lg bg-blue-600 hover:bg-blue-700 mt-2"
                  >
                    <span>{language === 'ur' ? 'رجسٹر کریں' : 'Register'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        E-Broker Pakistan &bull; National Freight & Logistics Network
      </footer>
    </div>
  );
};
