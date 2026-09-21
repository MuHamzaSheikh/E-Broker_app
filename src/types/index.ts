export type UserRole = 'shipper' | 'owner' | 'driver' | 'admin';

export type LoadStatus =
  | 'draft'
  | 'published'
  | 'bidding_open'
  | 'bidding_closed'
  | 'accepted_pending_assignment' // Shipper accepted bid, waiting for owner to assign vehicle & driver
  | 'assigned'
  | 'driver_assigned'
  | 'en_route_pickup'
  | 'arrived_pickup'
  | 'loading'
  | 'loaded' // Pickup Confirmed
  | 'in_transit'
  | 'arrived_destination'
  | 'unloading'
  | 'delivered'
  | 'payment_pending'
  | 'settled'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type VehicleAvailability =
  | 'available'
  | 'reserved'
  | 'on_trip'
  | 'under_maintenance'
  | 'inactive'
  | 'documents_expired';

export type VehicleType =
  | 'Flatbed'
  | 'Container 20ft'
  | 'Container 40ft'
  | 'Mazda / Light Truck'
  | 'Shehzore Pickup'
  | 'Bedford Truck'
  | '10-Wheeler Rigid'
  | '22-Wheeler Trailer'
  | 'Reefer (Cold Chain)'
  | 'Tanker (Liquid / Fuel)';

export type CargoCategory =
  | 'Textile & Garments'
  | 'Agricultural & Grain'
  | 'Fresh Produce / Fruits (Cold Chain)'
  | 'Industrial Machinery & Steel'
  | 'FMCG / Packaged Goods'
  | 'Chemicals & Fertilizer'
  | 'Construction Material & Cement'
  | 'Automotive Parts'
  | 'General Cargo';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  isVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'resubmit';
  cnic: string;
  companyName?: string;
  rating: number;
  totalTrips: number;
  createdAt: string;
}

export interface ShipperProfile extends User {
  businessType: 'Corporate' | 'Trader' | 'Individual' | 'Factory / Mill';
  ntnNumber?: string;
  creditLimit?: number;
  savedAddresses: Array<{
    id: string;
    label: string;
    city: string;
    address: string;
    contactPerson: string;
    contactPhone: string;
  }>;
}

export interface OwnerProfile extends User {
  fleetSize: number;
  walletBalance: number;
  pendingEscrowBalance: number;
  bankAccount: {
    bankName: string;
    accountTitle: string;
    iban: string;
  };
  commissionRate: number; // e.g. 0.05 (5%)
}

export interface DriverProfile extends User {
  ownerId: string;
  ownerName: string;
  licenseNumber: string;
  licenseCategory: 'LTV' | 'HTV' | 'PSV';
  licenseExpiry: string;
  emergencyContact: string;
  assignedVehicleId?: string;
  currentTripId?: string;
  onTimeRate: number; // e.g. 98.5%
}

export type ExpenseCategory =
  | 'diesel'
  | 'toll_tax'
  | 'driver_bhatta'
  | 'loading_mazdoori'
  | 'kanta_weighbridge'
  | 'maintenance'
  | 'tyre_replacement'
  | 'challan_fine'
  | 'oil_change'
  | 'other';

export interface VehicleExpenseEntry {
  id: string;
  vehicleId: string;
  tripId?: string;
  tripRoute?: string;
  date: string;
  category: ExpenseCategory;
  categoryUr: string;
  amountPkr: number;
  dieselLiters?: number;
  dieselRatePerLiter?: number;
  description: string;
  receiptNumber?: string;
  addedBy: string;
}

export interface VehicleMaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometerKm: number;
  serviceType: 'mobil_oil_filter' | 'tyre_change' | 'brake_kamani' | 'engine_overhaul' | 'electrical_battery' | 'general_tuneup';
  serviceTypeUr: string;
  costPkr: number;
  workshopName: string;
  workshopCity: string;
  nextDueKm?: number;
  partsReplaced?: string;
  tyreBrand?: string;
  tyrePosition?: 'Front Axle' | 'Drive Axle' | 'Trailer Axle (Left)' | 'Trailer Axle (Right)';
  notes: string;
}

export interface VehicleDocumentRecord {
  documentType: 'Fitness Certificate' | 'Route Permit' | 'Token Tax' | 'Commercial Insurance' | 'Tracker Subscription';
  documentTypeUr: string;
  issuingAuthority: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  costPkr: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. "KHI-1829" or "LES-9921"
  vehicleType: VehicleType;
  bodyType: 'Open Body' | 'Closed Container' | 'Flatbed' | 'Curtain Side' | 'Reefer Box';
  makeModel: string; // e.g. "Hino 500 Series (2022)"
  year: number;
  chassisNumber: string; // فریم نمبر
  engineNumber: string; // انجن نمبر
  tyreCount: number; // e.g. 22, 10, 6
  capacityTons: number;
  dimensionsFeet: {
    length: number;
    width: number;
    height: number;
  };
  ownerId: string;
  ownerName: string;
  currentDriverId?: string;
  currentDriverName?: string;
  currentDriverPhone?: string;
  availability: VehicleAvailability;
  rating: number;
  totalTrips: number;
  onTimePercentage: number;
  odometerKm: number;
  fuelType: 'Diesel' | 'CNG' | 'Hybrid';
  documents: {
    registrationDoc: string;
    fitnessCertExpiry: string;
    routePermitExpiry: string;
    insuranceExpiry: string;
    tokenTaxExpiry: string;
    trackerId: string;
    isVerified: boolean;
  };
  documentRecords: VehicleDocumentRecord[];
  expenses: VehicleExpenseEntry[];
  maintenanceLogs: VehicleMaintenanceRecord[];
  photo: string;
  currentLocation?: {
    city: string;
    lat: number;
    lng: number;
  };
}

export interface LocationCheckpoint {
  city: string;
  lat: number;
  lng: number;
  address: string;
}

export interface Load {
  id: string;
  loadNumber: string; // e.g. "LOD-2026-1049"
  shipperId: string;
  shipperName: string;
  shipperPhone: string;
  shipperRating: number;
  
  // Route
  originCity: string;
  originAddress: string;
  originCoords: [number, number]; // [lat, lng]
  destinationCity: string;
  destinationAddress: string;
  destinationCoords: [number, number]; // [lat, lng]
  distanceKm: number;
  estimatedHours: number;

  // Cargo Specs
  cargoCategory: CargoCategory;
  cargoDescription: string;
  weightTons: number;
  packagingType: 'Pallets' | 'Bags / Sacks' | 'Wooden Crates' | 'Loose / Bulk' | 'Cartons' | 'Drums';
  quantityUnits: number;
  isFragile: boolean;
  requiresReefer: boolean;
  targetTemperatureC?: number;
  requiresTarpaulin: boolean;

  // Requirements & Pricing
  requiredVehicleType: VehicleType;
  pickupDateTime: string;
  deliveryDeadline: string;
  offeredPrice: number; // PKR
  biddingDeadline: string;
  autoAssignSingleBid: boolean;
  specialInstructions?: string;

  // Status & Counts
  status: LoadStatus;
  bidCount: number;
  winningBidId?: string;
  assignedOwnerId?: string;
  assignedVehicleId?: string;
  assignedDriverId?: string;
  activeTripId?: string;
  eBiltyNumber?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  loadId: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  ownerTripsCount: number;
  
  vehicleId: string;
  vehicleRegNumber: string;
  vehicleType: VehicleType;
  vehicleCapacityTons: number;
  vehicleRating: number;
  
  proposedDriverId?: string;
  proposedDriverName?: string;

  bidAmount: number; // PKR
  estimatedPickupHours: number; // hours until arrival at pickup
  notes?: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'outbid';
  createdAt: string;
}

export interface TripProof {
  type: 'pickup' | 'delivery';
  timestamp: string;
  coords: [number, number];
  locationName: string;
  cargoPhotos: string[];
  sealPhoto?: string;
  vehiclePhoto?: string;
  odometerKm?: number;
  receiverName?: string;
  receiverPhone?: string;
  receiverSignatureUrl?: string;
  receiverOtp?: string;
  damageNotes?: string;
  notes?: string;
}

export interface Trip {
  id: string;
  tripNumber: string; // e.g. "TRP-2026-8832"
  loadId: string;
  loadNumber: string;
  assignmentId: string;
  
  shipperId: string;
  shipperName: string;
  shipperPhone: string;
  
  ownerId: string;
  ownerName: string;
  ownerPhone: string;

  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;

  vehicleId: string;
  vehicleRegNumber: string;
  vehicleType: VehicleType;
  vehiclePhoto: string;

  status: LoadStatus;

  // Route & Coordinates
  originCity: string;
  originCoords: [number, number];
  destinationCity: string;
  destinationCoords: [number, number];
  distanceKm: number;
  
  // Real-time tracking
  currentCoords: [number, number];
  currentCityProgress: string;
  progressPercentage: number;
  currentSpeedKmH: number;
  lastUpdated: string;
  routeWaypoints: Array<[number, number]>;
  isDeviated: boolean;
  hasProlongedStop: boolean;

  // Proofs
  pickupProof?: TripProof;
  deliveryProof?: TripProof;

  // Documents & Finances
  eBiltyNumber: string;
  agreedFreightAmount: number;
  platformCommission: number;
  netCarrierPayout: number;

  startedAt?: string;
  pickupArrivedAt?: string;
  loadedAt?: string;
  destinationArrivedAt?: string;
  deliveredAt?: string;
  completedAt?: string;

  createdAt: string;
}

export interface EBilty {
  biltyNumber: string; // e.g. "EB-PK-2026-9041"
  tripId: string;
  tripNumber: string;
  loadNumber: string;
  issueDate: string;
  
  shipper: {
    name: string;
    company: string;
    ntn?: string;
    phone: string;
    pickupAddress: string;
    city: string;
  };
  consignee: {
    name: string;
    company: string;
    phone: string;
    deliveryAddress: string;
    city: string;
  };
  carrier: {
    ownerName: string;
    company: string;
    phone: string;
    vehicleReg: string;
    vehicleType: string;
    driverName: string;
    driverLicense: string;
    driverPhone: string;
  };
  cargo: {
    category: string;
    description: string;
    weightTons: number;
    packagesCount: number;
    packagingType: string;
    declaredValuePkr: number;
    specialCare: string[];
  };
  financials: {
    freightAmount: number;
    taxAmount: number;
    totalAmount: number;
    paymentMode: 'Advance Escrow' | 'On Delivery' | 'Credit Account';
    isPaid: boolean;
  };
  verificationCode: string;
  qrCodeData: string;
}

export interface PaymentRecord {
  id: string;
  tripId: string;
  loadNumber: string;
  shipperId: string;
  shipperName: string;
  ownerId: string;
  ownerName: string;
  grossAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  netPayoutAmount: number;
  paymentMethod: 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Platform Escrow' | 'Corporate Credit';
  status: 'held_in_escrow' | 'released_to_wallet' | 'withdrawn' | 'refunded' | 'disputed';
  invoiceNumber: string;
  paidAt?: string;
  settledAt?: string;
  createdAt: string;
}

export interface RatingReview {
  id: string;
  tripId: string;
  loadNumber: string;
  raterId: string;
  raterName: string;
  raterRole: UserRole;
  targetId: string;
  targetName: string;
  targetType: 'owner' | 'vehicle' | 'shipper' | 'driver';
  score: number; // 1 - 5
  feedbackFactors: string[];
  comment: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  tripId: string;
  loadNumber: string;
  raisedById: string;
  raisedByName: string;
  raisedByRole: UserRole;
  defendantId: string;
  defendantName: string;
  defendantRole: UserRole;
  category: 
    | 'Cargo Damaged'
    | 'Cargo Missing / Shortage'
    | 'Severe Delay'
    | 'Wrong Vehicle Dispatched'
    | 'Unauthorized Cancellation'
    | 'Driver Misconduct'
    | 'Payment / Escrow Dispute';
  description: string;
  evidencePhotos: string[];
  status: 'open' | 'under_review' | 'resolved' | 'dismissed';
  heldAmount: number;
  resolutionDecision?: string;
  refundAmount?: number;
  penaltyAmount?: number;
  resolvedAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'Load' | 'Bid' | 'Assignment' | 'Trip' | 'Payment' | 'KYC' | 'Dispute';
  entityId: string;
  details: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'bid' | 'assignment' | 'trip' | 'payment' | 'system' | 'dispute';
  isRead: boolean;
  linkAction?: string;
}
