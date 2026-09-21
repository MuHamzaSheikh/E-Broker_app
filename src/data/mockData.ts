import type {
  User,
  OwnerProfile,
  DriverProfile,
  Vehicle,
  Load,
  Bid,
  Trip,
  EBilty,
  PaymentRecord,
  Dispute,
  AuditLog,
  AppNotification
} from '../types';
import { PAKISTAN_CITIES, generateRouteWaypoints } from './pakistanLocations';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_shipper_1',
    name: 'Muhammad Bilal',
    companyName: 'Al-Karam Textile Mills Ltd',
    phone: '+92 300 8492011',
    email: 'logistics@alkaramtextiles.pk',
    role: 'shipper',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '35202-8491029-3',
    rating: 4.9,
    totalTrips: 142,
    createdAt: '2025-01-15'
  },
  {
    id: 'usr_shipper_2',
    name: 'Syed Tariq Hassan',
    companyName: 'Indus Agro Products',
    phone: '+92 321 4455667',
    email: 'supply@indusagro.pk',
    role: 'shipper',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '36302-1192847-1',
    rating: 4.7,
    totalTrips: 58,
    createdAt: '2025-03-10'
  },
  {
    id: 'usr_owner_1',
    name: 'Haji Noor Muhammad',
    companyName: 'Pak Freight Corridors (Pvt) Ltd',
    phone: '+92 333 5551234',
    email: 'fleet@pakfreight.com.pk',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '42101-7788991-5',
    rating: 4.85,
    totalTrips: 310,
    createdAt: '2024-11-20'
  },
  {
    id: 'usr_owner_2',
    name: 'Chaudhry Arshad',
    companyName: 'Al-Madina Cargo Lines',
    phone: '+92 301 7766554',
    email: 'arshad@almadinacargo.pk',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '33100-4455667-9',
    rating: 4.6,
    totalTrips: 94,
    createdAt: '2025-02-01'
  },
  {
    id: 'usr_driver_1',
    name: 'Muhammad Aslam Khan',
    phone: '+92 345 6789012',
    email: 'aslam.driver@pakfreight.com',
    role: 'driver',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '38403-9988112-7',
    rating: 4.92,
    totalTrips: 184,
    createdAt: '2024-12-05'
  },
  {
    id: 'usr_driver_2',
    name: 'Rashid Mehmood',
    phone: '+92 312 9988776',
    email: 'rashid.driver@almadina.pk',
    role: 'driver',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '35404-5544332-1',
    rating: 4.75,
    totalTrips: 76,
    createdAt: '2025-01-28'
  },
  {
    id: 'usr_admin_1',
    name: 'E-Broker Command Desk',
    phone: '+92 21 111 327 653',
    email: 'ops@ebroker.pk',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '42201-9988776-3',
    rating: 5.0,
    totalTrips: 0,
    createdAt: '2024-01-01'
  }
];

export const INITIAL_OWNER_PROFILES: Record<string, OwnerProfile> = {
  'usr_owner_1': {
    ...INITIAL_USERS[2],
    role: 'owner',
    fleetSize: 8,
    walletBalance: 420000,
    pendingEscrowBalance: 185000,
    bankAccount: {
      bankName: 'Meezan Bank Ltd',
      accountTitle: 'Pak Freight Corridors Pvt Ltd',
      iban: 'PK45MEZN0001234567890101'
    },
    commissionRate: 0.05
  },
  'usr_owner_2': {
    ...INITIAL_USERS[3],
    role: 'owner',
    fleetSize: 4,
    walletBalance: 155000,
    pendingEscrowBalance: 95000,
    bankAccount: {
      bankName: 'Habib Bank Limited (HBL)',
      accountTitle: 'Al-Madina Cargo Lines',
      iban: 'PK12HABB0009876543210202'
    },
    commissionRate: 0.05
  }
};

export const INITIAL_DRIVERS: DriverProfile[] = [
  {
    ...INITIAL_USERS[4],
    role: 'driver',
    ownerId: 'usr_owner_1',
    ownerName: 'Haji Noor Muhammad (Pak Freight Corridors)',
    licenseNumber: 'LHR-HTV-2018-9481',
    licenseCategory: 'HTV',
    licenseExpiry: '2028-09-15',
    emergencyContact: '+92 300 1234567 (Brother)',
    assignedVehicleId: 'veh_1',
    currentTripId: 'trp_101',
    onTimeRate: 98.4
  },
  {
    ...INITIAL_USERS[5],
    role: 'driver',
    ownerId: 'usr_owner_2',
    ownerName: 'Chaudhry Arshad (Al-Madina Cargo)',
    licenseNumber: 'FSD-HTV-2020-1123',
    licenseCategory: 'HTV',
    licenseExpiry: '2029-04-20',
    emergencyContact: '+92 321 9876543 (Cousin)',
    assignedVehicleId: 'veh_3',
    onTimeRate: 96.2
  },
  {
    id: 'usr_driver_3',
    name: 'Zubair Shah',
    phone: '+92 333 4455889',
    email: 'zubair.driver@pakfreight.com',
    role: 'driver',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    kycStatus: 'verified',
    cnic: '37201-1122334-5',
    rating: 4.8,
    totalTrips: 92,
    ownerId: 'usr_owner_1',
    ownerName: 'Pak Freight Corridors',
    licenseNumber: 'RAW-HTV-2019-7711',
    licenseCategory: 'HTV',
    licenseExpiry: '2027-11-30',
    emergencyContact: '+92 334 5566778',
    assignedVehicleId: 'veh_2',
    onTimeRate: 97.5,
    createdAt: '2025-01-10'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_1',
    registrationNumber: 'KHI-TL-8492',
    vehicleType: '22-Wheeler Trailer',
    bodyType: 'Flatbed',
    makeModel: 'Sinotruk HOWO A7 Prime Mover (420HP)',
    year: 2022,
    chassisNumber: 'ZZ4257V3247N1-892019',
    engineNumber: 'D12.42-50-2022849',
    tyreCount: 22,
    capacityTons: 40,
    dimensionsFeet: { length: 45, width: 8.5, height: 9.5 },
    ownerId: 'usr_owner_1',
    ownerName: 'Haji Noor Muhammad',
    currentDriverId: 'usr_driver_1',
    currentDriverName: 'Muhammad Aslam Khan',
    currentDriverPhone: '+92 345 6789012',
    availability: 'on_trip',
    rating: 4.9,
    totalTrips: 124,
    onTimePercentage: 99.1,
    odometerKm: 148500,
    fuelType: 'Diesel',
    documents: {
      registrationDoc: 'REG-KHI-8492-C.pdf',
      fitnessCertExpiry: '2027-08-30',
      routePermitExpiry: '2027-12-31',
      insuranceExpiry: '2027-05-15',
      tokenTaxExpiry: '2027-06-30',
      trackerId: 'TRK-PK-89201 (TPL Trakker)',
      isVerified: true
    },
    documentRecords: [
      {
        documentType: 'Route Permit',
        documentTypeUr: 'روٹ پرمٹ (آل پاکستان)',
        issuingAuthority: 'Provincial Transport Authority (PTA)',
        documentNumber: 'PTA-RP-2024-88912',
        issueDate: '2024-01-01',
        expiryDate: '2027-12-31',
        status: 'valid',
        costPkr: 18500
      },
      {
        documentType: 'Fitness Certificate',
        documentTypeUr: 'گاڑی فٹنس سرٹیفکیٹ',
        issuingAuthority: 'Motor Vehicle Examiner (MVE Karachi)',
        documentNumber: 'MVE-KHI-94021',
        issueDate: '2024-08-30',
        expiryDate: '2027-08-30',
        status: 'valid',
        costPkr: 6500
      },
      {
        documentType: 'Token Tax',
        documentTypeUr: 'ایکسائز ٹوکن ٹیکس رسید',
        issuingAuthority: 'Excise & Taxation Department Sindh',
        documentNumber: 'ETD-TT-2024-5542',
        issueDate: '2024-07-01',
        expiryDate: '2027-06-30',
        status: 'valid',
        costPkr: 24000
      },
      {
        documentType: 'Commercial Insurance',
        documentTypeUr: 'کمرشل گاڑی انشورنس',
        issuingAuthority: 'EFU General Insurance Pakistan',
        documentNumber: 'EFU-CV-8892019',
        issueDate: '2024-05-15',
        expiryDate: '2027-05-15',
        status: 'valid',
        costPkr: 45000
      }
    ],
    expenses: [
      {
        id: 'exp_101',
        vehicleId: 'veh_1',
        tripId: 'trp_101',
        tripRoute: 'Karachi Port ➔ Faisalabad',
        date: '2026-08-19',
        category: 'diesel',
        categoryUr: 'ڈیزل فیول',
        amountPkr: 125325,
        dieselLiters: 450,
        dieselRatePerLiter: 278.5,
        description: '450L High Speed Diesel (PSO Sukkur Bypass Station)',
        receiptNumber: 'PSO-SKR-88910',
        addedBy: 'Ustad Aslam Khan (Driver)'
      },
      {
        id: 'exp_102',
        vehicleId: 'veh_1',
        tripId: 'trp_101',
        tripRoute: 'Karachi Port ➔ Faisalabad',
        date: '2026-08-19',
        category: 'toll_tax',
        categoryUr: 'موٹروے و ہائی وے ٹول ٹیکس',
        amountPkr: 8400,
        description: 'M-5 Sukkur-Multan & M-4 Gojra Motorway Toll Plazas',
        receiptNumber: 'NHA-M5-0921',
        addedBy: 'Ustad Aslam Khan (Driver)'
      },
      {
        id: 'exp_103',
        vehicleId: 'veh_1',
        tripId: 'trp_101',
        tripRoute: 'Karachi Port ➔ Faisalabad',
        date: '2026-08-18',
        category: 'loading_mazdoori',
        categoryUr: 'پلیداری و لوڈنگ مزدوری',
        amountPkr: 6500,
        description: 'Export Fabric Rolls Loading Labor (Keamari Terminal Karachi)',
        receiptNumber: 'KPT-LB-192',
        addedBy: 'Haji Noor Muhammad (Owner)'
      },
      {
        id: 'exp_104',
        vehicleId: 'veh_1',
        tripId: 'trp_101',
        tripRoute: 'Karachi Port ➔ Faisalabad',
        date: '2026-08-19',
        category: 'kanta_weighbridge',
        categoryUr: 'وزن کنڈہ فیس',
        amountPkr: 1200,
        description: 'Computerized Axle Weighbridge Passing Receipt (M-5 Entry)',
        receiptNumber: 'KNT-09281',
        addedBy: 'Ustad Aslam Khan (Driver)'
      },
      {
        id: 'exp_105',
        vehicleId: 'veh_1',
        tripId: 'trp_101',
        tripRoute: 'Karachi Port ➔ Faisalabad',
        date: '2026-08-18',
        category: 'driver_bhatta',
        categoryUr: 'ڈرائیور کھانا و بھتہ',
        amountPkr: 12000,
        description: 'Driver & Helper Trip Allowance (Karachi to Faisalabad)',
        receiptNumber: 'BHT-8821',
        addedBy: 'Haji Noor Muhammad (Owner)'
      }
    ],
    maintenanceLogs: [
      {
        id: 'mnt_101',
        vehicleId: 'veh_1',
        date: '2026-07-28',
        odometerKm: 142000,
        serviceType: 'mobil_oil_filter',
        serviceTypeUr: 'موبل آئل اور آئل فلٹر تبدیلی',
        costPkr: 28500,
        workshopName: 'Al-Haram Diesel Workshop',
        workshopCity: 'Badami Bagh, Lahore',
        nextDueKm: 152000,
        partsReplaced: 'Caltex Delo 400 Gold 20W-50 (28 Liters) + 2x Fleetguard Filters',
        notes: 'Engine oil pressure tested 4.2 Bar. Oil and diesel filters replaced.'
      },
      {
        id: 'mnt_102',
        vehicleId: 'veh_1',
        date: '2026-06-15',
        odometerKm: 135000,
        serviceType: 'tyre_change',
        serviceTypeUr: 'نئے ٹائروں کی تبدیلی',
        costPkr: 184000,
        workshopName: 'Bismillah Tyre Corporation',
        workshopCity: 'Mauripur Road, Karachi',
        tyreBrand: 'General Tyre Super Lug 11.00R20 (16 PR)',
        tyrePosition: 'Drive Axle',
        notes: 'Replaced 4 rear drive axle tyres with brand new radial tyres.'
      },
      {
        id: 'mnt_103',
        vehicleId: 'veh_1',
        date: '2026-05-10',
        odometerKm: 128000,
        serviceType: 'brake_kamani',
        serviceTypeUr: 'کمانی پٹے اور بریک لیدر سروس',
        costPkr: 16500,
        workshopName: 'Ustad Sharif Kamani Maker',
        workshopCity: 'Multan Bypass',
        partsReplaced: 'Rear axle kamani center bolt + 8x Brake Linings',
        notes: 'Rear suspension overhauled after long haul trip.'
      }
    ],
    photo: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
    currentLocation: {
      city: 'Sukkur (N-5 Corridor)',
      lat: 27.7052,
      lng: 68.8574
    }
  },
  {
    id: 'veh_2',
    registrationNumber: 'LES-19-4820',
    vehicleType: 'Container 40ft',
    bodyType: 'Closed Container',
    makeModel: 'Hino 500 Series Prime Mover',
    year: 2021,
    chassisNumber: 'FM1JNKA-194820',
    engineNumber: 'J08E-TT-492019',
    tyreCount: 10,
    capacityTons: 32,
    dimensionsFeet: { length: 40, width: 8.2, height: 9.5 },
    ownerId: 'usr_owner_1',
    ownerName: 'Haji Noor Muhammad',
    currentDriverId: 'usr_driver_3',
    currentDriverName: 'Zubair Shah',
    currentDriverPhone: '+92 334 5566778',
    availability: 'available',
    rating: 4.8,
    totalTrips: 98,
    onTimePercentage: 97.8,
    odometerKm: 182000,
    fuelType: 'Diesel',
    documents: {
      registrationDoc: 'REG-LES-4820.pdf',
      fitnessCertExpiry: '2027-06-15',
      routePermitExpiry: '2027-10-10',
      insuranceExpiry: '2027-03-22',
      tokenTaxExpiry: '2027-06-30',
      trackerId: 'TRK-PK-48201',
      isVerified: true
    },
    documentRecords: [
      {
        documentType: 'Route Permit',
        documentTypeUr: 'روٹ پرمٹ (پنجاب و سندھ)',
        issuingAuthority: 'PTA Punjab',
        documentNumber: 'PTA-LHR-2023-4412',
        issueDate: '2023-10-10',
        expiryDate: '2027-10-10',
        status: 'valid',
        costPkr: 16000
      },
      {
        documentType: 'Fitness Certificate',
        documentTypeUr: 'فٹنس سرٹیفکیٹ',
        issuingAuthority: 'MVE Lahore',
        documentNumber: 'MVE-LHR-55102',
        issueDate: '2024-06-15',
        expiryDate: '2027-06-15',
        status: 'valid',
        costPkr: 6000
      }
    ],
    expenses: [
      {
        id: 'exp_201',
        vehicleId: 'veh_2',
        tripRoute: 'Lahore ➔ Multan',
        date: '2026-08-10',
        category: 'diesel',
        categoryUr: 'ڈیزل فیول',
        amountPkr: 58500,
        dieselLiters: 210,
        dieselRatePerLiter: 278.5,
        description: '210L Diesel at Shell M-3 Motorway Service Area',
        receiptNumber: 'SHL-M3-441',
        addedBy: 'Zubair Shah'
      }
    ],
    maintenanceLogs: [
      {
        id: 'mnt_201',
        vehicleId: 'veh_2',
        date: '2026-08-01',
        odometerKm: 180000,
        serviceType: 'mobil_oil_filter',
        serviceTypeUr: 'موبل آئل فلٹر سروس',
        costPkr: 24000,
        workshopName: 'Hino 3S Master Workshop',
        workshopCity: 'Multan Road, Lahore',
        nextDueKm: 190000,
        notes: 'Genuine Hino oil and fuel filters changed.'
      }
    ],
    photo: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&auto=format&fit=crop&q=80',
    currentLocation: {
      city: 'Lahore (Mughalpura Dry Port)',
      lat: 31.5204,
      lng: 74.3587
    }
  },
  {
    id: 'veh_3',
    registrationNumber: 'FDA-22-3901',
    vehicleType: '10-Wheeler Rigid',
    bodyType: 'Open Body',
    makeModel: 'Isuzu FVR 900 (Heavy Duty)',
    year: 2023,
    chassisNumber: 'FVR34P-390192',
    engineNumber: '6HK1-TC-99201',
    tyreCount: 10,
    capacityTons: 18,
    dimensionsFeet: { length: 24, width: 8.0, height: 7.5 },
    ownerId: 'usr_owner_2',
    ownerName: 'Chaudhry Arshad',
    currentDriverId: 'usr_driver_2',
    currentDriverName: 'Rashid Mehmood',
    currentDriverPhone: '+92 312 9988776',
    availability: 'available',
    rating: 4.7,
    totalTrips: 62,
    onTimePercentage: 96.5,
    odometerKm: 76000,
    fuelType: 'Diesel',
    documents: {
      registrationDoc: 'REG-FDA-3901.pdf',
      fitnessCertExpiry: '2027-09-01',
      routePermitExpiry: '2027-11-25',
      insuranceExpiry: '2027-07-18',
      tokenTaxExpiry: '2027-06-30',
      trackerId: 'TRK-PK-39011',
      isVerified: true
    },
    documentRecords: [
      {
        documentType: 'Route Permit',
        documentTypeUr: 'روٹ پرمٹ',
        issuingAuthority: 'PTA Faisalabad',
        documentNumber: 'PTA-FSD-9912',
        issueDate: '2023-11-25',
        expiryDate: '2027-11-25',
        status: 'valid',
        costPkr: 14000
      }
    ],
    expenses: [],
    maintenanceLogs: [],
    photo: 'https://images.unsplash.com/photo-1586191582056-a60d845e2c56?w=600&auto=format&fit=crop&q=80',
    currentLocation: {
      city: 'Faisalabad (M-3 Industrial City)',
      lat: 31.4504,
      lng: 73.1350
    }
  },
  {
    id: 'veh_4',
    registrationNumber: 'MUL-21-9988',
    vehicleType: 'Reefer (Cold Chain)',
    bodyType: 'Reefer Box',
    makeModel: 'Hino Dutro ThermoKing Reefer',
    year: 2022,
    chassisNumber: 'XZU710R-998812',
    engineNumber: 'N04C-VT-449102',
    tyreCount: 6,
    capacityTons: 12,
    dimensionsFeet: { length: 20, width: 7.5, height: 7.5 },
    ownerId: 'usr_owner_2',
    ownerName: 'Chaudhry Arshad',
    currentDriverName: 'Rashid Mehmood',
    currentDriverPhone: '+92 312 9988776',
    availability: 'available',
    rating: 4.95,
    totalTrips: 45,
    onTimePercentage: 99.0,
    odometerKm: 59000,
    fuelType: 'Diesel',
    documents: {
      registrationDoc: 'REG-MUL-9988.pdf',
      fitnessCertExpiry: '2028-01-10',
      routePermitExpiry: '2028-04-15',
      insuranceExpiry: '2027-12-05',
      tokenTaxExpiry: '2027-06-30',
      trackerId: 'TRK-PK-99881',
      isVerified: true
    },
    documentRecords: [
      {
        documentType: 'Route Permit',
        documentTypeUr: 'روٹ پرمٹ',
        issuingAuthority: 'PTA Multan',
        documentNumber: 'PTA-MUL-9988',
        issueDate: '2024-04-15',
        expiryDate: '2028-04-15',
        status: 'valid',
        costPkr: 12000
      }
    ],
    expenses: [],
    maintenanceLogs: [],
    photo: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&auto=format&fit=crop&q=80',
    currentLocation: {
      city: 'Multan (Vehari Cold Hub)',
      lat: 30.1575,
      lng: 71.5249
    }
  }
];

export const INITIAL_LOADS: Load[] = [
  {
    id: 'lod_101',
    loadNumber: 'LOD-2026-9081',
    shipperId: 'usr_shipper_1',
    shipperName: 'Muhammad Bilal (Al-Karam Textiles)',
    shipperPhone: '+92 300 8492011',
    shipperRating: 4.9,
    originCity: 'Faisalabad',
    originAddress: 'M-3 Industrial City, Plot 84-A Sahianwala',
    originCoords: PAKISTAN_CITIES['Faisalabad'].coords,
    destinationCity: 'Karachi',
    destinationAddress: 'Port Qasim Terminal, DP World Berth 3, Karachi',
    destinationCoords: PAKISTAN_CITIES['Karachi'].coords,
    distanceKm: 1160,
    estimatedHours: 22,
    cargoCategory: 'Textile & Garments',
    cargoDescription: 'Export-grade Finished Denim Fabric rolls in sealed plastic wraps',
    weightTons: 28,
    packagingType: 'Pallets',
    quantityUnits: 480,
    isFragile: false,
    requiresReefer: false,
    requiresTarpaulin: true,
    requiredVehicleType: '22-Wheeler Trailer',
    pickupDateTime: '2026-08-21T09:00:00Z',
    deliveryDeadline: '2026-08-23T18:00:00Z',
    offeredPrice: 220000,
    biddingDeadline: '2026-08-20T22:00:00Z',
    autoAssignSingleBid: true,
    specialInstructions: 'Export vessel gate cutoff is Aug 24. Tarpaulin must be double-layered waterproof.',
    status: 'in_transit',
    bidCount: 3,
    winningBidId: 'bid_101_1',
    assignedOwnerId: 'usr_owner_1',
    assignedVehicleId: 'veh_1',
    assignedDriverId: 'usr_driver_1',
    activeTripId: 'trp_101',
    eBiltyNumber: 'EB-PK-2026-1084',
    createdAt: '2026-08-19T08:00:00Z',
    updatedAt: '2026-08-20T06:00:00Z'
  },
  {
    id: 'lod_102',
    loadNumber: 'LOD-2026-9082',
    shipperId: 'usr_shipper_2',
    shipperName: 'Syed Tariq Hassan (Indus Agro)',
    shipperPhone: '+92 321 4455667',
    shipperRating: 4.7,
    originCity: 'Multan',
    originAddress: 'Vehari Road Mango Packing House, Multan',
    originCoords: PAKISTAN_CITIES['Multan'].coords,
    destinationCity: 'Islamabad',
    destinationAddress: 'Rawat Logistics Center, GT Road Corridor',
    destinationCoords: PAKISTAN_CITIES['Islamabad'].coords,
    distanceKm: 540,
    estimatedHours: 8.5,
    cargoCategory: 'Fresh Produce / Fruits (Cold Chain)',
    cargoDescription: 'Premium export Chaunsa Mangoes in wooden crates (Temp maintained @ 11°C)',
    weightTons: 11,
    packagingType: 'Wooden Crates',
    quantityUnits: 1200,
    isFragile: true,
    requiresReefer: true,
    targetTemperatureC: 11,
    requiresTarpaulin: false,
    requiredVehicleType: 'Reefer (Cold Chain)',
    pickupDateTime: '2026-08-21T14:00:00Z',
    deliveryDeadline: '2026-08-22T06:00:00Z',
    offeredPrice: 110000,
    biddingDeadline: '2026-08-20T20:00:00Z',
    autoAssignSingleBid: false,
    specialInstructions: 'Pre-cool cargo container to 11°C before loading. No sudden temperature spikes allowed.',
    status: 'bidding_open',
    bidCount: 2,
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'lod_103',
    loadNumber: 'LOD-2026-9083',
    shipperId: 'usr_shipper_1',
    shipperName: 'Muhammad Bilal (Al-Karam Textiles)',
    shipperPhone: '+92 300 8492011',
    shipperRating: 4.9,
    originCity: 'Karachi',
    originAddress: 'Karachi Port Trust (KPT) West Wharf, Berth 12',
    originCoords: PAKISTAN_CITIES['Karachi'].coords,
    destinationCity: 'Lahore',
    destinationAddress: 'Sundar Industrial Estate, Gate 2, Raiwind Road',
    destinationCoords: PAKISTAN_CITIES['Lahore'].coords,
    distanceKm: 1220,
    estimatedHours: 24,
    cargoCategory: 'Industrial Machinery & Steel',
    cargoDescription: 'Imported Spinning Mill Spindles & Electrical Control Panels',
    weightTons: 30,
    packagingType: 'Wooden Crates',
    quantityUnits: 18,
    isFragile: true,
    requiresReefer: false,
    requiresTarpaulin: true,
    requiredVehicleType: 'Container 40ft',
    pickupDateTime: '2026-08-22T08:00:00Z',
    deliveryDeadline: '2026-08-24T12:00:00Z',
    offeredPrice: 245000,
    biddingDeadline: '2026-08-21T18:00:00Z',
    autoAssignSingleBid: true,
    specialInstructions: 'High value equipment. Certified crane loading required at both ends.',
    status: 'bidding_open',
    bidCount: 1,
    createdAt: '2026-08-20T11:30:00Z',
    updatedAt: '2026-08-20T11:30:00Z'
  }
];

export const INITIAL_BIDS: Bid[] = [
  {
    id: 'bid_101_1',
    loadId: 'lod_101',
    ownerId: 'usr_owner_1',
    ownerName: 'Haji Noor Muhammad (Pak Freight)',
    ownerPhone: '+92 333 5551234',
    ownerRating: 4.85,
    ownerTripsCount: 310,
    vehicleId: 'veh_1',
    vehicleRegNumber: 'KHI-TL-8492',
    vehicleType: '22-Wheeler Trailer',
    vehicleCapacityTons: 40,
    vehicleRating: 4.9,
    proposedDriverId: 'usr_driver_1',
    proposedDriverName: 'Muhammad Aslam Khan',
    bidAmount: 215000,
    estimatedPickupHours: 2,
    notes: 'HOWO prime mover stationed 12km from M-3. Available with heavy waterproof canvas and steel lashings.',
    validUntil: '2026-08-21T06:00:00Z',
    status: 'accepted',
    createdAt: '2026-08-19T10:15:00Z'
  },
  {
    id: 'bid_102_1',
    loadId: 'lod_102',
    ownerId: 'usr_owner_2',
    ownerName: 'Chaudhry Arshad (Al-Madina Cargo)',
    ownerPhone: '+92 301 7766554',
    ownerRating: 4.6,
    ownerTripsCount: 94,
    vehicleId: 'veh_4',
    vehicleRegNumber: 'MUL-21-9988',
    vehicleType: 'Reefer (Cold Chain)',
    vehicleCapacityTons: 12,
    vehicleRating: 4.95,
    bidAmount: 105000,
    estimatedPickupHours: 1.5,
    notes: 'ThermoKing Reefer box calibrated yesterday. Continuous digital datalogger included.',
    validUntil: '2026-08-21T12:00:00Z',
    status: 'pending',
    createdAt: '2026-08-20T10:45:00Z'
  },
  {
    id: 'bid_102_2',
    loadId: 'lod_102',
    ownerId: 'usr_owner_1',
    ownerName: 'Haji Noor Muhammad (Pak Freight)',
    ownerPhone: '+92 333 5551234',
    ownerRating: 4.85,
    ownerTripsCount: 310,
    vehicleId: 'veh_2',
    vehicleRegNumber: 'LES-19-4820',
    vehicleType: 'Container 40ft',
    vehicleCapacityTons: 32,
    vehicleRating: 4.8,
    bidAmount: 112000,
    estimatedPickupHours: 3,
    notes: 'Insulated container ready. Experienced Islamabad cold transport team.',
    validUntil: '2026-08-21T12:00:00Z',
    status: 'pending',
    createdAt: '2026-08-20T11:15:00Z'
  },
  {
    id: 'bid_103_1',
    loadId: 'lod_103',
    ownerId: 'usr_owner_1',
    ownerName: 'Haji Noor Muhammad (Pak Freight)',
    ownerPhone: '+92 333 5551234',
    ownerRating: 4.85,
    ownerTripsCount: 310,
    vehicleId: 'veh_2',
    vehicleRegNumber: 'LES-19-4820',
    vehicleType: 'Container 40ft',
    vehicleCapacityTons: 32,
    vehicleRating: 4.8,
    bidAmount: 238000,
    estimatedPickupHours: 4,
    notes: 'Container trailer with twist locks and transit insurance covered.',
    validUntil: '2026-08-22T06:00:00Z',
    status: 'pending',
    createdAt: '2026-08-20T12:00:00Z'
  }
];

const fsdCoords = PAKISTAN_CITIES['Faisalabad'].coords;
const khiCoords = PAKISTAN_CITIES['Karachi'].coords;
const trip101Waypoints = generateRouteWaypoints(fsdCoords, khiCoords, 25);
const currentSukkurCoords: [number, number] = [27.7052, 68.8574];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trp_101',
    tripNumber: 'TRP-2026-8832',
    loadId: 'lod_101',
    loadNumber: 'LOD-2026-9081',
    assignmentId: 'asg_101',
    shipperId: 'usr_shipper_1',
    shipperName: 'Muhammad Bilal (Al-Karam Textiles)',
    shipperPhone: '+92 300 8492011',
    ownerId: 'usr_owner_1',
    ownerName: 'Haji Noor Muhammad (Pak Freight)',
    ownerPhone: '+92 333 5551234',
    driverId: 'usr_driver_1',
    driverName: 'Muhammad Aslam Khan',
    driverPhone: '+92 345 6789012',
    driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    vehicleId: 'veh_1',
    vehicleRegNumber: 'KHI-TL-8492',
    vehicleType: '22-Wheeler Trailer',
    vehiclePhoto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
    status: 'in_transit',
    originCity: 'Faisalabad',
    originCoords: fsdCoords,
    destinationCity: 'Karachi',
    destinationCoords: khiCoords,
    distanceKm: 1160,
    currentCoords: currentSukkurCoords,
    currentCityProgress: 'Sukkur Bypass (N-5 Highway)',
    progressPercentage: 58,
    currentSpeedKmH: 62,
    lastUpdated: '2026-08-20T13:45:00Z',
    routeWaypoints: trip101Waypoints,
    isDeviated: false,
    hasProlongedStop: false,
    pickupProof: {
      type: 'pickup',
      timestamp: '2026-08-19T14:30:00Z',
      coords: fsdCoords,
      locationName: 'M-3 Industrial City, Sahianwala',
      cargoPhotos: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80'
      ],
      sealPhoto: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
      odometerKm: 147820,
      notes: 'All 480 rolls loaded intact with 2 heavy waterproof tarpaulins tightly secured.'
    },
    eBiltyNumber: 'EB-PK-2026-1084',
    agreedFreightAmount: 215000,
    platformCommission: 10750,
    netCarrierPayout: 204250,
    startedAt: '2026-08-19T15:00:00Z',
    pickupArrivedAt: '2026-08-19T12:45:00Z',
    loadedAt: '2026-08-19T14:30:00Z',
    createdAt: '2026-08-19T11:00:00Z'
  }
];

export const INITIAL_EBILTYS: Record<string, EBilty> = {
  'EB-PK-2026-1084': {
    biltyNumber: 'EB-PK-2026-1084',
    tripId: 'trp_101',
    tripNumber: 'TRP-2026-8832',
    loadNumber: 'LOD-2026-9081',
    issueDate: '2026-08-19T14:30:00Z',
    shipper: {
      name: 'Muhammad Bilal',
      company: 'Al-Karam Textile Mills Ltd',
      ntn: '2849102-7',
      phone: '+92 300 8492011',
      pickupAddress: 'M-3 Industrial City, Plot 84-A Sahianwala',
      city: 'Faisalabad'
    },
    consignee: {
      name: 'Port Qasim Cargo Officer',
      company: 'Orient Shipping & Freight Agency',
      phone: '+92 21 34720011',
      deliveryAddress: 'Port Qasim Terminal, DP World Berth 3',
      city: 'Karachi'
    },
    carrier: {
      ownerName: 'Haji Noor Muhammad',
      company: 'Pak Freight Corridors (Pvt) Ltd',
      phone: '+92 333 5551234',
      vehicleReg: 'KHI-TL-8492',
      vehicleType: '22-Wheeler Trailer',
      driverName: 'Muhammad Aslam Khan',
      driverLicense: 'LHR-HTV-2018-9481',
      driverPhone: '+92 345 6789012'
    },
    cargo: {
      category: 'Textile & Garments',
      description: 'Export-grade Finished Denim Fabric rolls in sealed plastic wraps',
      weightTons: 28,
      packagesCount: 480,
      packagingType: 'Pallets',
      declaredValuePkr: 8500000,
      specialCare: ['Waterproof Tarpaulin Covered', 'Do Not Stack Heavy Steel On Top', 'Export Custom Seal # PK-QASIM-9812']
    },
    financials: {
      freightAmount: 215000,
      taxAmount: 0,
      totalAmount: 215000,
      paymentMode: 'Advance Escrow',
      isPaid: true
    },
    verificationCode: 'VRF-98104-EBPK',
    qrCodeData: 'https://ebroker.pk/verify/EB-PK-2026-1084?hash=a7b8c9d0e1f2'
  }
};

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_101',
    tripId: 'trp_101',
    loadNumber: 'LOD-2026-9081',
    shipperId: 'usr_shipper_1',
    shipperName: 'Al-Karam Textile Mills',
    ownerId: 'usr_owner_1',
    ownerName: 'Pak Freight Corridors',
    grossAmount: 215000,
    commissionPercentage: 5,
    commissionAmount: 10750,
    netPayoutAmount: 204250,
    paymentMethod: 'Platform Escrow',
    status: 'held_in_escrow',
    invoiceNumber: 'INV-2026-0819',
    paidAt: '2026-08-19T11:05:00Z',
    createdAt: '2026-08-19T11:00:00Z'
  },
  {
    id: 'pay_100',
    tripId: 'trp_100_prev',
    loadNumber: 'LOD-2026-9040',
    shipperId: 'usr_shipper_2',
    shipperName: 'Indus Agro Products',
    ownerId: 'usr_owner_1',
    ownerName: 'Pak Freight Corridors',
    grossAmount: 180000,
    commissionPercentage: 5,
    commissionAmount: 9000,
    netPayoutAmount: 171000,
    paymentMethod: 'Bank Transfer',
    status: 'released_to_wallet',
    invoiceNumber: 'INV-2026-0810',
    paidAt: '2026-08-15T09:00:00Z',
    settledAt: '2026-08-17T16:00:00Z',
    createdAt: '2026-08-15T09:00:00Z'
  }
];

export const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'dsp_101',
    tripId: 'trp_099',
    loadNumber: 'LOD-2026-8992',
    raisedById: 'usr_shipper_2',
    raisedByName: 'Syed Tariq Hassan (Indus Agro)',
    raisedByRole: 'shipper',
    defendantId: 'usr_owner_2',
    defendantName: 'Chaudhry Arshad (Al-Madina Cargo)',
    defendantRole: 'owner',
    category: 'Cargo Damaged',
    description: 'During offloading at Rawat hub, 4 cartons of citrus concentrate were punctured due to loose securing hooks.',
    evidencePhotos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
    ],
    status: 'under_review',
    heldAmount: 45000,
    createdAt: '2026-08-18T14:20:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    timestamp: '2026-08-19T08:00:00Z',
    actorId: 'usr_shipper_1',
    actorName: 'Muhammad Bilal',
    actorRole: 'shipper',
    action: 'POST_LOAD',
    entityType: 'Load',
    entityId: 'lod_101',
    details: 'Created load LOD-2026-9081 (Faisalabad -> Karachi, 28 Tons Denim)'
  },
  {
    id: 'aud_2',
    timestamp: '2026-08-19T10:15:00Z',
    actorId: 'usr_owner_1',
    actorName: 'Haji Noor Muhammad',
    actorRole: 'owner',
    action: 'SUBMIT_BID',
    entityType: 'Bid',
    entityId: 'bid_101_1',
    details: 'Submitted bid of PKR 215,000 with vehicle KHI-TL-8492'
  },
  {
    id: 'aud_3',
    timestamp: '2026-08-19T11:00:00Z',
    actorId: 'usr_shipper_1',
    actorName: 'Muhammad Bilal',
    actorRole: 'shipper',
    action: 'ACCEPT_BID',
    entityType: 'Assignment',
    entityId: 'asg_101',
    details: 'Accepted bid from Pak Freight Corridors (PKR 215,000) & funded Escrow'
  },
  {
    id: 'aud_4',
    timestamp: '2026-08-19T14:30:00Z',
    actorId: 'usr_driver_1',
    actorName: 'Muhammad Aslam Khan',
    actorRole: 'driver',
    action: 'UPLOAD_PICKUP_PROOF',
    entityType: 'Trip',
    entityId: 'trp_101',
    details: 'Uploaded loaded container photos & odometer (147,820 km). Generated E-Bilty EB-PK-2026-1084'
  },
  {
    id: 'aud_5',
    timestamp: '2026-08-19T15:00:00Z',
    actorId: 'usr_driver_1',
    actorName: 'Muhammad Aslam Khan',
    actorRole: 'driver',
    action: 'START_TRANSIT',
    entityType: 'Trip',
    entityId: 'trp_101',
    details: 'Departed Faisalabad M-3 toward Port Qasim Karachi via N-5'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    recipientId: 'usr_shipper_1',
    title: 'Trip in Transit: Sukkur Checkpoint',
    message: 'Driver Muhammad Aslam reached Sukkur Bypass. Speed: 62 km/h. ETA to Port Qasim: 10 hrs.',
    timestamp: '10 mins ago',
    type: 'trip',
    isRead: false
  },
  {
    id: 'notif_2',
    recipientId: 'usr_owner_1',
    title: 'Escrow Payment Locked',
    message: 'PKR 215,000 locked in escrow for Load LOD-2026-9081.',
    timestamp: '1 day ago',
    type: 'payment',
    isRead: true
  },
  {
    id: 'notif_3',
    recipientId: 'usr_shipper_2',
    title: '2 New Bids on Multan Mango Load',
    message: 'Al-Madina Cargo and Pak Freight submitted bids starting at PKR 105,000.',
    timestamp: '3 hours ago',
    type: 'bid',
    isRead: false
  }
];
