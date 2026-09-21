import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { VehicleType, CargoCategory, Load } from '../types';
import { PAKISTAN_CITIES, calculateRoadDistance } from '../data/pakistanLocations';
import {
  ShehzorePickupIcon,
  MazdaTruckIcon,
  TenWheelerIcon,
  Trailer22WheelerIcon,
  ContainerBoxIcon,
  ReeferColdIcon
} from './icons/TransportIcons';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Minus,
  Plus
} from 'lucide-react';

interface PostLoadWizardProps {
  onClose: () => void;
  onSuccess: (load: Load) => void;
}

export const PostLoadWizard: React.FC<PostLoadWizardProps> = ({ onClose, onSuccess }) => {
  const { createLoad, language, playVoiceHelp } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [originCity, setOriginCity] = useState('Karachi');
  const [originAddress, setOriginAddress] = useState(PAKISTAN_CITIES['Karachi']?.popularAddresses[0] || 'Karachi Port Terminal');
  const [destinationCity, setDestinationCity] = useState('Faisalabad');
  const [destinationAddress, setDestinationAddress] = useState(PAKISTAN_CITIES['Faisalabad']?.popularAddresses[0] || 'Faisalabad Textile Hub');

  const [cargoCategory, setCargoCategory] = useState<CargoCategory>('Textile & Garments');
  const [cargoDescription] = useState('Export cotton yarn bales (کاٹن گانٹھیں)');
  const [weightTons, setWeightTons] = useState(30);

  const [requiredVehicleType, setRequiredVehicleType] = useState<VehicleType>('22-Wheeler Trailer');
  const [offeredPrice, setOfferedPrice] = useState<number>(185000);

  const routeCalc = calculateRoadDistance(
    PAKISTAN_CITIES[originCity]?.coords || [24.86, 67.00],
    PAKISTAN_CITIES[destinationCity]?.coords || [31.41, 73.07]
  );

  const cargoOptions: Array<{ id: CargoCategory; titleEn: string; titleUr: string; icon: string }> = [
    { id: 'Textile & Garments', titleEn: 'Textile & Cotton', titleUr: 'ٹیکسٹائل و کاٹن', icon: '🧵' },
    { id: 'Agricultural & Grain', titleEn: 'Wheat & Rice / Grain', titleUr: 'گندم، چاول و اجناس', icon: '🌾' },
    { id: 'Industrial Machinery & Steel', titleEn: 'Machinery & Steel', titleUr: 'مشینری و لوہا سریا', icon: '⚙️' },
    { id: 'Fresh Produce / Fruits (Cold Chain)', titleEn: 'Fruits & Vegetables', titleUr: 'تازہ پھل و سبزیاں', icon: '🍎' },
    { id: 'FMCG / Packaged Goods', titleEn: 'FMCG / General Goods', titleUr: 'جنرل سامان و کریانہ', icon: '📦' },
    { id: 'Chemicals & Fertilizer', titleEn: 'Fertilizer & Chemicals', titleUr: 'کھاد و کیمیکلز', icon: '🧪' }
  ];

  const vehicleOptions: Array<{ type: VehicleType; nameEn: string; nameUr: string; capacity: string; Icon: React.FC<{ className?: string }> }> = [
    { type: 'Shehzore Pickup', nameEn: 'Shehzore Pickup', nameUr: 'شہزور پک اپ', capacity: '3.5 Tons', Icon: ShehzorePickupIcon },
    { type: 'Mazda / Light Truck', nameEn: 'Mazda Truck', nameUr: 'مزدا ٹرک', capacity: '7.5 Tons', Icon: MazdaTruckIcon },
    { type: '10-Wheeler Rigid', nameEn: '10-Wheeler Truck', nameUr: '10-ویلر ٹرک', capacity: '18 Tons', Icon: TenWheelerIcon },
    { type: '22-Wheeler Trailer', nameEn: '22-Wheeler Trailer', nameUr: '22-ویلر ٹرالر', capacity: '40 Tons', Icon: Trailer22WheelerIcon },
    { type: 'Container 40ft', nameEn: '40ft Container', nameUr: '40 فٹ کنٹینر', capacity: '30 Tons', Icon: ContainerBoxIcon },
    { type: 'Reefer (Cold Chain)', nameEn: 'Cold Reefer', nameUr: 'کولڈ ریفر', capacity: '25 Tons', Icon: ReeferColdIcon }
  ];

  const handleFinish = () => {
    const newLoad = createLoad({
      originCity,
      originAddress,
      destinationCity,
      destinationAddress,
      cargoCategory,
      cargoDescription,
      weightTons: Number(weightTons),
      requiredVehicleType,
      packagingType: 'Bags / Sacks',
      quantityUnits: 150,
      offeredPrice: Number(offeredPrice),
      requiresReefer: requiredVehicleType === 'Reefer (Cold Chain)',
      requiresTarpaulin: true,
      isFragile: false,
      autoAssignSingleBid: false,
      specialInstructions: 'Ready for loading.'
    });

    playVoiceHelp(
      language === 'ur'
        ? 'آپ کا لوڈ کامیابی سے پوسٹ ہو گیا ہے۔ قریبی ٹرانسپورٹرز آپ کو ریٹ پیش کر رہے ہیں۔'
        : 'Load posted successfully. Transporters will now send you direct quotes.'
    );

    onSuccess(newLoad);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="text-micro text-blue-600">
              {language === 'ur' ? `مرحلہ ${step} از 5` : `Step ${step} of 5`}
            </div>
            <h2 className="heading-section text-slate-900 mt-0.5">
              {step === 1 && (language === 'ur' ? 'مال کہاں سے کہاں بھیجنا ہے؟' : 'Where are you sending the goods?')}
              {step === 2 && (language === 'ur' ? 'مال کی تفصیل اور وزن' : 'What are you sending?')}
              {step === 3 && (language === 'ur' ? 'کس قسم کی گاڑی درکار ہے؟' : 'What vehicle do you need?')}
              {step === 4 && (language === 'ur' ? 'گاڑی کا بھاڑا / کرایہ مقرر کریں' : 'Set your freight fare')}
              {step === 5 && (language === 'ur' ? 'تفصیلات کی تصدیق کریں' : 'Review & Confirm')}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Locations */}
        {step === 1 && (
          <div className="py-5 space-y-4">
            {/* Pickup City */}
            <div className="space-y-1.5">
              <label className="heading-label text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>{language === 'ur' ? 'مال اٹھانے کا شہر (Pickup City)' : 'Pickup City'}</span>
              </label>
              <select
                value={originCity}
                onChange={(e) => {
                  const c = e.target.value;
                  setOriginCity(c);
                  setOriginAddress(PAKISTAN_CITIES[c]?.popularAddresses[0] || `${c} Terminal`);
                }}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-600 text-sm sm:text-base outline-none"
              >
                {Object.keys(PAKISTAN_CITIES).map((city) => (
                  <option key={city} value={city}>
                    {city} ({PAKISTAN_CITIES[city]?.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Drop-off City */}
            <div className="space-y-1.5">
              <label className="heading-label text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>{language === 'ur' ? 'مال اتارنے کا شہر (Drop-off City)' : 'Drop-off City'}</span>
              </label>
              <select
                value={destinationCity}
                onChange={(e) => {
                  const c = e.target.value;
                  setDestinationCity(c);
                  setDestinationAddress(PAKISTAN_CITIES[c]?.popularAddresses[0] || `${c} Industrial Area`);
                }}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:border-blue-600 text-sm sm:text-base outline-none"
              >
                {Object.keys(PAKISTAN_CITIES).map((city) => (
                  <option key={city} value={city}>
                    {city} ({PAKISTAN_CITIES[city]?.province})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center justify-between font-semibold">
              <span>{language === 'ur' ? 'روڈ کا کل فاصلہ:' : 'Total Highway Distance:'}</span>
              <span className="font-bold font-mono text-sm">{routeCalc.distanceKm} KM (~{routeCalc.hours} Hours)</span>
            </div>
          </div>
        )}

        {/* Step 2: Cargo & Weight */}
        {step === 2 && (
          <div className="py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="heading-label text-slate-700">
                {language === 'ur' ? 'سامان کی قسم منتخب کریں:' : 'Select Cargo Type:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {cargoOptions.map((c) => {
                  const isSelected = cargoCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCargoCategory(c.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[80px] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold ring-2 ring-blue-600/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{c.icon}</span>
                      <span className="text-xs font-semibold leading-tight">
                        {language === 'ur' ? c.titleUr : c.titleEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weight in Tons */}
            <div className="space-y-1.5 pt-2">
              <label className="heading-label text-slate-700 flex items-center justify-between">
                <span>{language === 'ur' ? 'کل وزن (ٹن میں):' : 'Total Weight (in Tons):'}</span>
                <span className="text-blue-600 font-bold font-mono text-base">{weightTons} Tons</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeightTons(Math.max(1, weightTons - 5))}
                  className="stepper-btn"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={weightTons}
                  onChange={(e) => setWeightTons(Math.max(1, Number(e.target.value)))}
                  className="flex-1 h-12 text-center font-bold text-lg font-mono rounded-xl border border-slate-300 bg-slate-50"
                />
                <button
                  type="button"
                  onClick={() => setWeightTons(weightTons + 5)}
                  className="stepper-btn"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Type Selection */}
        {step === 3 && (
          <div className="py-5 space-y-3">
            <label className="heading-label text-slate-700">
              {language === 'ur' ? 'مطلوبہ ٹرک یا گاڑی منتخب کریں:' : 'Select Required Vehicle:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {vehicleOptions.map((v) => {
                const isSelected = requiredVehicleType === v.type;
                const IconComponent = v.Icon;
                return (
                  <button
                    key={v.type}
                    type="button"
                    onClick={() => setRequiredVehicleType(v.type)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[95px] ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-950 font-bold ring-2 ring-blue-600/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className="w-8 h-8" />
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {language === 'ur' ? v.nameUr : v.nameEn}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {v.capacity}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Fare / Price */}
        {step === 4 && (
          <div className="py-5 space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <div className="text-micro text-slate-500">
                {language === 'ur' ? 'آپ کا مجوزہ بھاڑا / کرایہ (PKR)' : 'Offered Freight Rate (PKR)'}
              </div>
              <div className="metric-large text-blue-600">
                PKR {offeredPrice.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                Suggested Rate: <span className="font-bold text-slate-700 font-mono">PKR {Math.round(offeredPrice * 0.95).toLocaleString()} - {Math.round(offeredPrice * 1.08).toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Price Buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setOfferedPrice(Math.max(5000, offeredPrice - 5000))}
                className="stepper-btn"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setOfferedPrice(offeredPrice + 5000)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs font-mono border border-slate-200"
              >
                +5,000
              </button>
              <button
                type="button"
                onClick={() => setOfferedPrice(offeredPrice + 10000)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs font-mono border border-slate-200"
              >
                +10,000
              </button>
              <button
                type="button"
                onClick={() => setOfferedPrice(offeredPrice + 20000)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs font-mono border border-slate-200"
              >
                +20,000
              </button>
              <button
                type="button"
                onClick={() => setOfferedPrice(offeredPrice + 5000)}
                className="stepper-btn"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                {language === 'ur' ? 'یا اپنی مرضی کی رقم درج کریں:' : 'Or type exact price in PKR:'}
              </label>
              <input
                type="number"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(Number(e.target.value))}
                step={1000}
                className="w-full h-12 px-4 rounded-xl border border-slate-300 font-bold text-base font-mono bg-white"
              />
            </div>
          </div>
        )}

        {/* Step 5: Review & Confirm */}
        {step === 5 && (
          <div className="py-5 space-y-4">
            <div className="app-card space-y-3 bg-slate-50 border-slate-200 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">{language === 'ur' ? 'روٹ:' : 'Route:'}</span>
                <span className="font-bold text-slate-900">{originCity} &rarr; {destinationCity}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">{language === 'ur' ? 'سامان و وزن:' : 'Cargo & Weight:'}</span>
                <span className="font-bold text-slate-900">{cargoCategory} &bull; {weightTons} Tons</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">{language === 'ur' ? 'گاڑی کی قسم:' : 'Vehicle:'}</span>
                <span className="font-bold text-slate-900">{requiredVehicleType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{language === 'ur' ? 'مجوزہ بھاڑا:' : 'Offered Fare:'}</span>
                <span className="font-bold text-blue-600 font-mono text-base">PKR {offeredPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 text-center">
              {language === 'ur'
                ? 'پوسٹ کرنے کے بعد قریبی ٹرانسپورٹرز آپ کو اپنے ریٹ بھیجیں گے۔'
                : 'After posting, verified transporters will send you direct rate quotes.'}
            </div>
          </div>
        )}

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="btn-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ur' ? 'پیچھے' : 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="btn-primary"
            >
              <span>{language === 'ur' ? 'اگلا مرحلہ' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-md"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{language === 'ur' ? 'لوڈ پوسٹ کریں' : 'Post Load Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
