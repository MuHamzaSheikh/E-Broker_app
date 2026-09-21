export type Language = 'en' | 'ur';

export const TRANSLATIONS = {
  en: {
    // App Header & Branding
    brandTitle: 'E-Broker Freight',
    brandSubtitle: 'Pakistan Logistics & Adda Exchange',
    shipperRole: 'Shipper / Cargo Owner',
    ownerRole: 'Transporter / Fleet Owner',
    driverRole: 'Driver Console',
    adminRole: 'Operations Admin',
    langToggle: 'اردو',
    voiceAssistant: 'Voice Assistant',
    verified: 'Verified Transporter',
    
    // Core Actions & Common
    call: 'Call',
    whatsapp: 'WhatsApp',
    viewDetails: 'View Details',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    rupees: 'PKR',
    tons: 'Tons',
    km: 'KM',
    perKm: 'PKR/KM',
    eta: 'ETA',

    // Shipper Portal (inDrive Model)
    postNewLoad: 'Post Freight Load',
    shipperHeadline: 'Direct Freight Dispatch & Fleet Bidding',
    shipperSubhead: 'Broadcast cargo shipments to verified fleet carriers nationwide with instant E-Bilty and live GPS tracking.',
    activeShipments: 'Active Shipments',
    biddingOpen: 'Driver Offers Received',
    escrowHeld: 'Escrow Protected',
    deliveredTrips: 'Completed Trips',
    compareBids: 'Review Transporter Bids',
    acceptBid: 'Accept & Lock Truck',
    confirmAndPay: 'Goods Received - Release Freight Payment',
    raiseDispute: 'Report Issue / Shortage',
    pickupCity: 'Loading City (اڈہ)',
    deliveryCity: 'Unloading City (منزل)',
    cargoCategory: 'Cargo / Goods Type (مال)',
    requiredVehicle: 'Required Truck / Trailer',
    weight: 'Cargo Weight (وزن / ٹن)',
    targetPrice: 'Offered Freight Rate (بھاڑا PKR)',
    customPrice: 'Custom Price',
    singleBidAuto: 'Auto-Accept Target Bid',

    // Carrier / Fleet Portal
    ownerHeadline: 'National Freight Board & Fleet Management',
    ownerSubhead: 'Browse live freight loads across Pakistan highway corridors, quote rates, and manage driver assignments.',
    placeBid: 'Submit Freight Quote',
    availableFleet: 'Available Trucks (تیار گاڑیاں)',
    walletBalance: 'Available Balance (کھاتہ رقم)',
    withdrawMoney: 'Withdraw to Bank Account',
    addVehicle: 'Register New Truck (گاڑی اندراج)',
    addDriver: 'Register Driver (ڈرائیور اندراج)',
    myBids: 'My Active Quotes',
    downloadVehicleExcel: 'Download Vehicle Excel (.xlsx)',
    downloadFleetExcel: 'Download Entire Fleet Excel (.xlsx)',

    // Driver Mobile Console
    driverHeadline: 'On-Road Trip Assistant',
    driverSubhead: 'Execute trip milestones with GPS tracking, digital photo proof, and automated E-Bilty verification.',
    arrivedPickup: 'Arrived at Loading Warehouse',
    uploadPickupProof: 'Capture Loaded Cargo & Seal Photo',
    startTransit: 'Depart & Begin Highway Transit',
    arrivedDestination: 'Arrived at Destination Gate',
    uploadDeliveryProof: 'Capture Offloading Proof & Receiver OTP',
    tripCompleted: 'Trip Successfully Delivered',
    simulateGps: 'Simulate GPS Waypoint (+15%)',
    viewEBilty: 'View Official E-Bilty (سرکاری بلٹی)',

    // Operations / Admin Portal
    adminHeadline: 'National Freight Network Command Center',
    adminSubhead: 'Live highway corridor telemetry, KYC document verification queue, dispute arbitration, and audit ledger.',
    liveMap: 'Live Corridor Telemetry',
    kycQueue: 'KYC Verification Queue',
    disputes: 'Dispute Arbitration',
    auditLogs: 'Audit Trail'
  },
  ur: {
    // App Header & Branding (خالص اڈہ و ٹرانسپورٹ کی زبان)
    brandTitle: 'ای-بروکر مال بردار',
    brandSubtitle: 'پاکستان ڈیجیٹل گڈز ٹرانسپورٹ نیٹ ورک',
    shipperRole: 'مالکِ مال (تاجر / پارٹی)',
    ownerRole: 'ٹرانسپورٹر / فلیٹ اونر',
    driverRole: 'استاد ڈرائیور کنسول',
    adminRole: 'اڈہ ایڈمن کنٹرول',
    langToggle: 'English',
    voiceAssistant: 'آوازی رہنمائی',
    verified: 'تصدیق شدہ ٹرانسپورٹر',

    // Core Actions & Common
    call: 'کال ملائیں',
    whatsapp: 'واٹس ایپ رابطہ',
    viewDetails: 'تفصیل دیکھیں',
    close: 'بند کریں',
    cancel: 'منسوخ',
    save: 'محفوظ کریں',
    rupees: 'روپے',
    tons: 'ٹن',
    km: 'کلومیٹر',
    perKm: 'روپے فی کلومیٹر',
    eta: 'متوقع وقت',

    // Shipper Portal (ان ڈرائیو ماڈل)
    postNewLoad: 'نیا مال لوڈ کریں',
    shipperHeadline: 'مال بھیجنے کے لیے گاڑیاں اور فوری ریٹ حاصل کریں',
    shipperSubhead: 'پورے پاکستان کے مصدقہ ٹرانسپورٹرز سے براہِ راست ریٹ لیں، سرکاری ای-بلٹی اور لائیو جی پی ایس کے ساتھ۔',
    activeShipments: 'راستے میں مال',
    biddingOpen: 'ڈرائیورز کے ریٹ موصول',
    escrowHeld: 'محفوظ ایڈوانس رقم',
    deliveredTrips: 'پہنچایا گیا مال',
    compareBids: 'ٹرانسپورٹرز کے ریٹ دیکھیں',
    acceptBid: 'یہ ریٹ قبول کریں اور گاڑی بک کریں',
    confirmAndPay: 'مال مل گیا - بقایا کرایہ ٹرانسپورٹر کو جاری کریں',
    raiseDispute: 'مال کی کٹوتی یا شکایت درج کریں',
    pickupCity: 'مال اٹھانے کا اڈہ / گودام',
    deliveryCity: 'مال اتارنے کی جگہ / منزل',
    cargoCategory: 'مال کی جنس / قسم',
    requiredVehicle: 'کون سی گاڑی درکار ہے؟',
    weight: 'مال کا وزن (ٹن / کانٹا)',
    targetPrice: 'گاڑی کا کرایہ / بھاڑا (روپے)',
    customPrice: 'اپنی مرضی کا ریٹ درج کریں',
    singleBidAuto: 'پہلے مناسب ریٹ پر گاڑی خود بخود الاٹ کریں',

    // Carrier / Fleet Portal (فلیٹ اونر و منشی کھاتہ)
    ownerHeadline: 'قومی گڈز مارکیٹ اور فلیٹ کا ڈیجیٹل کھاتہ',
    ownerSubhead: 'ملک بھر کے ہائی ویز کے لوڈز پر ریٹ لگائیں، ڈرائیورز الاٹ کریں اور گاڑیوں کا مکمل رجسٹر سنبھالیں۔',
    placeBid: 'اپنا بھاڑا / ریٹ لگائیں',
    availableFleet: 'تیار گاڑیاں (فلیٹ)',
    walletBalance: 'موجودہ خالص رقم (والٹ)',
    withdrawMoney: 'رقم بینک یا ایزی پیسہ میں نکالیں',
    addVehicle: 'نئی گاڑی کا اندراج کریں',
    addDriver: 'نئے استاد ڈرائیور کا اندراج کریں',
    myBids: 'میرے لگائے گئے ریٹ',
    downloadVehicleExcel: 'گاڑی کا ایکسل کھاتہ ڈاؤن لوڈ کریں (.xlsx)',
    downloadFleetExcel: 'پورے فلیٹ کا مکمل ایکسل رجسٹر (.xlsx)',

    // Driver Mobile Console (استاد ڈرائیور کنسول)
    driverHeadline: 'استاد ڈرائیور کا سفری معاون',
    driverSubhead: 'سفر کے تمام مراحل مکمل کریں، مال کی تصاویر بنائیں اور منزل پر پہنچ کر فوری کرایہ حاصل کریں۔',
    arrivedPickup: '1. میں مال لوڈنگ گودام پہنچ گیا ہوں',
    uploadPickupProof: '📸 کیمرہ سے لوڈ ہوئے مال اور تالے کی تصویر بنائیں',
    startTransit: '2. میں ہائی وے پر روانہ ہو گیا ہوں',
    arrivedDestination: '3. میں مال اتارنے کی جگہ (منزل) پہنچ گیا ہوں',
    uploadDeliveryProof: '📸 مال اتارنے کا ثبوت اور او ٹی پی درج کریں',
    tripCompleted: 'مال کامیابی سے پارٹی کو پہنچا دیا گیا',
    simulateGps: 'ہائی وے جی پی ایس آگے بڑھائیں (15%)',
    viewEBilty: 'سرکاری ای-بلٹی پرچی دیکھیں',

    // Operations / Admin Portal
    adminHeadline: 'قومی گڈز ٹرانسپورٹ کمانڈ سینٹر',
    adminSubhead: 'لائیو ہائی وے روٹس، ٹرانسپورٹر جانچ، شکایات کا حل اور مالیاتی آڈٹ۔',
    liveMap: 'لائیو ٹرک کوریڈور نقشہ',
    kycQueue: 'کاغذات و پرمٹ تصدیق',
    disputes: 'مال کے تنازعات و کٹوتی',
    auditLogs: 'مکمل آڈٹ ریکارڈ'
  }
};

export const VEHICLE_DATA: Record<string, { en: string; ur: string }> = {
  'Shehzore Pickup': { en: 'Shehzore Pickup (3.5T)', ur: 'شہزور پک اپ (3.5 ٹن)' },
  'Mazda / Light Truck': { en: 'Mazda / 6-Wheeler (7.5T)', ur: 'مزدا 6-ویلر (7.5 ٹن)' },
  '10-Wheeler Rigid': { en: '10-Wheeler Rigid (18T)', ur: '10-ویلر بیڈ ٹرک (18 ٹن)' },
  '22-Wheeler Trailer': { en: '22-Wheeler Trailer (40T)', ur: '22-ویلر ٹرالر (40 ٹن)' },
  'Container 40ft': { en: '40ft ISO Container', ur: '40 فٹ کنٹینر' },
  'Reefer (Cold Chain)': { en: 'Reefer Cold Chain', ur: 'ریفریجریٹڈ کنٹینر (کولڈ چین)' }
};

export const CARGO_DATA: Record<string, { en: string; ur: string }> = {
  'Textile & Garments': { en: 'Textile & Cotton Bales', ur: 'کپاس، سوت و کپڑا' },
  'Agricultural & Fruits': { en: 'Agri Produce, Fruits & Wheat', ur: 'گندم، چاول، پھل و سبزیاں (منڈی)' },
  'FMCG & Packaged Goods': { en: 'FMCG & Groceries', ur: 'کریانہ و پیک شدہ سامان' },
  'Industrial & Chemicals': { en: 'Chemicals, Cement & Fertilizer', ur: 'کھاد، سیمنٹ، کیمیکلز و خام مال' },
  'Electronics & Machinery': { en: 'Machinery & Electronics', ur: 'مشینری و الیکٹرانکس' },
  'Construction Materials': { en: 'Steel, Iron & Heavy Cargo', ur: 'سریا، لوہا و تعمیراتی سامان' }
};
