import React, { useState } from 'react';
import type { Dispute } from '../types';
import { AlertTriangle, X, Upload, ShieldAlert } from 'lucide-react';

interface DisputeModalProps {
  tripId: string;
  loadNumber: string;
  onClose: () => void;
  onSubmit: (data: { tripId: string; category: Dispute['category']; description: string; evidencePhotos: string[] }) => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({ tripId, loadNumber, onClose, onSubmit }) => {
  const [category, setCategory] = useState<Dispute['category']>('Cargo Damaged');
  const [description, setDescription] = useState('');
  const [evidencePhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({
      tripId,
      category,
      description,
      evidencePhotos
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-950/40 border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Raise Official Dispute</h3>
              <p className="text-xs text-rose-300">Escrow funds will be held pending Admin Arbitration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs">
            <span className="text-slate-400">Target Load: </span>
            <span className="text-white font-bold">{loadNumber}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Dispute Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Dispute['category'])}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="Cargo Damaged">Cargo Damaged / Compromised</option>
              <option value="Cargo Missing / Shortage">Cargo Missing / Package Shortage</option>
              <option value="Severe Delay">Severe Delay & Expired Delivery Deadline</option>
              <option value="Wrong Vehicle Dispatched">Wrong Vehicle / Non-compliant Specs Dispatched</option>
              <option value="Unauthorized Cancellation">Unauthorized Trip Cancellation</option>
              <option value="Driver Misconduct">Driver Misconduct / Unsafe Handling</option>
              <option value="Payment / Escrow Dispute">Payment / Escrow Dispute</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Description & Impact
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details of the issue, damages incurred, package numbers, and requested resolution..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Evidence Attachments (Photos / Damage Reports)
            </label>
            <div className="flex items-center gap-3">
              {evidencePhotos.map((photo, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700">
                  <img src={photo} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
              <button
                type="button"
                className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-700 hover:border-slate-500 flex flex-col items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">Attach</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
