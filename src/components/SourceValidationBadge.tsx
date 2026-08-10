import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SourceValidationBadgeProps {
  isValidated?: boolean;
  loading?: boolean;
}

export const SourceValidationBadge: React.FC<SourceValidationBadgeProps> = ({
  isValidated = true,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 animate-pulse flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
        <span>Running Source Acceptance Tests...</span>
      </div>
    );
  }

  if (!isValidated) return null;

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 sm:p-4 shadow-xl space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Source Integrity Verified</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Verified Local Data Packs
        </span>
      </div>
    </div>
  );
};
