import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Load, Vehicle } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { VehicleKhataModal } from '../components/VehicleKhataModal';
import { SimpleChatModal } from '../components/SimpleChatModal';
import { SettingsScreen } from '../components/SettingsScreen';
import { Button } from '../components/ui/Button';
import { LoadCard } from '../components/ui/LoadCard';
import { EmptyState } from '../components/ui/EmptyState';
import { exportSingleVehicleExcel, exportFleetSummaryExcel } from '../utils/excelExport';
import {
  Trailer22WheelerIcon,
  TenWheelerIcon,
  MazdaTruckIcon,
  ShehzorePickupIcon,
  VerifiedTransporterBadge
} from '../components/icons/TransportIcons';
import {
  Truck,
  Plus,
  Package,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  Search,
  X,
  Settings,
  Send
} from 'lucide-react';

interface OwnerPortalProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const OwnerPortal: React.FC<OwnerPortalProps> = ({
  activeTab: externalTab = 'home',
  setActiveTab: setExternalTab
}) => {
  const {
    currentUser,
    loads,
    bids,
    vehicles,
    drivers,
    payments,
    submitBid,
    addVehicle,
    assignFleetToAcceptedLoad,
    withdrawWalletFunds,
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

  const [selectedLoadId, setSelectedLoadId] = useState<string | null>(null);
  const [selectedVehicleForKhata, setSelectedVehicleForKhata] = useState<Vehicle | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient] = useState<{ name: string; phone: string; route?: string }>({
    name: 'Tariq Textile Mills',
    phone: '+92 300 4829101'
  });

  // Dispatch Modal State (Owner allocates Truck & Driver to accepted load)
  const [loadToDispatch, setLoadToDispatch] = useState<Load | null>(null);
  const [dispatchVehicleId, setDispatchVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [dispatchDriverId, setDispatchDriverId] = useState<string>(drivers[0]?.id || '');

  // Bidding Drawer State
  const [bidVehicleId, setBidVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [bidAmount, setBidAmount] = useState<number>(185000);
  const [estimatedPickupHours, setEstimatedPickupHours] = useState<number>(3);

  // Add Vehicle Modal
  const [showAddVehModal, setShowAddVehModal] = useState(false);
  const [newReg, setNewReg] = useState('LES-2024-8899');
  const [newVehType, setNewVehType] = useState<Vehicle['vehicleType']>('22-Wheeler Trailer');
  const [newCapacity, setNewCapacity] = useState(35);

  // Withdraw Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('50000');

  const ownerBids = bids.filter((b) => b.ownerId === currentUser.id || true);
  const marketplaceLoads = loads.filter((l) => l.status === 'bidding_open' || l.status === 'published');
  const pendingDispatchLoads = loads.filter(
    (l) => l.status === 'accepted_pending_assignment' && (l.assignedOwnerId === currentUser.id || true)
  );

  const selectedLoad = loads.find((l) => l.id === selectedLoadId);

  // Financial summary
  const totalSettled = payments
    .filter((p) => p.ownerId === currentUser.id && p.status === 'released_to_wallet')
    .reduce((acc, p) => acc + p.netPayoutAmount, 0) || 420000;

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoadId || !bidVehicleId) return;

    submitBid({
      loadId: selectedLoadId,
      vehicleId: bidVehicleId,
      bidAmount: Number(bidAmount),
      estimatedPickupHours: Number(estimatedPickupHours),
      notes: 'Vehicle ready for loading.'
    });

    playVoiceHelp(
      isUrdu
        ? `آپ کا ریٹ PKR ${Number(bidAmount).toLocaleString()} کامیابی سے بھیج دیا گیا ہے۔`
        : `Bid of PKR ${Number(bidAmount).toLocaleString()} submitted to shipper.`
    );

    setSelectedLoadId(null);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadToDispatch || !dispatchVehicleId || !dispatchDriverId) return;

    assignFleetToAcceptedLoad(loadToDispatch.id, dispatchVehicleId, dispatchDriverId);
    setLoadToDispatch(null);
    playVoiceHelp(
      isUrdu
        ? 'گاڑی اور ڈرائیور کامیابی سے الاٹ ہو چکے ہیں۔ ڈرائیور کو ای-بلٹی پرچی مل گئی ہے۔'
        : 'Truck and driver dispatched. Digital E-Bilty issued to driver.'
    );
  };

  return (
    <div className={`space-y-6 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
      {/* Desktop Secondary Tabs */}
      <div className="hidden md:flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {[
          { id: 'home', labelEn: 'Home', labelUr: 'ہوم', icon: Truck },
          { id: 'marketplace', labelEn: `Find Loads (${marketplaceLoads.length})`, labelUr: `لوڈ تلاش کریں (${marketplaceLoads.length})`, icon: Search },
          { id: 'trips', labelEn: `My Trips (${ownerBids.length})`, labelUr: `میرے چکر (${ownerBids.length})`, icon: Package },
          { id: 'fleet', labelEn: `Fleet & Khata (${vehicles.length})`, labelUr: `فلیٹ کھاتہ (${vehicles.length})`, icon: BookOpen },
          { id: 'settings', labelEn: 'Settings & Wallet', labelUr: 'ترتیبات', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === 'settings' && currentTab === 'profile');
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{isUrdu ? tab.labelUr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          TAB 1: TRANSPORTER HOME
          ============================================================ */}
      {currentTab === 'home' && (
        <div className="space-y-6">
          {/* Top Greeting & Action Card */}
          <div className="app-card bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-8 space-y-4 border-0 shadow-md">
            <div>
              <div className="text-micro text-blue-300 flex items-center gap-1.5">
                <VerifiedTransporterBadge className="w-4 h-4 text-emerald-400" />
                <span>{isUrdu ? 'تصدیق شدہ ٹرانسپورٹر نیٹ ورک' : 'Verified Transporter Network'}</span>
              </div>
              <h1 className="heading-page text-white mt-1">
                {isUrdu ? `السلام علیکم، ${currentUser.name}` : `Assalam-o-Alaikum, ${currentUser.name}`}
              </h1>
              <p className="text-body-sm text-slate-200 mt-1 max-w-xl">
                {isUrdu
                  ? 'پاکستان بھر کے اہم روٹس پر منافع بخش لوڈ تلاش کریں اور اپنی گاڑیاں باآسانی چلائیں۔'
                  : 'Find high-paying freight loads on major corridors and manage your fleet profitably.'}
              </p>
            </div>

            {/* Giant Obvious Action */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => handleTabChange('marketplace')}
                variant="primary"
                size="md"
                leftIcon={<Search className="w-5 h-5 stroke-[2.5]" />}
                className="bg-blue-500 hover:bg-blue-400 text-white text-base py-3.5 px-6 rounded-2xl shadow-lg font-bold"
              >
                {isUrdu ? 'لوڈ تلاش کریں (Find a Load)' : 'Find a Load'}
              </Button>

              <Button
                onClick={() => setShowAddVehModal(true)}
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700"
              >
                {isUrdu ? 'نئی گاڑی شامل کریں' : 'Add Truck'}
              </Button>
            </div>
          </div>

          {/* Pending Assignment Alert (If Shipper Accepted Bid) */}
          {pendingDispatchLoads.length > 0 && (
            <div className="app-card border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-200 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {isUrdu
                    ? 'مبارک ہو! تاجر نے آپ کا ریٹ قبول کر لیا ہے۔ برائے مہربانی گاڑی اور ڈرائیور الاٹ کریں۔'
                    : 'Congratulations! Your quote was accepted. Please assign a truck and driver.'}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {pendingDispatchLoads[0].originCity} &rarr; {pendingDispatchLoads[0].destinationCity}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Cargo: {pendingDispatchLoads[0].cargoCategory} &bull; Freight: <b>PKR {pendingDispatchLoads[0].offeredPrice.toLocaleString()}</b>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setLoadToDispatch(pendingDispatchLoads[0]);
                    setDispatchVehicleId(vehicles[0]?.id || '');
                    setDispatchDriverId(drivers[0]?.id || '');
                  }}
                  variant="success"
                  size="sm"
                  leftIcon={<Truck className="w-4 h-4" />}
                >
                  {isUrdu ? 'گاڑی و ڈرائیور الاٹ کریں' : 'Assign Fleet & Dispatch'}
                </Button>
              </div>
            </div>
          )}

          {/* Quick Summary Cards (3 items) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="app-card">
              <span className="text-micro text-slate-500 dark:text-slate-400">{isUrdu ? 'دستیاب فلیٹ' : 'Ready Fleet'}</span>
              <div className="metric-large text-emerald-600 dark:text-emerald-400 mt-1">
                {vehicles.filter((v) => v.availability === 'available').length}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">/ {vehicles.length} Total</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Ready for loading</div>
            </div>

            <div className="app-card">
              <span className="text-micro text-slate-500 dark:text-slate-400">{isUrdu ? 'اوپن لوڈز' : 'Open Loads'}</span>
              <div className="metric-large text-blue-600 dark:text-blue-400 mt-1">
                {marketplaceLoads.length}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Available nationwide</div>
            </div>

            <div className="app-card col-span-2 sm:col-span-1">
              <span className="text-micro text-slate-500 dark:text-slate-400">{isUrdu ? 'والٹ بیلنس' : 'Wallet Balance'}</span>
              <div className="metric-large text-slate-900 dark:text-white mt-1">
                PKR {totalSettled.toLocaleString()}
              </div>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="text-[11px] text-blue-600 dark:text-blue-400 font-bold underline mt-0.5 cursor-pointer"
              >
                Withdraw Funds &rarr;
              </button>
            </div>
          </div>

          {/* Recommended / Nearby Loads */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="heading-section text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>{isUrdu ? 'تازہ ترین دستیاب لوڈز' : 'Recommended Open Loads'}</span>
              </h2>
              <button
                onClick={() => handleTabChange('marketplace')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {isUrdu ? 'تمام دیکھیں' : 'View All'} &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceLoads.slice(0, 3).map((load) => (
                <LoadCard
                  key={load.id}
                  load={load}
                  actionTextEn="Place Bid"
                  actionTextUr="ریٹ دیں"
                  isUrdu={isUrdu}
                  onAction={() => {
                    setSelectedLoadId(load.id);
                    setBidAmount(load.offeredPrice);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: FIND LOADS (MARKETPLACE)
          ============================================================ */}
      {currentTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="heading-section text-slate-900 dark:text-white">
              {isUrdu ? 'دستیاب مال برداری اور لوڈز' : 'Nationwide Open Loads Board'}
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing <b>{marketplaceLoads.length}</b> verified loads
            </div>
          </div>

          {marketplaceLoads.length === 0 ? (
            <EmptyState
              titleEn="No Open Loads Available"
              titleUr="اس وقت کوئی لوڈ دستیاب نہیں"
              descriptionEn="Check back shortly as new freight loads are posted by traders continually."
              descriptionUr="تھوڑی دیر بعد دوبارہ چیک کریں۔ تاجر نئے لوڈز شامل کر رہے ہیں۔"
              isUrdu={isUrdu}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplaceLoads.map((load) => (
                <LoadCard
                  key={load.id}
                  load={load}
                  actionTextEn="Place Bid"
                  actionTextUr="ریٹ پیش کریں"
                  isUrdu={isUrdu}
                  onAction={() => {
                    setSelectedLoadId(load.id);
                    setBidAmount(load.offeredPrice);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 3: MY TRIPS & QUOTES
          ============================================================ */}
      {currentTab === 'trips' && (
        <div className="space-y-4">
          <h2 className="heading-section text-slate-900 dark:text-white">
            {isUrdu ? 'میرے پیش کردہ ریٹ اور چکر' : 'My Bids & Trips'}
          </h2>

          {ownerBids.length === 0 ? (
            <EmptyState
              titleEn="No Active Bids or Trips"
              titleUr="کوئی چکر یا ریٹ موجود نہیں"
              descriptionEn="Browse nationwide open loads and submit your competitive quotes."
              descriptionUr="ملک بھر کے اوپن لوڈز دیکھیں اور اپنے ریٹ پیش کریں۔"
              actionTextEn="Find Loads"
              actionTextUr="لوڈ تلاش کریں"
              onAction={() => handleTabChange('marketplace')}
              isUrdu={isUrdu}
            />
          ) : (
            <div className="space-y-3">
              {ownerBids.map((b) => {
                const matchedLoad = loads.find((l) => l.id === b.loadId);
                return (
                  <div key={b.id} className="app-card space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-micro text-slate-400 font-mono">BID #{b.id.slice(-5)}</span>
                        <h4 className="heading-card text-slate-900 dark:text-white mt-0.5">
                          {matchedLoad?.originCity || 'Origin'} &rarr; {matchedLoad?.destinationCity || 'Destination'}
                        </h4>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        b.status === 'accepted'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {b.status === 'accepted' ? '✓ Accepted' : 'Pending Response'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <span>Vehicle: <b>{b.vehicleType}</b> &bull; ETA: <b>{b.estimatedPickupHours} hrs</b></span>
                      <span className="metric-small text-blue-600 dark:text-blue-400">PKR {b.bidAmount.toLocaleString()}</span>
                    </div>

                    {b.status === 'accepted' && (
                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">✓ Ready for dispatch</span>
                        <Button
                          onClick={() => {
                            if (matchedLoad) {
                              setLoadToDispatch(matchedLoad);
                              setDispatchVehicleId(vehicles[0]?.id || '');
                              setDispatchDriverId(drivers[0]?.id || '');
                            }
                          }}
                          variant="success"
                          size="sm"
                          leftIcon={<Truck className="w-3.5 h-3.5" />}
                        >
                          Assign Driver
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 4: FLEET & DIGITAL LEDGER KHATA
          ============================================================ */}
      {currentTab === 'fleet' && (
        <div className="space-y-5">
          {/* Header Toolbar */}
          <div className="app-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="heading-section text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{isUrdu ? 'گاڑیوں اور فلیٹ کا ڈیجیٹل کھاتہ' : 'Fleet Register & Vehicle Ledgers'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track diesel, mobil oil, workshops, permits, and driver assignments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  exportFleetSummaryExcel(vehicles, currentUser.name);
                  playVoiceHelp(isUrdu ? 'پورے فلیٹ کی ایکسل فائل ڈاؤن لوڈ ہو رہی ہے۔' : 'Exporting complete fleet Excel register.');
                }}
                variant="primary"
                size="sm"
                leftIcon={<FileSpreadsheet className="w-4 h-4" />}
              >
                {isUrdu ? 'ایکسل (.xlsx)' : 'Download Fleet Excel'}
              </Button>

              <Button
                onClick={() => setShowAddVehModal(true)}
                variant="secondary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                {isUrdu ? 'نئی گاڑی' : 'Add Vehicle'}
              </Button>
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => {
              const VehicleIcon =
                v.vehicleType === '22-Wheeler Trailer'
                  ? Trailer22WheelerIcon
                  : v.vehicleType === '10-Wheeler Rigid'
                  ? TenWheelerIcon
                  : v.vehicleType === 'Mazda / Light Truck'
                  ? MazdaTruckIcon
                  : ShehzorePickupIcon;

              return (
                <div key={v.id} className="app-card space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold">
                          <VehicleIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="heading-card text-slate-900 dark:text-white font-mono">{v.registrationNumber}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{v.vehicleType} &bull; {v.capacityTons}T</p>
                        </div>
                      </div>
                      <StatusBadge status={v.availability} size="sm" isUrdu={isUrdu} />
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1 mt-3 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Make:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{v.makeModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Permit:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">✓ {v.documents.routePermitExpiry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Driver:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{v.currentDriverName || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setSelectedVehicleForKhata(v)}
                      variant="primary"
                      size="sm"
                      leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                    >
                      {isUrdu ? 'کھاتہ کھولیں' : 'Open Khata'}
                    </Button>

                    <Button
                      onClick={() => exportSingleVehicleExcel(v)}
                      variant="secondary"
                      size="sm"
                      leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
                    >
                      Excel (.xlsx)
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 5: SETTINGS & WALLET
          ============================================================ */}
      {(currentTab === 'settings' || currentTab === 'profile') && (
        <SettingsScreen onBack={() => handleTabChange('home')} />
      )}

      {/* Bidding Drawer Modal */}
      {selectedLoadId && selectedLoad && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-micro text-blue-600 dark:text-blue-400">QUOTE RATE</span>
                <h3 className="heading-section text-slate-900 dark:text-white mt-0.5">
                  {selectedLoad.originCity} &rarr; {selectedLoad.destinationCity}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLoadId(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="heading-label text-slate-700 dark:text-slate-200">Select Vehicle from Fleet:</label>
                <select
                  value={bidVehicleId}
                  onChange={(e) => setBidVehicleId(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} - {v.vehicleType} ({v.capacityTons}T)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="heading-label text-slate-700 dark:text-slate-200">Your Freight Rate (PKR):</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  step={1000}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-lg font-mono text-blue-600 dark:text-blue-400 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="heading-label text-slate-700 dark:text-slate-200">Estimated Pickup Arrival (Hours):</label>
                <input
                  type="number"
                  value={estimatedPickupHours}
                  onChange={(e) => setEstimatedPickupHours(Number(e.target.value))}
                  min={1}
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary-lg"
                leftIcon={<Send className="w-5 h-5" />}
              >
                {isUrdu ? 'ریٹ جمع کروائیں' : 'Submit Rate Quote'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {loadToDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-micro text-emerald-600 dark:text-emerald-400">DISPATCH VEHICLE & DRIVER</span>
                <h3 className="heading-section text-slate-900 dark:text-white mt-0.5">
                  {loadToDispatch.originCity} &rarr; {loadToDispatch.destinationCity}
                </h3>
              </div>
              <button
                onClick={() => setLoadToDispatch(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-4">
              <div className="space-y-1">
                <label className="heading-label text-slate-700 dark:text-slate-200">Assign Truck:</label>
                <select
                  value={dispatchVehicleId}
                  onChange={(e) => setDispatchVehicleId(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} &bull; {v.vehicleType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="heading-label text-slate-700 dark:text-slate-200">Assign Driver:</label>
                <select
                  value={dispatchDriverId}
                  onChange={(e) => setDispatchDriverId(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm"
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.phone})
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="primary-lg"
                className="bg-emerald-600 hover:bg-emerald-700"
                leftIcon={<Truck className="w-5 h-5" />}
              >
                {isUrdu ? 'گاڑی و ڈرائیور روانہ کریں' : 'Confirm Dispatch & Issue E-Bilty'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="heading-section text-slate-900 dark:text-white">Add Vehicle to Fleet</h3>
              <button onClick={() => setShowAddVehModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addVehicle({
                registrationNumber: newReg,
                vehicleType: newVehType,
                capacityTons: Number(newCapacity),
                makeModel: 'Hino 500 Heavy',
                year: 2024
              });
              setShowAddVehModal(false);
            }} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Vehicle Registration Number:</label>
                <input
                  type="text"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Capacity (Tons):</label>
                <input
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Vehicle Type:</label>
                <select
                  value={newVehType}
                  onChange={(e) => setNewVehType(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="22-Wheeler Trailer">22-Wheeler Trailer (40T)</option>
                  <option value="10-Wheeler Rigid">10-Wheeler Rigid (18T)</option>
                  <option value="Mazda / Light Truck">Mazda / Light Truck (7.5T)</option>
                  <option value="Shehzore Pickup">Shehzore Pickup (3.5T)</option>
                </select>
              </div>
              <Button type="submit" variant="primary-lg">Save Vehicle</Button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="heading-section text-slate-900 dark:text-white">Withdraw Wallet Funds</h3>
              <button onClick={() => setShowWithdrawModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Amount (PKR):</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono text-lg"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Funds will be transferred to your linked HBL bank account.</p>
              <Button
                type="button"
                onClick={() => {
                  withdrawWalletFunds(currentUser.id, Number(withdrawAmount));
                  setShowWithdrawModal(false);
                  playVoiceHelp('رقم آپ کے بینک اکاؤنٹ میں منتقل کر دی گئی ہے۔');
                }}
                variant="primary-lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Confirm Payout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Digital Khata Modal */}
      {selectedVehicleForKhata && (
        <VehicleKhataModal
          vehicle={selectedVehicleForKhata}
          onClose={() => setSelectedVehicleForKhata(null)}
        />
      )}

      {/* Simple WhatsApp Chat Modal */}
      {showChatModal && (
        <SimpleChatModal
          recipientName={chatRecipient.name}
          recipientPhone={chatRecipient.phone}
          loadRoute={chatRecipient.route}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};
