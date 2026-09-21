import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  titleEn: string;
  titleUr?: string;
  descriptionEn: string;
  descriptionUr?: string;
  actionTextEn?: string;
  actionTextUr?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  isUrdu?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  titleEn,
  titleUr,
  descriptionEn,
  descriptionUr,
  actionTextEn,
  actionTextUr,
  onAction,
  icon,
  isUrdu = false
}) => {
  return (
    <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col items-center justify-center max-w-md mx-auto my-4 space-y-3">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        {icon || <PackageOpen className="w-8 h-8 stroke-[1.5]" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
          {isUrdu && titleUr ? titleUr : titleEn}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          {isUrdu && descriptionUr ? descriptionUr : descriptionEn}
        </p>
      </div>

      {actionTextEn && onAction && (
        <div className="pt-2">
          <Button onClick={onAction} variant="primary" size="sm">
            {isUrdu && actionTextUr ? actionTextUr : actionTextEn}
          </Button>
        </div>
      )}
    </div>
  );
};
