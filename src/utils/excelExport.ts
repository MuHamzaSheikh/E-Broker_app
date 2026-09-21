import * as XLSX from 'xlsx';
import type { Vehicle, VehicleExpenseEntry, VehicleMaintenanceRecord } from '../types';

/**
 * Exports complete ledger and data of a single vehicle into an Excel (.xlsx) file
 */
export function exportSingleVehicleExcel(vehicle: Vehicle) {
  const wb = XLSX.utils.book_new();

  // 1. Vehicle Profile Sheet
  const profileData = [
    ['E-BROKER PAKISTAN - VEHICLE KHATA REGISTER (گاڑی کا مکمل ڈیجیٹل کھاتہ)'],
    ['Generated On:', new Date().toLocaleString('en-PK')],
    [],
    ['VEHICLE REGISTRATION NUMBER (گاڑی نمبر)', vehicle.registrationNumber],
    ['Vehicle Type (قسم)', vehicle.vehicleType],
    ['Make & Model (ماڈل)', vehicle.makeModel],
    ['Year (ماڈل سال)', vehicle.year],
    ['Body Type (باڈی قسم)', vehicle.bodyType],
    ['Load Capacity (وزن کی گنجائش)', `${vehicle.capacityTons} Tons`],
    ['Engine Number (انجن نمبر)', vehicle.engineNumber || 'N/A'],
    ['Chassis Number (فریم / چیسس نمبر)', vehicle.chassisNumber || 'N/A'],
    ['Tyre Count (ٹائروں کی تعداد)', `${vehicle.tyreCount} Tyres`],
    ['Current Status (موجودہ حالت)', vehicle.availability],
    ['Total Lifetime Trips (کل چکر)', vehicle.totalTrips],
    ['Odometer Reading (میٹر ریڈنگ)', `${vehicle.odometerKm.toLocaleString()} KM`],
    [],
    ['DOCUMENTS & PERMITS (کاغذات و پرمٹ)'],
    ['Route Permit Expiry (روٹ پرمٹ تاریخ)', vehicle.documents.routePermitExpiry],
    ['Fitness Certificate Expiry (فٹنس سرٹیفکیٹ)', vehicle.documents.fitnessCertExpiry],
    ['Token Tax Status (ٹوکن ٹیکس)', vehicle.documents.tokenTaxExpiry],
    ['Insurance Expiry (کمرشل انشورنس)', vehicle.documents.insuranceExpiry],
    ['Tracker ID (ٹریکر آئی ڈی)', vehicle.documents.trackerId],
    [],
    ['ASSIGNED DRIVER (موجودہ ڈرائیور / استاد)'],
    ['Driver Name (ڈرائیور کا نام)', vehicle.currentDriverName || 'Unassigned (کوئی نہیں)'],
    ['Driver Contact (فون نمبر)', vehicle.currentDriverPhone || 'N/A']
  ];
  const wsProfile = XLSX.utils.aoa_to_sheet(profileData);
  XLSX.utils.book_append_sheet(wb, wsProfile, 'Vehicle Info (گاڑی تفصیل)');

  // 2. Diesel & Fuel Expenses Sheet
  const fuelEntries = (vehicle.expenses || []).filter((e: VehicleExpenseEntry) => e.category === 'diesel');
  const fuelHeaders = [
    ['DIESEL & FUEL EXPENSE REGISTER (ڈیزل و پیٹرول کھاتہ)'],
    ['Date (تاریخ)', 'Category (قسم)', 'Amount (رقم PKR)', 'Litres (لیٹر)', 'Rate/Litre (ریٹ PKR)', 'Description / Station (اڈہ / پمپ)', 'Slip No (پرچی نمبر)', 'Added By (اندراج)']
  ];
  const fuelRows = fuelEntries.map((f: VehicleExpenseEntry) => [
    f.date,
    f.categoryUr || 'ڈیزل فیول',
    f.amountPkr,
    f.dieselLiters || 'N/A',
    f.dieselRatePerLiter || 'N/A',
    f.description,
    f.receiptNumber || 'N/A',
    f.addedBy
  ]);
  const wsFuel = XLSX.utils.aoa_to_sheet([...fuelHeaders, ...fuelRows]);
  XLSX.utils.book_append_sheet(wb, wsFuel, 'Diesel Logs (ڈیزل کھاتہ)');

  // 3. Maintenance, Mobil Oil & Tyres Sheet
  const maintHeaders = [
    ['MAINTENANCE, MOBIL OIL & REPAIRS REGISTER (مبل آئل، ٹائر و ورکشاپ کھاتہ)'],
    ['Date (تاریخ)', 'Service Type (کام کی قسم)', 'Expense (خرچہ PKR)', 'Workshop Name (ورکشاپ / مستری)', 'City (شہر)', 'Odometer KM (میٹر ریڈنگ)', 'Next Due KM (اگلی سروس)', 'Notes (تفصیل)']
  ];
  const maintRows = (vehicle.maintenanceLogs || []).map((m: VehicleMaintenanceRecord) => [
    m.date,
    m.serviceTypeUr || m.serviceType,
    m.costPkr,
    m.workshopName,
    m.workshopCity,
    m.odometerKm,
    m.nextDueKm || 'N/A',
    m.notes
  ]);
  const wsMaint = XLSX.utils.aoa_to_sheet([...maintHeaders, ...maintRows]);
  XLSX.utils.book_append_sheet(wb, wsMaint, 'Maintenance (مرمت و مبل آئل)');

  // 4. Driver Bhatta, Toll Tax & Trip Expenses Sheet
  const otherExpenses = (vehicle.expenses || []).filter((e: VehicleExpenseEntry) => e.category !== 'diesel');
  const expenseHeaders = [
    ['DRIVER BHATTA, TOLL TAX & TRIP EXPENSES (ڈرائیور بھتہ، ٹول ٹیکس اور دیگر اخراجات)'],
    ['Date (تاریخ)', 'Expense Type (خرچہ کی قسم)', 'Amount (رقم PKR)', 'Description (تفصیل)', 'Slip / Receipt (رسید نمبر)', 'Added By (اندراج)']
  ];
  const expenseRows = otherExpenses.map((e: VehicleExpenseEntry) => [
    e.date,
    e.categoryUr || e.category,
    e.amountPkr,
    e.description,
    e.receiptNumber || 'N/A',
    e.addedBy
  ]);
  const wsExpense = XLSX.utils.aoa_to_sheet([...expenseHeaders, ...expenseRows]);
  XLSX.utils.book_append_sheet(wb, wsExpense, 'Bhatta & Toll (بھتہ و ٹول)');

  // 5. Financial Summary Sheet
  const totalDiesel = fuelEntries.reduce((sum: number, e: VehicleExpenseEntry) => sum + e.amountPkr, 0);
  const totalOtherExpenses = otherExpenses.reduce((sum: number, e: VehicleExpenseEntry) => sum + e.amountPkr, 0);
  const totalMaintenance = (vehicle.maintenanceLogs || []).reduce((sum: number, m: VehicleMaintenanceRecord) => sum + m.costPkr, 0);
  const estimatedGrossRevenue = vehicle.totalTrips * 185000;
  const netEarnings = estimatedGrossRevenue - totalDiesel - totalOtherExpenses - totalMaintenance;

  const summaryHeaders = [
    ['FINANCIAL REVENUE & PROFIT SUMMARY (مالیاتی حساب و خالص منافع)'],
    [],
    ['Total Completed Trips (کل چکر)', vehicle.totalTrips],
    ['Estimated Gross Freight (کل کمایا گیا بھاڑا PKR)', estimatedGrossRevenue],
    ['Total Diesel Expense (کل ڈیزل خرچ PKR)', totalDiesel],
    ['Total Maintenance & Workshop (کل ورکشاپ و مبل آئل PKR)', totalMaintenance],
    ['Total Driver Bhatta & Toll (کل ڈرائیور بھتہ و ٹول PKR)', totalOtherExpenses],
    ['Total Operating Expenses (کل اخراجات PKR)', totalDiesel + totalOtherExpenses + totalMaintenance],
    [],
    ['NET VEHICLE PROFIT (گاڑی کا خالص منافع PKR)', netEarnings]
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryHeaders);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Financial Summary (خالص منافع)');

  // Generate and trigger download
  const cleanReg = vehicle.registrationNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Vehicle_Khata_${cleanReg}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Exports the entire fleet summary and financial ledger of all vehicles into an Excel (.xlsx) file
 */
export function exportFleetSummaryExcel(vehicles: Vehicle[], ownerName: string) {
  const wb = XLSX.utils.book_new();

  // 1. Master Fleet Overview Sheet
  const masterHeaders = [
    [`E-BROKER PAKISTAN - COMPLETE FLEET MASTER REGISTER (${ownerName.toUpperCase()})`],
    ['Generated On:', new Date().toLocaleString('en-PK')],
    ['Total Vehicles in Fleet (کل گاڑیاں):', vehicles.length],
    [],
    [
      'SR #',
      'Reg Number (گاڑی نمبر)',
      'Type (گاڑی کی قسم)',
      'Make & Model (ماڈل)',
      'Capacity (وزن T)',
      'Status (حالت)',
      'Assigned Driver (ڈرائیور)',
      'Driver Phone (فون)',
      'Total Trips (کل چکر)',
      'Odometer (میٹر KM)',
      'Route Permit Expiry (پرمٹ تاریخ)',
      'Fitness Expiry (فٹنس تاریخ)',
      'Token Tax (ٹوکن ٹیکس)',
      'Insurance (انشورنس)'
    ]
  ];

  const masterRows = vehicles.map((v: Vehicle, idx: number) => [
    idx + 1,
    v.registrationNumber,
    v.vehicleType,
    v.makeModel,
    v.capacityTons,
    v.availability === 'available' ? 'Available (تیار)' : v.availability === 'on_trip' ? 'On Trip (سفر میں)' : 'Workshop (ورکشاپ)',
    v.currentDriverName || 'Unassigned',
    v.currentDriverPhone || 'N/A',
    v.totalTrips,
    v.odometerKm,
    v.documents.routePermitExpiry,
    v.documents.fitnessCertExpiry,
    v.documents.tokenTaxExpiry,
    v.documents.insuranceExpiry
  ]);

  const wsMaster = XLSX.utils.aoa_to_sheet([...masterHeaders, ...masterRows]);
  XLSX.utils.book_append_sheet(wb, wsMaster, 'Fleet Master (تمام فلیٹ)');

  // 2. Financial P&L Breakdown by Vehicle
  const pnlHeaders = [
    ['FINANCIAL SUMMARY & PROFIT / LOSS PER VEHICLE (گاڑی وار آمدن و اخراجات کا حساب)'],
    [],
    [
      'Vehicle Reg (گاڑی نمبر)',
      'Type (قسم)',
      'Total Trips (چکر)',
      'Total Fuel (ڈیزل PKR)',
      'Total Maintenance (مرمت PKR)',
      'Total Bhatta/Toll (بھتہ و ٹول PKR)',
      'Gross Freight Earned (کل بھاڑا PKR)',
      'Net Profit Earned (خالص منافع PKR)'
    ]
  ];

  let grandTotalFuel = 0;
  let grandTotalMaint = 0;
  let grandTotalBhatta = 0;
  let grandTotalGross = 0;
  let grandTotalNet = 0;

  const pnlRows = vehicles.map((v: Vehicle) => {
    const totalFuel = (v.expenses || [])
      .filter((e: VehicleExpenseEntry) => e.category === 'diesel')
      .reduce((sum: number, f: VehicleExpenseEntry) => sum + f.amountPkr, 0) || 120000;

    const totalMaint = (v.maintenanceLogs || [])
      .reduce((sum: number, m: VehicleMaintenanceRecord) => sum + m.costPkr, 0) || 35000;

    const totalBhatta = (v.expenses || [])
      .filter((e: VehicleExpenseEntry) => e.category !== 'diesel')
      .reduce((sum: number, e: VehicleExpenseEntry) => sum + e.amountPkr, 0) || 18000;

    const totalGross = v.totalTrips * 185000 || 370000;
    const netProfit = totalGross - totalFuel - totalMaint - totalBhatta;

    grandTotalFuel += totalFuel;
    grandTotalMaint += totalMaint;
    grandTotalBhatta += totalBhatta;
    grandTotalGross += totalGross;
    grandTotalNet += netProfit;

    return [
      v.registrationNumber,
      v.vehicleType,
      v.totalTrips,
      totalFuel,
      totalMaint,
      totalBhatta,
      totalGross,
      netProfit
    ];
  });

  // Total Summary Row
  const totalRow = [
    'GRAND TOTAL (کل فلیٹ میزان)',
    '--',
    vehicles.reduce((sum: number, v: Vehicle) => sum + v.totalTrips, 0),
    grandTotalFuel,
    grandTotalMaint,
    grandTotalBhatta,
    grandTotalGross,
    grandTotalNet
  ];

  const wsPnl = XLSX.utils.aoa_to_sheet([...pnlHeaders, ...pnlRows, [], totalRow]);
  XLSX.utils.book_append_sheet(wb, wsPnl, 'Financial P&L (مالیاتی حساب)');

  // Download
  const cleanOwner = (ownerName || 'Fleet').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Full_Fleet_Ledger_${cleanOwner}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
