import React, { useState } from 'react';
import { SourceValidationBadge } from './SourceValidationBadge';
import { PackStatusCard } from './PackStatusCard';
import { LanguageSelector } from './LanguageSelector';
import { HymnPack } from '../types/hymn';

interface HealthDrawerProps {
  isValidated: boolean;
  activeLanguage: 'en-ZA' | 'af-ZA';
  currentPack: HymnPack | null;
  isLoading: boolean;
  onSelectLanguage: (lang: 'en-ZA' | 'af-ZA') => void;
}

export const HealthDrawer: React.FC<HealthDrawerProps> = ({
  isValidated,
  activeLanguage,
  currentPack,
  isLoading,
  onSelectLanguage,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all">
      {/* Collapsible Header Bar */}
      <div className="p-3 bg-slate-900/80 flex items-center justify-between gap-3 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <SourceValidationBadge isValidated={isValidated} />
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Pack: <strong className="text-amber-400">{activeLanguage}</strong> ({isLoading ? '...' : currentPack?.hymn_count ?? (activeLanguage === 'en-ZA' ? 588 : 315)} hymns)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isOpen ? '▲ Hide Status & Language' : '▼ Pack Status & Language'}</span>
        </button>
      </div>

      {/* Expandable Drawer Body */}
      {isOpen && (
        <div className="p-4 bg-slate-950/50 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/40">
          <PackStatusCard
            activeLanguage={activeLanguage}
            pack={currentPack}
            isLoading={isLoading}
          />
          <LanguageSelector
            activeLanguage={activeLanguage}
            onSelectLanguage={onSelectLanguage}
          />
        </div>
      )}
    </div>
  );
};