import React from 'react';
import type { Load } from '../../types';
import { StatusBadge } from '../StatusBadge';
import {
  Trailer22WheelerIcon,
  TenWheelerIcon,
  MazdaTruckIcon,
  ShehzorePickupIcon
} from '../icons/TransportIcons';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface LoadCardProps {
  load: Load;
  actionTextEn?: string;
  actionTextUr?: string;
  onAction: () => void;
  isUrdu?: boolean;
  bidsCount?: number;
  isSelected?: boolean;
}

export const LoadCard: React.FC<LoadCardProps> = ({
  load,
  actionTextEn = 'View Load',
  actionTextUr = 'لوڈ دیکھیں',
  onAction,
  isUrdu = false,
  bidsCount,
  isSelected = false
}) => {
  const VehicleIcon =
    load.requiredVehicleType === '22-Wheeler Trailer'
      ? Trailer22WheelerIcon
      : load.requiredVehicleType === '10-Wheeler Rigid'
      ? TenWheelerIcon
      : load.requiredVehicleType === 'Mazda / Light Truck'
      ? MazdaTruckIcon
      : ShehzorePickupIcon;

  return (
    <div
      className={`app-card space-y-3.5 flex flex-col justify-between transition-all duration-150 ${
        isSelected ? 'border-2 border-blue-600 dark:border-blue-500 ring-4 ring-blue-50 dark:ring-blue-950/40' : ''
      }`}
    >
      <div>
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-micro text-slate-400 dark:text-slate-400 font-mono">{load.loadNumber}</span>
          <StatusBadge status={load.status} size="sm" isUrdu={isUrdu} />
        </div>

        {/* Route landmark */}
        <div className="mt-1.5 flex items-center gap-2">
          <h3 className="heading-card text-slate-900 dark:text-white text-base sm:text-lg">
            {load.originCity} <span className="text-blue-600 dark:text-blue-400">&rarr;</span> {load.destinationCity}
          </h3>
        </div>

        {/* Cargo & Specs */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
          <VehicleIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <span>{load.requiredVehicleType}</span>
          <span>&bull;</span>
          <span className="font-bold">{load.weightTons} Tons</span>
          <span>&bull;</span>
          <span className="truncate">{load.cargoCategory}</span>
        </div>

        {load.specialInstructions && (
          <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1.5 truncate">
            {load.specialInstructions}
          </p>
        )}
      </div>

      {/* Pricing & CTA */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
            {isUrdu ? 'بھاڑا / کرایہ:' : 'Offered Rate:'}
          </span>
          <div className="metric-small text-blue-600 dark:text-blue-400">
            PKR {load.offeredPrice.toLocaleString()}
          </div>
          {typeof bidsCount === 'number' && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {bidsCount} {isUrdu ? 'ریٹ موصول' : 'quotes'}
            </span>
          )}
        </div>

        <Button
          onClick={onAction}
          variant="primary"
          size="sm"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {isUrdu ? actionTextUr : actionTextEn}
        </Button>
      </div>
    </div>
  );
};
