import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  searchQuery,
  setSearchQuery,
}) => {
  const [showNumpad, setShowNumpad] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleNumpadKey = (key: string) => {
    if (key === 'CLEAR') {
      setSearchQuery('');
    } else if (key === 'GO') {
      if (searchQuery.trim()) {
        onSearch(searchQuery);
      }
    } else {
      const updated = searchQuery + key;
      setSearchQuery(updated);
      onSearch(updated);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Search by exact hymn number (e.g. 247) or title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs bg-slate-800 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-lg text-sm transition-colors shadow flex items-center gap-2 shrink-0"
        >
          🔍 FIND HYMN
        </button>

        <button
          type="button"
          onClick={() => setShowNumpad(!showNumpad)}
          className={`px-4 py-3 rounded-lg text-xs font-bold border transition-colors shrink-0 ${
            showNumpad
              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🔢 10-KEY
        </button>
      </form>

      {/* Compact Touch 10-Key Numpad Drawer */}
      {showNumpad && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 max-w-xs mx-auto">
          <div className="flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>TOUCH KEYPAD</span>
            <span className="font-mono text-amber-400 font-bold">
              #{searchQuery || '—'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumpadKey(num)}
                className="bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-lg py-2.5 text-base font-bold text-white transition-colors"
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handleNumpadKey('CLEAR')}
              className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 rounded-lg py-2.5 text-xs font-bold transition-colors"
            >
              CLEAR
            </button>

            <button
              type="button"
              onClick={() => handleNumpadKey('0')}
              className="bg-slate-900 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 border border-slate-800 rounded-lg py-2.5 text-base font-bold text-white transition-colors"
            >
              0
            </button>

            <button
              type="button"
              onClick={() => handleNumpadKey('GO')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 rounded-lg py-2.5 text-xs font-bold transition-colors"
            >
              GO ↵
            </button>
          </div>
        </div>
      )}
    </div>
  );
};