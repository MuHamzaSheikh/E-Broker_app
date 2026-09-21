import React from 'react';

export interface MilestoneStep {
  key: string;
  labelEn: string;
  labelUr: string;
}

export interface ProgressTrackerProps {
  currentStatus: string;
  isUrdu?: boolean;
}

const DEFAULT_STEPS: MilestoneStep[] = [
  { key: 'assigned', labelEn: '1. Assigned', labelUr: '1. گاڑی الاٹ' },
  { key: 'pickup', labelEn: '2. At Pickup', labelUr: '2. گودام پر' },
  { key: 'in_transit', labelEn: '3. On the Way', labelUr: '3. راستے میں' },
  { key: 'delivered', labelEn: '4. Delivered', labelUr: '4. مال پہنچ گیا' }
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStatus, isUrdu = false }) => {
  const getStepIndex = (status: string) => {
    if (status === 'assigned' || status === 'en_route_pickup') return 0;
    if (status === 'arrived_pickup' || status === 'loading' || status === 'loaded') return 1;
    if (status === 'in_transit' || status === 'arrived_destination' || status === 'unloading') return 2;
    if (status === 'delivered' || status === 'settled' || status === 'completed') return 3;
    return 0;
  };

  const currentIdx = getStepIndex(currentStatus);

  return (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="grid grid-cols-4 gap-1 sm:gap-2">
        {DEFAULT_STEPS.map((step, idx) => {
          const isCompleted = currentIdx > idx;
          const isCurrent = currentIdx === idx;

          return (
            <div key={step.key} className="space-y-1.5 text-center">
              {/* Bar */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`h-2.5 w-full rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 dark:bg-emerald-500'
                      : isCurrent
                      ? 'bg-blue-600 dark:bg-blue-500 ring-2 ring-blue-300 dark:ring-blue-400/40'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              </div>

              {/* Text Label */}
              <div
                className={`text-[11px] sm:text-xs font-bold leading-tight truncate ${
                  isCurrent
                    ? 'text-blue-700 dark:text-blue-400 font-extrabold'
                    : isCompleted
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {isUrdu ? step.labelUr : step.labelEn}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
