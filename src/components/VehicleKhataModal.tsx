import React, { useState } from 'react';
import type { Vehicle, VehicleExpenseEntry, VehicleMaintenanceRecord } from '../types';
import { useApp } from '../context/AppContext';
import {
  Truck,
  Plus,
  Wrench,
  FileText,
  TrendingUp,
  Fuel,
  X,
  Phone,
  MessageCircle,
  Clock,
  Car,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { exportSingleVehicleExcel } from '../utils/excelExport';

interface VehicleKhataModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onAddExpense?: (expense: VehicleExpenseEntry) => void;
  onAddMaintenance?: (maintenance: VehicleMaintenanceRecord) => void;
}

export const VehicleKhataModal: React.FC<VehicleKhataModalProps> = ({
  vehicle,
  onClose
}) => {
  const { language, t, playVoiceHelp } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'maintenance' | 'documents' | 'pnl'>('overview');
  
  // Add Expense State
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState<VehicleExpenseEntry['category']>('diesel');
  const [expenseAmount, setExpenseAmount] = useState<number>(35000);
  const [dieselLiters, setDieselLiters] = useState<number>(125);
  const [dieselRate, setDieselRate] = useState<number>(280);
  const [expenseDescription, setExpenseDescription] = useState('High speed diesel filling');
  const [expenseReceipt, setExpenseReceipt] = useState('PSO-FSD-9921');

  // Add Maintenance State
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [serviceType, setServiceType] = useState<VehicleMaintenanceRecord['serviceType']>('mobil_oil_filter');
  const [serviceCost, setServiceCost] = useState<number>(26000);
  const [serviceOdometer, setServiceOdometer] = useState<number>(vehicle.odometerKm || 150000);
  const [workshopName, setWorkshopName] = useState('Al-Haram Diesel Workshop');
  const [workshopCity, setWorkshopCity] = useState('Lahore');
  const [serviceNotes, setServiceNotes] = useState('Mobil oil and filters changed');

  // Local mutable state for instant reactive additions
  const [expensesList, setExpensesList] = useState<VehicleExpenseEntry[]>(vehicle.expenses || []);
  const [maintenanceList, setMaintenanceList] = useState<VehicleMaintenanceRecord[]>(vehicle.maintenanceLogs || []);

  // P&L Calculations
  const totalExpenses = expensesList.reduce((acc, e) => acc + e.amountPkr, 0);
  const totalMaintenanceCost = maintenanceList.reduce((acc, m) => acc + m.costPkr, 0);
  const estimatedRevenue = vehicle.totalTrips * 185000;
  const netProfit = estimatedRevenue - totalExpenses - totalMaintenanceCost;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: VehicleExpenseEntry = {
      id: `exp_${Date.now()}`,
      vehicleId: vehicle.id,
      date: new Date().toISOString().split('T')[0],
      category: expenseCategory,
      categoryUr:
        expenseCategory === 'diesel'
          ? 'ڈیزل فیول'
          : expenseCategory === 'toll_tax'
          ? 'ٹول پلازہ ٹیکس'
          : expenseCategory === 'loading_mazdoori'
          ? 'پلیداری و مزدوری'
          : expenseCategory === 'kanta_weighbridge'
          ? 'وزن کنڈہ فیس'
          : 'ڈرائیور بھتہ',
      amountPkr: Number(expenseAmount),
      dieselLiters: expenseCategory === 'diesel' ? Number(dieselLiters) : undefined,
      dieselRatePerLiter: expenseCategory === 'diesel' ? Number(dieselRate) : undefined,
      description: expenseDescription,
      receiptNumber: expenseReceipt,
      addedBy: 'Fleet Manager'
    };

    setExpensesList([newEntry, ...expensesList]);
    setShowAddExpense(false);
    playVoiceHelp(language === 'ur' ? 'خرچہ رجسٹر میں درج ہو گیا ہے۔' : 'Expense recorded in vehicle ledger.');
  };

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: VehicleMaintenanceRecord = {
      id: `mnt_${Date.now()}`,
      vehicleId: vehicle.id,
      date: new Date().toISOString().split('T')[0],
      odometerKm: Number(serviceOdometer),
      serviceType,
      serviceTypeUr:
        serviceType === 'mobil_oil_filter'
          ? 'موبل آئل اور فلٹر تبدیلی'
          : serviceType === 'tyre_change'
          ? 'ٹائر تبدیلی'
          : 'کمانی و بریک کام',
      costPkr: Number(serviceCost),
      workshopName,
      workshopCity,
      nextDueKm: serviceType === 'mobil_oil_filter' ? Number(serviceOdometer) + 10000 : undefined,
      notes: serviceNotes
    };

    setMaintenanceList([newRecord, ...maintenanceList]);
    setShowAddMaintenance(false);
    playVoiceHelp(language === 'ur' ? 'ورکشاپ ریکارڈ رجسٹر میں شامل ہو گیا ہے۔' : 'Maintenance service logged.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-mono tracking-tight text-white">
                  {vehicle.registrationNumber}
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {vehicle.vehicleType}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {language === 'ur' ? 'گاڑی کا مکمل ڈیجیٹل کھاتہ اور اخراجات رجسٹر' : 'Official Fleet Vehicle Ledger & Maintenance Khata'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                exportSingleVehicleExcel(vehicle);
                playVoiceHelp(language === 'ur' ? 'گاڑی کا ایکسل کھاتہ ڈاؤن لوڈ ہو رہا ہے۔' : 'Exporting vehicle Excel ledger.');
              }}
              className="btn-primary text-xs py-2 px-3.5 shadow-sm flex items-center gap-1.5 font-bold"
              title="Download Excel Spreadsheet (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ur' ? 'ایکسل کھاتہ ڈاؤن لوڈ (.xlsx)' : 'Download Excel (.xlsx)'}</span>
              <span className="sm:hidden">Excel</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khata Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          {[
            { id: 'overview', label: language === 'ur' ? 'بنیادی کوائف' : 'Vehicle Identity', icon: Car },
            { id: 'expenses', label: `${language === 'ur' ? 'چکر کا خرچہ' : 'Trip Expenses'} (${expensesList.length})`, icon: Fuel },
            { id: 'maintenance', label: `${language === 'ur' ? 'ورکشاپ و آئل' : 'Maintenance & Tyres'} (${maintenanceList.length})`, icon: Wrench },
            { id: 'documents', label: language === 'ur' ? 'سرکاری کاغذات' : 'Permits & Fitness', icon: FileText },
            { id: 'pnl', label: language === 'ur' ? 'منافع و بچت' : 'Profit & Loss Statement', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50">
          {/* TAB 1: OVERVIEW & SPECS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ur' ? 'ماڈل و انجن' : 'Make & Model'}</div>
                  <div className="text-sm font-black text-slate-900">{vehicle.makeModel}</div>
                  <div className="text-xs text-slate-500 font-mono">Model Year: {vehicle.year}</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ur' ? 'چیسس و انجن نمبر' : 'Chassis & Engine'}</div>
                  <div className="text-xs font-mono font-bold text-slate-900">Chassis: {vehicle.chassisNumber || 'ZZ4257V3247N1'}</div>
                  <div className="text-xs font-mono text-slate-600">Engine: {vehicle.engineNumber || 'D12.42-50892'}</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{language === 'ur' ? 'پاسنگ وزن و ٹائر' : 'Passing & Tyres'}</div>
                  <div className="text-sm font-black text-emerald-800">{vehicle.capacityTons} Tons Payload</div>
                  <div className="text-xs text-slate-600 font-bold">{vehicle.tyreCount || 22} Tyres ({vehicle.bodyType})</div>
                </div>
              </div>

              {/* Driver Assignment Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
                    alt="Driver"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">{language === 'ur' ? 'مقرر کردہ استاد ڈرائیور' : 'Assigned Primary Driver'}</div>
                    <div className="text-sm font-black text-slate-900">{vehicle.currentDriverName || 'Ustad Aslam Khan'}</div>
                    <div className="text-xs text-slate-500 font-mono">{vehicle.currentDriverPhone || '+92 345 6789012'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${vehicle.currentDriverPhone || '+923456789012'}`}
                    className="btn-primary text-xs py-2 px-3.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {language === 'ur' ? 'کال ملائیں' : 'Call Driver'}
                  </a>
                  <a
                    href={`https://wa.me/${(vehicle.currentDriverPhone || '+923456789012').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2 px-3 text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-slate-900">{vehicle.totalTrips}</div>
                  <div className="text-[11px] text-slate-500 font-bold">{language === 'ur' ? 'کل چکر مکمل' : 'Completed Trips'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-slate-900 font-mono">{vehicle.odometerKm.toLocaleString()} KM</div>
                  <div className="text-[11px] text-slate-500 font-bold">{language === 'ur' ? 'موجودہ مائلیج' : 'Odometer (KM)'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-emerald-700 font-mono">PKR {(vehicle.totalTrips * 185000).toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 font-bold">{language === 'ur' ? 'کل کمائی' : 'Gross Earnings'}</div>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <div className="text-lg font-black text-blue-700">{vehicle.onTimePercentage}%</div>
                  <div className="text-[11px] text-slate-500 font-bold">{language === 'ur' ? 'آن ٹائم کارکردگی' : 'On-Time Rate'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRIP EXPENSES & DIESEL LEDGER */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {language === 'ur' ? 'چکر و روڈ کے اخراجات (ڈیزل، ٹول پلازہ، پلیداری، بھتہ)' : 'Trip Expenses & Running Costs'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Total Logged Expenses: <b className="text-slate-900 font-mono">PKR {totalExpenses.toLocaleString()}</b>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddExpense(true)}
                  className="btn-primary text-xs py-2 px-3.5 shadow-sm"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{language === 'ur' ? 'نیا خرچہ درج کریں' : 'Add Expense Entry'}</span>
                </button>
              </div>

              {/* Expense Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">{language === 'ur' ? 'تاریخ و روٹ' : 'Date & Route'}</th>
                      <th className="p-3">{language === 'ur' ? 'خرچے کی قسم' : 'Category'}</th>
                      <th className="p-3">{language === 'ur' ? 'تفصیل و رسید نمبر' : 'Description & Receipt'}</th>
                      <th className="p-3 text-right">{language === 'ur' ? 'رقم (روپے)' : 'Amount (PKR)'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {expensesList.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 font-mono">{exp.date}</div>
                          <div className="text-[11px] text-slate-500">{exp.tripRoute || 'National Highway'}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[10px]">
                            {language === 'ur' ? exp.categoryUr : exp.category.toUpperCase()}
                          </span>
                          {exp.dieselLiters && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {exp.dieselLiters}L @ PKR {exp.dieselRatePerLiter}/L
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="text-slate-800">{exp.description}</div>
                          {exp.receiptNumber && (
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Receipt className="w-3 h-3" /> {exp.receiptNumber}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right font-black text-slate-900 font-mono text-sm">
                          PKR {exp.amountPkr.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MAINTENANCE & TYRE LEDGER */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {language === 'ur' ? 'ورکشاپ، موبل آئل فلٹر و ٹائر رجسٹر' : 'Workshop, Mobil Oil & Tyres Log'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Total Workshop Maintenance: <b className="text-slate-900 font-mono">PKR {totalMaintenanceCost.toLocaleString()}</b>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddMaintenance(true)}
                  className="btn-primary text-xs py-2 px-3.5 shadow-sm"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{language === 'ur' ? 'ورکشاپ سروس درج کریں' : 'Log Maintenance'}</span>
                </button>
              </div>

              {/* Maintenance Records */}
              <div className="space-y-3">
                {maintenanceList.map((mnt) => (
                  <div key={mnt.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{language === 'ur' ? mnt.serviceTypeUr : mnt.serviceType}</span>
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          @ {mnt.odometerKm.toLocaleString()} KM
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <b>{mnt.workshopName}</b> ({mnt.workshopCity}) &bull; Date: {mnt.date}
                      </div>
                      <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-1">
                        {mnt.notes} {mnt.partsReplaced && `• Parts: ${mnt.partsReplaced}`} {mnt.tyreBrand && `• Brand: ${mnt.tyreBrand}`}
                      </div>
                      {mnt.nextDueKm && (
                        <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Next Service Due: <span className="font-mono">{mnt.nextDueKm.toLocaleString()} KM</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right sm:self-center shrink-0">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Cost</div>
                      <div className="text-base font-black text-rose-700 font-mono">
                        PKR {mnt.costPkr.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS & EXPIRIES */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900">
                {language === 'ur' ? 'گاڑی کے سرکاری کاغذات، روٹ پرمٹ، فٹنس و ٹوکن ٹیکس' : 'Statutory Regulatory Documents & Compliance'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(vehicle.documentRecords || []).map((doc, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-black text-slate-900 text-sm">
                        {language === 'ur' ? doc.documentTypeUr : doc.documentType}
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 uppercase">
                        {doc.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Document No:</span>
                        <span className="font-mono font-bold text-slate-900">{doc.documentNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issuing Authority:</span>
                        <span className="font-bold text-slate-800">{doc.issuingAuthority}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="font-bold text-emerald-700 font-mono">{doc.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFIT & LOSS STATEMENT */}
          {activeTab === 'pnl' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900">
                {language === 'ur' ? 'گاڑی کا سالانہ نفع و نقصان اسٹیٹمنٹ' : 'Vehicle Profit & Loss Statement'}
              </h4>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-700">{language === 'ur' ? 'کل کمائی (Gross Revenue)' : 'Gross Freight Revenue'}:</span>
                  <span className="font-black text-emerald-700 font-mono text-base">+ PKR {estimatedRevenue.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-xs py-1 text-slate-600">
                  <span>{language === 'ur' ? 'کل ڈیزل و روڈ خرچ (Diesel & Tolls)' : 'Trip Diesel & Running Expenses'}:</span>
                  <span className="font-bold text-rose-600 font-mono">- PKR {totalExpenses.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-xs py-1 text-slate-600">
                  <span>{language === 'ur' ? 'ورکشاپ و ٹائر لاگت (Maintenance)' : 'Workshop Maintenance & Tyres'}:</span>
                  <span className="font-bold text-rose-600 font-mono">- PKR {totalMaintenanceCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-base font-black pt-3 border-t-2 border-slate-900 text-slate-900">
                  <span>{language === 'ur' ? 'خالص گاڑی منافع (Net Profit)' : 'Net Vehicle Profit'}:</span>
                  <span className="font-mono text-lg text-emerald-800">+ PKR {netProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Expense Drawer */}
        {showAddExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal p-6 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">
                  {language === 'ur' ? 'نیا خرچہ درج کریں' : 'Add Trip Expense'}
                </h3>
                <button onClick={() => setShowAddExpense(false)} className="p-1 text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expense Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="diesel">ڈیزل فیول (Diesel)</option>
                    <option value="toll_tax">موٹروے ٹول ٹیکس (Motorway Toll)</option>
                    <option value="loading_mazdoori">پلیداری و لوڈنگ مزدوری (Mazdoori)</option>
                    <option value="kanta_weighbridge">وزن کنڈہ فیس (Weighbridge)</option>
                    <option value="driver_bhatta">ڈرائیور بھتہ و کھانا (Driver Bhatta)</option>
                    <option value="challan_fine">چالان / جرمانہ (Challan)</option>
                  </select>
                </div>

                {expenseCategory === 'diesel' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Diesel Liters</label>
                      <input
                        type="number"
                        value={dieselLiters}
                        onChange={(e) => {
                          const l = Number(e.target.value);
                          setDieselLiters(l);
                          setExpenseAmount(l * dieselRate);
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Rate per Liter</label>
                      <input
                        type="number"
                        value={dieselRate}
                        onChange={(e) => {
                          const r = Number(e.target.value);
                          setDieselRate(r);
                          setExpenseAmount(dieselLiters * r);
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-base font-black text-emerald-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description / Location</label>
                  <input
                    type="text"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="e.g. PSO Sukkur Bypass Station"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Receipt / Slip Number</label>
                  <input
                    type="text"
                    value={expenseReceipt}
                    onChange={(e) => setExpenseReceipt(e.target.value)}
                    placeholder="e.g. PSO-9921"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAddExpense(false)} className="btn-secondary text-xs">{t.cancel}</button>
                  <button type="submit" className="btn-primary text-xs py-2 px-5">Save Entry</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Maintenance Drawer */}
        {showAddMaintenance && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-modal p-6 space-y-4 border border-slate-200">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">
                  {language === 'ur' ? 'ورکشاپ و سروس لاگ' : 'Log Maintenance Service'}
                </h3>
                <button onClick={() => setShowAddMaintenance(false)} className="p-1 text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCreateMaintenance} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="mobil_oil_filter">موبل آئل اور آئل فلٹر تبدیلی (Oil & Filter)</option>
                    <option value="tyre_change">نئے ٹائر کی خریداری / تبدیلی (Tyre Replacement)</option>
                    <option value="brake_kamani">کمانی پٹے اور بریک مرمت (Suspension & Brakes)</option>
                    <option value="engine_overhaul">انجن کام / ٹیوننگ (Engine Overhaul)</option>
                    <option value="electrical_battery">بیٹری و الیکٹریکل (Battery & Electrical)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Cost (PKR)</label>
                    <input
                      type="number"
                      required
                      value={serviceCost}
                      onChange={(e) => setServiceCost(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-black font-mono text-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Odometer (KM)</label>
                    <input
                      type="number"
                      value={serviceOdometer}
                      onChange={(e) => setServiceOdometer(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-black font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Workshop Name</label>
                    <input
                      type="text"
                      value={workshopName}
                      onChange={(e) => setWorkshopName(e.target.value)}
                      placeholder="e.g. Al-Madina Workshop"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={workshopCity}
                      onChange={(e) => setWorkshopCity(e.target.value)}
                      placeholder="e.g. Lahore"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parts & Remarks</label>
                  <input
                    type="text"
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    placeholder="e.g. Delo 400 Gold 28L, oil and fuel filters"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAddMaintenance(false)} className="btn-secondary text-xs">{t.cancel}</button>
                  <button type="submit" className="btn-primary text-xs py-2 px-5">Save Service Log</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
