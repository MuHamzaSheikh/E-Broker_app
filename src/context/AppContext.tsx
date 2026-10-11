import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  UserRole,
  DriverProfile,
  Vehicle,
  Load,
  Bid,
  Trip,
  TripProof,
  EBilty,
  PaymentRecord,
  RatingReview,
  Dispute,
  AuditLog,
  AppNotification
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_LOADS,
  INITIAL_BIDS,
  INITIAL_TRIPS,
  INITIAL_EBILTYS,
  INITIAL_PAYMENTS,
  INITIAL_DISPUTES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { PAKISTAN_CITIES, calculateRoadDistance, generateRouteWaypoints } from '../data/pakistanLocations';
import { TRANSLATIONS } from '../data/translations';
import type { Language } from '../data/translations';
import { speakText, stopSpeech, setAudioMuted } from '../utils/audioSpeech';

interface AppContextType {
  // Auth & Session
  isAuthenticated: boolean;
  login: (phone: string, role: UserRole, otp?: string) => boolean;
  signup: (userData: { name: string; phone: string; role: UserRole; cnic: string; companyName?: string; licenseNumber?: string }) => User;
  logout: () => void;
  switchDemoAccount: (role: UserRole) => void;

  // Current session & role
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  setCurrentUserById: (userId: string) => void;
  allUsers: User[];

  // Language & Accessibility
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof TRANSLATIONS['en'];
  playVoiceHelp: (text: string) => void;
  stopVoice: () => void;
  isVoiceMuted: boolean;
  toggleVoiceMute: () => void;

  // Theme & Appearance
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Entities
  loads: Load[];
  bids: Bid[];
  vehicles: Vehicle[];
  drivers: DriverProfile[];
  trips: Trip[];
  ebiltys: Record<string, EBilty>;
  payments: PaymentRecord[];
  disputes: Dispute[];
  auditLogs: AuditLog[];
  notifications: AppNotification[];

  // Actions - Loads & Marketplace
  createLoad: (loadData: Partial<Load>) => Load;
  submitBid: (bidData: { loadId: string; vehicleId: string; bidAmount: number; estimatedPickupHours: number; notes?: string }) => Bid;
  acceptBid: (bidId: string) => void;
  assignFleetToAcceptedLoad: (loadId: string, vehicleId: string, driverId: string) => void;
  cancelLoad: (loadId: string, reason: string) => void;

  // Actions - Fleet & Drivers
  addVehicle: (vehicleData: Partial<Vehicle>) => Vehicle;
  updateVehicleAvailability: (vehicleId: string, availability: Vehicle['availability']) => void;
  addDriver: (driverData: Partial<DriverProfile>) => DriverProfile;
  assignDriverToVehicle: (driverId: string, vehicleId: string) => void;
  unassignDriverFromVehicle: (vehicleId: string) => void;
  assignDriverToTrip: (tripId: string, driverId: string) => void;

  // Actions - Trip Lifecycle State Machine
  arriveAtPickup: (tripId: string) => void;
  submitPickupProof: (tripId: string, proof: TripProof) => void;
  startTransit: (tripId: string) => void;
  simulateGpsProgress: (tripId: string) => void;
  arriveAtDestination: (tripId: string) => void;
  submitDeliveryProof: (tripId: string, proof: TripProof) => void;
  confirmDeliveryAndSettle: (tripId: string) => void;

  // Actions - Financials & Disputes
  withdrawWalletFunds: (ownerId: string, amount: number) => boolean;
  raiseDispute: (data: { tripId: string; category: Dispute['category']; description: string; evidencePhotos: string[] }) => void;
  resolveDispute: (disputeId: string, resolution: string, refundAmount: number) => void;
  submitRating: (data: { tripId: string; targetId: string; targetName: string; targetType: RatingReview['targetType']; score: number; feedbackFactors: string[]; comment: string }) => void;
  markNotificationAsRead: (notificationId: string) => void;
  verifyKYC: (userId: string, approved: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ebroker_auth') === 'true';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('ebroker_lang') as Language) || 'ur'; // Default to Urdu for friendly local UX
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ebroker_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('ebroker_role') as UserRole) || 'shipper';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find((u) => u.role === currentRole) || users[0];
  });

  const [loads, setLoads] = useState<Load[]>(() => {
    const saved = localStorage.getItem('ebroker_loads');
    return saved ? JSON.parse(saved) : INITIAL_LOADS;
  });

  const [bids, setBids] = useState<Bid[]>(() => {
    const saved = localStorage.getItem('ebroker_bids');
    return saved ? JSON.parse(saved) : INITIAL_BIDS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('ebroker_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [drivers, setDrivers] = useState<DriverProfile[]>(() => {
    const saved = localStorage.getItem('ebroker_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('ebroker_trips');
    return saved ? JSON.parse(saved) : INITIAL_TRIPS;
  });

  const [ebiltys, setEbiltys] = useState<Record<string, EBilty>>(() => {
    const saved = localStorage.getItem('ebroker_ebiltys');
    return saved ? JSON.parse(saved) : INITIAL_EBILTYS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('ebroker_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [disputes, setDisputes] = useState<Dispute[]>(() => {
    const saved = localStorage.getItem('ebroker_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ebroker_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('ebroker_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ebroker_auth', isAuthenticated ? 'true' : 'false');
    localStorage.setItem('ebroker_lang', language);
    localStorage.setItem('ebroker_users', JSON.stringify(users));
    localStorage.setItem('ebroker_role', currentRole);
    localStorage.setItem('ebroker_loads', JSON.stringify(loads));
    localStorage.setItem('ebroker_bids', JSON.stringify(bids));
    localStorage.setItem('ebroker_vehicles', JSON.stringify(vehicles));
    localStorage.setItem('ebroker_drivers', JSON.stringify(drivers));
    localStorage.setItem('ebroker_trips', JSON.stringify(trips));
    localStorage.setItem('ebroker_ebiltys', JSON.stringify(ebiltys));
    localStorage.setItem('ebroker_payments', JSON.stringify(payments));
    localStorage.setItem('ebroker_disputes', JSON.stringify(disputes));
    localStorage.setItem('ebroker_audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem('ebroker_notifications', JSON.stringify(notifications));
  }, [isAuthenticated, language, users, currentRole, loads, bids, vehicles, drivers, trips, ebiltys, payments, disputes, auditLogs, notifications]);

  const login = (phone: string, role: UserRole, _otp?: string): boolean => {
    let target = users.find((u) => u.role === role && u.phone === phone);
    if (!target) {
      target = users.find((u) => u.role === role);
    }
    if (target) {
      setCurrentUser(target);
      setCurrentRoleState(target.role);
      setIsAuthenticated(true);
      localStorage.setItem('ebroker_auth', 'true');
      localStorage.setItem('ebroker_role', target.role);
      return true;
    }
    return false;
  };

  const signup = (userData: { name: string; phone: string; role: UserRole; cnic: string; companyName?: string; licenseNumber?: string }): User => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      phone: userData.phone,
      email: `${userData.phone.replace(/[^0-9]/g, '')}@ebroker.pk`,
      role: userData.role,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      isVerified: true,
      kycStatus: 'verified',
      cnic: userData.cnic,
      companyName: userData.companyName,
      rating: 5.0,
      totalTrips: 0,
      createdAt: new Date().toISOString()
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRoleState(newUser.role);
    setIsAuthenticated(true);
    localStorage.setItem('ebroker_auth', 'true');
    localStorage.setItem('ebroker_role', newUser.role);
    return newUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ebroker_auth');
  };

  const switchDemoAccount = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(targetUser);
    setCurrentRoleState(role);
    setIsAuthenticated(true);
    localStorage.setItem('ebroker_auth', 'true');
    localStorage.setItem('ebroker_role', role);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ebroker_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('ebroker_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = TRANSLATIONS[language];

  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(() => {
    return localStorage.getItem('ebroker_voice_muted') === 'true';
  });

  const toggleVoiceMute = () => {
    setIsVoiceMuted((prev) => {
      const next = !prev;
      localStorage.setItem('ebroker_voice_muted', String(next));
      setAudioMuted(next);
      return next;
    });
  };

  const stopVoice = () => {
    stopSpeech();
  };

  const playVoiceHelp = (text: string) => {
    if (isVoiceMuted) return;
    speakText(text, language);
  };

  const setCurrentRole = (newRole: UserRole) => {
    setCurrentRoleState(newRole);
    const targetUser = users.find((u) => u.role === newRole);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const setCurrentUserById = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setCurrentRoleState(target.role);
    }
  };

  const addAudit = (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      entityType,
      entityId,
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (recipientId: string, title: string, message: string, type: AppNotification['type']) => {
    const notif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      recipientId,
      title,
      message,
      timestamp: 'Just now',
      type,
      isRead: false
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 1. Create Load
  const createLoad = (loadData: Partial<Load>): Load => {
    const originCoords = PAKISTAN_CITIES[loadData.originCity || 'Lahore']?.coords || [31.5204, 74.3587];
    const destinationCoords = PAKISTAN_CITIES[loadData.destinationCity || 'Karachi']?.coords || [24.8607, 67.0011];
    const { distanceKm, hours } = calculateRoadDistance(originCoords, destinationCoords);

    const loadId = `lod_${Date.now()}`;
    const newLoad: Load = {
      id: loadId,
      loadNumber: `LOD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      shipperId: currentUser.id,
      shipperName: currentUser.name + (currentUser.companyName ? ` (${currentUser.companyName})` : ''),
      shipperPhone: currentUser.phone,
      shipperRating: currentUser.rating,
      originCity: loadData.originCity || 'Lahore',
      originAddress: loadData.originAddress || `${loadData.originCity} Goods Terminal`,
      originCoords,
      destinationCity: loadData.destinationCity || 'Karachi',
      destinationAddress: loadData.destinationAddress || `${loadData.destinationCity} Logistics Yard`,
      destinationCoords,
      distanceKm,
      estimatedHours: hours,
      cargoCategory: loadData.cargoCategory || 'General Cargo',
      cargoDescription: loadData.cargoDescription || 'Industrial and commercial goods',
      weightTons: loadData.weightTons || 10,
      packagingType: loadData.packagingType || 'Pallets',
      quantityUnits: loadData.quantityUnits || 100,
      isFragile: !!loadData.isFragile,
      requiresReefer: !!loadData.requiresReefer,
      targetTemperatureC: loadData.targetTemperatureC,
      requiresTarpaulin: !!loadData.requiresTarpaulin,
      requiredVehicleType: loadData.requiredVehicleType || '10-Wheeler Rigid',
      pickupDateTime: loadData.pickupDateTime || new Date(Date.now() + 86400000).toISOString(),
      deliveryDeadline: loadData.deliveryDeadline || new Date(Date.now() + 86400000 * 3).toISOString(),
      offeredPrice: loadData.offeredPrice || 150000,
      biddingDeadline: loadData.biddingDeadline || new Date(Date.now() + 43200000).toISOString(),
      autoAssignSingleBid: loadData.autoAssignSingleBid ?? true,
      specialInstructions: loadData.specialInstructions || '',
      status: 'bidding_open',
      bidCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setLoads((prev) => [newLoad, ...prev]);
    addAudit('POST_LOAD', 'Load', newLoad.id, `Created load ${newLoad.loadNumber} (${newLoad.originCity} -> ${newLoad.destinationCity}, ${newLoad.weightTons}T)`);
    
    const owners = users.filter((u) => u.role === 'owner');
    owners.forEach((o) => {
      addNotification(o.id, `New Load: ${newLoad.originCity} -> ${newLoad.destinationCity}`, `${newLoad.weightTons} Tons of ${newLoad.cargoCategory}. Budget: PKR ${newLoad.offeredPrice.toLocaleString()}`, 'bid');
    });

    return newLoad;
  };

  // 2. Submit Bid
  const submitBid = (data: { loadId: string; vehicleId: string; bidAmount: number; estimatedPickupHours: number; notes?: string }): Bid => {
    const load = loads.find((l) => l.id === data.loadId);
    const vehicle = vehicles.find((v) => v.id === data.vehicleId);
    if (!load || !vehicle) throw new Error('Invalid load or vehicle');

    const bidId = `bid_${Date.now()}`;
    const newBid: Bid = {
      id: bidId,
      loadId: load.id,
      ownerId: currentUser.id,
      ownerName: currentUser.name + (currentUser.companyName ? ` (${currentUser.companyName})` : ''),
      ownerPhone: currentUser.phone,
      ownerRating: currentUser.rating,
      ownerTripsCount: currentUser.totalTrips,
      vehicleId: vehicle.id,
      vehicleRegNumber: vehicle.registrationNumber,
      vehicleType: vehicle.vehicleType,
      vehicleCapacityTons: vehicle.capacityTons,
      vehicleRating: vehicle.rating,
      proposedDriverId: vehicle.currentDriverId,
      proposedDriverName: vehicle.currentDriverName,
      bidAmount: data.bidAmount,
      estimatedPickupHours: data.estimatedPickupHours,
      notes: data.notes,
      validUntil: new Date(Date.now() + 86400000).toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setBids((prev) => [newBid, ...prev]);
    
    setLoads((prev) =>
      prev.map((l) => (l.id === load.id ? { ...l, bidCount: l.bidCount + 1, updatedAt: new Date().toISOString() } : l))
    );

    addAudit('SUBMIT_BID', 'Bid', newBid.id, `Submitted bid of PKR ${newBid.bidAmount.toLocaleString()} for Load ${load.loadNumber} using vehicle ${vehicle.registrationNumber}`);
    addNotification(load.shipperId, `New Rate for ${load.loadNumber}`, `${currentUser.name} quoted PKR ${newBid.bidAmount.toLocaleString()} with ${vehicle.vehicleType}`, 'bid');

    if (load.autoAssignSingleBid && load.bidCount === 0) {
      setTimeout(() => {
        acceptBid(newBid.id);
      }, 500);
    }

    return newBid;
  };

  // 3. Accept Bid (Shipper accepts quote, waiting for owner fleet assignment)
  const acceptBid = (bidId: string) => {
    const winningBid = bids.find((b) => b.id === bidId);
    if (!winningBid) return;

    const load = loads.find((l) => l.id === winningBid.loadId);
    if (!load) return;

    setBids((prev) =>
      prev.map((b) => {
        if (b.id === bidId) return { ...b, status: 'accepted' };
        if (b.loadId === load.id) return { ...b, status: 'outbid' };
        return b;
      })
    );

    const commission = winningBid.bidAmount * 0.05;
    const netPayout = winningBid.bidAmount - commission;

    setLoads((prev) =>
      prev.map((l) =>
        l.id === load.id
          ? {
              ...l,
              status: 'accepted_pending_assignment',
              winningBidId: winningBid.id,
              assignedOwnerId: winningBid.ownerId,
              updatedAt: new Date().toISOString()
            }
          : l
      )
    );

    const paymentId = `pay_${Date.now()}`;
    const newPayment: PaymentRecord = {
      id: paymentId,
      tripId: `pending_${load.id}`,
      loadNumber: load.loadNumber,
      shipperId: load.shipperId,
      shipperName: load.shipperName,
      ownerId: winningBid.ownerId,
      ownerName: winningBid.ownerName,
      grossAmount: winningBid.bidAmount,
      commissionPercentage: 5,
      commissionAmount: commission,
      netPayoutAmount: netPayout,
      paymentMethod: 'Platform Escrow',
      status: 'held_in_escrow',
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setPayments((prev) => [newPayment, ...prev]);

    addAudit(
      'ACCEPT_BID',
      'Assignment',
      load.id,
      `Accepted bid from ${winningBid.ownerName} for PKR ${winningBid.bidAmount.toLocaleString()}. Funds locked in Escrow. Waiting for owner fleet dispatch.`
    );
    addNotification(
      winningBid.ownerId,
      `🎉 بولی منظور! فلیٹ سے گاڑی اور ڈرائیور الاٹ کریں`,
      `Shipper accepted your quote of PKR ${winningBid.bidAmount.toLocaleString()} for Load ${load.loadNumber}. Please allocate vehicle and driver from your fleet.`,
      'assignment'
    );
    playVoiceHelp(
      language === 'ur'
        ? 'بولی منظور ہو چکی ہے۔ ٹرانسپورٹر اب اپنے فلیٹ سے گاڑی اور ڈرائیور الاٹ کرے گا۔'
        : 'Bid accepted. Carrier will now assign vehicle and driver from fleet.'
    );
  };

  // 3.1 Owner assigns Vehicle & Driver from fleet to Accepted Load
  const assignFleetToAcceptedLoad = (loadId: string, vehicleId: string, driverId: string) => {
    const load = loads.find((l) => l.id === loadId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    const driver = drivers.find((d) => d.id === driverId);
    if (!load || !vehicle || !driver) return;

    const winningBid = bids.find((b) => b.id === load.winningBidId) || bids.find((b) => b.loadId === load.id && b.status === 'accepted') || {
      bidAmount: load.offeredPrice,
      ownerId: vehicle.ownerId,
      ownerName: vehicle.ownerName
    };

    const tripId = `trp_${Date.now()}`;
    const tripNumber = `TRP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const eBiltyNumber = `EB-PK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const commission = (winningBid.bidAmount || load.offeredPrice) * 0.05;
    const netPayout = (winningBid.bidAmount || load.offeredPrice) - commission;
    const waypoints = generateRouteWaypoints(load.originCoords, load.destinationCoords, 24);

    const newTrip: Trip = {
      id: tripId,
      tripNumber,
      loadId: load.id,
      loadNumber: load.loadNumber,
      assignmentId: `asg_${Date.now()}`,
      shipperId: load.shipperId,
      shipperName: load.shipperName,
      shipperPhone: load.shipperPhone,
      ownerId: vehicle.ownerId,
      ownerName: vehicle.ownerName,
      ownerPhone: '+92 321 9840291',
      driverId: driver.id,
      driverName: driver.name,
      driverPhone: driver.phone,
      driverAvatar: driver.avatar,
      vehicleId: vehicle.id,
      vehicleRegNumber: vehicle.registrationNumber,
      vehicleType: vehicle.vehicleType,
      vehiclePhoto: vehicle.photo,
      status: 'assigned',
      originCity: load.originCity,
      originCoords: load.originCoords,
      destinationCity: load.destinationCity,
      destinationCoords: load.destinationCoords,
      distanceKm: load.distanceKm,
      currentCoords: load.originCoords,
      currentCityProgress: `${load.originCity} Staging Terminal`,
      progressPercentage: 0,
      currentSpeedKmH: 0,
      lastUpdated: new Date().toISOString(),
      routeWaypoints: waypoints,
      isDeviated: false,
      hasProlongedStop: false,
      eBiltyNumber,
      agreedFreightAmount: winningBid.bidAmount || load.offeredPrice,
      platformCommission: commission,
      netCarrierPayout: netPayout,
      createdAt: new Date().toISOString()
    };

    setTrips((prev) => [newTrip, ...prev]);

    setLoads((prev) =>
      prev.map((l) =>
        l.id === load.id
          ? {
              ...l,
              status: 'assigned',
              assignedVehicleId: vehicle.id,
              assignedDriverId: driver.id,
              activeTripId: tripId,
              eBiltyNumber,
              updatedAt: new Date().toISOString()
            }
          : l
      )
    );

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicle.id
          ? {
              ...v,
              availability: 'reserved',
              currentDriverId: driver.id,
              currentDriverName: driver.name,
              currentDriverPhone: driver.phone
            }
          : v
      )
    );

    setDrivers((prev) =>
      prev.map((d) => (d.id === driver.id ? { ...d, assignedVehicleId: vehicle.id, currentTripId: tripId } : d))
    );

    setPayments((prev) =>
      prev.map((p) => (p.loadNumber === load.loadNumber ? { ...p, tripId } : p))
    );

    addAudit(
      'DISPATCH_LOAD',
      'Trip',
      tripId,
      `Fleet owner dispatched vehicle ${vehicle.registrationNumber} with driver ${driver.name} for Load ${load.loadNumber}`
    );
    addNotification(
      driver.id,
      `نیا ٹرپ الاٹ: ${load.originCity} تا ${load.destinationCity}`,
      `You are assigned to trip ${tripNumber} with vehicle ${vehicle.registrationNumber}. Please proceed to ${load.originCity} pickup.`,
      'trip'
    );
    addNotification(
      load.shipperId,
      `گاڑی اور ڈرائیور روانہ!`,
      `Carrier assigned vehicle ${vehicle.registrationNumber} (${vehicle.vehicleType}) and driver ${driver.name}.`,
      'assignment'
    );
    playVoiceHelp(
      language === 'ur'
        ? `گاڑی ${vehicle.registrationNumber} اور ڈرائیور ${driver.name} کو ٹرپ الاٹ کر دیا گیا ہے۔`
        : `Dispatched vehicle ${vehicle.registrationNumber} with driver ${driver.name}.`
    );
  };

  // 4. Trip Lifecycle
  const arriveAtPickup = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, status: 'arrived_pickup', pickupArrivedAt: new Date().toISOString(), lastUpdated: new Date().toISOString() }
          : t
      )
    );
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setLoads((prev) => prev.map((l) => (l.id === trip.loadId ? { ...l, status: 'arrived_pickup' } : l)));
      addAudit('ARRIVED_AT_PICKUP', 'Trip', tripId, `Driver ${trip.driverName} arrived at pickup in ${trip.originCity}`);
      addNotification(trip.shipperId, `Driver Arrived at Pickup`, `${trip.driverName} (${trip.vehicleRegNumber}) has reached ${trip.originCity} loading area.`, 'trip');
    }
  };

  const submitPickupProof = (tripId: string, proof: TripProof) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    const load = loads.find((l) => l.id === trip.loadId);

    const newEbilty: EBilty = {
      biltyNumber: trip.eBiltyNumber,
      tripId: trip.id,
      tripNumber: trip.tripNumber,
      loadNumber: trip.loadNumber,
      issueDate: new Date().toISOString(),
      shipper: {
        name: trip.shipperName,
        company: trip.shipperName,
        phone: trip.shipperPhone,
        pickupAddress: load?.originAddress || `${trip.originCity} Goods Terminal`,
        city: trip.originCity
      },
      consignee: {
        name: 'Authorized Receiving Officer',
        company: `${load?.destinationCity} Consignment Hub`,
        phone: '+92 300 0000000',
        deliveryAddress: load?.destinationAddress || `${trip.destinationCity} Logistics Center`,
        city: trip.destinationCity
      },
      carrier: {
        ownerName: trip.ownerName,
        company: trip.ownerName,
        phone: trip.ownerPhone,
        vehicleReg: trip.vehicleRegNumber,
        vehicleType: trip.vehicleType,
        driverName: trip.driverName,
        driverLicense: 'HTV-PK-VERIFIED',
        driverPhone: trip.driverPhone
      },
      cargo: {
        category: load?.cargoCategory || 'General Cargo',
        description: load?.cargoDescription || 'Commercial goods and packaging',
        weightTons: load?.weightTons || 15,
        packagesCount: load?.quantityUnits || 100,
        packagingType: load?.packagingType || 'Pallets',
        declaredValuePkr: (trip.agreedFreightAmount * 15),
        specialCare: [
          load?.isFragile ? 'Fragile Cargo Handle With Care' : 'Standard Cargo',
          load?.requiresTarpaulin ? 'Double Layer Tarpaulin Fastened' : 'Covered Body',
          `Security Seal #${Math.floor(10000 + Math.random() * 90000)}`
        ]
      },
      financials: {
        freightAmount: trip.agreedFreightAmount,
        taxAmount: 0,
        totalAmount: trip.agreedFreightAmount,
        paymentMode: 'Advance Escrow',
        isPaid: true
      },
      verificationCode: `VRF-${Math.floor(10000 + Math.random() * 90000)}-EBPK`,
      qrCodeData: `https://ebroker.pk/verify/${trip.eBiltyNumber}`
    };

    setEbiltys((prev) => ({ ...prev, [trip.eBiltyNumber]: newEbilty }));

    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              status: 'loaded',
              pickupProof: proof,
              loadedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            }
          : t
      )
    );

    setLoads((prev) => prev.map((l) => (l.id === trip.loadId ? { ...l, status: 'loaded' } : l)));
    setVehicles((prev) => prev.map((v) => (v.id === trip.vehicleId ? { ...v, availability: 'on_trip' } : v)));

    addAudit('UPLOAD_PICKUP_PROOF', 'Trip', tripId, `Cargo loaded and verified. Official E-Bilty generated: ${trip.eBiltyNumber}`);
    addNotification(trip.shipperId, `Pickup Confirmed & E-Bilty Ready`, `Proof photos uploaded. E-Bilty ${trip.eBiltyNumber} is ready to view.`, 'trip');
  };

  const startTransit = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              status: 'in_transit',
              startedAt: new Date().toISOString(),
              currentSpeedKmH: 58,
              progressPercentage: 5,
              lastUpdated: new Date().toISOString()
            }
          : t
      )
    );
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setLoads((prev) => prev.map((l) => (l.id === trip.loadId ? { ...l, status: 'in_transit' } : l)));
      addAudit('START_TRANSIT', 'Trip', tripId, `Shipment departed ${trip.originCity} en route to ${trip.destinationCity}`);
      addNotification(trip.shipperId, `Trip In Transit`, `Driver ${trip.driverName} is on the way to ${trip.destinationCity}. Live GPS tracking active.`, 'trip');
    }
  };

  const simulateGpsProgress = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId || t.status !== 'in_transit') return t;
        const nextProgress = Math.min(t.progressPercentage + 15, 95);
        const waypointIndex = Math.floor((nextProgress / 100) * (t.routeWaypoints.length - 1));
        const nextCoords = t.routeWaypoints[waypointIndex] || t.currentCoords;

        return {
          ...t,
          progressPercentage: nextProgress,
          currentCoords: nextCoords,
          currentCityProgress: `Highway Corridor Marker (${nextProgress}% complete)`,
          currentSpeedKmH: Math.floor(55 + Math.random() * 20),
          lastUpdated: new Date().toISOString()
        };
      })
    );
  };

  const arriveAtDestination = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              status: 'arrived_destination',
              destinationArrivedAt: new Date().toISOString(),
              progressPercentage: 100,
              currentCoords: t.destinationCoords,
              currentCityProgress: `${t.destinationCity} Destination Gate`,
              currentSpeedKmH: 0,
              lastUpdated: new Date().toISOString()
            }
          : t
      )
    );
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setLoads((prev) => prev.map((l) => (l.id === trip.loadId ? { ...l, status: 'arrived_destination' } : l)));
      addAudit('ARRIVED_AT_DESTINATION', 'Trip', tripId, `Driver ${trip.driverName} reached destination in ${trip.destinationCity}`);
      addNotification(trip.shipperId, `Driver Arrived at Destination`, `Truck is at ${trip.destinationCity} warehouse. Ready for offloading.`, 'trip');
    }
  };

  const submitDeliveryProof = (tripId: string, proof: TripProof) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              status: 'delivered',
              deliveryProof: proof,
              deliveredAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            }
          : t
      )
    );
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setLoads((prev) => prev.map((l) => (l.id === trip.loadId ? { ...l, status: 'delivered' } : l)));
      addAudit('UPLOAD_DELIVERY_PROOF', 'Trip', tripId, `Delivery proof & receiver confirmation uploaded by driver ${trip.driverName}`);
      addNotification(trip.shipperId, `Shipment Delivered - Confirm Payment`, `Please confirm delivery receipt to release escrow settlement of PKR ${trip.agreedFreightAmount.toLocaleString()}.`, 'payment');
    }
  };

  const confirmDeliveryAndSettle = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (!trip) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.tripId === tripId
          ? {
              ...p,
              status: 'released_to_wallet',
              settledAt: new Date().toISOString()
            }
          : p
      )
    );

    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              status: 'completed',
              completedAt: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            }
          : t
      )
    );

    setLoads((prev) => prev.map((l) => (l.id === trip.loadId ? { ...l, status: 'completed' } : l)));
    setVehicles((prev) => prev.map((v) => (v.id === trip.vehicleId ? { ...v, availability: 'available' } : v)));

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === trip.ownerId || u.id === trip.driverId || u.id === trip.shipperId) {
          return { ...u, totalTrips: u.totalTrips + 1 };
        }
        return u;
      })
    );

    addAudit('SETTLE_PAYMENT', 'Payment', tripId, `Escrow released. Platform commission PKR ${trip.platformCommission.toLocaleString()} retained. Net payout PKR ${trip.netCarrierPayout.toLocaleString()} credited to ${trip.ownerName}`);
    addNotification(trip.ownerId, `Payment Settled: PKR ${trip.netCarrierPayout.toLocaleString()}`, `Trip ${trip.tripNumber} completed. Net payout added to your available wallet balance.`, 'payment');
  };

  const addVehicle = (vehicleData: Partial<Vehicle>): Vehicle => {
    const newVeh: Vehicle = {
      id: `veh_${Date.now()}`,
      registrationNumber: vehicleData.registrationNumber || `LHR-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleType: vehicleData.vehicleType || '10-Wheeler Rigid',
      bodyType: vehicleData.bodyType || 'Open Body',
      makeModel: vehicleData.makeModel || 'Hino Prime Mover',
      year: vehicleData.year || 2023,
      chassisNumber: vehicleData.chassisNumber || `CH-${Date.now().toString().slice(-6)}`,
      engineNumber: vehicleData.engineNumber || `ENG-${Date.now().toString().slice(-6)}`,
      tyreCount: vehicleData.tyreCount || 10,
      capacityTons: vehicleData.capacityTons || 20,
      dimensionsFeet: vehicleData.dimensionsFeet || { length: 24, width: 8, height: 8 },
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      availability: 'available',
      rating: 5.0,
      totalTrips: 0,
      onTimePercentage: 100,
      odometerKm: vehicleData.odometerKm || 12000,
      fuelType: vehicleData.fuelType || 'Diesel',
      documents: {
        registrationDoc: 'REG-VERIFIED.pdf',
        fitnessCertExpiry: '2028-12-31',
        routePermitExpiry: '2028-12-31',
        insuranceExpiry: '2028-12-31',
        tokenTaxExpiry: '2028-12-31',
        trackerId: `TRK-PK-${Date.now().toString().slice(-5)}`,
        isVerified: true
      },
      documentRecords: [
        {
          documentType: 'Route Permit',
          documentTypeUr: 'روٹ پرمٹ',
          issuingAuthority: 'PTA Punjab',
          documentNumber: `PTA-${Date.now().toString().slice(-5)}`,
          issueDate: '2025-01-01',
          expiryDate: '2028-12-31',
          status: 'valid',
          costPkr: 15000
        }
      ],
      expenses: [],
      maintenanceLogs: [],
      photo: vehicleData.photo || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80',
      currentLocation: {
        city: currentUser.companyName ? 'Depot Hub' : 'Lahore',
        lat: 31.5204,
        lng: 74.3587
      }
    };
    setVehicles((prev) => [newVeh, ...prev]);
    addAudit('ADD_VEHICLE', 'Load', newVeh.id, `Added vehicle ${newVeh.registrationNumber} (${newVeh.vehicleType}) to fleet`);
    return newVeh;
  };

  const updateVehicleAvailability = (vehicleId: string, availability: Vehicle['availability']) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? { ...v, availability } : v)));
  };

  const addDriver = (driverData: Partial<DriverProfile>): DriverProfile => {
    const newDriver: DriverProfile = {
      id: `usr_driver_${Date.now()}`,
      name: driverData.name || 'New Driver',
      phone: driverData.phone || '+92 300 1234567',
      email: driverData.email || 'driver@ebroker.pk',
      role: 'driver',
      avatar: driverData.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
      kycStatus: 'verified',
      cnic: driverData.cnic || '35202-1234567-1',
      rating: 5.0,
      totalTrips: 0,
      createdAt: new Date().toISOString(),
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      licenseNumber: driverData.licenseNumber || 'LHR-HTV-2023-9999',
      licenseCategory: driverData.licenseCategory || 'HTV',
      licenseExpiry: driverData.licenseExpiry || '2029-12-31',
      emergencyContact: driverData.emergencyContact || '+92 300 0000000',
      onTimeRate: 100
    };
    setDrivers((prev) => [newDriver, ...prev]);
    setUsers((prev) => [newDriver, ...prev]);
    addAudit('ADD_DRIVER', 'Load', newDriver.id, `Registered driver ${newDriver.name} (${newDriver.licenseCategory} License)`);
    return newDriver;
  };

  const assignDriverToVehicle = (driverId: string, vehicleId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!driver || !vehicle) return;

    // 1. Update vehicle state
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            currentDriverId: driver.id,
            currentDriverName: driver.name,
            currentDriverPhone: driver.phone
          };
        }
        // If this driver was previously on another vehicle, clear that vehicle
        if (v.currentDriverId === driverId) {
          return {
            ...v,
            currentDriverId: undefined,
            currentDriverName: undefined,
            currentDriverPhone: undefined
          };
        }
        return v;
      })
    );

    // 2. Update drivers state
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driverId) {
          return {
            ...d,
            assignedVehicleId: vehicle.id
          };
        }
        // If another driver was previously assigned to this vehicle, unassign them
        if (d.assignedVehicleId === vehicleId && d.id !== driverId) {
          return {
            ...d,
            assignedVehicleId: undefined
          };
        }
        return d;
      })
    );

    addNotification(
      driver.id,
      'Vehicle Assignment Updated',
      `You are now assigned as primary driver to ${vehicle.registrationNumber} (${vehicle.vehicleType}).`,
      'assignment'
    );
    addAudit(
      'UPDATE_DOCS',
      'Load',
      vehicle.id,
      `Assigned driver ${driver.name} to vehicle ${vehicle.registrationNumber}`
    );
    playVoiceHelp(
      language === 'ur'
        ? `ڈرائیور ${driver.name} کو گاڑی ${vehicle.registrationNumber} الاٹ کر دی گئی ہے۔`
        : `Assigned driver ${driver.name} to ${vehicle.registrationNumber}.`
    );
  };

  const unassignDriverFromVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    const currentDriverId = vehicle.currentDriverId;

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? {
              ...v,
              currentDriverId: undefined,
              currentDriverName: undefined,
              currentDriverPhone: undefined
            }
          : v
      )
    );

    if (currentDriverId) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === currentDriverId ? { ...d, assignedVehicleId: undefined } : d))
      );
    }

    playVoiceHelp(
      language === 'ur'
        ? `گاڑی ${vehicle.registrationNumber} سے ڈرائیور کو الگ کر دیا گیا ہے۔`
        : `Unassigned driver from ${vehicle.registrationNumber}.`
    );
  };

  const assignDriverToTrip = (tripId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              driverId: driver.id,
              driverName: driver.name,
              driverPhone: driver.phone,
              driverAvatar: driver.avatar,
              status: 'driver_assigned'
            }
          : t
      )
    );
    addNotification(driver.id, 'New Trip Assigned', `You are assigned to trip ${tripId}. Check details in driver view.`, 'trip');
  };

  const cancelLoad = (loadId: string, reason: string) => {
    setLoads((prev) => prev.map((l) => (l.id === loadId ? { ...l, status: 'cancelled' } : l)));
    addAudit('CANCEL_LOAD', 'Load', loadId, `Load cancelled. Reason: ${reason}`);
  };

  const withdrawWalletFunds = (_ownerId: string, amount: number): boolean => {
    addAudit('WITHDRAW_FUNDS', 'Payment', currentUser.id, `Requested wallet withdrawal of PKR ${amount.toLocaleString()}`);
    return true;
  };

  const raiseDispute = (data: { tripId: string; category: Dispute['category']; description: string; evidencePhotos: string[] }) => {
    const trip = trips.find((t) => t.id === data.tripId);
    if (!trip) return;

    const newDispute: Dispute = {
      id: `dsp_${Date.now()}`,
      tripId: data.tripId,
      loadNumber: trip.loadNumber,
      raisedById: currentUser.id,
      raisedByName: currentUser.name,
      raisedByRole: currentUser.role,
      defendantId: currentUser.role === 'shipper' ? trip.ownerId : trip.shipperId,
      defendantName: currentUser.role === 'shipper' ? trip.ownerName : trip.shipperName,
      defendantRole: currentUser.role === 'shipper' ? 'owner' : 'shipper',
      category: data.category,
      description: data.description,
      evidencePhotos: data.evidencePhotos,
      status: 'under_review',
      heldAmount: trip.agreedFreightAmount,
      createdAt: new Date().toISOString()
    };

    setDisputes((prev) => [newDispute, ...prev]);
    setTrips((prev) => prev.map((t) => (t.id === data.tripId ? { ...t, status: 'disputed' } : t)));
    setLoads((prev) => prev.map((l) => (l.id === trip.loadId ? { ...l, status: 'disputed' } : l)));

    addAudit('RAISE_DISPUTE', 'Dispute', newDispute.id, `Dispute opened on Load ${trip.loadNumber} for "${data.category}". Escrow held.`);
    
    const admins = users.filter((u) => u.role === 'admin');
    admins.forEach((a) => {
      addNotification(a.id, `New Dispute: ${trip.loadNumber}`, `${currentUser.name} raised a dispute for ${data.category}`, 'dispute');
    });
  };

  const resolveDispute = (disputeId: string, resolution: string, refundAmount: number) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: 'resolved',
              resolutionDecision: resolution,
              refundAmount,
              resolvedAt: new Date().toISOString()
            }
          : d
      )
    );
    addAudit('RESOLVE_DISPUTE', 'Dispute', disputeId, `Dispute resolved by Admin. Resolution: ${resolution}. Refund: PKR ${refundAmount.toLocaleString()}`);
  };

  const submitRating = (data: { tripId: string; targetId: string; targetName: string; targetType: RatingReview['targetType']; score: number; feedbackFactors: string[]; comment: string }) => {
    addAudit('SUBMIT_RATING', 'Trip', data.tripId, `Rated ${data.targetName} (${data.targetType}) ${data.score}/5 stars. "${data.comment}"`);
    addNotification(data.targetId, `New Rating Received (${data.score}/5 ⭐)`, `${currentUser.name} left a review: "${data.comment}"`, 'system');
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
  };

  const verifyKYC = (userId: string, approved: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: approved, kycStatus: approved ? 'verified' : 'rejected' } : u))
    );
    addAudit('KYC_VERIFICATION', 'KYC', userId, `User ${userId} KYC ${approved ? 'Approved' : 'Rejected'}`);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        switchDemoAccount,
        currentUser,
        currentRole,
        setCurrentRole,
        setCurrentUserById,
        allUsers: users,
        language,
        setLanguage,
        toggleLanguage,
        t,
        playVoiceHelp,
        stopVoice,
        isVoiceMuted,
        toggleVoiceMute,
        theme,
        setTheme,
        toggleTheme,
        loads,
        bids,
        vehicles,
        drivers,
        trips,
        ebiltys,
        payments,
        disputes,
        auditLogs,
        notifications,
        createLoad,
        submitBid,
        acceptBid,
        assignFleetToAcceptedLoad,
        cancelLoad,
        addVehicle,
        updateVehicleAvailability,
        addDriver,
        assignDriverToVehicle,
        unassignDriverFromVehicle,
        assignDriverToTrip,
        arriveAtPickup,
        submitPickupProof,
        startTransit,
        simulateGpsProgress,
        arriveAtDestination,
        submitDeliveryProof,
        confirmDeliveryAndSettle,
        withdrawWalletFunds,
        raiseDispute,
        resolveDispute,
        submitRating,
        markNotificationAsRead,
        verifyKYC
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
