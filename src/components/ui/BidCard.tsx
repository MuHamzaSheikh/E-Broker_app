import React from 'react';
import type { Bid } from '../../types';
import {
  Trailer22WheelerIcon,
  VerifiedTransporterBadge
} from '../icons/TransportIcons';
import { Star, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export interface BidCardProps {
  bid: Bid;
  onAccept: () => void;
  isUrdu?: boolean;
  isAccepted?: boolean;
}

export const BidCard: React.FC<BidCardProps> = ({
  bid,
  onAccept,
  isUrdu = false,
  isAccepted = false
}) => {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold shrink-0">
          <Trailer22WheelerIcon className="w-7 h-7 text-blue-400" />
        </div>

        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="heading-card text-slate-900 dark:text-white text-sm sm:text-base">{bid.ownerName}</h4>
            <VerifiedTransporterBadge className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {bid.ownerRating}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span>{bid.vehicleType}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {bid.estimatedPickupHours} {isUrdu ? 'گھنٹے میں پہنچ' : 'hrs ETA'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
        <div className="text-left sm:text-right">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-medium">
            {isUrdu ? 'پیش کردہ ریٹ:' : 'Quoted Rate:'}
          </span>
          <span className="metric-medium text-slate-900 dark:text-white">
            PKR {bid.bidAmount.toLocaleString()}
          </span>
        </div>

        {isAccepted || bid.status === 'accepted' ? (
          <span className="px-3.5 py-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isUrdu ? 'منتخب شدہ' : 'Accepted'}</span>
          </span>
        ) : (
          <Button
            onClick={onAccept}
            variant="primary"
            size="sm"
          >
            {isUrdu ? 'ٹرانسپورٹر منتخب کریں' : 'Choose Transporter'}
          </Button>
        )}
      </div>
    </div>
  );
};
