import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { VerifiedTransporterBadge, UrduVoiceSpeakerIcon } from './icons/TransportIcons';
import {
  Sun,
  Moon,
  Languages,
  Bell,
  Phone,
  CheckCircle2,
  LogOut,
  HelpCircle
} from 'lucide-react';

interface SettingsScreenProps {
  onBack?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const {
    currentUser,
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    playVoiceHelp,
    logout
  } = useApp();

  const isUrdu = language === 'ur';

  // Toggle states
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceAutoPlay, setVoiceAutoPlay] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    playVoiceHelp(isUrdu ? 'ترتیبات کامیابی سے محفوظ ہو گئی ہیں۔' : 'Settings saved successfully.');
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className={`max-w-2xl mx-auto space-y-5 pb-10 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
      {/* Top Header Card */}
      <div className="app-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="heading-page text-slate-900 dark:text-white">
            {isUrdu ? 'پروفائل و ترتیبات' : 'Settings & Profile'}
          </h2>
          {onBack && (
            <Button onClick={onBack} variant="secondary" size="sm">
              {isUrdu ? 'واپس' : 'Back'}
            </Button>
          )}
        </div>

        {/* User Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-600 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="heading-section text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </h3>
              <VerifiedTransporterBadge className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {currentUser.phone}
            </p>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                {currentUser.role.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                ✓ Verified CNIC {currentUser.cnic}
              </span>
            </div>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isUrdu ? 'ترتیبات کامیابی سے تبدیل ہو چکی ہیں۔' : 'Preferences updated successfully!'}</span>
        </div>
      )}

      {/* 1. Appearance & Theme Settings */}
      <div className="app-card space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="heading-card text-slate-900 dark:text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isUrdu ? 'ایپ تھیم (Light / Dark)' : 'App Theme & Appearance'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isUrdu ? 'دن اور رات کے لیے اپنی پسندیدہ تھیم منتخب کریں۔' : 'Choose your preferred visual theme for bright daylight or night driving.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/30'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            <div>
              <div className="text-xs font-bold">{isUrdu ? 'لائٹ موڈ ☀️' : 'Light Mode ☀️'}</div>
              <div className="text-[10px] text-slate-400">Daytime clarity</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
              theme === 'dark'
                ? 'border-blue-500 bg-slate-800 text-white font-bold ring-2 ring-blue-400/40'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Moon className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-xs font-bold">{isUrdu ? 'ڈارک موڈ 🌙' : 'Dark Mode 🌙'}</div>
              <div className="text-[10px] text-slate-400">Night highway driving</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Language Selection */}
      <div className="app-card space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="heading-card text-slate-900 dark:text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isUrdu ? 'زبان کا انتخاب (Language)' : 'Application Language'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isUrdu ? 'ایپ کی زبان اردو یا انگریزی میں تبدیل کریں۔' : 'Switch between English and authentic Pakistani Transport Urdu.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              if (language !== 'ur') toggleLanguage();
            }}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              language === 'ur'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold ring-2 ring-blue-500/30'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span className="text-lg">🇵🇰</span>
            <div className="text-sm font-bold font-urdu">اردو (Urdu)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (language !== 'en') toggleLanguage();
            }}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              language === 'en'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold ring-2 ring-blue-500/30'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span className="text-lg">🇬🇧</span>
            <div className="text-sm font-bold font-sans">English</div>
          </button>
        </div>
      </div>

      {/* 3. Audio Voice Guidance */}
      <div className="app-card space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UrduVoiceSpeakerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="heading-card text-slate-900 dark:text-white">
                {isUrdu ? 'آوازی صوتی رہنمائی (Voice Guidance)' : 'Audio Voice Assistant'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isUrdu ? 'ہر اسکرین پر اہم ہدایات خودکار طور پر بول کر بتائیں۔' : 'Audio guidance for drivers & transporters.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVoiceAutoPlay(!voiceAutoPlay)}
            className={`w-12 h-7 rounded-full transition-colors cursor-pointer p-0.5 ${
              voiceAutoPlay ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                voiceAutoPlay ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {isUrdu ? 'ٹیسٹ آواز سنیں:' : 'Test Audio Guide:'}
          </span>
          <Button
            onClick={() => playVoiceHelp(isUrdu ? 'السلام علیکم! ای-بروکر پاکستان میں آپ کا والٹ اور کھاتہ محفوظ ہے۔' : 'Welcome to E-Broker Pakistan. All systems operational.')}
            variant="secondary"
            size="sm"
            leftIcon={<UrduVoiceSpeakerIcon className="w-3.5 h-3.5 text-blue-600" />}
          >
            {isUrdu ? 'آواز چیک کریں' : 'Play Sample Voice'}
          </Button>
        </div>
      </div>

      {/* 4. Notifications & Alerts */}
      <div className="app-card space-y-3">
        <h3 className="heading-card text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{isUrdu ? 'اطلاعات و الرٹس (Notifications)' : 'Notifications & Alerts'}</span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">WhatsApp Dispatch Alerts</span>
              <p className="text-[11px] text-slate-400">Receive E-Bilty and trip milestones on WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={() => setWhatsappAlerts(!whatsappAlerts)}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 ${
                whatsappAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  whatsappAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">SMS Verification Codes & OTP</span>
              <p className="text-[11px] text-slate-400">Direct delivery OTP on mobile SIM</p>
            </div>
            <button
              type="button"
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 ${
                smsAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  smsAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Help, Helpline & Logout */}
      <div className="app-card space-y-3">
        <h3 className="heading-card text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{isUrdu ? 'مدد اور ہیلپ لائن' : 'Help & Toll-Free Support'}</span>
        </h3>

        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">National Transport Helpline</span>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">0800-EBROKER (0800-112233)</p>
          </div>
          <a
            href="tel:0800112233"
            className="btn-primary text-xs py-2 px-3 bg-emerald-600 hover:bg-emerald-700"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Toll-Free</span>
          </a>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={handleSave}
            variant="primary"
            size="sm"
          >
            {isUrdu ? 'ترتیبات محفوظ کریں' : 'Save Changes'}
          </Button>

          <Button
            onClick={logout}
            variant="danger"
            size="sm"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            {isUrdu ? 'لاگ آؤٹ کریں' : 'Log Out'}
          </Button>
        </div>
      </div>
    </div>
  );
};
