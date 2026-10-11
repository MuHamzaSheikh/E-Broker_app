import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EBiltyModal } from '../components/EBiltyModal';
import { CameraCapture } from '../components/CameraCapture';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { UrduVoiceSpeakerIcon } from '../components/icons/TransportIcons';
import {
  MapPin,
  CheckCircle2,
  Camera,
  FileText,
  Phone,
  KeyRound,
  MessageSquare,
  Square
} from 'lucide-react';

interface DriverPortalProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = () => {
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
    playVoiceHelp,
    stopVoice,
    isVoiceMuted,
    toggleVoiceMute
  } = useApp();

  const isUrdu = language === 'ur';

  const activeTrip = trips.find((t) => t.driverId === currentUser.id || true) || trips[0];
  const currentEbilty = activeTrip?.eBiltyNumber ? ebiltys[activeTrip.eBiltyNumber] : null;

  const [showEbiltyModal, setShowEbiltyModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraType, setCameraType] = useState<'pickup' | 'delivery'>('pickup');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Driver Chat Messages
  const [driverChat] = useState([
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

  // Helper to speak any line or text
  const speakLine = (textUrdu: string, textEnglish: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playVoiceHelp(isUrdu ? textUrdu : textEnglish);
  };

  const getStepVoiceInstruction = () => {
    if (!activeTrip) return { ur: 'کوئی چکر فعال نہیں ہے۔', en: 'No active trip assigned.' };
    switch (activeTrip.status) {
      case 'assigned':
      case 'en_route_pickup':
        return {
          ur: `پہلا مرحلہ: آپ گودام کی طرف روانہ ہیں۔ مال اٹھانے کا شہر ${activeTrip.originCity} ہے۔ گودام پہنچ کر نیچے دیا گیا نیلا بٹن دبائیں۔`,
          en: `Step 1: Heading to pickup location at ${activeTrip.originCity}. Press the big blue button when you reach the warehouse gate.`
        };
      case 'arrived_pickup':
      case 'loaded':
        return {
          ur: `دوسرا مرحلہ: آپ گودام پہنچ چکے ہیں۔ گاڑی میں مال لوڈ ہونے کے بعد کیمرے کا بٹن دبا کر تصویر لیں۔`,
          en: `Step 2: You have arrived at pickup. Take a photo of the loaded cargo to start your highway journey.`
        };
      case 'in_transit':
        return {
          ur: `تیسرا مرحلہ: آپ راستے میں ہیں۔ منزل ${activeTrip.destinationCity} ہے۔ جب مال اتار دیں تو نیچے دیا گیا ہرا بٹن دبائیں۔`,
          en: `Step 3: En route to ${activeTrip.destinationCity}. When you arrive and finish offloading, press the green button.`
        };
      case 'delivered':
        return {
          ur: `چوتھا مرحلہ: مال اتر گیا ہے۔ ڈلیوری مکمل کرنے کے لیے گودام مینیجر سے چار ہندسوں کا کوڈ لے کر درج کریں۔`,
          en: `Step 4: Goods delivered. Enter the 4-digit OTP code given by the receiver manager to finish the trip.`
        };
      case 'completed':
        return {
          ur: `مبارک ہو! آپ کا سفر مکمل ہو چکا ہے اور کرایہ محفوظ کر لیا گیا ہے۔`,
          en: `Congratulations! This trip is successfully completed and payment has been recorded.`
        };
      default:
        return {
          ur: `اپنے سفر کی تفصیلات سننے کے لیے آواز کا بٹن دبائیں۔`,
          en: `Tap any speaker icon to hear details.`
        };
    }
  };

  const currentStepVoice = getStepVoiceInstruction();

  return (
    <div className={`max-w-xl mx-auto space-y-4 px-2 sm:px-0 pb-12 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
      {/* ============================================================
          TOP DRIVER IDENTITY CARD (High Contrast, Big Avatar, Voice)
          ============================================================ */}
      {/* Clean Driver Identity & Audio Guide */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                {isUrdu ? 'آن ڈیوٹی' : 'ON DUTY'}
              </span>
              <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200">
                {activeTrip.vehicleRegNumber}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {currentUser.name}
            </h2>
          </div>
        </div>

        {/* Clear Voice Action Button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (isVoiceMuted) toggleVoiceMute();
              speakLine(
                `خوش آمدید ${currentUser.name}! گاڑی نمبر ${activeTrip.vehicleRegNumber}۔ ${currentStepVoice.ur}`,
                `Welcome ${currentUser.name}! Vehicle ${activeTrip.vehicleRegNumber}. ${currentStepVoice.en}`
              );
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
          >
            <UrduVoiceSpeakerIcon className="w-4 h-4" />
            <span>{isUrdu ? 'آواز سنیں' : 'Voice Guide'}</span>
          </button>

          <button
            type="button"
            onClick={stopVoice}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            title={isUrdu ? 'آواز روکیں' : 'Stop Voice'}
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        </div>
      </div>

      {/* ============================================================
          MAIN CENTRAL ACTION CARD (Zero Confusion, Step by Step)
          ============================================================ */}
      <div className="app-card border-2 border-blue-300 dark:border-blue-700 shadow-xl space-y-4 p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl">
        {/* ROUTE HEADER (Origin -> Destination with speaker) */}
        <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-blue-800 dark:text-blue-300 tracking-wider">
              {isUrdu ? 'آج کا روٹ / چکر' : "TODAY'S ROUTE"}
            </span>
            <button
              type="button"
              onClick={(e) =>
                speakLine(
                  `آج کا سفر: مال اٹھانے کا شہر ${activeTrip.originCity} ہے اور اتارنے کا شہر ${activeTrip.destinationCity} ہے۔ فاصلہ تقریبا ${activeTrip.distanceKm} کلومیٹر ہے۔`,
                  `Route: From ${activeTrip.originCity} to ${activeTrip.destinationCity}. Distance is ${activeTrip.distanceKm} kilometers.`,
                  e
                )
              }
              className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 hover:bg-blue-200 cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Listen route"
            >
              <UrduVoiceSpeakerIcon className="w-4 h-4" />
              <span>{isUrdu ? 'سنیں' : 'Listen'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Origin City */}
            <div className="flex-1 text-center bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs">
              <span className="text-[10px] block font-bold text-slate-500 dark:text-slate-400">
                {isUrdu ? 'مال اٹھانے کی جگہ' : 'PICKUP CITY'}
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {activeTrip.originCity}
              </span>
            </div>

            <div className="text-blue-600 dark:text-blue-400 text-xl font-black">&rarr;</div>

            {/* Destination City */}
            <div className="flex-1 text-center bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 shadow-xs">
              <span className="text-[10px] block font-bold text-slate-500 dark:text-slate-400">
                {isUrdu ? 'مال اتارنے کی جگہ' : 'DESTINATION'}
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {activeTrip.destinationCity}
              </span>
            </div>
          </div>

          {/* Fare & Bilty Details */}
          <div className="flex items-center justify-between text-xs pt-1 px-1 text-slate-600 dark:text-slate-300">
            <span className="font-mono font-bold">
              {activeTrip.eBiltyNumber}
            </span>
            <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              PKR {(activeTrip.distanceKm * 150 || 185000).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4-Step Visual Progress Tracker */}
        <ProgressTracker currentStatus={activeTrip.status} isUrdu={isUrdu} />

        {/* Clear Instructions Banner with Voice Button */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1">
            <span className="text-xl">📢</span>
            <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 leading-snug">
              {isUrdu ? currentStepVoice.ur : currentStepVoice.en}
            </p>
          </div>
          <button
            type="button"
            onClick={() => speakLine(currentStepVoice.ur, currentStepVoice.en)}
            className="p-2 rounded-xl bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100 shrink-0 hover:bg-amber-300 cursor-pointer shadow-xs"
            title="Listen step instructions"
          >
            <UrduVoiceSpeakerIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================
            THE BIGGEST ACTION BUTTON (Single Primary Step Target)
            ============================================================ */}
        <div className="pt-2">
          {(activeTrip.status === 'assigned' || activeTrip.status === 'en_route_pickup') && (
            <button
              type="button"
              onClick={handleNextStepAction}
              className="w-full py-5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-black text-lg sm:text-xl shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-blue-500"
            >
              <MapPin className="w-8 h-8 stroke-[2.5]" />
              <span>{isUrdu ? '1. گودام پہنچ گئے (بٹن دبائیں)' : '1. Arrived at Warehouse Gate'}</span>
            </button>
          )}

          {(activeTrip.status === 'arrived_pickup' || activeTrip.status === 'loaded') && (
            <button
              type="button"
              onClick={handleNextStepAction}
              className="w-full py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-lg sm:text-xl shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-emerald-500"
            >
              <Camera className="w-8 h-8 stroke-[2.5]" />
              <span>{isUrdu ? '2. مال لوڈ ہو گیا - تصویر لیں' : '2. Take Cargo Photo & Start'}</span>
            </button>
          )}

          {activeTrip.status === 'in_transit' && (
            <button
              type="button"
              onClick={() => {
                setCameraType('delivery');
                setShowCameraModal(true);
              }}
              className="w-full py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-lg sm:text-xl shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-emerald-500"
            >
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              <span>{isUrdu ? '3. منزل پر مال اتار دیا (تصویر لیں)' : '3. Arrived & Offloaded (Photo)'}</span>
            </button>
          )}

          {activeTrip.status === 'delivered' && (
            <button
              type="button"
              onClick={() => setShowOtpModal(true)}
              className="w-full py-5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-black text-lg sm:text-xl shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer border-2 border-purple-500"
            >
              <KeyRound className="w-8 h-8 stroke-[2.5]" />
              <span>{isUrdu ? '4. چار ہندسوں والا OTP کوڈ درج کریں' : '4. Enter Receiver OTP Code'}</span>
            </button>
          )}

          {activeTrip.status === 'completed' && (
            <div className="p-5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 rounded-2xl text-center font-black text-lg flex items-center justify-center gap-3 border-2 border-emerald-400 dark:border-emerald-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 dark:text-emerald-400" />
              <span>{isUrdu ? 'سفر کامیابی سے مکمل ہو چکا ہے!' : 'Trip Successfully Completed & Settled!'}</span>
            </div>
          )}
        </div>

        {/* 2 ESSENTIAL SUPPORT BUTTONS: E-Bilty & Helpline */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {currentEbilty && (
            <button
              type="button"
              onClick={() => {
                speakLine(
                  'سرکاری ای بلٹی دستاویز کھل رہی ہے۔ اس میں بلٹی نمبر، وزن اور مال کی تفصیل موجود ہے۔',
                  'Opening Official E-Bilty document with cargo particulars and tracking number.'
                );
                setShowEbiltyModal(true);
              }}
              className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{isUrdu ? 'ای-بلٹی پرچی دیکھیں' : 'View E-Bilty'}</span>
            </button>
          )}

          <a
            href="tel:0800112233"
            onClick={() =>
              speakLine('ہیلپ لائن پر کال کی جا رہی ہے۔', 'Calling 24/7 driver emergency support.')
            }
            className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{isUrdu ? 'مدد / ہیلپ لائن کال' : 'Emergency Help'}</span>
          </a>
        </div>
      </div>

      {/* QUICK SECONDARY ACCORDION (Chat with Fleet Owner) */}
      <div className="app-card border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {isUrdu ? 'مالک / ٹرانسپورٹر رابطہ' : 'Fleet Owner Audio & Messages'}
            </h4>
          </div>
          <a
            href="tel:03004829101"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'مالک کو کال کریں' : 'Call Owner'}</span>
          </a>
        </div>

        {/* Latest message snippet */}
        <div className="space-y-2">
          {driverChat.slice(-2).map((m) => (
            <div
              key={m.id}
              className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
                m.sender === 'me'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex-1">
                <span className="font-extrabold text-[10px] block opacity-75">{m.senderName}:</span>
                <p className="font-medium">{m.text}</p>
              </div>
              <button
                type="button"
                onClick={() => speakLine(m.text, m.text)}
                className="p-1 rounded text-slate-400 hover:text-blue-600 cursor-pointer"
                title="Listen message"
              >
                <UrduVoiceSpeakerIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

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
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <h3 className="heading-section text-slate-900 dark:text-white">
                {isUrdu ? 'گودام کے مینیجر سے 4 ہندسوں والا OTP حاصل کریں' : 'Enter Receiver 4-Digit OTP Code'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isUrdu
                  ? 'مال کامیابی سے اتارنے کے بعد مینیجر کا پن کوڈ درج کریں۔'
                  : 'Ask the receiving warehouse manager for their 4-digit verification PIN.'}
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
                className="w-full h-16 text-center font-mono font-black text-3xl tracking-widest rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 outline-none"
              />

              {otpError && (
                <div className="text-xs text-rose-600 font-bold">
                  {isUrdu ? 'غلط کوڈ! برائے مہربانی صحیح OTP درج کریں۔' : 'Invalid code! Please enter the correct OTP.'}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isUrdu ? 'ڈلیوری کی تصدیق کریں' : 'Confirm Delivery'}</span>
              </button>
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
