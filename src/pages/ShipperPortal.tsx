import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Load, Bid } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PakistanTripMap } from '../components/PakistanTripMap';
import { EBiltyModal } from '../components/EBiltyModal';
import { ProofGalleryModal } from '../components/ProofGalleryModal';
import { DisputeModal } from '../components/DisputeModal';
import { RatingModal } from '../components/RatingModal';
import { PaymentGatewayModal } from '../components/PaymentGatewayModal';
import { PostLoadWizard } from '../components/PostLoadWizard';
import { SimpleChatModal } from '../components/SimpleChatModal';
import { SettingsScreen } from '../components/SettingsScreen';
import { Button } from '../components/ui/Button';
import { LoadCard } from '../components/ui/LoadCard';
import { BidCard } from '../components/ui/BidCard';
import { EmptyState } from '../components/ui/EmptyState';
import { ProgressTracker } from '../components/ui/ProgressTracker';
import { PAKISTAN_CITIES } from '../data/pakistanLocations';
import {
  Plus,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Camera,
  Package,
  MapPin,
  MessageSquare,
  Settings,
  Send,
  Phone
} from 'lucide-react';

interface ShipperPortalProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const ShipperPortal: React.FC<ShipperPortalProps> = ({
  activeTab: externalTab = 'home',
  setActiveTab: setExternalTab
}) => {
  const {
    currentUser,
    loads,
    bids,
    trips,
    ebiltys,
    acceptBid,
    confirmDeliveryAndSettle,
    raiseDispute,
    submitRating,
    language,
    t
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

  const [showPostLoadWizard, setShowPostLoadWizard] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(loads[0] || null);
  const [showEbiltyModal, setShowEbiltyModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{ name: string; phone: string; route?: string }>({
    name: 'Niazi Goods Agency',
    phone: '+92 321 9840291'
  });

  // Direct In-Tab Messaging State
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'me' | 'other'; text: string; time: string }>>([
    {
      id: '1',
      sender: 'other',
      text: isUrdu ? 'السلام علیکم! گاڑی تیار ہے۔ مال کب لوڈ کروانا ہے؟' : 'Assalam-o-Alaikum! Vehicle is ready. What time should I arrive?',
      time: '10:15 AM'
    },
    {
      id: '2',
      sender: 'me',
      text: isUrdu ? 'وعلیکم السلام! دوپہر 2 بجے گودام پر پہنچ جائیں۔' : 'Walaikum Assalam! Please arrive at the warehouse gate by 2:00 PM.',
      time: '10:18 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Payment Gateway Modal State
  const [bidToPay, setBidToPay] = useState<Bid | null>(null);
  const [loadToPay, setLoadToPay] = useState<Load | null>(null);

  // Filter loads
  const shipperLoads = loads.filter((l) => l.shipperId === currentUser.id || true);
  const activeBiddingLoads = shipperLoads.filter((l) => l.status === 'bidding_open' || l.status === 'published');
  const inTransitLoads = shipperLoads.filter(
    (l) => l.status === 'in_transit' || l.status === 'en_route_pickup' || l.status === 'arrived_pickup' || l.status === 'loaded'
  );

  const activeTrip = trips.find((t) => t.loadId === selectedLoad?.id || t.id === selectedLoad?.activeTripId) || trips[0];
  const currentEbilty = activeTrip?.eBiltyNumber ? ebiltys[activeTrip.eBiltyNumber] : null;
  const loadBids = bids.filter((b) => b.loadId === selectedLoad?.id);

  return (
    <div className={`space-y-6 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
      {/* Desktop Navigation Pills */}
      <div className="hidden md:flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {[
          { id: 'home', labelEn: 'Home', labelUr: 'ہوم', icon: Package },
          { id: 'loads', labelEn: `My Loads (${shipperLoads.length})`, labelUr: `میرے لوڈ (${shipperLoads.length})`, icon: Package },
          { id: 'shipments', labelEn: 'Live Tracking', labelUr: 'روٹ ٹریکنگ', icon: MapPin },
          { id: 'messages', labelEn: 'Messages', labelUr: 'پیغامات', icon: MessageSquare },
          { id: 'settings', labelEn: 'Settings & Profile', labelUr: 'ترتیبات', icon: Settings }
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
          TAB 1: SHIPPER HOME (Task-Oriented & Clear)
          ============================================================ */}
      {currentTab === 'home' && (
        <div className="space-y-6">
          {/* Main Landmark Card */}
          <div className="app-card bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 sm:p-8 space-y-4 border-0 shadow-md">
            <div>
              <div className="text-micro text-blue-200 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-300" />
                <span>{isUrdu ? 'مالکِ مال / تاجر ڈیسک' : 'Shipper Freight Desk'}</span>
              </div>
              <h1 className="heading-page text-white mt-1">
                {isUrdu ? 'کہاں مال بھیجنا ہے؟' : 'Where do you want to send your goods?'}
              </h1>
              <p className="text-body-sm text-blue-100 mt-1 max-w-xl">
                {isUrdu
                  ? 'اپنا لوڈ پوسٹ کریں اور پاکستان بھر کے تصدیق شدہ ٹرانسپورٹرز سے براہ راست ریٹ حاصل کریں۔'
                  : 'Post your cargo in simple steps and receive direct competitive rates from verified carriers.'}
              </p>
            </div>

            {/* Giant Obvious Primary CTA */}
            <div>
              <Button
                onClick={() => setShowPostLoadWizard(true)}
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-5 h-5 stroke-[2.5]" />}
                className="bg-blue-500 hover:bg-blue-400 text-white text-base py-3.5 px-6 rounded-2xl shadow-lg font-bold"
              >
                {isUrdu ? 'نیا لوڈ پوسٹ کریں (Post a Load)' : 'Post a New Load'}
              </Button>
            </div>
          </div>

          {/* Active Trip / In-Transit Shipment Highlight */}
          {inTransitLoads.length > 0 && activeTrip && (
            <div className="app-card border-2 border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
                  <h3 className="heading-card text-blue-950 dark:text-blue-200">
                    {isUrdu ? 'چلتا ہوا سفر (Active Shipment)' : 'Active Shipment on the Way'}
                  </h3>
                </div>
                <StatusBadge status={activeTrip.status} size="sm" isUrdu={isUrdu} />
              </div>

              {/* Progress Bar */}
              <ProgressTracker currentStatus={activeTrip.status} isUrdu={isUrdu} />

              <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{activeTrip.originCity}</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span>{activeTrip.destinationCity}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Vehicle: <b>{activeTrip.vehicleRegNumber}</b> &bull; Driver: <b>{activeTrip.driverName}</b>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleTabChange('shipments')}
                    variant="primary"
                    size="sm"
                    leftIcon={<MapPin className="w-3.5 h-3.5" />}
                  >
                    {isUrdu ? 'ٹریکنگ دیکھیں' : 'Track Live'}
                  </Button>

                  <Button
                    onClick={() => {
                      setChatRecipient({
                        name: activeTrip.driverName || 'Driver',
                        phone: activeTrip.driverPhone || '+92 300 0000000',
                        route: `${activeTrip.originCity} → ${activeTrip.destinationCity}`
                      });
                      setShowChatModal(true);
                    }}
                    variant="secondary"
                    size="sm"
                    leftIcon={<MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  >
                    {isUrdu ? 'ڈرائیور سے رابطہ' : 'Chat'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pending Bids to Review */}
          {activeBiddingLoads.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="heading-section text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  <span>{isUrdu ? 'ٹرانسپورٹرز کے ریٹ (Bids Received)' : 'Transporters Interested in Your Loads'}</span>
                </h2>
                <button
                  onClick={() => handleTabChange('loads')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {isUrdu ? 'تمام لوڈز دیکھیں' : 'View All Loads'} &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBiddingLoads.map((load) => {
                  const currentBids = bids.filter((b) => b.loadId === load.id);
                  return (
                    <LoadCard
                      key={load.id}
                      load={load}
                      bidsCount={currentBids.length}
                      actionTextEn="Review Quotes"
                      actionTextUr="ریٹ دیکھیں"
                      isUrdu={isUrdu}
                      onAction={() => {
                        setSelectedLoad(load);
                        handleTabChange('loads');
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 2: MY LOADS & BID COMPARISON
          ============================================================ */}
      {currentTab === 'loads' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Loads List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="heading-section text-slate-900 dark:text-white">
                {isUrdu ? 'میرے لوڈز کی فہرست' : 'My Posted Loads'}
              </h2>
              <Button
                onClick={() => setShowPostLoadWizard(true)}
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                {isUrdu ? 'نیا لوڈ' : 'Post Load'}
              </Button>
            </div>

            {shipperLoads.length === 0 ? (
              <EmptyState
                titleEn="No Loads Posted Yet"
                titleUr="کوئی لوڈ موجود نہیں"
                descriptionEn="Post your first cargo requirement and receive quotes from carriers."
                descriptionUr="اپنا پہلا لوڈ پوسٹ کریں اور ٹرانسپورٹرز سے ریٹ حاصل کریں۔"
                actionTextEn="Post a Load"
                actionTextUr="لوڈ لگائیں"
                onAction={() => setShowPostLoadWizard(true)}
                isUrdu={isUrdu}
              />
            ) : (
              <div className="space-y-3">
                {shipperLoads.map((load) => {
                  const isSelected = selectedLoad?.id === load.id;
                  const bCount = bids.filter((b) => b.loadId === load.id).length;
                  return (
                    <LoadCard
                      key={load.id}
                      load={load}
                      bidsCount={bCount}
                      isSelected={isSelected}
                      actionTextEn="Details"
                      actionTextUr="تفصیل"
                      isUrdu={isUrdu}
                      onAction={() => setSelectedLoad(load)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Load Details & Transporter Quotes (Right 7 Cols) */}
          <div className="lg:col-span-7">
            {selectedLoad ? (
              <div className="app-card space-y-5">
                {/* Header */}
                <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-micro text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
                        {selectedLoad.loadNumber}
                      </span>
                      <StatusBadge status={selectedLoad.status} size="sm" isUrdu={isUrdu} />
                    </div>
                    <h3 className="heading-section text-slate-900 dark:text-white mt-1">
                      {selectedLoad.originCity} &rarr; {selectedLoad.destinationCity}
                    </h3>
                  </div>

                  <div className="metric-medium text-blue-600 dark:text-blue-400">
                    PKR {selectedLoad.offeredPrice.toLocaleString()}
                  </div>
                </div>

                {/* Route & Cargo Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{isUrdu ? 'سامان:' : 'Cargo:'}</span>
                    <div className="font-bold text-slate-900 dark:text-white">{selectedLoad.cargoCategory}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{isUrdu ? 'وزن:' : 'Weight:'}</span>
                    <div className="font-bold text-slate-900 dark:text-white">{selectedLoad.weightTons} Tons</div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{isUrdu ? 'گاڑی:' : 'Vehicle:'}</span>
                    <div className="font-bold text-slate-900 dark:text-white">{selectedLoad.requiredVehicleType}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{isUrdu ? 'پتہ:' : 'Pickup:'}</span>
                    <div className="font-bold text-slate-900 dark:text-white truncate">{selectedLoad.originAddress}</div>
                  </div>
                </div>

                {/* Received Bids */}
                <div className="space-y-3">
                  <h4 className="heading-card text-slate-900 dark:text-white">
                    {isUrdu ? `ٹرانسپورٹرز کے ریٹ (${loadBids.length})` : `Transporter Quotes (${loadBids.length})`}
                  </h4>

                  {loadBids.length === 0 ? (
                    <EmptyState
                      titleEn="Waiting for Carrier Quotes"
                      titleUr="ٹرانسپورٹرز کے ریٹ کا انتظار ہے"
                      descriptionEn="Nearby verified transporters on this corridor have been notified."
                      descriptionUr="قریبی ٹرانسپورٹرز کو آگاہ کر دیا گیا ہے۔ جلد ریٹ موصول ہو جائیں گے۔"
                      isUrdu={isUrdu}
                    />
                  ) : (
                    <div className="space-y-3">
                      {loadBids.map((bid) => (
                        <BidCard
                          key={bid.id}
                          bid={bid}
                          isUrdu={isUrdu}
                          isAccepted={bid.status === 'accepted'}
                          onAccept={() => {
                            setBidToPay(bid);
                            setLoadToPay(selectedLoad);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState
                titleEn="Select a Load"
                titleUr="کوئی لوڈ منتخب کریں"
                descriptionEn="Select any load from the list to review quotes from transporters."
                descriptionUr="ٹرانسپورٹرز کے ریٹ دیکھنے کے لیے بائیں جانب سے لوڈ منتخب کریں۔"
                isUrdu={isUrdu}
              />
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: LIVE SHIPMENTS & GPS TRACKING
          ============================================================ */}
      {currentTab === 'shipments' && (
        <div className="space-y-5">
          {activeTrip ? (
            <div className="app-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-micro text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded font-bold font-mono">
                      {activeTrip.eBiltyNumber || 'E-BILTY 88921'}
                    </span>
                    <StatusBadge status={activeTrip.status} size="sm" isUrdu={isUrdu} />
                  </div>
                  <h2 className="heading-section text-slate-900 dark:text-white mt-1">
                    {activeTrip.originCity} &rarr; {activeTrip.destinationCity}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {currentEbilty && (
                    <Button
                      onClick={() => setShowEbiltyModal(true)}
                      variant="secondary"
                      size="sm"
                      leftIcon={<FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    >
                      {t.viewEBilty}
                    </Button>
                  )}

                  {activeTrip.pickupProof && (
                    <Button
                      onClick={() => setShowProofModal(true)}
                      variant="secondary"
                      size="sm"
                      leftIcon={<Camera className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
                    >
                      {isUrdu ? 'تصاویر' : 'Proof'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <ProgressTracker currentStatus={activeTrip.status} isUrdu={isUrdu} />

              {/* Interactive Telemetry Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <PakistanTripMap
                  origin={{ city: activeTrip.originCity, coords: PAKISTAN_CITIES[activeTrip.originCity]?.coords || [24.86, 67.00] }}
                  destination={{ city: activeTrip.destinationCity, coords: PAKISTAN_CITIES[activeTrip.destinationCity]?.coords || [31.41, 73.07] }}
                  currentCoords={activeTrip.currentCoords}
                  waypoints={activeTrip.routeWaypoints}
                  speedKmH={activeTrip.currentSpeedKmH || 0}
                  vehicleReg={activeTrip.vehicleRegNumber}
                  driverName={activeTrip.driverName}
                  progressPercentage={activeTrip.progressPercentage || 0}
                  height="320px"
                />
              </div>

              {/* Release Escrow Action if Delivered */}
              {activeTrip.status === 'delivered' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-300 dark:border-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="heading-card text-emerald-950 dark:text-emerald-200">
                      {isUrdu ? 'مال منزل پر پہنچ چکا ہے' : 'Cargo Delivered at Destination'}
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {isUrdu
                        ? 'کرایہ رقم ٹرانسپورٹر کو جاری کرنے کے لیے تصدیق کریں۔'
                        : 'Confirm delivery and release freight escrow payment to carrier.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => {
                        confirmDeliveryAndSettle(activeTrip.id);
                        setShowRatingModal(true);
                      }}
                      variant="success"
                      size="sm"
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      {isUrdu ? 'ادائیگی جاری کریں' : 'Release Payment'}
                    </Button>

                    <Button
                      onClick={() => setShowDisputeModal(true)}
                      variant="danger"
                      size="sm"
                      leftIcon={<AlertTriangle className="w-4 h-4" />}
                    >
                      {t.raiseDispute}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              titleEn="No Active Shipments"
              titleUr="کوئی لائیو چکر موجود نہیں"
              descriptionEn="When you accept a quote from a transporter, live GPS tracking will appear here."
              descriptionUr="جب آپ کسی ٹرانسپورٹر کا ریٹ قبول کریں گے تو یہاں لائیو روٹ ٹریکنگ نظر آئے گی۔"
              isUrdu={isUrdu}
            />
          )}
        </div>
      )}

      {/* ============================================================
          TAB 4: MESSAGES & CHAT SCREEN
          ============================================================ */}
      {currentTab === 'messages' && (
        <div className="app-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="heading-section text-slate-900 dark:text-white">
                {isUrdu ? 'ٹرانسپورٹرز کے ساتھ پیغامات' : 'Messages with Transporters'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct chat and coordination</p>
            </div>

            <a
              href={`tel:${chatRecipient.phone}`}
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Transporter</span>
            </a>
          </div>

          <div className="h-[360px] overflow-y-auto bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-200 dark:border-slate-700">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                    m.sender === 'me'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-bl-none'
                  }`}
                >
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
              setChatMessages((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  sender: 'me',
                  text: chatInput.trim(),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
              setChatInput('');
            }}
            className="flex items-center gap-2 pt-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={isUrdu ? 'پیغام لکھیں...' : 'Type a message to transporter...'}
              className="flex-1 h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600"
            />
            <Button type="submit" variant="primary" size="md">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* ============================================================
          TAB 5: SETTINGS & PROFILE
          ============================================================ */}
      {(currentTab === 'settings' || currentTab === 'profile') && (
        <SettingsScreen onBack={() => handleTabChange('home')} />
      )}

      {/* Load Posting Guided Wizard Modal */}
      {showPostLoadWizard && (
        <PostLoadWizard
          onClose={() => setShowPostLoadWizard(false)}
          onSuccess={(newLoad) => {
            setShowPostLoadWizard(false);
            setSelectedLoad(newLoad);
            handleTabChange('loads');
          }}
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

      {/* Payment Gateway Modal */}
      {bidToPay && loadToPay && (
        <PaymentGatewayModal
          bid={bidToPay}
          load={loadToPay}
          onClose={() => {
            setBidToPay(null);
            setLoadToPay(null);
          }}
          onSuccess={() => {
            acceptBid(bidToPay.id);
            setBidToPay(null);
            setLoadToPay(null);
            handleTabChange('shipments');
          }}
        />
      )}

      {/* E-Bilty Modal */}
      {showEbiltyModal && currentEbilty && (
        <EBiltyModal
          ebilty={currentEbilty}
          onClose={() => setShowEbiltyModal(false)}
        />
      )}

      {/* Proof Gallery Modal */}
      {showProofModal && activeTrip?.pickupProof && (
        <ProofGalleryModal
          proof={activeTrip.pickupProof}
          title="Pickup Verification Proof"
          onClose={() => setShowProofModal(false)}
        />
      )}

      {/* Dispute Modal */}
      {showDisputeModal && selectedLoad && (
        <DisputeModal
          tripId={activeTrip?.id || selectedLoad.activeTripId || 'trp_101'}
          loadNumber={selectedLoad.loadNumber}
          onClose={() => setShowDisputeModal(false)}
          onSubmit={raiseDispute}
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && activeTrip && (
        <RatingModal
          tripId={activeTrip.id}
          targetId={activeTrip.ownerId}
          targetName={activeTrip.ownerName}
          targetType="owner"
          onClose={() => setShowRatingModal(false)}
          onSubmit={submitRating}
        />
      )}
    </div>
  );
};
