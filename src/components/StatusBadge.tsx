import React from 'react';
import type { LoadStatus, VehicleAvailability } from '../types';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Truck,
  AlertTriangle,
  FileCheck,
  MapPin,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

interface StatusBadgeProps {
  status: LoadStatus | VehicleAvailability | string;
  size?: 'sm' | 'md' | 'lg';
  isUrdu?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', isUrdu: propIsUrdu }) => {
  const { language } = useApp();
  const isUrdu = typeof propIsUrdu === 'boolean' ? propIsUrdu : language === 'ur';

  const getBadgeConfig = () => {
    switch (status) {
      case 'draft':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
          en: 'Draft',
          ur: 'مسودہ'
        };
      case 'published':
      case 'bidding_open':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          icon: Clock,
          en: 'Receiving Rates',
          ur: 'ریٹ جاری ہیں'
        };
      case 'bidding_closed':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
          en: 'Bidding Closed',
          ur: 'بولی بند'
        };
      case 'accepted_pending_assignment':
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300 animate-pulse',
          icon: Truck,
          en: 'Bid Accepted • Assign Fleet',
          ur: 'بولی منظور • گاڑی الاٹ کریں'
        };
      case 'assigned':
      case 'driver_assigned':
        return {
          bg: 'bg-blue-50 text-blue-900 border-blue-200',
          icon: ShieldCheck,
          en: 'Truck Booked',
          ur: 'ٹرک بک شدہ'
        };
      case 'en_route_pickup':
        return {
          bg: 'bg-cyan-50 text-cyan-900 border-cyan-200',
          icon: MapPin,
          en: 'En Route to Pickup',
          ur: 'پک اپ کے راستے میں'
        };
      case 'arrived_pickup':
      case 'loading':
        return {
          bg: 'bg-purple-50 text-purple-900 border-purple-200',
          icon: PackageCheck,
          en: 'Loading Cargo',
          ur: 'مال لوڈ ہو رہا ہے'
        };
      case 'loaded':
        return {
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          icon: FileCheck,
          en: 'E-Bilty Issued',
          ur: 'ای-بلٹی جاری'
        };
      case 'in_transit':
        return {
          bg: 'bg-blue-50 text-blue-950 border-blue-300 font-bold',
          icon: Truck,
          en: 'On the Way (راستے میں)',
          ur: 'راستے میں ہے'
        };
      case 'arrived_destination':
      case 'unloading':
        return {
          bg: 'bg-teal-50 text-teal-900 border-teal-200',
          icon: MapPin,
          en: 'Arrived at Destination',
          ur: 'منزل پر موجود'
        };
      case 'delivered':
      case 'payment_pending':
      case 'settled':
      case 'completed':
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          icon: CheckCircle2,
          en: 'Delivered (پہنچ گیا)',
          ur: 'سامان پہنچ گیا'
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: AlertTriangle,
          en: 'Cancelled',
          ur: 'منسوخ'
        };
      case 'disputed':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300 font-bold',
          icon: AlertTriangle,
          en: 'Disputed',
          ur: 'تنازع زیرِ سماعت'
        };
      // Vehicle Availability Statuses
      case 'available':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2,
          en: 'Available (تیار)',
          ur: 'تیار'
        };
      case 'on_trip':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: Truck,
          en: 'On Trip (سفر پر)',
          ur: 'سفر پر ہے'
        };
      case 'under_maintenance':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: AlertTriangle,
          en: 'Workshop (ورکشاپ)',
          ur: 'ورکشاپ'
        };
      case 'documents_expired':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: AlertTriangle,
          en: 'Docs Expired',
          ur: 'کاغذات ختم'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: Clock,
          en: String(status).toUpperCase(),
          ur: String(status)
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-semibold ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{isUrdu ? config.ur : config.en}</span>
    </span>
  );
};
