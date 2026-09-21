import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EBiltyModal } from '../components/EBiltyModal';
import { CameraCapture } from '../components/CameraCapture';
import { SettingsScreen } from '../components/SettingsScreen';
import { Button } from '../components/ui/Button';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { UrduVoiceSpeakerIcon } from '../components/icons/TransportIcons';
import {
  MapPin,
  CheckCircle2,
  Camera,
  FileText,
  Phone,
  KeyRound,
  History,
  MessageSquare,
  Truck,
  Settings,
  Send
} from 'lucide-react';

interface DriverPortalProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({
  activeTab: externalTab = 'trip',
  setActiveTab: setExternalTab
}) => {
  const {
    currentUser,
    trips,
    ebiltys,
    arriveAtPickup,
    submitPickupProof,
    startTransit,
    arriveAtDestination,
    submitDeliveryProof,
    language,
    playVoiceHelp
  } = useApp();

  const isUrdu = language === 'ur';

  const [currentTab, setCurrentTab] = useState(externalTab);

  useEffect(() => {
    if (externalTab) {
      setCurrentTab(externalTab);
    }
  }, [externalTab]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (setExternalTab) {
      setExternalTab(tab);
    }
  };

  const activeTrip = trips.find((t) => t.driverId === currentUser.id || true) || trips[0];
  const currentEbilty = activeTrip?.eBiltyNumber ? ebiltys[activeTrip.eBiltyNumber] : null;

  const [showEbiltyModal, setShowEbiltyModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraType, setCameraType] = useState<'pickup' | 'delivery'>('pickup');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Driver Chat Messages
  const [driverChat, setDriverChat] = useState([
    {
      id: '1',
      sender: 'owner',
      senderName: 'Ustad Tariq (Fleet Owner)',
      text: isUrdu ? 'استاد جی، ملتان بائی پاس سے راستہ صاف ہے۔ محفوظ ڈرائیونگ کریں۔' : 'Ustad Ji, highway bypass is clear. Drive safely.',
      time: '11:20 AM'
    },
    {
      id: '2',
      sender: 'me',
      senderName: 'Me',
      text: isUrdu ? 'جی استاد جی، شام 6 بجے تک فیصل آباد پہنچ جاؤں گا۔' : 'Yes boss, will reach Faisalabad by 6 PM.',
      time: '11:24 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleNextStepAction = () => {
    if (!activeTrip) return;

    if (activeTrip.status === 'assigned' || activeTrip.status === 'en_route_pickup') {
      arriveAtPickup(activeTrip.id);
      playVoiceHelp(
        isUrdu
          ? 'آپ گودام پہنچ گئے ہیں۔ مال لوڈ کرنے کے بعد تصویر لیں۔'
          : 'Arrived at pickup. Please take cargo photo after loading.'
      );
    } else if (activeTrip.status === 'arrived_pickup' || activeTrip.status === 'loaded') {
      setCameraType('pickup');
      setShowCameraModal(true);
    } else if (activeTrip.status === 'in_transit') {
      arriveAtDestination(activeTrip.id);
      setCameraType('delivery');
      setShowCameraModal(true);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    if (enteredOtp.trim() === '9281' || enteredOtp.length === 4) {
      submitDeliveryProof(activeTrip.id, {
        type: 'delivery',
        timestamp: new Date().toISOString(),
        coords: [31.41, 73.07],
        locationName: activeTrip.destinationCity,
        cargoPhotos: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
        receiverOtp: enteredOtp
      });
      setShowOtpModal(false);
      playVoiceHelp(
        isUrdu
          ? 'مبارک ہو! ڈلیوری مکمل ہو گئی ہے اور کرایہ محفوظ کر لیا گیا ہے۔'
          : 'Trip delivered successfully. Freight released to carrier.'
      );
    } else {
      setOtpError(true);
    }
  };

  return (
    <div className={`max-w-xl mx-auto space-y-5 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
      {/* Driver Header */}
      <div className="app-card bg-slate-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-blue-500"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded">
                DRIVER ON DUTY
              </span>
              <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {activeTrip.vehicleRegNumber}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">{currentUser.name}</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            playVoiceHelp(
              isUrdu
                ? `استاد جی، آپ کا سفر ${activeTrip.originCity} سے ${activeTrip.destinationCity} جاری ہے۔ اگلا مرحلہ مکمل کرنے کے لیے نیچے دیا گیا بڑا بٹن دبائیں۔`
                : `Driver guide: You are en route from ${activeTrip.originCity} to ${activeTrip.destinationCity}. Follow your current task.`
            )
          }
          className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 flex items-center justify-center cursor-pointer border border-slate-700 shadow-sm"
          title="Audio Guide"
        >
          <UrduVoiceSpeakerIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Secondary Tabs */}
      <div className="hidden md:flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {[
          { id: 'trip', labelEn: "Today's Trip", labelUr: 'آج کا سفر', icon: Truck },
          { id: 'history', labelEn: 'Trip History', labelUr: 'سابقہ ریکارڈ', icon: History },
          { id: 'messages', labelEn: 'Chat', labelUr: 'پیغامات', icon: MessageSquare },
          { id: 'settings', labelEn: 'Settings', labelUr: 'ترتیبات', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === 'trip' && currentTab === 'home') || (tab.id === 'settings' && currentTab === 'profile');
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{isUrdu ? tab.labelUr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          TAB 1: TODAY'S TRIP (Single Focus Task Console)
          ============================================================ */}
      {(currentTab === 'trip' || currentTab === 'home') && (
        <div className="app-card space-y-5 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
          {/* Route Landmark */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
            <span className="text-micro text-slate-500 dark:text-slate-400">
              {isUrdu ? 'آج کا روٹ / سفر' : "TODAY'S TRIP ROUTE"}
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <span>{activeTrip.originCity}</span>
              <span className="text-blue-600 dark:text-blue-400">&rarr;</span>
              <span>{activeTrip.destinationCity}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {activeTrip.eBiltyNumber} &bull; Freight: PKR {activeTrip.distanceKm * 150 || 185000}
            </div>
          </div>

          {/* 4-Step Visual Progress Indicator */}
          <ProgressTracker currentStatus={activeTrip.status} isUrdu={isUrdu} />

          {/* Big Obvious Action Button (Adapts to current state) */}
          <div className="pt-2">
            {(activeTrip.status === 'assigned' || activeTrip.status === 'en_route_pickup') && (
              <Button
                onClick={handleNextStepAction}
                variant="primary-lg"
                leftIcon={<MapPin className="w-6 h-6" />}
              >
                {isUrdu ? '1. گودام پہنچ گئے (Mark Arrived)' : '1. Arrived at Pickup Gate'}
              </Button>
            )}

            {(activeTrip.status === 'arrived_pickup' || activeTrip.status === 'loaded') && (
              <Button
                onClick={handleNextStepAction}
                variant="primary-lg"
                className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25"
                leftIcon={<Camera className="w-6 h-6" />}
              >
                {isUrdu ? '2. مال لوڈ ہو گیا - تصویر لیں' : '2. Take Loading Photo & Start Trip'}
              </Button>
            )}

            {activeTrip.status === 'in_transit' && (
              <Button
                onClick={() => {
                  setCameraType('delivery');
                  setShowCameraModal(true);
                }}
                variant="primary-lg"
                className="bg-emerald-600 hover:bg-emerald-700"
                leftIcon={<CheckCircle2 className="w-6 h-6" />}
              >
                {isUrdu ? '3. منزل پہنچ گئے - مال اتار دیا' : '3. Arrived at Destination & Offloaded'}
              </Button>
            )}

            {activeTrip.status === 'delivered' && (
              <Button
                onClick={() => setShowOtpModal(true)}
                variant="primary-lg"
                className="bg-purple-600 hover:bg-purple-700"
                leftIcon={<KeyRound className="w-6 h-6" />}
              >
                {isUrdu ? '4. ڈلیوری کوڈ / OTP درج کریں' : '4. Enter Receiver OTP Code'}
              </Button>
            )}

            {activeTrip.status === 'completed' && (
              <div className="p-4 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 rounded-2xl text-center font-bold text-base flex items-center justify-center gap-2 border border-emerald-300 dark:border-emerald-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>{isUrdu ? 'یہ سفر کامیابی سے مکمل ہو چکا ہے۔' : 'Trip Successfully Completed & Settled.'}</span>
              </div>
            )}
          </div>

          {/* Quick Documents & Contact Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {currentEbilty && (
              <Button
                onClick={() => setShowEbiltyModal(true)}
                variant="secondary"
                size="sm"
                leftIcon={<FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                className="text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 py-3"
              >
                {isUrdu ? 'سرکاری ای-بلٹی پرچی' : 'View Official E-Bilty'}
              </Button>
            )}

            <a
              href="tel:0800112233"
              className="btn-secondary text-xs py-3 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{isUrdu ? 'ہیلپ لائن کال' : 'Emergency Help'}</span>
            </a>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: TRIP HISTORY & PAST DELIVERIES
          ============================================================ */}
      {currentTab === 'history' && (
        <div className="space-y-4">
          <h3 className="heading-section text-slate-900 dark:text-white">
            {isUrdu ? 'سابقہ مکمل شدہ چکر اور ریکارڈ' : 'Completed Trips History'}
          </h3>

          <div className="app-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-micro text-slate-400 font-mono">TRIP-2024-819</span>
                <h4 className="heading-card text-slate-900 dark:text-white">Lahore &rarr; Karachi</h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                ✓ Completed
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Distance: <b>1,240 km</b> &bull; Cargo: <b>Cotton Bales</b></span>
              <span className="font-bold font-mono text-emerald-600">PKR 185,000</span>
            </div>
          </div>

          <div className="app-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-micro text-slate-400 font-mono">TRIP-2024-782</span>
                <h4 className="heading-card text-slate-900 dark:text-white">Karachi &rarr; Faisalabad</h4>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                ✓ Completed
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Distance: <b>1,110 km</b> &bull; Cargo: <b>Chemical Drums</b></span>
              <span className="font-bold font-mono text-emerald-600">PKR 170,000</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: DRIVER CHAT & COMMUNICATIONS
          ============================================================ */}
      {currentTab === 'messages' && (
        <div className="app-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="heading-section text-slate-900 dark:text-white">
                {isUrdu ? 'مالک اور تاجر کے پیغامات' : 'Owner & Shipper Chat'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct audio & text coordination</p>
            </div>

            <a href="tel:03004829101" className="btn-secondary text-xs flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Owner</span>
            </a>
          </div>

          <div className="h-64 overflow-y-auto bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-200 dark:border-slate-700">
            {driverChat.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                    m.sender === 'me'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-none'
                  }`}
                >
                  <p className="text-[10px] font-bold opacity-75 mb-0.5">{m.senderName}</p>
                  <p>{m.text}</p>
                  <span className={`text-[10px] block mt-1 ${m.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!chatInput.trim()) return;
              setDriverChat((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  sender: 'me',
                  senderName: 'Me',
                  text: chatInput.trim(),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
              setChatInput('');
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isUrdu ? 'پیغام لکھیں...' : 'Message owner / shipper...'}
              className="flex-1 h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
            <Button type="submit" variant="primary" size="md">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* ============================================================
          TAB 4: SETTINGS & PROFILE
          ============================================================ */}
      {(currentTab === 'settings' || currentTab === 'profile') && (
        <SettingsScreen onBack={() => handleTabChange('trip')} />
      )}

      {/* Camera Capture Modal */}
      {showCameraModal && (
        <CameraCapture
          label={cameraType === 'pickup' ? 'Take Loading Cargo Photo' : 'Take Offloading Cargo Photo'}
          onCapture={(photoUrl) => {
            if (cameraType === 'pickup') {
              submitPickupProof(activeTrip.id, {
                type: 'pickup',
                timestamp: new Date().toISOString(),
                coords: [24.86, 67.00],
                locationName: activeTrip.originCity,
                cargoPhotos: [photoUrl]
              });
              startTransit(activeTrip.id);
            } else {
              submitDeliveryProof(activeTrip.id, {
                type: 'delivery',
                timestamp: new Date().toISOString(),
                coords: [31.41, 73.07],
                locationName: activeTrip.destinationCity,
                cargoPhotos: [photoUrl]
              });
              setShowOtpModal(true);
            }
            setShowCameraModal(false);
          }}
        />
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="heading-section text-slate-900 dark:text-white">
                {isUrdu ? 'وصول کنندہ کا 4 ہندسوں والا OTP درج کریں' : 'Enter Receiver 4-Digit OTP'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مال اتارنے کے بعد گودام کے مینیجر سے 4 ہندسوں والا کوڈ حاصل کریں۔
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                maxLength={4}
                value={enteredOtp}
                onChange={(e) => {
                  setEnteredOtp(e.target.value);
                  setOtpError(false);
                }}
                placeholder="9281"
                className="w-full h-14 text-center font-mono font-black text-2xl tracking-widest rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 outline-none"
              />

              {otpError && (
                <div className="text-xs text-rose-600 font-bold text-center">
                  غلط کوڈ! برائے مہربانی صحیح OTP درج کریں۔
                </div>
              )}

              <Button
                type="submit"
                variant="primary-lg"
                className="bg-emerald-600 hover:bg-emerald-700"
                leftIcon={<CheckCircle2 className="w-5 h-5" />}
              >
                {isUrdu ? 'ڈلیوری مکمل کریں' : 'Confirm Delivery'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* E-Bilty Modal */}
      {showEbiltyModal && currentEbilty && (
        <EBiltyModal
          ebilty={currentEbilty}
          onClose={() => setShowEbiltyModal(false)}
        />
      )}
    </div>
  );
};
