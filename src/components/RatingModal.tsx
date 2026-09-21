import React, { useState } from 'react';
import { Star, X, Check } from 'lucide-react';
import type { RatingReview } from '../types';

interface RatingModalProps {
  tripId: string;
  targetId: string;
  targetName: string;
  targetType: RatingReview['targetType'];
  onClose: () => void;
  onSubmit: (data: {
    tripId: string;
    targetId: string;
    targetName: string;
    targetType: RatingReview['targetType'];
    score: number;
    feedbackFactors: string[];
    comment: string;
  }) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  tripId,
  targetId,
  targetName,
  targetType,
  onClose,
  onSubmit
}) => {
  const [score, setScore] = useState(5);
  const [selectedFactors, setSelectedFactors] = useState<string[]>(['Punctuality', 'Careful Handling']);
  const [comment, setComment] = useState('');

  const factorOptions: Record<RatingReview['targetType'], string[]> = {
    owner: ['Punctual Dispatch', 'Vehicle Quality', 'Transparent Communication', 'Fair Pricing', 'Professionalism'],
    vehicle: ['Cleanliness', 'Suspension & Condition', 'Tarpaulin Integrity', 'Capacity Accuracy', 'GPS Tracking'],
    shipper: ['Prompt Loading', 'Accurate Cargo Weight', 'Payment Promptness', 'Clear Delivery Instructions', 'Polite Communication'],
    driver: ['Safe Driving', 'Route Compliance', 'Polite Demeanor', 'Timely Status Updates', 'Careful Offloading']
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      tripId,
      targetId,
      targetName,
      targetType,
      score,
      feedbackFactors: selectedFactors,
      comment: comment || 'Smooth and professional transaction.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div>
            <h3 className="text-base font-bold text-white">Rate {targetType === 'vehicle' ? 'Vehicle' : targetName}</h3>
            <p className="text-xs text-slate-400 capitalize">{targetType} Performance Review</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex flex-col items-center justify-center py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= score ? 'fill-amber-400 text-amber-400' : 'text-slate-600 fill-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-400 mt-2">
              {score === 5 && '⭐⭐⭐⭐⭐ Exceptional (5.0)'}
              {score === 4 && '⭐⭐⭐⭐ Very Good (4.0)'}
              {score === 3 && '⭐⭐⭐ Average (3.0)'}
              {score === 2 && '⭐⭐ Below Average (2.0)'}
              {score === 1 && '⭐ Unsatisfactory (1.0)'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Highlights
            </label>
            <div className="flex flex-wrap gap-2">
              {(factorOptions[targetType] || []).map((factor) => {
                const active = selectedFactors.includes(factor);
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => toggleFactor(factor)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    {factor}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Review Comment
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details of your experience..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
