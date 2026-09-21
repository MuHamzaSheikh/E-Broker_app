import React from 'react';
import type { TripProof } from '../types';
import { X, Camera, Clock, MapPin, ShieldCheck } from 'lucide-react';

interface ProofGalleryModalProps {
  proof: TripProof | null;
  title: string;
  onClose: () => void;
}

export const ProofGalleryModal: React.FC<ProofGalleryModalProps> = ({ proof, title, onClose }) => {
  if (!proof) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">Timestamped & Geotagged Verification Proof</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Recorded Time
              </div>
              <div className="text-xs font-bold text-white mt-1">
                {new Date(proof.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
              <div className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" /> GPS Tag
              </div>
              <div className="text-xs font-bold text-white mt-1 truncate">
                {proof.locationName || `${proof.coords[0].toFixed(3)}, ${proof.coords[1].toFixed(3)}`}
              </div>
            </div>

            {proof.odometerKm && (
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Odometer</div>
                <div className="text-xs font-bold text-amber-400 mt-1">{proof.odometerKm.toLocaleString()} KM</div>
              </div>
            )}
          </div>

          {/* Cargo Photos */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-400" /> Loaded Cargo Photos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {proof.cargoPhotos.map((photo, idx) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 aspect-video">
                  <img
                    src={photo}
                    alt={`Cargo proof ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 backdrop-blur-md rounded text-[10px] font-mono text-emerald-400 border border-slate-700">
                    Photo #{idx + 1} &bull; Geotagged
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Container Security Seal Photo */}
          {proof.sealPhoto && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Container Security Seal
              </h4>
              <div className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 max-w-sm aspect-video">
                <img src={proof.sealPhoto} alt="Security seal" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Receiver Signature or Notes */}
          {proof.receiverSignatureUrl && (
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700">
              <div className="text-xs font-bold text-slate-300 mb-2">Receiver Digital Signature</div>
              <div className="bg-white p-3 rounded-lg flex items-center justify-center">
                <img src={proof.receiverSignatureUrl} alt="Receiver signature" className="h-16 object-contain" />
              </div>
              {proof.receiverName && (
                <div className="text-xs text-slate-400 mt-2">
                  Signed by: <span className="text-white font-semibold">{proof.receiverName}</span>
                </div>
              )}
            </div>
          )}

          {proof.notes && (
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700 text-xs">
              <span className="font-bold text-slate-300">Driver Remarks: </span>
              <span className="text-slate-400">{proof.notes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
