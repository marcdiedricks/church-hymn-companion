import React from 'react';
import { HymnPack } from '../types/hymn';

interface PackStatusCardProps {
  activeLanguage: 'en-ZA' | 'af-ZA';
  pack: HymnPack | null;
  isLoading: boolean;
}

export const PackStatusCard: React.FC<PackStatusCardProps> = ({ activeLanguage, pack, isLoading }) => {
  const isEnglish = activeLanguage === 'en-ZA';
  const recordCount = pack?.hymn_count ?? (isEnglish ? 588 : 315);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <span>📄 Active Local Pack Status</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* English Status */}
        <div className={`p-3 rounded-lg border transition-colors ${
          isEnglish ? 'bg-slate-950 border-amber-500/50' : 'bg-slate-950/50 border-slate-800 opacity-60'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-white">English</span>
            {isEnglish && <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">ACTIVE</span>}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Source: <span className="text-amber-400">en-ZA.hymns.json</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Records: <strong className="text-white">{isLoading ? '...' : recordCount} hymns</strong>
          </div>
        </div>

        {/* Afrikaans Status */}
        <div className={`p-3 rounded-lg border transition-colors ${
          !isEnglish ? 'bg-slate-950 border-amber-500/50' : 'bg-slate-950/50 border-slate-800 opacity-60'
        }`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-white">Afrikaans</span>
            {!isEnglish && <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">ACTIVE</span>}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Source: <span className="text-amber-400">af-ZA.hymns.json</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Records: <strong className="text-white">{isLoading ? '...' : 315} hymns</strong>
          </div>
        </div>
      </div>
    </div>
  );
};