import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PakistanTripMap } from '../components/PakistanTripMap';
import { SettingsScreen } from '../components/SettingsScreen';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  ShieldCheck,
  TrendingUp,
  MapPin,
  Truck,
  Users,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  XCircle,
  Activity,
  X,
  Settings
} from 'lucide-react';

interface AdminPortalProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  activeTab: externalTab = 'map',
  setActiveTab: setExternalTab
}) => {
  const {
    allUsers,
    trips,
    payments,
    disputes,
    auditLogs,
    verifyKYC,
    resolveDispute,
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

  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('50% freight deduction applied due to minor packaging puncture.');
  const [refundAmount, setRefundAmount] = useState<number>(25000);

  // Financial Calculations
  const totalGMV = payments.reduce((acc, p) => acc + p.grossAmount, 0);
  const totalCommissions = payments.reduce((acc, p) => acc + p.commissionAmount, 0);
  const pendingKYCUsers = allUsers.filter((u) => u.kycStatus === 'pending');

  const selectedDispute = disputes.find((d) => d.id === selectedDisputeId);

  const handleResolveDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeId) return;
    resolveDispute(selectedDisputeId, resolutionText, Number(refundAmount));
    setSelectedDisputeId(null);
  };

  return (
    <div className={`space-y-6 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
      {/* Clean Admin Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{isUrdu ? 'قومی آپریشنز و گورننس' : 'Operations Command & Governance'}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.adminHeadline}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            {t.adminSubhead}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live
          </span>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="app-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold">{isUrdu ? 'کل تجارتی مال کا حجم' : 'Total Gross Volume'}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="metric-large text-slate-900 dark:text-white font-mono">
            PKR {totalGMV.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
            {isUrdu ? 'پلیٹ فارم ٹرانزیکشنز' : 'Total Escrow Throughput'}
          </div>
        </div>

        <div className="app-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold">{isUrdu ? 'پلیٹ فارم فیس (5%)' : 'Platform Revenue (5%)'}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="metric-large text-slate-900 dark:text-white font-mono">
            PKR {totalCommissions.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium mt-1">
            {isUrdu ? 'حاصل شدہ آمدنی' : 'Platform Net Fees'}
          </div>
        </div>

        <div className="app-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold">{t.kycQueue}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="metric-large text-slate-900 dark:text-white">
            {pendingKYCUsers.length} <span className="text-xs font-normal text-slate-400">Pending</span>
          </div>
          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-1">
            CNIC & HTV Document Reviews
          </div>
        </div>

        <div className="app-card">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold">{t.disputes}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="metric-large text-slate-900 dark:text-white">
            {disputes.filter((d) => d.status === 'under_review' || d.status === 'open').length}
          </div>
          <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium mt-1">
            Escrow Holds Active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto text-xs font-bold">
        {[
          { id: 'map', label: t.liveMap, icon: MapPin },
          { id: 'kyc', label: `${t.kycQueue} (${pendingKYCUsers.length})`, icon: ShieldCheck },
          { id: 'disputes', label: `${t.disputes} (${disputes.length})`, icon: AlertTriangle },
          { id: 'audit_logs', label: t.auditLogs, icon: Activity },
          { id: 'financials', label: isUrdu ? 'مالیاتی کھاتہ' : 'Financial Ledger', icon: DollarSign },
          { id: 'settings', label: isUrdu ? 'ترتیبات' : 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === 'settings' && currentTab === 'profile');
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Live Operations Map */}
      {currentTab === 'map' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              Active Highway Corridors (Pakistan)
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Active Shipments: <b className="text-emerald-700 dark:text-emerald-400">{trips.filter((t) => t.status === 'in_transit').length}</b>
            </span>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            {trips[0] ? (
              <PakistanTripMap
                origin={{ city: trips[0].originCity, coords: trips[0].originCoords }}
                destination={{ city: trips[0].destinationCity, coords: trips[0].destinationCoords }}
                currentCoords={trips[0].currentCoords}
                waypoints={trips[0].routeWaypoints}
                speedKmH={trips[0].currentSpeedKmH}
                vehicleReg={trips[0].vehicleRegNumber}
                driverName={trips[0].driverName}
                progressPercentage={trips[0].progressPercentage}
                height="440px"
              />
            ) : (
              <EmptyState
                titleEn="No Active Trips in Transit"
                titleUr="کوئی لائیو چکر موجود نہیں"
                descriptionEn="Active corridor trips will be plotted automatically."
                descriptionUr="روانگی کے وقت گاڑیاں خود بخود نقشے پر نظر آئیں گی۔"
                isUrdu={isUrdu}
              />
            )}
          </div>
        </div>
      )}

      {/* Tab 2: KYC & Verification Center */}
      {currentTab === 'kyc' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allUsers.map((user) => (
            <div key={user.id} className="app-card space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role} &bull; {user.phone}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    user.kycStatus === 'verified'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {user.kycStatus}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span>CNIC / ID:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{user.cnic}</span>
                </div>
                {user.companyName && (
                  <div className="flex justify-between">
                    <span>Company:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{user.companyName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Trips:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{user.totalTrips}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2">
                <Button
                  onClick={() => verifyKYC(user.id, true)}
                  variant="success"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  fullWidth
                >
                  Approve
                </Button>
                <Button
                  onClick={() => verifyKYC(user.id, false)}
                  variant="danger"
                  size="sm"
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  fullWidth
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Disputes */}
      {currentTab === 'disputes' && (
        <div className="space-y-3">
          {disputes.length === 0 ? (
            <EmptyState
              titleEn="No Open Disputes"
              titleUr="کوئی تنازع موجود نہیں"
              descriptionEn="All cargo shipments are running smoothly with no reported claims."
              descriptionUr="تمام سفر بغیر کسی تنازع کے جاری ہیں۔"
              isUrdu={isUrdu}
            />
          ) : (
            disputes.map((dsp) => (
              <div key={dsp.id} className="app-card space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                        {dsp.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">&bull; Load: {dsp.loadNumber}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">"{dsp.description}"</p>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Escrow Held</div>
                    <div className="metric-small text-rose-700 dark:text-rose-400">PKR {dsp.heldAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    Raised by: <span className="text-slate-900 dark:text-white font-bold">{dsp.raisedByName}</span> &bull; Against: <span className="text-slate-900 dark:text-white font-bold">{dsp.defendantName}</span>
                  </div>

                  {dsp.status === 'under_review' ? (
                    <Button
                      onClick={() => setSelectedDisputeId(dsp.id)}
                      variant="primary"
                      size="sm"
                    >
                      Arbitrate Claim
                    </Button>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Resolved: {dsp.resolutionDecision}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {currentTab === 'audit_logs' && (
        <div className="app-card space-y-3">
          <h4 className="heading-label text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Platform Audit Trail
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold mr-2 text-[10px]">
                    {log.action}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{log.details}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString('en-GB')} &bull; {log.actorName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Financials */}
      {currentTab === 'financials' && (
        <div className="app-card space-y-4">
          <h4 className="heading-label text-slate-500 dark:text-slate-400">Escrow & Settlement Ledger</h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {payments.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{p.loadNumber} &bull; {p.invoiceNumber}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {p.shipperName} &rarr; {p.ownerName}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-slate-900 dark:text-white font-bold">Gross: PKR {p.grossAmount.toLocaleString()}</div>
                  <div className="text-emerald-700 dark:text-emerald-400 font-semibold">Net: PKR {p.netPayoutAmount.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Settings Screen */}
      {(currentTab === 'settings' || currentTab === 'profile') && (
        <SettingsScreen onBack={() => handleTabChange('map')} />
      )}

      {/* Dispute Arbitration Modal */}
      {selectedDisputeId && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="heading-section text-slate-900 dark:text-white">Arbitrate Claim {selectedDispute.id}</h3>
              <button onClick={() => setSelectedDisputeId(null)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">"{selectedDispute.description}"</p>

            <form onSubmit={handleResolveDispute} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Arbitration Verdict</label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Shipper Refund (PKR)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" onClick={() => setSelectedDisputeId(null)} variant="secondary" size="sm">Cancel</Button>
                <Button type="submit" variant="primary" size="sm">
                  Issue Verdict
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
