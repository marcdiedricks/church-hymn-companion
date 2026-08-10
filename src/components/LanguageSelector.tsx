import React from 'react';
import { Globe, Lock } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: 'en-ZA' | 'af-ZA';
  onSelectLanguage: (lang: 'en-ZA' | 'af-ZA') => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex items-center gap-2 mb-3 text-slate-300 font-semibold text-sm">
        <Globe className="w-4 h-4 text-amber-400" />
        <span>Language Pack Selector</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* English */}
        <button
          type="button"
          onClick={() => onSelectLanguage('en-ZA')}
          className={`min-h-[52px] p-3 rounded-xl border text-left font-semibold text-sm transition-all flex flex-col justify-center cursor-pointer ${
            selectedLanguage === 'en-ZA'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20 font-bold'
              : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <span>English</span>
          <span
            className={`text-[11px] font-normal ${
              selectedLanguage === 'en-ZA' ? 'text-slate-900 font-medium' : 'text-slate-400'
            }`}
          >
            588 Records
          </span>
        </button>

        {/* Afrikaans */}
        <button
          type="button"
          onClick={() => onSelectLanguage('af-ZA')}
          className={`min-h-[52px] p-3 rounded-xl border text-left font-semibold text-sm transition-all flex flex-col justify-center cursor-pointer ${
            selectedLanguage === 'af-ZA'
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg shadow-amber-400/20 font-bold'
              : 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <span>Afrikaans</span>
          <span
            className={`text-[11px] font-normal ${
              selectedLanguage === 'af-ZA' ? 'text-slate-900 font-medium' : 'text-slate-400'
            }`}
          >
            315 Records
          </span>
        </button>

        {/* isiXhosa (Disabled) */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="min-h-[52px] p-3 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-500 text-left font-medium text-sm cursor-not-allowed opacity-60 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="flex items-center justify-between w-full">
            <span>isiXhosa</span>
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <span className="text-[10px] text-slate-600 italic">Coming later</span>
        </button>

        {/* isiZulu (Disabled) */}
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="min-h-[52px] p-3 rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-500 text-left font-medium text-sm cursor-not-allowed opacity-60 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="flex items-center justify-between w-full">
            <span>isiZulu</span>
            <Lock className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <span className="text-[10px] text-slate-600 italic">Coming later</span>
        </button>
      </div>
    </div>
  );
};
